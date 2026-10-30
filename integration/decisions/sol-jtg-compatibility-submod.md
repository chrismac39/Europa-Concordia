# Standard of Living and Just Goods compatibility

## Analysis inputs

- Standard of Living: `standard-of-living` (Workshop item `3815438890`)
- Just Goods: `just-goods` (Workshop item `3785316314`)
- Existing compatibility mod: `sol-jtg-compatibility-submod` (Workshop item
  `3769566303`)
- Concordia target EU5 version reviewed: `1.4.5`

These mods are not selected in the starter `current-intended` profile. A future
profile can keep Standard of Living and Just Goods as separate playset mods
while replacing the separate SOL/JTG compatibility mod with a
Concordia-authored profile patch. Any such patch must be based on reviewed
source behavior, preserve both mods' unique GUI content, and be recorded under
`integration/patches/` or `integration/overrides/`. The compatibility mod's
source snapshot remains analysis-only and is not copied into a build.

The known shared path is
`in_game/gui/panels/situation/global_living_standard.gui`. No load-order winner
or merged patch is approved for the starter profile.
