import { lstat, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import type {
  BuildConfiguration,
  ConcordiaPackage,
  ConflictRules,
  PlaysetProfile,
  PackageManifest,
  PackageSource,
  ProfileExclusion,
  ProfileMod,
  ProjectConfiguration,
  ProjectOptions,
} from "./package-model.js";

const packageIdPattern = /^[a-z0-9][a-z0-9-]*$/;
const packageVersionPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const gameVersionPattern = /^\d+\.\d+\.\d+$/;
const pinnedRevisionPattern = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/i;
const snapshotChecksumPattern = /^sha256:[a-f0-9]{64}$/i;
const profilePatchIdPattern = /^[a-z0-9][a-z0-9-]*$/;
const profileModIdPattern = /^[a-z0-9][a-z0-9_-]*$/;

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
    typeof value.defaultProfile !== "string" ||
    !profilePatchIdPattern.test(value.defaultProfile) ||
    typeof value.packagesFile !== "string" ||
    typeof value.conflictRulesFile !== "string" ||
    typeof value.outputDirectory !== "string"
  ) {
    throw new Error(
      "Build configuration must have version 1, targetGameVersion, defaultProfile, packagesFile, conflictRulesFile, and outputDirectory",
    );
  }

  return value as unknown as BuildConfiguration;
}

