import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { prepareCmtWorkspace } from "../scripts/workshop/cmt.js";

test("prepares an isolated CMT project with profile content and release assets", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "concordia-cmt-test-"));
  const artifactDirectory = path.join(root, "dist", "artifact");
  const workshopDirectory = path.join(
    root,
    "integration",
    "workshop",
    "sample",
  );
  const toolkitDirectory = path.join(root, "cmt-source");
  const dependenciesDirectory = path.join(
    toolkitDirectory,
    "tools",
    "dependencies",
  );
  try {
    await mkdir(path.join(artifactDirectory, "in_game"), { recursive: true });
    await mkdir(path.join(artifactDirectory, "dlc"), { recursive: true });
    await mkdir(path.join(artifactDirectory, ".metadata"), {
      recursive: true,
    });
    await mkdir(path.join(workshopDirectory, "change-notes"), {
      recursive: true,
    });
    await mkdir(dependenciesDirectory, { recursive: true });
    await writeFile(
      path.join(artifactDirectory, "in_game", "content.txt"),
      "game content",
    );
    await writeFile(path.join(artifactDirectory, "dlc", "content.txt"), "dlc");
    await writeFile(
      path.join(artifactDirectory, ".metadata", "metadata.json"),
      JSON.stringify({ id: "sample_mod" }),
    );
    await writeFile(
      path.join(workshopDirectory, "STEAM_PAGE.bbcode"),
      "[b]Sample mod[/b]",
    );
    await writeFile(
      path.join(workshopDirectory, "change-notes", "1.2.3.bbcode"),
      "[b]Version 1.2.3 — Initial release[/b]\n\nFirst release.",
    );
    await writeFile(
      path.join(toolkitDirectory, "tools", "upload.py"),
      'SOURCES = [\n    "in_game",\n    "main_menu",\n]\n',
    );
    await writeFile(
      path.join(toolkitDirectory, "tools", "config.toml"),
      [
        "workshop_upload_item_id = 0",
        "upload_mod_by_default = true",
        "upload_workshop_pages_by_default = true",
        "upload_only_on_version_change = true",
        "upload_change_notes_by_default = true",
        "upload_submods_by_default = true",
      ].join("\n"),
    );
    await writeFile(
      path.join(dependenciesDirectory, "requirements.txt"),
      "steamworks",
    );

    const options = {
      rootDirectory: root,
      profileId: "sample-profile",
      artifactDirectory,
      workshopDirectory,
      toolkitDirectory,
      workshopItemId: 0,
      version: "1.2.3",
    };
    const result = await prepareCmtWorkspace(options);
    const uploadScript = await readFile(
      path.join(result.workspaceDirectory, "tools", "upload.py"),
      "utf8",
    );
    const cmtConfig = await readFile(
      path.join(result.workspaceDirectory, "tools", "config.toml"),
      "utf8",
    );
    assert.match(uploadScript, /"dlc",\s+"in_game"/);
    assert.match(cmtConfig, /workshop_upload_item_id = 0/);
    assert.match(cmtConfig, /upload_mod_by_default = false/);
    assert.match(cmtConfig, /upload_workshop_pages_by_default = false/);
    assert.match(cmtConfig, /upload_only_on_version_change = false/);
    assert.match(cmtConfig, /upload_change_notes_by_default = false/);
    assert.match(cmtConfig, /upload_submods_by_default = false/);
    assert.equal(
      await readFile(
        path.join(
          result.workspaceDirectory,
          "assets",
          "workshop",
          "workshop-description.bbcode",
        ),
        "utf8",
      ),
      "[b]Sample mod[/b]",
    );
    assert.match(
      await readFile(
        path.join(
          result.workspaceDirectory,
          "assets",
          "workshop",
          "change-notes.bbcode",
        ),
        "utf8",
      ),
      /^\[b\]v1\.2\.3:\[\/b\]\n\nFirst release\.\n$/,
    );

    await writeFile(
      path.join(result.workspaceDirectory, "tools", "config.toml"),
      cmtConfig.replace(
        "workshop_upload_item_id = 0",
        "workshop_upload_item_id = 123456",
      ),
    );
    await writeFile(
      path.join(
        result.workspaceDirectory,
        "tools",
        "dependencies",
        ".upload_versions.json",
      ),
      '{"versions":{}}',
    );
    const refreshed = await prepareCmtWorkspace(options);
    assert.equal(refreshed.workshopItemId, 123456);
    assert.equal(refreshed.reusedWorkshopItemId, true);
    assert.match(
      await readFile(
        path.join(refreshed.workspaceDirectory, "tools", "config.toml"),
        "utf8",
      ),
      /workshop_upload_item_id = 123456/,
    );
    assert.equal(
      await readFile(
        path.join(
          refreshed.workspaceDirectory,
          "tools",
          "dependencies",
          ".upload_versions.json",
        ),
        "utf8",
      ),
      '{"versions":{}}',
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
