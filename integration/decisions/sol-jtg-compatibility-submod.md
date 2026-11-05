# Standard of Living and Just Goods compatibility

## Analysis inputs

- Standard of Living: `standard-of-living` (Workshop item `3815438890`)
- Just Goods: `just-goods` (Workshop item `3785316314`)
- Existing compatibility mod: `sol-jtg-compatibility-submod` (Workshop item
  `3769566303`, local version `260822`)
- Concordia target EU5 version reviewed: `1.4.5`

The `current-intended` profile selects Just Goods and Standard of Living as
separate mods. The SOL-JTG compatibility submod is explicitly excluded from
the playset; its latest downloaded Workshop snapshot remains in the package
catalog as the behavior and data reference for Concordia's compatibility
files, not as a payload to bundle. It declares EU5 `1.3.11` compatibility,
below Concordia's `1.4.5` target. Community Mod Framework, Just Goods, and
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
- leave native slave demand unchanged, matching the latest Workshop version.

The earlier Git export's README says slave demand is unchanged, but its data
explicitly cancels native slave demand on several goods. The latest local
Workshop version resolves that discrepancy by leaving slave demand untouched.
Per the user's source-freshness rule, Concordia's 26 demand blocks and 100
market-consumption constants now follow that Workshop snapshot. The reference
defines only `sol_refresh_market_pop_demand_maps` and
`gls_accumulate_panel_stats` as replacements because it declares EU5 `1.3.11`.
Concordia targets `1.4.5`; the active SoL source still defines
`sol_compute_substitute_unit_spending`, so the compatibility output retains
all three complete SoL replacements based on the active source.

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
compatibility files and metadata. The latest local Workshop compatibility
snapshot remains an analysis-only reference and is not included in the output.

The earlier Git export says SOL-JTG and SOL-PP compatibility mods replace the
same SoL scripted effects and are mutually exclusive. Treat this as a
historical warning until it is confirmed against a current source. A future
profile combining Just Goods and Population Politics therefore needs a
separately analyzed combined target.

Before publishing a derived patch, obtain redistribution permission; current
package notices do not record permission for these mods. Just Goods declares
EU5 1.3 support while the profile targets 1.4.5, so compatibility and the
replacement's GUI/economy behavior still require in-game testing.
