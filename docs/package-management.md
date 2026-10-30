# Analysis inputs and playset profiles

## Candidate source manifest

`config/packages.json` is a catalog of mods the analyzer can inspect. It does
not enable files for output. Each entry records:

| Field               | Meaning                                                               |
| ------------------- | --------------------------------------------------------------------- |
| `id`                | Stable lowercase catalog ID                                           |
| `name`              | Display name                                                          |
| `type`              | `upstream`, `maintained`, or `original`                               |
| `source`            | Local source path and immutable Git revision or Workshop snapshot pin |
| `author`            | Original author or first-party author                                 |
| `targetGameVersion` | EU5 version reviewed for the input                                    |
| `version`           | Mod's upstream version                                                |
| `dependencies`      | Required mod catalog IDs                                              |
| `attribution`       | License and provenance/permission notice                              |

Source forms:

- Git: `{ "type": "git", "url": "...", "revision": "<full commit hash>", "path": "..." }`
- Workshop: `{ "type": "steam-workshop", "workshopId": "...", "snapshotChecksum": "sha256:<64 hex characters>", "path": "..." }`
- Local: `{ "type": "local", "path": "..." }`

The manifest source path points to an analysis snapshot. Keep snapshots
unchanged when possible; never copy them into the generated Concordia patch.
Git sources require a full commit hash, and Workshop sources require an
immutable local snapshot and checksum. Source acquisition and refreshing are
not performed by the build.

## Playset profiles

`profiles/<id>.json` is the authoritative selected playset. It records the
target game version, mod IDs/names/versions and source identifiers, a
`loadOrder` list from earliest to latest, profile-specific Concordia patch
files, explicit `excludedMods` with reasons for known incompatible candidates,
generated mod metadata, and the Concordia patch mod ID as the final load-order
entry. The generated guide calls out exclusions separately so they are not
mistaken for required playset mods. The starter profile is
[`current-intended`](../profiles/current-intended.json).

Profile pins must exactly match their entries in `config/packages.json`.
Change the profile when changing a mod version, Workshop ID, source checksum,
Git revision, or game target. The analyzer includes profile identity and
SHA-256 hashes of finding source files in approval fingerprints. Changes to
relevant input content make old approvals stale and block a build until the
updated evidence is reviewed.

Add a profile without changing other playsets:

1. Select catalog IDs and copy their current version and source identity pins
   into `profiles/<id>.json`.
2. Record every selected mod exactly once in `loadOrder`. Dependencies must be
   selected and ordered before their dependents.
3. Add only Concordia-authored patch files under `integration/patches/` or
   `integration/overrides/`. Each patch declares a source path, game output
   path, targeted input mod, conflict class, reason, and important content to
   preserve or suppress.
4. Analyze the profile, review every conflict, then validate and build:

```sh
npm run analyze -- --profile <id>
npm run validate -- --profile <id>
npm test
npm run build -- --profile <id>
```

Build output is isolated by profile under
`dist/europa-concordia/<id>/`. The generated load-order guide lists every
required mod's name, version, Workshop ID or Git revision, and order; it places
the Concordia patch last. No upstream content is part of the output.

In the `current-intended` profile, Standard of Living and Just Goods remain
separate required mods. The existing SOL-JTG compatibility submod is excluded
because Concordia emits the compatibility behavior itself; it is retained as
a pinned, catalogued behavior reference only and is not scanned as a selected
playset mod.

## Decisions and source changes

`config/conflict-rules.json` records explicit conflict classifications:

- `load-order` names an intended winner, records per-file source fingerprints,
  and only resolves when the selected profile loads that mod last;
- `merged-patch` refers to an explicitly authored profile patch;
- `incompatible` remains blocking.

An unclassified finding, participant change, or fingerprint mismatch is
unresolved. Do not select a winner from directory order, and do not resolve a
conflict by copying a complete upstream file without checking what it replaces.
See [conflict resolution](conflict-resolution.md) for EU5 file and database
entry behavior.

## Local install and publishing boundary

`npm run workshop:install -- --profile <id>` stages the generated patch and
copies it into the local EU5 mod directory. This is a local install only. The
repository does not upload to Steam; publishing requires a separate explicit
workflow.
