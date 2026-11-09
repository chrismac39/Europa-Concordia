export type AdminScaleStatistic = "median" | "mean";

export interface AdminScaleRecord {
  countryIso3: string;
  countryName: string;
  selectedLevel: string;
  levelName: string;
  typicalAreaKm2: number;
  areaStatistic: AdminScaleStatistic;
  unitCount: number;
  sourceDataset: string;
  sourceVersion: string;
  sourceUrl: string;
  boundaryId?: string;
  boundaryLicense?: string;
  boundarySource?: string;
  boundarySourceUrl?: string;
  sourceDataUpdateDate?: string;
}

export interface AdminScaleIndex {
  formatVersion: 1;
  generatedAt: string;
  referenceAreaKm2: number;
  referenceDescription: string;
  countries: Record<string, AdminScaleRecord>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function parseAdminScaleIndex(value: unknown): AdminScaleIndex {
  if (
    !isRecord(value) ||
    value.formatVersion !== 1 ||
    typeof value.generatedAt !== "string" ||
    typeof value.referenceAreaKm2 !== "number" ||
    !Number.isFinite(value.referenceAreaKm2) ||
    typeof value.referenceDescription !== "string" ||
    !isRecord(value.countries)
  ) {
    throw new Error("Invalid administrative scale index");
  }

  const countries: Record<string, AdminScaleRecord> = {};
  for (const [iso3, valueRecord] of Object.entries(value.countries)) {
    const areaStatistic = isRecord(valueRecord)
      ? valueRecord.areaStatistic
      : undefined;
    if (
      !isRecord(valueRecord) ||
      valueRecord.countryIso3 !== iso3 ||
      typeof valueRecord.countryName !== "string" ||
      typeof valueRecord.selectedLevel !== "string" ||
      typeof valueRecord.levelName !== "string" ||
      typeof valueRecord.typicalAreaKm2 !== "number" ||
      !Number.isFinite(valueRecord.typicalAreaKm2) ||
      (areaStatistic !== "mean" && areaStatistic !== "median") ||
      typeof valueRecord.unitCount !== "number" ||
      !Number.isFinite(valueRecord.unitCount) ||
      typeof valueRecord.sourceDataset !== "string" ||
      typeof valueRecord.sourceVersion !== "string" ||
      typeof valueRecord.sourceUrl !== "string"
    ) {
      throw new Error(`Invalid administrative scale entry for ${iso3}`);
    }
    countries[iso3] = {
      countryIso3: valueRecord.countryIso3,
      countryName: valueRecord.countryName,
      selectedLevel: valueRecord.selectedLevel,
      levelName: valueRecord.levelName,
      typicalAreaKm2: valueRecord.typicalAreaKm2,
      areaStatistic,
      unitCount: valueRecord.unitCount,
      sourceDataset: valueRecord.sourceDataset,
      sourceVersion: valueRecord.sourceVersion,
      sourceUrl: valueRecord.sourceUrl,
      ...(typeof valueRecord.boundaryId === "string"
        ? { boundaryId: valueRecord.boundaryId }
        : {}),
      ...(typeof valueRecord.boundaryLicense === "string"
        ? { boundaryLicense: valueRecord.boundaryLicense }
        : {}),
      ...(typeof valueRecord.boundarySource === "string"
        ? { boundarySource: valueRecord.boundarySource }
        : {}),
      ...(typeof valueRecord.boundarySourceUrl === "string"
        ? { boundarySourceUrl: valueRecord.boundarySourceUrl }
        : {}),
      ...(typeof valueRecord.sourceDataUpdateDate === "string"
        ? { sourceDataUpdateDate: valueRecord.sourceDataUpdateDate }
        : {}),
    };
  }

  return {
    formatVersion: 1,
    generatedAt: value.generatedAt,
    referenceAreaKm2: value.referenceAreaKm2,
    referenceDescription: value.referenceDescription,
    countries,
  };
}

export function getAdminScaleRecord(
  index: AdminScaleIndex,
  countryIso3: string | undefined,
): AdminScaleRecord | undefined {
  return countryIso3 ? index.countries[countryIso3.toUpperCase()] : undefined;
}
