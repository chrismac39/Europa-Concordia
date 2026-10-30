import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildProject } from "../scripts/build/pipeline.js";
import { validateProject } from "../scripts/build/validation.js";

interface FixturePatch {
  id: string;
  operation?: "add" | "replace";
  sourcePath: string;
  targetPath: string;
  targetPackageId: string;
  resolutionType: "merged-patch";
  reason: string;
  preserves: string[];
  suppresses: string[];
}

interface Fixture {
  root: string;
  addPackage(id: string, dependencies?: string[]): void;
  writePackageFiles(id: string, files: Record<string, string>): Promise<void>;
  writePatchFile(relativePath: string, contents: string): Promise<void>;
  writeProfile(
    selectedIds?: string[],
    loadOrder?: string[],
    patches?: FixturePatch[],
    excludedMods?: Array<{ packageId: string; reason: string }>,
  ): Promise<void>;
  writeRules(rules: {
    filePathResolutions?: Array<Record<string, unknown>>;
    semanticResolutions?: Array<Record<string, unknown>>;
  }): Promise<void>;
  writeManifest(): Promise<void>;
}

async function createFixture(): Promise<Fixture> {
  const root = await mkdtemp(path.join(os.tmpdir(), "europa-concordia-test-"));
  const packages: Array<Record<string, unknown>> = [];
  let profileWritten = false;
  await mkdir(path.join(root, "config"), { recursive: true });
  await mkdir(path.join(root, "dist"), { recursive: true });
  await mkdir(path.join(root, "profiles"), { recursive: true });
  await writeFile(
    path.join(root, "config", "build.json"),
    JSON.stringify({
      version: 1,
      targetGameVersion: "1.4.5",
      defaultProfile: "fixture",
      packagesFile: "config/packages.json",
      conflictRulesFile: "config/conflict-rules.json",
      outputDirectory: "dist/europa-concordia",
    }),
  );
  await writeFile(
    path.join(root, "config", "conflict-rules.json"),
    JSON.stringify({
      version: 1,
      filePathCollisions: "error",
      filePathResolutions: [],
      semanticResolutions: [],
      definitionConflicts: "deferred",
    }),
  );

  const fixture: Fixture = {
    root,
    addPackage(id, dependencies = []) {
      packages.push({
        id,
        name: id,
        type: "upstream",
        source: { type: "local", path: `packages/${id}` },
        author: "Fixture author",
        targetGameVersion: "1.4.5",
        version: "1.0.0",
        dependencies,
        attribution: { license: "MIT" },
      });
    },
    async writePackageFiles(id, files) {
      const packageDirectory = path.join(root, "packages", id);
      await mkdir(packageDirectory, { recursive: true });
      for (const [relativePath, contents] of Object.entries(files)) {
        const filePath = path.join(packageDirectory, relativePath);
        await mkdir(path.dirname(filePath), { recursive: true });
        await writeFile(filePath, contents);
      }
    },
    async writePatchFile(relativePath, contents) {
      const filePath = path.join(root, "integration", "patches", relativePath);
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, contents);
    },
    async writeProfile(
      selectedIds = packages.map((packageValue) => String(packageValue.id)),
      loadOrder = selectedIds,
      patches = [],
      excludedMods = [],
    ) {
      profileWritten = true;
      const selectedPackages = packages.filter((packageValue) =>
        selectedIds.includes(String(packageValue.id)),
      );
      await writeFile(
        path.join(root, "profiles", "fixture.json"),
        JSON.stringify({
          version: 1,
          id: "fixture",
          name: "Fixture Playset",
          targetGameVersion: "1.4.5",
          mods: selectedPackages.map((packageValue) => ({
            packageId: packageValue.id,
            name: packageValue.name,
            version: packageValue.version,
            source: { type: "local" },
          })),
          excludedMods,
          loadOrder: [...loadOrder, "fixture_concordia_patch"],
          patches,
          patchMod: {
            name: "Fixture Concordia Patch",
            id: "fixture_concordia_patch",
            version: "1.0.0",
            shortDescription: "Fixture compatibility patch.",
            tags: ["Gameplay"],
          },
        }),
      );
    },
    async writeRules(rules) {
      await writeFile(
        path.join(root, "config", "conflict-rules.json"),
        JSON.stringify({
          version: 1,
          filePathCollisions: "error",
          filePathResolutions: rules.filePathResolutions ?? [],
          semanticResolutions: rules.semanticResolutions ?? [],
          definitionConflicts: "deferred",
        }),
      );
    },
    async writeManifest() {
      await writeFile(
        path.join(root, "config", "packages.json"),
        JSON.stringify({ version: 1, packages }),
      );
      if (!profileWritten) {
        await fixture.writeProfile();
      }
    },
  };
  return fixture;
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

