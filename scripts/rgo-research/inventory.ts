import { readFile } from "node:fs/promises";
import { decodeCsvCell, parseCsv } from "./csv.js";
import type {
  LocationInput,
  LocationResolution,
  PlaceCandidate,
  ResolutionFile,
  WikipediaPageLink,
} from "./model.js";

const fruitReviewHeading =
  "### Separate review: Harmony generic fruit; assess FE fruit replacers";

export function parseFruitReviewLocations(markdown: string): LocationInput[] {
  const headingIndex = markdown.indexOf(fruitReviewHeading);
  if (headingIndex < 0) {
    throw new Error(
      `Could not find the 71-location fruit review section: ${fruitReviewHeading}`,
    );
  }

  const section = markdown.slice(headingIndex);
  const headerIndex = section.indexOf("| Location ID");
  if (headerIndex < 0) {
    throw new Error("Could not find the fruit review table header");
  }

  const table = section.slice(headerIndex).split("</details>", 1)[0];
  const rows: LocationInput[] = [];
  const rowPattern = /^\|\s*`([^`]+)`\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/gm;

  for (const match of table.matchAll(rowPattern)) {
    rows.push({
      id: match[1],
      englishName: match[2].trim(),
      context: match[3].trim(),
    });
  }

  if (rows.length === 0) {
    throw new Error("The fruit review table contains no location rows");
  }

  const ids = new Set(rows.map((row) => row.id));
  if (ids.size !== rows.length) {
    throw new Error("The fruit review table contains duplicate location IDs");
  }

  return rows;
}

export async function readFruitReviewLocations(
  inventoryPath: string,
): Promise<LocationInput[]> {
  return parseFruitReviewLocations(await readFile(inventoryPath, "utf8"));
}

export function parseLocationInput(value: unknown): LocationInput[] {
  if (!Array.isArray(value)) {
    throw new Error("Location input JSON must be an array");
  }

  const locations = value.map((item, index): LocationInput => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error(`Location input row ${index + 1} must be an object`);
    }

    const record = item as Record<string, unknown>;
    if (
      typeof record.id !== "string" ||
      typeof record.englishName !== "string" ||
      typeof record.context !== "string"
    ) {
      throw new Error(
        `Location input row ${index + 1} must have string id, englishName, and context fields`,
      );
    }

    const id = record.id.trim();
    const englishName = record.englishName.trim();
    const context = record.context.trim();
    const eu5Province = record.eu5Province;
    const eu5ProvinceId = record.eu5ProvinceId;
    if (!id || !englishName) {
      throw new Error(
        `Location input row ${index + 1} must have non-empty id and englishName fields`,
      );
    }
    if (
      (eu5Province !== undefined && typeof eu5Province !== "string") ||
      (eu5ProvinceId !== undefined && typeof eu5ProvinceId !== "string")
    ) {
      throw new Error(
        `Location input row ${index + 1} eu5Province and eu5ProvinceId fields must be strings when provided`,
      );
    }

    return {
      id,
      englishName,
      context,
      ...(typeof eu5Province === "string" ? { eu5Province } : {}),
      ...(typeof eu5ProvinceId === "string" ? { eu5ProvinceId } : {}),
    };
  });

  if (
    new Set(locations.map((location) => location.id)).size !== locations.length
  ) {
    throw new Error("Location input JSON contains duplicate IDs");
  }

  return locations;
}

function parseWikipediaLink(
  value: unknown,
  description: string,
): WikipediaPageLink {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    !("language" in value) ||
    typeof value.language !== "string" ||
    !("title" in value) ||
    typeof value.title !== "string" ||
    !("url" in value) ||
    typeof value.url !== "string"
  ) {
    throw new Error(
      `${description} must have language, title, and url strings`,
    );
  }
  return {
    language: value.language,
    title: value.title,
    url: value.url,
  };
}

function parsePlaceCandidate(
  value: unknown,
  locationId: string,
): PlaceCandidate {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Candidate for ${locationId} must be an object`);
  }
  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.qid !== "string" ||
    typeof candidate.label !== "string" ||
    typeof candidate.description !== "string" ||
    typeof candidate.score !== "number" ||
    !["high", "medium", "low"].includes(String(candidate.confidence)) ||
    !Array.isArray(candidate.localWikipedia)
  ) {
    throw new Error(`Candidate for ${locationId} has invalid required fields`);
  }
  const localWikipedia = candidate.localWikipedia.map((link, index) =>
    parseWikipediaLink(
      link,
      `Candidate ${candidate.qid} localWikipedia[${index}]`,
    ),
  );
  const parsed: PlaceCandidate = {
    qid: candidate.qid,
    label: candidate.label,
    description: candidate.description,
    score: candidate.score,
    confidence: candidate.confidence as PlaceCandidate["confidence"],
    localWikipedia,
  };

  for (const key of [
    "country",
    "countryIso3",
    "countryQid",
    "administrativeArea",
    "administrativeAreaQid",
  ] as const) {
    const entry = candidate[key];
    if (entry !== undefined) {
      if (typeof entry !== "string") {
        throw new Error(`Candidate ${candidate.qid} ${key} must be a string`);
      }
      parsed[key] = entry;
    }
  }
  if (candidate.administrativeScale !== undefined) {
    const scale = candidate.administrativeScale;
    if (
      !scale ||
      typeof scale !== "object" ||
      Array.isArray(scale) ||
      !("level" in scale) ||
      typeof scale.level !== "string" ||
      !("levelName" in scale) ||
      typeof scale.levelName !== "string" ||
      !("typicalAreaKm2" in scale) ||
      typeof scale.typicalAreaKm2 !== "number" ||
      !("areaStatistic" in scale) ||
      (scale.areaStatistic !== "mean" && scale.areaStatistic !== "median") ||
      !("unitCount" in scale) ||
      typeof scale.unitCount !== "number" ||
      !("sourceDataset" in scale) ||
      typeof scale.sourceDataset !== "string" ||
      !("sourceVersion" in scale) ||
      typeof scale.sourceVersion !== "string" ||
      !("sourceUrl" in scale) ||
      typeof scale.sourceUrl !== "string"
    ) {
      throw new Error(
        `Candidate ${candidate.qid} administrativeScale is invalid`,
      );
    }
    parsed.administrativeScale = {
      level: scale.level,
      levelName: scale.levelName,
      typicalAreaKm2: scale.typicalAreaKm2,
      areaStatistic: scale.areaStatistic,
      unitCount: scale.unitCount,
      sourceDataset: scale.sourceDataset,
      sourceVersion: scale.sourceVersion,
      sourceUrl: scale.sourceUrl,
    };
  }
  if (candidate.coordinates !== undefined) {
    if (
      !candidate.coordinates ||
      typeof candidate.coordinates !== "object" ||
      !("latitude" in candidate.coordinates) ||
      typeof candidate.coordinates.latitude !== "number" ||
      !("longitude" in candidate.coordinates) ||
      typeof candidate.coordinates.longitude !== "number"
    ) {
      throw new Error(`Candidate ${candidate.qid} coordinates are invalid`);
    }
    parsed.coordinates = {
      latitude: candidate.coordinates.latitude,
      longitude: candidate.coordinates.longitude,
    };
  }
  if (candidate.englishWikipedia !== undefined) {
    parsed.englishWikipedia = parseWikipediaLink(
      candidate.englishWikipedia,
      `Candidate ${candidate.qid} englishWikipedia`,
    );
  }
  return parsed;
}

