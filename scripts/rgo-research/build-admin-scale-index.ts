import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AdminScaleIndex, AdminScaleRecord } from "./admin-scale.js";

const giscoBase = "https://gisco-services.ec.europa.eu/distribution/v2";
const lauUrl = `${giscoBase}/lau/geojson/LAU_RG_01M_2024_3035.geojson`;
const nuts3Url = `${giscoBase}/nuts/geojson/NUTS_RG_01M_2024_3035_LEVL_3.geojson`;
const geoBoundariesApi = "https://www.geoboundaries.org/api/current/gbOpen";
const giscoLauReference =
  "https://gisco-services.ec.europa.eu/distribution/v2/lau/lau-2024-files.html";
const giscoNutsReference =
  "https://gisco-services.ec.europa.eu/distribution/v2/nuts/nuts-2024-files.html";

interface GeoJsonFeature {
  properties?: Record<string, unknown>;
  geometry?: {
    type?: string;
    coordinates?: unknown;
  };
}

interface GeoBoundaryMetadata {
  boundaryID?: string;
  boundaryName?: string;
  boundaryISO?: string;
  boundaryYearRepresented?: string;
  boundaryType?: string;
  boundaryCanonical?: string;
  boundarySource?: string;
  boundaryLicense?: string;
  boundarySourceURL?: string;
  sourceDataUpdateDate?: string;
  admUnitCount?: string;
  meanAreaSqKM?: string;
  buildDate?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(120_000),
    headers: { "User-Agent": "Europa-Concordia-RGO-Research/1.0" },
  });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}`);
  }
  return response.json();
}

function featuresFrom(value: unknown, source: string): GeoJsonFeature[] {
  if (!isRecord(value) || !Array.isArray(value.features)) {
    throw new Error(`Unexpected GeoJSON response from ${source}`);
  }
  return value.features.filter((feature): feature is GeoJsonFeature =>
    isRecord(feature),
  );
}

function median(values: number[]): number | undefined {
  const sorted = values.filter((value) => value > 0 && Number.isFinite(value));
  if (sorted.length === 0) {
    return undefined;
  }
  sorted.sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function compareArea(left: number, right: number, target: number): number {
  return Math.abs(Math.log(left / target)) - Math.abs(Math.log(right / target));
}

function numberValue(value: unknown): number | undefined {
  const number =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;
  return Number.isFinite(number) ? number : undefined;
}

function ringArea(value: unknown): number {
  if (!Array.isArray(value) || value.length < 3) {
    return 0;
  }
  let twiceArea = 0;
  for (let index = 0; index < value.length; index += 1) {
    const current = value[index];
    const next = value[(index + 1) % value.length];
    if (
      !Array.isArray(current) ||
      !Array.isArray(next) ||
      typeof current[0] !== "number" ||
      typeof current[1] !== "number" ||
      typeof next[0] !== "number" ||
      typeof next[1] !== "number"
    ) {
      return 0;
    }
    twiceArea += current[0] * next[1] - next[0] * current[1];
  }
  return Math.abs(twiceArea) / 2;
}

function polygonArea(value: unknown): number {
  if (!Array.isArray(value) || value.length === 0) {
    return 0;
  }
  const exteriorArea = ringArea(value[0]);
  const holeArea = value.slice(1).reduce((sum: number, ring: unknown) => {
    return sum + ringArea(ring);
  }, 0);
  return Math.max(0, exteriorArea - holeArea);
}

function geometryAreaKm2(feature: GeoJsonFeature): number | undefined {
  const geometry = feature.geometry;
  if (!geometry || !Array.isArray(geometry.coordinates)) {
    return undefined;
  }
  const areaM2 =
    geometry.type === "Polygon"
      ? polygonArea(geometry.coordinates)
      : geometry.type === "MultiPolygon"
        ? geometry.coordinates.reduce(
            (sum: number, polygon: unknown) => sum + polygonArea(polygon),
            0,
          )
        : 0;
  return areaM2 > 0 ? areaM2 / 1_000_000 : undefined;
}

function getGeoBoundaryMetadata(value: unknown): GeoBoundaryMetadata[] {
  const values = Array.isArray(value) ? value : [value];
  return values.filter(
    (entry): entry is GeoBoundaryMetadata =>
      isRecord(entry) &&
      typeof entry.boundaryISO === "string" &&
      typeof entry.boundaryType === "string",
  );
}

function groupAreas(
  features: GeoJsonFeature[],
  countryCodeProperty: string,
  area: (feature: GeoJsonFeature) => number | undefined,
): Map<string, number[]> {
  const grouped = new Map<string, number[]>();
  for (const feature of features) {
    const properties = feature.properties;
    const countryIso3 = properties?.[countryCodeProperty];
    const unitArea = area(feature);
    if (
      typeof countryIso3 !== "string" ||
      !/^[A-Z]{3}$/.test(countryIso3) ||
      unitArea === undefined ||
      unitArea <= 0
    ) {
      continue;
    }
    const values = grouped.get(countryIso3) ?? [];
    values.push(unitArea);
    grouped.set(countryIso3, values);
  }
  return grouped;
}

function makeGiscoRecord(
  countryIso3: string,
  countryName: string,
  selectedLevel: "LAU" | "NUTS3",
  typicalAreaKm2: number,
  unitCount: number,
): AdminScaleRecord {
  const isLau = selectedLevel === "LAU";
  return {
    countryIso3,
    countryName,
    selectedLevel,
    levelName: isLau ? "LAU (local administrative unit)" : "NUTS level 3",
    typicalAreaKm2,
    areaStatistic: "median",
    unitCount,
    sourceDataset: isLau
      ? "Eurostat GISCO LAU 2024"
      : "Eurostat GISCO NUTS 2024",
    sourceVersion: "2024",
    sourceUrl: isLau ? giscoLauReference : giscoNutsReference,
  };
}

function makeGeoBoundaryRecord(
  record: GeoBoundaryMetadata,
  level: string,
): AdminScaleRecord | undefined {
  if (
    !record.boundaryISO ||
    !record.boundaryName ||
    !record.boundaryType ||
    record.boundaryType !== level
  ) {
    return undefined;
  }
  const typicalAreaKm2 = numberValue(record.meanAreaSqKM);
  const unitCount = numberValue(record.admUnitCount);
  if (!typicalAreaKm2 || typicalAreaKm2 <= 0 || !unitCount) {
    return undefined;
  }
  return {
    countryIso3: record.boundaryISO,
    countryName: record.boundaryName,
    selectedLevel: level,
    levelName: `${level}${record.boundaryCanonical ? ` (${record.boundaryCanonical})` : ""}`,
    typicalAreaKm2,
    areaStatistic: "mean",
    unitCount,
    sourceDataset: "geoBoundaries gbOpen",
    sourceVersion: record.buildDate ?? "current API release",
    sourceUrl: `${geoBoundariesApi}/ALL/${level}/`,
    ...(record.boundaryID ? { boundaryId: record.boundaryID } : {}),
    ...(record.boundaryLicense
      ? { boundaryLicense: record.boundaryLicense }
      : {}),
    ...(record.boundarySource ? { boundarySource: record.boundarySource } : {}),
    ...(record.boundarySourceURL
      ? { boundarySourceUrl: record.boundarySourceURL }
      : {}),
    ...(record.sourceDataUpdateDate
      ? { sourceDataUpdateDate: record.sourceDataUpdateDate }
      : {}),
  };
}

async function buildIndex(): Promise<AdminScaleIndex> {
  const [lauFile, nuts3File] = await Promise.all([
    fetchJson(lauUrl),
    fetchJson(nuts3Url),
  ]);
  const lauFeatures = featuresFrom(lauFile, lauUrl);
  const nuts3Features = featuresFrom(nuts3File, nuts3Url);
  const countryByCode = new Map<
    string,
    { iso3: string; name: string; euMember: boolean }
  >();
  for (const feature of nuts3Features) {
    const properties = feature.properties;
    if (!properties) {
      continue;
    }
    const code = properties?.CNTR_CODE;
    const iso3 = properties?.ISO3_CODE;
    if (typeof code !== "string" || typeof iso3 !== "string") {
      continue;
    }
    countryByCode.set(code, {
      iso3,
      name:
        typeof properties.NAME_ENGL === "string" ? properties.NAME_ENGL : iso3,
      euMember:
        countryByCode.get(code)?.euMember === true ||
        properties.EU_STAT === "T",
    });
  }

  const lauAreas = new Map<string, number[]>();
  for (const feature of lauFeatures) {
    const code = feature.properties?.CNTR_CODE;
    const country =
      typeof code === "string" ? countryByCode.get(code) : undefined;
    const area = numberValue(feature.properties?.AREA_KM2);
    if (!country || !area || area <= 0) {
      continue;
    }
    const areas = lauAreas.get(country.iso3) ?? [];
    areas.push(area);
    lauAreas.set(country.iso3, areas);
  }
  const nuts3Areas = groupAreas(nuts3Features, "ISO3_CODE", geometryAreaKm2);

  const euCountryCodes = new Set(
    [...countryByCode.values()]
      .filter((country) => country.euMember)
      .map((country) => country.iso3),
  );
  const euLauAreas = [...euCountryCodes].flatMap(
    (countryIso3) => lauAreas.get(countryIso3) ?? [],
  );
  const referenceAreaKm2 = median(euLauAreas);
  if (!referenceAreaKm2) {
    throw new Error("Could not calculate the median area of EU LAUs");
  }

  const countries: Record<string, AdminScaleRecord> = {};
  for (const country of countryByCode.values()) {
    const lauValues = lauAreas.get(country.iso3) ?? [];
    const nuts3Values = nuts3Areas.get(country.iso3) ?? [];
    const lauMedian = median(lauValues);
    const nuts3Median = median(nuts3Values);
    const choices = [
      ...(lauMedian
        ? [
            makeGiscoRecord(
              country.iso3,
              country.name,
              "LAU",
              lauMedian,
              lauValues.length,
            ),
          ]
        : []),
      ...(nuts3Median
        ? [
            makeGiscoRecord(
              country.iso3,
              country.name,
              "NUTS3",
              nuts3Median,
              nuts3Values.length,
            ),
          ]
        : []),
    ];
    if (choices.length > 0) {
      countries[country.iso3] = choices.sort((left, right) =>
        compareArea(
          left.typicalAreaKm2,
          right.typicalAreaKm2,
          referenceAreaKm2,
        ),
      )[0];
    }
  }

  const globalRecordsByLevel = await Promise.all(
    [1, 2, 3, 4, 5].map(async (levelNumber) => {
      const level = `ADM${levelNumber}`;
      const response = await fetchJson(`${geoBoundariesApi}/ALL/${level}/`);
      return getGeoBoundaryMetadata(response)
        .map((record) => makeGeoBoundaryRecord(record, level))
        .filter((record): record is AdminScaleRecord => record !== undefined);
    }),
  );
  const globalRecordsByCountry = new Map<string, AdminScaleRecord[]>();
  for (const record of globalRecordsByLevel.flat()) {
    const existing = globalRecordsByCountry.get(record.countryIso3) ?? [];
    existing.push(record);
    globalRecordsByCountry.set(record.countryIso3, existing);
  }
  for (const [countryIso3, records] of globalRecordsByCountry) {
    if (countries[countryIso3]) {
      continue;
    }
    records.sort((left, right) =>
      compareArea(left.typicalAreaKm2, right.typicalAreaKm2, referenceAreaKm2),
    );
    countries[countryIso3] = records[0];
  }

  return {
    formatVersion: 1,
    generatedAt: new Date().toISOString(),
    referenceAreaKm2,
    referenceDescription:
      "Median land area of 2024 LAUs in EU member countries, calculated from Eurostat GISCO AREA_KM2.",
    countries,
  };
}

async function main(): Promise<void> {
  const rootDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
  );
  const outputPath = path.join(
    rootDirectory,
    "config",
    "rgo-research-admin-scales.json",
  );
  const index = await buildIndex();
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
  console.log(
    `Wrote ${Object.keys(index.countries).length} country scale entries to ${path.relative(rootDirectory, outputPath)} (EU LAU median ${index.referenceAreaKm2.toFixed(2)} km²).`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
