import assert from "node:assert/strict";
import test from "node:test";
import { createWorkshopModMetadata } from "../scripts/workshop/metadata.js";

test("creates EU5 launcher metadata from Workshop configuration", () => {
  assert.deepEqual(
    createWorkshopModMetadata({
      name: "Europa Concordia",
      id: "europa_concordia",
      version: "0.1.0",
      supportedGameVersion: "1.4.*",
      shortDescription: "A staged EU5 map pass.",
      tags: ["Gameplay", "Map"],
    }),
    {
      name: "Europa Concordia",
      id: "europa_concordia",
      version: "0.1.0",
      game_id: "eu5",
      supported_game_version: "1.4.*",
      short_description: "A staged EU5 map pass.",
      tags: ["Gameplay", "Map"],
      relationships: [],
      game_custom_data: {},
    },
  );
});
