# Oikoumenē language-file base

## Scope and implementation

This record implements Decision 3 from `decision-votes.md` for EU5 1.4.5.
The affected packages and pins are:

- `oikoumene`, version `0.19.0`, Git revision
  `c246398bf3e3984f27be2731c86c1bef9a313f05`;
- `ruthenia-steppe-fix`, version `11.3.1`, Git revision
  `34e802343e7d452ce264be1c9d2e0c22caa8475d`.

The vote selects Oikoumenē as the base. Both packages define the same
top-level language identifiers in all seven colliding files, and their data
differs substantially. Since the vote does not specify any Ruthenia and Steppe
Fix exceptions to port, Concordia uses Oikoumenē's complete file at each
collision rather than constructing an unvoted hybrid:

- `in_game/common/languages/00_anatolia.txt`
- `in_game/common/languages/00_caucasus.txt`
- `in_game/common/languages/00_polish.txt`
- `in_game/common/languages/00_russian.txt`
- `in_game/common/languages/00_steppes.txt`
- `in_game/common/languages/00_tartar.txt`
- `in_game/common/languages/00_xinjiang.txt`

The exact package sets and winners are recorded in
`config/conflict-rules.json`. Neither upstream snapshot is modified.

## Verification

The build validator checks that each resolution names exactly the two
colliding packages and that the selected package is enabled. Re-run full
analysis and build validation after future package changes; any new collision
participant invalidates these exact resolutions.
