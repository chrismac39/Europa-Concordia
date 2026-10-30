import {
  copyFile,
  mkdir,
  mkdtemp,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import type { ConcordiaPackage, ProjectOptions } from "./package-model.js";
import { validateProject } from "./validation.js";
import { analyzeProject } from "../analysis/analyzer.js";
import { createWorkshopModMetadata } from "../workshop/metadata.js";

interface BuildMetadata {
  formatVersion: 1;
  profileId: string;
  targetGameVersion: string;
  loadOrder: string[];
  mods: Array<{
    packageId: string;
    name: string;
    version: string;
    sourceIdentifier: string;
  }>;
  patches: Array<{
    id: string;
    targetPath: string;
    operation: "add" | "replace";
    resolutionType: string;
  }>;
}

function sourceIdentifier(
  packageId: string,
  configuration: Awaited<ReturnType<typeof validateProject>>,
): string {
  const mod = configuration.profile.mods.find(
    (candidate) => candidate.packageId === packageId,
  );
  if (!mod) {
    throw new Error(
      `Profile ${configuration.profile.id} is missing ${packageId}`,
    );
  }
  if (mod.source.type === "steam-workshop") {
    return `Steam Workshop ${mod.source.workshopId}`;
  }
  if (mod.source.type === "git") {
    return `Git ${mod.source.revision}`;
  }
  return "Local source";
}

function packageSourceIdentifier(packageValue: ConcordiaPackage): string {
  if (packageValue.source.type === "steam-workshop") {
    return `Steam Workshop ${packageValue.source.workshopId}`;
  }
  if (packageValue.source.type === "git") {
    return `Git ${packageValue.source.revision}`;
  }
  return "Local source";
}

function createLoadOrderGuide(
  configuration: Awaited<ReturnType<typeof validateProject>>,
  unresolvedFindingCount: number,
): string {
  const packages = new Map(
    configuration.packageCatalog.map((packageValue) => [
      packageValue.id,
      packageValue,
    ]),
  );
  const entries = configuration.profile.loadOrder
    .filter((entry) => entry !== configuration.profile.patchMod.id)
    .map((packageId, index) => {
      const packageValue = packages.get(packageId);
      if (!packageValue) {
        throw new Error(
          `Profile load order references unknown mod ${packageId}`,
        );
      }
      return `${index + 1}. **${packageValue.name}** ${packageValue.version} - ${sourceIdentifier(packageId, configuration)}.`;
    });
  entries.push(
    `${entries.length + 1}. **${configuration.profile.patchMod.name}** ${configuration.profile.patchMod.version} - generated Concordia compatibility patch; load last.`,
  );
  const guide = [
    `# ${configuration.profile.name} - EU5 load order`,
    "",
    `Target game version: **${configuration.profile.targetGameVersion}**.`,
  ];
  if (unresolvedFindingCount > 0) {
    guide.push(
      "",
      `**Build status: BLOCKED** — ${unresolvedFindingCount} unresolved conflict finding(s) remain.`,
      "This guide records the requested order only; it is not compatibility approval. Resolve the findings before enabling this profile.",
    );
  }
  guide.push(
    "",
    "Enable the following original mods separately in the EU5 playset, in this order:",
    "",
    ...entries,
  );
  const exclusions = (configuration.profile.excludedMods ?? []).map(
    (excludedMod) => {
      const packageValue = packages.get(excludedMod.packageId);
      if (!packageValue) {
        throw new Error(
          `Profile excludes unknown mod ${excludedMod.packageId}`,
        );
      }
      return `- **${packageValue.name}** ${packageValue.version} (${packageSourceIdentifier(packageValue)}) - ${excludedMod.reason}`;
    },
  );
  if (exclusions.length > 0) {
    guide.push(
      "",
      "## Explicitly excluded from this profile",
      "",
      "Do not enable these mods with this playset:",
      "",
      ...exclusions,
    );
  }
  guide.push(
    "",
    "The generated Concordia mod contains only Concordia-authored compatibility files and its launcher metadata. It does not bundle or replace any listed upstream mod.",
    "",
    "Update the profile and rerun `npm run analyze -- --profile " +
      configuration.profile.id +
      "` whenever a required mod version, Workshop item, source pin, or EU5 target changes.",
    "",
  );
  return guide.join("\n");
}

function createBuildMetadata(
  configuration: Awaited<ReturnType<typeof validateProject>>,
): BuildMetadata {
  return {
    formatVersion: 1,
    profileId: configuration.profile.id,
    targetGameVersion: configuration.profile.targetGameVersion,
    loadOrder: configuration.profile.loadOrder.slice(),
    mods: configuration.profile.mods.map((mod) => ({
      packageId: mod.packageId,
      name: mod.name,
      version: mod.version,
      sourceIdentifier: sourceIdentifier(mod.packageId, configuration),
    })),
    patches: configuration.profile.patches.map((patch) => ({
      id: patch.id,
      targetPath: patch.targetPath,
      operation: patch.operation ?? "replace",
      resolutionType: patch.resolutionType,
    })),
  };
}

export async function buildProject(
  rootDirectory: string,
  options: ProjectOptions = {},
): Promise<string> {
  const configuration = await validateProject(rootDirectory, options);
  const analysis = await analyzeProject(configuration);
  const unresolvedFindings = analysis.findings.filter(
    (finding) => !finding.resolved,
  );
  const guideDirectory = path.resolve(
    configuration.rootDirectory,
    "dist",
    "load-order",
  );
  await mkdir(guideDirectory, { recursive: true });
  await writeFile(
    path.join(guideDirectory, `${configuration.profile.id}.md`),
    createLoadOrderGuide(configuration, unresolvedFindings.length),
    "utf8",
  );
  if (unresolvedFindings.length > 0) {
    throw new Error(
      `Compatibility analysis found ${unresolvedFindings.length} unresolved finding(s). Add a valid content-pinned decision (resolution or incompatibility) for each finding before building.`,
    );
  }

  const outputBase = path.resolve(
    configuration.rootDirectory,
    configuration.build.outputDirectory,
  );
  const outputDirectory = path.join(outputBase, configuration.profile.id);
  const outputParent = path.dirname(outputDirectory);
  await mkdir(outputParent, { recursive: true });
  const stagingDirectory = await mkdtemp(
    path.join(outputParent, ".europa-concordia-staging-"),
  );
  try {
    for (const patch of configuration.profile.patches) {
      const sourcePath = path.resolve(
        configuration.rootDirectory,
        patch.sourcePath,
      );
      const targetPath = path.join(
        stagingDirectory,
        ...patch.targetPath.split("/"),
      );
      await mkdir(path.dirname(targetPath), { recursive: true });
      await copyFile(sourcePath, targetPath);
    }

    const metadataDirectory = path.join(stagingDirectory, ".metadata");
    await mkdir(metadataDirectory, { recursive: true });
    const patchMetadata = configuration.profile.patchMod;
    const [targetMajor, targetMinor] =
      configuration.profile.targetGameVersion.split(".");
    const supportedGameVersion = `${targetMajor}.${targetMinor}.*`;
    await writeFile(
      path.join(metadataDirectory, "metadata.json"),
      `${JSON.stringify(
        createWorkshopModMetadata({
          name: patchMetadata.name,
          id: patchMetadata.id,
          version: patchMetadata.version,
          supportedGameVersion,
          shortDescription: patchMetadata.shortDescription,
          tags: patchMetadata.tags,
          relationships: [],
        }),
        null,
        2,
      )}\n`,
      "utf8",
    );

    await rm(outputDirectory, { recursive: true, force: true });
    await rename(stagingDirectory, outputDirectory);
  } finally {
    const stagingStats = await stat(stagingDirectory).catch(() => undefined);
    if (stagingStats?.isDirectory()) {
      await rm(stagingDirectory, { recursive: true, force: true });
    }
  }

  const metadataDirectory = path.resolve(
    configuration.rootDirectory,
    "dist",
    "build-metadata",
  );
  await mkdir(metadataDirectory, { recursive: true });
  await writeFile(
    path.join(metadataDirectory, `${configuration.profile.id}.json`),
    `${JSON.stringify(createBuildMetadata(configuration), null, 2)}\n`,
    "utf8",
  );
  return outputDirectory;
}
