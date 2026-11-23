# RGO Harmony Lite

## Scope decision

RGO Harmony Lite is a separate profile for Global Historical RGOs and Just
Goods. It excludes More Locations entirely; it is not a reduced set of
More Locations descendants or a variant of the More Locations map merge.
Community Mod Framework remains selected because Just Goods 1.1 requires it.

The profile pins the same Global Historical RGOs 1.4.0 and Just Goods 1.1.0
snapshots as the standalone 1.4.9 RGO Harmony project. It starts with no
compatibility
payload. Its approvals are recorded separately using the Lite profile's own
content fingerprints.

## Conflict review

The first profile analysis found four cross-package definitions and no path,
localization, or other static conflict findings. The definitions are shared
on-actions: `cmf_on_mod_registration`, `monthly_country_pulse`,
`on_game_start`, and `yearly_country_pulse`. Preserve all distinct Community
Mod Framework and Just Goods callbacks through EU5's native on-action merge.
This repeats the existing RGO Harmony decision for the same pinned source
content; no synthetic whole-file replacement is required.

For location assignments, Global Historical RGOs is the only selected package
that supplies `location_templates.txt`, so retain its map values. Preserve
Just Goods 1.1's 1,197 fixed startup RGO setters as authored; the existing
RGO Harmony review explicitly extended that precedence to its 484 newly
surfaced setter locations. Outside those fixed targets, keep Global Historical
RGOs' map values unless a separately authored Just Goods event or conditional
effect changes them during play. Do not copy Just Goods effects into the
compatibility output.

Do not copy the existing RGO Harmony map merge: that payload is based on More
Locations' complete `location_templates.txt` and depends on decisions for its
added and split locations. The Lite profile does not select More Locations;
there is no same-path map collision, so the current build has no gameplay
payload and emits package metadata only. Re-run analysis when selected source
pins change; any resulting new conflict must be reviewed independently.
