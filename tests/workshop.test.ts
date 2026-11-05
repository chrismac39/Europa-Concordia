import assert from "node:assert/strict";
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createWorkshopModMetadata } from "../scripts/workshop/metadata.js";
import { packageWorkshopMod } from "../scripts/workshop/packager.js";

test("creates EU5 launcher metadata from Workshop configuration", () => {
  assert.deepEqual(
    createWorkshopModMetadata({
      name: "Europa Concordia",
      id: "europa_concordia",
      version: "0.1.0",
      supportedGameVersion: "1.4.*",
      shortDescription: "A staged EU5 map pass.",
      tags: ["Gameplay", "Map"],
      relationships: [
        {
          rel_type: "dependency",
          id: "community_mod_framework",
          display_name: "Community Mod Framework",
          resource_type: "mod",
          version: "2.*",
        },
      ],
    }),
    {
      name: "Europa Concordia",
      id: "europa_concordia",
      version: "0.1.0",
      game_id: "eu5",
      supported_game_version: "1.4.*",
      short_description: "A staged EU5 map pass.",
      tags: ["Gameplay", "Map"],
      relationships: [
        {
          rel_type: "dependency",
          id: "community_mod_framework",
          display_name: "Community Mod Framework",
          resource_type: "mod",
          version: "2.*",
        },
      ],
      game_custom_data: {},
    },
  );
});

test("packages only the generated compatibility patch and its metadata", async () => {
  const root = await mkdtemp(
    path.join(os.tmpdir(), "concordia-workshop-test-"),
  );
  try {
    await mkdir(path.join(root, "config"), { recursive: true });
    await mkdir(path.join(root, "profiles"), { recursive: true });
    await mkdir(path.join(root, "sources", "input", "in_game", "common"), {
      recursive: true,
    });
    await writeFile(
      path.join(root, "sources", "input", "in_game", "common", "upstream.txt"),
      "upstream payload",
    );
    await writeFile(
      path.join(root, "config", "build.json"),
      JSON.stringify({
        version: 1,
        targetGameVersion: "1.4.5",
        defaultProfile: "workshop-test",
        packagesFile: "config/packages.json",
        conflictRulesFile: "config/conflict-rules.json",
        outputDirectory: "dist/europa-concordia",
      }),
    );
    await writeFile(
      path.join(root, "config", "packages.json"),
      JSON.stringify({
        version: 1,
        packages: [
          {
            id: "input",
            name: "Input Mod",
            type: "upstream",
            source: { type: "local", path: "sources/input" },
            author: "Test",
            targetGameVersion: "1.4.5",
            version: "1.0.0",
            dependencies: [],
            attribution: { license: "MIT" },
          },
        ],
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
    await writeFile(
      path.join(root, "profiles", "workshop-test.json"),
      JSON.stringify({
        version: 1,
        id: "workshop-test",
        name: "Workshop packaging test",
        targetGameVersion: "1.4.5",
        mods: [
          {
            packageId: "input",
            name: "Input Mod",
            version: "1.0.0",
            source: { type: "local" },
          },
        ],
        loadOrder: ["input", "test_compatibility_patch"],
        patches: [],
        patchMod: {
          name: "Test compatibility patch",
          id: "test_compatibility_patch",
          version: "1.0.0",
          shortDescription: "Test patch metadata.",
          tags: ["Gameplay"],
        },
      }),
    );
    await writeFile(
      path.join(root, "config", "workshop.json"),
      JSON.stringify({
        version: 1,
        metadata: {
          name: "Test",
          id: "test",
          version: "1.0.0",
          supportedGameVersion: "1.4.*",
          shortDescription: "Test",
          tags: ["Gameplay"],
          relationships: [],
        },
        requiredWorkshopItems: [],
        channels: {
          stable: { artifactDirectory: "dist/workshop/stable" },
        },
      }),
    );

    const result = await packageWorkshopMod(root);
    const packagedFiles = await readdir(result.artifactDirectory, {
      withFileTypes: true,
    });
    assert.deepEqual(packagedFiles.map((entry) => entry.name).sort(), [
      ".metadata",
    ]);
    await assert.rejects(
      readFile(
        path.join(
          result.artifactDirectory,
          "in_game",
          "common",
          "upstream.txt",
        ),
      ),
    );
    const metadata = JSON.parse(
      await readFile(
        path.join(result.artifactDirectory, ".metadata", "metadata.json"),
        "utf8",
      ),
    ) as { id: string; supported_game_version: string };
    assert.equal(metadata.id, "test_compatibility_patch");
    assert.equal(metadata.supported_game_version, "1.4.*");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
