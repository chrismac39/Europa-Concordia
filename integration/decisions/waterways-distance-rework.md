# Waterways Distance Rework compatibility

- Workshop item: `3608489505`
- Upstream author: `Relandelon`
- Upstream version: `1.8.2`
- Upstream-declared EU5 version: `1.0.x`
- Concordia target EU5 version: `1.4.5`

The source snapshot contains one game-content file:
`in_game/common/auto_modifiers/country_relandelon.txt`. It adds
`country_base_values_relandelon` with upstream, downstream, and maritime
distance-cost modifiers.

The EU5 1.4.5 vanilla `common/auto_modifiers/country.txt` still defines all
three modifier keys. The new auto-modifier identifier is unique and the file
has no collision with the current Concordia package set, so Concordia includes
the pinned source file unchanged. No compatibility override is currently
needed. In-game verification of the distance effects remains pending.

Keep `sources/steam-workshop/3608489505` immutable. If later game testing
reveals a compatibility issue, record any port under
`integration/patches/waterways-distance-rework/` or
`integration/overrides/waterways-distance-rework/`.
