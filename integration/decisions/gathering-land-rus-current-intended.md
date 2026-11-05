# Gathering the Land of the Rus in current-intended

## Selected source

- Package: `gathering-land-rus`, Workshop item `3652214415`
- Version: `1.1.0`, targeting EU5 `1.4.5`
- The pinned source snapshot matches the downloaded Workshop folder: 176 files,
  SHA-256 `5a9e71ec9a70e55c069a084c479994b4a9884960692da44f371cfcf841d96037`.
- The mod is selected after Continental Hegemonies in
  `profiles/current-intended.json`.

## Concordia decisions

Keep all distinct callbacks on the game-start, monthly, yearly, biyearly,
four-yearly, and new-ruler on-actions. The registrations are additive; no
callback is dropped or replaced. The existing MRC Concordia replacement still
preserves its safe-default initialization and removes only MRC's CMM
registration hooks.

Merge the named-color definitions by key. Gathering's borderland and Chernorus
colors do not duplicate Just Goods' goods colors. The analyzer now permits this
native merge only when every definition is a simple named-color map and all
top-level color keys are unique; duplicate keys remain unresolved for review.

These are native game merges, so no replacement definitions are generated for
the approved on-actions or named colors.

## Runtime audit

Static analysis identifies active country-tag overlap with Just Goods (8 tags)
and More Unique Urban Rights (5 tags). It found no concrete path or definition
conflict from those overlaps alone. Verify the combined gameplay in a Rus
campaign.

The separately sourced Historical Tweaks and Imperial Ambitions mods are not
selected by this step.
