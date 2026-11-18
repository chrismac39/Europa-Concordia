# RGO Harmony: Just Goods 1.4 refresh

## Status

The standalone [RGO Harmony profile](../../profiles/rgo-harmony.json) now pins
Just Goods 1.1.0 and its required Community Mod Framework dependency. The
original Just Goods 1.0 snapshot remains unchanged and is still selected by
`current-intended`. More Locations, Global Historical RGOs, the merged map
payload, and the previous map precedence decisions are unchanged.

The November 8 source comparison is retained below as historical evidence.
The November 14 update is now the selected Just Goods 1.1 source in RGO
Harmony, RGO Harmony Expanded, and RGO Synthesis. No Just Goods effects have
been copied into any map patch; its startup callbacks remain upstream.

## Examination inputs

| Input                                 |                      Version | Source identity                                                                                                    |
| ------------------------------------- | ---------------------------: | ------------------------------------------------------------------------------------------------------------------ |
| More Locations                        |                    2.10.2026 | Workshop 3809335454; `sha256:9de6bd4c0b67d62a5c98b580020cdfb16a314835201fb3618a39893d2a684ddd`                     |
| Global Historical RGOs                |                        1.4.0 | Workshop 3602513956; `sha256:b667dcc690475254963b8b874fe1c73cc9ae847ae2d350bf8fe378254b7b737b`                     |
| Just Goods, historical profile pin    | 1.0.0; metadata supports 1.3 | Workshop 3785316314; `sha256:713bad18afeeb13fd63c8ff2b2f6b064edff988726d6b9a124e1f8d1e695eada`                     |
| Just Goods, previous RGO Harmony pin  |   1.1; metadata supports 1.4 | Workshop 3785316314, updated 2026-11-08; `sha256:a22e541cb5c38820c4750e49274b81b3f7a867461a35980570e36f7edec34c1a` |
| Community Mod Framework               |                        2.5.0 | Workshop 3692202776; `sha256:d432d50a2fd81e39d35fb44d51906f95f99db90eccda8a706b0dc98d23302110`                     |
| Vanilla EU5                           |          1.4.5 local install | `location_templates.txt` SHA-256 `f2f3d80a2bb65b41b578a51cb06cc47a0f8d83b682eec8c2cce69f1add9cd59c`                |

The November 8 Workshop snapshot contains 1,028 files. Its metadata requires
Community Mod Framework version `2.*`; the standalone profile therefore
selects the pinned 2.5.0 package before Just Goods. Just Goods 1.1 contains no
`location_templates.txt`, so the map-template collision and the existing
More Locations / Global Historical RGOs merge are not changed by this source
update.

## November 14, 2026 source refresh

Steam reports the Just Goods item updated on November 14, 2026. The refreshed
local snapshot is preserved at
`sources/steam-workshop/3785316314-1.1-2026-11-14` with 1,029 files and tree
checksum `sha256:598ba086caeda8d29eeb0273aff194191fcbb9285a5a32c742cdcd282d41ff1a`.
Its metadata remains upstream version 1.1, supports EU5 1.4, and retains the
Community Mod Framework 2.* dependency.

Compared with the November 8 snapshot, Just Goods changes its Flint good
identifier to `gunflint` in the same 109 fixed startup locations. The location
set is unchanged, and the good is still localized as “Flint.” Other changes
include building, production, expedition, law, town-right, and localization
content. Just Goods still adds no `location_templates.txt`.

The existing approval to preserve Just Goods startup RGO effects therefore
continues to cover these assignments. Static analysis found no new RGO
location decision or localization collision in RGO Harmony. The changed
content fingerprints for the already-approved native on-action merges were
reviewed and re-pinned; the RGO Harmony analysis again reports zero unresolved
decisions. The expanded profile also retains the previously approved native
named-color merge; all selected Fruits Expanded and Just Goods color keys
remain distinct.

The package catalog and the three RGO profiles that select Just Goods 1.1 now
pin this snapshot. The original November 8 snapshot and the Just Goods 1.0
source remain unchanged; `current-intended` remains pinned to Just Goods 1.0.

## Fixed startup RGO delta

The old source has 713 unique fixed-location assignments in its `on_action`
startup callbacks. Just Goods 1.1 has 1,197, adding 484 locations. The
[delta CSV](RGO-Harmony-1.4-Just-Goods-Delta.csv) lists every new location,
Just Goods' assigned good, the More Locations, Global Historical RGOs, and
Vanilla map values, and the exact 1.1 source file and line.

All 484 new IDs exist in all three map inputs. At every one, the Just Goods
assignment differs from both More Locations and Global Historical RGOs. This
is a new set of direct conflicts, not an absence of map data. The existing
decision to preserve Just Goods on previously reviewed setter locations was
explicitly extended by the user to all 484 new targets. The
[delta CSV](RGO-Harmony-1.4-Just-Goods-Delta.csv) records that disposition for
every row.

