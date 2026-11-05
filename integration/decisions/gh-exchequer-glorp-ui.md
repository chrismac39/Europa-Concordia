# GH Exchequer and Glorp UI

## Selected playset

- EU5 target: `1.4.5`
- Glorp UI: Workshop `3812518640`, pinned source version `04.10.26`
- GH: Exchequer: Workshop `3812701995`, upstream version `1.3` (Concordia pin `1.3.0`)

These are separate selected playset mods. The upstream GH Exchequer / Glorp UI
compatibility mod (`3827095294`) is excluded; its behavior is a reference for
the Concordia-generated Trade-tab integration, not an enabled or copied
package.

## GH Exchequer and Glorp UI

GH Exchequer documents that it should load after UI mods such as Glorp UI and
replace their `in_game/gui/economy_lateralview.gui` and
`in_game/gui/vanilla/cmfg_economy_lateralview_vanilla_types.gui` files. Those
exact path resolutions are pinned to the current source hashes and load order.
The profile keeps Glorp UI's left panel and generates a Concordia-owned
`glorpUI_left_panel.gui` from its pinned source. The anchored transform creates
separate Economy and GH Trade tab states, assigns GH's Trade tooltip and icon,
and shifts the later keyboard shortcuts. Changed source anchors fail
validation instead of silently reusing the old approval.

## Construction Manager exclusion

Construction Manager was added to current-intended during the October 30
Glorp UI/GH integration because Glorp UI declares it as an upstream dependency
and its GUI source contains Construction Manager widgets. The user has
confirmed they do not use it; the earlier notes treating it as a selected mod
were incorrect.

Current-intended excludes Construction Manager and removes Concordia's
Construction Manager-specific production and location-window patches. It also
uses fingerprinted generated patches to strip the remaining direct CM widgets,
pause-menu buttons, town-rights map-mode hooks, and active-mod checks from the
selected Glorp UI and Standard of Living files. The source snapshots remain
unchanged. Native Glorp UI auto-expand controls remain visible; Construction
Manager-only automation and status features are omitted.

Glorp UI's upstream Workshop metadata still declares Construction Manager as
a dependency. Concordia does not alter or repackage that upstream metadata, so
the launcher may still report the missing dependency even though the direct
references are removed from the current-intended output. Verify launcher
acceptance and the adjusted UI in-game.

Glorp UI's outliner file also instantiates two Autonomous Diplomats widgets.
Because the user does not use that mod, a fingerprinted generated patch
removes those two instances while retaining the rest of Glorp UI's outliner.
Autonomous Diplomats' auto-cancel and synchronization widget behavior is
therefore omitted from this profile.

The refreshed local Workshop snapshot is GH: Exchequer `1.3` (catalog pin
`1.3.0`). It removes the previous monthly home-rank callback and changes the
daily goods-fill flow. A content-pinned native-merge decision retains all six
`monthly_country_pulse` definitions from CMF, GH Trade Desk, HSO Finances,
Glorp UI, Just Goods, and SoL; their callbacks are distinct, and EU5 merges
same-named on-actions across separate files.

## Dependency and runtime risks

Glorp UI's upstream metadata also declares Autonomous Diplomats as a
dependency. The current-intended package metadata omits that dependency
because the generated outliner patch removes Glorp UI's only direct references
to its widgets. Verify the adjusted outliner in-game.

Glorp UI declares SmartTaxes as a dependency. SmartTaxes is intentionally
excluded because of its known performance issues; verify the launcher accepts
that omission and test Glorp UI in-game.

## Known issue: inactive left-panel colors

**Status:** Open; cosmetic; no fix confirmed.

Before Construction Manager was excluded, the user reported that the playset
ran and its other functionality worked, but inactive Glorp left-panel tabs
showed their default colors instead of the expected category colors. The
selected Economy tab still showed its gold active-state tint. Both Glorp
options for vanilla tab icons and backgrounds were unchecked, and toggling
them did not resolve the appearance. The profile changes that exclude
Construction Manager still need fresh in-game verification.

The user confirmed the launcher order matches the load-order guide. Glorp UI
1.4 with CMF alone displays the expected colors. In the same full playset,
swapping Concordia's generated patch for the standalone GH/Glorp Workshop
patch restores them.

Comparison of Concordia's generated `glorpUI_left_panel.gui` against the
pinned Glorp file and the standalone compatch found the expected custom icon
and background references in the generated file. Its visible differences from
the standalone compatch are Concordia-specific labels, a unique Trade-button
name, and Trade-tab highlight blocks; no color-related difference explains
the runtime result. The cause remains unresolved and should not be treated as
a load-order issue or a confirmed fix. Track this against the generated
patch/runtime behavior; do not copy Glorp's upstream textures into Concordia.
