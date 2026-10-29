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

async function createFixture(): Promise<Fixture> {
  const root = await mkdtemp(path.join(os.tmpdir(), "europa-concordia-test-"));
  const packages: unknown[] = [];
  await mkdir(path.join(root, "config"), { recursive: true });
  await mkdir(path.join(root, "dist"), { recursive: true });
  await writeFile(
    path.join(root, "config", "build.json"),
    JSON.stringify({
      version: 1,
      packagesFile: "config/packages.json",
      outputDirectory: "dist/europa-concordia",
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
        targetGameVersion: "fixture",
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
    await fixture.writePackageFiles("zeta", { "events/sample.txt": "zeta\n" });
    await fixture.writePackageFiles("alpha", { "common/file.txt": "alpha\n" });
    await fixture.writeManifest();

    const output = await buildProject(fixture.root);
    assert.equal(
      await readFile(path.join(output, "common", "file.txt"), "utf8"),
      "alpha\n",
    );
    assert.deepEqual(
      JSON.parse(
        await readFile(path.join(output, "build-metadata.json"), "utf8"),
      ),
      {
        formatVersion: 1,
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
    await fixture.writePackageFiles("first", { "common/file.txt": "one" });
    await fixture.writePackageFiles("second", { "COMMON/FILE.TXT": "two" });
    await fixture.writeManifest();

    await assert.rejects(
      buildProject(fixture.root),
      /File path collision at "COMMON\/FILE\.TXT" between packages first and second/,
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
        targetGameVersion: "fixture",
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
        targetGameVersion: "fixture",
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