The new setters are in the Brass, Gunpowder, Meat, Soap, Spices, and Stone
startup files. Their effect blocks also contain goods-specific location
modifiers and conditional village-building removal. This audit compares the
RGO assignment only; do not copy those blocks into a Concordia patch or extend
them to More Locations split descendants without separately reviewing their
side effects and lineage.

## Other RGO behavior changes

- **`chan_bo`:** Just Goods 1.0 assigns both cinnamon and turmeric in separate
  startup effects. Version 1.1 retains cinnamon and removes the competing
  turmeric setter. This resolves the old duplicate assignment in the upstream
  source.
- **`reunion`:** the 1.1 Gunpowder startup effect assigns sulfur. A separate
  Just Spices event option assigns vanilla to Reunion if selected later; its
  map-template value is fish. The user approved keeping both behaviors as
  authored: sulfur at game start, vanilla only if the later event option is
  chosen.
- **`kran`:** the 1.0 Soap event's aromatics assignment is now a Just Soap
  decision. Choosing it also costs gold, removes a farming or forest village
  when present, and adds the rose-valley modifier and cultural bonuses. It is
  not an unconditional startup assignment.
- Just Goods also contains scoped or conditional RGO changes in Meat and
  Spices events and in the Columbian Exchange generic action. They are dynamic
  gameplay behavior, not fixed startup map values, and remain outside the
  484-location delta.

## Newly surfaced profile findings

Selecting the required framework causes the analyzer to identify four
same-named on-action groups: `cmf_on_mod_registration`,
`monthly_country_pulse`, `on_game_start`, and `yearly_country_pulse`. These
contributions are in separate files and register distinct CMF / Just Goods
callbacks. The profile now records them as native merges, consistent with the
repository's established EU5 on-action behavior; no callback file is copied
or replaced.

The remaining localization collision is resolved in favor of Just Goods 1.1,
as selected by the user:

| Key              | Just Goods 1.1 | More Locations |
| ---------------- | -------------- | -------------- |
| `english:hammam` | `Hammam`       | `Hammām`       |

The current load order places Just Goods after More Locations, so its selected
value is the effective winner. The regenerated
[profile decision frontier](../../reports/rgo-harmony/decision-frontier.md)
records zero unresolved findings.

## Recorded decisions

1. Preserve all 484 new Just Goods 1.1 startup assignments.
2. Keep Reunion's sulfur startup RGO and the later vanilla event option.
3. Use Just Goods 1.1's `Hammam` localization.

No Concordia `current-intended` pins, patches, or output have been changed in
this first pass.

## EU5 1.4.9 compatibility review — 2026-11-18

The installed EU5 build is 1.4.9 (Steam build ID `26655995`). The current
vanilla `location_templates.txt` SHA-256 is
`2c1ec72fe9c7878d296d155a624b2f593f8df48b1da28a1f271219bad899d623`; the
previous 1.4.5 review recorded
`f2f3d80a2bb65b41b578a51cb06cc47a0f8d83b682eec8c2cce69f1add9cd59c`. The
historical 1.4.5 vanilla file is not retained, so this is not a line-by-line
diff of the game update.

The RGO Harmony map payload remains SHA-256
`fd899c4f82afbc4b9c6f00628319c7bb5f2062378f037cc41a4af81f8722928f`. It
contains 32,111 location-template entries. The current vanilla and Global
Historical RGOs files each contain 28,562 template IDs. Forty-two vanilla
template IDs are absent from the pinned More Locations template and its map
definitions; they are outside the selected More Locations map data and were
not added to the Harmony map patch. Every raw-material good referenced by the
Harmony map is defined in either the selected vanilla sources or pinned Just
Goods source.

The selected upstream snapshots declare EU5 support as follows: Community Mod
Framework and More Locations list `1.4.*`, Just Goods lists `1.4`, and Global
Historical RGOs lists `1.4.0`. Version-specific 1.4.9 catalog aliases record
the static review for this profile while preserving the original package pins
for other profiles. The Global Historical RGOs upstream declaration is not
changed; runtime verification remains pending.

The official 1.4.9 notes identify a gameplay fix: completing the “Settle the
Frontier” cabinet action now upgrades the settled locations' RGOs. RGO Harmony
only replaces `location_templates.txt`; it does not replace that cabinet
action, so the vanilla fix remains active. No map-payload change was indicated
by this review.

The Just Goods Workshop item was updated again on November 16, but its local
content tree is byte-for-byte identical to the already pinned November 14
snapshot; no source-pin change was needed. The standalone profile now targets
1.4.9, increments to 0.1.10, and orders Community Mod Framework first. This is
a static compatibility review only; runtime verification in EU5 1.4.9 remains
outstanding.
