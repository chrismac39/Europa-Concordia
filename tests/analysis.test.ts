import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { analyzeProject } from "../scripts/analysis/analyzer.js";
import {
  classifyCountryReferenceFile,
  extractCountryTags,
  extractCustomizableLocalizationRules,
  extractDefinitions,
  extractGlobalVariables,
  extractLocalizationLine,
} from "../scripts/analysis/parser.js";
import type { ProjectConfiguration } from "../scripts/build/package-model.js";

test("canonicalizes definitions across files and replacement modes", () => {
  assert.deepEqual(
    extractDefinitions(
      "in_game/common/disasters/example.txt",
      `
REPLACE:horde_civil_war = {
  trigger = { tag = GLH }
}
`,
    ),
    [
      {
        category: "common/disasters",
        key: "horde_civil_war",
        mode: "replace",
        normalizedBody: "REPLACE:horde_civil_war = { trigger = { tag = GLH } }",
      },
    ],
  );
});

test("classifies country references by semantic role", () => {
  assert.equal(
    classifyCountryReferenceFile(
      "in_game/common/script_values/glorpui_generated_hints.txt",
    ),
    "observer",
  );
  assert.equal(
    classifyCountryReferenceFile(
      "in_game/common/scripted_effects/rusgath_fragment_country_history.txt",
    ),
    "reference-data",
  );
  assert.equal(
    classifyCountryReferenceFile("in_game/events/rusgathering_expansion.txt"),
    "active",
  );
});

test("extracts customizable localization rule semantics", () => {
  assert.deepEqual(
    extractCustomizableLocalizationRules(
      "in_game/common/customizable_localization/country_ranks.txt",
      `
country_flavor = {
  text = {
    localization_key = rank_confederation
    trigger = {
      OR = {
        tag = NGC # Added title
        tag = SWI
      }
      has_variable = custom_rank
      has_reform = government_reform:confederation_reform
    }
  }
}
`,
    ),
    [
      {
        localizationKey: "rank_confederation",
        normalizedBody:
          "localization_key = rank_confederation trigger = { OR = { tag = NGC tag = SWI } has_variable = custom_rank has_reform = government_reform:confederation_reform }",
        tags: ["NGC", "SWI"],
        variables: ["custom_rank"],
        reforms: ["confederation_reform"],
      },
    ],
  );
});

