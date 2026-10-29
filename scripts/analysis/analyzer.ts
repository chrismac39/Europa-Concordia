import { createReadStream } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import { createInterface } from "node:readline";
import path from "node:path";
import type {
  ConflictAnalysis,
  ConflictFinding,
  DefinitionVariantAnalysis,
  PackageFile,
  ScriptBehaviorProfile,
} from "./model.js";
import type { ProjectConfiguration } from "../build/package-model.js";
import {
  classifyCountryReferenceFile,
  extractCountryTags,
  extractDefinitions,
  extractGlobalVariables,
  extractLocalizationLine,
  fingerprint,
} from "./parser.js";

const contentRoots = new Set(["dlc", "in_game", "loading_screen", "main_menu"]);

interface DefinitionOccurrence {
  source: PackageFile;
  mode: string;
  body: string;
  category: string;
  key: string;
}

function emptyBehaviorProfile(): ScriptBehaviorProfile {
  return {
    eventReferences: [],
    dependencySymbols: [],
    countryOutcomes: [],
    variablesWritten: [],
    importantConditions: [],
    importantValues: [],
  };
}

function mergeBehaviorProfiles(
  profiles: ScriptBehaviorProfile[],
): ScriptBehaviorProfile {
  const merged = emptyBehaviorProfile();
  for (const key of Object.keys(merged) as Array<keyof ScriptBehaviorProfile>) {
    merged[key] = [
      ...new Set(profiles.flatMap((profile) => profile[key])),
    ].sort();
  }
  return merged;
}

