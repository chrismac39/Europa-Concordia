import type { ProjectConfiguration } from "../build/package-model.js";

export type FindingType =
  "path" | "definition" | "localization" | "global-variable" | "system-overlap";

export interface FindingSource {
  packageId: string;
  packageName: string;
  relativePath: string;
  absolutePath: string;
}

export interface ConflictFinding {
  fingerprint: string;
  type: FindingType;
  title: string;
  summary: string;
  packages: string[];
  symbols: string[];
  sources: FindingSource[];
  resolved: boolean;
  resolution?: string;
}

export interface ConflictAnalysis {
  formatVersion: 1;
  targetGameVersion: string;
  packageCount: number;
  generatedAt: string;
  findings: ConflictFinding[];
}

export interface PackageFile {
  packageId: string;
  packageName: string;
  relativePath: string;
  absolutePath: string;
}

export type AnalysisConfiguration = ProjectConfiguration;
