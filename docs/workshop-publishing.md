# Local packaging and Steam Workshop publishing

## Current project boundary

The standalone profile is
[just-goods-more-locations-global-historical-rgos-standalone.json](../profiles/just-goods-more-locations-global-historical-rgos-standalone.json).
Its generated mod metadata is at `.metadata/metadata.json`; the build copies
the user-provided thumbnail from
`integration/assets/rgo-harmony/thumbnail.png` to `.metadata/thumbnail.png`.
The Workshop description and versioned change notes are maintained in
[`integration/workshop/rgo-harmony/`](../integration/workshop/rgo-harmony/).
The shared map-template payload preserves More Locations data, and the
repository records the owner's confirmation of author permission for
distributing this compatibility patch.

Build and install the standalone patch locally:

```sh
npm run validate -- --profile just-goods-more-locations-global-historical-rgos-standalone
npm run build -- --profile just-goods-more-locations-global-historical-rgos-standalone
npm run workshop:install -- --profile just-goods-more-locations-global-historical-rgos-standalone
```

The install command packages the profile under
`dist/workshop/stable/<profile-id>` and copies it to
`Documents/Paradox Interactive/Europa Universalis V/mod/<mod-id>`. It does
**not** upload to Steam. The repository currently has no `workshop:publish`
command; `config/workshop.json` controls local packaging, not Steam submission.

## Prepare the Workshop item

1. Complete an in-game test with More Locations, Global Historical RGOs, Just
   Goods, and the standalone patch, in that load order. Check direct
   conflicts, split descendants, and Just Goods' dynamic effects. Do not
   publish until this release gate passes.
2. The supplied thumbnail is packaged as `.metadata/thumbnail.png`. It is
   resized to 512x512 and is under 1 MB. The
   [EU5 mod structure guide](https://eu5.paradoxwikis.com/Mod_structure)
   recommends 512x512 pixels and requires the image to be under 1 MB. The
   source image is retained as a repeatable build input.
3. Use the proposed Workshop title:
   **RGO Harmony: Just Goods + More Locations + Global Historical RGOs**.
   The stable EU5 mod ID is `jg_ml_gh_rgos_compat_standalone`; do not change it
   after creating the Workshop item.
4. Prepare a Workshop description that names the three required Workshop
   items, states the expected order (More Locations → Global Historical RGOs →
   Just Goods → RGO Harmony), summarizes the patch's RGO decisions, and
   credits the three mod authors. Explicit author permission has been
   confirmed; retain its written record for release.

The English description file is
[`STEAM_PAGE.bbcode`](../integration/workshop/rgo-harmony/STEAM_PAGE.bbcode).
For PDX Workshop Manager, set the English **Localized Description File** to
that file's full path. Set **Change Note Directory** to
`integration/workshop/rgo-harmony/change-notes`; the directory contains
`0.1.0.bbcode`, matching the standalone mod's current version. For later
releases, add a `.bbcode` file whose name matches the version in the mod
metadata.

## Upload path

A documented repeatable option is the community
[PDX Workshop Manager](https://eu5.paradoxwikis.com/PDX_Workshop_Manager).
It reads EU5 mod metadata and can publish/update a Workshop item. Its
configuration uses the Steam game App ID (`3450310`) and a mod entry with the
mod directory; `id: 0` creates a new item, and the resulting numeric Workshop
ID is used for later updates. The tool's documentation says Steam must be
running and logged in. Use its current example configuration and GUI/CLI
instructions rather than copying an old configuration blindly.

For the first upload:

1. Build and install the profile above, then make sure the finished folder has
   its thumbnail and correct `.metadata/metadata.json`.
2. Point the Workshop Manager at the standalone mod directory, not the
   repository root or the Concordia `current-intended` output. Start with a
   new item (`id: 0`).
3. Keep the item private/unlisted during review if the uploader offers that
   option. Check its title, thumbnail, description, game version, and
   uploaded files before making it public.
4. In Steam Workshop item settings, add the three upstream mods as **Required
   Items** using their Workshop IDs:
   - Just Goods: `3785316314`
   - Global Historical RGOs: `3602513956`
   - More locations Mod: `3809335454`
5. Record the returned Workshop item ID outside the profile's stable mod ID.
   For later updates, rebuild the same profile and upload to that existing
   Workshop item; do not create a new item or change `jg_ml_gh_rgos_compat_standalone`.

The standalone build metadata currently has no dependency relationships, so
Required Items and load-order instructions must be set on the Workshop item
and in its description. Publishing is a separate, manual action; no upload was
performed as part of this work.
