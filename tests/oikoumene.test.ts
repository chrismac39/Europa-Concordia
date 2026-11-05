import assert from "node:assert/strict";
import test from "node:test";
import { analyzeProject } from "../scripts/analysis/analyzer.js";
import { validateProject } from "../scripts/build/validation.js";

test("selects Oikoumenē separately and resolves its location-name overlaps", async () => {
  const configuration = await validateProject(process.cwd(), {
    profileId: "current-intended",
  });
  const packageValue = configuration.packages.find(
    (candidate) => candidate.id === "oikoumene",
  );
  const profileMod = configuration.profile.mods.find(
    (candidate) => candidate.packageId === "oikoumene",
  );

  assert.ok(packageValue);
  assert.ok(profileMod);
  if (packageValue.source.type !== "git" || profileMod.source.type !== "git") {
    throw new Error("Oikoumenē must remain a pinned Git/Workshop input");
  }
  assert.equal(packageValue.source.publishedWorkshopId, "3721193233");
  assert.equal(profileMod.version, "0.19.0");
  assert.equal(
    profileMod.source.revision,
    "c246398bf3e3984f27be2731c86c1bef9a313f05",
  );
  assert.equal(
    profileMod.source.publishedWorkshopId,
    packageValue.source.publishedWorkshopId,
  );

  const order = configuration.profile.loadOrder;
  assert.ok(
    order.indexOf("more-locations") < order.indexOf("oikoumene"),
    "Oikoumenē must load after More locations for the approved localization preference",
  );
  assert.ok(
    order.indexOf("oikoumene") <
      order.indexOf(configuration.profile.patchMod.id),
  );
  assert.ok(
    !configuration.profile.patches.some(
      (patch) => patch.targetPackageId === "oikoumene",
    ),
    "Oikoumenē remains upstream content and needs no Concordia replacement",
  );

  const analysis = await analyzeProject(configuration);
  const localizationFindings = analysis.findings.filter(
    (finding) =>
      finding.type === "localization" &&
      finding.packages.includes("more-locations") &&
      finding.packages.includes("oikoumene"),
  );
  assert.equal(localizationFindings.length, 72);
  for (const finding of localizationFindings) {
    assert.equal(finding.resolved, true, finding.title);
    assert.equal(finding.resolutionType, "load-order", finding.title);
    assert.match(finding.resolution ?? "", /Oikoumene/);
  }
});
