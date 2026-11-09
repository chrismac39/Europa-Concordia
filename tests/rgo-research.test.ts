import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { JsonHttpClient } from "../scripts/rgo-research/api.js";
import {
  loadRgoGoodsCatalog,
  matchRgoGoods,
} from "../scripts/rgo-research/crops.js";
import {
  parseFruitReviewLocations,
  parseLocationInput,
  parseResolutionReviewCsv,
  parseResolutionFile,
} from "../scripts/rgo-research/inventory.js";
import { encodeCsvRow, parseCsv } from "../scripts/rgo-research/csv.js";
import type { ResolutionFile } from "../scripts/rgo-research/model.js";
import { resolveLocations } from "../scripts/rgo-research/wikidata.js";
import { researchResolvedLocations } from "../scripts/rgo-research/wikipedia.js";
import {
  addEu5Provinces,
  parseEu5ProvinceMap,
} from "../scripts/rgo-research/provinces.js";
import {
  writeResearchReports,
  writeResolutionReports,
} from "../scripts/rgo-research/report.js";
import {
  getAdminScaleRecord,
  parseAdminScaleIndex,
} from "../scripts/rgo-research/admin-scale.js";
import type { AdminScaleIndex } from "../scripts/rgo-research/admin-scale.js";

const rootDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

function createTemporaryDirectory(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), "rgo-research-test-"));
}

async function createVanillaMap(temporaryDirectory: string): Promise<string> {
  const gamePath = path.join(temporaryDirectory, "game");
  const mapPath = path.join(
    gamePath,
    "in_game",
    "map_data",
    "location_templates.txt",
  );
  await mkdir(path.join(gamePath, "in_game", "common", "goods"), {
    recursive: true,
  });
  await mkdir(path.dirname(mapPath), { recursive: true });
  await writeFile(
    mapPath,
    "example = { raw_material = vanilla_test_good }\n",
    "utf8",
  );
  await writeFile(
    path.join(gamePath, "in_game", "common", "goods", "raw_materials.txt"),
    [
      "vanilla_defined_good = {",
      " method = farming",
      " category = raw_material",
      "}",
    ].join("\n"),
    "utf8",
  );
  return mapPath;
}

test("Expanded inventory parser reads 71 unique Harmony-fruit decisions", async () => {
  const markdown = await readFile(
    path.join(
      rootDirectory,
      "integration",
      "decisions",
      "RGO-Harmony-Expanded-Inventory.md",
    ),
    "utf8",
  );
  const locations = parseFruitReviewLocations(markdown);
  assert.equal(locations.length, 71);
  assert.equal(new Set(locations.map((location) => location.id)).size, 71);
  assert.ok(locations.every((location) => location.englishName.length > 0));
});

test("JSON location input rejects duplicate IDs and missing context", () => {
  assert.throws(
    () =>
      parseLocationInput([
        { id: "one", englishName: "One", context: "" },
        { id: "one", englishName: "Two", context: "" },
      ]),
    /duplicate IDs/,
  );
  assert.throws(
    () => parseLocationInput([{ id: "one", englishName: "One" }]),
    /string id, englishName, and context/,
  );
});

test("EU5 province parser maps locations to their game province", () => {
  const provinces = parseEu5ProvinceMap(`
    crescent_region = {
      iraq_arabi_area = {
        basra_province = {
          not_eligible_for_dynamic_country_name = yes
          basra abadan abdas
        }
        baghdad_province = { baghdad baqubah }
      }
      limousin_province = {
        limousin_province = { limoges }
        la_marche_province = { gueret }
      }
    }
    iberia_region = {
      toledo_area = {
        west_mancha_province = { ciudad_real calatrava }
      }
    }
  `);
  assert.deepEqual(provinces.get("abdas"), {
    id: "basra_province",
    name: "Basra",
    areaId: "iraq_arabi_area",
    areaName: "Iraq Arabi",
    regionId: "crescent_region",
    regionName: "Crescent",
  });
  assert.deepEqual(provinces.get("gueret"), {
    id: "la_marche_province",
    name: "La Marche",
    regionId: "crescent_region",
    regionName: "Crescent",
  });
  assert.deepEqual(provinces.get("calatrava"), {
    id: "west_mancha_province",
    name: "West Mancha",
    areaId: "toledo_area",
    areaName: "Toledo",
    regionId: "iberia_region",
    regionName: "Iberia",
  });
  assert.deepEqual(
    addEu5Provinces(
      [{ id: "abdas", englishName: "Abdas", context: "Hüleguids" }],
      provinces,
    ),
    [
      {
        id: "abdas",
        englishName: "Abdas",
        context: "Hüleguids",
        eu5Province: "Basra",
        eu5ProvinceId: "basra_province",
        eu5Area: "Iraq Arabi",
        eu5AreaId: "iraq_arabi_area",
        eu5Region: "Crescent",
        eu5RegionId: "crescent_region",
      },
    ],
  );
});

