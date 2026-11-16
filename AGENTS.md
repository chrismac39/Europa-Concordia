# EU5 development rules

- Treat the installed EU5 vanilla files as the primary reference for scripting
  syntax, definitions, and game behavior. Inspect actual vanilla definitions
  before introducing triggers, effects, modifiers, or other game objects; do
  not invent unsupported syntax or definitions.
- Treat all vanilla game files as strictly read-only. Never edit, format,
  copy into the repository, or commit files from the game installation.
- Preserve imported package source content. Keep compatibility work in
  separately reviewable maintained patches or integration overrides, with a
  written decision explaining the change.
- Preserve the required EU5 file encoding, BOM, indentation, and line endings
  in newly authored or generated game files. Follow the path-scoped rules in
  `.editorconfig`; do not apply Paradox formatting to unrelated `.txt` or
  `.yml` files, TypeScript, or documentation.
- Validate the final assembled all-in-one output, not only individual package
  inputs. Unresolved collisions or conflicts must not be silently discarded.
- Keep machine-specific paths, including the local EU5 installation path, in
  ignored local configuration where possible. Do not commit machine-specific
  settings.
- Workshop publishing must only run through an explicit command and must
  require a human confirmation immediately before creating or updating an
  item. Never publish as a side effect of Git activity, building, validation,
  or version changes.
- Before any publish attempt, require successful build, validation, clean
  conflict reports, the selected stable item/channel, documented attribution
  and redistribution permissions, and a generated release summary/changelog.
- Never request, read, log, copy, store, or commit Steam passwords, tokens,
  Steam Guard recovery codes, or SteamCMD session files. Keep authentication
  outside the repository and all generated artifacts. Never disable Steam
  Guard.

## EU5 and Concordia workflow

These are original, repository-specific guidelines informed by the
[Flavorium Universalis Claude developer guide](https://github.com/wtmenten/flavorium-universalis/blob/master/CLAUDE.md).
Its mod-specific commands, examples, and version-dependent findings are not
assumed to apply here.

- Read [development setup](docs/development-setup.md),
  [architecture](docs/architecture.md), and the relevant package or conflict
  documentation before changing the corresponding workflow.
- For EU5 scripting, GUI, localization, and metadata, verify syntax and
  behavior against the installed vanilla files for the profile's target game
  version. Inspect definitions and working usage examples; do not infer valid
  names or scopes from intuition, EU4, or another mod. Look under the actual
  `game/in_game/` and `game/main_menu/` trees, not an assumed `game/common/`
  path.
- EU5 files are not interchangeable merge units. A same-path file can replace
  an entire earlier file, while database-entry directives such as `REPLACE:`
  and `INJECT:` have distinct, context-dependent behavior. Check which
  mechanism is supported before choosing an integration; when a complete-file
  patch is necessary, account for all upstream behavior it retains or
  suppresses and record the decision.
- Keep upstream source snapshots as analysis inputs. Put compatibility logic
  in maintained integration patches or overrides, and record the rationale,
  source pins, and any redistribution permissions required for the output.
- Follow `.editorconfig` for the specific path being edited. EU5 game-content
  files have path-scoped encoding and indentation rules; do not apply those
  rules to TypeScript, documentation, or unrelated `.txt` and `.yml` files.
- Treat reports and build output as generated evidence, not source to hand-edit.
  For compatibility changes, analyze the selected profile, inspect numbered
  findings with `npm run diff -- --profile <id> <finding-number>`, record or
  refresh decisions, then validate, test, and build:

  ```sh
  npm run analyze -- --profile <id>
  npm run validate -- --profile <id>
  npm test
  npm run build -- --profile <id>
  ```

- Do not treat successful static analysis as proof of in-game behavior.
  Identify runtime-sensitive changes that still need EU5 testing, and do not
  suppress unresolved conflicts to make a build pass.
- Local installation is not publishing. Never upload, create, or update a
  Workshop item as a side effect of analysis, validation, building, or
  installation.
