import type {
  LocationInput,
  LocationResolution,
  PlaceCandidate,
  ResolutionFile,
} from "./model.js";
import { JsonHttpClient } from "./api.js";

interface SearchResult {
  id: string;
  label: string;
  description: string;
}

interface WikidataEntity {
  id: string;
  labels?: Record<string, { value: string }>;
  descriptions?: Record<string, { value: string }>;
  aliases?: Record<string, Array<{ value: string }>>;
  claims?: Record<
    string,
    Array<{ mainsnak?: { datavalue?: { value?: unknown } } }>
  >;
  sitelinks?: Record<string, { title: string }>;
}

const geographicClassIds = new Set([
  "Q486972", // human settlement
  "Q82794", // geographic region
  "Q56061", // administrative territorial entity
  "Q6256", // country
  "Q515", // city
  "Q3957", // town
  "Q532", // village
  "Q15284", // municipality
  "Q484170", // commune
  "Q23442", // island
  "Q4022", // river
  "Q23397", // lake
  "Q8502", // mountain
  "Q46831", // mountain range
  "Q28575", // county
  "Q149621", // district
  "Q1395692", // province
  "Q7275", // state
  "Q9430", // ocean
  "Q165", // sea
  "Q8514", // desert
  "Q4421", // forest
  "Q39594", // bay
  "Q34763", // peninsula
  "Q39816", // valley
  "Q355304", // watercourse
]);

const nonGeographicClassIds = new Set([
  "Q5", // human
  "Q101352", // family name
  "Q202444", // given name
  "Q4116295", // surname
  "Q82799", // name
  "Q147276", // proper noun
  "Q10856962", // anthroponym
  "Q18972245", // masculine family name
  "Q829026", // occupational surname
  "Q17143070", // toponymic surname
  "Q33283501", // surname from a specific origin
  "Q33274034", // anthroponym from a specific origin
]);

const administrativeClassIds = new Set([
  "Q56061", // administrative territorial entity
  "Q15284", // municipality
  "Q484170", // commune
  "Q28575", // county
  "Q149621", // district
  "Q1395692", // province
  "Q7275", // state
]);

