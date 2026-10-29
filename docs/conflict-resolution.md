# Conflict resolution

## Current behavior

The build walks enabled package source directories in sorted package-ID order.
Files under the supported EU5 content roots are considered for output. A
duplicate relative path fails the build, including differences in path casing,
unless `config/conflict-rules.json` contains an exact resolution naming the
path, every package involved, the selected package or Concordia-owned merged
override, and the reason. A resolution stops matching if another package later
joins the collision, so no new participant can silently lose. Symbolic links
are rejected.

The build reports every unresolved file-path collision found in a pass, rather
than stopping after the first, so integration work can be planned as a complete
batch.

`npm run analyze` also assigns a deterministic fingerprint to every semantic
finding. A semantic finding is resolved only when `config/conflict-rules.json`
contains a matching `semanticResolutions` entry with the user-approved decision
and reason. The analyzer never infers a semantic winner from package order.

Analysis covers exact output paths, cross-file EU5 definitions,
`REPLACE:`/`INJECT:` targets, event IDs and on-actions, differing localization,
shared global variables, and significant country-system overlap. This is
conservative static analysis, not proof of runtime compatibility; engine
ordering, scripted behavior, and save-game effects still require game testing.

The generated `integration/decision-frontier.md` groups unresolved findings by
package set and gameplay domain so system-level preservation choices can be
made without reviewing hundreds of individual entries first. The generated
`integration/deep-frontier.md` retains every numbered finding, fingerprint, and
source link. A high-level vote authorizes implementation work but does not
automatically resolve its underlying findings: each merge or coexistence result
must still be verified and recorded by fingerprint.

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
ordering. Unresolved path and semantic findings fail the build by default.
