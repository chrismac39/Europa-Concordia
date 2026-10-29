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

The current stage contains More locations Mod and Sulphur's Rivers Expanded;
neither declares a Workshop dependency. Add required Workshop relationships
when later stages introduce them.

No preview image is generated or included. Add a user-provided
`.metadata/thumbnail.png` when one is ready.

## Safety and scope

- The install command does not upload or publish anything.
- Workshop upload and visibility are controlled manually in the Paradox
  Launcher.
- Redistribution permission for the two currently enabled sources was
  confirmed by the repository owner and recorded in `config/packages.json`.
- Keep Steam credentials in Steam's own client/launcher; do not put them in
  this repository.
- Source snapshots and integration files are not included in the release
  folder.

EU5 metadata format: [Mod structure](https://eu5.paradoxwikis.com/Mod_structure).