const nonAdministrativeClassIds = new Set([
  "Q6256", // country
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function compactEntityResponse(value: unknown): unknown {
  if (!isRecord(value) || !isRecord(value.entities)) {
    return value;
  }

  const relevantClaims = new Set([
    "P17",
    "P31",
    "P37",
    "P131",
    "P218",
    "P279",
    "P424",
    "P625",
  ]);
  const entities: Record<string, unknown> = {};
  for (const [qid, valueEntity] of Object.entries(value.entities)) {
    if (!isRecord(valueEntity)) {
      continue;
    }
    const claims: Record<string, unknown[]> = {};
    if (isRecord(valueEntity.claims)) {
      for (const [property, statements] of Object.entries(valueEntity.claims)) {
        if (!relevantClaims.has(property) || !Array.isArray(statements)) {
          continue;
        }
        claims[property] = statements.flatMap((statement) => {
          if (!isRecord(statement) || !isRecord(statement.mainsnak)) {
            return [];
          }
          const datavalue = statement.mainsnak.datavalue;
          if (!isRecord(datavalue) || !("value" in datavalue)) {
            return [];
          }
          return [{ mainsnak: { datavalue: { value: datavalue.value } } }];
        });
      }
    }
    entities[qid] = {
      id: valueEntity.id,
      ...(isRecord(valueEntity.labels) ? { labels: valueEntity.labels } : {}),
      ...(isRecord(valueEntity.descriptions)
        ? { descriptions: valueEntity.descriptions }
        : {}),
      ...(isRecord(valueEntity.aliases)
        ? { aliases: valueEntity.aliases }
        : {}),
      ...(isRecord(valueEntity.sitelinks)
        ? { sitelinks: valueEntity.sitelinks }
        : {}),
      claims,
    };
  }
  return { entities };
}

function asEntity(value: unknown): WikidataEntity | undefined {
  if (!isRecord(value) || typeof value.id !== "string") {
    return undefined;
  }
  return value as unknown as WikidataEntity;
}

function wikidataApiUrl(parameters: URLSearchParams): string {
  return `https://www.wikidata.org/w/api.php?${parameters.toString()}`;
}

function normalizeName(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("en")
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function getEntityIds(
  entity: WikidataEntity | undefined,
  property: string,
): string[] {
  const claims = entity?.claims?.[property] ?? [];
  return claims.flatMap((claim) => {
    const value = claim.mainsnak?.datavalue?.value;
    if (isRecord(value) && typeof value.id === "string") {
      return [value.id];
    }
    return [];
  });
}

function getCoordinate(
  entity: WikidataEntity | undefined,
): PlaceCandidate["coordinates"] {
  const value = entity?.claims?.P625?.[0]?.mainsnak?.datavalue?.value;
  if (
    isRecord(value) &&
    typeof value.latitude === "number" &&
    typeof value.longitude === "number"
  ) {
    return { latitude: value.latitude, longitude: value.longitude };
  }
  return undefined;
}

function getLabel(entity: WikidataEntity | undefined): string | undefined {
  return entity?.labels?.en?.value;
}

function getDescription(
  entity: WikidataEntity | undefined,
): string | undefined {
  return entity?.descriptions?.en?.value;
}

function getLanguageCode(
  entity: WikidataEntity | undefined,
): string | undefined {
  const getStringClaim = (property: string): string | undefined => {
    const value = entity?.claims?.[property]?.[0]?.mainsnak?.datavalue?.value;
    return typeof value === "string" ? value : undefined;
  };
  const code = getStringClaim("P424");
  if (code) {
    return code;
  }

  return getStringClaim("P218");
}

function wikipediaLanguageCode(languageCode: string): string {
  const aliases: Record<string, string> = {
    "zh-cn": "zh",
    "zh-hans": "zh",
    "zh-hant": "zh",
    "zh-tw": "zh",
    nb: "no",
    nn: "nn",
  };
  return aliases[languageCode.toLowerCase()] ?? languageCode.toLowerCase();
}

function makeWikipediaLink(
  language: string,
  title: string,
): PlaceCandidate["englishWikipedia"] {
  const encodedTitle = encodeURIComponent(title.replace(/ /g, "_"));
  return {
    language,
    title,
    url: `https://${language}.wikipedia.org/wiki/${encodedTitle}`,
  };
}

function candidateScore(
  input: LocationInput,
  searchResult: SearchResult,
  entity: WikidataEntity | undefined,
  countryKnown: boolean,
  relatedPlaceNameScore: number,
  provinceAligned: boolean,
  countryContextAligned = false,
): number {
  const normalizedInput = normalizeName(input.englishName);
  const normalizedLabel = normalizeName(getLabel(entity) ?? searchResult.label);
  const aliases =
    entity?.aliases?.en?.map((alias) => normalizeName(alias.value)) ?? [];
  const exactLabel = normalizedInput === normalizedLabel;
  const exactAlias = aliases.includes(normalizedInput);
  let score = exactLabel ? 100 : exactAlias ? 90 : 0;
  if (!exactLabel && !exactAlias && normalizedLabel.includes(normalizedInput)) {
    score = 50;
  }
  if (relatedPlaceNameScore > 0) {
    score += Math.round(relatedPlaceNameScore * 0.35);
  }
  if (provinceAligned) {
    score += 25;
  }
  if (countryContextAligned) {
    score += 20;
  }
  if (countryKnown) {
    score += 15;
  }
  const coordinate = getCoordinate(entity);
  if (coordinate) {
    score += 10;
  }
  return score;
}

async function searchEntities(
  input: LocationInput,
  client: JsonHttpClient,
): Promise<SearchResult[]> {
  const parameters = new URLSearchParams({
    action: "wbsearchentities",
    search: input.englishName,
    language: "en",
    uselang: "en",
    type: "item",
    limit: "10",
    format: "json",
  });
  const response: unknown = await client.get(wikidataApiUrl(parameters));
  if (!isRecord(response) || !Array.isArray(response.search)) {
    throw new Error(`Unexpected Wikidata search response for ${input.id}`);
  }
  return response.search.flatMap((value): SearchResult[] => {
    if (
      !isRecord(value) ||
      typeof value.id !== "string" ||
      typeof value.label !== "string"
    ) {
      return [];
    }
    return [
      {
        id: value.id,
        label: value.label,
        description:
          typeof value.description === "string" ? value.description : "",
      },
    ];
  });
}

async function fetchEntities(
  ids: string[],
  client: JsonHttpClient,
): Promise<Map<string, WikidataEntity>> {
  const uniqueIds = [...new Set(ids)];
  const entities = new Map<string, WikidataEntity>();

  for (let index = 0; index < uniqueIds.length; index += 50) {
    const batch = uniqueIds.slice(index, index + 50);
    if (batch.length === 0) {
      continue;
    }
    const parameters = new URLSearchParams({
      action: "wbgetentities",
      ids: batch.join("|"),
      props: "labels|descriptions|aliases|claims|sitelinks",
      languages: "en",
      format: "json",
    });
    const response: unknown = await client.get(wikidataApiUrl(parameters), {
      cacheValue: compactEntityResponse,
    });
    if (!isRecord(response) || !isRecord(response.entities)) {
      throw new Error("Unexpected Wikidata entity response");
    }
    for (const [id, value] of Object.entries(response.entities)) {
      const entity = asEntity(value);
      if (entity) {
        entities.set(id, entity);
      }
    }
  }

  return entities;
}

async function fetchTypeAncestors(
  typeIds: string[],
  client: JsonHttpClient,
): Promise<Map<string, Set<string>>> {
  const ancestorsByType = new Map<string, Set<string>>();
  let pending = [...new Set(typeIds)].map((qid) => ({ qid, root: qid }));

  for (let depth = 0; depth < 2 && pending.length > 0; depth += 1) {
    const entities = await fetchEntities(
      pending.map((entry) => entry.qid),
      client,
    );
    const next: Array<{ qid: string; root: string }> = [];
    for (const { qid, root } of pending) {
      const ancestors = ancestorsByType.get(root) ?? new Set<string>();
      if (ancestors.has(qid)) {
        continue;
      }
      ancestors.add(qid);
      ancestorsByType.set(root, ancestors);
      if (
        geographicClassIds.has(qid) ||
        nonGeographicClassIds.has(qid) ||
        administrativeClassIds.has(qid) ||
        nonAdministrativeClassIds.has(qid)
      ) {
        continue;
      }
      for (const parentQid of getEntityIds(entities.get(qid), "P279")) {
        if (!ancestors.has(parentQid)) {
          next.push({ qid: parentQid, root });
        }
      }
    }
    pending = next;
  }

  return ancestorsByType;
}

async function fetchAdministrativeLineage(
  roots: WikidataEntity[],
  client: JsonHttpClient,
): Promise<Map<string, WikidataEntity>> {
  const ancestors = new Map<string, WikidataEntity>();
  const visited = new Set<string>();
  let pending = roots.flatMap((entity) => getEntityIds(entity, "P131"));

  for (let depth = 0; depth < 2 && pending.length > 0; depth += 1) {
    const batch = [...new Set(pending)].filter((qid) => !visited.has(qid));
    batch.forEach((qid) => visited.add(qid));
    const fetched = await fetchEntities(batch, client);
    for (const [qid, entity] of fetched) {
      ancestors.set(qid, entity);
    }
    pending = [...fetched.values()].flatMap((entity) =>
      getEntityIds(entity, "P131"),
    );
  }

  return ancestors;
}

function isGeographicEntity(
  entity: WikidataEntity | undefined,
  ancestorsByType: Map<string, Set<string>>,
): boolean {
  const ancestors = new Set(
    getEntityIds(entity, "P31").flatMap((typeId) => [
      ...(ancestorsByType.get(typeId) ?? [typeId]),
    ]),
  );
  return (
    ![...ancestors].some((ancestor) => nonGeographicClassIds.has(ancestor)) &&
    [...ancestors].some((ancestor) => geographicClassIds.has(ancestor))
  );
}

function isAdministrativeEntity(
  entity: WikidataEntity | undefined,
  ancestorsByType: Map<string, Set<string>>,
): boolean {
  const ancestors = new Set(
    getEntityIds(entity, "P31").flatMap((typeId) => [
      ...(ancestorsByType.get(typeId) ?? [typeId]),
    ]),
  );
  const description = getDescription(entity) ?? "";
  const describesObsoleteUnit =
    /\b(historical|historic|former|abolished|defunct|until\s+\d{4})\b/i.test(
      description,
    ) || /\b\d{4}\s*(?:to|[-–])\s*\d{4}\b/i.test(description);
  return (
    !describesObsoleteUnit &&
    ![...ancestors].some((ancestor) =>
      nonAdministrativeClassIds.has(ancestor),
    ) &&
    [...ancestors].some((ancestor) => administrativeClassIds.has(ancestor)) &&
    ![...ancestors].some((ancestor) => nonGeographicClassIds.has(ancestor))
  );
}

function findCountryQid(
  entity: WikidataEntity | undefined,
  entities: Map<string, WikidataEntity>,
): string | undefined {
  let current = entity;
  const visited = new Set<string>();
  for (let depth = 0; current && depth < 4; depth += 1) {
    const countryQid = getEntityIds(current, "P17")[0];
    if (countryQid) {
      return countryQid;
    }
    const adminQid = getEntityIds(current, "P131")[0];
    if (!adminQid || visited.has(adminQid)) {
      break;
    }
    visited.add(adminQid);
    current = entities.get(adminQid);
  }
  return undefined;
}

function contextMatchesCountry(
  input: LocationInput,
  country: string | undefined,
): boolean {
  if (!input.context || !country) {
    return false;
  }
  const context = normalizeName(input.context);
  const normalizedCountry = normalizeName(country);
  return (
    context === normalizedCountry ||
    context.includes(normalizedCountry) ||
    normalizedCountry.includes(context)
  );
}

function provinceMatchesEntity(
  input: LocationInput,
  entity: WikidataEntity | undefined,
  entities: Map<string, WikidataEntity>,
): boolean {
  if (!input.eu5Province) {
    return false;
  }
  const province = normalizeName(input.eu5Province);
  let current = entity;
  const visited = new Set<string>();
  for (let depth = 0; current && depth < 4; depth += 1) {
    const labels = [
      getLabel(current),
      ...(current.aliases?.en?.map((alias) => alias.value) ?? []),
    ].filter((label): label is string => Boolean(label));
    if (
      labels.some((label) => {
        const normalizedLabel = normalizeName(label);
        const administrativeName =
          /\b(region|regional unit|county|district|province|department|arrondissement|municipality|commune|prefecture|governorate|oblast|raion|state)\b/.test(
            normalizedLabel,
          );
        return (
          normalizedLabel === province ||
          (normalizedLabel.includes(province) && administrativeName)
        );
      })
    ) {
      return true;
    }
    const adminQid = getEntityIds(current, "P131")[0];
    if (!adminQid || visited.has(adminQid)) {
      break;
    }
    visited.add(adminQid);
    current = entities.get(adminQid);
  }
  return false;
}

function getSitelink(
  entity: WikidataEntity | undefined,
  site: string,
  language: string,
): PlaceCandidate["englishWikipedia"] {
  const title = entity?.sitelinks?.[site]?.title;
  return title ? makeWikipediaLink(language, title) : undefined;
}

function buildCandidate(
  input: LocationInput,
  result: SearchResult,
  entities: Map<string, WikidataEntity>,
  relatedPlaceNameScore: number,
): PlaceCandidate {
  const entity = entities.get(result.id);
  const adminQid = getEntityIds(entity, "P131")[0];
  const countryQid = findCountryQid(entity, entities);
  const countryEntity = entities.get(countryQid ?? "");
  const adminEntity = entities.get(adminQid ?? "");
  const score = candidateScore(
    input,
    result,
    entity,
    Boolean(countryQid),
    relatedPlaceNameScore,
    provinceMatchesEntity(input, entity, entities),
    contextMatchesCountry(input, getLabel(countryEntity)),
  );
  const localLanguages = getEntityIds(countryEntity, "P37")
    .map((languageQid) => getLanguageCode(entities.get(languageQid)))
    .filter((language): language is string => Boolean(language))
    .map(wikipediaLanguageCode)
    .filter(
      (language, index, list) =>
        language !== "en" && list.indexOf(language) === index,
    );
  const localWikipedia = localLanguages.flatMap((language) => {
    const link = getSitelink(entity, `${language}wiki`, language);
    return link ? [link] : [];
  });

  return {
    qid: result.id,
    label: getLabel(entity) ?? result.label,
    description: getDescription(entity) ?? result.description,
    score,
    confidence: "low",
    ...(countryQid && getLabel(countryEntity)
      ? { country: getLabel(countryEntity), countryQid }
      : {}),
    ...(adminQid && getLabel(adminEntity)
      ? {
          administrativeArea: getLabel(adminEntity),
          administrativeAreaQid: adminQid,
        }
      : {}),
    ...(getCoordinate(entity) ? { coordinates: getCoordinate(entity) } : {}),
    localWikipedia,
    ...(getSitelink(entity, "enwiki", "en")
      ? { englishWikipedia: getSitelink(entity, "enwiki", "en") }
      : {}),
  };
}

function rankCandidateConfidence(
  input: LocationInput,
  candidates: PlaceCandidate[],
): PlaceCandidate[] {
  const bestGeographicScore = Math.max(
    ...candidates.map((candidate) => candidate.score),
    Number.NEGATIVE_INFINITY,
  );
  const topGeographicCandidates = candidates.filter(
    (candidate) => candidate.score >= bestGeographicScore - 10,
  );
  return candidates.map((candidate) => {
    const exactLabel =
      normalizeName(candidate.label) === normalizeName(input.englishName);
    const confidence: PlaceCandidate["confidence"] =
      candidate.score === bestGeographicScore &&
      topGeographicCandidates.length === 1 &&
      exactLabel
        ? "high"
        : candidate.score >= bestGeographicScore - 35
          ? "medium"
          : "low";
    return { ...candidate, confidence };
  });
}

export async function resolveLocations(
  locations: LocationInput[],
  client: JsonHttpClient,
  inputSource: string,
): Promise<ResolutionFile> {
  const searchResults = new Map<string, SearchResult[]>();
  const allResults: SearchResult[] = [];

  for (const [index, location] of locations.entries()) {
    const results = await searchEntities(location, client);
    searchResults.set(location.id, results);
    allResults.push(...results);
    if ((index + 1) % 10 === 0 || index + 1 === locations.length) {
      console.log(
        `Searched Wikidata for ${index + 1}/${locations.length} locations`,
      );
    }
  }

  const initialEntities = await fetchEntities(
    allResults.map((result) => result.id),
    client,
  );
  const initialTypeAncestors = await fetchTypeAncestors(
    [...initialEntities.values()].flatMap((entity) =>
      getEntityIds(entity, "P31"),
    ),
    client,
  );
  const geographicResults = new Map<string, SearchResult[]>();
  for (const location of locations) {
    const results = (searchResults.get(location.id) ?? []).filter((result) =>
      isGeographicEntity(initialEntities.get(result.id), initialTypeAncestors),
    );
    geographicResults.set(location.id, results);
  }

  const administrativeLineage = await fetchAdministrativeLineage(
    [...geographicResults.values()].flatMap((results) =>
      results.flatMap((result) => {
        const entity = initialEntities.get(result.id);
        return entity ? [entity] : [];
      }),
    ),
    client,
  );
  const placeEntities = new Map([
    ...initialEntities.entries(),
    ...administrativeLineage.entries(),
  ]);
  const lineageTypeAncestors = await fetchTypeAncestors(
    [...administrativeLineage.values()].flatMap((entity) =>
      getEntityIds(entity, "P31"),
    ),
    client,
  );
  const typeAncestors = new Map([
    ...initialTypeAncestors.entries(),
    ...lineageTypeAncestors.entries(),
  ]);

  const administrativeCandidateResults = new Map<
    string,
    Map<
      string,
      {
        result: SearchResult;
        relatedPlaceNameScore: number;
        relatedProvinceAligned: boolean;
      }
    >
  >();
  for (const location of locations) {
    const candidates = new Map<
      string,
      {
        result: SearchResult;
        relatedPlaceNameScore: number;
        relatedProvinceAligned: boolean;
      }
    >();
    const addCandidate = (
      result: SearchResult,
      relatedPlaceNameScore: number,
      relatedProvinceAligned: boolean,
    ) => {
      const current = candidates.get(result.id);
      if (!current) {
        candidates.set(result.id, {
          result,
          relatedPlaceNameScore,
          relatedProvinceAligned,
        });
      } else {
        candidates.set(result.id, {
          result,
          relatedPlaceNameScore: Math.max(
            relatedPlaceNameScore,
            current.relatedPlaceNameScore,
          ),
          relatedProvinceAligned:
            relatedProvinceAligned || current.relatedProvinceAligned,
        });
      }
    };

    for (const placeResult of geographicResults.get(location.id) ?? []) {
      const placeEntity = initialEntities.get(placeResult.id);
      const placeNameScore = candidateScore(
        location,
        placeResult,
        placeEntity,
        false,
        0,
        false,
      );
      if (isAdministrativeEntity(placeEntity, typeAncestors)) {
        addCandidate(
          placeResult,
          0,
          provinceMatchesEntity(location, placeEntity, placeEntities),
        );
      }
      const placeProvinceAligned = provinceMatchesEntity(
        location,
        placeEntity,
        placeEntities,
      );

      let pending = getEntityIds(placeEntity, "P131");
      const visited = new Set<string>();
      for (let depth = 0; depth < 2 && pending.length > 0; depth += 1) {
        const next: string[] = [];
        for (const qid of pending) {
          if (visited.has(qid)) {
            continue;
          }
          visited.add(qid);
          const ancestor = placeEntities.get(qid);
          if (!ancestor) {
            continue;
          }
          const label = getLabel(ancestor);
          if (
            isAdministrativeEntity(ancestor, typeAncestors) &&
            label &&
            !/^Q\d+$/.test(label)
          ) {
            addCandidate(
              {
                id: qid,
                label,
                description: getDescription(ancestor) ?? "",
              },
              placeNameScore,
              placeProvinceAligned,
            );
          }
          next.push(...getEntityIds(ancestor, "P131"));
        }
        pending = next;
      }
    }
    administrativeCandidateResults.set(location.id, candidates);
  }

  const referencedIds = [...placeEntities.values()].flatMap((entity) => [
    ...getEntityIds(entity, "P17"),
    ...getEntityIds(entity, "P131"),
  ]);
  const referenceEntities = await fetchEntities(referencedIds, client);
  const languageIds = [...referenceEntities.values()].flatMap((entity) =>
    getEntityIds(entity, "P37"),
  );
  const languageEntities = await fetchEntities(languageIds, client);
  const entities = new Map([
    ...placeEntities.entries(),
    ...referenceEntities.entries(),
    ...languageEntities.entries(),
  ]);

  const resolutions: LocationResolution[] = locations.map((location) => {
    const candidates = [
      ...(administrativeCandidateResults.get(location.id)?.values() ?? []),
    ]
      .filter(
        ({ result }) =>
          getLabel(entities.get(result.id)) ||
          (result.label.length > 0 && !/^Q\d+$/.test(result.label)),
      )
      .map(({ result, relatedPlaceNameScore, relatedProvinceAligned }) => {
        const candidate = buildCandidate(
          location,
          result,
          entities,
          relatedPlaceNameScore,
        );
        return {
          candidate,
          provinceAligned:
            relatedProvinceAligned ||
            provinceMatchesEntity(location, entities.get(result.id), entities),
          countryContextAligned: contextMatchesCountry(
            location,
            candidate.country,
          ),
        };
      });
    const countryAlignedCandidates = candidates.filter(
      (candidate) => candidate.countryContextAligned,
    );
    const candidatesForLocation =
      countryAlignedCandidates.length > 0
        ? countryAlignedCandidates
        : candidates;
    const provinceAlignedCandidates = candidatesForLocation.filter(
      (candidate) => candidate.provinceAligned,
    );
    const candidatesWithProvincePreference =
      location.eu5Province && provinceAlignedCandidates.length > 0
        ? provinceAlignedCandidates
        : candidatesForLocation;
    const rankedCandidates = candidatesWithProvincePreference
      .map(({ candidate }) => candidate)
      .sort((left, right) => right.score - left.score)
      .slice(0, 5);
    const confidenceRankedCandidates = rankCandidateConfidence(
      location,
      rankedCandidates,
    );
    return {
      location,
      status:
        confidenceRankedCandidates.length > 0 ? "needs-review" : "unresolved",
      selectedQid: null,
      candidates: confidenceRankedCandidates,
    };
  });

  return {
    formatVersion: 1,
    generatedAt: new Date().toISOString(),
    inputSource,
    locations: resolutions,
  };
}
