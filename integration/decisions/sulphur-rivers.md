# Sulphur's Rivers Expanded map layer

## Scope and implementation

This record implements Decision 36 from `decision-votes.md` for EU5 1.4.5.
The affected packages and pins are:

- `more-locations`, version `2.10.2026`, Workshop item `3809335454`,
  snapshot checksum
  `sha256:9de6bd4c0b67d62a5c98b580020cdfb16a314835201fb3618a39893d2a684ddd`;
- `sulphurs-rivers-expanded`, version `1.2.0`, Workshop item `3617910693`,
  snapshot checksum
  `sha256:f758eedca808e603fafe7754db1b9e083be6f52a761cccd1fa23a17ed6541fc9`.

The vote selects Sulphur's Rivers Expanded as the base for
`in_game/map_data/rivers.png`. Concordia retains that complete source raster
at the colliding path; it does not synthesize or resample a new image.

## Map alignment check

The selected map geometry comes from More locations Mod. Its
`in_game/map_data/locations.png` and both candidate `rivers.png` files are
16384 by 8192 pixels. Visual inspection confirms the same world extent and
map projection at the image level, so the selected river layer needs no
canvas resizing or cropping. This is a structural alignment check; it does
not replace an in-game rendering check.

The exact package set and winner are recorded in `config/conflict-rules.json`.
Neither upstream snapshot is modified.
