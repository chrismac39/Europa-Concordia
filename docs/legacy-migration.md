# Legacy mod migration

Legacy compatibility work should preserve the original mod author's intended
behavior while incorporating relevant changes in newer EU5 versions. Do not
automatically rewrite source packages during the initial import.

## Three-way comparison workflow

For each migration, compare:

1. Vanilla EU5 files from the game version originally supported by the mod.
2. The original mod's changes against that vanilla baseline.
3. Vanilla EU5 files from the current target version.

Use the comparison to distinguish the mod's intentional behavior from changes
introduced by newer vanilla files. Port only the needed behavior, then review
the result in game when possible.

## Recording the port

- Keep the original upstream snapshot pinned and unchanged.
- Store compatibility changes as separately reviewable patches or overrides.
- Document source revision, old and target game versions, files affected,
  decisions, and unresolved questions in `integration/decisions/`.
- Validate collisions and attribution before producing a build.
- Do not claim compatibility until tested against the target game version.

The current scaffold provides the folder conventions but does not compare game
versions or apply migration patches.
