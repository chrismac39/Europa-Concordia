# Imperial Ambitions integration

## Source

- Steam Workshop item: `3813524452`
- Upstream author: Airdæ
- Upstream version: `1.1.0`
- Upstream-supported EU5 version: `1.4.*`
- Concordia target EU5 version: `1.4.5`

The immutable local snapshot is stored under
`sources/steam-workshop/3813524452`. Redistribution permission has not been
established.

## File-path conflicts

The initial 24-package build found four paths involving Imperial Ambitions:

- `in_game/common/customizable_localization/countries.txt` with Gathering the
  Land of the Rus;
- `in_game/common/customizable_localization/country_ranks.txt` with Gathering
  the Land of the Rus, Historical Tweaks, and The Prussian Destiny;
- `in_game/common/customizable_localization/country_name_construction.txt` with
  Historical Tweaks and The Prussian Destiny;
- `in_game/events/DHE/flavor_pap_holy_league.txt` with Historical Tweaks.

Imperial Ambitions documents all four as complete vanilla-file replacements.
Collision #2, `countries.txt`, is resolved by a Concordia-owned semantic merge.
The other three remain unresolved.

### Collision #2 merge

Of 36 shared top-level keys, 34 are identical. `KZN` and `UZB` differ:
Gathering the Rus gives each a conditional Golden Horde-vassal name, while
Imperial Ambitions provides its normal name as a fallback. The merged override
keeps the conditional text first and the fallback second. It also retains
Gathering the Rus's unique `CRI` and `NOG` definitions and Imperial Ambitions'
unique `GTH`, `SBR`, `NGY`, `NGK`, and `NTR` definitions.

The merged file is
`integration/overrides/collision-2/in_game/common/customizable_localization/countries.txt`.

#### Reference audit

No downstream reference changes are required for this merged file:

- both packages refer to the stable country tags (`KZN`, `UZB`, `CRI`, `NOG`,
  and the Imperial Ambitions successor tags), not to a selected display string;
- Gathering the Rus still supplies `KZN_ULUS`, `UZB_ULUS`, `CRI_ULUS`, and
  `NOG_ULUS` plus their adjective localization keys in English and Russian;
- the merged `KZN_ADJ`, `UZB_ADJ`, `CRI_ADJ`, and `NOG_ADJ` definitions retain
  the same parent-and-suffix behavior used by Gathering the Rus;
- Imperial Ambitions' ordinary `KZN` and `UZB` keys remain the fallback names.

The unresolved country-rank and country-name-construction files remain
separate frontier items because they control rank and grammatical presentation,
not the base country-name selection resolved here.

## Definition-level conflicts

Imperial Ambitions uses `REPLACE:` and `INJECT:` definitions in uniquely named
files, which the current path detector cannot discover as collisions. The
upstream compatibility notes list disasters, the Rise of Timur situation,
buildings, an advance, government definitions, subject types, peace treaties,
and other vanilla definitions.

The `REPLACE:horde_civil_war` definition is already confirmed to overlap the
Gathering the Land of the Rus and Ruthenia and Steppe Fix disaster work.
Historical Tweaks contains additional Rise of Timur content, while National
Destinies contains Ilkhanate and formable-country content. These need
definition-level review before Imperial Ambitions can be considered integrated.

Gathering the Rus and Imperial Ambitions also each implement Golden Horde
collapse, successor-state creation, and KZN/UZB lifecycle events through
differently named on-actions, scripted effects, triggers, and event files. That
system-level overlap is part of frontier #3 even where no file paths collide.

Keep the source snapshot unchanged. Record merged definitions under
`integration/patches/imperial-ambitions/` or selected complete replacements
under `integration/overrides/imperial-ambitions/`, with exact conflict rules
where applicable.
