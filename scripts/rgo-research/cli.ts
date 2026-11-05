import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JsonHttpClient } from "./api.js";
import {
  parseLocationInput,
  parseResolutionFile,
  readFruitReviewLocations,
} from "./inventory.js";
import { loadRgoGoodsCatalog } from "./crops.js";
import { writeResearchReports, writeResolutionReports } from "./report.js";
import { resolveLocations } from "./wikidata.js";
import { researchResolvedLocations } from "./wikipedia.js";
import { addEu5Provinces, readEu5ProvinceMap } from "./provinces.js";

const defaultResolution = "reports/rgo-research/pilot-resolution.json";
const defaultResearch = "reports/rgo-research/pilot-research.json";
const defaultInventory =
  "integration/decisions/RGO-Harmony-Expanded-Inventory.md";
const defaultGamePath =
  process.env.EU5_GAME_PATH ??
  "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Europa Universalis V\\game";

function usage(): string {
  return [
    "Usage:",
    "  npm run rgo:research -- resolve [--input locations.json] [--output report.json] [--game-path GAME_DIR]",
    "  npm run rgo:research -- research [--resolution report.json] [--output report.json] [--game-path GAME_DIR]",
    "",
    "The default resolve input is the 71 Harmony generic-fruit locations.",
    "Only Wikidata entities classified as geographic locations are included.",
    "EU5 provinces are read from the installed game's map_data/definitions.txt.",
    "Review the resolution JSON and set selectedQid for each confirmed location before research.",
  ].join("\n");
}

function parseOptions(args: string[]): Map<string, string> {
  const options = new Map<string, string>();
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (!argument.startsWith("--")) {
      throw new Error(`Unexpected argument: ${argument}\n${usage()}`);
    }
    const equalsIndex = argument.indexOf("=");
    const name = equalsIndex >= 0 ? argument.slice(0, equalsIndex) : argument;
    const value =
      equalsIndex >= 0 ? argument.slice(equalsIndex + 1) : args[index + 1];
    if (!value || value.startsWith("--") || options.has(name)) {
      throw new Error(
        `Option ${name} requires one value and may be specified once`,
      );
    }
    if (
      !["--input", "--output", "--resolution", "--game-path"].includes(name)
    ) {
      throw new Error(`Unknown option: ${name}\n${usage()}`);
    }
    options.set(name, value);
    if (equalsIndex < 0) {
      index += 1;
    }
  }
  return options;
}

async function main(): Promise<void> {
  const rootDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
  );
  const [command, ...args] = process.argv.slice(2);
  if (!command || !["resolve", "research"].includes(command)) {
    throw new Error(usage());
  }
  const options = parseOptions(args);
  const gamePath = options.get("--game-path") ?? defaultGamePath;
  const provinceMap = await readEu5ProvinceMap(
    path.join(gamePath, "in_game", "map_data", "definitions.txt"),
  );
  const cache = new JsonHttpClient({
    cachePath: path.join(
      rootDirectory,
      ".local",
      "rgo-research",
      "api-cache.json",
    ),
  });

  if (command === "resolve") {
    if (options.has("--resolution")) {
      throw new Error("--resolution is only valid for the research command");
    }
    const inputPath = options.get("--input");
    const inputLocations = inputPath
      ? parseLocationInput(
          JSON.parse(
            await readFile(path.resolve(rootDirectory, inputPath), "utf8"),
          ),
        )
      : await readFruitReviewLocations(
          path.join(rootDirectory, defaultInventory),
        );
    const locations = addEu5Provinces(inputLocations, provinceMap);
    const inputSource = inputPath
      ? path.relative(rootDirectory, path.resolve(rootDirectory, inputPath))
      : defaultInventory;
    const resolution = await resolveLocations(locations, cache, inputSource);
    await cache.flush();
    const output = await writeResolutionReports(
      rootDirectory,
      options.get("--output") ?? defaultResolution,
      resolution,
    );
    console.log(`Resolution JSON: ${output.jsonPath}`);
    console.log(`Review report: ${output.markdownPath}`);
    console.log(
      "Confirm candidate QIDs in the JSON before running the research stage.",
    );
    return;
  }

  if (options.has("--input")) {
    throw new Error("--input is only valid for the resolve command");
  }
  const resolutionPath = path.resolve(
    rootDirectory,
    options.get("--resolution") ?? defaultResolution,
  );
  const parsedResolution = parseResolutionFile(
    JSON.parse(await readFile(resolutionPath, "utf8")),
  );
  const enrichedLocations = addEu5Provinces(
    parsedResolution.locations.map((location) => location.location),
    provinceMap,
  );
  const provinceByLocationId = new Map(
    enrichedLocations.map((location) => [location.id, location]),
  );
  const resolution = {
    ...parsedResolution,
    locations: parsedResolution.locations.map((location) => {
      const enrichedLocation = provinceByLocationId.get(location.location.id);
      if (!enrichedLocation) {
        throw new Error(
          `Could not add the EU5 province for ${location.location.id}`,
        );
      }
      return { ...location, location: enrichedLocation };
    }),
  };
  const selectedCount = resolution.locations.filter(
    (location) => location.selectedQid !== null,
  ).length;
  if (selectedCount === 0) {
    throw new Error(
      "No locations have selectedQid values. Review the resolution JSON and confirm at least one place first.",
    );
  }

  const catalog = await loadRgoGoodsCatalog(rootDirectory);
  const research = await researchResolvedLocations(
    resolution,
    cache,
    catalog,
    path.relative(rootDirectory, resolutionPath),
  );
  await cache.flush();
  const output = await writeResearchReports(
    rootDirectory,
    options.get("--output") ?? defaultResearch,
    research,
  );
  console.log(`Research JSON: ${output.jsonPath}`);
  console.log(`Review report: ${output.markdownPath}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
