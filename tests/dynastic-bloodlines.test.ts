import assert from "node:assert/strict";
import test from "node:test";
import { analyzeProject } from "../scripts/analysis/analyzer.js";
import { validateProject } from "../scripts/build/validation.js";

test("selects Dynastic Bloodlines separately and pins its game-start merge", async () => {
  const configuration = await validateProject(process.cwd(), {
    profileId: "current-intended",
  });
  const packageValue = configuration.packages.find(
    (candidate) => candidate.id === "dynastic-bloodlines",
  );
  const profileMod = configuration.profile.mods.find(
    (candidate) => candidate.packageId === "dynastic-bloodlines",
  );

  assert.ok(packageValue);
  assert.ok(profileMod);
  if (
    packageValue.source.type !== "steam-workshop" ||
    profileMod.source.type !== "steam-workshop"
  ) {
    throw new Error("Dynastic Bloodlines must remain a pinned Workshop input");
  }
  assert.equal(packageValue.source.workshopId, "3790115532");
  assert.equal(profileMod.version, "0.9.39");
  assert.equal(
    profileMod.source.snapshotChecksum,
    packageValue.source.snapshotChecksum,
  );

  assert.ok(
    configuration.profile.loadOrder.indexOf("dynastic-bloodlines") <
      configuration.profile.loadOrder.indexOf(
        configuration.profile.patchMod.id,
      ),
  );
  assert.ok(
    !configuration.profile.patches.some(
      (patch) => patch.targetPackageId === "dynastic-bloodlines",
    ),
    "Dynastic Bloodlines UI remains in the upstream mod, not the Concordia payload",
  );

  const analysis = await analyzeProject(configuration);
  const gameStartFinding = analysis.findings.find(
    (finding) => finding.fingerprint === "2b65f6b23ed15ae2",
  );
  assert.ok(gameStartFinding);
  assert.equal(gameStartFinding.resolved, true);
  assert.equal(gameStartFinding.resolutionType, "native-merge");
});
