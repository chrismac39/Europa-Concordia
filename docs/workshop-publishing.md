# Steam Workshop publishing

## Status and target

Europa Concordia targets one public **stable** Workshop item for Europa
Universalis V (Steam App ID `3450310`). The current repository has no
publishing command, no installable EU5 package layout verification, no
Workshop item, and no SteamCMD installation. `config/workshop.json` is only a
version-controlled target configuration; its `publishedFileId` is `null`
until a stable item is explicitly created. Do not invent or substitute an ID.

Local playtesting happens before publishing by installing and testing the
packaged mod with the game. It does not require a separate Workshop test item
or dev channel.

## Separate pipeline stages

The eventual workflow must have distinct operations:

1. **Build** — assemble enabled package sources and approved integration
   changes.
2. **Validate** — check package dependencies, final assembled content,
   unresolved path/definition conflicts, metadata, source pins, attribution,
   and redistribution permissions. Validation must run against the assembled
   all-in-one result, not only individual package inputs.
3. **Package** — create a clean release directory at the configured
   `dist/workshop/stable` path. Include only the verified EU5 mod metadata and
   content, plus any explicitly required preview/release files. Exclude source
   repositories, package snapshots, integration working files, tooling,
   tests, local settings, reports, and unrelated development material.
4. **Publish** — a separate, explicitly invoked local SteamCMD operation.
   Publishing is not part of build, validation, packaging, Git hooks, pushes,
   version bumps, or CI.

The release packager must not assume metadata filenames or content roots from
another mod template. Confirm EU5's actual metadata and Workshop folder
requirements against the installed game before implementing the package
allowlist or calling an artifact installable.

## Stable configuration

`config/workshop.json` records:

- Steam App ID `3450310`;
- exactly one configured channel, `stable`;
- `publishedFileId: null` until the user creates the item;
- intended public visibility; and
- the future packaged artifact directory.

After creation, record the returned `PublishedFileId` in this version-controlled
file. Do not store account credentials, SteamCMD state, tokens, or session
files in this configuration. No Workshop ID has been created as part of this
setup.

## Release inputs and preflight

Before a future publish command can proceed, it must generate and show a
release summary containing the mod version, supported EU5 version, selected
channel and App ID, existing item ID or proposed item creation, included
packages and pinned source versions, changelog, Workshop description,
attribution, and credits. Missing release information or undocumented
redistribution permission is a validation failure, not a warning.

The preflight must verify all of the following:

1. Build completed successfully.
2. Validation passed against the final assembled package.
3. No unresolved integration conflicts remain.
4. The destination is the configured stable item and visibility is explicit.
5. Required third-party attribution and redistribution permissions are
   documented.
6. A release summary, mod version, description, credits, attribution, and
   changelog have been generated and reviewed.
7. The packaged content has been installed and tested locally before a public
   release.

If `publishedFileId` is `null`, present the action as **create a new public
stable Workshop item**. Require an additional explicit confirmation before
creation, then record the ID returned by Steam. For updates, display the
resolved existing ID and require confirmation immediately before upload.
Never offer an unattended `--yes` or CI publishing path. Steamworks documents
that a submitted item update cannot be canceled, so the final confirmation
must happen after the human has reviewed the exact target and release summary.

## Local SteamCMD authentication

Once local publishing is implemented and SteamCMD is separately authorized
and installed, the publisher will invoke SteamCMD locally with a generated
Workshop item VDF descriptor pointing only at the clean stable artifact and
configured App ID/PublishedFileId, using SteamCMD's
`workshop_build_item <item.vdf>` operation. This is separate from the
Node.js build and packaging stages.

Authentication remains wholly within SteamCMD's supported interactive login
flow. The intended local sequence is:

1. Start SteamCMD interactively and enter `login <account-name>`. Enter the
   password and any Steam Guard challenge only when SteamCMD prompts for them;
   never pass them as command arguments.
2. Run the separate Europa Concordia publish command. It rebuilds or verifies
   the release artifact, prints the target item and complete release summary,
   then requires the explicit human confirmation described above.
3. Only after confirmation does the publisher invoke SteamCMD's
   `workshop_build_item <item.vdf>` against the clean stable artifact.
4. Verify SteamCMD's completion result and the resulting Workshop item. If
   this was first-time item creation, record the returned PublishedFileId in
   `config/workshop.json` after reviewing the created item.

Steam Guard must remain enabled. Europa Concordia must never accept credentials
as CLI arguments or environment variables, prompt for them in its own UI, read
or emit SteamCMD session/config files, log auth output, or place auth data in
the repository or release artifact. Do not export or copy SteamCMD's cached
credentials. The project will not manage Steam's local authentication state.

No SteamCMD authentication or upload was performed for this setup, and
SteamCMD was not installed.

## Toolkit workflow review

The EU5 Community Mod Toolkit documents a local Python/SteamworksPy upload
tool and a GitHub Actions release workflow using SteamCMD. Useful ideas are
clean release staging, a dry-run summary, explicitly configured Workshop
item IDs, and separating content from Workshop page metadata.

Europa Concordia does not adopt the toolkit's GPL-licensed implementation,
Python dependency, or automatic workflow. The documented Actions workflow can
use a cached `STEAM_CONFIG_VDF` repository secret and configurable push,
pull-request, or nightly publishing triggers. Those credential and automation
choices conflict with Europa Concordia's authentication and explicit-human-
confirmation requirements. Its documented Steam Guard-off alternative is
also expressly rejected. No GitHub Actions workflow or secrets are configured.

## References

- [Valve SteamCMD documentation](https://developer.valvesoftware.com/wiki/SteamCMD)
- [Steamworks Workshop implementation](https://partner.steamgames.com/doc/features/workshop/implementation)
- [Steamworks ISteamUGC API](https://partner.steamgames.com/doc/api/ISteamUGC)
- [EU5 Community Mod Toolkit](https://github.com/Europa-Universalis-5-Modding-Co-op/community-mod-toolkit)
- [Toolkit Upload Tool](https://github.com/Europa-Universalis-5-Modding-Co-op/community-mod-toolkit/wiki/Upload-Tool)
- [Toolkit Release Workflow](https://github.com/Europa-Universalis-5-Modding-Co-op/community-mod-toolkit/wiki/Release-Workflow)
