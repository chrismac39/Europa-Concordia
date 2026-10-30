# Steam Workshop publishing

## Current workflow

EU5 uses `.metadata/metadata.json` for mod and Workshop details. Run:

```sh
npm run workshop:install
```

This builds the enabled packages, creates the clean release folder at
`dist/workshop/stable`, and installs it at
`%USERPROFILE%/Documents/Paradox Interactive/Europa Universalis V/mod/europa_concordia`.
The generated metadata comes from `config/workshop.json`.

In the Paradox Launcher, select **Europa Concordia** and use its Workshop
upload action. Then open the new Steam Workshop page, subscribe to the item,
enable it in the launcher, and test it in-game. After the item is created,
record its ID in `config/workshop.json`.

The current stage bundles Community Mod Framework (Workshop item
`3692202776`) as an internal package. Concordia's generated launcher metadata
does not declare CMF as an external dependency, and
`config/workshop.json` has no required Workshop items. The bundled snapshot is
version `2.5.0`; its redistribution permission is recorded in
`config/packages.json`.

No preview image is generated or included. Add a user-provided
`.metadata/thumbnail.png` when one is ready.

## Safety and scope

- The install command does not upload or publish anything.
- Workshop upload and visibility are controlled manually in the Paradox
  Launcher.
- Redistribution permission for enabled third-party sources, including CMF,
  is recorded in `config/packages.json`.
- Keep Steam credentials in Steam's own client/launcher; do not put them in
  this repository.
- Source snapshots and integration files are not included in the release
  folder.

EU5 metadata format: [Mod structure](https://eu5.paradoxwikis.com/Mod_structure).
