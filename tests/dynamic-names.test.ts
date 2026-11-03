import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

async function readRepositoryFile(relativePath: string): Promise<string> {
  return readFile(path.join(repositoryRoot, relativePath), "utf8");
}

function extractLocalizationKeys(contents: string): Set<string> {
  const keys = new Set<string>();
  for (const line of contents.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const match = line
      .replace(/#.*$/, "")
      .match(/^\s*localization_key\s*=\s*([\w.-]+)/);
    if (match) {
      keys.add(match[1]);
    }
  }
  return keys;
}

test("archived rank merge matches current Workshop source keys", async () => {
  const sourcePaths = [
    "sources/steam-workshop/3652214415/in_game/common/customizable_localization/country_ranks.txt",
    "sources/steam-workshop/3603092142/in_game/common/customizable_localization/country_ranks.txt",
    "sources/steam-workshop/3813524452/in_game/common/customizable_localization/country_ranks.txt",
    "sources/steam-workshop/3685755118/in_game/common/customizable_localization/country_ranks.txt",
  ];
  const sourceKeys = new Set<string>();
  for (const sourcePath of sourcePaths) {
    for (const key of extractLocalizationKeys(
      await readRepositoryFile(sourcePath),
    )) {
      sourceKeys.add(key);
    }
  }

  const mergedKeys = extractLocalizationKeys(
    await readRepositoryFile(
      "integration/overrides/dynamic-names/in_game/common/customizable_localization/country_ranks.txt",
    ),
  );
  assert.deepEqual(
    [...mergedKeys].sort(),
    [...sourceKeys].sort(),
    "Archived merge must contain all and only current source rank keys",
  );
});
