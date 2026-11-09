# Just Goods compatibility maintenance

## Source

- Steam Workshop item: `3785316314`
- Upstream author: `moveably`
- Upstream version: `1.0`
- Upstream-supported EU5 version: `1.3`
- Concordia target EU5 version: `1.4.5`

The source snapshot under `sources/steam-workshop/3785316314` is immutable and
must not be edited in place. It remains the historical 1.0 source pin selected
by `current-intended`; EU5 1.4.5 compatibility for that source is unverified.
The repository owner has confirmed permission to distribute the compatibility
patch; retain the written permission with release records.

The standalone RGO Harmony profile now uses a separately pinned 1.1 snapshot
at `sources/steam-workshop/3785316314-1.1`, which declares EU5 1.4 support and
a Community Mod Framework 2.* dependency. The original 1.0 pin remains in
`current-intended` pending the separate Concordia review.

## Maintenance approach

Record compatibility changes under `integration/patches/just-goods/` or
`integration/overrides/just-goods/`. Before enabling the package:

1. Identify EU5 1.4.5 definition, schema, and UI changes affecting the mod.
2. Implement the smallest compatibility changes outside the source snapshot.
3. Validate all added goods, production methods, prices, localization, and UI
   against EU5 1.4.5.
4. Test a new campaign and relevant saved-game behavior in EU5 1.4.5.
5. Obtain permission to redistribute the upstream files and maintained changes.

The optional Community Mod Menu integration is not a required package
dependency; upstream states that it only enables a warning banner.
