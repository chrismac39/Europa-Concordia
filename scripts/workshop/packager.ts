import {
  access,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildProject } from "../build/pipeline.js";
import type { ProjectOptions } from "../build/package-model.js";
import type {
  WorkshopMetadataConfiguration,
  WorkshopModMetadata,
} from "./metadata.js";

interface WorkshopConfiguration {
  version: 1;
  metadata: WorkshopMetadataConfiguration;
  requiredWorkshopItems: string[];
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
  if (
    !Array.isArray(metadata.relationships) ||
    !metadata.relationships.every(
      (relationship) =>
        isRecord(relationship) &&
        relationship.rel_type === "dependency" &&
        typeof relationship.id === "string" &&
        typeof relationship.display_name === "string" &&
        relationship.resource_type === "mod" &&
        typeof relationship.version === "string",
    )
  ) {
    throw new Error(
      "config/workshop.json metadata.relationships must contain mod dependency relationships",
    );
  }
  if (
    !Array.isArray(value.requiredWorkshopItems) ||
    !value.requiredWorkshopItems.every(
      (item): item is string => typeof item === "string" && /^\d+$/.test(item),
    )
  ) {
    throw new Error(
      "config/workshop.json requiredWorkshopItems must be a string array of numeric Workshop IDs",
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
      relationships: metadata.relationships,
    },
    requiredWorkshopItems: value.requiredWorkshopItems,
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

function validateBuiltMetadata(value: unknown): WorkshopModMetadata {
  if (
    !isRecord(value) ||
    value.game_id !== "eu5" ||
    typeof value.name !== "string" ||
    typeof value.id !== "string" ||
    typeof value.version !== "string" ||
    typeof value.supported_game_version !== "string" ||
    typeof value.short_description !== "string" ||
    !Array.isArray(value.tags) ||
    !value.tags.every((tag) => typeof tag === "string") ||
    !Array.isArray(value.relationships) ||
    !value.relationships.every(
      (relationship) =>
        isRecord(relationship) &&
        relationship.rel_type === "dependency" &&
        typeof relationship.id === "string" &&
        typeof relationship.display_name === "string" &&
        relationship.resource_type === "mod" &&
        typeof relationship.version === "string",
    ) ||
    !isRecord(value.game_custom_data)
  ) {
    throw new Error("Generated patch has invalid EU5 launcher metadata");
  }
  return {
    name: value.name,
    id: value.id,
    version: value.version,
    game_id: "eu5",
    supported_game_version: value.supported_game_version,
    short_description: value.short_description,
    tags: value.tags,
    relationships: value.relationships,
    game_custom_data: {},
  };
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

export async function packageWorkshopMod(
  rootDirectory: string,
  options: ProjectOptions = {},
): Promise<{
  artifactDirectory: string;
  metadata: WorkshopModMetadata;
}> {
  const workshopConfiguration = await loadWorkshopConfiguration(rootDirectory);
  const buildDirectory = await buildProject(rootDirectory, options);
  const metadata = validateBuiltMetadata(
    JSON.parse(
      await readFile(
        path.join(buildDirectory, ".metadata", "metadata.json"),
        "utf8",
      ),
    ) as unknown,
  );
  const distDirectory = path.resolve(rootDirectory, "dist");
  const profileId = path.basename(buildDirectory);
  const artifactDirectory = path.resolve(
    rootDirectory,
    workshopConfiguration.channels.stable.artifactDirectory,
    profileId,
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
      if (
        entry.isDirectory() &&
        (contentRoots.has(entry.name.toLowerCase()) ||
          entry.name.toLowerCase() === ".metadata")
      ) {
        await cp(
          path.join(buildDirectory, entry.name),
          path.join(stagingDirectory, entry.name),
          { recursive: true },
        );
      }
    }

    await rm(artifactDirectory, { recursive: true, force: true });
    await rename(stagingDirectory, artifactDirectory);
  } finally {
    await rm(stagingDirectory, { recursive: true, force: true });
  }

  return {
    artifactDirectory,
    metadata,
  };
}

export async function installWorkshopModLocally(
  rootDirectory: string,
  options: ProjectOptions = {},
): Promise<string> {
  const { artifactDirectory, metadata } = await packageWorkshopMod(
    rootDirectory,
    options,
  );
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
