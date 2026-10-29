# Package management

## Manifest schema, version 1

`config/packages.json` is a JSON object with `version: 1` and a `packages`
array. Each entry has:

| Field               | Type                                    | Meaning                                                              |
| ------------------- | --------------------------------------- | -------------------------------------------------------------------- |
| `id`                | string                                  | Unique lowercase ID using letters, digits, and hyphens               |
| `name`              | string                                  | Display name                                                         |
| `type`              | `upstream`, `maintained`, or `original` | Package category                                                     |
| `source`            | object                                  | Source kind, immutable pin where applicable, and local snapshot path |
| `author`            | string                                  | Original author or first-party author                                |
| `targetGameVersion` | string                                  | Intended EU5 compatibility version                                   |
| `version`           | semver string                           | Europa Concordia package version                                     |
| `enabled`           | boolean                                 | Whether the package participates in validation/build                 |
| `dependencies`      | string array                            | IDs of required packages                                             |
| `attribution`       | object                                  | Required `license` and optional `notice`                             |

Source forms:

- Git: `{ "type": "git", "url": "...", "revision": "<full commit hash>", "path": "..." }`
- Workshop: `{ "type": "steam-workshop", "workshopId": "...", "snapshotChecksum": "sha256:<64 hex characters>", "path": "..." }`
- Local: `{ "type": "local", "path": "..." }`

Git and Workshop source paths point to local snapshots used by the build. The
manifest identifies how those snapshots were obtained; the initial tool does
not download or update them. Paths must be relative to the repository root.

An empty `packages` array is valid. Do not invent compatibility versions,
licenses, author details, or source pins to make an imported package fit.

## Keeping source and compatibility work separate

Treat upstream source snapshots as immutable. For a maintained package:

1. Keep the original snapshot at the declared `source.path`.
2. Record compatibility edits as files under
   `integration/patches/<package-id>/` or
   `integration/overrides/<package-id>/`.
3. Explain intent, upstream pin, game version, and tradeoffs in
   `integration/decisions/<package-id>.md`.

The current build does not apply patches or overrides; these locations define
the maintenance convention until that stage is implemented.

## Onboarding a real package

1. Check the upstream license and whether redistribution of its files is
   permitted. Keep local-only imports in ignored `sources/steam-workshop/`
   storage when redistribution is not allowed.
2. Store or check out a pinned source snapshot; do not build from a floating
   branch or a mutable Workshop directory.
3. Add a complete manifest entry, including package type, author, target game
   version, package version, dependencies, and attribution.
4. For a maintained package, leave its snapshot untouched and describe each
   local fix in a patch/override and decision record.
5. Run `npm run validate`, `npm test`, and `npm run build`. Review the generated
   output and resolve every file-path collision deliberately.
6. Verify EU5-specific metadata and directory structure against the game before
   describing the result as installable.

Do not commit private imports, generated output, or temporary downloads by
accident. The repository ignore rules exclude Workshop import storage and
build artifacts by default.
