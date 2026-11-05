# Just Goods, More Locations, and Global Historical RGOs compatibility design

## Status

Implementation generated for both profiles; runtime behavior has not yet been
verified in game. The shared map-template source and corrected split-location
audit are linked below.

The filtered source-disagreement candidate set is recorded in the
[RGO source inventory](just-goods-more-locations-global-historical-rgos-inventory.md).
The full added-location audit is available as
[CSV](just-goods-more-locations-global-historical-rgos-split-audit.csv), with
the decision summary and 48 approved descendant assignments in the
[split-location summary](just-goods-more-locations-global-historical-rgos-split-audit.md).

## Objective

Define one location-by-location compatibility treatment for Just Goods, More
Locations, and Global Historical RGOs (GH RGO), then build that treatment in
two forms:

1. As part of a Concordia master patch for a larger playset.
2. As a standalone compatibility mod whose required upstream playset contains
   only Just Goods, More Locations, and GH RGO.

Both outputs must use the same compatibility decisions and shared patch
sources. The standalone output must not contain unrelated Concordia patches,
and neither output may bundle complete upstream mods. The merged map-template
payload does preserve More Locations' complete template data; package metadata
records the repository owner's confirmation of author permission for its
distribution.

## Compatibility analysis

The central artifact for this work is a complete location-level decision
matrix, not a blanket rule that one RGO mod always wins. More Locations changes
the map's location granularity: it can split a vanilla location into multiple
locations and duplicate the vanilla RGO onto those new locations. A vanilla
location's assignment therefore cannot automatically be copied to every
descendant without checking the new geography and intended distribution.

Use the pinned source snapshots of all three mods and the matching vanilla
location data. Keep snapshots immutable. Record source paths and fingerprints
for evidence used in any generated or authored patch.

### Analysis sequence

1. **Inventory RGO definitions.** Record the relevant vanilla, GH RGO, Just
   Goods, and More Locations assignments and the source files that define
   them.
2. **Resolve existing GH RGO / Just Goods conflicts.** For each location
   where both mods define or alter an RGO, record the intended result and why.
   Do not assume one mod is the universal winner.
3. **Map More Locations lineage.** For each affected vanilla location, identify
   every More Locations location created from it, including locations whose
   vanilla RGO was duplicated.
4. **Carry resolved decisions across splits.** Review each descendant
   separately. Retain, redistribute, replace, or suppress the inherited
   assignment based on the split location's geography and design intent.
5. **Audit all other split and added locations.** This includes locations
   without an initial GH RGO / Just Goods conflict. Determine whether either
   mod's RGO belongs there and whether a duplicated vanilla assignment should
   remain.
6. **Classify every reviewed location.** The matrix must distinguish a
   deliberate no-change/no-RGO result from an unreviewed location. Any
   unresolved location blocks implementation and release.

### Working precedence hypothesis

For both the standalone and Concordia outputs, Use Global Historical RGOs over More Locations for the 1,269 fixed-location
disagreements without a Just Goods setter conflict. The
[filtered inventory](just-goods-more-locations-global-historical-rgos-inventory.md)
records two Just Goods exceptions: preserve its effects on all 723 fixed
setter locations, and let Just Goods take precedence over both map values in
the 50 three-way disagreements. The split audit adds Global Historical RGO
values to 48 single-parent descendants only when More Locations duplicated the
parent's Vanilla RGO and Global Historical RGOs changed that parent. Keep More
Locations' RGO values for mixed-parent locations and all other descendants.
Do not clone fixed-location Just Goods setters to split descendants.

Suggested matrix fields:

| Field | Purpose |
|---|---|
| More Locations location ID | The location whose final RGO behavior is being decided |
| Vanilla origin | Vanilla location ID, or `new` if it has no direct vanilla counterpart |
| Split/lineage evidence | How the location relates to its vanilla origin |
| Vanilla RGO | Baseline assignment |
| GH RGO assignment | Assignment or modification from GH RGO |
| Just Goods assignment | Assignment or modification from Just Goods |
| More Locations assignment | Assignment, including a duplicated vanilla RGO |
| Intended result | Exact final RGO behavior |
| Disposition and rationale | Retain, redistribute, replace, suppress, add, or intentionally none; explain why |
| Evidence | Pinned source paths and relevant location data |

