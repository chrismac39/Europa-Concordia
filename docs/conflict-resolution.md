# Conflict resolution

## Current behavior

The build walks enabled package source directories in sorted package-ID order.
Every regular file is considered for output. A duplicate relative path fails
the build, including differences in path casing; no package silently wins.
Symbolic links are rejected. The machine-readable default is recorded in
`config/conflict-rules.json`.

The initial tool detects path collisions only. It does not identify two files
that define the same EU5 object under different paths, nor does it merge or
interpret game scripting.

## Recording decisions

Keep integration decisions outside imported sources in
`integration/decisions/`. Each decision should identify:

- affected package IDs and pinned source versions;
- conflicting paths or definitions;
- the chosen behavior and reason;
- any files added under `integration/patches/` or
  `integration/overrides/`;
- attribution or redistribution constraints.

Do not resolve conflicts by relying on arbitrary traversal or last-writer-wins
ordering. Future definition-level detection should report unresolved conflicts
and fail validation by default.
