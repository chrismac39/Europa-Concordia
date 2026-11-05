# RGO Harmony Expanded: Fruits Expanded compatibility design

## Status

Source examination is complete. The general map-value precedence rule is
approved, with Harmony's generic `fruit` results separated for FE-specific
replacement review. The all-three-different rows and other listed issues
remain pending review. No Expanded profile, compatibility payload, or build
output has been created.

The location-by-location evidence is in the
[RGO Harmony Expanded inventory](./RGO-Harmony-Expanded-Inventory.md). The
baseline is the existing
[RGO Harmony design](./RGO-Harmony-Design.md) and its
[source inventory](./RGO-Harmony-Inventory.md).

## Objective

Examine the existing RGO Harmony combination of Just Goods, More Locations,
and Global Historical RGOs with Fruits Expanded and its
Fruits Expanded–Just Goods compatibility patch. Identify source-file
collisions, location-level RGO differences, and scripted Just Goods setters
that can supersede map-template values. Use the existing Harmony map as the
baseline; do not make a new profile or compatibility patch until the
location decisions are reviewed.

## Pinned examination inputs

The base Harmony profile targets EU5 1.4.5 and orders More Locations, Global
Historical RGOs, and Just Goods before its Harmony patch. The examination
uses the local pinned snapshots in `config/packages.json`:

| Input                                            | Workshop item | Version used                                  | Snapshot checksum                                                         |
| ------------------------------------------------ | ------------: | --------------------------------------------- | ------------------------------------------------------------------------- |
| More Locations                                   |    3809335454 | 2.10.2026                                     | `sha256:9de6bd4c0b67d62a5c98b580020cdfb16a314835201fb3618a39893d2a684ddd` |
| Global Historical RGOs                           |    3602513956 | 1.4.0                                         | `sha256:b667dcc690475254963b8b874fe1c73cc9ae847ae2d350bf8fe378254b7b737b` |
| Just Goods                                       |    3785316314 | 1.0.0                                         | `sha256:713bad18afeeb13fd63c8ff2b2f6b064edff988726d6b9a124e1f8d1e695eada` |
| Fruits Expanded                                  |    3821883489 | descriptor 0.5.9.2; Workshop title says 1.4.1 | `sha256:38b16175a6abdfe28ec319cd0845af532c5011026b8f7a48018683f5ff96a7c0` |
| Fruits Expanded × Just Goods Compatibility Patch |    3828715234 | descriptor 1.0.0                              | `sha256:8d1cdf0732cccedf4390b1abbe69ca84eb1fb1da0ac721d13e0f7044d3f44041` |

The Fruits Expanded package catalog version is normalized to three numeric
components (`0.5.9`) because that is the repository's version format; its
source descriptor's full version (`0.5.9.2`) remains recorded above. The
Workshop source snapshots are examination inputs, not distributable payloads.

## Source-level findings

1. **Fruits Expanded supplies a complete `location_templates.txt`, not a
   small additive RGO patch.** Its 28,573 location definitions have 20,929
   explicit raw-material values. The existing Harmony map has 32,122
   definitions. It contains 3,591 locations absent from the Fruits Expanded
   file (3,586 with an RGO) and six shared locations with an RGO assignment
   that Fruits Expanded omits. A wholesale file replacement would therefore
   discard 3,592 Harmony RGO assignments. The existing split audit already
   enumerates the 3,591 Harmony-only location IDs.
2. **There are 2,175 shared locations where both files assign different
   RGOs.** Of the 1,159 locations where Fruits Expanded equals Vanilla,
   1,088 have a non-`fruit` Harmony value and keep Harmony; 71 have Harmony's
   generic `fruit` value and are separated for FE-specific replacement
   review. The rule assigns 949 locations to Fruits Expanded where Harmony
   equals Vanilla. The remaining 67 locations have three pairwise different
   RGO values and are also separated for review. Six more shared locations
   have a Harmony RGO that Fruits Expanded omits. In addition, the Fruits
   Expanded file has 42 definitions not in the Harmony map; none has an
   explicit `raw_material`.
3. **The compatibility patch replaces seven Just Goods spice scripted
   effects.** Relative to Just Goods, it removes 15 fixed-location setters
   and keeps the remaining setters. Fourteen removed setters yield locations
   assigned a Fruits Expanded good; the fifteenth yields a location assigned
   generic `fruit`. The inventory lists every removal.
4. **Fifteen retained Just Goods setters target locations whose
   Fruits Expanded map value differs from the Harmony map.** Thirteen target
   a Fruits Expanded good; two target generic-fruit locations (`burica` and
   `xicotepec`). These effects use a Just Goods good, so the intended
   runtime result needs an explicit decision rather than assuming the map
   value wins.
5. **The compatibility patch has two duplicate-location cases.** It assigns
   `nutmeg` to `banda_island` twice, and assigns both `cinnamon` and
   `turmeric` to `chan_bo` in separate effects. Runtime resolution for the
   latter is not established by this static examination.

See the inventory for the exact location IDs, source line numbers, values,
and effect-file references. The source analysis does not prove EU5 runtime
ordering or replace an in-game check.

## Approved map-value precedence

For a shared location with different explicit RGO values:

1. If Fruits Expanded equals Vanilla and Harmony differs, use Harmony,
   except where Harmony's value is generic `fruit`; review those locations
   for an FE-specific replacement.
2. If Harmony equals Vanilla and Fruits Expanded differs, use the
   Fruits Expanded definition.
3. If all three values differ, keep the location in the separate review
   table; no winner is approved yet.

The inventory applies these rules to 1,088 Harmony rows and 949
Fruits Expanded rows. It separates 71 Harmony-`fruit` rows for FE-specific
replacement review, 67 all-three-different rows, and the six locations where
Fruits Expanded omits a Harmony RGO. This decision covers static
map-template values only; it does not resolve Just Goods startup effects.

A location-focused web-research pass is recorded in the 71-row inventory
table. It prioritizes evidence for the named location around 1337, labels
regional or later evidence as tentative, and does not approve any proposed FE
value automatically.

## Remaining review before implementation

- Review and decide the 67 locations where the Fruits Expanded, Harmony, and
  Vanilla RGOs are all different.
- Review the web-research proposals for the 71 Harmony `fruit` locations and
  choose appropriate Fruits Expanded fruit goods where warranted.
- Decide how to handle the six shared Harmony RGO assignments omitted by
  Fruits Expanded and whether to preserve all 3,591 Harmony-only More
  Locations entries.
- Confirm whether the 15 Just Goods setters removed by the existing
  compatibility patch should remain removed, and resolve the 15 retained
  Just-Goods-versus-Fruits-Expanded overlaps.
- Decide how to handle the two duplicate setter cases, especially the
  competing `chan_bo` assignments.
- Decide whether the 42 Fruits Expanded-only, no-RGO definitions belong in
  the Expanded map output.

No RGO values have been changed in a compatibility payload; implementation
remains pending these reviews.
