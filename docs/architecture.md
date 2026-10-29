# Architecture

## Goals and boundaries

Europa Concordia is a maintained, all-in-one EU5 mod assembled from pinned
third-party sources and first-party packages. Its build tooling is intended to
make inputs, integration choices, and output reproducible and reviewable.
It is not a general-purpose mod manager, game engine, or web application.

The initial implementation separates:

1. **Source acquisition** — obtaining or refreshing a Git checkout or immutable
   Workshop snapshot (future work).
2. **Validation** — checking manifest shape, package dependencies, source
   directories, and source-file safety.
3. **Integration** — applying explicitly documented patches and overrides
   (future work).
4. **Packaging** — assembling files deterministically and emitting build
   metadata.
5. **Publishing** — explicitly uploading a verified release artifact to the
   stable Steam Workshop item (future work).

The current CLI implements validation and local file assembly only. It rejects
duplicate paths rather than selecting a last writer. It does not parse EU5
definitions, apply patches, or claim that the output layout is installable by
EU5; that requires verification against actual game mod requirements.

Publishing will remain a separate operation from build, validation, and
packaging. It must not be triggered by Git activity, a successful build, or a
version change. See [Workshop publishing](workshop-publishing.md) for the
release gates, authentication boundary, and unimplemented configuration.

## Package categories

- **Upstream**: actively maintained external sources.
- **Maintained**: third-party source snapshots requiring local compatibility
  maintenance. The snapshot is not edited in place.
- **Original**: first-party content maintained directly in this repository.

All package metadata is stored in `config/packages.json`; package source
directories and integration decisions remain separate. Packages are assembled
in ascending package-ID order. The order is deterministic but is not a conflict
resolution policy: duplicate output paths fail the build.

The default project-wide EU5 target is stored as `targetGameVersion` in
`config/build.json`. Validation and builds can override it with
`--target-game-version MAJOR.MINOR.PATCH`. Every enabled package must declare
the effective target game version; packages for another game version are
rejected during validation.

## Reproducibility and generated files

Git sources require a full commit hash, and Workshop sources require an
immutable local snapshot plus a SHA-256 checksum. The current CLI validates
these pins as metadata but does not fetch sources or recompute Workshop
checksums. Source paths must resolve inside the repository and cannot contain
symbolic links. Build output is generated under `dist/` and is not versioned.

`build-metadata.json` records the target EU5 version and the enabled package
IDs, versions, and source types. Build reports and semantic conflict detection
are future extensions.

## Future decisions

Before publishing a real build, confirm the expected EU5 mod directory layout,
manifest requirements, and distribution restrictions for every imported
package. Keep any implementation of source acquisition, patch application,
and definition-level conflict checks in separate pipeline stages.
