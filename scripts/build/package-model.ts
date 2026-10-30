export type PackageType = "upstream" | "maintained" | "original";
export type ConflictResolutionType =
  "load-order" | "merged-patch" | "incompatible";
export type SemanticResolutionType =
  ConflictResolutionType | "native-merge" | "shared-state";

export type PackageSource =
  | {
      type: "git";
      url: string;
      revision: string;
      path: string;
      publishedWorkshopId?: string;
    }
  | {
      type: "steam-workshop";
      workshopId: string;
      snapshotChecksum: string;
      path: string;
    }
  | {
      type: "local";
      path: string;
    };

export interface ConcordiaPackage {
  id: string;
  name: string;
  type: PackageType;
  source: PackageSource;
  author: string;
  targetGameVersion: string;
  version: string;
  dependencies: string[];
  attribution: {
    license: string;
    notice?: string;
  };
}

export type ProfileSourcePin =
  | {
      type: "steam-workshop";
      workshopId: string;
      snapshotChecksum: string;
    }
  | {
      type: "git";
      revision: string;
      publishedWorkshopId?: string;
    }
  | {
      type: "local";
    };

export interface ProfileMod {
  packageId: string;
  name: string;
  version: string;
  source: ProfileSourcePin;
}

export interface ProfileExclusion {
  packageId: string;
  reason: string;
}

interface ProfilePatchMetadata {
  id: string;
  operation?: "add" | "replace";
  targetPath: string;
  targetPackageId: string;
  resolutionType: "merged-patch";
  reason: string;
  preserves: string[];
  suppresses: string[];
}

export type ProfilePatch =
  | (ProfilePatchMetadata & {
      sourcePath: string;
      generatedFrom?: never;
    })
  | (ProfilePatchMetadata & {
      sourcePath?: never;
      generatedFrom: {
        strategy:
          | "gh-exchequer-glorp-ui-left-panel"
          | "glorp-ui-construction-manager-production"
          | "glorp-ui-construction-manager-location-window";
        sourceFingerprint: string;
      };
    });

export interface PlaysetProfile {
  version: 1;
  id: string;
  name: string;
  targetGameVersion: string;
  mods: ProfileMod[];
  excludedMods?: ProfileExclusion[];
  knownRisks?: Array<{
    packageId: string;
    reason: string;
  }>;
  loadOrder: string[];
  patches: ProfilePatch[];
  patchMod: {
    name: string;
    id: string;
    version: string;
    shortDescription: string;
    tags: string[];
  };
}

export interface PackageManifest {
  version: 1;
  packages: ConcordiaPackage[];
}

export interface BuildConfiguration {
  version: 1;
  targetGameVersion: string;
  defaultProfile: string;
  packagesFile: string;
  conflictRulesFile: string;
  outputDirectory: string;
}

export interface FilePathResolution {
  path: string;
  packages: string[];
  resolutionType: ConflictResolutionType;
  sourceFingerprints?: Record<string, string>;
  winner?: string;
  override?: string;
  patchId?: string;
  reason: string;
}

export interface ConflictRules {
  version: 1;
  filePathCollisions: "error";
  filePathResolutions: FilePathResolution[];
  semanticResolutions: Array<{
    fingerprint: string;
    resolutionType: SemanticResolutionType;
    winner?: string;
    decision: string;
    reason: string;
  }>;
  definitionConflicts: "deferred";
}

export interface ProjectConfiguration {
  rootDirectory: string;
  build: BuildConfiguration;
  profile: PlaysetProfile;
  conflictRules: ConflictRules;
  packages: ConcordiaPackage[];
  packageCatalog: ConcordiaPackage[];
}

export interface ProjectOptions {
  targetGameVersion?: string;
  profileId?: string;
}
