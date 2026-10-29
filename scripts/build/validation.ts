import { lstat, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import type {
  BuildConfiguration,
  ConcordiaPackage,
  ConflictRules,
  PackageManifest,
  PackageSource,
  ProjectConfiguration,
  ProjectOptions,
} from "./package-model.js";

const packageIdPattern = /^[a-z0-9][a-z0-9-]*$/;
const packageVersionPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const gameVersionPattern = /^\d+\.\d+\.\d+$/;
const pinnedRevisionPattern = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/i;
const snapshotChecksumPattern = /^sha256:[a-f0-9]{64}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(
  value: unknown,
  label: string,
  errors: string[],
): value is string {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${label} must be a non-empty string`);
    return false;
  }
  return true;
}

function validateSource(
  value: unknown,
  label: string,
  errors: string[],
): value is PackageSource {
  if (!isRecord(value)) {
    errors.push(`${label} must be an object`);
    return false;
  }

  const pathIsValid = requiredString(value.path, `${label}.path`, errors);
  if (typeof value.type !== "string") {
    errors.push(`${label}.type must be git, steam-workshop, or local`);
    return false;
  }

  if (value.type === "git") {
    const urlIsValid = requiredString(value.url, `${label}.url`, errors);
    if (
      typeof value.revision !== "string" ||
      !pinnedRevisionPattern.test(value.revision)
    ) {
      errors.push(
        `${label}.revision must be a full 40- or 64-character commit hash`,
      );
    }
    return pathIsValid && urlIsValid;
  }

  if (value.type === "steam-workshop") {
    const idIsValid =
      typeof value.workshopId === "string" && /^\d+$/.test(value.workshopId);
    if (!idIsValid) {
      errors.push(`${label}.workshopId must contain only digits`);
    }
    if (
      typeof value.snapshotChecksum !== "string" ||
      !snapshotChecksumPattern.test(value.snapshotChecksum)
    ) {
      errors.push(
        `${label}.snapshotChecksum must be a sha256:<64 hex characters> value`,
      );
    }
    return pathIsValid && idIsValid;
  }

  if (value.type === "local") {
    return pathIsValid;
  }

  errors.push(`${label}.type must be git, steam-workshop, or local`);
  return false;
}

function validatePackage(
  value: unknown,
  index: number,
  errors: string[],
): value is ConcordiaPackage {
  const label = `packages[${index}]`;
  if (!isRecord(value)) {
    errors.push(`${label} must be an object`);
    return false;
  }

  const initialErrorCount = errors.length;
  if (typeof value.id !== "string" || !packageIdPattern.test(value.id)) {
    errors.push(
      `${label}.id must be a unique lowercase identifier using letters, digits, and hyphens`,
    );
  }

  requiredString(value.name, `${label}.name`, errors);
  if (!["upstream", "maintained", "original"].includes(String(value.type))) {
    errors.push(`${label}.type must be upstream, maintained, or original`);
  }
  validateSource(value.source, `${label}.source`, errors);
  requiredString(value.author, `${label}.author`, errors);
  if (
    typeof value.targetGameVersion !== "string" ||
    !gameVersionPattern.test(value.targetGameVersion)
  ) {
    errors.push(`${label}.targetGameVersion must use MAJOR.MINOR.PATCH format`);
  }

  if (
    typeof value.version !== "string" ||
    !packageVersionPattern.test(value.version)
  ) {
    errors.push(`${label}.version must use MAJOR.MINOR.PATCH format`);
  }
  if (typeof value.enabled !== "boolean") {
    errors.push(`${label}.enabled must be a boolean`);
  }
  if (
    !Array.isArray(value.dependencies) ||
    !value.dependencies.every(
      (dependency) =>
        typeof dependency === "string" && packageIdPattern.test(dependency),
    )
  ) {
    errors.push(
      `${label}.dependencies must be an array of package identifiers`,
    );
  }
  if (!isRecord(value.attribution)) {
    errors.push(`${label}.attribution must be an object`);
  } else {
    requiredString(
      value.attribution.license,
      `${label}.attribution.license`,
      errors,
    );
    if (
      value.attribution.notice !== undefined &&
      typeof value.attribution.notice !== "string"
    ) {
      errors.push(`${label}.attribution.notice must be a string when provided`);
    }
  }

  return errors.length === initialErrorCount;
}

function validateManifest(value: unknown): PackageManifest {
  const errors: string[] = [];
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    !Array.isArray(value.packages)
  ) {
    throw new Error(
      "Package manifest must have version 1 and a packages array",
    );
  }

  value.packages.forEach((packageValue, index) =>
    validatePackage(packageValue, index, errors),
  );
  const ids = value.packages
    .filter(isRecord)
    .map((packageValue) => packageValue.id)
    .filter((id): id is string => typeof id === "string");
  if (new Set(ids).size !== ids.length) {
    errors.push("Package identifiers must be unique");
  }

  if (errors.length > 0) {
    throw new Error(`Invalid package manifest:\n- ${errors.join("\n- ")}`);
  }
  return value as unknown as PackageManifest;
}

function validateBuildConfiguration(value: unknown): BuildConfiguration {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    typeof value.targetGameVersion !== "string" ||
    !gameVersionPattern.test(value.targetGameVersion) ||
    typeof value.packagesFile !== "string" ||
    typeof value.conflictRulesFile !== "string" ||
    typeof value.outputDirectory !== "string"
  ) {
    throw new Error(
      "Build configuration must have version 1, targetGameVersion, packagesFile, conflictRulesFile, and outputDirectory",
    );
  }

  return value as unknown as BuildConfiguration;
}

function validateConflictRules(value: unknown): ConflictRules {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    value.filePathCollisions !== "error" ||
    !Array.isArray(value.filePathResolutions) ||
    !Array.isArray(value.semanticResolutions) ||
    value.definitionConflicts !== "deferred"
  ) {
    throw new Error(
      "Conflict rules must have version 1, error file-path handling, filePathResolutions and semanticResolutions arrays, and deferred definition conflicts",
    );
  }

  const errors: string[] = [];
  const paths = new Set<string>();
  value.filePathResolutions.forEach((resolution, index) => {
    const label = `filePathResolutions[${index}]`;
    if (!isRecord(resolution)) {
      errors.push(`${label} must be an object`);
      return;
    }
    const resolutionPath = resolution.path;
    const pathIsValid = requiredString(resolutionPath, `${label}.path`, errors);
    if (
      pathIsValid &&
      (path.isAbsolute(resolutionPath) ||
        resolutionPath.includes("\\") ||
        resolutionPath.split("/").includes(".."))
    ) {
      errors.push(`${label}.path must be a normalized relative POSIX path`);
    }
    const resolutionPackages = resolution.packages;
    const packagesAreValid =
      Array.isArray(resolutionPackages) &&
      resolutionPackages.length >= 2 &&
      resolutionPackages.every(
        (packageId) =>
          typeof packageId === "string" && packageIdPattern.test(packageId),
      ) &&
      new Set(resolutionPackages).size === resolutionPackages.length;
    if (!packagesAreValid) {
      errors.push(`${label}.packages must contain unique package identifiers`);
    }
    const hasWinner = resolution.winner !== undefined;
    const hasOverride = resolution.override !== undefined;
    if (hasWinner === hasOverride) {
      errors.push(`${label} must specify exactly one of winner or override`);
    } else if (
      hasWinner &&
      (typeof resolution.winner !== "string" ||
        !packageIdPattern.test(resolution.winner) ||
        (packagesAreValid && !resolutionPackages.includes(resolution.winner)))
    ) {
      errors.push(`${label}.winner must identify one of the listed packages`);
    } else if (
      hasOverride &&
      (typeof resolution.override !== "string" ||
        path.isAbsolute(resolution.override) ||
        resolution.override.includes("\\") ||
        resolution.override.split("/").includes(".."))
    ) {
      errors.push(`${label}.override must be a normalized relative POSIX path`);
    }
    requiredString(resolution.reason, `${label}.reason`, errors);
    if (pathIsValid) {
      const collisionKey = resolutionPath.toLocaleLowerCase("en-US");
      if (paths.has(collisionKey)) {
        errors.push(`${label}.path duplicates another resolution`);
      }
      paths.add(collisionKey);
    }
  });
  const semanticFingerprints = new Set<string>();
  value.semanticResolutions.forEach((resolution, index) => {
    const label = `semanticResolutions[${index}]`;
    if (!isRecord(resolution)) {
      errors.push(`${label} must be an object`);
      return;
    }
    if (
      typeof resolution.fingerprint !== "string" ||
      !/^[a-f0-9]{16}$/.test(resolution.fingerprint)
    ) {
      errors.push(`${label}.fingerprint must be 16 lowercase hex characters`);
    } else if (semanticFingerprints.has(resolution.fingerprint)) {
      errors.push(`${label}.fingerprint duplicates another resolution`);
    } else {
      semanticFingerprints.add(resolution.fingerprint);
    }
    requiredString(resolution.decision, `${label}.decision`, errors);
    requiredString(resolution.reason, `${label}.reason`, errors);
  });
  if (errors.length > 0) {
    throw new Error(`Invalid conflict rules:\n- ${errors.join("\n- ")}`);
  }
  return value as unknown as ConflictRules;
}

function resolveProjectPath(
  rootDirectory: string,
  relativePath: string,
  label: string,
): string {
  if (path.isAbsolute(relativePath)) {
    throw new Error(`${label} must be a relative path`);
  }
  const absolutePath = path.resolve(rootDirectory, relativePath);
  const relativeToRoot = path.relative(rootDirectory, absolutePath);
  if (
    relativeToRoot === "" ||
    relativeToRoot === ".." ||
    relativeToRoot.startsWith(`..${path.sep}`)
  ) {
    throw new Error(`${label} must resolve to a path inside the project`);
  }
  return absolutePath;
}

async function assertNoSymlinks(directory: string): Promise<void> {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(
        `Symbolic links are not supported in package sources: ${entryPath}`,
      );
    }
    if (entry.isDirectory()) {
      await assertNoSymlinks(entryPath);
    }
  }
}

function assertDependencies(packages: ConcordiaPackage[]): void {
  const packageById = new Map(
    packages.map((packageValue) => [packageValue.id, packageValue]),
  );
  const enabled = packages.filter((packageValue) => packageValue.enabled);

  for (const packageValue of enabled) {
    for (const dependencyId of packageValue.dependencies) {
      const dependency = packageById.get(dependencyId);
      if (!dependency) {
        throw new Error(
          `${packageValue.id} depends on unknown package ${dependencyId}`,
        );
      }
      if (!dependency.enabled) {
        throw new Error(
          `${packageValue.id} depends on disabled package ${dependencyId}`,
        );
      }
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (packageValue: ConcordiaPackage): void => {
    if (visiting.has(packageValue.id)) {
      throw new Error(`Package dependency cycle includes ${packageValue.id}`);
    }
    if (visited.has(packageValue.id)) {
      return;
    }
    visiting.add(packageValue.id);
    for (const dependencyId of packageValue.dependencies) {
      const dependency = packageById.get(dependencyId);
      if (dependency?.enabled) {
        visit(dependency);
      }
    }
    visiting.delete(packageValue.id);
    visited.add(packageValue.id);
  };

  enabled.forEach(visit);
}

export async function validateProject(
  rootDirectory: string,
  options: ProjectOptions = {},
): Promise<ProjectConfiguration> {
  const buildFile = path.join(rootDirectory, "config", "build.json");
  const buildConfiguration = validateBuildConfiguration(
    JSON.parse(await readFile(buildFile, "utf8")) as unknown,
  );
  if (
    options.targetGameVersion !== undefined &&
    !gameVersionPattern.test(options.targetGameVersion)
  ) {
    throw new Error(
      "targetGameVersion override must use MAJOR.MINOR.PATCH format",
    );
  }
  const effectiveBuildConfiguration: BuildConfiguration = {
    ...buildConfiguration,
    targetGameVersion:
      options.targetGameVersion ?? buildConfiguration.targetGameVersion,
  };
  const packageFile = resolveProjectPath(
    rootDirectory,
    effectiveBuildConfiguration.packagesFile,
    "packagesFile",
  );
  const packageManifest = validateManifest(
    JSON.parse(await readFile(packageFile, "utf8")) as unknown,
  );
  const conflictRulesFile = resolveProjectPath(
    rootDirectory,
    effectiveBuildConfiguration.conflictRulesFile,
    "conflictRulesFile",
  );
  const conflictRules = validateConflictRules(
    JSON.parse(await readFile(conflictRulesFile, "utf8")) as unknown,
  );
  const outputDirectory = resolveProjectPath(
    rootDirectory,
    effectiveBuildConfiguration.outputDirectory,
    "outputDirectory",
  );
  const outputRelative = path.relative(rootDirectory, outputDirectory);
  const outputSegments = outputRelative.split(path.sep);
  if (outputSegments[0] !== "dist" || outputSegments.length < 2) {
    throw new Error("outputDirectory must be a child directory inside dist/");
  }

  assertDependencies(packageManifest.packages);
  const enabledPackages = packageManifest.packages
    .filter((packageValue) => packageValue.enabled)
    .sort((left, right) =>
      left.id < right.id ? -1 : left.id > right.id ? 1 : 0,
    );

  for (const resolution of conflictRules.filePathResolutions) {
    if (resolution.override === undefined) {
      continue;
    }
    const overridePath = resolveProjectPath(
      rootDirectory,
      resolution.override,
      `Override for ${resolution.path}`,
    );
    if ((await lstat(overridePath).catch(() => undefined))?.isSymbolicLink()) {
      throw new Error(
        `Conflict override cannot be a symbolic link: ${overridePath}`,
      );
    }
    if (!(await stat(overridePath).catch(() => undefined))?.isFile()) {
      throw new Error(`Conflict override does not exist: ${overridePath}`);
    }
  }

  for (const packageValue of enabledPackages) {
    if (
      packageValue.targetGameVersion !==
      effectiveBuildConfiguration.targetGameVersion
    ) {
      throw new Error(
        `${packageValue.id} targets EU5 ${packageValue.targetGameVersion}, but this build targets EU5 ${effectiveBuildConfiguration.targetGameVersion}`,
      );
    }
    const sourcePath = resolveProjectPath(
      rootDirectory,
      packageValue.source.path,
      `${packageValue.id}.source.path`,
    );
    if ((await lstat(sourcePath).catch(() => undefined))?.isSymbolicLink()) {
      throw new Error(
        `Package source cannot be a symbolic link: ${sourcePath}`,
      );
    }
    const sourceStats = await stat(sourcePath).catch(() => undefined);
    if (!sourceStats?.isDirectory()) {
      throw new Error(
        `${packageValue.id} source directory does not exist: ${sourcePath}`,
      );
    }
    await assertNoSymlinks(sourcePath);
  }

  return {
    rootDirectory,
    build: effectiveBuildConfiguration,
    conflictRules,
    packages: enabledPackages,
  };
}
