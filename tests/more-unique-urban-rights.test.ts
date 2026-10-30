import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { extractDefinitions } from "../scripts/analysis/parser.js";
import { validateProject } from "../scripts/build/validation.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

async function readRepositoryFile(relativePath: string): Promise<string> {
  return readFile(path.join(repositoryRoot, relativePath), "utf8");
}

test("selects More Unique Urban Rights separately with a focused patch", async () => {
  const configuration = await validateProject(process.cwd(), {
    profileId: "current-intended",
  });
  const packageValue = configuration.packages.find(
    (candidate) => candidate.id === "more-unique-urban-rights",
  );
  const profileMod = configuration.profile.mods.find(
    (candidate) => candidate.packageId === "more-unique-urban-rights",
  );
  const patch = configuration.profile.patches.find(
    (candidate) =>
      candidate.id === "more-unique-urban-rights-textile-exclusivity",
  );

  assert.ok(packageValue);
  assert.ok(profileMod);
  assert.ok(patch);
  if (
    packageValue.source.type !== "steam-workshop" ||
    profileMod.source.type !== "steam-workshop"
  ) {
    throw new Error(
      "More Unique Urban Rights must remain a pinned Workshop input",
    );
  }
  assert.equal(packageValue.source.workshopId, "3745922649");
  assert.equal(profileMod.version, "1.1.9");
  assert.equal(
    profileMod.source.snapshotChecksum,
    packageValue.source.snapshotChecksum,
  );
  assert.ok(
    configuration.profile.loadOrder.indexOf("more-unique-urban-rights") <
      configuration.profile.loadOrder.indexOf(
        configuration.profile.patchMod.id,
      ),
  );

  assert.equal(patch.operation, "add");
  assert.equal(patch.resolutionType, "merged-patch");
  assert.equal(patch.targetPackageId, "more-unique-urban-rights");
  assert.ok(patch.sourcePath);
  assert.equal(
    patch.targetPath,
    "in_game/common/town_rights/zz_CONCORDIA_MUR_royal_textile_rights.txt",
  );
  const patchSource = await readRepositoryFile(patch.sourcePath);
  assert.match(patchSource, /INJECT:royal_textile_rights\s*=/);
  assert.match(patchSource, /town_rights_type:flemish_cloth_industries_right/);
  assert.match(patchSource, /town_rights_type:aga_tr_bengal_muslin/);
  assert.match(patchSource, /town_rights_type:aga_tr_indoaryan_jamdani/);
  assert.equal(
    extractDefinitions(patch.targetPath, patchSource).length,
    1,
    "Concordia adds only the targeted town-right entry",
  );
});

test("the pinned upstream snapshot still defines both patch targets", async () => {
  const sourcePath =
    "sources/steam-workshop/3745922649/in_game/common/town_rights/aga_town_rights.txt";
  const source = await readRepositoryFile(sourcePath);
  const definitions = extractDefinitions(
    "in_game/common/town_rights/aga_town_rights.txt",
    source,
  );

  for (const id of ["aga_tr_bengal_muslin", "aga_tr_indoaryan_jamdani"]) {
    assert.ok(
      definitions.some((definition) => definition.key === id),
      `The pinned source must define ${id}`,
    );
  }
});
