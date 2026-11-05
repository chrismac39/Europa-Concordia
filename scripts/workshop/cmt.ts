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
import path from "node:path";

export interface CmtWorkspaceOptions {
  rootDirectory: string;
  profileId: string;
  artifactDirectory: string;
  workshopDirectory: string;
  toolkitDirectory: string;
  workshopItemId: number;
  version: string;
  syncGallery?: boolean;
}

export interface CmtWorkspaceResult {
  workspaceDirectory: string;
  workshopItemId: number;
  reusedWorkshopItemId: boolean;
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

function replaceTomlValue(
  contents: string,
  key: string,
  value: string,
): string {
  const expression = new RegExp(`^(\\s*${key}\\s*=\\s*)[^#\\r\\n]*(.*)$`, "gm");
  let matches = 0;
  const replaced = contents.replace(expression, (_line, prefix, suffix) => {
    matches += 1;
    return `${prefix}${value}${suffix}`;
  });
  if (matches !== 1) {
    throw new Error(
      `CMT tools/config.toml must contain exactly one ${key} setting`,
    );
  }
  return replaced;
}

function readTomlInteger(contents: string, key: string): number {
  const matches = [
    ...contents.matchAll(
      new RegExp(`^\\s*${key}\\s*=\\s*(\\d+)\\s*(?:#.*)?$`, "gm"),
    ),
  ];
  if (matches.length !== 1) {
    throw new Error(
      `CMT tools/config.toml must contain exactly one numeric ${key} setting`,
    );
  }
  const value = Number(matches[0][1]);
  if (!Number.isSafeInteger(value)) {
    throw new Error(`CMT ${key} must be a safe integer`);
  }
  return value;
}

function addDlcSource(uploadScript: string): string {
  const sourceList = uploadScript.match(/SOURCES\s*=\s*\[([\s\S]*?)\]/);
  if (!sourceList) {
    throw new Error("CMT tools/upload.py has no recognizable SOURCES list");
  }
  if (/(?:^|\n)\s*["']dlc["']\s*,?/m.test(sourceList[1])) {
    return uploadScript;
  }
  const updatedList = sourceList[1].replace(
    /(["'])in_game\1(\s*,)/,
    '"dlc",\n    "in_game",',
  );
  if (updatedList === sourceList[1]) {
    throw new Error(
      "CMT tools/upload.py SOURCES list has no in_game entry to extend",
    );
  }
  return uploadScript.replace(
    sourceList[0],
    () => `SOURCES = [${updatedList}]`,
  );
}

function sanitizeCmtReleaseFolderName(uploadScript: string): string {
  const safeNameMarker = String.raw`clean_name = re.sub(r'[<>:"/\\|?*\x00-\x1f]'`;
  if (uploadScript.includes(safeNameMarker)) {
    return uploadScript;
  }
  const expression =
    /^([ \t]*)clean_name = clean_name\.lower\(\)\.replace\(" ", "-"\)$/gm;
  const matches = [...uploadScript.matchAll(expression)];
  if (matches.length !== 1) {
    throw new Error(
      "CMT tools/upload.py has no unique release-folder name normalization to make Windows-safe",
    );
  }
  const safeNameLine = String.raw`clean_name = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "-", clean_name.lower().replace(" ", "-")).strip(" .")`;
  return uploadScript.replace(
    expression,
    (_line, indentation: string) => `${indentation}${safeNameLine}`,
  );
}

async function optionalFileContents(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function formatChangeNotes(version: string, contents: string): string {
  const trimmed = contents.trim();
  if (!trimmed) {
    throw new Error(`Change notes for version ${version} are empty`);
  }
  const lines = trimmed.split(/\r?\n/);
  const firstLine = lines[0].trim();
  if (firstLine.startsWith("[b]Version ")) {
    if (
      !(
        firstLine === `[b]Version ${version}[/b]` ||
        firstLine.startsWith(`[b]Version ${version} `)
      ) ||
      !firstLine.endsWith("[/b]")
    ) {
      throw new Error(`Change notes heading does not match version ${version}`);
    }
    lines.shift();
  }
  const body = lines.join("\n").trim();
  if (!body) {
    throw new Error(`Change notes for version ${version} have no content`);
  }
  return `[b]v${version}:[/b]\n\n${body}\n`;
}

export async function prepareCmtWorkspace(
  options: CmtWorkspaceOptions,
): Promise<CmtWorkspaceResult> {
  if (!/^[a-z0-9][a-z0-9_-]*$/i.test(options.profileId)) {
    throw new Error(
      `Invalid profile ID for CMT workspace: ${options.profileId}`,
    );
  }
  if (
    !Number.isSafeInteger(options.workshopItemId) ||
    options.workshopItemId < 0
  ) {
    throw new Error("CMT Workshop item ID must be a non-negative integer");
  }

  const rootDirectory = path.resolve(options.rootDirectory);
  const artifactDirectory = path.resolve(options.artifactDirectory);
  const workshopDirectory = path.resolve(options.workshopDirectory);
  const toolkitDirectory = path.resolve(options.toolkitDirectory);
  const workspaceParent = path.resolve(
    rootDirectory,
    "dist",
    "cmt-workspaces",
    options.profileId,
  );
  const workspaceDirectory = path.join(workspaceParent, "project");
  assertInsideDirectory(path.resolve(rootDirectory, "dist"), workspaceParent);
  assertInsideDirectory(rootDirectory, artifactDirectory);
  assertInsideDirectory(rootDirectory, workshopDirectory);

  const toolkitToolsDirectory = path.join(toolkitDirectory, "tools");
  const uploadScriptPath = path.join(toolkitToolsDirectory, "upload.py");
  const toolkitConfigPath = path.join(toolkitToolsDirectory, "config.toml");
  const toolkitDependenciesPath = path.join(
    toolkitToolsDirectory,
    "dependencies",
  );
  const toolkitSteamworksPath = path.join(toolkitToolsDirectory, "steamworks");
  const descriptionPath = path.join(workshopDirectory, "STEAM_PAGE.bbcode");
  const galleryDirectory = path.join(workshopDirectory, "gallery");
  const changeNotesPath = path.join(
    workshopDirectory,
    "change-notes",
    `${options.version}.bbcode`,
  );

  let galleryImages: string[] = [];
  if (options.syncGallery) {
    let galleryEntries;
    try {
      galleryEntries = await readdir(galleryDirectory, {
        withFileTypes: true,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        throw new Error(
          `Gallery synchronization requested, but the directory does not exist: ${galleryDirectory}`,
        );
      }
      throw error;
    }
    if (galleryEntries.length === 0) {
      throw new Error(
        `Gallery synchronization requested, but no images were found in ${galleryDirectory}`,
      );
    }
    for (const entry of galleryEntries) {
      if (!entry.isFile() || !/\.(?:jpe?g|png)$/i.test(entry.name)) {
        throw new Error(
          `Unsupported gallery entry: ${path.join(galleryDirectory, entry.name)} (expected JPG, JPEG, or PNG files)`,
        );
      }
    }
    galleryImages = galleryEntries
      .map((entry) => entry.name)
      .sort((left, right) => (left < right ? -1 : left > right ? 1 : 0));
  }

  const [
    uploadScript,
    toolkitConfig,
    description,
    changeNotes,
    toolkitDependenciesStat,
    toolkitSteamworksStat,
  ] = await Promise.all([
    readFile(uploadScriptPath, "utf8"),
    readFile(toolkitConfigPath, "utf8"),
    readFile(descriptionPath, "utf8"),
    readFile(changeNotesPath, "utf8"),
    access(toolkitDependenciesPath).then(() => true),
    access(toolkitSteamworksPath).then(() => true),
  ]);
  if (!description.trim()) {
    throw new Error(`Workshop description is empty: ${descriptionPath}`);
  }
  if (!toolkitDependenciesStat) {
    throw new Error(
      `CMT dependencies directory not found: ${toolkitDependenciesPath}`,
    );
  }
  if (!toolkitSteamworksStat) {
    throw new Error(
      `CMT Steamworks package not found: ${toolkitSteamworksPath}`,
    );
  }

  const configPath = path.join(workspaceDirectory, "tools", "config.toml");
  const oldConfig = await optionalFileContents(configPath);
  const oldItemId =
    oldConfig === null
      ? undefined
      : readTomlInteger(oldConfig, "workshop_upload_item_id");
  const reusedWorkshopItemId =
    options.workshopItemId === 0 && oldItemId !== undefined && oldItemId > 0;
  const workshopItemId = reusedWorkshopItemId
    ? oldItemId
    : options.workshopItemId;
  let generatedConfig = toolkitConfig;
  generatedConfig = replaceTomlValue(
    generatedConfig,
    "workshop_upload_item_id",
    String(workshopItemId),
  );
  for (const [key, value] of [
    ["upload_mod_by_default", "false"],
    ["upload_workshop_pages_by_default", "false"],
    ["upload_only_on_version_change", "false"],
    ["upload_change_notes_by_default", "false"],
    ["upload_submods_by_default", "false"],
  ]) {
    generatedConfig = replaceTomlValue(generatedConfig, key, value);
  }

  const compatibleUploadScript = sanitizeCmtReleaseFolderName(
    addDlcSource(uploadScript),
  );
  await mkdir(workspaceParent, { recursive: true });
  const stagingDirectory = await mkdtemp(
    path.join(workspaceParent, ".cmt-staging-"),
  );
  try {
    for (const entry of await readdir(artifactDirectory, {
      withFileTypes: true,
    })) {
      await cp(
        path.join(artifactDirectory, entry.name),
        path.join(stagingDirectory, entry.name),
        { recursive: entry.isDirectory() },
      );
    }

    const toolsDirectory = path.join(stagingDirectory, "tools");
    const dependenciesDirectory = path.join(toolsDirectory, "dependencies");
    const workshopAssetsDirectory = path.join(
      stagingDirectory,
      "assets",
      "workshop",
    );
    await mkdir(toolsDirectory, { recursive: true });
    await cp(toolkitDependenciesPath, dependenciesDirectory, {
      recursive: true,
    });
    await cp(
      toolkitSteamworksPath,
      path.join(dependenciesDirectory, "steamworks"),
      { recursive: true },
    );
    await mkdir(workshopAssetsDirectory, { recursive: true });
    await writeFile(
      path.join(toolsDirectory, "upload.py"),
      compatibleUploadScript,
      "utf8",
    );
    await writeFile(
      path.join(toolsDirectory, "config.toml"),
      generatedConfig,
      "utf8",
    );
    await cp(
      descriptionPath,
      path.join(workshopAssetsDirectory, "workshop-description.bbcode"),
    );
    await writeFile(
      path.join(workshopAssetsDirectory, "change-notes.bbcode"),
      formatChangeNotes(options.version, changeNotes),
      "utf8",
    );
    if (galleryImages.length > 0) {
      const stagedGalleryDirectory = path.join(
        workshopAssetsDirectory,
        "gallery",
      );
      await mkdir(stagedGalleryDirectory, { recursive: true });
      for (const imageName of galleryImages) {
        await cp(
          path.join(galleryDirectory, imageName),
          path.join(stagedGalleryDirectory, imageName),
        );
      }
    }

    const existingUploadVersionPath = path.join(
      workspaceDirectory,
      "tools",
      "dependencies",
      ".upload_versions.json",
    );
    const uploadVersionCache = await optionalFileContents(
      existingUploadVersionPath,
    );
    const stagingUploadVersionPath = path.join(
      dependenciesDirectory,
      ".upload_versions.json",
    );
    await rm(stagingUploadVersionPath, { force: true });
    if (uploadVersionCache !== null) {
      await writeFile(stagingUploadVersionPath, uploadVersionCache, "utf8");
    }

    await rm(workspaceDirectory, { recursive: true, force: true });
    await rename(stagingDirectory, workspaceDirectory);
  } finally {
    await rm(stagingDirectory, { recursive: true, force: true });
  }

  return {
    workspaceDirectory,
    workshopItemId,
    reusedWorkshopItemId,
  };
}
