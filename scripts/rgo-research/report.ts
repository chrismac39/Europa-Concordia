import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { encodeCsvRow } from "./csv.js";
import type { ResearchFile, ResolutionFile } from "./model.js";

function markdownCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function writeJson(filePath: string, value: unknown): Promise<void> {
  return writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function reportPaths(
  rootDirectory: string,
  outputPath: string,
): { jsonPath: string; markdownPath: string; csvPath: string } {
  const jsonPath = path.resolve(rootDirectory, outputPath);
  if (!jsonPath.toLowerCase().endsWith(".json")) {
    throw new Error(`Report output path must end in .json: ${outputPath}`);
  }
  return {
    jsonPath,
    markdownPath: jsonPath.replace(/\.json$/i, ".md"),
    csvPath: jsonPath.replace(/\.json$/i, ".csv"),
  };
}

function resolutionReviewCsv(file: ResolutionFile): string {
  const lines = [
    encodeCsvRow([
      "location_id",
      "location_name",
      "historical_context",
      "eu5_province",
      "eu5_province_id",
      "candidate_qid",
      "candidate_label",
      "description",
      "country",
      "country_iso3",
      "administrative_area",
      "selected_admin_level",
      "selected_admin_level_name",
      "typical_unit_area_km2",
      "area_statistic",
      "scale_source_dataset",
      "scale_source_version",
      "scale_source_url",
      "latitude",
      "longitude",
      "confidence",
      "local_wikipedia",
      "english_wikipedia",
      "correct",
    ]),
  ];

  for (const resolution of file.locations) {
    const { location, candidates } = resolution;
    const rows = candidates.length > 0 ? candidates : [undefined];
    for (const candidate of rows) {
      lines.push(
        encodeCsvRow([
          location.id,
          location.englishName,
          location.context,
          location.eu5Province ?? "",
          location.eu5ProvinceId ?? "",
          candidate?.qid ?? "",
          candidate?.label ?? "",
          candidate?.description ?? "",
          candidate?.country ?? "",
          candidate?.countryIso3 ?? "",
          candidate?.administrativeArea ?? "",
          candidate?.administrativeScale?.level ?? "",
          candidate?.administrativeScale?.levelName ?? "",
          candidate?.administrativeScale?.typicalAreaKm2.toString() ?? "",
          candidate?.administrativeScale?.areaStatistic ?? "",
          candidate?.administrativeScale?.sourceDataset ?? "",
          candidate?.administrativeScale?.sourceVersion ?? "",
          candidate?.administrativeScale?.sourceUrl ?? "",
          candidate?.coordinates?.latitude.toString() ?? "",
          candidate?.coordinates?.longitude.toString() ?? "",
          candidate?.confidence ?? "",
          candidate?.localWikipedia
            .map((page) => `${page.language}: ${page.url}`)
            .join("; ") ?? "",
          candidate?.englishWikipedia?.url ?? "",
          "FALSE",
        ]),
      );
    }
  }

  return `\uFEFF${lines.join("\r\n")}\r\n`;
}

function resolutionMarkdown(file: ResolutionFile): string {
  const lines = [
    "# RGO research: location resolution",
    "",
    `Generated: ${file.generatedAt}`,
    `Input: \`${file.inputSource}\``,
    "",
    "Review each candidate against the historical EU5 location in the " +
      "companion CSV. Set `correct` to TRUE for one candidate per confirmed " +
      "location. Leave every candidate FALSE when uncertain. Then run the " +
      "research stage; no RGO assignment is changed by this tool.",
    "The country-scale target is an area-based guide, not a guarantee that a candidate has the selected boundary tier.",
    "",
  ];

  for (const resolution of file.locations) {
    const { location, candidates } = resolution;
    lines.push(
      `## ${markdownCell(location.englishName)} (\`${markdownCell(location.id)}\`)`,
      "",
      `Historical context: ${markdownCell(location.context || "Not provided")}`,
      `EU5 province: ${location.eu5Province ? `${markdownCell(location.eu5Province)} (\`${markdownCell(location.eu5ProvinceId ?? "")}\`)` : "Not provided"}`,
      `Status: ${resolution.status}`,
      "",
    );
    if (candidates.length === 0) {
      lines.push("No geographic Wikidata candidates were found.", "");
      continue;
    }

    lines.push(
      "| QID | Candidate | Description | Country | Modern administrative area | Country-scale target | Match confidence | Wikipedia |",
      "| --- | --- | --- | --- | --- | --- | --- | --- |",
    );
    for (const candidate of candidates) {
      const links = [
        ...candidate.localWikipedia,
        ...(candidate.englishWikipedia ? [candidate.englishWikipedia] : []),
      ];
      const wikipedia =
        links.map((link) => `[${link.language}](${link.url})`).join(", ") ||
        "None linked";
      const scale = candidate.administrativeScale
        ? `${candidate.administrativeScale.levelName}; ${candidate.administrativeScale.typicalAreaKm2.toFixed(1)} km² (${candidate.administrativeScale.areaStatistic}, ${candidate.administrativeScale.sourceDataset})`
        : "Unavailable";
      lines.push(
        `| [${candidate.qid}](https://www.wikidata.org/wiki/${candidate.qid}) | ${markdownCell(candidate.label)} | ${markdownCell(candidate.description || "—")} | ${markdownCell(candidate.country ?? "—")} | ${markdownCell(candidate.administrativeArea ?? "—")} | ${markdownCell(scale)} | ${candidate.confidence} | ${wikipedia} |`,
      );
    }
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function researchMarkdown(file: ResearchFile): string {
  const lines = [
    "# RGO research: Wikipedia evidence",
    "",
    `Generated: ${file.generatedAt}`,
    `Resolution JSON: \`${file.resolutionFile}\``,
    "",
    "> Keyword matches are discovery signals, not evidence that a crop was " +
      "historically grown at the precise EU5 location. Review the cited " +
      "passages and distinguish location-specific evidence from regional " +
      "or later-period evidence. This report does not assign or change RGOs.",
    "",
    "The EU5 province is shown as map context, not as a modern administrative boundary.",
    "",
    "Wikipedia text excerpts are attributed to the linked page and revision " +
      "and are available under CC BY-SA; retain attribution and follow the " +
      "license terms if redistributing the excerpts.",
    "",
  ];

  if (file.locations.length === 0) {
    lines.push("No locations were selected for research.", "");
  }

  for (const location of file.locations) {
    lines.push(
      `## ${markdownCell(location.location.englishName)} (\`${markdownCell(location.location.id)}\`)`,
      "",
      `EU5 province: ${location.location.eu5Province ? `${markdownCell(location.location.eu5Province)} (\`${markdownCell(location.location.eu5ProvinceId ?? "")}\`)` : "Not provided"}`,
      `Historical context: ${markdownCell(location.location.context || "Not provided")}`,
      `Resolved place: [${markdownCell(location.placeLabel)}](https://www.wikidata.org/wiki/${location.qid})`,
      `Modern country: ${markdownCell(location.country ?? "Not known")}`,
      `Modern administrative area: ${markdownCell(location.administrativeArea ?? "Not known")}`,
      "",
    );
    for (const note of location.notes) {
      lines.push(`> Note: ${markdownCell(note)}`, "");
    }

    for (const article of location.sources) {
      const revisionUrl = article.pageRevisionId
        ? `${article.source.url}?oldid=${article.pageRevisionId}`
        : article.source.url;
      lines.push(
        `### [${markdownCell(article.source.title)}](${revisionUrl}) — ${article.source.language} (${article.languageMode === "local" ? "local-language" : "English fallback"})`,
        "",
      );
      for (const note of article.notes) {
        lines.push(`> Note: ${markdownCell(note)}`, "");
      }

      for (const section of article.sections) {
        lines.push(
          `#### ${markdownCell(section.heading)}`,
          "",
          section.text
            ? `${section.text}${section.truncated ? "\n\n_[Excerpt truncated at 2,500 characters.]_" : ""}`
            : "_No readable prose extracted._",
          "",
          `Historical year signals in the full section (1300–1899): ${section.years.length > 0 ? section.years.join(", ") : "none detected"}`,
          "",
        );
        if (section.cropMatches.length > 0) {
          lines.push(
            "| Keyword candidate RGO | Matched alias | Occurrences in full section |",
            "| --- | --- | ---: |",
          );
          for (const match of section.cropMatches) {
            lines.push(
              `| \`${match.goodId}\` | ${markdownCell(match.alias)} | ${match.occurrenceCount} |`,
            );
          }
          lines.push("");
        } else {
          lines.push(
            "No configured crop/RGO keywords matched this section.",
            "",
          );
        }
        if (section.citationUrls.length > 0) {
          lines.push(
            "External citation URLs found in section:",
            ...section.citationUrls.map((url) => `- <${url}>`),
            "",
          );
        }
      }
    }
  }

  return `${lines.join("\n")}\n`;
}

function rgoReviewCsv(file: ResearchFile): string {
  interface RgoEvidence {
    location: ResearchFile["locations"][number];
    goodId: string;
    aliases: Set<string>;
    sections: Set<string>;
    years: Set<number>;
    occurrenceCount: number;
    sourceUrls: Set<string>;
    evidence: string[];
  }

  const suggestions = new Map<string, RgoEvidence>();
  for (const location of file.locations) {
    for (const article of location.sources) {
      const revisionUrl = article.pageRevisionId
        ? `${article.source.url}?oldid=${article.pageRevisionId}`
        : article.source.url;
      for (const section of article.sections) {
        for (const match of section.cropMatches) {
          const key = `${location.location.id}\u0000${match.goodId}`;
          let suggestion = suggestions.get(key);
          if (!suggestion) {
            suggestion = {
              location,
              goodId: match.goodId,
              aliases: new Set(),
              sections: new Set(),
              years: new Set(),
              occurrenceCount: 0,
              sourceUrls: new Set(),
              evidence: [],
            };
            suggestions.set(key, suggestion);
          }
          suggestion.aliases.add(match.alias);
          suggestion.sections.add(
            `${article.source.language}: ${section.heading}`,
          );
          section.years.forEach((year) => suggestion?.years.add(year));
          suggestion.occurrenceCount += match.occurrenceCount;
          suggestion.sourceUrls.add(revisionUrl);
          section.citationUrls.forEach((url) =>
            suggestion?.sourceUrls.add(url),
          );
          suggestion.evidence.push(
            `[${article.source.language}] ${section.heading} ` +
              `(${section.years.length > 0 ? section.years.join(", ") : "no 1300–1899 year detected"}): ${section.text}`,
          );
        }
      }
    }
  }

  const lines = [
    encodeCsvRow([
      "location_id",
      "location_name",
      "eu5_province",
      "historical_context",
      "resolved_place",
      "country",
      "qid",
      "good_id",
      "matched_aliases",
      "evidence_sections",
      "historical_years_1300_1899",
      "occurrence_count",
      "source_urls",
      "evidence",
      "valid_rgo",
    ]),
  ];
  const sortedSuggestions = [...suggestions.values()].sort(
    (left, right) =>
      left.location.location.id.localeCompare(right.location.location.id) ||
      left.goodId.localeCompare(right.goodId),
  );
  for (const suggestion of sortedSuggestions) {
    const { location } = suggestion.location;
    lines.push(
      encodeCsvRow([
        location.id,
        location.englishName,
        location.eu5Province ?? "",
        location.context,
        suggestion.location.placeLabel,
        suggestion.location.country ?? "",
        suggestion.location.qid,
        suggestion.goodId,
        [...suggestion.aliases].sort().join("; "),
        [...suggestion.sections].sort().join("; "),
        [...suggestion.years].sort((left, right) => left - right).join("; "),
        suggestion.occurrenceCount.toString(),
        [...suggestion.sourceUrls].join("; "),
        suggestion.evidence.join("\n\n"),
        "FALSE",
      ]),
    );
  }

  return `\uFEFF${lines.join("\r\n")}\r\n`;
}

export async function writeResolutionReports(
  rootDirectory: string,
  outputPath: string,
  file: ResolutionFile,
): Promise<{ jsonPath: string; markdownPath: string; reviewCsvPath: string }> {
  const { jsonPath, markdownPath, csvPath } = reportPaths(
    rootDirectory,
    outputPath,
  );
  await mkdir(path.dirname(jsonPath), { recursive: true });
  await Promise.all([
    writeJson(jsonPath, file),
    writeFile(markdownPath, resolutionMarkdown(file), "utf8"),
    writeFile(csvPath, resolutionReviewCsv(file), "utf8"),
  ]);
  return { jsonPath, markdownPath, reviewCsvPath: csvPath };
}

export async function writeResearchReports(
  rootDirectory: string,
  outputPath: string,
  file: ResearchFile,
): Promise<{
  jsonPath: string;
  markdownPath: string;
  rgoReviewCsvPath: string;
}> {
  const { jsonPath, markdownPath } = reportPaths(rootDirectory, outputPath);
  const rgoReviewCsvPath = jsonPath.replace(/\.json$/i, ".rgo-review.csv");
  await mkdir(path.dirname(jsonPath), { recursive: true });
  await Promise.all([
    writeJson(jsonPath, file),
    writeFile(markdownPath, researchMarkdown(file), "utf8"),
    writeFile(rgoReviewCsvPath, rgoReviewCsv(file), "utf8"),
  ]);
  return { jsonPath, markdownPath, rgoReviewCsvPath };
}