export function parseResolutionFile(value: unknown): ResolutionFile {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    !("formatVersion" in value) ||
    value.formatVersion !== 1 ||
    !("generatedAt" in value) ||
    typeof value.generatedAt !== "string" ||
    !("inputSource" in value) ||
    typeof value.inputSource !== "string" ||
    !("locations" in value) ||
    !Array.isArray(value.locations)
  ) {
    throw new Error("Resolution JSON has an invalid format");
  }

  const locations: LocationResolution[] = value.locations.map(
    (item, index): LocationResolution => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        throw new Error(`Resolution row ${index + 1} must be an object`);
      }
      const record = item as Record<string, unknown>;
      const locationRecord = record.location as
        Record<string, unknown> | undefined;
      if (
        !locationRecord ||
        Array.isArray(locationRecord) ||
        typeof locationRecord.id !== "string" ||
        typeof locationRecord.englishName !== "string" ||
        typeof locationRecord.context !== "string" ||
        (locationRecord.eu5Province !== undefined &&
          typeof locationRecord.eu5Province !== "string") ||
        (locationRecord.eu5ProvinceId !== undefined &&
          typeof locationRecord.eu5ProvinceId !== "string") ||
        !["needs-review", "unresolved"].includes(String(record.status)) ||
        (record.selectedQid !== null &&
          typeof record.selectedQid !== "string") ||
        !Array.isArray(record.candidates)
      ) {
        throw new Error(
          `Resolution row ${index + 1} has invalid required fields`,
        );
      }
      const location: LocationInput = {
        id: locationRecord.id,
        englishName: locationRecord.englishName,
        context: locationRecord.context,
        ...(typeof locationRecord.eu5Province === "string"
          ? { eu5Province: locationRecord.eu5Province }
          : {}),
        ...(typeof locationRecord.eu5ProvinceId === "string"
          ? { eu5ProvinceId: locationRecord.eu5ProvinceId }
          : {}),
      };
      return {
        location,
        status: record.status as LocationResolution["status"],
        selectedQid: record.selectedQid,
        candidates: record.candidates.map((candidate) =>
          parsePlaceCandidate(candidate, location.id),
        ),
      };
    },
  );

  return {
    formatVersion: 1,
    generatedAt: value.generatedAt,
    inputSource: value.inputSource,
    locations,
  };
}

