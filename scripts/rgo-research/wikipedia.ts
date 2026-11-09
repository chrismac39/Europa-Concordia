import type {
  ArticleResearch,
  LocationResearch,
  PlaceCandidate,
  ResearchFile,
  ResearchSection,
  ResolutionFile,
  WikipediaPageLink,
} from "./model.js";
import { JsonHttpClient } from "./api.js";
import { matchRgoGoods, type RgoGoodsCatalog } from "./crops.js";

const relevantHeadingTerms = [
  /\bhistory\b/i,
  /\bgeschichte\b/i,
  /\bagriculture\b/i,
  /\blandwirtschaft\b/i,
  /\bpertanian\b/i,
  /\beconomy\b/i,
  /\bgospodarka\b/i,
  /\bekonomi\b/i,
  /\beconomic\b/i,
  /\btrade\b/i,
  /\bindustry\b/i,
  /\bproduction\b/i,
  /\bcultivation\b/i,
  /\bviticulture\b/i,
  /\bagrar\w*\b/i,
  /\bwirtschaft\b/i,
  /\bhandel\b/i,
  /\bsejarah\b/i,
  /\bperdagangan\b/i,
  /\bhistoire\b/i,
  /économie/i,
  /\bagriculture\b/i,
  /\bhistoria\b/i,
  /economía/i,
  /\bcomercio\b/i,
  /\bagricultura\b/i,
  /\bhistoria\b/i,
  /\bekonomia\b/i,
  /\brolnictwo\b/i,
  /история/i,
  /экономика/i,
  /сельское хозяйство/i,
  /歴史/,
  /農業/,
  /経済/,
  /历史/,
  /農業/,
  /经济/,
  /경제/,
  /역사/,
  /농업/,
  /역사/,
];

interface ParsedSection {
  heading: string;
  level: number;
  start: number;
  end: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function extractWikitext(
  value: unknown,
  title: string,
): {
  wikitext: string;
  revisionId?: number;
} {
  if (!isRecord(value) || !isRecord(value.parse)) {
    throw new Error(`Wikipedia returned no parsed page for "${title}"`);
  }
  const parsed = value.parse as Record<string, unknown>;
  const wikitextValue = parsed.wikitext;
  const wikitext =
    typeof wikitextValue === "string"
      ? wikitextValue
      : isRecord(wikitextValue) && typeof wikitextValue["*"] === "string"
        ? wikitextValue["*"]
        : undefined;
  if (wikitext === undefined) {
    throw new Error(`Wikipedia response contained no wikitext for "${title}"`);
  }
  return {
    wikitext,
    ...(typeof parsed.revid === "number" ? { revisionId: parsed.revid } : {}),
  };
}

function parseSections(wikitext: string): ParsedSection[] {
  const headings: Array<Pick<ParsedSection, "heading" | "level" | "start">> =
    [];
  const pattern = /^(={2,6})\s*(.*?)\s*\1\s*$/gm;
  for (const match of wikitext.matchAll(pattern)) {
    if (match.index === undefined) {
      continue;
    }
    headings.push({
      heading: match[2].replace(/<[^>]+>/g, "").trim(),
      level: match[1].length,
      start: match.index + match[0].length,
    });
  }

  return headings.map((heading, index) => {
    const end = headings
      .slice(index + 1)
      .find((next) => next.level <= heading.level)?.start;
    return {
      ...heading,
      end: end ?? wikitext.length,
    };
  });
}

function removeTemplates(text: string): string {
  let result = text;
  let previous: string;
  do {
    previous = result;
    result = result.replace(/\{\{[^{}]*\}\}/g, " ");
  } while (result !== previous);
  return result;
}

function plainText(wikitext: string): string {
  return removeTemplates(wikitext)
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<ref\b[^>]*\/\s*>/gi, " ")
    .replace(/<ref\b[^>]*>[\s\S]*?<\/ref>/gi, " ")
    .replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?\]\]/g, "$1")
    .replace(/\[(?:https?:\/\/\S+?)(?:\s+([^\]]+))?\]/g, "$1")
    .replace(/'{2,5}/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCitationUrls(wikitext: string): string[] {
  const urls = new Set<string>();
  const references = [
    ...wikitext.matchAll(/<ref\b[^>]*>([\s\S]*?)<\/ref>/gi),
    ...wikitext.matchAll(/\{\{cite[^{}]*\}\}/gi),
  ];
  for (const reference of references) {
    for (const match of reference[0].matchAll(/https?:\/\/[^\s|}\]<]+/gi)) {
      urls.add(match[0].replace(/&amp;/g, "&").replace(/[.,;]+$/, ""));
    }
  }
  return [...urls];
}

function extractYears(text: string): number[] {
  const years = [...text.matchAll(/\b(1[3-8]\d{2})\b/g)].map((match) =>
    Number(match[1]),
  );
  return [...new Set(years)].sort((left, right) => left - right);
}

function isRelevantHeading(heading: string): boolean {
  return relevantHeadingTerms.some((term) => term.test(heading));
}