test("keeps country reference categorization non-blocking", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "concordia-analysis-"));
  const packageDirectory = async (
    packageId: string,
    relativePath: string,
    contents: string,
  ): Promise<void> => {
    const file = path.join(root, packageId, ...relativePath.split("/"));
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, contents);
  };
  const packageValue = (
    id: string,
  ): ProjectConfiguration["packages"][number] => ({
    id,
    name: id,
    type: "original",
    source: { type: "local", path: id },
    author: "Test",
    targetGameVersion: "1.4.5",
    version: "1.0.0",
    dependencies: [],
    attribution: { license: "MIT" },
  });

  const configuration: ProjectConfiguration = {
    rootDirectory: root,
    build: {
      version: 1,
      targetGameVersion: "1.4.5",
      defaultProfile: "test",
      packagesFile: "config/packages.json",
      conflictRulesFile: "config/conflict-rules.json",
      outputDirectory: "dist",
    },
    profile: {
      version: 1,
      id: "test",
      name: "Test",
      targetGameVersion: "1.4.5",
      mods: ["active-left", "active-right", "observer"].map((id) => ({
        packageId: id,
        name: id,
        version: "1.0.0",
        source: { type: "local" as const },
      })),
      loadOrder: ["active-left", "active-right", "observer", "test_patch"],
      patches: [],
      patchMod: {
        name: "Test Patch",
        id: "test_patch",
        version: "1.0.0",
        shortDescription: "Test",
        tags: ["Gameplay"],
      },
    },
    conflictRules: {
      version: 1,
      filePathCollisions: "error",
      filePathResolutions: [],
      semanticResolutions: [],
      definitionConflicts: "deferred",
    },
    packages: [
      packageValue("active-left"),
      packageValue("active-right"),
      packageValue("observer"),
    ],
  };

  try {
    const tags = "c:AAA c:AAA c:AAA c:BBB c:BBB c:BBB c:CCC c:CCC c:CCC";
    await packageDirectory(
      "active-left",
      "in_game/events/left.txt",
      `left_event = { immediate = { ${tags} } }`,
    );
    await packageDirectory(
      "active-right",
      "in_game/events/right.txt",
      `right_event = { immediate = { ${tags} } }`,
    );
    await packageDirectory(
      "observer",
      "in_game/common/script_values/hints.txt",
      `hints = { ${tags} }`,
    );

    const analysis = await analyzeProject(configuration);
    const interactions = analysis.findings.filter(
      (finding) => finding.type === "system-interaction",
    );
    const observations = analysis.findings.filter(
      (finding) => finding.type === "system-observation",
    );
    assert.equal(interactions.length, 1);
    assert.equal(interactions[0].resolved, true);
    assert.equal(observations.length, 2);
    assert.ok(observations.every((finding) => finding.resolved));
    assert.equal(
      analysis.findings.filter((finding) => !finding.resolved).length,
      0,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("traces definition outcomes through package event chains", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "concordia-behavior-"));
  const writePackageFile = async (
    packageId: string,
    relativePath: string,
    contents: string,
  ): Promise<void> => {
    const file = path.join(root, packageId, ...relativePath.split("/"));
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, contents);
  };
  const packageValue = (
    id: string,
  ): ProjectConfiguration["packages"][number] => ({
    id,
    name: id,
    type: "original",
    source: { type: "local", path: id },
    author: "Test",
    targetGameVersion: "1.4.5",
    version: "1.0.0",
    dependencies: [],
    attribution: { license: "MIT" },
  });
  const configuration: ProjectConfiguration = {
    rootDirectory: root,
    build: {
      version: 1,
      targetGameVersion: "1.4.5",
      defaultProfile: "test",
      packagesFile: "config/packages.json",
      conflictRulesFile: "config/conflict-rules.json",
      outputDirectory: "dist",
    },
    profile: {
      version: 1,
      id: "test",
      name: "Test",
      targetGameVersion: "1.4.5",
      mods: ["left", "right"].map((id) => ({
        packageId: id,
        name: id,
        version: "1.0.0",
        source: { type: "local" as const },
      })),
      loadOrder: ["left", "right", "test_patch"],
      patches: [
        {
          id: "disaster-merge",
          sourcePath: "integration/patches/test.txt",
          targetPath: "in_game/common/disasters/left.txt",
          targetPackageId: "left",
          resolutionType: "merged-patch",
          reason: "Test a specific semantic merge.",
          preserves: ["shared_disaster"],
          suppresses: [],
        },
      ],
      patchMod: {
        name: "Test Patch",
        id: "test_patch",
        version: "1.0.0",
        shortDescription: "Test",
        tags: ["Gameplay"],
      },
    },
    conflictRules: {
      version: 1,
      filePathCollisions: "error",
      filePathResolutions: [],
      semanticResolutions: [],
      definitionConflicts: "deferred",
    },
    packages: [packageValue("left"), packageValue("right")],
  };

  try {
    await writePackageFile(
      "left",
      "in_game/common/disasters/left.txt",
      "shared_disaster = { on_end = { trigger_event_non_silently = successor.1 } }",
    );
    await writePackageFile(
      "left",
      "in_game/events/left.txt",
      "successor.1 = { immediate = { create_country = { tag = AAA } } }",
    );
    await writePackageFile(
      "right",
      "in_game/common/disasters/right.txt",
      "REPLACE:shared_disaster = { on_end = { trigger_event_non_silently = successor.1 } }",
    );
    await writePackageFile(
      "right",
      "in_game/events/right.txt",
      "successor.1 = { immediate = { create_country = { tag = BBB } create_country = { tag = CCC } } }",
    );

    const analysis = await analyzeProject(configuration);
    const finding = analysis.findings.find(
      (candidate) =>
        candidate.title === "Definition: common/disasters:shared_disaster",
    );
    assert.ok(finding?.definitionVariants);
    assert.deepEqual(
      finding.definitionVariants.map((variant) => ({
        packageId: variant.packageId,
        outcomes: variant.downstream.countryOutcomes,
      })),
      [
        { packageId: "left", outcomes: ["create_country:AAA"] },
        {
          packageId: "right",
          outcomes: ["create_country:BBB", "create_country:CCC"],
        },
      ],
    );

    configuration.conflictRules.semanticResolutions = [
      {
        fingerprint: finding.fingerprint,
        resolutionType: "merged-patch",
        decision: "Merge both definitions",
        reason: "The test patch retains both variants.",
      },
    ];
    const approvedAnalysis = await analyzeProject(configuration);
    const approvedFinding = approvedAnalysis.findings.find(
      (candidate) =>
        candidate.title === "Definition: common/disasters:shared_disaster",
    );
    assert.equal(approvedFinding?.resolved, true);

    await writePackageFile(
      "left",
      "in_game/common/disasters/left.txt",
      "shared_disaster = { trigger = { tag = AAA } }",
    );
    const refreshedAnalysis = await analyzeProject(configuration);
    const refreshedFinding = refreshedAnalysis.findings.find(
      (candidate) =>
        candidate.title === "Definition: common/disasters:shared_disaster",
    );
    assert.ok(refreshedFinding);
    assert.notEqual(refreshedFinding.fingerprint, finding.fingerprint);
    assert.equal(refreshedFinding.resolved, false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("extracts localization, globals, and country-system references", () => {
  assert.deepEqual(
    extractLocalizationLine(
      "main_menu/localization/english/example_l_english.yml",
      ' example_key:0 "Different text"',
    ),
    {
      language: "english",
      key: "example_key",
      value: "Different text",
    },
  );
  assert.deepEqual(
    extractGlobalVariables(`
set_global_variable = { name = shared_state value = yes }
has_global_variable = other_state
`),
    ["other_state", "shared_state"],
  );
  assert.deepEqual(
    [...extractCountryTags("tag = GLH c:KZN has_or_had_tag = UZB")],
    [
      ["KZN", 1],
      ["GLH", 1],
      ["UZB", 1],
    ],
  );
});
