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
