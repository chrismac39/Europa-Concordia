import { createReadStream } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import { createInterface } from "node:readline";
import path from "node:path";
import type {
  ConflictAnalysis,
  ConflictFinding,
  PackageFile,
} from "./model.js";
import type { ProjectConfiguration } from "../build/package-model.js";
import {
  extractCountryTags,
  extractDefinitions,
  extractGlobalVariables,
  extractLocalizationLine,
  fingerprint,
} from "./parser.js";

const contentRoots = new Set(["dlc", "in_game", "loading_screen", "main_menu"]);

async function listFiles(
  directory: string,
  prefix = "",
): Promise<Array<{ relativePath: string; absolutePath: string }>> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: Array<{ relativePath: string; absolutePath: string }> = [];
  for (const entry of entries) {
    if (prefix === "" && !contentRoots.has(entry.name.toLowerCase())) {
      continue;
    }
    const relativePath = prefix
      ? path.posix.join(prefix, entry.name)
      : entry.name;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(absolutePath, relativePath)));
    } else if (entry.isFile()) {
      files.push({ relativePath, absolutePath });
    }
  }
  return files;
}

function sourceKey(source: PackageFile): string {
  return `${source.packageId}\u0000${source.relativePath}`;
}

function uniqueSources(sources: PackageFile[]): PackageFile[] {
  return [
    ...new Map(sources.map((source) => [sourceKey(source), source])).values(),
  ].sort((left, right) =>
    sourceKey(left).localeCompare(sourceKey(right), "en-US"),
  );
}

function finding(
  value: Omit<ConflictFinding, "fingerprint" | "packages" | "sources"> & {
    fingerprintParts: string[];
    sources: PackageFile[];
  },
): ConflictFinding {
  const sources = uniqueSources(value.sources);
  return {
    fingerprint: fingerprint(value.fingerprintParts),
    type: value.type,
    title: value.title,
    summary: value.summary,
    packages: [...new Set(sources.map((source) => source.packageId))].sort(),
    symbols: value.symbols,
    sources: sources.map((source) => ({
      packageId: source.packageId,
      packageName: source.packageName,
      relativePath: source.relativePath,
      absolutePath: source.absolutePath,
    })),
    resolved: value.resolved,
    resolution: value.resolution,
  };
}

