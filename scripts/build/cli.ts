import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildProject } from "./pipeline.js";
import { validateProject } from "./validation.js";
import { analyzeProject } from "../analysis/analyzer.js";
import { writeConflictReports } from "../analysis/report.js";

interface CliArguments {
  command: "build" | "validate";
  targetGameVersion?: string;
  profileId?: string;
}

function parseArguments(argumentsValue: string[]): CliArguments {
  const [command, ...options] = argumentsValue;
  if (command !== "build" && command !== "validate") {
    throw new Error(
      "Usage: npm run <build|validate> -- [--profile PROFILE_ID] [--target-game-version MAJOR.MINOR.PATCH]",
    );
  }

  let targetGameVersion: string | undefined;
  let profileId: string | undefined;
  for (let index = 0; index < options.length; index += 1) {
    const option = options[index];
    let value: string | undefined;
    let optionName: "target-game-version" | "profile";
    if (option === "--target-game-version") {
      optionName = "target-game-version";
      value = options[index + 1];
      index += 1;
    } else if (option.startsWith("--target-game-version=")) {
      optionName = "target-game-version";
      value = option.slice("--target-game-version=".length);
    } else if (option === "--profile") {
      optionName = "profile";
      value = options[index + 1];
      index += 1;
    } else if (option.startsWith("--profile=")) {
      optionName = "profile";
      value = option.slice("--profile=".length);
    } else {
      throw new Error(`Unknown option: ${option}`);
    }
    if (!value) {
      throw new Error(`--${optionName} requires a value`);
    }
    if (optionName === "target-game-version") {
      if (targetGameVersion !== undefined) {
        throw new Error("--target-game-version may only be specified once");
      }
      targetGameVersion = value;
    } else {
      if (profileId !== undefined) {
        throw new Error("--profile may only be specified once");
      }
      profileId = value;
    }
  }

  return { command, targetGameVersion, profileId };
}

async function main(): Promise<void> {
  const { command, targetGameVersion, profileId } = parseArguments(
    process.argv.slice(2),
  );
  const options = { targetGameVersion, profileId };

  const rootDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
  );
  if (command === "validate") {
    const configuration = await validateProject(rootDirectory, options);
    console.log(
      `Validated profile ${configuration.profile.id} with ${configuration.packages.length} selected mod(s) for EU5 ${configuration.build.targetGameVersion}.`,
    );
    return;
  }

  const configuration = await validateProject(rootDirectory, options);
  const analysis = await analyzeProject(configuration);
  await writeConflictReports(rootDirectory, analysis);

  const outputDirectory = await buildProject(rootDirectory, options);
  console.log(
    `Built profile ${configuration.profile.id} at ${path.relative(rootDirectory, outputDirectory)} for EU5 ${configuration.profile.targetGameVersion}.`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