function scriptBehaviorProfile(
  body: string,
  scriptedEffectKeys: Set<string>,
): ScriptBehaviorProfile {
  const eventReferences = [
    ...body.matchAll(
      /\btrigger_event(?:_non_silently|_silently)?\s*=\s*([A-Za-z0-9_.-]+)/g,
    ),
  ].map((match) => match[1]);
  const blockEventReferences = [
    ...body.matchAll(
      /\btrigger_event(?:_non_silently|_silently)?\s*=\s*\{[^{}]{0,300}?\bid\s*=\s*([A-Za-z0-9_.-]+)/g,
    ),
  ].map((match) => match[1]);
  const assignments = [
    ...body.matchAll(/\b([A-Za-z0-9_.-]+)\s*=\s*(?:\{|\S+)/g),
  ].map((match) => match[1]);
  const effectDependencies = assignments
    .filter((key) => scriptedEffectKeys.has(key))
    .map((key) => `common/scripted_effects:${key}`);
  const events = [...new Set([...eventReferences, ...blockEventReferences])];
  const countryOutcomes = [
    ...body.matchAll(
      /\b(create_country|release_country|annex_country|destroy_country|change_tag)\s*=\s*(?:c:)?([A-Z][A-Z0-9_]{2,})\b/g,
    ),
  ].map((match) => `${match[1]}:${match[2]}`);
  for (const match of body.matchAll(
    /\b(create_country|release_country|annex_country|destroy_country|change_tag)\s*=\s*\{[^{}]{0,500}?\b(?:tag|country)\s*=\s*(?:c:)?([A-Z][A-Z0-9_]{2,})\b/g,
  )) {
    countryOutcomes.push(`${match[1]}:${match[2]}`);
  }
  const variablesWritten = [
    ...body.matchAll(
      /\b(set|change|remove)_variable\s*=\s*(?:\{[^{}]{0,300}?\bname\s*=\s*)?([A-Za-z0-9_.-]+)/g,
    ),
  ].map((match) => `${match[1]}:${match[2]}`);
  const importantConditions = [
    ...body.matchAll(
      /\b(is_ai|is_subject|government_type|horde_unity|country_rank_level)\s*(=|<=|>=|<|>)\s*([A-Za-z0-9_.:-]+)/g,
    ),
  ].map((match) => `${match[1]} ${match[2]} ${match[3]}`);
  const triggerConditions = [
    ...body.matchAll(/\b([A-Za-z0-9_.-]+_trigger)\s*=\s*yes/g),
  ].map((match) => `${match[1]} = yes`);
  const importantValueKeys =
    /^(?:discipline|subject_loyalty|horde_unity_hit_at_ruler_death|monthly_horde_unity|global_crown_estate_power|global_estate_target_satisfaction)$/;
  const importantValues = [
    ...body.matchAll(/\b([A-Za-z0-9_.-]+)\s*=\s*(-?\d+(?:\.\d+)?)/g),
  ]
    .filter((match) => importantValueKeys.test(match[1]))
    .map((match) => `${match[1]} = ${match[2]}`);
  return {
    eventReferences: events.sort(),
    dependencySymbols: [
      ...new Set([
        ...events.map((eventId) => `events:${eventId}`),
        ...effectDependencies,
      ]),
    ].sort(),
    countryOutcomes: [...new Set(countryOutcomes)].sort(),
    variablesWritten: [...new Set(variablesWritten)].sort(),
    importantConditions: [
      ...new Set([...importantConditions, ...triggerConditions]),
    ].sort(),
    importantValues: [...new Set(importantValues)].sort(),
  };
}

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
    definitionVariants: value.definitionVariants,
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
  const definitionGroups = new Map<string, DefinitionOccurrence[]>();
  const localizationGroups = new Map<
    string,
    Array<{ source: PackageFile; value: string; key: string; language: string }>
  >();
  const variableGroups = new Map<string, PackageFile[]>();
  const packageTags = new Map<
    string,
    Map<
      string,
      {
        count: number;
        activeCount: number;
        files: Map<string, PackageFile>;
        activeFiles: Map<string, PackageFile>;
      }
    >
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
      const role = classifyCountryReferenceFile(file.relativePath);
      const perPackage = packageTags.get(file.packageId) ?? new Map();
      for (const [tag, count] of tags) {
        const entry = perPackage.get(tag) ?? {
          count: 0,
          activeCount: 0,
          files: new Map<string, PackageFile>(),
          activeFiles: new Map<string, PackageFile>(),
        };
        entry.count += count;
        entry.files.set(sourceKey(file), file);
        if (role === "active") {
          entry.activeCount += count;
          entry.activeFiles.set(sourceKey(file), file);
        }
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

  const scriptedEffectKeys = new Set(
    [...definitionGroups.keys()]
      .filter((symbol) => symbol.startsWith("common/scripted_effects:"))
      .map((symbol) => symbol.slice("common/scripted_effects:".length)),
  );
  const occurrenceIndex = new Map<string, DefinitionOccurrence[]>();
  for (const [symbol, occurrences] of definitionGroups) {
    for (const occurrence of occurrences) {
      const key = `${occurrence.source.packageId}\u0000${symbol}`;
      const packageOccurrences = occurrenceIndex.get(key) ?? [];
      packageOccurrences.push(occurrence);
      occurrenceIndex.set(key, packageOccurrences);
    }
  }
  const directProfiles = new Map<string, ScriptBehaviorProfile>();
  for (const [key, occurrences] of occurrenceIndex) {
    directProfiles.set(
      key,
      mergeBehaviorProfiles(
        occurrences.map((occurrence) =>
          scriptBehaviorProfile(occurrence.body, scriptedEffectKeys),
        ),
      ),
    );
  }
  const downstreamProfile = (
    packageId: string,
    dependencies: string[],
    visited = new Set<string>(),
    depth = 0,
  ): ScriptBehaviorProfile => {
    if (depth >= 4) {
      return emptyBehaviorProfile();
    }
    const profiles: ScriptBehaviorProfile[] = [];
    for (const dependency of dependencies) {
      const key = `${packageId}\u0000${dependency}`;
      if (visited.has(key)) {
        continue;
      }
      const profile = directProfiles.get(key);
      if (!profile) {
        continue;
      }
      const nextVisited = new Set(visited);
      nextVisited.add(key);
      profiles.push(
        profile,
        downstreamProfile(
          packageId,
          profile.dependencySymbols,
          nextVisited,
          depth + 1,
        ),
      );
    }
    return mergeBehaviorProfiles(profiles);
  };

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
    const definitionVariants: DefinitionVariantAnalysis[] = occurrences.map(
      (occurrence) => {
        const key = `${occurrence.source.packageId}\u0000${symbol}`;
        const direct = directProfiles.get(key) ?? emptyBehaviorProfile();
        return {
          packageId: occurrence.source.packageId,
          packageName: occurrence.source.packageName,
          symbol,
          mode: occurrence.mode,
          direct,
          downstream: downstreamProfile(
            occurrence.source.packageId,
            direct.dependencySymbols,
          ),
        };
      },
    );
    findings.push(
      finding({
        fingerprintParts: ["definition", symbol, ...[...packages].sort()],
        type: "definition",
        title: `Definition: ${symbol}`,
        summary: `${occurrences.length} cross-package definitions (${modes.join(", ")}); bodies are ${bodies.size === 1 ? "identical" : "different"}.`,
        symbols: [symbol],
        sources: occurrences.map((occurrence) => occurrence.source),
        definitionVariants,
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
      const rawSharedTags = [...leftTags.keys()]
        .filter(
          (tag) =>
            (leftTags.get(tag)?.count ?? 0) >= 3 &&
            (rightTags.get(tag)?.count ?? 0) >= 3,
        )
        .sort();
      if (rawSharedTags.length < 3) {
        continue;
      }
      const activeSharedTags = rawSharedTags.filter(
        (tag) =>
          (leftTags.get(tag)?.activeCount ?? 0) > 0 &&
          (rightTags.get(tag)?.activeCount ?? 0) > 0,
      );
      if (activeSharedTags.length < 3) {
        const sources = rawSharedTags.flatMap((tag) => [
          ...(leftTags.get(tag)?.files.values() ?? []),
          ...(rightTags.get(tag)?.files.values() ?? []),
        ]);
        findings.push(
          finding({
            fingerprintParts: [
              "system-observation",
              leftId,
              rightId,
              ...rawSharedTags,
            ],
            type: "system-observation",
            title: `Non-conflicting country references: ${leftId} / ${rightId}`,
            summary: `The packages substantially reference ${rawSharedTags.length} of the same country tags, but fewer than three tags have active gameplay references on both sides. The overlap is confined primarily to read-only observers or historical lookup data and does not constitute a system conflict.`,
            symbols: rawSharedTags,
            sources,
            resolved: true,
            resolution:
              "Categorized as non-conflict: no substantial active gameplay ownership on both sides.",
          }),
        );
        continue;
      }
      const sources = activeSharedTags.flatMap((tag) => [
        ...(leftTags.get(tag)?.activeFiles.values() ?? []),
        ...(rightTags.get(tag)?.activeFiles.values() ?? []),
      ]);
      findings.push(
        finding({
          fingerprintParts: [
            "system-interaction",
            leftId,
            rightId,
            ...activeSharedTags,
          ],
          type: "system-interaction",
          title: `Country-system interaction risk: ${leftId} / ${rightId}`,
          summary: `Both packages actively implement gameplay involving ${activeSharedTags.length} of the same country tags. Shared country scope alone does not prove a conflict; retain this as a runtime interaction audit while concrete path, definition, event, and state collisions are handled separately.`,
          symbols: activeSharedTags,
          sources,
          resolved: true,
          resolution:
            "Categorized as interaction risk: active gameplay overlap requires runtime review but is not independently a compatibility conflict.",
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
