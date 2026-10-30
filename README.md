# Europa Concordia

Europa Concordia is a playset compatibility patch builder for Europa
Universalis V. Upstream mods stay separate in the player's playset; Concordia
analyzes their pinned source snapshots and generates only Concordia-authored
compatibility files, launcher metadata, and a profile-specific load-order
guide.

## Requirements

- Node.js 22 or newer
- npm

## Getting started

```sh
npm install
npm run analyze -- --profile current-intended
npm run validate -- --profile current-intended
npm test
npm run build -- --profile current-intended
```

Analysis reports are generated under `reports/<profile-id>/`. Review numbered
evidence from the profile's deep frontier in VS Code's side-by-side diff editor:

```sh
npm run diff -- --profile current-intended 1
```

`npm run analyze` checks exact paths, cross-file EU5 definitions,
`REPLACE:`/`INJECT:` targets, event and on-action IDs, localization values,
global variables, and shared country-system footprints. Each profile pins
selected mod versions and source identifiers. Findings include profile- and
content-sensitive fingerprints, so an upstream file change invalidates its
previous approval.

The starter profile is [current-intended](profiles/current-intended.json) for
EU5 1.4.5. Build output goes to
`dist/europa-concordia/<profile-id>/`; its generated load-order guide and
machine-readable build metadata are written beside it under `dist/`.

Install the generated patch locally for the EU5 launcher with:

```sh
npm run workshop:install -- --profile current-intended
```

This only builds and copies the selected profile to the local EU5 mod
directory. It does not upload or publish anything to Steam.

## Adding a package

1. Read [package management](docs/package-management.md) and add an analysis
   input to `config/packages.json`.
2. Keep the selected source snapshot immutable in its declared `source.path`.
   Do not add a third-party source until its redistribution terms have been
   checked.
3. Add a profile under `profiles/` that pins the mod version, external
   identifier, target EU5 version, and load order.
4. Put only authored compatibility files in `integration/patches/` or
   `integration/overrides/`, and document the reasoning in
   `integration/decisions/`.
5. Run `npm run analyze -- --profile <id>`, `npm test`, and
   `npm run build -- --profile <id>`.

The build never copies upstream mod content. It stops on unresolved or
incompatible conflicts and verifies that a load-order decision matches the
profile's order and source-file fingerprints.

## Project layout

- `sources/`: immutable analysis snapshots for candidate mods
- `profiles/`: playset selections, version pins, and load orders
- `integration/`: separately maintained patches, overrides, and decisions
- `config/`: package, build, and conflict-policy manifests
- `scripts/`: TypeScript build and validation tooling
- `tests/`: synthetic tests; no real mod content is required
- `reports/`: profile-specific analysis reports
- `dist/`: generated build output

See [architecture](docs/architecture.md), [conflict resolution](docs/conflict-resolution.md),
and [legacy migration](docs/legacy-migration.md) for the initial design.
For EU5-aware editor setup and vanilla-file safety rules, see
[development setup](docs/development-setup.md).
The local install and no-upload boundary is described in
[local patch packaging](docs/workshop-publishing.md).
The current local download comparison is tracked in
[Workshop inventory](docs/workshop-inventory.md).
Deferred follow-up work is recorded in
[future improvements](docs/future-improvements.md).
Review the generated [high-level decision frontier](reports/current-intended/decision-frontier.md).
Exhaustive source evidence is in the profile's `deep-frontier.md`.