async function writeSharedPathMods(fixture: Fixture): Promise<void> {
  fixture.addPackage("first");
  fixture.addPackage("second");
  await fixture.writePackageFiles("first", {
    "in_game/common/shared.txt": "first source",
  });
  await fixture.writePackageFiles("second", {
    "in_game/common/shared.txt": "second source",
  });
  await fixture.writeManifest();
}

test("builds a profile-specific patch without copying upstream mod content", async () => {
  const fixture = await createFixture();
  try {
    fixture.addPackage("upstream");
    fixture.addPackage("excluded");
    await fixture.writePackageFiles("upstream", {
      "in_game/common/example.txt": "upstream source",
      "in_game/common/keep.txt": "not copied",
    });

    await fixture.writePatchFile(
      "fixture/example.txt",
      "Concordia-authored fix\n",
    );
    await fixture.writeProfile(
      ["upstream"],
      ["upstream"],
      [
        {
          id: "example-fix",
          sourcePath: "integration/patches/fixture/example.txt",
          targetPath: "in_game/common/example.txt",
          targetPackageId: "upstream",
          resolutionType: "merged-patch",
          reason: "Test a targeted compatibility file.",
          preserves: ["Concordia-authored fix"],
          suppresses: ["not copied"],
        },
      ],
      [
        {
          packageId: "excluded",
          reason: "Not compatible with the fixture's target game.",
        },
      ],
    );
    await fixture.writeManifest();

    const output = await buildProject(fixture.root);
    assert.equal(
      await readFile(
        path.join(output, "in_game", "common", "example.txt"),
        "utf8",
      ),
      "Concordia-authored fix\n",
    );
    await assert.rejects(
      readFile(path.join(output, "in_game", "common", "keep.txt")),
    );
    const metadata = JSON.parse(
      await readFile(path.join(output, ".metadata", "metadata.json"), "utf8"),
    ) as Record<string, unknown>;
    assert.equal(metadata.id, "fixture_concordia_patch");
    assert.equal(metadata.game_id, "eu5");
    assert.equal(metadata.supported_game_version, "1.4.*");
    assert.deepEqual(metadata.relationships, []);

    const guide = await readFile(
      path.join(fixture.root, "dist", "load-order", "fixture.md"),
      "utf8",
    );
    assert.match(guide, /upstream.*1\.0\.0.*Local source/);
    assert.match(guide, /load last/);
    assert.match(guide, /Explicitly excluded from this profile/);
    assert.match(
      guide,
      /excluded.*1\.0\.0.*Local source.*Not compatible with the fixture/,
    );
    assert.match(guide, /does not bundle or replace any listed upstream mod/);
    const buildMetadata = JSON.parse(
      await readFile(
        path.join(fixture.root, "dist", "build-metadata", "fixture.json"),
        "utf8",
      ),
    ) as { profileId: string; mods: unknown[] };
    assert.equal(buildMetadata.profileId, "fixture");
    assert.equal(buildMetadata.mods.length, 1);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("adds a new compatibility file without replacing upstream files", async () => {
  const fixture = await createFixture();
  try {
    fixture.addPackage("upstream");
    await fixture.writePackageFiles("upstream", {
      "in_game/common/original.txt": "upstream content",
    });
    await fixture.writePatchFile(
      "fixture/additional.txt",
      "Concordia-authored additive definitions\n",
    );
    await fixture.writeProfile(
      ["upstream"],
      ["upstream"],
      [
        {
          id: "additive-definitions",
          operation: "add",
          sourcePath: "integration/patches/fixture/additional.txt",
          targetPath: "in_game/common/additional.txt",
          targetPackageId: "upstream",
          resolutionType: "merged-patch",
          reason: "Add new compatibility definitions without replacing data.",
          preserves: ["Concordia-authored additive definitions"],
          suppresses: ["not present in the authored patch"],
        },
      ],
    );
    await fixture.writeManifest();

    const output = await buildProject(fixture.root);
    assert.equal(
      await readFile(
        path.join(output, "in_game", "common", "additional.txt"),
        "utf8",
      ),
      "Concordia-authored additive definitions\n",
    );
    await assert.rejects(
      readFile(path.join(output, "in_game", "common", "original.txt")),
    );
    assert.equal(
      await readFile(
        path.join(
          fixture.root,
          "packages",
          "upstream",
          "in_game",
          "common",
          "original.txt",
        ),
        "utf8",
      ),
      "upstream content",
    );
    const buildMetadata = JSON.parse(
      await readFile(
        path.join(fixture.root, "dist", "build-metadata", "fixture.json"),
        "utf8",
      ),
    ) as { patches: Array<{ operation: string }> };
    assert.deepEqual(buildMetadata.patches, [
      {
        id: "additive-definitions",
        targetPath: "in_game/common/additional.txt",
        operation: "add",
        resolutionType: "merged-patch",
      },
    ]);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("rejects additive patches that collide with selected source paths", async () => {
  const fixture = await createFixture();
  try {
    fixture.addPackage("upstream");
    await fixture.writePackageFiles("upstream", {
      "in_game/common/additional.txt": "existing source",
    });
    await fixture.writePatchFile(
      "fixture/additional.txt",
      "Concordia-authored additive definitions\n",
    );
    await fixture.writeProfile(
      ["upstream"],
      ["upstream"],
      [
        {
          id: "additive-definitions",
          operation: "add",
          sourcePath: "integration/patches/fixture/additional.txt",
          targetPath: "in_game/common/additional.txt",
          targetPackageId: "upstream",
          resolutionType: "merged-patch",
          reason: "Add new compatibility definitions without replacing data.",
          preserves: ["Concordia-authored additive definitions"],
          suppresses: ["not present in the authored patch"],
        },
      ],
    );
    await fixture.writeManifest();

    await assert.rejects(
      buildProject(fixture.root),
      /adds in_game\/common\/additional\.txt, but that path already exists/,
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("rejects unresolved path conflicts rather than copying either upstream file", async () => {
  const fixture = await createFixture();
  try {
    await writeSharedPathMods(fixture);
    await assert.rejects(
      buildProject(fixture.root),
      /1 unresolved finding.*content-pinned decision/,
    );
    const guide = await readFile(
      path.join(fixture.root, "dist", "load-order", "fixture.md"),
      "utf8",
    );
    assert.match(guide, /Build status: BLOCKED.*1 unresolved conflict/);
    assert.match(guide, /not compatibility approval/);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("accepts a content-pinned load-order resolution only when winner loads last", async () => {
  const fixture = await createFixture();
  try {
    await writeSharedPathMods(fixture);
    await fixture.writeRules({
      filePathResolutions: [
        {
          path: "in_game/common/shared.txt",
          packages: ["first", "second"],
          resolutionType: "load-order",
          sourceFingerprints: {
            first: hash("first source"),
            second: hash("second source"),
          },
          winner: "second",
          reason: "The second mod's complete file is intended to win.",
        },
      ],
    });

    const output = await buildProject(fixture.root);
    await assert.rejects(
      readFile(path.join(output, "in_game", "common", "shared.txt")),
    );

    await fixture.writeProfile(["first", "second"], ["second", "first"]);
    await assert.rejects(
      buildProject(fixture.root),
      /1 unresolved finding.*content-pinned decision/,
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("requires re-analysis when a source file changes after approval", async () => {
  const fixture = await createFixture();
  try {
    await writeSharedPathMods(fixture);
    await fixture.writeRules({
      filePathResolutions: [
        {
          path: "in_game/common/shared.txt",
          packages: ["first", "second"],
          resolutionType: "load-order",
          sourceFingerprints: {
            first: hash("first source"),
            second: hash("second source"),
          },
          winner: "second",
          reason: "The second mod's complete file is intended to win.",
        },
      ],
    });
    await fixture.writePackageFiles("second", {
      "in_game/common/shared.txt": "updated source",
    });

    await assert.rejects(
      buildProject(fixture.root),
      /1 unresolved finding.*content-pinned decision/,
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("requires a profile patch for a merged path resolution", async () => {
  const fixture = await createFixture();
  try {
    await writeSharedPathMods(fixture);
    await fixture.writePatchFile("fixture/merged.txt", "Merged sources\n");
    await fixture.writeRules({
      filePathResolutions: [
        {
          path: "in_game/common/shared.txt",
          packages: ["first", "second"],
          resolutionType: "merged-patch",
          sourceFingerprints: {
            first: hash("first source"),
            second: hash("second source"),
          },
          override: "integration/patches/fixture/merged.txt",
          reason: "A reviewed merged patch retains both definitions.",
        },
      ],
    });
    const patch: FixturePatch = {
      id: "merge-shared",
      sourcePath: "integration/patches/fixture/merged.txt",
      targetPath: "in_game/common/shared.txt",
      targetPackageId: "first",
      resolutionType: "merged-patch",
      reason: "Retain both sources.",
      preserves: ["Merged sources"],
      suppresses: ["never match"],
    };
    await fixture.writeProfile(
      ["first", "second"],
      ["first", "second"],
      [patch],
    );
    await fixture.writeManifest();

    const output = await buildProject(fixture.root);
    assert.equal(
      await readFile(
        path.join(output, "in_game", "common", "shared.txt"),
        "utf8",
      ),
      "Merged sources\n",
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("blocks combinations explicitly classified as incompatible", async () => {
  const fixture = await createFixture();
  try {
    await writeSharedPathMods(fixture);
    await fixture.writeRules({
      filePathResolutions: [
        {
          path: "in_game/common/shared.txt",
          packages: ["first", "second"],
          resolutionType: "incompatible",
          sourceFingerprints: {
            first: hash("first source"),
            second: hash("second source"),
          },
          winner: "second",
          reason: "These mods cannot be used together.",
        },
      ],
    });
    await assert.rejects(
      buildProject(fixture.root),
      /1 unresolved finding.*content-pinned decision/,
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("requires profile pins to match the package manifest", async () => {
  const fixture = await createFixture();
  try {
    fixture.addPackage("mod");
    await fixture.writePackageFiles("mod", {});
    await fixture.writeManifest();
    const profilePath = path.join(fixture.root, "profiles", "fixture.json");
    const profile = JSON.parse(await readFile(profilePath, "utf8")) as {
      mods: Array<{ version: string }>;
    };
    profile.mods[0].version = "2.0.0";
    await writeFile(profilePath, JSON.stringify(profile));

    await assert.rejects(
      validateProject(fixture.root),
      /stale version or source pin/,
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("requires declared package dependencies to be selected", async () => {
  const fixture = await createFixture();
  try {
    fixture.addPackage("base");
    fixture.addPackage("extension", ["base"]);
    await fixture.writePackageFiles("base", {});
    await fixture.writePackageFiles("extension", {});
    await fixture.writeManifest();
    await fixture.writeProfile(["extension"]);

    await assert.rejects(
      validateProject(fixture.root),
      /depends on unselected package base/,
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("uses a separate output directory for each playset profile", async () => {
  const fixture = await createFixture();
  try {
    fixture.addPackage("mod");
    await fixture.writePackageFiles("mod", {});
    await fixture.writeManifest();
    const profile = JSON.parse(
      await readFile(
        path.join(fixture.root, "profiles", "fixture.json"),
        "utf8",
      ),
    ) as Record<string, unknown>;
    await writeFile(
      path.join(fixture.root, "profiles", "alternate.json"),
      JSON.stringify({ ...profile, id: "alternate", name: "Alternate" }),
    );

    const output = await buildProject(fixture.root, {
      profileId: "alternate",
    });
    assert.equal(path.basename(output), "alternate");
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("rejects a target-game-version override that disagrees with the profile", async () => {
  const fixture = await createFixture();
  try {
    fixture.addPackage("mod");
    await fixture.writePackageFiles("mod", {});
    await fixture.writeManifest();
    await assert.rejects(
      validateProject(fixture.root, { targetGameVersion: "1.4.4" }),
      /Profile fixture targets EU5 1\.4\.5, but this build targets EU5 1\.4\.4/,
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});
