# GH Exchequer and Glorp UI

## Sources

- GH: Exchequer package: `gh-exchequer`
- Glorp UI package: `glorp-ui`
- Upstream compatch package: `gh-exchequer-glorp-ui-patch`
- Concordia target EU5 version: `1.4.5`

## Economy panel resolution

Both primary packages provide `in_game/gui/economy_lateralview.gui`. GH:
Exchequer documents that it should load after UI mods such as Glorp UI and
replace their copy so its HSO Finances hooks remain available. Concordia
therefore selects the GH: Exchequer file for this exact two-package collision.
The same declared replacement applies to
`in_game/gui/vanilla/cmfg_economy_lateralview_vanilla_types.gui`.

## Upstream compatch

Concordia reuses the upstream `GH: Exchequer - Glorp UI patch` package unchanged
instead of maintaining a separate GH/Glorp compatibility implementation. Its
`glorpUI_left_panel.gui` adds GH: Exchequer's Trade tab to Glorp UI's left
panel, so Concordia selects that file over Glorp UI's original.

The compatch declares both primary packages as dependencies. The explicit
economy-panel selections reproduce the load order documented by GH: Exchequer;
they are not replacement compatibility code. Any additional package colliding
at these paths invalidates the exact resolutions and fails the build for a new
integration decision.
