# Community Mod Framework compatibility input

- Workshop item: `3692202776`
- Upstream version: `2.5.0`
- Upstream-declared EU5 version: `1.4.*`
- Concordia target EU5 version: `1.4.5`
- Redistribution permission: explicitly confirmed by the repository owner on
  2026-10-29
- Upstream license: no license file or license declaration was present in the
  installed Workshop snapshot

CMF remains a separate Workshop mod in the playset. Its 139 game-content
files are retained only in the local analysis snapshot; none are copied into
Concordia's generated compatibility patch. The load-order guide lists CMF as a
required mod by its Workshop ID and version.

More Restricted Colonization's CMM settings are not exposed. The
Concordia-authored MRC replacement preserves its historical safe-default
initialization and removes the CMF setting-registration and callback hooks.

Runtime compatibility remains under investigation. CMF plus the Group A
packages loaded, while CMF plus Group B crashed during new-game generation.
The isolated Sulphur's Rivers raster probe was not a valid map-pair test; use
the More Locations plus Sulphur's Rivers combination for further diagnosis.
Do not claim the crash is fixed without an in-game test.
