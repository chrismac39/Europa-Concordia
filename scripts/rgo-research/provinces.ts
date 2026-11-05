import { readFile } from "node:fs/promises";

export interface Eu5Province {
  id: string;
  name: string;
}

function displayProvinceName(provinceId: string): string {
  return provinceId
    .replace(/_province$/, "")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function removeNestedProvinceBlocks(contents: string): string {
  const nestedProvincePattern = /\b[a-z][a-z0-9_]*_province\s*=\s*\{/g;
  let result = "";
  let copiedThrough = 0;
  let match: RegExpExecArray | null;

  while ((match = nestedProvincePattern.exec(contents)) !== null) {
    const openingBrace = match.index + match[0].lastIndexOf("{");
    let depth = 1;
    let end = openingBrace + 1;
    while (end < contents.length && depth > 0) {
      if (contents[end] === "{") {
        depth += 1;
      } else if (contents[end] === "}") {
        depth -= 1;
      }
      end += 1;
    }
    if (depth !== 0) {
      throw new Error(`Unclosed nested province block: ${match[1]}`);
    }
    result += contents.slice(copiedThrough, match.index);
    copiedThrough = end;
    nestedProvincePattern.lastIndex = end;
  }

  return result + contents.slice(copiedThrough);
}

export function parseEu5ProvinceMap(
  definitions: string,
): Map<string, Eu5Province> {
  const contents = definitions.replace(/#[^\r\n]*/g, "");
  const provincePattern = /\b([a-z][a-z0-9_]*_province)\s*=\s*\{/g;
  const locations = new Map<string, Eu5Province>();

  for (const match of contents.matchAll(provincePattern)) {
    if (match.index === undefined) {
      continue;
    }
    const openingBrace = match.index + match[0].lastIndexOf("{");
    let depth = 1;
    let end = openingBrace + 1;
    while (end < contents.length && depth > 0) {
      if (contents[end] === "{") {
        depth += 1;
      } else if (contents[end] === "}") {
        depth -= 1;
      }
      end += 1;
    }
    if (depth !== 0) {
      throw new Error(
        `Unclosed province block in EU5 definitions: ${match[1]}`,
      );
    }

    const province: Eu5Province = {
      id: match[1],
      name: displayProvinceName(match[1]),
    };
    const provinceContents = removeNestedProvinceBlocks(
      contents.slice(openingBrace + 1, end - 1),
    ).replace(/\b[a-z][a-z0-9_]*\s*=\s*(?:yes|no)\b/g, " ");
    const locationIds = provinceContents.match(/[a-z][a-z0-9_]*/g) ?? [];
    for (const locationId of locationIds) {
      const previousProvince = locations.get(locationId);
      if (previousProvince && previousProvince.id !== province.id) {
        throw new Error(
          `EU5 location ${locationId} appears in both ${previousProvince.id} and ${province.id}`,
        );
      }
      locations.set(locationId, province);
    }
  }

  if (locations.size === 0) {
    throw new Error("No EU5 province-to-location mappings were found");
  }
  return locations;
}

export async function readEu5ProvinceMap(
  definitionsPath: string,
): Promise<Map<string, Eu5Province>> {
  let definitions: string;
  try {
    definitions = await readFile(definitionsPath, "utf8");
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      throw new Error(
        `Could not find EU5 province definitions at ${definitionsPath}. Set EU5_GAME_PATH or pass --game-path.`,
      );
    }
    throw error;
  }
  return parseEu5ProvinceMap(definitions);
}

export function addEu5Provinces<
  T extends {
    id: string;
    eu5Province?: string;
    eu5ProvinceId?: string;
  },
>(
  locations: T[],
  provinceMap: Map<string, Eu5Province>,
): Array<T & { eu5Province: string; eu5ProvinceId: string }> {
  return locations.map((location) => {
    const province = provinceMap.get(location.id);
    if (!province) {
      throw new Error(
        `EU5 location ${location.id} has no province in definitions.txt`,
      );
    }
    if (location.eu5ProvinceId && location.eu5ProvinceId !== province.id) {
      throw new Error(
        `EU5 province mismatch for ${location.id}: input says ${location.eu5ProvinceId}, game definitions say ${province.id}`,
      );
    }
    return {
      ...location,
      eu5Province: province.name,
      eu5ProvinceId: province.id,
    };
  });
}
