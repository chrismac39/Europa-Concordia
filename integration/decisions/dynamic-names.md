# Dynamic country names and ranks

## Scope and implementation

This record implements Decisions 1 and 2 from `decision-votes.md` for EU5
1.4.5. The imported source snapshots remain unchanged. Concordia uses complete
file overrides at:

- `overrides/dynamic-names/in_game/common/customizable_localization/country_ranks.txt`
- `overrides/dynamic-names/in_game/common/customizable_localization/country_name_construction.txt`

The rank merge starts from Historical Tweaks; the name-construction merge
starts from Imperial Ambitions so its country-specific rules remain ahead of
generic construction rules. Identical rules are kept once, package-specific
rules are retained, and changed trigger variants for the same presentation
rule are combined as alternatives. This is display-only behavior; these
customizable-localization rules do not fire events or mutate gameplay state.

## Decision 1 — Country ranks

The merge includes Gathering the Land of the Rus, Historical Tweaks, Imperial
Ambitions, and The Prussian Destiny. The union policy was confirmed by the user
on 2026-10-29 after reviewing the different activation conditions.

All nine shared rules with different triggers are represented in the override.
The union intentionally preserves the broader eligibility in the Rus variant
where it differs from the other three packages, including:

- LIT's kingdom eligibility for the grand-duchy title;
- steppe-horde title eligibility without the other packages' kingdom-rank
  guard;
- crown-name eligibility for POL as well as the Rus crown-variable branch for
  ARA/BOH/CAS;
- the Rus theocracy branch for the Muslim empire title;
- Serbian/Croatian language eligibility for voivode;
- ANR's broader principality branch and Imperial Ambitions' Upper Hungary
  state branch;
- the Rus archduchy branch without the other packages' ruler/reform timing
  guard; and
- the Rus heir-viscount branch without the other packages' rank guard.

The union also keeps The Prussian Destiny's NGC confederation title. The other
package-specific rank and title rules are retained rather than dropped.

## Decision 2 — Country-name construction

The merge includes Historical Tweaks, Imperial Ambitions, and The Prussian
Destiny. It retains all package-specific construction rules, including
Imperial Ambitions' eastern-Hungary, guarded-domains, prefix-rank, Algiers
regency, and Shirvanshah rules, plus The Prussian Destiny's NGC rule.

The union of the four changed shared rules preserves these activation
differences:

- name construction includes Historical Tweaks' custom-name/PAP conditions,
  Imperial Ambitions' state- and TUR-specific conditions, and NGC;
- prefix-rank-of-name includes the Hafsid state condition and the AQQ/QAR
  branches;
- prefix-name-rank includes MAL and Imperial Ambitions' ATR/KZN/SBR/UZB
  branches; and
- prefix-adjective-rank includes the shared group and Imperial Ambitions'
  CRI branch.

## Verification

The exact package sets and overrides are registered in
`config/conflict-rules.json`. Re-run analysis and the final build after
additional integrations; other unresolved collisions or semantic findings
remain independent of these two path resolutions.
