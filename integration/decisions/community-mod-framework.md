# Community Mod Framework integration

- Workshop item: `3692202776`
- Upstream version: `2.5.0`
- Upstream-declared EU5 version: `1.4.*`
- Concordia target EU5 version: `1.4.5`
- Redistribution permission: explicitly confirmed by the repository owner on
  2026-10-29
- Upstream license: no license file or license declaration was present in the
  installed Workshop snapshot

CMF is included as an internal package for Concordia's framework and debug
console functionality. Its 139 game-content files are copied from the local
Workshop snapshot without editing. The per-mod CMF relationship and required
Workshop item are removed from Concordia's root metadata.

More Restricted Colonization's CMM settings are not exposed. Concordia-owned
overrides preserve the upstream safe-default initialization and disable MRC's
CMF registration and callback effects.

Runtime compatibility remains under investigation. CMF plus the Group A
packages loaded, while CMF plus Group B crashed during new-game generation.
The isolated Sulphur's Rivers raster probe was not a valid map-pair test; use
the More Locations plus Sulphur's Rivers combination for further diagnosis.
