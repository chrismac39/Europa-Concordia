# Glorp UI and Standard of Living

## Sources

- Glorp UI package: `glorp-ui`
- Standard of Living package: `standard-of-living`
- Concordia target EU5 version: `1.4.5`

## Upstream pre-merged files

Standard of Living already provides Glorp-compatible versions of both
colliding files:

- `in_game/gui/location_window.gui` identifies itself as generated from Glorp
  UI 04.10.26 with one Standard of Living tooltip button added.
- `in_game/gui/vanilla/cmfg_location_window_vanilla_types.gui` identifies
  itself as synchronized from the same Glorp UI location types.

The first file differs functionally by the inserted living-standard tooltip.
The remaining differences in the types file are its provenance header and
whitespace normalization. Concordia therefore reuses both Standard of Living
files unchanged rather than maintaining a separate merge.

Any additional package colliding at either path invalidates the exact
resolution and fails the build for a new integration decision.
