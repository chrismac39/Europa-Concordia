# Decision votes

This is the single record of user-approved directions for the integration.
Votes authorize future implementation work; they do not themselves merge files
or resolve the underlying findings. All votes below were recorded on
2026-10-29. Implementation remains pending unless a section says otherwise.

## Vote register

| Decision | Vote | Selected direction                            |
| -------: | :--: | --------------------------------------------- |
|        1 |  E   | Synthesize a Concordia merge                  |
|        2 |  D   | Synthesize a Concordia merge                  |
|        3 |  A   | Use Oikoumenē as the base                     |
|        4 |  C   | Synthesize a Concordia merge                  |
|        5 |  C   | Synthesize a Concordia merge                  |
|        6 |  C   | Synthesize a Concordia merge                  |
|        7 |  C   | Synthesize a Concordia merge                  |
|        8 |  C   | Use National Destinies as the base            |
|        9 |  C   | Use National Destinies as the base            |
|       10 |  C   | Synthesize a Concordia merge                  |
|       11 |  C   | Synthesize a Concordia merge                  |
|       12 |  A   | Merge every compatible hook                   |
|       13 |  A   | Merge every compatible hook                   |
|       14 |  A   | Merge every compatible hook                   |
|       15 |  A   | Merge every compatible hook                   |
|       16 |  A   | Merge every compatible hook                   |
|       17 |  A   | Merge every compatible hook                   |
|       18 |  A   | Merge every compatible hook                   |
|       19 |  A   | Use Gathering the Land of the Rus as the base |
|       20 |  A   | Merge every compatible hook                   |
|       21 |  C   | Synthesize a Concordia merge                  |
|       22 |  A   | Merge every compatible hook                   |
|       23 |  A   | Merge every compatible hook                   |
|       24 |  A   | Merge every compatible hook                   |
|       25 |  C   | Synthesize a Concordia merge                  |
|       26 |  A   | Merge every compatible hook                   |
|       27 |  A   | Merge every compatible hook                   |
|       28 |  A   | Merge every compatible hook                   |
|       29 |  D   | Curate by language or key family              |
|       30 |  C   | Curate by language or key family              |
|       31 |  B   | Prefer Oikoumenē's shared text                |
|       32 |  B   | Prefer Oikoumenē's shared text                |
|       33 |  A   | Prefer More locations Mod's shared text       |
|       34 |  A   | Use Oikoumenē as the base                     |
|       35 |  C   | Synthesize a Concordia merge                  |
|       36 |  B   | Use Sulphur's Rivers Expanded as the base     |
|       37 |  G   | Synthesize a Concordia merge                  |
|       38 |  A   | Use SOL-JTG Compatibility Submod as the base  |
|       39 |  C   | Synthesize a Concordia merge                  |
|       40 |  C   | Synthesize a Concordia merge                  |
|       41 |  A   | Use SOL-JTG Compatibility Submod as the base  |

### Clarification to Decisions 38 and 41 — SoL / Just Goods

The user clarified that both Standard of Living and Just Goods remain separate
active playset mods. Concordia subsumes the compatibility behavior into
Concordia-authored patch files; the separate SOL-JTG compatibility mod is a
behavioral reference only and must not be required by this profile. This
clarification supersedes the literal “use as the base” interpretation without
rewriting the historical votes.

The implementation follows the pinned reference's demand scaling,
market-accounting, and UI behavior while preserving SoL's existing content.
Where the reference README says slave demand is unchanged but its data cancels
native Just Goods slave demand, the user chose the implementation behavior:
cancel it for the covered goods.

### Current SoL / Just Goods / CMF integration

The current profile applies the compatible-hook votes after verifying EU5's
native on-action behavior: same-named on-action definitions contributed from
different files accumulate their registrations. The SoL and Just Goods
callbacks remain separate from CMF's dispatchers; Concordia does not copy an
upstream on-action file to combine them. The MRC same-path replacement still
removes MRC's CMM registration/callback hooks and retains its historical
defaults.

The shared `cmf_log_count` is treated as CMF-owned log state with SoL as an
additional producer. SoL uses CMF's `_cmf_log_select_key`, the same log maps,
the same 200-entry limit, and increments the shared counter once per entry.
This is the intended shared log contract, not competing state ownership.

## Global implementation constraint: one coherent implementation per system

Across the integration—not only for the Golden Horde (GLH)—do not leave
multiple mods independently firing competing implementations of the same
gameplay system. Treat the upstream implementations as evidence about desired
behavior, then build one coherent Concordia-owned flow for each genuinely
shared, competing system. Adapt or disable duplicate triggers and event chains
so the same lifecycle or outcome is not executed multiple times.

This does not mean every hook must be collapsed into one callback. Preserve
independent, additive behavior when it is compatible. Before combining hooks,
check whether they invoke the same underlying system, duplicate state changes,
depend on ordering, or conflict over shared state. The general votes to merge
compatible hooks (including Decisions 12-18 and 20-28) mean preserve
non-conflicting behavior; they do not authorize duplicate execution of one
system.

