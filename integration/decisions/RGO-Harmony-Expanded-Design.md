# RGO Harmony Expanded: Fruits Expanded compatibility design

## Status

The separate RGO Harmony Expanded profile and map payload are implemented.
They change the 949 approved shared RGO values where Harmony matches Vanilla
and Fruits Expanded differs, plus all 67 approved three-way differences by
using Fruits Expanded's value. They also apply the user-approved choices for
all 71 Harmony-`fruit` locations: 68 selected RGO values and three retained
`fruit` map values where Just Goods assigns sulfur at startup. The base RGO
Harmony profile and patch remain unchanged.

The six RGO values omitted by Fruits Expanded are explicitly approved to
retain their base Harmony values. All More Locations-only data also remains
as in base Harmony. The 42 Fruits Expanded-only definitions are not imported.

The location-by-location evidence is in the
[RGO Harmony Expanded inventory](./RGO-Harmony-Expanded-Inventory.md). The
current Just Goods 1.1 comparison is in the
[Just Goods overlap audit](./RGO-Harmony-Expanded-Just-Goods-1.1.md). The
baseline is the existing
[RGO Harmony design](./RGO-Harmony-Design.md) and its
[source inventory](./RGO-Harmony-Inventory.md).

## Objective

Examine the existing RGO Harmony combination of Just Goods, More Locations,
and Global Historical RGOs with Fruits Expanded and its
Fruits Expanded–Just Goods compatibility patch. Identify source-file
collisions, location-level RGO differences, and scripted Just Goods setters
that can supersede map-template values. Use the existing Harmony map as the
baseline. Implement the approved map decisions in a distinct profile. Use the
per-location choices for the 71 Harmony-`fruit` locations and preserve the
three Just Goods sulfur startup setters.

## Pinned examination inputs

The base Harmony profile targets EU5 1.4.5 and orders More Locations, Global
Historical RGOs, and Just Goods before its Harmony patch. The examination
uses the local pinned snapshots in `config/packages.json`:

| Input                                            | Workshop item | Version used                                  | Snapshot checksum                                                         |
| ------------------------------------------------ | ------------: | --------------------------------------------- | ------------------------------------------------------------------------- |
| More Locations                                   |    3809335454 | 2.10.2026                                     | `sha256:9de6bd4c0b67d62a5c98b580020cdfb16a314835201fb3618a39893d2a684ddd` |
| Global Historical RGOs                           |    3602513956 | 1.4.0                                         | `sha256:b667dcc690475254963b8b874fe1c73cc9ae847ae2d350bf8fe378254b7b737b` |
| Just Goods                                       |    3785316314 | 1.1.0; source metadata 1.1                    | `sha256:a22e541cb5c38820c4750e49274b81b3f7a867461a35980570e36f7edec34c1a` |
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
   generic `fruit` value and now have user-approved per-location RGO choices.
   The rule assigns 949 locations to Fruits Expanded where Harmony
   equals Vanilla. The remaining 67 locations have three pairwise different
   RGO values; the approved Expanded decision uses the Fruits Expanded value
   for all 67. Six more shared locations
   have a Harmony RGO that Fruits Expanded omits. In addition, the Fruits
   Expanded file has 42 definitions not in the Harmony map; none has an
   explicit `raw_material`.
3. **Current Just Goods 1.1 has 1,197 unique fixed-location startup RGO
   assignments.** The current setter intersections are 43 Harmony-retained,
   74 approved Fruits Expanded map updates, and three user-decided fruit rows
   that retain the generic map value because Just Goods assigns sulfur. The
   [Just Goods overlap audit](./RGO-Harmony-Expanded-Just-Goods-1.1.md)
   records each intersection and its source line.
4. **The downloaded Fruits Expanded / Just Goods compatibility patch is
   stale for Just Goods 1.1.** Its seven `TRY_REPLACE` effects omit 15 current
   Just Goods setters and restore the old `chan_bo` turmeric setter, which
   Just Goods 1.1 removed. The Expanded profile therefore does not load it;
   Just Goods 1.1 effects remain authoritative. No effect blocks are copied
   or modified.
5. **Just Goods 1.1 still has a duplicate `banda_island` setter**, twice
   assigning `nutmeg`. Its `chan_bo` startup effect now assigns only
   `cinnamon`. This source finding does not prove runtime ordering.

See the inventory for the exact location IDs, source line numbers, values,
and effect-file references. The source analysis does not prove EU5 runtime
ordering or replace an in-game check.

## Approved map-value precedence

For a shared location with different explicit RGO values:

1. If Fruits Expanded equals Vanilla and Harmony differs, use Harmony,
   except where Harmony's value is generic `fruit`; apply the per-location
   user decision recorded in the inventory.
2. If Harmony equals Vanilla and Fruits Expanded differs, use the
   Fruits Expanded definition.
3. If all three values differ, use the Fruits Expanded value. This is an
   approved decision for all 67 locations in the separate comparison table.
4. If Fruits Expanded omits a Harmony RGO, retain the Harmony base value. This
   is approved for all six locations in the omission table.

The inventory applies these rules to 1,088 Harmony rows, 949
Fruits Expanded rows where Harmony equals Vanilla, and 67 approved
Fruits Expanded values for three-way differences. The Expanded payload applies
1,016 approved Fruits Expanded values and the user's 71 per-location
decisions; 64 of those choices change the generic Harmony `fruit` value,
four select `fruit`, and three retain `fruit` alongside Just Goods' sulfur
startup assignment. It retains Harmony values at the six locations where
Fruits Expanded omits an RGO, as explicitly approved in the inventory. The 42
FE-only location definitions have no explicit RGO and are not imported. This
decision covers static map-template values only; Just Goods startup effects
remain intact.

Prior location-focused web-research suggestions remain in the 71-row
inventory table as context. They are not the source of the selected values;
the explicit user decisions in that table are authoritative.

## Remaining review

- Validate the current Just Goods startup behavior and map-result ordering in
  EU5 1.4.5 in game. Static source analysis cannot establish runtime ordering.
- Re-run the source audit if any pinned Workshop source changes. The current
  Fruits Expanded / Just Goods patch must first be reconciled with Just Goods
  1.1 before it is added to the Expanded playset.
