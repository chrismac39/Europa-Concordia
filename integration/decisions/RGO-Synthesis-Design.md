# RGO - Synthesis design proposal

## Status

This is an initial design proposal, not a finalized crop map or production
specification. The `rgo-synthesis` profile targets EU5 1.4.5 and currently
reuses RGO Harmony's compatibility payload unchanged. It retains the same
required playset: Community Mod Framework, More Locations, Global Historical
RGOs, and Just Goods 1.1. Fruits Expanded is not a dependency; the custom
Synthesis mod is intended to take its place in the playset.

No Synthesis goods, location assignments, consolidation rules, or production
changes are implemented by this initial scaffold.

## Objective

Develop a standalone agricultural RGO overhaul that improves historical
geographic representation while reducing unnecessary commodity granularity.
RGOs should represent distinct agricultural systems, economic activities, or
historically meaningful geographic differences—not every botanical species.
The intended timeframe is 1337–1836, including the Columbian Exchange and
subsequent crop spread between the Old and New Worlds.

## Proposed new RGOs

The following five categories are proposed to fill gaps in existing goods.
Their definitions, map coverage, food status, and implementation details
remain to be researched.

| Origin    | Proposed ID                 | Agricultural representation                                                                                                       |
| --------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Old World | `coconut`                   | Coconut-palm agriculture across the Indian Ocean, Southeast Asia, and Pacific islands; food, oil, fiber, and other palm products. |
| Old World | `taro`                      | Taro, cultivated yams, and related tropical tubers, especially in Southeast Asia, Oceania, and parts of Africa.                   |
| New World | `cassava`                   | Indigenous tropical American root crops, especially manioc, with later introduction to Africa and Asia.                           |
| Old World | `old_world_tropical_fruits` | Jackfruit, breadfruit, durian, rambutan, mangosteen, langsat, and similar tropical tree crops.                                    |
| New World | `new_world_tropical_fruits` | Avocado, guava, sapote, cherimoya, other indigenous American tree fruits, and regional tree nuts.                                 |

Nuts are intended to be represented within the appropriate tree-fruit
categories rather than as a separate RGO.

## Fruits Expanded consolidation candidates

These are candidates for evaluation, not approved decisions:

| Existing RGOs                     | Candidate category       | Question to resolve                                                                  |
| --------------------------------- | ------------------------ | ------------------------------------------------------------------------------------ |
| Apple, Western Pear, Eastern Pear | Temperate Orchard Fruits | Whether these share a sufficiently similar orchard economy to justify consolidation. |
| Cherry, Plum, Peach               | Stone Fruits             | Whether a shared category preserves meaningful geography and economic distinctions.  |
| Lemon, Orange, Mandarin           | Citrus                   | Whether the closely related citrus goods should share one economic category.         |
| Fig, Pomegranate                  | Mediterranean Fruits     | Whether this grouping represents Mediterranean and semi-arid cultivation well.       |

Potential distinct goods to evaluate include banana, mango, lychee,
persimmon, pineapple, sweet potato, and grape. Persimmon's separate
representation is explicitly undecided. Grape should remain a raw agricultural
commodity if retained, with its relationship to vanilla wine production
reviewed separately.

## Generic fruit and dates

The proposal is to repurpose the existing generic `fruit` RGO to represent
date-palm agriculture while retaining the identifier for compatibility.
Potential areas include the Arabian Peninsula, Mesopotamian and Persian Gulf
oases, Saharan oases, irrigated regions of North Africa and Egypt, and
adjacent suitable areas. The actual location list and compatibility behavior
remain undecided.

## Possible grape-to-wine production-chain reform

Vanilla EU5 has `wine` as a directly extracted RGO, while Fruits Expanded
adds grapes as a separate agricultural good. One possible reform is:

`Grape RGO → Winery Building → Wine Good`

This would replace or remove directly extracted wine RGOs, make wine
exclusively manufactured, and require wineries to consume grapes and employ
workers. This is a separate, broader production-chain proposal. Inspect the
vanilla winery and orchard building definitions before deciding whether or
how to implement it.

## Implementation principles

1. Prefer broad, economically meaningful agricultural categories over
   botanical specificity.
2. Preserve historically meaningful Old World versus New World distinctions.
3. Represent pre-1337 cultivation accurately and account for later crop
   introductions through appropriate geographic or chronological mechanics.
4. Prefer food-producing RGOs where historically appropriate.
5. Avoid new commodities when existing broader goods adequately represent
   the agricultural economy.
6. Evaluate consolidations separately from the five proposed new RGOs.
7. Maintain compatibility with EU5 1.4.5, Just Goods 1.1, More Locations, and
   the existing RGO Harmony ecosystem where practical.

## Desired outcome

The goal is greater historical and economic differentiation with fewer
unnecessary commodity types—not simply increasing the total number of RGOs.
The intended system would distinguish European temperate orchards,
Mediterranean fruit cultivation, Middle Eastern and Saharan date palms,
Old World tropical orchards and tubers, New World tropical orchards and
tubers, and Pacific coconut-based agricultural economies.
