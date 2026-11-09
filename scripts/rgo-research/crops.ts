import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { CropMatch } from "./model.js";

interface CropAliasEntry {
  id: string;
  aliases: Record<string, string[]>;
}

interface CropAliasFile {
  version: 1;
  goods: CropAliasEntry[];
}

export interface RgoGoodsCatalog {
  ids: Set<string>;
  aliases: Map<string, Map<string, Set<string>>>;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function extractRawMaterials(contents: string): string[] {
  return [...contents.matchAll(/\braw_material\s*=\s*([a-z][a-z0-9_]*)/g)].map(
    (match) => match[1],
  );
}

function extractRawMaterialDefinitions(contents: string): string[] {
  const normalized = contents.replace(/^\uFEFF/, "");
  const headers = [...normalized.matchAll(/^([a-z][a-z0-9_]*)\s*=\s*\{/gm)];
  return headers.flatMap((header, index) => {
    const start = (header.index ?? 0) + header[0].length;
    const end = headers[index + 1]?.index ?? normalized.length;
    const body = normalized.slice(start, end);
    return /^\s*category\s*=\s*raw_material\b/m.test(body) ? [header[1]] : [];
  });
}

async function readGoodsDefinitions(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".txt"))
    .map((entry) => path.join(directory, entry.name));
  const contents = await Promise.all(
    files.map((filePath) => readFile(filePath, "utf8")),
  );
  return contents.flatMap(extractRawMaterialDefinitions);
}

export async function loadRgoGoodsCatalog(
  rootDirectory: string,
  vanillaLocationTemplatesPath: string,
): Promise<RgoGoodsCatalog> {
  const harmonyMapPath = path.join(
    rootDirectory,
    "integration",
    "patches",
    "just-goods-more-locations-global-historical-rgos",
    "in_game",
    "map_data",
    "location_templates.txt",
  );
  const fruitsExpandedMapPath = path.join(
    rootDirectory,
    "sources",
    "steam-workshop",
    "3821883489",
    "in_game",
    "map_data",
    "location_templates.txt",
  );
  const fruitsExpandedGoodsPath = path.join(
    rootDirectory,
    "sources",
    "steam-workshop",
    "3821883489",
    "in_game",
    "common",
    "goods",
    "fruits_expanded_goods.txt",
  );
  const justGoodsDirectory = path.join(
    rootDirectory,
    "sources",
    "steam-workshop",
    "3785316314",
    "in_game",
    "common",
    "goods",
  );
  const vanillaGoodsDirectory = path.join(
    path.dirname(path.dirname(vanillaLocationTemplatesPath)),
    "common",
    "goods",
  );
  const [
    vanillaMap,
    harmonyMap,
    fruitsExpandedMap,
    fruitsExpandedGoods,
    vanillaGoods,
    justGoodsGoods,
    aliasContents,
  ] = await Promise.all([
    readFile(vanillaLocationTemplatesPath, "utf8"),
    readFile(harmonyMapPath, "utf8"),
    readFile(fruitsExpandedMapPath, "utf8"),
    readFile(fruitsExpandedGoodsPath, "utf8"),
    readGoodsDefinitions(vanillaGoodsDirectory),
    readGoodsDefinitions(justGoodsDirectory),
    readFile(
      path.join(rootDirectory, "config", "rgo-research-crops.json"),
      "utf8",
    ),
  ]);
  const ids = new Set([
    ...extractRawMaterials(vanillaMap),
    ...extractRawMaterials(harmonyMap),
    ...extractRawMaterials(fruitsExpandedMap),
    ...vanillaGoods,
    ...justGoodsGoods,
    ...extractRawMaterialDefinitions(fruitsExpandedGoods),
  ]);
  const aliasFile: unknown = JSON.parse(aliasContents);
  if (
    !aliasFile ||
    typeof aliasFile !== "object" ||
    !("version" in aliasFile) ||
    aliasFile.version !== 1 ||
    !("goods" in aliasFile) ||
    !Array.isArray(aliasFile.goods)
  ) {
    throw new Error("Invalid config/rgo-research-crops.json format");
  }

  const aliases = new Map<string, Map<string, Set<string>>>();
  for (const id of ids) {
    const englishAliases = new Set<string>();
    englishAliases.add(normalizeText(id.replace(/_/g, " ")));
    if (id.startsWith("fruit_")) {
      englishAliases.add(
        normalizeText(id.slice("fruit_".length).replace(/_/g, " ")),
      );
    }
    aliases.set(id, new Map([["en", englishAliases]]));
  }

  const typedAliasFile = aliasFile as CropAliasFile;
  for (const entry of typedAliasFile.goods) {
    if (!ids.has(entry.id)) {
      throw new Error(
        `Crop alias entry references an RGO absent from the Harmony + Fruits Expanded maps: ${entry.id}`,
      );
    }
    for (const [language, words] of Object.entries(entry.aliases)) {
      const perLanguage = aliases.get(entry.id);
      if (!perLanguage) {
        throw new Error(`Missing alias target for RGO ${entry.id}`);
      }
      const normalizedAliases = perLanguage.get(language) ?? new Set<string>();
      for (const word of words) {
        const normalized = normalizeText(word);
        if (Array.from(normalized).length === 0) {
          throw new Error(`Crop alias is too short for ${entry.id}: ${word}`);
        }
        normalizedAliases.add(normalized);
      }
      perLanguage.set(language, normalizedAliases);
    }
  }

  return { ids, aliases };
}

function countAliasOccurrences(text: string, alias: string): number {
  if (/[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/u.test(alias)) {
    let count = 0;
    let start = 0;
    while ((start = text.indexOf(alias, start)) >= 0) {
      count += 1;
      start += alias.length;
    }
    return count;
  }
  const paddedText = ` ${text} `;
  const paddedAlias = ` ${alias} `;
  let count = 0;
  let start = 0;
  while ((start = paddedText.indexOf(paddedAlias, start)) >= 0) {
    count += 1;
    start += paddedAlias.length;
  }
  return count;
}

export function matchRgoGoods(
  text: string,
  language: string,
  catalog: RgoGoodsCatalog,
): CropMatch[] {
  const normalizedText = normalizeText(text);
  const languageCode = language.toLowerCase();
  const matches: CropMatch[] = [];

  for (const [goodId, byLanguage] of catalog.aliases) {
    const aliases = new Set([
      ...(byLanguage.get(languageCode) ?? []),
      ...(languageCode === "en" ? [] : (byLanguage.get("en") ?? [])),
    ]);
    const foundAliases = [...aliases]
      .map((alias) => ({
        alias,
        count: countAliasOccurrences(normalizedText, alias),
      }))
      .filter((match) => match.count > 0);
    if (foundAliases.length > 0) {
      const bestMatch = foundAliases.sort(
        (left, right) =>
          right.alias.length - left.alias.length || right.count - left.count,
      )[0];
      matches.push({
        goodId,
        alias: bestMatch.alias,
        occurrenceCount: bestMatch.count,
      });
    }
  }

  return matches.sort((left, right) => left.goodId.localeCompare(right.goodId));
}
