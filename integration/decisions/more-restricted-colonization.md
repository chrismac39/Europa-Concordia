# More Restricted Colonization compatibility

- Workshop item: `3691186720`
- Upstream version: `1.4.0`
- Upstream-declared EU5 version: `1.4.1`
- Concordia target EU5 version: `1.4.5`
- Separate framework dependency: Community Mod Framework `2.5.0`

MRC and CMF remain separate mods in the `current-intended` playset. Neither
source is copied into Concordia. The generated patch replaces only MRC's
`in_game/common/on_action/MRC_cmm_on_actions.txt`. EU5 on-action files do not
support database-entry `INJECT:`/`REPLACE:` modes, so the complete replacement
retains MRC's `on_game_start` and `on_game_load` registrations and safe-default
initialization while omitting its CMF registration and CMM callback hooks.
Profile validation checks that the retained defaults remain present and that
the removed hooks do not return.

The preserved defaults are Historical Bypass on; Ottoman colonization off; all
continental and colonial-nation restrictions on; tax threshold `1000`; and
African harbor threshold `0.25`. No MRC gameplay settings are exposed through
CMM. Its now-unreferenced upstream registration/synchronization effects are
not copied into Concordia.

Verify the defaults and colonization gameplay in-game. Static analysis cannot
establish runtime compatibility or resolve the known CMF-plus-map-package
crash.
