# GH Exchequer and Glorp UI

## Selected playset

- EU5 target: `1.4.5`
- Glorp UI: Workshop `3812518640`, pinned source version `04.10.26`
- GH: Exchequer: Workshop `3812701995`, version `1.2.0`
- Construction Manager: Workshop `3736668860`, version `2.2.13`
- Autonomous Diplomats: Workshop `3696243603`, version `1.5.0`

These are separate required playset mods. The upstream GH Exchequer / Glorp UI
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

## Construction Manager integration

Glorp UI and Standard of Living each replace Construction Manager's
`production_lateralview.gui` and `location_window.gui` integrations. The
current Glorp UI source omits Construction Manager's existing-building
auto-expand control and still positions its unbuilt-building button for the
older layout. The selected SoL/Glorp location window also omits Construction
Manager's food-RGO and RGO auto-expand controls.

Concordia therefore generates two focused replacements from pinned selected
sources:

- The Glorp production view restores the Construction Manager 1.4
  existing-building control, hides the competing vanilla control while
  Construction Manager is active, and updates the unbuilt-building control's
  position, while retaining Glorp UI's remaining production layout.
- The SoL/Glorp location window restores Construction Manager's food-RGO and
  RGO auto-expand controls while retaining SoL's tooltip and the rest of the
  synchronized location-window content.

These generated files are fingerprinted and their anchors are validated on
every build. They do not add a static copy of either upstream source to the
repository. Construction Manager's identical shared script files and the
RGO lateral view use the later Glorp UI files. Glorp UI's outliner file
instantiates both Autonomous Diplomats widgets, whose definitions remain in
Autonomous Diplomats. Autonomous Diplomats loads before Construction Manager
so Construction Manager's CMF dependency-check GUI can add its create-playset
flow without dropping the shared dependency and auto-enable behavior.

## Dependency and runtime risks

Glorp UI's metadata declares SmartTaxes as a dependency. SmartTaxes is
intentionally excluded because of its known performance issues; the user
accepted proceeding without it. Verify the launcher accepts the missing
dependency and test Glorp UI in-game.

Autonomous Diplomats' pinned metadata declares EU5 `1.3.*` support and was
last updated for `1.3.10`. The user chose to keep it for this `1.4.5` profile;
compatibility remains unverified.

## Known issue: inactive left-panel colors

**Status:** Open; cosmetic; no fix confirmed.

The user reports that the intended playset runs and its other functionality
works, but inactive Glorp left-panel tabs show their default colors instead of
the expected category colors. The selected Economy tab still shows its gold
active-state tint. Both Glorp options for vanilla tab icons and backgrounds
are unchecked, and toggling them did not resolve the appearance.

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
