# Development setup

## VS Code extensions

Install the recommendations in `.vscode/extensions.json`:

- `unlomtrois.pdxl` provides EU5-aware indexing, validation, navigation, and
  Paradox script formatting.
- `dragon-archer.paradox-highlight` provides Paradox syntax highlighting.
- `EditorConfig.EditorConfig` reads the repository's path-scoped formatting
  rules.

CWTools is not removed or disabled; it can remain installed for Stellaris.
The syntax highlighter is not another EU5 language server. Do not add a
competing EU5 language server or a second game-file formatter.

## Local EU5 path and pdxl index

The workspace setting `.vscode/settings.json` is intentionally ignored by
Git. Set it locally to the `game` directory of the Steam installation:

```json
{
  "pdxl.game": "eu5",
  "pdxl.gamePathEu5": "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Europa Universalis V\\game"
}
```

The managed language server is not bundled with the extension. This workstation
has the verified pdxl 0.141.0 EU5 server at
`%LOCALAPPDATA%\EuropaConcordia\pdxl\0.141.0\pdxl.exe`; the ignored local
settings file points `pdxl.serverPath` there. Other machines can use pdxl's
**Install/Update Language Server** command or set their own local server path.

The configured installation is verified at:

`C:\Program Files (x86)\Steam\steamapps\common\Europa Universalis V`

The `game` directory contains `in_game`, `main_menu`, `dlc`, and other game
data. Script definitions are under paths such as
`game/in_game/common/advances/`; localization is under
`game/main_menu/localization/`. Sample vanilla script and localization files
were confirmed to use UTF-8 with BOM and LF line endings.

Open the repository folder as the VS Code workspace. On first activation,
pdxl may offer to install its language-server binary. Accept the offer, or run
**pdxl: Install/Update Language Server** from the Command Palette. To verify
that indexing completed:

1. Run **pdxl: Show Server Log** and check for the EU5 workspace and configured
   vanilla game path without path or indexing errors.
2. Open a repository EU5 script reference and use **Go to Definition** on a
   vanilla symbol. Confirm the destination is inside the read-only Steam
   `game` directory.
3. Use **Go to File** to open
   `game/in_game/common/advances/0_age_of_absolutism.txt` and inspect its
   definitions. Do not save or format it.

The installed server was also queried directly through LSP against this
read-only game tree. Go to Definition on `sanitation_advance` in
`game/in_game/common/advances/culture_tuscan.txt` (the `requires` entry at
line 374) resolved to
`game/in_game/common/advances/0_age_of_absolutism.txt` (line 6). The server
reported an EU5 index of 324,560 symbols for this installation.

The VS Code extension itself does not include the managed server executable;
it can install or update the matching server build. Do not copy vanilla files
into the repository to make indexing work.

## Encoding and formatting

The community toolkit recommends UTF-8 BOM for EU5 `.txt`, `.yml`, and `.gui`
files, tab indentation for game script, and one-space indentation for
localization YAML. These conventions are restricted here to files under
package or integration game-content paths; generic `.txt`/`.yml` files and
TypeScript are not assigned Paradox-specific indentation or BOM settings.

The toolkit's published editor guide describes LF, but its current
`.editorconfig` and `.gitattributes` specify CRLF. To resolve that discrepancy,
the repository follows inspected vanilla EU5 files: UTF-8 BOM and LF. The
repository-wide Git default is LF, with CRLF retained for Windows batch files.
Prettier and ESLint continue to apply to the TypeScript tooling independently.

## Mod metadata and release conventions

The toolkit documents EU5 mod metadata at `.metadata/metadata.json`, including
name, ID, version, game ID, supported game version, description, and tags. Its
development/release convention separates `.dev` metadata and thumbnails, then
creates a release folder containing metadata and game data such as `in_game/`
and `main_menu/`.

Its Workshop workflow uploads configured release files and Workshop page
content, change notes, and thumbnails through a Python tool and Steamworks
dependencies, with Steam running. Europa Concordia does not import or run that
GPL-licensed toolkit, add Python tooling, or implement Workshop publishing in
this setup. These metadata and release conventions are reference material for
a future packaging design; the current build output still requires
verification against actual EU5 mod requirements.

References:

- [Community Mod Toolkit](https://github.com/Europa-Universalis-5-Modding-Co-op/community-mod-toolkit)
- [Editor and Git Configuration](https://github.com/Europa-Universalis-5-Modding-Co-op/community-mod-toolkit/wiki/Editor-and-Git-Configuration)
- [Mod Template](https://github.com/Europa-Universalis-5-Modding-Co-op/community-mod-toolkit/wiki/Mod-Template)
- [Upload Tool](https://github.com/Europa-Universalis-5-Modding-Co-op/community-mod-toolkit/wiki/Upload-Tool)
