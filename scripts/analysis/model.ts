import type { ProjectConfiguration } from "../build/package-model.js";

export type FindingType =
  | "path"
  | "definition"
  | "localization"
  | "global-variable"
  | "system-overlap"
  | "system-interaction"
  | "system-observation";

export interface FindingSource {
  packageId: string;
  packageName: string;
  relativePath: string;
  absolutePath: string;
}

export interface ScriptBehaviorProfile {
  eventReferences: string[];
  dependencySymbols: string[];
  countryOutcomes: string[];
  variablesWritten: string[];
  importantConditions: string[];
  importantValues: string[];
}

export interface DefinitionVariantAnalysis {
  packageId: string;
  packageName: string;
  symbol: string;
  mode: string;
  direct: ScriptBehaviorProfile;
  downstream: ScriptBehaviorProfile;
}

export interface ConflictFinding {
  fingerprint: string;
  type: FindingType;
  title: string;
  summary: string;
  packages: string[];
  symbols: string[];
  sources: FindingSource[];
  definitionVariants?: DefinitionVariantAnalysis[];
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