For each system with competing interpretations, identify and present
meaningful differences—such as activation conditions, timing and ordering,
state mutations, downstream events, and resulting countries or territories.
Preserve compatible features where possible, but do not silently combine
contradictory outcomes or choose among them without the user's direction.
Verify that each intended system outcome runs once.

**GLH collapse is one example of this rule:** use one canonical collapse
sequence, not parallel mod-specific collapse paths. Review its successor
countries, land distribution, timing relative to the engine's regional
shatter, and other outcomes before implementation. Other horde-related systems,
such as a civil-war disaster, are distinct unless evidence shows they belong to
the same lifecycle.

## Decision 1 — Dynamic names and languages

**Scope:** `country_ranks.txt` from Gathering the Land of the Rus, Historical
Tweaks, Imperial Ambitions, and The Prussian Destiny.

**Implementation direction:** Keep the common rules once, preserve compatible
package-specific additions from all four mods, and reconcile the nine shared
rules with differing triggers as a Concordia-owned merge. Do not drop a package
or remove its unique rank/title rules. This content is display-only; it does
not create successor countries or otherwise mutate gameplay state.

## Decision 2 — Dynamic names and languages

**Scope:** `country_name_construction.txt` from Historical Tweaks, Imperial
Ambitions, and The Prussian Destiny.

**Implementation direction:** Retain the common rules once, preserve compatible
package-specific additions, and reconcile the four shared rules with differing
triggers in a Concordia-owned merge.

## Decision 36 — Map and 1337 setup

**Scope:** `in_game/map_data/rivers.png` from Sulphur's Rivers Expanded, in
conflict with the More locations Mod copy.

**Implementation direction:** Use Sulphur's river layer as the starting point.
Review its alignment with the map and location geometry selected for Concordia;
the vote does not decide whether the river image needs editing.

## Implementation status

Decisions 1 and 2 have been implemented as Concordia-owned complete-file
overrides under `integration/overrides/dynamic-names/`. The SoL/Just Goods
clarification above is implemented as profile-specific Concordia compatibility
files under `integration/patches/` and `integration/overrides/`. Decision 3 is
implemented by selecting Oikoumenē's complete files for its seven language
path collisions. Decision 36 selects Sulphur's Rivers Expanded raster for the
shared river-map path. The source snapshots remain unchanged. The dynamic-name
trigger variants use the user-confirmed union policy. Exact file-path
resolutions are recorded in `config/conflict-rules.json`, with details in
`integration/decisions/dynamic-names.md`,
`integration/decisions/oikoumene-language-base.md`, and
`integration/decisions/sulphur-rivers.md`.

The current-intended analysis reports 48 findings and no unresolved decisions
for this pinned profile. This is static approval, not proof of runtime
compatibility; the selected playset still needs in-game testing.

Dynastic Bloodlines (`3790115532`, version `0.9.39`) is selected as a separate
Workshop mod. Permission to redistribute the upstream files and maintained
compatibility work was confirmed. Its metadata declares EU5 `1.3.*`; PdxL and
the static analyzer report no blocking errors for the `1.4.5` profile, but
runtime compatibility remains unverified. Its game-start callback is retained
through a content-pinned native-merge decision. The upstream marriage
predictions and bloodline-emblem UI remain in that separate mod; Concordia
does not duplicate those GUI files. The header's `Character.ShowsStats`
visibility difference versus the installed game UI is an accepted known issue
pending upstream or runtime confirmation.

## Current Glorp UI / GH Exchequer integration

Glorp UI, GH Exchequer, Construction Manager, and Autonomous Diplomats remain
separate selected mods. Concordia generates the GH Trade-tab integration from
the pinned Glorp UI source; the upstream GH/Glorp compatibility mod is
reference-only and excluded from the playset. Concordia also generates focused
Construction Manager UI fixes from pinned Glorp UI and Standard of Living
sources so the existing-building auto-expand, unbuilt-building, food-RGO, and
RGO auto-expand controls survive those full-file GUI replacements. The
generated production view also hides the competing vanilla auto-expand
control while Construction Manager is active.

SmartTaxes is intentionally excluded due to its known performance issues even
though Glorp UI declares it as a dependency. This accepted omission is a
launcher/runtime risk, not an assertion that Glorp UI works without it.
Autonomous Diplomats remains selected at the user's direction despite its
pinned metadata declaring only EU5 `1.3.*` support. Its compatibility with
EU5 `1.4.5` is unverified.

The profile loads Autonomous Diplomats before Construction Manager to retain
the latter's create-playset UI alongside the shared CMF dependency workflow.
Glorp UI follows both, Standard of Living follows Glorp UI, GH Exchequer
follows the UI mods, and Concordia loads last. These choices and the
source-fingerprinted conflict rules are implemented. The user reports the
playset runs and its other functionality works, but inactive Glorp left-panel
colors are missing only with Concordia's generated patch; replacing it with
the standalone GH/Glorp patch in the same playset restores them. See
[the GH/Glorp decision record](decisions/gh-exchequer-glorp-ui.md) for the
known issue and comparison evidence.