test("administrative scale index validates records and looks up ISO3 codes", () => {
  const index = parseAdminScaleIndex({
    formatVersion: 1,
    generatedAt: "2026-01-01T00:00:00.000Z",
    referenceAreaKm2: 100,
    referenceDescription: "EU LAU median",
    countries: {
      FRA: {
        countryIso3: "FRA",
        countryName: "France",
        selectedLevel: "LAU",
        levelName: "LAU (local administrative unit)",
        typicalAreaKm2: 200,
        areaStatistic: "median",
        unitCount: 34_000,
        sourceDataset: "Eurostat GISCO LAU 2024",
        sourceVersion: "2024",
        sourceUrl: "https://example.test/lau",
      },
    },
  });
  assert.equal(getAdminScaleRecord(index, "fra")?.selectedLevel, "LAU");
  assert.equal(getAdminScaleRecord(index, undefined), undefined);
  assert.throws(
    () => parseAdminScaleIndex({ ...index, formatVersion: 2 }),
    /invalid administrative scale index/i,
  );
});

test("generated administrative scale index includes global and GISCO entries", async () => {
  const index = parseAdminScaleIndex(
    JSON.parse(
      await readFile(
        path.join(rootDirectory, "config", "rgo-research-admin-scales.json"),
        "utf8",
      ),
    ),
  );
  assert.ok(Object.keys(index.countries).length >= 200);
  assert.equal(index.countries.FRA?.selectedLevel, "LAU");
  assert.equal(index.countries.USA?.selectedLevel, "ADM2");
  assert.equal(index.countries.IRQ?.areaStatistic, "mean");
});