function validateProfile(value: unknown): PlaysetProfile {
  const errors: string[] = [];
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    typeof value.id !== "string" ||
    !profilePatchIdPattern.test(value.id) ||
    typeof value.name !== "string" ||
    value.name.trim() === "" ||
    typeof value.targetGameVersion !== "string" ||
    !gameVersionPattern.test(value.targetGameVersion) ||
    !Array.isArray(value.mods) ||
    (value.excludedMods !== undefined && !Array.isArray(value.excludedMods)) ||
    !Array.isArray(value.loadOrder) ||
    !Array.isArray(value.patches) ||
    !isRecord(value.patchMod)
  ) {
    throw new Error("Playset profile has an invalid structure");
  }

  const mods: ProfileMod[] = [];
  value.mods.forEach((mod, index) => {
    const label = `profile.mods[${index}]`;
    if (!isRecord(mod)) {
      errors.push(`${label} must be an object`);
      return;
    }
    if (
      typeof mod.packageId !== "string" ||
      !packageIdPattern.test(mod.packageId)
    ) {
      errors.push(`${label}.packageId must be a package identifier`);
    }
    requiredString(mod.name, `${label}.name`, errors);
    if (
      typeof mod.version !== "string" ||
      !packageVersionPattern.test(mod.version)
    ) {
      errors.push(`${label}.version must use MAJOR.MINOR.PATCH format`);
    }
    if (!isRecord(mod.source)) {
      errors.push(`${label}.source must be an object`);
    } else if (mod.source.type === "steam-workshop") {
      if (
        typeof mod.source.workshopId !== "string" ||
        !/^\d+$/.test(mod.source.workshopId)
      ) {
        errors.push(`${label}.source.workshopId must contain only digits`);
      }
      if (
        typeof mod.source.snapshotChecksum !== "string" ||
        !snapshotChecksumPattern.test(mod.source.snapshotChecksum)
      ) {
        errors.push(
          `${label}.source.snapshotChecksum must be a sha256:<64 hex characters> value`,
        );
      }
    } else if (mod.source.type === "git") {
      if (
        typeof mod.source.revision !== "string" ||
        !pinnedRevisionPattern.test(mod.source.revision)
      ) {
        errors.push(`${label}.source.revision must be a full commit hash`);
      }
    } else if (mod.source.type !== "local") {
      errors.push(`${label}.source.type must be git, steam-workshop, or local`);
    }
    if (
      typeof mod.packageId === "string" &&
      typeof mod.name === "string" &&
      typeof mod.version === "string" &&
      isRecord(mod.source) &&
      (mod.source.type === "steam-workshop" ||
        mod.source.type === "git" ||
        mod.source.type === "local")
    ) {
      mods.push(mod as unknown as ProfileMod);
    }
  });
  const modIds = mods.map((mod) => mod.packageId);
  if (new Set(modIds).size !== modIds.length) {
    errors.push("Profile package identifiers must be unique");
  }

  const excludedMods: ProfileExclusion[] = [];
  const rawExcludedMods: unknown[] = Array.isArray(value.excludedMods)
    ? value.excludedMods
    : [];
  rawExcludedMods.forEach((excludedMod, index) => {
    const label = `profile.excludedMods[${index}]`;
    if (!isRecord(excludedMod)) {
      errors.push(`${label} must be an object`);
      return;
    }
    if (
      typeof excludedMod.packageId !== "string" ||
      !packageIdPattern.test(excludedMod.packageId)
    ) {
      errors.push(`${label}.packageId must be a package identifier`);
    }
    requiredString(excludedMod.reason, `${label}.reason`, errors);
    if (
      typeof excludedMod.packageId === "string" &&
      typeof excludedMod.reason === "string"
    ) {
      excludedMods.push(excludedMod as unknown as ProfileExclusion);
    }
  });
  const excludedModIds = excludedMods.map((mod) => mod.packageId);
  if (new Set(excludedModIds).size !== excludedModIds.length) {
    errors.push("Excluded package identifiers must be unique");
  }
  if (excludedModIds.some((packageId) => modIds.includes(packageId))) {
    errors.push("A package cannot be both selected and explicitly excluded");
  }

  const patchModId = value.patchMod.id;
  const loadOrder: unknown[] = Array.isArray(value.loadOrder)
    ? value.loadOrder
    : [];
  const orderedModIds = loadOrder
    .slice(0, -1)
    .filter((entry): entry is string => typeof entry === "string");
  if (
    !loadOrder.every(
      (entry, index) =>
        typeof entry === "string" &&
        (index === loadOrder.length - 1
          ? entry === patchModId
          : packageIdPattern.test(entry)),
    )
  ) {
    errors.push(
      "profile.loadOrder must contain package IDs followed by the Concordia patch ID",
    );
  } else if (
    new Set(orderedModIds).size !== orderedModIds.length ||
    orderedModIds.length !== modIds.length ||
    orderedModIds.some((packageId) => !modIds.includes(packageId)) ||
    loadOrder.at(-1) !== patchModId
  ) {
    errors.push(
      "profile.loadOrder must list every selected mod once and the Concordia patch last",
    );
  }

  const patchIds = new Set<string>();
  const patchTargets = new Set<string>();
  value.patches.forEach((patch, index) => {
    const label = `profile.patches[${index}]`;
    if (!isRecord(patch)) {
      errors.push(`${label} must be an object`);
      return;
    }
    const patchId = patch.id;
    if (typeof patchId !== "string" || !profilePatchIdPattern.test(patchId)) {
      errors.push(`${label}.id must be a patch identifier`);
    } else if (patchIds.has(patchId)) {
      errors.push(`${label}.id duplicates another patch`);
    } else {
      patchIds.add(patchId);
    }
    for (const field of ["sourcePath", "targetPath"] as const) {
      const patchPath = patch[field];
      const pathIsValid = requiredString(
        patchPath,
        `${label}.${field}`,
        errors,
      );
      if (
        typeof patchPath === "string" &&
        pathIsValid &&
        (path.isAbsolute(patchPath) ||
          patchPath.includes("\\") ||
          patchPath.split("/").includes(".."))
      ) {
        errors.push(
          `${label}.${field} must be a normalized relative POSIX path`,
        );
      }
    }
    if (
      typeof patch.targetPackageId !== "string" ||
      !packageIdPattern.test(patch.targetPackageId)
    ) {
      errors.push(`${label}.targetPackageId must be a package identifier`);
    }
    if (patch.resolutionType !== "merged-patch") {
      errors.push(`${label}.resolutionType must be merged-patch`);
    }
    if (
      patch.operation !== undefined &&
      patch.operation !== "add" &&
      patch.operation !== "replace"
    ) {
      errors.push(`${label}.operation must be add or replace when provided`);
    }
    requiredString(patch.reason, `${label}.reason`, errors);
    for (const field of ["preserves", "suppresses"] as const) {
      if (
        !Array.isArray(patch[field]) ||
        !patch[field].every(
          (entry) => typeof entry === "string" && entry.trim() !== "",
        )
      ) {
        errors.push(`${label}.${field} must be a non-empty string array`);
      }
    }
    if (typeof patch.targetPath === "string") {
      const collisionKey = patch.targetPath.toLocaleLowerCase("en-US");
      if (patchTargets.has(collisionKey)) {
        errors.push(`${label}.targetPath duplicates another patch target`);
      }
      patchTargets.add(collisionKey);
    }
  });

  const patchMod = value.patchMod;
  for (const field of ["name", "id", "version", "shortDescription"] as const) {
    requiredString(patchMod[field], `profile.patchMod.${field}`, errors);
  }
  if (
    typeof patchMod.id === "string" &&
    !profileModIdPattern.test(patchMod.id)
  ) {
    errors.push(
      "profile.patchMod.id must use lowercase letters, digits, _ or -",
    );
  }
  if (
    typeof patchMod.version === "string" &&
    !packageVersionPattern.test(patchMod.version)
  ) {
    errors.push("profile.patchMod.version must use MAJOR.MINOR.PATCH format");
  }
  if (
    !Array.isArray(patchMod.tags) ||
    !patchMod.tags.every((tag) => typeof tag === "string" && tag.trim() !== "")
  ) {
    errors.push("profile.patchMod.tags must be a non-empty string array");
  }
  if (errors.length > 0) {
    throw new Error(`Invalid playset profile:\n- ${errors.join("\n- ")}`);
  }
  return value as unknown as PlaysetProfile;
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
    const hasWinner = resolution.winner !== undefined;
    const hasOverride = resolution.override !== undefined;
    const packagesAreValid =
      Array.isArray(resolutionPackages) &&
      resolutionPackages.length >= (hasOverride ? 1 : 2) &&
      resolutionPackages.every(
        (packageId) =>
          typeof packageId === "string" && packageIdPattern.test(packageId),
      ) &&
      new Set(resolutionPackages).size === resolutionPackages.length;
    if (!packagesAreValid) {
      errors.push(`${label}.packages must contain unique package identifiers`);
    }
    if (
      !["load-order", "merged-patch", "incompatible"].includes(
        String(resolution.resolutionType),
      )
    ) {
      errors.push(
        `${label}.resolutionType must be load-order, merged-patch, or incompatible`,
      );
    }
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
    if (resolution.sourceFingerprints !== undefined) {
      if (!isRecord(resolution.sourceFingerprints)) {
        errors.push(`${label}.sourceFingerprints must be an object`);
      } else {
        for (const [packageId, fingerprint] of Object.entries(
          resolution.sourceFingerprints,
        )) {
          if (
            !packageIdPattern.test(packageId) ||
            typeof fingerprint !== "string" ||
            !/^[a-f0-9]{64}$/i.test(fingerprint)
          ) {
            errors.push(
              `${label}.sourceFingerprints must map package identifiers to SHA-256 hashes`,
            );
            break;
          }
        }
      }
    }
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
    if (
      ![
        "merged-patch",
        "native-merge",
        "shared-state",
        "incompatible",
      ].includes(String(resolution.resolutionType))
    ) {
      errors.push(
        `${label}.resolutionType must be merged-patch, native-merge, shared-state, or incompatible`,
      );
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

function assertDependencies(
  packages: ConcordiaPackage[],
  allPackages: ConcordiaPackage[],
): void {
  const packageById = new Map(
    allPackages.map((packageValue) => [packageValue.id, packageValue]),
  );
  const selectedIds = new Set(packages.map((packageValue) => packageValue.id));
  for (const packageValue of packages) {
    for (const dependencyId of packageValue.dependencies) {
      const dependency = packageById.get(dependencyId);
      if (!dependency) {
        throw new Error(
          `${packageValue.id} depends on unknown package ${dependencyId}`,
        );
      }
      if (!selectedIds.has(dependencyId)) {
        throw new Error(
          `${packageValue.id} depends on unselected package ${dependencyId}`,
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
      if (dependency) {
        visit(dependency);
      }
    }
    visiting.delete(packageValue.id);
    visited.add(packageValue.id);
  };

  packages.forEach(visit);
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
  const profileId =
    options.profileId ?? effectiveBuildConfiguration.defaultProfile;
  if (!profilePatchIdPattern.test(profileId)) {
    throw new Error("profileId must be a lowercase profile identifier");
  }
  const profilePath = path.join(rootDirectory, "profiles", `${profileId}.json`);
  const profile = validateProfile(
    JSON.parse(await readFile(profilePath, "utf8")) as unknown,
  );
  if (profile.id !== profileId) {
    throw new Error(
      `Profile file ${profilePath} declares id ${profile.id}, not ${profileId}`,
    );
  }
  const effectiveTargetGameVersion =
    options.targetGameVersion ?? profile.targetGameVersion;
  if (effectiveTargetGameVersion !== profile.targetGameVersion) {
    throw new Error(
      `Profile ${profile.id} targets EU5 ${profile.targetGameVersion}, but this build targets EU5 ${effectiveTargetGameVersion}`,
    );
  }
  effectiveBuildConfiguration.targetGameVersion = profile.targetGameVersion;
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

  const packagesById = new Map(
    packageManifest.packages.map((packageValue) => [
      packageValue.id,
      packageValue,
    ]),
  );
  const selectedPackages = profile.mods.map((profileMod) => {
    const packageValue = packagesById.get(profileMod.packageId);
    if (!packageValue) {
      throw new Error(
        `Profile ${profile.id} selects unknown package ${profileMod.packageId}`,
      );
    }
    if (
      packageValue.name !== profileMod.name ||
      packageValue.version !== profileMod.version ||
      packageValue.source.type !== profileMod.source.type ||
      (packageValue.source.type === "steam-workshop" &&
        profileMod.source.type === "steam-workshop" &&
        (packageValue.source.workshopId !== profileMod.source.workshopId ||
          packageValue.source.snapshotChecksum !==
            profileMod.source.snapshotChecksum)) ||
      (packageValue.source.type === "git" &&
        profileMod.source.type === "git" &&
        packageValue.source.revision !== profileMod.source.revision)
    ) {
      throw new Error(
        `Profile ${profile.id} has a stale version or source pin for ${profileMod.packageId}; update the profile and rerun analysis.`,
      );
    }
    return packageValue;
  });
  for (const excludedMod of profile.excludedMods ?? []) {
    if (!packagesById.has(excludedMod.packageId)) {
      throw new Error(
        `Profile ${profile.id} excludes unknown package ${excludedMod.packageId}`,
      );
    }
  }
  assertDependencies(selectedPackages, packageManifest.packages);
  const loadOrderPosition = new Map(
    profile.loadOrder.map((packageId, index) => [packageId, index]),
  );
  for (const packageValue of selectedPackages) {
    for (const dependencyId of packageValue.dependencies) {
      if (
        (loadOrderPosition.get(dependencyId) ?? Number.POSITIVE_INFINITY) >=
        (loadOrderPosition.get(packageValue.id) ?? -1)
      ) {
        throw new Error(
          `${dependencyId} must load before dependent mod ${packageValue.id}`,
        );
      }
    }
  }

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

  for (const packageValue of selectedPackages) {
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

  const selectedPackageIds = new Set(selectedPackages.map((value) => value.id));
  const patchTargets = new Set<string>();
  for (const patch of profile.patches) {
    if (!selectedPackageIds.has(patch.targetPackageId)) {
      throw new Error(
        `Patch ${patch.id} targets unselected package ${patch.targetPackageId}`,
      );
    }
    if (
      !patch.sourcePath.startsWith("integration/patches/") &&
      !patch.sourcePath.startsWith("integration/overrides/")
    ) {
      throw new Error(
        `Patch ${patch.id} must be authored under integration/patches/ or integration/overrides/`,
      );
    }
    const targetRoot = patch.targetPath
      .split("/")[0]
      .toLocaleLowerCase("en-US");
    if (
      !["dlc", "in_game", "loading_screen", "main_menu"].includes(targetRoot)
    ) {
      throw new Error(
        `Patch ${patch.id} target must be inside an EU5 content root`,
      );
    }
    const targetKey = patch.targetPath.toLocaleLowerCase("en-US");
    if (patchTargets.has(targetKey)) {
      throw new Error(`Multiple profile patches target ${patch.targetPath}`);
    }
    patchTargets.add(targetKey);
    const sourcePath = resolveProjectPath(
      rootDirectory,
      patch.sourcePath,
      `Patch ${patch.id}.sourcePath`,
    );
    if ((await lstat(sourcePath).catch(() => undefined))?.isSymbolicLink()) {
      throw new Error(`Patch source cannot be a symbolic link: ${sourcePath}`);
    }
    if (!(await stat(sourcePath).catch(() => undefined))?.isFile()) {
      throw new Error(`Patch source does not exist: ${sourcePath}`);
    }
    const packageValue = packagesById.get(patch.targetPackageId);
    if (!packageValue) {
      throw new Error(`Patch ${patch.id} targets an unknown package`);
    }
    const operation = patch.operation ?? "replace";
    const targetSourcePath = path.join(
      rootDirectory,
      packageValue.source.path,
      ...patch.targetPath.split("/"),
    );
    const targetExists =
      (await stat(targetSourcePath).catch(() => undefined))?.isFile() ?? false;
    if (operation === "replace" && !targetExists) {
      throw new Error(
        `Patch ${patch.id} target does not replace a file in ${patch.targetPackageId}: ${patch.targetPath}`,
      );
    }
    if (operation === "add") {
      for (const selectedPackage of selectedPackages) {
        const sourcePath = path.join(
          rootDirectory,
          selectedPackage.source.path,
          ...patch.targetPath.split("/"),
        );
        if ((await stat(sourcePath).catch(() => undefined))?.isFile()) {
          throw new Error(
            `Patch ${patch.id} adds ${patch.targetPath}, but that path already exists in selected package ${selectedPackage.id}`,
          );
        }
      }
    }
    const patchContents = await readFile(sourcePath, "utf8");
    for (const definition of patch.preserves) {
      if (!patchContents.includes(definition)) {
        throw new Error(
          `Patch ${patch.id} does not preserve required content "${definition}"`,
        );
      }
    }
    for (const definition of patch.suppresses) {
      if (patchContents.includes(definition)) {
        throw new Error(
          `Patch ${patch.id} still contains suppressed content "${definition}"`,
        );
      }
    }
  }

  return {
    rootDirectory,
    build: effectiveBuildConfiguration,
    profile,
    conflictRules,
    packages: selectedPackages,
    packageCatalog: packageManifest.packages,
  };
}
