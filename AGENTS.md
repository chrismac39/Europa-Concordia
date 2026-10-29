# EU5 development rules

- Treat the installed EU5 vanilla files as the primary reference for scripting
  syntax, definitions, and game behavior. Inspect actual vanilla definitions
  before introducing triggers, effects, modifiers, or other game objects; do
  not invent unsupported syntax or definitions.
- Treat all vanilla game files as strictly read-only. Never edit, format,
  copy into the repository, or commit files from the game installation.
- Preserve imported package source content. Keep compatibility work in
  separately reviewable maintained patches or integration overrides, with a
  written decision explaining the change.
- Preserve the required EU5 file encoding, BOM, indentation, and line endings
  in newly authored or generated game files. Follow the path-scoped rules in
  `.editorconfig`; do not apply Paradox formatting to unrelated `.txt` or
  `.yml` files, TypeScript, or documentation.
- Validate the final assembled all-in-one output, not only individual package
  inputs. Unresolved collisions or conflicts must not be silently discarded.
- Keep machine-specific paths, including the local EU5 installation path, in
  ignored local configuration where possible. Do not commit machine-specific
  settings.
