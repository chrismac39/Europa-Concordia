import {
  access,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildProject } from "../build/pipeline.js";
import {
  createWorkshopModMetadata,
  type WorkshopMetadataConfiguration,
} from "./metadata.js";

interface WorkshopConfiguration {
  version: 1;
  metadata: WorkshopMetadataConfiguration;
  channels: {
    stable: {
      artifactDirectory: string;
    };
  };
}

const contentRoots = new Set(["dlc", "in_game", "loading_screen", "main_menu"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value: Record<string, unknown>, field: string): string {
  const fieldValue = value[field];
  if (typeof fieldValue !== "string" || fieldValue.length === 0) {
    throw new Error(`config/workshop.json metadata.${field} must be a string`);
  }
  return fieldValue;
}

function readWorkshopConfiguration(value: unknown): WorkshopConfiguration {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.metadata)) {
    throw new Error("config/workshop.json has an invalid structure");
  }
  const metadata = value.metadata;
  if (
    !Array.isArray(metadata.tags) ||
    !metadata.tags.every((tag): tag is string => typeof tag === "string")
  ) {
    throw new Error(
      "config/workshop.json metadata.tags must be a string array",
    );
  }
  if (!isRecord(value.channels) || !isRecord(value.channels.stable)) {
    throw new Error("config/workshop.json must define a stable channel");
  }
  const artifactDirectory = value.channels.stable.artifactDirectory;
  if (typeof artifactDirectory !== "string" || artifactDirectory.length === 0) {
    throw new Error(
      "config/workshop.json channels.stable.artifactDirectory must be a string",
    );
  }

  return {
    version: 1,
    metadata: {
      name: requiredString(metadata, "name"),
      id: requiredString(metadata, "id"),
      version: requiredString(metadata, "version"),
      supportedGameVersion: requiredString(metadata, "supportedGameVersion"),
      shortDescription: requiredString(metadata, "shortDescription"),
      tags: metadata.tags,
    },
    channels: { stable: { artifactDirectory } },
  };
}

async function loadWorkshopConfiguration(
  rootDirectory: string,
): Promise<WorkshopConfiguration> {
  const contents = await readFile(
    path.join(rootDirectory, "config", "workshop.json"),
    "utf8",
  );
  return readWorkshopConfiguration(JSON.parse(contents) as unknown);
}

function assertInsideDirectory(
  parentDirectory: string,
  targetDirectory: string,
): void {
  const relativePath = path.relative(parentDirectory, targetDirectory);
  if (
    relativePath === "" ||
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error(`Refusing to write outside ${parentDirectory}`);
  }
}

export async function packageWorkshopMod(rootDirectory: string): Promise<{
  artifactDirectory: string;
  metadata: WorkshopMetadataConfiguration;
}> {
  const workshopConfiguration = await loadWorkshopConfiguration(rootDirectory);
  const buildDirectory = await buildProject(rootDirectory);
  const distDirectory = path.resolve(rootDirectory, "dist");
  const artifactDirectory = path.resolve(
    rootDirectory,
    workshopConfiguration.channels.stable.artifactDirectory,
  );
  assertInsideDirectory(distDirectory, artifactDirectory);
  await mkdir(path.dirname(artifactDirectory), { recursive: true });

  const stagingDirectory = await mkdtemp(
    path.join(path.dirname(artifactDirectory), ".concordia-workshop-"),
  );
  try {
    for (const entry of await readdir(buildDirectory, {
      withFileTypes: true,
    })) {
      if (entry.isDirectory() && contentRoots.has(entry.name.toLowerCase())) {
        await cp(
          path.join(buildDirectory, entry.name),
          path.join(stagingDirectory, entry.name),
          { recursive: true },
        );
      }
    }

    const metadataDirectory = path.join(stagingDirectory, ".metadata");
    await mkdir(metadataDirectory, { recursive: true });
    await writeFile(
      path.join(metadataDirectory, "metadata.json"),
      `${JSON.stringify(
        createWorkshopModMetadata(workshopConfiguration.metadata),
        null,
        2,
      )}\n`,
      "utf8",
    );

    await rm(artifactDirectory, { recursive: true, force: true });
    await rename(stagingDirectory, artifactDirectory);
  } finally {
    await rm(stagingDirectory, { recursive: true, force: true });
  }

  return {
    artifactDirectory,
    metadata: workshopConfiguration.metadata,
  };
}

export async function installWorkshopModLocally(
  rootDirectory: string,
): Promise<string> {
  const { artifactDirectory, metadata } =
    await packageWorkshopMod(rootDirectory);
  const modDirectory = path.join(
    os.homedir(),
    "Documents",
    "Paradox Interactive",
    "Europa Universalis V",
    "mod",
    metadata.id,
  );
  const modParentDirectory = path.dirname(modDirectory);
  await mkdir(modParentDirectory, { recursive: true });

  let localModExists = false;
  try {
    await access(modDirectory);
    localModExists = true;
  } catch (error) {
    if (!(
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    )) {
      throw error;
    }
  }

  if (localModExists) {
    const existingMetadata = JSON.parse(
      await readFile(
        path.join(modDirectory, ".metadata", "metadata.json"),
        "utf8",
      ),
    ) as unknown;
    if (!isRecord(existingMetadata) || existingMetadata.id !== metadata.id) {
      throw new Error(
        `Refusing to replace existing mod directory ${modDirectory}`,
      );
    }
    await rm(modDirectory, { recursive: true });
  }

  await cp(artifactDirectory, modDirectory, { recursive: true });
  return modDirectory;
}
