# More Unique Urban Rights compatibility decision

## Source and profile

- Steam Workshop item: `3745922649`
- Upstream author: `Agamenton`
- Upstream version: `1.1.9`
- Upstream-supported EU5 version: `1.4.*`
- Concordia target EU5 version: `1.4.5`
- EU5 metadata ID: `aga_urban_rights`
- Source checksum: `sha256:0890345be7f2114eef933edd2bbabc8c3c2193fdc8dd691989f4d40ede41ddeb`

The profile keeps More Unique Urban Rights as a separate Workshop mod. Its
source is an analysis input only; Concordia does not bundle its definitions,
graphics, or localization.

## Compatibility choice

Static comparison found no town-right definition IDs overlapping the installed
vanilla `town_rights` definitions, and the selected-mod analyzer found no
cross-package findings for this package. The upstream town-rights source does,
however, note that some new textile rights should be exclusive with vanilla
rights.

The `aga_tr_bengal_muslin` and `aga_tr_indoaryan_jamdani` allow conditions
already reject Royal Textile Rights and each other. Vanilla
`royal_textile_rights` only rejects `flemish_cloth_industries_right`, so the
vanilla right could still be granted after one of the new rights. The user
approved a focused Concordia-authored patch to make this restriction
bidirectional.

The patch uses `INJECT:royal_textile_rights` and replaces only its nested
`allow` block. Because nested blocks are not deep-merged, the patch repeats
the full vanilla allow condition for Flemish cloth industries and adds checks
for both new rights. It does not replace the complete vanilla definition or
copy upstream content.

## Remaining runtime checks

Static validation does not prove that the engine applies the injected
eligibility condition as intended. In-game, confirm that either acquisition
order prevents the two rights from coexisting, that the Flemish cloth-industry
restriction remains in effect, and that other town rights behave normally.