export function parseResolutionReviewCsv(
  contents: string,
  resolutionFile: ResolutionFile,
): ResolutionFile {
  const rows = parseCsv(contents);
  if (rows.length < 2) {
    throw new Error("Resolution review CSV must contain a header and rows");
  }

  const headers = rows[0].map((header) => header.trim());
  const headerIndexes = new Map(
    headers.map((header, index) => [header, index]),
  );
  if (headerIndexes.size !== headers.length) {
    throw new Error("Resolution review CSV contains duplicate column names");
  }
  const requiredHeaders = ["location_id", "candidate_qid", "correct"];
  for (const header of requiredHeaders) {
    if (!headerIndexes.has(header)) {
      throw new Error(`Resolution review CSV is missing the ${header} column`);
    }
  }

  const locationIndex = headerIndexes.get("location_id");
  const qidIndex = headerIndexes.get("candidate_qid");
  const correctIndex = headerIndexes.get("correct");
  if (
    locationIndex === undefined ||
    qidIndex === undefined ||
    correctIndex === undefined
  ) {
    throw new Error("Resolution review CSV has invalid column indexes");
  }

  const sourceById = new Map(
    resolutionFile.locations.map((location) => [
      location.location.id,
      location,
    ]),
  );
  const seenCandidates = new Set<string>();
  const selectedQids = new Map<string, string>();

  for (const [index, row] of rows.slice(1).entries()) {
    if (row.length !== headers.length) {
      throw new Error(
        `Resolution review CSV row ${index + 2} has ${row.length} columns; expected ${headers.length}`,
      );
    }
    const locationId = decodeCsvCell(row[locationIndex]).trim();
    const candidateQid = decodeCsvCell(row[qidIndex]).trim();
    const correctValue = row[correctIndex].trim().toLowerCase();
    const correct = ["true", "yes", "1"].includes(correctValue);
    if (!["", "false", "no", "0", "true", "yes", "1"].includes(correctValue)) {
      throw new Error(
        `Resolution review CSV row ${index + 2} has invalid correct value "${row[correctIndex]}"`,
      );
    }

    const resolution = sourceById.get(locationId);
    if (!resolution) {
      throw new Error(
        `Resolution review CSV row ${index + 2} has unknown location ID "${locationId}"`,
      );
    }
    if (correct && !candidateQid) {
      throw new Error(
        `Resolution review CSV row ${index + 2} marks an empty candidate as correct`,
      );
    }

    const candidateKey = `${locationId}\u0000${candidateQid}`;
    if (seenCandidates.has(candidateKey)) {
      throw new Error(
        `Resolution review CSV contains duplicate candidate ${candidateQid || "(none)"} for ${locationId}`,
      );
    }
    seenCandidates.add(candidateKey);

    if (resolution.candidates.length === 0) {
      if (candidateQid) {
        throw new Error(
          `Resolution review CSV contains candidate ${candidateQid} for unresolved location ${locationId}`,
        );
      }
    } else if (
      !resolution.candidates.some((candidate) => candidate.qid === candidateQid)
    ) {
      throw new Error(
        `Resolution review CSV candidate ${candidateQid} is not in the candidate list for ${locationId}`,
      );
    }

    if (correct) {
      if (selectedQids.has(locationId)) {
        throw new Error(
          `Resolution review CSV marks more than one candidate correct for ${locationId}`,
        );
      }
      selectedQids.set(locationId, candidateQid);
    }
  }

  for (const resolution of resolutionFile.locations) {
    const locationId = resolution.location.id;
    const expectedQids =
      resolution.candidates.length > 0
        ? resolution.candidates.map((candidate) => candidate.qid)
        : [""];
    for (const qid of expectedQids) {
      if (!seenCandidates.has(`${locationId}\u0000${qid}`)) {
        throw new Error(
          `Resolution review CSV is missing candidate ${qid || "(none)"} for ${locationId}`,
        );
      }
    }
  }

  return {
    ...resolutionFile,
    locations: resolutionFile.locations.map((location) => ({
      ...location,
      selectedQid: selectedQids.get(location.location.id) ?? null,
    })),
  };
}
