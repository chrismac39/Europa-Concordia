import {
  copyFile,
  mkdir,
  mkdtemp,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import type {
  ConcordiaPackage,
  ProjectConfiguration,
  ProjectOptions,
} from "./package-model.js";
import { validateProject } from "./validation.js";
import { analyzeProject } from "../analysis/analyzer.js";

interface BuildMetadata {
  formatVersion: 1;
  targetGameVersion: string;
  packages: Array<{
    id: string;
    version: string;
    sourceType: ConcordiaPackage["source"]["type"];
  }>;
}

const packageContentRoots = new Set([
  "dlc",
  "in_game",
  "loading_screen",
  "main_menu",
]);

async function listFiles(directory: string, prefix = ""): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (
      prefix === "" &&
      !packageContentRoots.has(entry.name.toLocaleLowerCase("en-US"))
    ) {
      continue;
    }
    const relativePath = prefix
      ? path.posix.join(prefix, entry.name)
      : entry.name;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(entryPath, relativePath)));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }
  return files.sort((left, right) =>
    left < right ? -1 : left > right ? 1 : 0,
  );
}

async function collectPackageFiles(
  configuration: ProjectConfiguration,
): Promise<Map<string, { packageId: string; sourcePath: string }>> {
  const candidates = new Map<
    string,
    Array<{ packageId: string; sourcePath: string; outputPath: string }>
  >();
  for (const packageValue of configuration.packages) {
    const sourceDirectory = path.resolve(
      configuration.rootDirectory,
      packageValue.source.path,
    );
    for (const relativePath of await listFiles(sourceDirectory)) {
      const normalizedPath = relativePath.split(path.sep).join("/");
      const collisionKey = normalizedPath.toLocaleLowerCase("en-US");
      if (collisionKey === "build-metadata.json") {
        throw new Error(
          `Package ${packageValue.id} uses reserved output path "build-metadata.json"`,
        );
      }
      const pathCandidates = candidates.get(collisionKey) ?? [];
      pathCandidates.push({
        packageId: packageValue.id,
        sourcePath: path.join(sourceDirectory, relativePath),
        outputPath: normalizedPath,
      });
      candidates.set(collisionKey, pathCandidates);
    }
  }

  const resolutions = new Map(
    configuration.conflictRules.filePathResolutions.map((resolution) => [
      resolution.path.toLocaleLowerCase("en-US"),
      resolution,
    ]),
  );
  const files = new Map<string, { packageId: string; sourcePath: string }>();
  const unresolvedCollisions: string[] = [];
  for (const [collisionKey, pathCandidates] of candidates) {
    const resolution = resolutions.get(collisionKey);
    if (pathCandidates.length === 1) {
      if (resolution?.override !== undefined) {
        const packageIds = pathCandidates
          .map((candidate) => candidate.packageId)
          .sort();
        const resolvedPackageIds = resolution.packages.slice().sort();
        if (JSON.stringify(packageIds) !== JSON.stringify(resolvedPackageIds)) {
          unresolvedCollisions.push(
            `File path resolution for "${resolution.path}" does not match package ${packageIds[0]}`,
          );
          continue;
        }
        files.set(collisionKey, {
          packageId: "concordia-integration",
          sourcePath: path.resolve(
            configuration.rootDirectory,
            resolution.override,
          ),
        });
        continue;
      }
      files.set(collisionKey, pathCandidates[0]);
      continue;
    }
    const packageIds = pathCandidates
      .map((candidate) => candidate.packageId)
      .sort();
    const resolvedPackageIds = resolution?.packages.slice().sort();
    if (
      !resolution ||
      JSON.stringify(packageIds) !== JSON.stringify(resolvedPackageIds)
    ) {
      const packageList = `${packageIds.slice(0, -1).join(", ")} and ${packageIds.at(-1)}`;
      unresolvedCollisions.push(
        `File path collision at "${pathCandidates.at(-1)?.outputPath}" between packages ${packageList}`,
      );
      continue;
    }
    if (resolution.override !== undefined) {
      files.set(collisionKey, {
        packageId: "concordia-integration",
        sourcePath: path.resolve(
          configuration.rootDirectory,
          resolution.override,
        ),
      });
      continue;
    }
    const winner = pathCandidates.find(
      (candidate) => candidate.packageId === resolution.winner,
    );
    if (!winner) {
      throw new Error(
        `File path resolution for "${resolution.path}" selects unavailable package ${resolution.winner}`,
      );
    }
    files.set(collisionKey, winner);
  }
  if (unresolvedCollisions.length > 0) {
    throw new Error(unresolvedCollisions.join("\n"));
  }
  return files;
}

function createBuildMetadata(
  targetGameVersion: string,
  packages: ConcordiaPackage[],
): BuildMetadata {
  return {
    formatVersion: 1,
    targetGameVersion,
    packages: packages.map((packageValue) => ({
      id: packageValue.id,
      version: packageValue.version,
      sourceType: packageValue.source.type,
    })),
  };
}

export async function buildProject(
  rootDirectory: string,
  options: ProjectOptions = {},
): Promise<string> {
  const configuration = await validateProject(rootDirectory, options);
  const files = await collectPackageFiles(configuration);
  const analysis = await analyzeProject(configuration);
  const unresolvedSemanticFindings = analysis.findings.filter(
    (finding) => !finding.resolved && finding.type !== "path",
  );
  if (unresolvedSemanticFindings.length > 0) {
    throw new Error(
      `Semantic analysis found ${unresolvedSemanticFindings.length} unresolved finding(s). Run "npm run analyze", vote in integration/decision-frontier.md, and inspect integration/deep-frontier.md.`,
    );
  }
  const outputDirectory = path.resolve(
    configuration.rootDirectory,
    configuration.build.outputDirectory,
  );
  const outputParent = path.dirname(outputDirectory);
  await mkdir(outputParent, { recursive: true });
  const stagingDirectory = await mkdtemp(
    path.join(outputParent, ".europa-concordia-staging-"),
  );

  try {
    for (const [normalizedPath, file] of [...files.entries()].sort(
      ([left], [right]) => (left < right ? -1 : left > right ? 1 : 0),
    )) {
      const targetPath = path.join(
        stagingDirectory,
        ...normalizedPath.split("/"),
      );
      await mkdir(path.dirname(targetPath), { recursive: true });
      await copyFile(file.sourcePath, targetPath);
    }
    await writeFile(
      path.join(stagingDirectory, "build-metadata.json"),
      `${JSON.stringify(
        createBuildMetadata(
          configuration.build.targetGameVersion,
          configuration.packages,
        ),
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

  return outputDirectory;
}