function sectionResearch(
  heading: string,
  wikitext: string,
  language: string,
  catalog: RgoGoodsCatalog,
): ResearchSection {
  const fullText = plainText(wikitext);
  const text = fullText.slice(0, 2500);
  return {
    heading,
    text,
    truncated: fullText.length > text.length,
    years: extractYears(fullText),
    cropMatches: matchRgoGoods(fullText, language, catalog),
    citationUrls: extractCitationUrls(wikitext),
  };
}

function aggregateCropMatches(sections: ResearchSection[]) {
  const matches = new Map<
    string,
    { goodId: string; alias: string; occurrenceCount: number }
  >();
  for (const section of sections) {
    for (const match of section.cropMatches) {
      const current = matches.get(match.goodId);
      if (current) {
        current.occurrenceCount += match.occurrenceCount;
      } else {
        matches.set(match.goodId, { ...match });
      }
    }
  }
  return [...matches.values()].sort((left, right) =>
    left.goodId.localeCompare(right.goodId),
  );
}

async function researchArticle(
  source: WikipediaPageLink,
  languageMode: ArticleResearch["languageMode"],
  client: JsonHttpClient,
  catalog: RgoGoodsCatalog,
): Promise<ArticleResearch> {
  const parameters = new URLSearchParams({
    action: "parse",
    page: source.title,
    prop: "wikitext",
    redirects: "1",
    format: "json",
  });
  const url = `https://${source.language}.wikipedia.org/w/api.php?${parameters.toString()}`;
  const response = await client.get(url);
  const { wikitext, revisionId } = extractWikitext(response, source.title);
  const parsedSections = parseSections(wikitext);
  const relevantSections = parsedSections.filter((section) =>
    isRelevantHeading(section.heading),
  );
  let relevant = relevantSections.filter(
    (section) =>
      !relevantSections.some(
        (parent) =>
          parent.level < section.level &&
          parent.start <= section.start &&
          parent.end >= section.end,
      ),
  );
  const notes: string[] = [];

  if (relevant.length === 0) {
    relevant = parsedSections.slice(0, 0);
    notes.push(
      "No history, economy, agriculture, trade, or industry section heading was found; only the article lead is summarized.",
    );
  }

  const sections =
    relevant.length > 0
      ? relevant.map((section) =>
          sectionResearch(
            section.heading,
            wikitext.slice(section.start, section.end),
            source.language,
            catalog,
          ),
        )
      : [
          sectionResearch(
            "Lead",
            wikitext.slice(0, parsedSections[0]?.start ?? wikitext.length),
            source.language,
            catalog,
          ),
        ];
  if (sections.every((section) => section.text.length === 0)) {
    notes.push("No readable prose was extracted from the selected page.");
  }

  return {
    source,
    languageMode,
    ...(revisionId !== undefined ? { pageRevisionId: revisionId } : {}),
    sections,
    articleRgoMatches: aggregateCropMatches(sections),
    notes,
  };
}

function selectedCandidate(
  resolution: ResolutionFile["locations"][number],
): PlaceCandidate {
  const qid = resolution.selectedQid;
  if (!qid) {
    throw new Error(
      `Location ${resolution.location.id} has no selectedQid; confirm a place candidate before research`,
    );
  }
  const candidate = resolution.candidates.find((item) => item.qid === qid);
  if (!candidate) {
    throw new Error(
      `Selected QID ${qid} for location ${resolution.location.id} is not in its candidate list`,
    );
  }
  return candidate;
}

export async function researchResolvedLocations(
  resolutionFile: ResolutionFile,
  client: JsonHttpClient,
  catalog: RgoGoodsCatalog,
  resolutionFilePath: string,
): Promise<ResearchFile> {
  const locations: LocationResearch[] = [];
  const selected = resolutionFile.locations.filter(
    (resolution) => resolution.selectedQid !== null,
  );

  for (const [index, resolution] of selected.entries()) {
    const candidate = selectedCandidate(resolution);
    const localPages = candidate.localWikipedia;
    const pages =
      localPages.length > 0
        ? localPages.map((source) => ({
            source,
            languageMode: "local" as const,
          }))
        : candidate.englishWikipedia
          ? [
              {
                source: candidate.englishWikipedia,
                languageMode: "english-fallback" as const,
              },
            ]
          : [];
    const notes: string[] = [];
    if (pages.length === 0) {
      notes.push(
        "No local-language or English Wikipedia article is linked from the selected Wikidata item.",
      );
    }

    const sources: ArticleResearch[] = [];
    for (const page of pages) {
      sources.push(
        await researchArticle(page.source, page.languageMode, client, catalog),
      );
    }

    locations.push({
      location: resolution.location,
      qid: candidate.qid,
      placeLabel: candidate.label,
      ...(candidate.country ? { country: candidate.country } : {}),
      ...(candidate.administrativeArea
        ? { administrativeArea: candidate.administrativeArea }
        : {}),
      sources,
      notes,
    });

    console.log(
      `Researched ${resolution.location.englishName} (${index + 1}/${selected.length})`,
    );
  }

  return {
    formatVersion: 1,
    generatedAt: new Date().toISOString(),
    resolutionFile: resolutionFilePath,
    locations,
  };
}
