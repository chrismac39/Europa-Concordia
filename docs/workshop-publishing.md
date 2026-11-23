# Steam Workshop publishing with Community Mod Toolkit

## Project boundary

Europa Concordia builds independent EU5 mods from profiles. The standalone
[RGO Harmony project](https://github.com/chrismac39/RGO-Harmony) owns its
Workshop page, release notes, build output, and CMT workflow. This repository
retains the separate [RGO Harmony Expanded profile](../profiles/rgo-harmony-expanded.json)
and the larger Concordia playset patch,
[current-intended](../profiles/current-intended.json). Each profile must have
its own Workshop item ID, description, release notes, and CMT workspace.
Upstream Workshop mods remain separate.

The Fruits Expanded variant is a separate
[RGO Harmony Expanded profile](../profiles/rgo-harmony-expanded.json), with its
own Workshop page, thumbnail, change notes, CMT project, and output under
`dist/rgo-harmony-expanded/`. Its CMT entry uses Workshop item ID `0` until a
new item is created. The existing Fruits Expanded / Just Goods script patch
is intentionally not in its playset: its pinned effect replacements omit
Just Goods 1.1 assignments and restore the removed `chan_bo` turmeric setter.
See the [Expanded source and conflict audit](../integration/decisions/RGO-Harmony-Expanded-Design.md).

Prepare Expanded independently:

```powershell
npm run validate -- --profile rgo-harmony-expanded
npm run build -- --profile rgo-harmony-expanded
npm run workshop:cmt -- prepare --profile rgo-harmony-expanded --toolkit-dir .local\community-mod-toolkit
```

The Expanded Workshop assets are in
[`integration/workshop/rgo-harmony-expanded/`](../integration/workshop/rgo-harmony-expanded/).
Required Items should be Community Mod Framework, More Locations, Global
Historical RGOs, Just Goods, and Fruits Expanded. Do not add the stale
Fruits Expanded / Just Goods compatibility patch until it is updated for the
selected Just Goods 1.1 source.

## Install CMT outside the repository

CMT's [setup script](https://github.com/Europa-Universalis-5-Modding-Co-op/community-mod-toolkit)
is designed to merge toolkit history and files into a single-mod Git
repository. Do **not** run it at the root of this multi-profile repository.
Instead, keep a separate local checkout and Python environment:

```powershell
New-Item -ItemType Directory -Force .local | Out-Null
git clone --branch image_handling_improvements --single-branch https://github.com/chrismac39/community-mod-toolkit.git .local\community-mod-toolkit
python -m venv .local\cmt-venv
.local\cmt-venv\Scripts\python.exe -m pip install -r .local\community-mod-toolkit\tools\dependencies\requirements.txt
```

The fork branch adds the gallery synchronization support required by this
workflow; the upstream `toolkit-release` branch does not yet include it.
`.local/` is ignored by Git. CMT's upload script, gallery adapter, and
dependencies are copied from that checkout into generated, profile-specific
workspaces under `dist/cmt-workspaces/`; CMT is not vendored into the
repository.

## Prepare one profile

Run validation, build the chosen profile, then prepare its CMT workspace. The
preparation command builds and packages the profile again to ensure its files
are current:

```powershell
npm run validate -- --profile rgo-harmony-expanded
npm run build -- --profile rgo-harmony-expanded
npm run workshop:cmt -- prepare --profile rgo-harmony-expanded --toolkit-dir .local\community-mod-toolkit
```

The CMT project will be under
`dist/cmt-workspaces/rgo-harmony-expanded/project`.
It contains only the generated mod, CMT's upload tool/dependencies, the
profile's Workshop description, and change notes for the built version. CMT
includes EU5's `dlc` folder in release sources and sanitizes release folder
names for Windows. The Steamworks Python package is copied to the import
location expected by its uploader. CMT's upload defaults are disabled in the
generated configuration; preparation does not upload or create a Workshop
item.

`config/cmt-workshop.json` maps profile IDs to Workshop page directories and
Workshop item IDs. `0` is CMT's create-new-item value. The publish wrapper
persists a newly created ID to this config and the local workspace, including
if CMT reports a later upload failure. Each profile is staged separately, so
preparing one item cannot select another profile's ID.
If you intentionally want to create a different item for an already-used
profile, remove only that profile's generated project directory under
`dist/cmt-workspaces/` before preparing it again with ID `0`.

## Workshop gallery images

Put additional gallery images in the profile's Workshop directory under
`gallery/`. For RGO Harmony Expanded, use
`integration/workshop/rgo-harmony-expanded/gallery/`. JPG, JPEG, and PNG
files are supported; each file must be smaller than 1,000,000 bytes. CMT does
not resize or recompress images. 1280 × 720 (16:9) is a recommended size, but
other dimensions are accepted.

Gallery images are not synchronized during ordinary publishing. To stage the
images for review, prepare with `--sync-gallery`:

```powershell
npm run workshop:cmt -- prepare --profile rgo-harmony-expanded --toolkit-dir .local\community-mod-toolkit --sync-gallery
```

Only an explicit `--sync-gallery` publish changes the Workshop gallery. CMT
replaces existing image previews with the local files in alphabetical order;
it preserves the primary thumbnail and non-image previews such as videos.
Repeated syncs rebuild the image previews instead of adding duplicates. A
missing or empty local gallery is rejected before upload to prevent accidental
deletion. After publishing, verify the images and their order on the Workshop
page.

The `current-intended` Concordia profile is not yet registered for CMT: it
needs its own reviewed Workshop description and version-matched change notes.
Add those assets and a profile entry to `config/cmt-workshop.json` before
preparing it. Do not reuse RGO Harmony Expanded's description or Workshop ID.

## Upload only after release review

CMT's upload tool requires Steam to be running and signed in. Review the
generated files, the Workshop title, thumbnail, description, required items,
gallery when synchronizing, permissions, and release notes before running it.
In particular, do not run the upload tool with item ID `0` unless you intend to create a new Workshop
item. CMT does not configure Steam required items or visibility. After a first
upload, verify both on the Workshop page and keep the item private until the
release is ready to make public.

The `publish` command rebuilds and stages the selected profile, displays the
mod name, version, and target Workshop ID, then requires you to type an exact
confirmation immediately before invoking CMT. It uploads the mod, Workshop
page, and versioned change notes:

```powershell
npm run workshop:cmt -- publish --profile rgo-harmony-expanded --toolkit-dir .local\community-mod-toolkit --python .local\cmt-venv\Scripts\python.exe
```

For a non-interactive terminal, provide the exact confirmation token for the
selected profile and configured Workshop item.
The command checks it against the current profile ID and configured Workshop
item before starting CMT.

For an explicit gallery synchronization, add `--sync-gallery` to the publish
command as well. For example:

```powershell
npm run workshop:cmt -- publish --profile rgo-harmony-expanded --toolkit-dir .local\community-mod-toolkit --sync-gallery --confirm-publish "PUBLISH rgo-harmony-expanded UPDATE"
```

The command also persists a newly-created Workshop item ID to
`config/cmt-workshop.json`, including when CMT reports a later upload failure.
For updates to that same item, use the same command after updating the
versioned file
[`change-notes/0.1.0.bbcode`](../integration/workshop/rgo-harmony-expanded/change-notes/0.1.0.bbcode)
and the version in the selected profile. The adapter stages the notes as
CMT's expected version-header format. This wrapper always uploads the mod,
Workshop page, and current version's change notes together. With
`--sync-gallery`, it also synchronizes the staged gallery image set.

Add these upstream items as Steam Workshop **Required Items** on RGO Harmony Expanded:

- Just Goods: `3785316314`
- Global Historical RGOs: `3602513956`
- More locations Mod: `3809335454`
- Fruits Expanded: `3821883489`

Keep the load order in the page description: More Locations → Global
Historical RGOs → Just Goods → RGO Harmony. Required-item relationships are
not represented by the generated EU5 launcher metadata and must be maintained
on the Workshop item.

No Steam upload has been performed by the repository's build, install, or CMT
preparation commands.
