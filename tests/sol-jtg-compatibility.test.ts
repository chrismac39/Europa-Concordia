import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { extractDefinitions } from "../scripts/analysis/parser.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

async function readRepositoryFile(relativePath: string): Promise<string> {
  return readFile(path.join(repositoryRoot, relativePath), "utf8");
}

function assertNonCommentLinesPreserved(
  baseline: string,
  merged: string,
): void {
  const baselineLines = baseline
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((line) => line.trim() !== "" && !line.trim().startsWith("#"));
  const mergedLines = merged
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .split("\n");
  let nextLine = 0;
  for (const baselineLine of baselineLines) {
    const matchedLine = mergedLines.indexOf(baselineLine, nextLine);
    assert.notEqual(
      matchedLine,
      -1,
      `Merged GUI omitted SoL content: ${baselineLine.slice(0, 100)}`,
    );
    nextLine = matchedLine + 1;
  }
}

test("current profile replaces the separate SOL-JTG mod with Concordia files", async () => {
  const profile = JSON.parse(
    await readRepositoryFile("profiles/current-intended.json"),
  ) as {
    mods: Array<{ packageId: string }>;
    excludedMods: Array<{ packageId: string; reason: string }>;
    loadOrder: string[];
    patches: Array<{
      id: string;
      sourcePath: string;
      targetPath: string;
      targetPackageId: string;
    }>;
    patchMod: { id: string };
  };
  const selectedIds = new Set(profile.mods.map((mod) => mod.packageId));
  const excludedIds = new Set(profile.excludedMods.map((mod) => mod.packageId));
  assert.ok(selectedIds.has("standard-of-living"));
  assert.ok(selectedIds.has("just-goods"));
  assert.ok(!selectedIds.has("sol-jtg-compatibility-submod"));
  assert.ok(excludedIds.has("sol-jtg-compatibility-submod"));
  assert.ok(!profile.loadOrder.includes("sol-jtg-compatibility-submod"));
  assert.equal(profile.loadOrder.at(-1), profile.patchMod.id);

  const expectedPatchIds = [
    "sol-jtg-demand-goods",
    "sol-jtg-market-consumption",
    "sol-jtg-economy-effects",
    "sol-jtg-global-panel",
    "sol-jtg-economy-tooltip",
  ];
  assert.deepEqual(
    profile.patches
      .map((patch) => patch.id)
      .filter((id) => id.startsWith("sol-jtg-"))
      .sort(),
    expectedPatchIds.sort(),
  );
  for (const patch of profile.patches.filter((entry) =>
    entry.id.startsWith("sol-jtg-"),
  )) {
    await readRepositoryFile(patch.sourcePath);
    assert.ok(patch.targetPath.startsWith("in_game/"));
  }
});

test("demand patch covers 26 Just Goods and cancels native slave demand", async () => {
  const goodsContents = await readRepositoryFile(
    "integration/patches/sol-jtg-compatibility/in_game/common/goods/zz_CONCORDIA_SOL_JTG_pop_goods.txt",
  );
  const goods = [
    ...goodsContents.matchAll(/^\s*INJECT:([a-z0-9_]+)\s*=\s*\{/gm),
  ].map((match) => match[1]);
  assert.equal(goods.length, 26);
  assert.equal(new Set(goods).size, 26);
  assert.match(goodsContents, /\bslaves\s*=\s*-\d/);

  const marketValues = await readRepositoryFile(
    "integration/patches/sol-jtg-compatibility/in_game/common/script_values/zz_CONCORDIA_SOL_market_unit_consumption_values.txt",
  );
  for (const good of goods) {
    assert.match(
      marketValues,
      new RegExp(`sol_unit_consumption_\\w+_${good}\\s*=`, "m"),
      `Missing SoL market-consumption values for ${good}`,
    );
  }
});

test("keeps disjoint Just Goods and SoL cloves injections", async () => {
  const justGoods = await readRepositoryFile(
    "sources/steam-workshop/3785316314/in_game/common/goods/spices_produced_goods.txt",
  );
  const sol = await readRepositoryFile(
    "sources/git/standard-of-living/in_game/common/goods/z_SOL_pop_goods.txt",
  );
  const justGoodsCloves = extractDefinitions(
    "in_game/common/goods/spices_produced_goods.txt",
    justGoods,
  ).find((definition) => definition.key === "cloves");
  const solCloves = extractDefinitions(
    "in_game/common/goods/z_SOL_pop_goods.txt",
    sol,
  ).find((definition) => definition.key === "cloves");

  assert.ok(justGoodsCloves);
  assert.ok(solCloves);
  assert.equal(justGoodsCloves.mode, "inject");
  assert.equal(solCloves.mode, "inject");
  assert.match(justGoodsCloves.normalizedBody, /default_market_price = 6/);
  assert.doesNotMatch(justGoodsCloves.normalizedBody, /demand_add/);
  assert.match(solCloves.normalizedBody, /demand_add/);
  assert.match(solCloves.normalizedBody, /wealth_impact_threshold/);
  assert.doesNotMatch(solCloves.normalizedBody, /default_market_price/);
});

test("economy replacements and both GUIs retain SoL content and include JTG", async () => {
  const effectPath =
    "integration/overrides/sol-jtg-compatibility/in_game/common/scripted_effects/zz_A_SOL_economy_effects.txt";
  const effectContents = await readRepositoryFile(effectPath);
  const replacementEffects = [
    ...effectContents.matchAll(/^\s*REPLACE:([a-z0-9_]+)\s*=\s*\{/gm),
  ].map((match) => match[1]);
  assert.deepEqual(replacementEffects.sort(), [
    "gls_accumulate_panel_stats",
    "sol_compute_substitute_unit_spending",
    "sol_refresh_market_pop_demand_maps",
  ]);

  const guiCases = [
    {
      baseline:
        "sources/git/standard-of-living/in_game/gui/panels/situation/global_living_standard.gui",
      merged:
        "integration/overrides/sol-jtg-compatibility/in_game/gui/panels/situation/global_living_standard.gui",
    },
    {
      baseline:
        "sources/git/standard-of-living/in_game/gui/SOL_economy_local.gui",
      merged:
        "integration/overrides/sol-jtg-compatibility/in_game/gui/zz_SOL_economy_local.gui",
    },
  ];
  const goodsContents = await readRepositoryFile(
    "integration/patches/sol-jtg-compatibility/in_game/common/goods/zz_CONCORDIA_SOL_JTG_pop_goods.txt",
  );
  const goods = [
    ...goodsContents.matchAll(/^\s*INJECT:([a-z0-9_]+)\s*=\s*\{/gm),
  ].map((match) => match[1]);
  for (const { baseline, merged } of guiCases) {
    const baselineContents = await readRepositoryFile(baseline);
    const mergedContents = await readRepositoryFile(merged);
    assertNonCommentLinesPreserved(baselineContents, mergedContents);
    for (const good of goods) {
      assert.ok(
        mergedContents.includes(`Localize('${good}')`),
        `${merged} does not expose ${good}`,
      );
    }
  }
});
