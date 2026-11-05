import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
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
  parseResolutionFile,
} from "../scripts/rgo-research/inventory.js";
import type { ResolutionFile } from "../scripts/rgo-research/model.js";
import { resolveLocations } from "../scripts/rgo-research/wikidata.js";
import { researchResolvedLocations } from "../scripts/rgo-research/wikipedia.js";
import {
  addEu5Provinces,
  parseEu5ProvinceMap,
} from "../scripts/rgo-research/provinces.js";

const rootDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

function createTemporaryDirectory(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), "rgo-research-test-"));
}

test("pilot inventory parser reads 71 unique Harmony fruit locations", async () => {
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
        limousin_province = {
          limousin_province = { limoges }
          la_marche_province = { gueret }
        }
      }
    }
  `);
  assert.deepEqual(provinces.get("abdas"), {
    id: "basra_province",
    name: "Basra",
  });
  assert.deepEqual(provinces.get("gueret"), {
    id: "la_marche_province",
    name: "La Marche",
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
      },
    ],
  );
});

test("catalog validates configured goods and matches localized crop aliases", async () => {
  const catalog = await loadRgoGoodsCatalog(rootDirectory);
  assert.ok(catalog.ids.has("fruit_apple"));
  assert.ok(catalog.ids.has("fruit_grape"));
  assert.ok(catalog.ids.has("western_pear"));

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
});

test("Wikidata resolver returns place candidates without selecting one", async () => {
  const temporaryDirectory = await createTemporaryDirectory();
  try {
    const fetchImplementation: typeof fetch = async (input) => {
      const url = new URL(String(input));
      const params = url.searchParams;
      if (params.get("action") === "wbsearchentities") {
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
            P37: [{ mainsnak: { datavalue: { value: { id: "Q150" } } } }],
          },
        };
      }
      if (ids.includes("Q2")) {
        entities.Q2 = {
          id: "Q2",
          labels: { en: { value: "Loir-et-Cher" } },
          claims: {
            P17: [{ mainsnak: { datavalue: { value: { id: "Q142" } } } }],
          },
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

    const result = await resolveLocations(
      [{ id: "blois", englishName: "Blois", context: "Kingdom of France" }],
      client,
      "test",
    );
    const location = result.locations[0];
    assert.equal(location.selectedQid, null);
    assert.equal(location.status, "needs-review");
    assert.equal(location.candidates[0].qid, "Q1");
    assert.equal(location.candidates[0].confidence, "high");
    assert.equal(location.candidates[0].country, "France");
    assert.equal(location.candidates[0].administrativeArea, "Loir-et-Cher");
    assert.equal(location.candidates.length, 1);
    assert.equal(
      location.candidates.some((candidate) => candidate.qid === "Q3"),
      false,
    );
    assert.equal(
      location.candidates.some((candidate) => candidate.qid === "Q4"),
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
  assert.deepEqual(parseResolutionFile(file), file);
  assert.throws(
    () => parseResolutionFile({ ...file, formatVersion: 2 }),
    /invalid format/,
  );
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
    const catalog = await loadRgoGoodsCatalog(rootDirectory);
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
    const catalog = await loadRgoGoodsCatalog(rootDirectory);
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
