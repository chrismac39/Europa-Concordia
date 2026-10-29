# Dynastic Bloodlines compatibility maintenance

## Source

- Steam Workshop item: `3790115532`
- Upstream author: `bagetbaget`
- Upstream version: `0.9.39`
- Upstream-supported EU5 version: `1.3.x`
- Concordia target EU5 version: `1.4.5`

The source snapshot under `sources/steam-workshop/3790115532` is immutable and
must not be edited in place. It remains disabled while compatibility work and
redistribution permission are unresolved.

## Maintenance approach

Record compatibility changes under
`integration/patches/dynastic-bloodlines/` or
`integration/overrides/dynastic-bloodlines/`. Before enabling the package:

1. Compare the EU5 1.3 and 1.4.5 character, dynasty, event, modifier, and
   on-action definitions used by the mod.
2. Validate every scripted trigger, effect, event target, and stored value
   against EU5 1.4.5.
3. Reconcile the marriage-candidate row and character-header UI changes with
   EU5 1.4.5 and other enabled interface packages.
4. Verify new and existing campaigns, inheritance, dilution, reinforcement,
   rooted bloodlines, notifications, AI behavior, cleanup, and mod removal.
5. Obtain permission to redistribute the upstream files and maintained
   changes.

UI compatibility needs explicit conflict review because upstream modifies the
marriage candidate row and character header.
