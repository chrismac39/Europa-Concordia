# Standard of Living and Just Goods compatibility

## Analysis inputs

- Standard of Living: `standard-of-living` (Workshop item `3815438890`)
- Just Goods: `just-goods` (Workshop item `3785316314`)
- Existing compatibility mod: `sol-jtg-compatibility-submod` (Workshop item
  `3769566303`)
- Concordia target EU5 version reviewed: `1.4.5`

The `current-intended` profile selects Just Goods and Standard of Living as
separate mods. The SOL-JTG compatibility submod is explicitly excluded from
the playset; its pinned source snapshot remains in the package catalog as
behavioral reference material only. Community Mod Framework, Just Goods, and
Standard of Living retain their relative order, followed by the other selected
mods and Concordia last.

Decision votes 38 and 41 both selected “Use SOL-JTG Compatibility Submod as the
base.” The user's clarification supersedes a literal winner/base reading:
SoL and Just Goods remain active, while Concordia authors the integration.
Treat the existing submod as a reference for behavior, not as the authoritative
package or a payload to bundle. The selected behavior is:

- scale 26 Just Goods direct pop-demand quantities by SoL's per-stratum factors,
  with magnitude-aware rounding;
- negate Just Goods wealth, development, and regional demand modifiers for
  those goods;
- add their final quantities to SoL's market unit-spending cache;
- display the 81 SoL + Just Goods demand goods in both SoL goods panels;
- cancel Just Goods slave demand for the covered goods, as the reference
  implementation's negative `slaves` adjustments do.

The reference README says slave demand is unchanged, but its data explicitly
cancels native slave demand on several goods. The user chose the actual
implementation behavior: zero those slave-demand quantities. The README also
describes two replacement effects, while the pinned source contains three
`REPLACE:` definitions: `sol_refresh_market_pop_demand_maps`,
`gls_accumulate_panel_stats`, and `sol_compute_substitute_unit_spending`.
Concordia retains all three because each contains hardcoded goods
enumerations that must include Just Goods.

The only direct SoL/Just Goods definition collision remaining after excluding
the compatibility submod is `cloves`. Just Goods injects only
`default_market_price`; SoL injects only `demand_add` and
`wealth_impact_threshold`. These are disjoint database-entry fields, so both
definitions are retained as-is and a content-pinned semantic resolution records
that EU5's native database-entry merge is safe here; this is not a Concordia
payload patch.

## Concordia implementation

The profile emits five compatibility files:

- a database-entry `INJECT` file for the 26 Just Goods direct-demand goods;
- 26 sets of SoL market unit-consumption constants;
- three complete SoL scripted-effect replacements that preserve SoL's full
  market-cache, panel-stat, and substitute-spending flows while enumerating the
  added goods;
- a complete merged global living-standard panel that preserves SoL's panel
  and adds the Just Goods rows;
- the complete SoL economy tooltip template, with the same added-goods rows,
  loaded after SoL's source template.

The two GUI files are whole-file replacements/additions, not text-level GUI
merges. Their complete SoL sections are retained because EU5 replaces a
same-path GUI file rather than merging its text. Upstream SoL and Just Goods
definitions remain separate playset mods; Concordia emits only these
compatibility files and metadata. The compatibility source snapshot and both
upstream source snapshots remain unchanged.

The pinned compatibility source says SOL-JTG and SOL-PP compatibility mods
replace the same SoL scripted effects and are mutually exclusive. A future
profile combining Just Goods and Population Politics therefore needs a
separately analyzed combined target.

Before publishing a derived patch, obtain redistribution permission; current
package notices do not record permission for these mods. Just Goods declares
EU5 1.3 support while the profile targets 1.4.5, so compatibility and the
replacement's GUI/economy behavior still require in-game testing.
