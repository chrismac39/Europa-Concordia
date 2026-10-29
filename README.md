# Europa Concordia

Europa Concordia is a curated, maintained, all-in-one Europa Universalis V mod
project. It combines separately sourced mods and original content into one
traceable release while keeping imported source content distinct from local
compatibility work.

This repository currently provides the scaffolding and a minimal local build
pipeline. It does not yet acquire upstream sources, apply integration changes,
parse EU5 definitions, or verify the final directory against EU5's mod format.

## Requirements

- Node.js 22 or newer
- npm

## Getting started

```sh
npm install
npm run validate
npm test
npm run build
```

The default EU5 release target is configured in `config/build.json`. Override
it for a specific validation or build without editing the configuration:

```sh
npm run validate -- --target-game-version 1.4.5
npm run build -- --target-game-version 1.4.5
```

Only enabled packages declaring compatibility with the effective target are
accepted. Builds write to the ignored `dist/europa-concordia/` directory and
record the effective target in `build-metadata.json`.

## Adding a package

1. Read [package management](docs/package-management.md) and add a manifest
   entry to `config/packages.json`.
2. Keep the selected source snapshot immutable in its declared `source.path`.
   Do not add a third-party source until its redistribution terms have been
   checked.
3. Record local compatibility work under `integration/patches/` or
   `integration/overrides/`, with a decision in `integration/decisions/`.
4. Run `npm run validate`, `npm test`, and `npm run build`.

The current build only copies enabled package files, in package-ID order, and
fails on case-insensitive path collisions. Integration patches and overrides
are recorded for future build support but are not yet applied.

## Project layout

- `packages/upstream/`, `packages/maintained/`, `packages/original/`: package
  working areas
- `integration/`: separately maintained patches, overrides, and decisions
- `config/`: package, build, and conflict-policy manifests
- `scripts/`: TypeScript build and validation tooling
- `tests/`: synthetic tests; no real mod content is required
- `reports/`: reserved for generated reports
- `dist/`: generated build output

See [architecture](docs/architecture.md), [conflict resolution](docs/conflict-resolution.md),
and [legacy migration](docs/legacy-migration.md) for the initial design.
For EU5-aware editor setup and vanilla-file safety rules, see
[development setup](docs/development-setup.md).
The planned, confirmation-gated Workshop release flow is described in
[Workshop publishing](docs/workshop-publishing.md).
