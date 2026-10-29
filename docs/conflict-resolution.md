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

Country-system analysis classifies source files before creating decisions.
Read-only observers such as UI hints, dynamic localization, scripted values,
and scripted triggers are separated from active gameplay files. Generated
historical-fragment lookup tables are classified as reference data. Observer or
reference-data overlap remains visible in the deep report as a non-conflict
observation. Active gameplay involving the same countries is retained as a
non-blocking interaction risk because shared country scope alone does not prove
incompatibility. Only concrete collisions in paths, definitions, events,
localization, or shared state enter the decision frontier and block builds.

The generated `integration/decision-frontier.md` groups unresolved findings by
package set and gameplay domain so system-level preservation choices can be
made without reviewing hundreds of individual entries first. The generated
`integration/deep-frontier.md` retains every numbered finding, fingerprint, and
source link. A high-level vote authorizes implementation work but does not
automatically resolve its underlying findings: each merge or coexistence result
must still be verified and recorded by fingerprint.

For customizable-localization collisions, the decision report parses each
conditional text rule and compares localization keys and normalized trigger
bodies across packages. It summarizes mod-specific keys, plain-English title
themes, changed shared-rule counts, relevant state variables, and concise
source-declared intent. This distinguishes mostly independent additions from
the smaller set of shared rules that require an actual semantic merge. Exact
source files remain linked for deeper inspection rather than duplicating the
full technical comparison in the decision report.

For colliding scripted definitions, analysis records each package's important
entry/end conditions, balance values, event calls, variable writes, and direct
country outcomes. It follows package-local event and scripted-effect
dependencies up to four levels to surface downstream country creation,
release, annexation, destruction, or tag changes. Decision cards compare those
outcomes explicitly and disclose when a chain leaves package-local evidence or
uses an unrecognized engine command, rather than presenting an incomplete
result as safe. Source-declared behavior is also checked against active code;
for example, a claimed disabled system with a commented-out guard is reported
as still active.

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
