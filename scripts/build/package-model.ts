export type PackageType = "upstream" | "maintained" | "original";

export type PackageSource =
  | {
      type: "git";
      url: string;
      revision: string;
      path: string;
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
  enabled: boolean;
  dependencies: string[];
  attribution: {
    license: string;
    notice?: string;
  };
}

export interface PackageManifest {
  version: 1;
  packages: ConcordiaPackage[];
}

export interface BuildConfiguration {
  version: 1;
  targetGameVersion: string;
  packagesFile: string;
  outputDirectory: string;
}

export interface ProjectConfiguration {
  rootDirectory: string;
  build: BuildConfiguration;
  packages: ConcordiaPackage[];
}

export interface ProjectOptions {
  targetGameVersion?: string;
}
