# Architecture

## Product boundary

Europa Concordia is a playset compatibility patch builder, not an all-in-one
EU5 mod or a general-purpose mod manager. The player's original Workshop mods
remain separate. Concordia uses local source snapshots for analysis only and
outputs a profile-specific mod containing Concordia-authored compatibility
files and valid EU5 launcher metadata. Upstream files are never copied into the
generated mod.

The pipeline has four stages:

1. **Source inventory** — `config/packages.json` records candidate mods and
   immutable Workshop/Git source pins. Source acquisition and refreshing remain
   separate operations.
2. **Profile validation** — `profiles/<id>.json` selects mods, pins their
   versions and external identifiers, sets the target EU5 release, and records
   their order in the playset.
3. **Analysis and decisions** — the analyzer scans only selected source
   snapshots. Decisions are profile-specific and fingerprinted against the
   exact source-file contents.
4. **Patch generation** — the build emits only the profile's explicitly listed
   Concordia-authored patches, launcher metadata, load-order guide, and build
   metadata.

## Profiles and inputs

The package manifest is an analysis-input catalog, not a build payload list.
It can contain candidates that are not in any active profile. A profile stores
each selected mod's manifest ID, display name, version, Workshop ID/checksum or
Git revision, plus an ordered `loadOrder` list that ends with the generated
Concordia patch mod ID. All selected mods must have a local source snapshot
and target the profile's EU5 release.

The starter profile is `current-intended`, targeting EU5 1.4.5. More profiles
can be added under `profiles/`; each builds into a separate output directory
and gets separate analysis reports. Concordia is explicitly last in the
profile's load order and the generated guide.

## Conflict model

Conflicts are not resolved by copying whichever upstream file happens to win.
Every exact-path conflict is explicitly classified as:

- **Load-order** — a content-pinned rule names the intended winner, and the
  selected profile must place that mod last among the conflicting mods.
- **Merged patch** — a profile includes a Concordia-authored file whose intent
  and retained content are recorded and validated.
- **Incompatible** — the combination is explicitly blocked.

Unclassified or stale conflicts remain unresolved and block the build.

EU5's [mod structure documentation](https://eu5.paradoxwikis.com/Mod_structure)
states that a same-directory, same-name file overrides the vanilla or
previously read mod file, including when the replacing file is empty. Database
entry modes such as `REPLACE:` and `INJECT:` are distinct from whole-file
overrides and are unavailable in `common/on_action`. Therefore a full
`on_action` replacement must preserve every callback that still needs to run.
The MRC compatibility file is an explicit Concordia-authored replacement that
keeps MRC's historical default initialization and removes its CMF/CMM setting
hooks; its source file is checked for both preserved and suppressed names.

The analyzer also tracks cross-file definitions, replacement/injection
targets, event and on-action IDs, localization, global variables, and
country-system overlap. Static analysis does not prove runtime compatibility;
engine ordering, map generation, and save behavior still require in-game
testing.

## Freshness and output

Profiles are checked against the package manifest's version and source
identifier/checksum. Each analysis finding fingerprint includes the profile ID
and SHA-256 digests of its source files. A source change therefore invalidates
any matching path or semantic approval instead of silently reusing it. The
analyzer runs on every build.

`npm run build -- --profile <id>` writes:

- `dist/europa-concordia/<id>/` — only Concordia-authored patch files and
  `.metadata/metadata.json`;
- `dist/load-order/<id>.md` — required mod names, versions, Workshop IDs or Git
  revisions, and order;
- `dist/build-metadata/<id>.json` — selected input pins and generated patch
  inventory.

`npm run workshop:install -- --profile <id>` copies that generated patch to
the local EU5 mod directory. No build, packaging, or install command uploads
to Steam. Publishing remains an explicit, separate future operation.