Use explicit dispositions rather than implicit omissions. Possible outcomes
include retaining an assignment, distributing an assignment among split
locations, replacing an inherited duplicate, suppressing a duplicate,
introducing a RGO on a newly added location, and intentionally leaving a
location without these mods' RGO changes.

## Patch implementation principles

- Implement only the changes required by the approved matrix.
- Preserve unrelated definitions and behavior from the three upstream mods.
- Prefer narrowly scoped location entries or database-entry injections when
  EU5's data model supports them. If a whole-file replacement is necessary,
  preserve and validate the complete required content.
- Do not resolve locations through a global precedence rule or file/load
  order alone where the intended result is location-specific.
- Keep upstream source snapshots as analysis inputs; generated outputs contain
  the declared compatibility payload and normal launcher metadata. The
  complete map-template patch intentionally preserves More Locations' full
  template data; package metadata records the repository owner's confirmation
  of author permission for distributing this compatibility patch.
- Validate that every matrix row has a corresponding intended result and that
  no affected location is silently omitted.

## Repository organization and two outputs

Use one shared patch source directory and profile-based packaging:

```text
integration/
  decisions/
    just-goods-more-locations-global-historical-rgos-design.md
  patches/
    just-goods-more-locations-global-historical-rgos/
      <shared compatibility payload, grouped by EU5 game path>
profiles/
  current-intended.json
  just-goods-more-locations-global-historical-rgos-standalone.json
dist/
  europa-concordia/
    <master-profile-id>/
    just-goods-more-locations-global-historical-rgos-standalone/
```

The exact profile IDs and output files should follow the existing profile
schema and build tooling. Each profile lists the shared patch source files it
needs; do not make a second copy of the patch under a standalone-specific
source directory.

### Concordia master output

Add the shared patch entries to the applicable Concordia master profile. That
profile must select and pin all three upstream mods so analysis and validation
run against the same combination the patch is intended to support. Keep the
master patch's existing profile identity, output name, and unrelated patches.

The `current-intended` profile selects and pins all three upstream mods and
includes the shared patch entry. It loads More Locations early as the map
base, followed by Global Historical RGOs and Just Goods; Just Goods remains
before Standard of Living. The Concordia patch loads last and supplies the
final merged map-template file, based on More Locations and incorporating the
approved Global Historical RGO values. The standalone profile uses the same
three-mod ordering.

### Standalone output

The dedicated
[standalone profile](../../profiles/just-goods-more-locations-global-historical-rgos-standalone.json)
selects only the three required upstream mods, their pinned source revisions,
in More Locations → Global Historical RGOs → Just Goods order, followed by the
standalone compatibility mod. Its
`patches` list contains only the shared RGO compatibility entry. Its
`patchMod` uses a distinct display name and mod ID so it can be enabled
independently from the Concordia master patch.

The build already separates artifacts by profile under
`dist/europa-concordia/<profile-id>/`; use a unique standalone profile ID and
mod ID rather than changing the shared output root or hand-copying files.
Building the master profile cannot add its unrelated patches to the
standalone profile because each profile declares its own patch list.

This keeps a single repository and a single source of truth while making the
two launchable mods and their build outputs distinct. Any future publishing or
archive step should package the standalone profile's generated directory only.

## Validation and release gates

Before either profile is released:

- Confirm all three input snapshots and versions remain pinned and current.
- The source conflict groups and all 3,591 new map IDs plus six existing
  locations receiving More Locations RGO assignments are audited in the
  inventory and split-audit files.
- Confirm duplicated vanilla RGOs do not create unintended duplicate
  production and that intended assignments are not lost.
- Run profile analysis, validation, tests, and builds for both profiles.
- Inspect both generated directories: the standalone output must contain only
  the RGO compatibility payload and its metadata; the master output must
  contain that payload plus only its own declared Concordia patches.
- Test the combined mods in game, including locations affected by splits and
  locations added by More Locations.
- Retain the written author permissions referenced in package metadata. Do not
  include unrelated upstream mod files in either output.

The release is not ready until both profiles pass validation and in-game
behavior for the final location distribution and Just Goods' dynamic effects
has been checked.
