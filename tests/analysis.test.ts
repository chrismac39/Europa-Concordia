import assert from "node:assert/strict";
import test from "node:test";
import {
  extractCountryTags,
  extractDefinitions,
  extractGlobalVariables,
  extractLocalizationLine,
} from "../scripts/analysis/parser.js";

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