test("catalog validates configured goods and matches localized crop aliases", async () => {
  const temporaryDirectory = await createTemporaryDirectory();
  try {
    const vanillaMapPath = await createVanillaMap(temporaryDirectory);
    const catalog = await loadRgoGoodsCatalog(rootDirectory, vanillaMapPath);
    assert.ok(catalog.ids.has("fruit_apple"));
    assert.ok(catalog.ids.has("fruit_grape"));
    assert.ok(catalog.ids.has("western_pear"));
    assert.ok(catalog.ids.has("cinnamon"));
    assert.ok(catalog.ids.has("vanilla_test_good"));
    assert.ok(catalog.ids.has("vanilla_defined_good"));

    const matches = matchRgoGoods(
      "Les vignobles produisaient du raisin.",
      "fr",
      catalog,
    );
    assert.ok(
      matches.some(
        (match) => match.goodId === "fruit_grape" && match.occurrenceCount >= 1,
      ),
    );
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});

test("Wikidata resolver returns place candidates without selecting one", async () => {
  const temporaryDirectory = await createTemporaryDirectory();
  try {
    const searchQueries: string[] = [];
    const fetchImplementation: typeof fetch = async (input) => {
      const url = new URL(String(input));
      const params = url.searchParams;
      if (params.get("action") === "wbsearchentities") {
        searchQueries.push(params.get("search") ?? "");
        return Response.json({
          search: [
            {
              id: "Q1",
              label: "Blois",
              description: "commune in France",
            },
            {
              id: "Q3",
              label: "Blois",
              description: "family name",
            },
            {
              id: "Q4",
              label: "Blois",
              description: "person",
            },
            {
              id: "Q6",
              label: "Blois-sur-Seille",
              description: "commune in Jura, France",
            },
          ],
        });
      }

      const ids = (params.get("ids") ?? "").split("|");
      const entities: Record<string, unknown> = {};
      if (ids.includes("Q1")) {
        entities.Q1 = {
          id: "Q1",
          labels: { en: { value: "Blois" } },
          descriptions: { en: { value: "commune in France" } },
          claims: {
            P31: [{ mainsnak: { datavalue: { value: { id: "Q515" } } } }],
            P17: [{ mainsnak: { datavalue: { value: { id: "Q142" } } } }],
            P131: [{ mainsnak: { datavalue: { value: { id: "Q2" } } } }],
            P625: [
              {
                mainsnak: {
                  datavalue: {
                    value: { latitude: 47.5861, longitude: 1.3359 },
                  },
                },
              },
            ],
          },
          sitelinks: {
            enwiki: { title: "Blois" },
            frwiki: { title: "Blois" },
          },
        };
      }
      if (ids.includes("Q3")) {
        entities.Q3 = {
          id: "Q3",
          labels: { en: { value: "Blois" } },
          descriptions: { en: { value: "family name" } },
          claims: {
            P31: [{ mainsnak: { datavalue: { value: { id: "Q900" } } } }],
          },
        };
      }
      if (ids.includes("Q4")) {
        entities.Q4 = {
          id: "Q4",
          labels: { en: { value: "Blois" } },
          descriptions: { en: { value: "person" } },
          claims: {
            P31: [{ mainsnak: { datavalue: { value: { id: "Q5" } } } }],
          },
        };
      }
      if (ids.includes("Q6")) {
        entities.Q6 = {
          id: "Q6",
          labels: { en: { value: "Blois-sur-Seille" } },
          descriptions: { en: { value: "commune in Jura, Taiwan" } },
          claims: {
            P31: [{ mainsnak: { datavalue: { value: { id: "Q484170" } } } }],
            P131: [{ mainsnak: { datavalue: { value: { id: "Q7" } } } }],
            P17: [{ mainsnak: { datavalue: { value: { id: "Q8" } } } }],
          },
        };
      }
      if (ids.includes("Q7")) {
        entities.Q7 = {
          id: "Q7",
          labels: { en: { value: "Jura" } },
          claims: {
            P17: [{ mainsnak: { datavalue: { value: { id: "Q8" } } } }],
          },
        };
      }
      if (ids.includes("Q8")) {
        entities.Q8 = {
          id: "Q8",
          labels: { en: { value: "Taiwan" } },
          claims: {
            P37: [{ mainsnak: { datavalue: { value: { id: "Q150" } } } }],
          },
        };
      }
      if (ids.includes("Q484170")) {
        entities.Q484170 = {
          id: "Q484170",
          labels: { en: { value: "commune" } },
        };
      }
      if (ids.includes("Q515")) {
        entities.Q515 = {
          id: "Q515",
          labels: { en: { value: "city" } },
          claims: {
            P279: [{ mainsnak: { datavalue: { value: { id: "Q486972" } } } }],
          },
        };
      }
      if (ids.includes("Q486972")) {
        entities.Q486972 = {
          id: "Q486972",
          labels: { en: { value: "human settlement" } },
          claims: {
            P279: [{ mainsnak: { datavalue: { value: { id: "Q618123" } } } }],
          },
        };
      }
      if (ids.includes("Q618123")) {
        entities.Q618123 = {
          id: "Q618123",
          labels: { en: { value: "geographical object" } },
        };
      }
      if (ids.includes("Q101352")) {
        entities.Q101352 = {
          id: "Q101352",
          labels: { en: { value: "family name" } },
        };
      }
      if (ids.includes("Q900")) {
        entities.Q900 = {
          id: "Q900",
          labels: {
            en: { value: "toponymic family name with geographic ancestry" },
          },
          claims: {
            P279: [
              { mainsnak: { datavalue: { value: { id: "Q17143070" } } } },
              { mainsnak: { datavalue: { value: { id: "Q82794" } } } },
            ],
          },
        };
      }
      if (ids.includes("Q17143070")) {
        entities.Q17143070 = {
          id: "Q17143070",
          labels: { en: { value: "toponymic surname" } },
          claims: {
            P279: [{ mainsnak: { datavalue: { value: { id: "Q82794" } } } }],
          },
        };
      }
      if (ids.includes("Q82794")) {
        entities.Q82794 = {
          id: "Q82794",
          labels: { en: { value: "geographic region" } },
        };
      }
      if (ids.includes("Q5")) {
        entities.Q5 = {
          id: "Q5",
          labels: { en: { value: "human" } },
        };
      }
      if (ids.includes("Q142")) {
        entities.Q142 = {
          id: "Q142",
          labels: { en: { value: "France" } },
          claims: {
            P298: [{ mainsnak: { datavalue: { value: "FRA" } } }],
            P37: [{ mainsnak: { datavalue: { value: { id: "Q150" } } } }],
          },
        };
      }
      if (ids.includes("Q2")) {
        entities.Q2 = {
          id: "Q2",
          labels: { en: { value: "Loir-et-Cher" } },
          descriptions: { en: { value: "department in France" } },
          claims: {
            P31: [{ mainsnak: { datavalue: { value: { id: "Q56061" } } } }],
            P17: [{ mainsnak: { datavalue: { value: { id: "Q142" } } } }],
          },
          sitelinks: {
            enwiki: { title: "Loir-et-Cher" },
            frwiki: { title: "Loir-et-Cher" },
          },
        };
      }
      if (ids.includes("Q56061")) {
        entities.Q56061 = {
          id: "Q56061",
          labels: { en: { value: "administrative territorial entity" } },
        };
      }
      if (ids.includes("Q150")) {
        entities.Q150 = {
          id: "Q150",
          labels: { en: { value: "French" } },
          claims: {
            P424: [{ mainsnak: { datavalue: { value: "fr" } } }],
          },
        };
      }
      return Response.json({ entities });
    };
    const client = new JsonHttpClient({
      cachePath: path.join(temporaryDirectory, "cache.json"),
      minIntervalMs: 0,
      fetchImplementation,
    });

    const adminScaleIndex: AdminScaleIndex = {
      formatVersion: 1,
      generatedAt: "2026-01-01T00:00:00.000Z",
      referenceAreaKm2: 100,
      referenceDescription: "EU LAU median",
      countries: {
        FRA: {
          countryIso3: "FRA",
          countryName: "France",
          selectedLevel: "LAU",
          levelName: "LAU (local administrative unit)",
          typicalAreaKm2: 200,
          areaStatistic: "median",
          unitCount: 34_000,
          sourceDataset: "Eurostat GISCO LAU 2024",
          sourceVersion: "2024",
          sourceUrl: "https://example.test/lau",
        },
      },
    };
    const result = await resolveLocations(
      [
        {
          id: "blois",
          englishName: "Blois",
          context: "Kingdom of France",
          eu5Province: "Blois",
          eu5Area: "Orleanais",
          eu5Region: "Western Europe",
        },
      ],
      client,
      "test",
      adminScaleIndex,
    );
    const location = result.locations[0];
    assert.equal(location.selectedQid, null);
    assert.equal(location.status, "needs-review");
    assert.equal(location.candidates[0].qid, "Q2");
    assert.equal(location.candidates[0].label, "Loir-et-Cher");
    assert.equal(location.candidates[0].confidence, "medium");
    assert.equal(location.candidates[0].country, "France");
    assert.ok(searchQueries.includes("Blois"));
    assert.ok(searchQueries.includes("Orleanais"));
    assert.ok(searchQueries.includes("Western Europe"));
    assert.equal(location.candidates[0].countryIso3, "FRA");
    assert.equal(location.candidates[0].administrativeScale?.level, "LAU");
    assert.equal(location.candidates.length, 1);
    assert.equal(
      location.candidates.some((candidate) => candidate.qid === "Q1"),
      false,
    );
    assert.equal(
      location.candidates.some((candidate) => candidate.qid === "Q3"),
      false,
    );
    assert.equal(
      location.candidates.some((candidate) => candidate.qid === "Q4"),
      false,
    );
    assert.equal(
      location.candidates.some((candidate) => candidate.qid === "Q6"),
      false,
    );
    assert.deepEqual(
      location.candidates[0].localWikipedia.map((page) => page.language),
      ["fr"],
    );
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});

test("EU5 area and region searches prefer a matching country", async () => {
  const temporaryDirectory = await createTemporaryDirectory();
  try {
    const fetchImplementation: typeof fetch = async (input) => {
      const params = new URL(String(input)).searchParams;
      if (params.get("action") === "wbsearchentities") {
        const search = params.get("search");
        const results =
          search === "Calatrava"
            ? [
                {
                  id: "QPH",
                  label: "Calatrava",
                  description: "municipality in the Philippines",
                },
                {
                  id: "QES",
                  label: "Calatrava",
                  description: "municipality in Spain",
                },
              ]
            : search === "Toledo"
              ? [
                  {
                    id: "QTOLEDO",
                    label: "Toledo",
                    description: "province in Spain",
                  },
                ]
              : [
                  {
                    id: "QIBERIA",
                    label: "Iberia",
                    description: "geographic region in Spain",
                  },
                ];
        return Response.json({ search: results });
      }

      const ids = (params.get("ids") ?? "").split("|");
      const entityData: Record<
        string,
        { label: string; type?: string; country?: string }
      > = {
        QPH: { label: "Calatrava", type: "Q56061", country: "Q928" },
        QES: { label: "Calatrava", type: "Q56061", country: "Q29" },
        QTOLEDO: { label: "Toledo", type: "Q56061", country: "Q29" },
        QIBERIA: { label: "Iberia", type: "Q82794", country: "Q29" },
        Q928: { label: "Philippines" },
        Q29: { label: "Spain" },
        Q56061: { label: "administrative territorial entity" },
        Q82794: { label: "geographic region" },
      };
      const entities = Object.fromEntries(
        ids.flatMap((id) => {
          const data = entityData[id];
          return data
            ? [
                [
                  id,
                  {
                    id,
                    labels: { en: { value: data.label } },
                    descriptions: {
                      en: {
                        value:
                          data.label === "Calatrava"
                            ? id === "QPH"
                              ? "municipality in the Philippines"
                              : "municipality in Spain"
                            : "",
                      },
                    },
                    claims: {
                      ...(data.type
                        ? {
                            P31: [
                              {
                                mainsnak: {
                                  datavalue: { value: { id: data.type } },
                                },
                              },
                            ],
                          }
                        : {}),
                      ...(data.country
                        ? {
                            P17: [
                              {
                                mainsnak: {
                                  datavalue: { value: { id: data.country } },
                                },
                              },
                            ],
                          }
                        : {}),
                    },
                  },
                ],
              ]
            : [];
        }),
      );
      return Response.json({ entities });
    };
    const client = new JsonHttpClient({
      cachePath: path.join(temporaryDirectory, "cache.json"),
      minIntervalMs: 0,
      fetchImplementation,
    });
    const result = await resolveLocations(
      [
        {
          id: "calatrava",
          englishName: "Calatrava",
          context: "Castile",
          eu5Province: "West Mancha",
          eu5Area: "Toledo",
          eu5Region: "Iberia",
        },
      ],
      client,
      "test",
      {
        formatVersion: 1,
        generatedAt: "2026-01-01T00:00:00.000Z",
        referenceAreaKm2: 100,
        referenceDescription: "EU LAU median",
        countries: {},
      },
    );
    assert.deepEqual(
      result.locations[0].candidates.map((candidate) => candidate.country),
      ["Spain"],
    );
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});

test("resolution JSON parser preserves manual place selection", () => {
  const file: ResolutionFile = {
    formatVersion: 1,
    generatedAt: "2026-01-01T00:00:00.000Z",
    inputSource: "test",
    locations: [
      {
        location: {
          id: "blois",
          englishName: "Blois",
          context: "France",
          eu5Region: "Western Europe",
          eu5RegionId: "western_europe_region",
          eu5Area: "Orleanais",
          eu5AreaId: "orleanais_area",
          eu5Province: "Basra",
          eu5ProvinceId: "basra_province",
        },
        status: "needs-review",
        selectedQid: "Q1",
        candidates: [
          {
            qid: "Q1",
            label: "Blois",
            description: "commune in France",
            score: 125,
            confidence: "high",
            country: "France",
            countryIso3: "FRA",
            administrativeScale: {
              level: "LAU",
              levelName: "LAU (local administrative unit)",
              typicalAreaKm2: 11,
              areaStatistic: "median",
              unitCount: 34_000,
              sourceDataset: "Eurostat GISCO LAU 2024",
              sourceVersion: "2024",
              sourceUrl: "https://example.test/lau",
            },
            localWikipedia: [
              {
                language: "fr",
                title: "Blois",
                url: "https://fr.wikipedia.org/wiki/Blois",
              },
            ],
          },
        ],
      },
    ],
  };
  const parsed = parseResolutionFile(file);
  assert.deepEqual(parsed, file);
  assert.equal(
    parsed.locations[0].candidates[0].administrativeScale?.level,
    "LAU",
  );
  assert.throws(
    () => parseResolutionFile({ ...file, formatVersion: 2 }),
    /invalid format/,
  );
});

test("resolution review CSV applies a single correct-candidate flag", () => {
  const file: ResolutionFile = {
    formatVersion: 1,
    generatedAt: "2026-01-01T00:00:00.000Z",
    inputSource: "test",
    locations: [
      {
        location: { id: "blois", englishName: "Blois", context: "France" },
        status: "needs-review",
        selectedQid: null,
        candidates: [
          {
            qid: "Q1",
            label: "Blois",
            description: "commune in France",
            score: 125,
            confidence: "high",
            localWikipedia: [],
          },
          {
            qid: "Q2",
            label: "Blois (other)",
            description: "other place",
            score: 60,
            confidence: "low",
            localWikipedia: [],
          },
        ],
      },
    ],
  };
  const csv = [
    encodeCsvRow(["location_id", "candidate_qid", "correct", "label"]),
    encodeCsvRow(["blois", "Q1", "TRUE", "Blois, France"]),
    encodeCsvRow(["blois", "Q2", "FALSE", 'A "different" place']),
  ].join("\r\n");
  assert.deepEqual(parseCsv(csv), [
    ["location_id", "candidate_qid", "correct", "label"],
    ["blois", "Q1", "TRUE", "Blois, France"],
    ["blois", "Q2", "FALSE", 'A "different" place'],
  ]);
  assert.equal(
    parseResolutionReviewCsv(csv, file).locations[0].selectedQid,
    "Q1",
  );
  assert.throws(
    () =>
      parseResolutionReviewCsv(
        [
          "location_id,candidate_qid,correct",
          "blois,Q1,TRUE",
          "blois,Q2,TRUE",
        ].join("\n"),
        file,
      ),
    /more than one candidate correct/,
  );
});

test("resolution reports surface the selected country scale target", async () => {
  const temporaryDirectory = await createTemporaryDirectory();
  try {
    const resolution: ResolutionFile = {
      formatVersion: 1,
      generatedAt: "2026-01-01T00:00:00.000Z",
      inputSource: "test",
      locations: [
        {
          location: { id: "blois", englishName: "Blois", context: "France" },
          status: "needs-review",
          selectedQid: null,
          candidates: [
            {
              qid: "Q1",
              label: "Blois",
              description: "commune in France",
              score: 100,
              confidence: "high",
              country: "France",
              countryIso3: "FRA",
              administrativeScale: {
                level: "LAU",
                levelName: "LAU (local administrative unit)",
                typicalAreaKm2: 11,
                areaStatistic: "median",
                unitCount: 34_000,
                sourceDataset: "Eurostat GISCO LAU 2024",
                sourceVersion: "2024",
                sourceUrl: "https://example.test/lau",
              },
              localWikipedia: [],
            },
          ],
        },
      ],
    };
    const output = await writeResolutionReports(
      temporaryDirectory,
      "pilot-resolution.json",
      resolution,
    );
    const reviewRows = parseCsv(await readFile(output.reviewCsvPath, "utf8"));
    const levelIndex = reviewRows[0].indexOf("selected_admin_level");
    const areaIndex = reviewRows[0].indexOf("typical_unit_area_km2");
    assert.equal(reviewRows[1][levelIndex], "LAU");
    assert.equal(reviewRows[1][areaIndex], "11");
    assert.equal(reviewRows[1][reviewRows[0].indexOf("correct")], "FALSE");
    assert.match(
      await readFile(output.markdownPath, "utf8"),
      /LAU \(local administrative unit\); 11\.0 km² \(median, Eurostat GISCO LAU 2024\)/,
    );
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});

test("Wikipedia research extracts relevant sections, years, citations, and crop signals", async () => {
  const temporaryDirectory = await createTemporaryDirectory();
  try {
    const wikitext = [
      "'''Blois''' est une commune.",
      "== Histoire ==",
      "Le commerce local est mentionné au XVe siècle, notamment en 1450.",
      "Contexte historique. ".repeat(180),
      "Les vignobles produisaient du raisin en 1790.",
      "=== Agriculture ===",
      "La culture du raisin est aussi mentionnée.",
      "<ref>{{cite web |url=https://example.org/history |title=History}}</ref>",
      "== Géographie ==",
      "La Loire traverse la ville.",
      "== Économie ==",
      "Le raisin était vendu en 1789.",
    ].join("\n");
    const client = new JsonHttpClient({
      cachePath: path.join(temporaryDirectory, "cache.json"),
      minIntervalMs: 0,
      fetchImplementation: async () =>
        Response.json({
          parse: {
            revid: 123,
            wikitext,
          },
        }),
    });
    const catalog = await loadRgoGoodsCatalog(
      rootDirectory,
      await createVanillaMap(temporaryDirectory),
    );
    const resolution: ResolutionFile = {
      formatVersion: 1,
      generatedAt: "2026-01-01T00:00:00.000Z",
      inputSource: "test",
      locations: [
        {
          location: { id: "blois", englishName: "Blois", context: "France" },
          status: "needs-review",
          selectedQid: "Q1",
          candidates: [
            {
              qid: "Q1",
              label: "Blois",
              description: "commune in France",
              score: 125,
              confidence: "high",
              country: "France",
              localWikipedia: [
                {
                  language: "fr",
                  title: "Blois",
                  url: "https://fr.wikipedia.org/wiki/Blois",
                },
              ],
            },
          ],
        },
      ],
    };

    const research = await researchResolvedLocations(
      resolution,
      client,
      catalog,
      "test-resolution.json",
    );
    const [article] = research.locations[0].sources;
    assert.equal(article.languageMode, "local");
    assert.equal(article.pageRevisionId, 123);
    assert.deepEqual(
      article.sections.map((section) => section.heading),
      ["Histoire", "Économie"],
    );
    assert.ok(article.sections[0].years.includes(1450));
    assert.ok(article.sections[0].years.includes(1790));
    assert.equal(article.sections[0].truncated, true);
    assert.ok(
      article.sections[0].cropMatches.some(
        (match) => match.goodId === "fruit_grape",
      ),
    );
    assert.deepEqual(article.sections[0].citationUrls, [
      "https://example.org/history",
    ]);
    const output = await writeResearchReports(
      temporaryDirectory,
      "pilot-research.json",
      research,
    );
    const reviewRows = parseCsv(
      await readFile(output.rgoReviewCsvPath, "utf8"),
    );
    const goodIdIndex = reviewRows[0].indexOf("good_id");
    const validIndex = reviewRows[0].indexOf("valid_rgo");
    assert.ok(
      reviewRows
        .slice(1)
        .some(
          (row) =>
            row[goodIdIndex] === "fruit_grape" && row[validIndex] === "FALSE",
        ),
    );
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});

test("English Wikipedia is used as fallback only when no local page is linked", async () => {
  const temporaryDirectory = await createTemporaryDirectory();
  try {
    const client = new JsonHttpClient({
      cachePath: path.join(temporaryDirectory, "cache.json"),
      minIntervalMs: 0,
      fetchImplementation: async () =>
        Response.json({
          parse: {
            revid: 456,
            wikitext: "'''Example''' location.",
          },
        }),
    });
    const catalog = await loadRgoGoodsCatalog(
      rootDirectory,
      await createVanillaMap(temporaryDirectory),
    );
    const resolution: ResolutionFile = {
      formatVersion: 1,
      generatedAt: "2026-01-01T00:00:00.000Z",
      inputSource: "test",
      locations: [
        {
          location: { id: "example", englishName: "Example", context: "" },
          status: "needs-review",
          selectedQid: "Q10",
          candidates: [
            {
              qid: "Q10",
              label: "Example",
              description: "town",
              score: 100,
              confidence: "high",
              localWikipedia: [],
              englishWikipedia: {
                language: "en",
                title: "Example",
                url: "https://en.wikipedia.org/wiki/Example",
              },
            },
          ],
        },
      ],
    };

    const research = await researchResolvedLocations(
      resolution,
      client,
      catalog,
      "test-resolution.json",
    );
    assert.equal(
      research.locations[0].sources[0].languageMode,
      "english-fallback",
    );
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});
