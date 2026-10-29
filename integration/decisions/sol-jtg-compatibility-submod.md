# Standard of Living and Just Goods

## Sources

- Standard of Living package: `standard-of-living`
- Just Goods package: `just-goods`
- Compatibility package: `sol-jtg-compatibility-submod`
- Concordia target EU5 version: `1.4.5`

## Living-standard panel resolution

Standard of Living and its SOL/JTG compatibility submod both provide
`in_game/gui/panels/situation/global_living_standard.gui`. Concordia selects
the compatibility submod's file because that package is the upstream
integration layer for the enabled Standard of Living and Just Goods packages.

Any additional package colliding at this path invalidates the exact resolution
and fails the build for a new integration decision.
