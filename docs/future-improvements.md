# Future improvements

## Extend Just Goods RGOs to More Locations additions

**Status:** Deferred. No compatibility patch for this has been generated.

The current playset appears to be applying Just Goods' existing RGO placement:
the player confirmed that Limbourg has zinc. Just Goods changes Limbourg to
zinc at game start in
[`brass_on_actions.txt`](../sources/steam-workshop/3785316314/in_game/common/on_action/brass_on_actions.txt).
The current More Locations template gives Limbourg a static lead value in
[`location_templates.txt`](../sources/steam-workshop/3809335454/in_game/map_data/location_templates.txt);
that is the starting map value, not evidence that More Locations overwrote
Just Goods' runtime change. A nearby location added by More Locations
reportedly keeps lead. Its exact ID and parent location have not yet been
confirmed.

Just Goods places its added RGOs through explicit location-scoped
`change_raw_material` effects in its brass, meat, soap, and spices on-action
files. A comparison of the current snapshots found 713 existing target
locations. All remain present in both the installed EU5 1.4.5 map and the
current More Locations snapshot. More Locations adds approximately 3,591
location IDs relative to that installed map. A coarse province comparison
found 237 added IDs in provinces that also contain a Just Goods RGO target;
this is only a candidate set, not a parent-to-child mapping. Recompute these
counts against the exact game and mod versions before implementation.

### Proposed workflow

1. Compare More Locations' location IDs against the exact EU5 baseline pinned
   for the profile. Record the added and removed IDs and identify which
   additions actually subdivide locations with Just Goods RGO assignments.
2. Derive and review a parent-to-child crosswalk. Use spatial overlap between
   the vanilla and More Locations location rasters, with province membership
   and map geography as corroborating evidence. Do not infer lineage from a
   matching default RGO alone; ambiguous or unmapped locations should remain
   undecided.
3. Research plausible RGOs for the new locations. LLM-assisted web searches
   may propose candidates, but each accepted placement should record its
   supporting source URLs, access date, confidence, and any reasonable
   alternatives. An inherited More Locations template value is not by itself
   proof of the historically appropriate RGO.
4. Track each reviewed location in a crosswalk with at least: new location ID,
   source parent ID, the parent's Just Goods RGO if applicable, proposed RGO,
   evidence, confidence, and any associated Just Goods effects.
5. If approved, add a small Concordia-authored compatibility file that
   assigns only reviewed new locations. Prefer an additive game-start script
   over copying or replacing More Locations' large map-data files. Preserve
   relevant placement side effects: some Just Goods assignments also add
   location modifiers or conditionally remove village buildings. Do not copy
   an entire parent effect block without checking those effects for the new
   location.
6. Add validation for location existence, duplicate assignments, source
   fingerprints, and crosswalk completeness. Test in a fresh campaign using an
   existing Just Goods target as a control and checking the mapped new
   locations and any associated buildings or modifiers.

This is a future map-compatibility improvement, not a confirmed failure of the
existing parent-location placements. It does not change the current profile
or generated patch.
