import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildProject } from "../scripts/build/pipeline.js";
import { validateProject } from "../scripts/build/validation.js";

interface Fixture {
  root: string;
  addPackage(id: string, sourcePath: string, dependencies?: string[]): void;
  writePackageFiles(id: string, files: Record<string, string>): Promise<void>;
  writeManifest(): Promise<void>;
}

async function createFixture(
  configuredTargetGameVersion = "1.4.5",
): Promise<Fixture> {
  const root = await mkdtemp(path.join(os.tmpdir(), "europa-concordia-test-"));
  const packages: unknown[] = [];
  await mkdir(path.join(root, "config"), { recursive: true });
  await mkdir(path.join(root, "dist"), { recursive: true });
  await writeFile(
    path.join(root, "config", "build.json"),
    JSON.stringify({
      version: 1,
      targetGameVersion: configuredTargetGameVersion,
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

  return {
    root,
    addPackage(id, sourcePath, dependencies = []) {
      packages.push({
        id,
        name: id,
        type: "original",
        source: { type: "local", path: sourcePath },
        author: "Fixture author",
        targetGameVersion: "1.4.5",
        version: "1.0.0",
        enabled: true,
        dependencies,
        attribution: { license: "MIT" },
      });
    },
    async writePackageFiles(id, files) {
      const packageDirectory = path.join(root, "packages", id);
      for (const [relativePath, contents] of Object.entries(files)) {
        const filePath = path.join(packageDirectory, relativePath);
        await mkdir(path.dirname(filePath), { recursive: true });
        await writeFile(filePath, contents);
      }
    },
    async writeManifest() {
      await writeFile(
        path.join(root, "config", "packages.json"),
        JSON.stringify({ version: 1, packages }),
      );
    },
  };
}

test("builds enabled package files deterministically with metadata", async () => {
  const fixture = await createFixture();
  try {
    fixture.addPackage("zeta", "packages/zeta");
    fixture.addPackage("alpha", "packages/alpha");
    await fixture.writePackageFiles("zeta", {
      "in_game/events/sample.txt": "zeta\n",
    });
    await fixture.writePackageFiles("alpha", {
      "in_game/common/file.txt": "alpha\n",
    });
    await fixture.writeManifest();

    const output = await buildProject(fixture.root);
    assert.equal(
      await readFile(
        path.join(output, "in_game", "common", "file.txt"),
        "utf8",
      ),
      "alpha\n",
    );
    assert.deepEqual(
      JSON.parse(
        await readFile(path.join(output, "build-metadata.json"), "utf8"),
      ),
      {
        formatVersion: 1,
        targetGameVersion: "1.4.5",
        packages: [
          { id: "alpha", version: "1.0.0", sourceType: "local" },
          { id: "zeta", version: "1.0.0", sourceType: "local" },
        ],
      },
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("rejects case-insensitive file path collisions", async () => {
  const fixture = await createFixture();
  try {
    fixture.addPackage("first", "packages/first");
    fixture.addPackage("second", "packages/second");
    await fixture.writePackageFiles("first", {
      "in_game/common/file.txt": "one",
    });
    await fixture.writePackageFiles("second", {
      "IN_GAME/COMMON/FILE.TXT": "two",
    });
    await fixture.writeManifest();

    await assert.rejects(
      buildProject(fixture.root),
      /File path collision at "IN_GAME\/COMMON\/FILE\.TXT" between packages first and second/,
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("reports all unresolved file path collisions", async () => {
  const fixture = await createFixture();
  try {
    fixture.addPackage("first", "packages/first");
    fixture.addPackage("second", "packages/second");
    await fixture.writePackageFiles("first", {
      "in_game/common/first.txt": "one",
      "in_game/common/second.txt": "one",
    });
    await fixture.writePackageFiles("second", {
      "in_game/common/first.txt": "two",
      "in_game/common/second.txt": "two",
    });
    await fixture.writeManifest();

    await assert.rejects(buildProject(fixture.root), (error: Error) => {
      assert.match(error.message, /in_game\/common\/first\.txt/);
      assert.match(error.message, /in_game\/common\/second\.txt/);
      return true;
    });
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("rejects cross-file semantic definition conflicts", async () => {
  const fixture = await createFixture();
  try {
    fixture.addPackage("first", "packages/first");
    fixture.addPackage("second", "packages/second");
    await fixture.writePackageFiles("first", {
      "in_game/common/disasters/first.txt":
        "horde_civil_war = { trigger = { tag = GLH } }",
    });
    await fixture.writePackageFiles("second", {
      "in_game/common/disasters/second.txt":
        "REPLACE:horde_civil_war = { trigger = { tag = KZN } }",
    });
    await fixture.writeManifest();

    await assert.rejects(
      buildProject(fixture.root),
      /Semantic analysis found 1 unresolved finding/,
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("rejects enabled packages with disabled dependencies", async () => {
  const fixture = await createFixture();
  try {
    fixture.addPackage("base", "packages/base");
    fixture.addPackage("extension", "packages/extension", ["base"]);
    const manifestPath = path.join(fixture.root, "config", "packages.json");
    const manifest = [
      {
        id: "base",
        name: "base",
        type: "original",
        source: { type: "local", path: "packages/base" },
        author: "Fixture author",
        targetGameVersion: "1.4.5",
        version: "1.0.0",
        enabled: false,
        dependencies: [],
        attribution: { license: "MIT" },
      },
      {
        id: "extension",
        name: "extension",
        type: "original",
        source: { type: "local", path: "packages/extension" },
        author: "Fixture author",
        targetGameVersion: "1.4.5",
        version: "1.0.0",
        enabled: true,
        dependencies: ["base"],
        attribution: { license: "MIT" },
      },
    ];
    await writeFile(
      manifestPath,
      JSON.stringify({ version: 1, packages: manifest }),
    );

    await assert.rejects(
      validateProject(fixture.root),
      /depends on disabled package base/,
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("applies an exact file-path collision resolution", async () => {
  const fixture = await createFixture();
  try {
    fixture.addPackage("first", "packages/first");
    fixture.addPackage("second", "packages/second");
    await fixture.writePackageFiles("first", {
      "in_game/common/file.txt": "selected",
    });
    await fixture.writePackageFiles("second", {
      "in_game/common/file.txt": "discarded",
    });
    await fixture.writeManifest();
    await writeFile(
      path.join(fixture.root, "config", "conflict-rules.json"),
      JSON.stringify({
        version: 1,
        filePathCollisions: "error",
        filePathResolutions: [
          {
            path: "in_game/common/file.txt",
            packages: ["first", "second"],
            winner: "first",
            reason: "Fixture verifies an explicit resolution.",
          },
        ],
        semanticResolutions: [],
        definitionConflicts: "deferred",
      }),
    );

    const output = await buildProject(fixture.root);
    assert.equal(
      await readFile(
        path.join(output, "in_game", "common", "file.txt"),
        "utf8",
      ),
      "selected",
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("applies a Concordia file-path override", async () => {
  const fixture = await createFixture();
  try {
    fixture.addPackage("first", "packages/first");
    fixture.addPackage("second", "packages/second");
    await fixture.writePackageFiles("first", {
      "in_game/common/file.txt": "first",
    });
    await fixture.writePackageFiles("second", {
      "in_game/common/file.txt": "second",
    });
    await fixture.writeManifest();
    const overridePath = path.join(
      fixture.root,
      "integration",
      "overrides",
      "file.txt",
    );
    await mkdir(path.dirname(overridePath), { recursive: true });
    await writeFile(overridePath, "merged");
    await writeFile(
      path.join(fixture.root, "config", "conflict-rules.json"),
      JSON.stringify({
        version: 1,
        filePathCollisions: "error",
        filePathResolutions: [
          {
            path: "in_game/common/file.txt",
            packages: ["first", "second"],
            override: "integration/overrides/file.txt",
            reason: "Fixture verifies a Concordia override.",
          },
        ],
        semanticResolutions: [],
        definitionConflicts: "deferred",
      }),
    );

    const output = await buildProject(fixture.root);
    assert.equal(
      await readFile(
        path.join(output, "in_game", "common", "file.txt"),
        "utf8",
      ),
      "merged",
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("excludes package metadata and development files", async () => {
  const fixture = await createFixture();
  try {
    fixture.addPackage("clean", "packages/clean");
    await fixture.writePackageFiles("clean", {
      ".metadata/metadata.json": "{}",
      "README.md": "documentation",
      "tools/generate.ts": "development tooling",
      "in_game/common/file.txt": "content",
    });
    await fixture.writeManifest();

    const output = await buildProject(fixture.root);
    await assert.rejects(
      readFile(path.join(output, ".metadata", "metadata.json")),
    );
    await assert.rejects(readFile(path.join(output, "README.md")));
    await assert.rejects(readFile(path.join(output, "tools", "generate.ts")));
    assert.equal(
      await readFile(
        path.join(output, "in_game", "common", "file.txt"),
        "utf8",
      ),
      "content",
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("uses a parameterized EU5 target instead of the configured default", async () => {
  const fixture = await createFixture("1.4.4");
  try {
    fixture.addPackage("compatible", "packages/compatible");
    await fixture.writePackageFiles("compatible", {
      "common/file.txt": "content",
    });
    await fixture.writeManifest();

    const output = await buildProject(fixture.root, {
      targetGameVersion: "1.4.5",
    });
    const metadata = JSON.parse(
      await readFile(path.join(output, "build-metadata.json"), "utf8"),
    ) as { targetGameVersion: string };
    assert.equal(metadata.targetGameVersion, "1.4.5");
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("rejects packages targeting a different EU5 version", async () => {
  const fixture = await createFixture();
  try {
    fixture.addPackage("incompatible", "packages/incompatible");
    await fixture.writePackageFiles("incompatible", {
      "common/file.txt": "content",
    });
    await fixture.writeManifest();

    await assert.rejects(
      validateProject(fixture.root, { targetGameVersion: "1.4.4" }),
      /incompatible targets EU5 1\.4\.5, but this build targets EU5 1\.4\.4/,
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("rejects malformed target release versions", async () => {
  const fixture = await createFixture();
  try {
    await assert.rejects(
      validateProject(fixture.root, { targetGameVersion: "1.4" }),
      /targetGameVersion override must use MAJOR\.MINOR\.PATCH format/,
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});
