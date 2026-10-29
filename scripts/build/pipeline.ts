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

interface BuildMetadata {
  formatVersion: 1;
  targetGameVersion: string;
  packages: Array<{
    id: string;
    version: string;
    sourceType: ConcordiaPackage["source"]["type"];
  }>;
}

async function listFiles(directory: string, prefix = ""): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
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
  const files = new Map<string, { packageId: string; sourcePath: string }>();
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
      const previous = files.get(collisionKey);
      if (previous) {
        throw new Error(
          `File path collision at "${normalizedPath}" between packages ${previous.packageId} and ${packageValue.id}`,
        );
      }
      files.set(collisionKey, {
        packageId: packageValue.id,
        sourcePath: path.join(sourceDirectory, relativePath),
      });
    }
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
