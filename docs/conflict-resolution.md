# Conflict resolution

## What the analyzer does

`npm run analyze -- --profile <id>` scans only the profile's selected source
snapshots. It reports exact path collisions, cross-file EU5 definitions and
`REPLACE:`/`INJECT:` targets, event and on-action IDs, differing localization,
shared global variables, and country-system interactions. The analyzer is
conservative static evidence, not proof of runtime compatibility.

Reports are written to `reports/<profile-id>/`:

- `decision-frontier.md` groups unresolved findings by package set and domain;
- `deep-frontier.md` retains every finding, fingerprint, and source link;
- `conflicts.json` contains machine-readable evidence.

Use the profile-aware diff command to inspect numbered source conflicts:

```sh
npm run diff -- --profile current-intended 1
```

## Resolution classes

Every file-path decision must be explicit:

| Class          | Meaning                                                                                                                                                                        | Build behavior                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `load-order`   | EU5's exact-path replacement is acceptable and the chosen mod is last among participants. The decision pins each source file's SHA-256.                                        | Build proceeds only when the profile order and hashes match.  |
| `merged-patch` | A Concordia-authored patch intentionally preserves or combines needed behavior. A profile lists its source file, output path, target mod, and preservation/suppression checks. | Build emits only that patch file, never either upstream copy. |
| `native-merge` | EU5 natively combines compatible definitions from different files; a content-pinned decision records why the contributions coexist without a Concordia replacement.            | Build proceeds only while the source fingerprint matches.     |
| `shared-state` | Packages intentionally use one shared state contract; a content-pinned decision records its owner and verified writers/readers.                                                | Build proceeds only while the source fingerprint matches.     |
| `incompatible` | The combination is known not to be safe.                                                                                                                                       | Finding stays blocking.                                       |
| Unresolved     | No current decision applies, the participants changed, or a required content fingerprint is stale.                                                                             | Build stops for review.                                       |

Profile patch entries declare `add` or `replace` (`replace` is the backward
compatible default). An `add` target must not already exist in any selected
mod; a `replace` target must exist in the declared target package. This lets
Concordia add new database-entry injections and script values without copying
or replacing an upstream file.

EU5's [mod structure documentation](https://eu5.paradoxwikis.com/Mod_structure)
describes same-path files as complete replacements, not text merges; an empty
replacement also wins. `REPLACE:` and `INJECT:` operate at the database-entry
level and cannot be used in `common/on_action`. The [EU5 on-action
documentation](https://eu5.paradoxwikis.com/On_action) describes how
same-named on-action definitions in different files are natively merged;
their callbacks do not require a synthetic whole-file replacement. Same-path
files still replace earlier files in full. Never create a whole-file
replacement from one upstream winner merely to clear a collision. If a
replacement is required, review its full contents and list the important
retained and suppressed definitions in the profile.

The starter profile contains a load-order decision for the shared
`in_game/map_data/rivers.png` path: More locations loads before Sulphur's Rivers
Expanded, whose selected raster is the intended winner. The input file hashes
are recorded so an upstream update requires a fresh decision.

The MRC patch replaces only MRC's `MRC_cmm_on_actions.txt`. Because EU5 does
not support database-entry injection for on-actions, it retains MRC's
`on_game_start` and `on_game_load` hooks and `MRC_init_safe_defaults`, while
excluding the CMF registration and CMM callback hooks. It does not expose
MRC's settings. Its defaults and gameplay still require an in-game check.

The current SoL/Just Goods profile keeps both upstream mods active and excludes
the separate SOL-JTG compatibility mod. Concordia's SoL/JTG GUI files are full
merged replacements: they preserve the complete SoL panel/tooltip content and
add Just Goods rows because EU5 does not merge same-path GUI text. Its three
`REPLACE:` scripted-effect definitions retain SoL's hardcoded goods accounting
and extend those enumerations; the `INJECT:` goods definitions and added script
values leave the upstream packages' other content in place. The compatibility
source snapshot is a reference, not a playset dependency.

## Approval freshness

Finding fingerprints contain the profile ID and the hashes of all source files
that contributed to the finding. Semantic approvals must match the complete
fingerprint. Path decisions additionally store hashes for each conflicting
file and the intended last-loaded package. A mod version, Workshop ID, source
pin, source file, or playset change must be reviewed through a new analysis;
stale approvals do not fall back to package order.

Country-system analysis keeps read-only observers and historical lookup data
visible as non-conflict observations. Shared active country scope is reported
as a non-blocking runtime interaction risk unless the analyzer finds concrete
path, definition, event, localization, or state collisions. This avoids
treating every shared country tag as a blocker while retaining the evidence
for playtesting.
