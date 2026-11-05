# Gathering of the Rus and Historical Tweaks

## Sources

- Gathering the Land of the Rus package: `gathering-land-rus`
- Historical Tweaks package: `historical-tweaks`
- Concordia target EU5 version: `1.4.5`

## Bundled Historical Tweaks files

Gathering of the Rus bundles older copies of three Historical Tweaks files.
The standalone Historical Tweaks package supplies newer versions:

- `in_game/common/on_action/historical_tweaks_on_actions.txt`
- `in_game/events/historical_tweaks_events.txt`
- `in_game/events/historical_tweaks_union_events.txt`

The standalone package explicitly detects Gathering of the Rus through its
`gathering_of_the_rus_compat` trigger. That trigger checks the
`rus_gathering_intact` global variable created by Gathering of the Rus. Its
event file retains the Rus-related events while adding later content, and its
union events contain later trigger and option fixes.

Concordia therefore reuses the standalone Historical Tweaks versions unchanged
as the upstream compatibility-aware supersets. Any additional package
colliding at these paths invalidates the exact resolutions.

## Current-intended integration

Historical Tweaks 1.0.0 (Workshop item `3603092142`) is selected immediately
after Gathering the Land of the Rus. Its pinned 331-file snapshot matches the
current local Workshop download. The upstream metadata declares EU5 `1.3.11`,
so compatibility with this EU5 `1.4.5` profile still needs in-game review.

The standalone Historical Tweaks versions of the three colliding files above
win through content-pinned load-order rules. Their source fingerprints must be
refreshed if either Workshop source changes.

The previously approved additive policy keeps distinct game-start, monthly,
yearly, and biyearly callbacks from Historical Tweaks and the selected mods.
The same policy keeps all distinct callbacks on `on_ending_war`,
`on_location_occupied`, and `on_siege_won`: Gathering's Rus callbacks remain
alongside Historical Tweaks' Holy League, Timurid/situation, and Iberian
callbacks.

The rank file is merged separately for this profile, following the previously
approved union policy without importing rules from unselected Imperial
Ambitions or The Prussian Destiny. The named-color merge keeps unique keys.
Gathering sets `rus_gathering_intact`; Historical Tweaks checks for its absence
to gate duplicate Rus-related behavior, so that compatibility contract remains
intact.

Static analysis reports five non-blocking active country-tag overlap audits
across the selected mods. Shared tags alone do not prove a conflict; verify
their combined effects in-game.