export async function analyzeProject(
  configuration: ProjectConfiguration,
): Promise<ConflictAnalysis> {
  const packageFiles: PackageFile[] = [];
  for (const packageValue of configuration.packages) {
    const sourceRoot = path.resolve(
      configuration.rootDirectory,
      packageValue.source.path,
    );
    for (const file of await listFiles(sourceRoot)) {
      packageFiles.push({
        packageId: packageValue.id,
        packageName: packageValue.name,
        relativePath: file.relativePath,
        absolutePath: file.absolutePath,
      });
    }
  }

  const pathGroups = new Map<string, PackageFile[]>();
  for (const file of packageFiles) {
    const key = file.relativePath.toLocaleLowerCase("en-US");
    const group = pathGroups.get(key) ?? [];
    group.push(file);
    pathGroups.set(key, group);
  }

  const findings: ConflictFinding[] = [];
  const collidingPathKeys = new Set<string>();
  for (const [key, sources] of pathGroups) {
    if (new Set(sources.map((source) => source.packageId)).size < 2) {
      continue;
    }
    collidingPathKeys.add(key);
    const packages = [
      ...new Set(sources.map((source) => source.packageId)),
    ].sort();
    const resolution = configuration.conflictRules.filePathResolutions.find(
      (candidate) =>
        candidate.path.toLocaleLowerCase("en-US") === key &&
        JSON.stringify(candidate.packages.slice().sort()) ===
          JSON.stringify(packages),
    );
    findings.push(
      finding({
        fingerprintParts: ["path", key, ...packages],
        type: "path",
        title: `File path: ${sources[0].relativePath}`,
        summary: resolution
          ? resolution.reason
          : "Multiple enabled packages write the same case-insensitive output path.",
        symbols: [sources[0].relativePath],
        sources,
        resolved: resolution !== undefined,
        resolution:
          resolution?.winner ??
          (resolution?.override
            ? `Concordia override: ${resolution.override}`
            : undefined),
      }),
    );
  }

  const scriptFiles = packageFiles.filter((file) =>
    file.relativePath.endsWith(".txt"),
  );
  const localizationFiles = packageFiles.filter((file) =>
    file.relativePath.endsWith(".yml"),
  );
  const definitionGroups = new Map<
    string,
    Array<{
      source: PackageFile;
      mode: string;
      body: string;
      category: string;
      key: string;
    }>
  >();
  const localizationGroups = new Map<
    string,
    Array<{ source: PackageFile; value: string; key: string; language: string }>
  >();
  const variableGroups = new Map<string, PackageFile[]>();
  const packageTags = new Map<
    string,
    Map<string, { count: number; files: Map<string, PackageFile> }>
  >();

  for (const file of scriptFiles) {
    const contents = await readFile(file.absolutePath, "utf8");
    for (const definition of extractDefinitions(file.relativePath, contents)) {
      const symbol = `${definition.category}:${definition.key}`;
      const group = definitionGroups.get(symbol) ?? [];
      group.push({
        source: file,
        mode: definition.mode,
        body: definition.normalizedBody,
        category: definition.category,
        key: definition.key,
      });
      definitionGroups.set(symbol, group);
    }
    for (const variable of extractGlobalVariables(contents)) {
      const group = variableGroups.get(variable) ?? [];
      group.push(file);
      variableGroups.set(variable, group);
    }
    if (file.relativePath.startsWith("in_game/")) {
      const tags = extractCountryTags(contents);
      const perPackage = packageTags.get(file.packageId) ?? new Map();
      for (const [tag, count] of tags) {
        const entry = perPackage.get(tag) ?? {
          count: 0,
          files: new Map<string, PackageFile>(),
        };
        entry.count += count;
        entry.files.set(sourceKey(file), file);
        perPackage.set(tag, entry);
      }
      packageTags.set(file.packageId, perPackage);
    }
  }

  const localizationByPackage = new Map<string, PackageFile[]>();
  for (const file of localizationFiles) {
    const group = localizationByPackage.get(file.packageId) ?? [];
    group.push(file);
    localizationByPackage.set(file.packageId, group);
  }
  const localizationPackages = await Promise.all(
    [...localizationByPackage].map(async ([packageId, files]) => {
      let bytes = 0;
      for (const file of files) {
        bytes += (await stat(file.absolutePath)).size;
      }
      return { packageId, files, bytes };
    }),
  );
  localizationPackages.sort((left, right) => left.bytes - right.bytes);
  for (
    let packageIndex = 0;
    packageIndex < localizationPackages.length;
    packageIndex += 1
  ) {
    const packageGroup = localizationPackages[packageIndex];
    const isLastPackage = packageIndex === localizationPackages.length - 1;
    for (const file of packageGroup.files) {
      const lines = createInterface({
        input: createReadStream(file.absolutePath, { encoding: "utf8" }),
        crlfDelay: Infinity,
      });
      for await (const line of lines) {
        const entry = extractLocalizationLine(file.relativePath, line);
        if (!entry) {
          continue;
        }
        const symbol = `${entry.language}:${entry.key}`;
        const existing = localizationGroups.get(symbol);
        if (!existing && isLastPackage) {
          continue;
        }
        const group = existing ?? [];
        group.push({ source: file, ...entry });
        localizationGroups.set(symbol, group);
      }
    }
  }

  for (const [symbol, occurrences] of definitionGroups) {
    const packages = new Set(
      occurrences.map((occurrence) => occurrence.source.packageId),
    );
    if (packages.size < 2) {
      continue;
    }
    const paths = new Set(
      occurrences.map((occurrence) =>
        occurrence.source.relativePath.toLocaleLowerCase("en-US"),
      ),
    );
    if (paths.size === 1 && collidingPathKeys.has([...paths][0])) {
      continue;
    }
    const modes = [
      ...new Set(occurrences.map((occurrence) => occurrence.mode)),
    ];
    const bodies = new Set(occurrences.map((occurrence) => occurrence.body));
    findings.push(
      finding({
        fingerprintParts: ["definition", symbol, ...[...packages].sort()],
        type: "definition",
        title: `Definition: ${symbol}`,
        summary: `${occurrences.length} cross-package definitions (${modes.join(", ")}); bodies are ${bodies.size === 1 ? "identical" : "different"}.`,
        symbols: [symbol],
        sources: occurrences.map((occurrence) => occurrence.source),
        resolved: false,
      }),
    );
  }

  const localizationConflictGroups = new Map<
    string,
    {
      language: string;
      packages: string[];
      symbols: string[];
      sources: PackageFile[];
    }
  >();
  for (const [symbol, occurrences] of localizationGroups) {
    if (
      new Set(occurrences.map((entry) => entry.source.packageId)).size < 2 ||
      new Set(occurrences.map((entry) => entry.value)).size < 2
    ) {
      continue;
    }
    const language = occurrences[0].language;
    const packages = [
      ...new Set(occurrences.map((entry) => entry.source.packageId)),
    ].sort();
    const sources = uniqueSources(
      occurrences.map((occurrence) => occurrence.source),
    );
    const groupKey = [
      language,
      ...packages,
      ...sources.map((source) => sourceKey(source)),
    ].join("\u0000");
    const group = localizationConflictGroups.get(groupKey) ?? {
      language,
      packages,
      symbols: [],
      sources,
    };
    group.symbols.push(symbol);
    localizationConflictGroups.set(groupKey, group);
  }
  for (const group of localizationConflictGroups.values()) {
    findings.push(
      finding({
        fingerprintParts: [
          "localization",
          group.language,
          ...group.packages,
          ...group.sources.map((source) => sourceKey(source)),
        ],
        type: "localization",
        title: `Localization set: ${group.language} / ${group.packages.join(" / ")}`,
        summary: `Enabled packages provide different text for ${group.symbols.length} shared localization key(s) in these files.`,
        symbols: group.symbols.sort(),
        sources: group.sources,
        resolved: false,
      }),
    );
  }

  for (const [variable, sources] of variableGroups) {
    if (new Set(sources.map((source) => source.packageId)).size < 2) {
      continue;
    }
    findings.push(
      finding({
        fingerprintParts: [
          "global-variable",
          variable,
          ...[...new Set(sources.map((source) => source.packageId))].sort(),
        ],
        type: "global-variable",
        title: `Global variable: ${variable}`,
        summary: "Multiple packages read or mutate the same global variable.",
        symbols: [variable],
        sources,
        resolved: false,
      }),
    );
  }

  const packageIds = [...packageTags.keys()].sort();
  for (let leftIndex = 0; leftIndex < packageIds.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < packageIds.length;
      rightIndex += 1
    ) {
      const leftId = packageIds[leftIndex];
      const rightId = packageIds[rightIndex];
      const leftTags = packageTags.get(leftId);
      const rightTags = packageTags.get(rightId);
      if (!leftTags || !rightTags) {
        continue;
      }
      const sharedTags = [...leftTags.keys()]
        .filter(
          (tag) =>
            (leftTags.get(tag)?.count ?? 0) >= 3 &&
            (rightTags.get(tag)?.count ?? 0) >= 3,
        )
        .sort();
      if (sharedTags.length < 3) {
        continue;
      }
      const sources = sharedTags.flatMap((tag) => [
        ...(leftTags.get(tag)?.files.values() ?? []),
        ...(rightTags.get(tag)?.files.values() ?? []),
      ]);
      findings.push(
        finding({
          fingerprintParts: ["system-overlap", leftId, rightId, ...sharedTags],
          type: "system-overlap",
          title: `Country-system overlap: ${leftId} / ${rightId}`,
          summary: `Both packages substantially reference ${sharedTags.length} of the same country tags. Review whether their events, on-actions, and scripted effects implement competing systems.`,
          symbols: sharedTags,
          sources,
          resolved: false,
        }),
      );
    }
  }

  const semanticResolutions = new Map(
    configuration.conflictRules.semanticResolutions.map((resolution) => [
      resolution.fingerprint,
      resolution,
    ]),
  );
  for (const currentFinding of findings) {
    if (currentFinding.type === "path") {
      continue;
    }
    const resolution = semanticResolutions.get(currentFinding.fingerprint);
    if (resolution) {
      currentFinding.resolved = true;
      currentFinding.resolution = `${resolution.decision}: ${resolution.reason}`;
    }
  }

  findings.sort((left, right) =>
    `${left.resolved ? 1 : 0}:${left.type}:${left.title}:${left.fingerprint}`.localeCompare(
      `${right.resolved ? 1 : 0}:${right.type}:${right.title}:${right.fingerprint}`,
      "en-US",
    ),
  );
  return {
    formatVersion: 1,
    targetGameVersion: configuration.build.targetGameVersion,
    packageCount: configuration.packages.length,
    generatedAt: new Date().toISOString(),
    findings,
  };
}
