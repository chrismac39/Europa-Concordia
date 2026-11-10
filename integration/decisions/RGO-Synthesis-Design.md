# RGO - Synthesis Phase 1 design

## Status and scope

This document records the Phase 1 design currently described in the RGO
Synthesis Workshop draft, together with the previously identified compatibility
and production-chain questions. The Phase 1 RGO categories below are the
intended design direction; definitions, map assignments, balancing, and
implementation details still need to be researched and built.

The `rgo-synthesis` profile targets EU5 1.4.5 and currently reuses RGO
Harmony's compatibility payload unchanged. No Synthesis goods, location
assignments, consolidation rules, or production changes are implemented yet.
RGO Synthesis is intended to replace Fruits Expanded integration in the
playset; Fruits Expanded is not a dependency.

## Objective and design rationale

Develop a standalone agricultural RGO overhaul that improves historical
geographic representation while reducing unnecessary commodity granularity.
RGOs should represent distinct agricultural systems, economic activities, or
historically meaningful geographic differences—not every botanical species.
The intended timeframe is 1337–1836, including the Columbian Exchange and
subsequent crop spread between the Old and New Worlds.

The design responds to two issues with vanilla EU5:

- Generic `fruit` is unusually abstract compared with foodstuffs such as
  wheat, maize, potatoes, and rice, whose RGOs distinguish climate and
  geographic origin.
- Some vanilla RGOs are anachronistic for the game's timeframe, assigning
  specialized, developed agricultural activity to places where it was not
  historically significant. RGOs remain useful abstractions of agricultural
  potential and historical output, but their assignments should reflect that
  distinction.

The design also responds to two issues with Fruits Expanded:

- It adds more botanical granularity than the broader RGO system supports,
  such as separate apple and pear varieties and separate plums, peaches, and
  cherries.
- It does not isolate key staple crops such as coconuts, taro, and cassava.

Synthesis therefore groups related fruit crops into economically meaningful
categories while separately representing distinctive tropical staples and
Old World / New World agricultural origins.

## Phase 1 RGO design

### Changes from Fruits Expanded

| Synthesis category                | Fruits Expanded RGOs represented                                                                          | Design intent                                                                                             |
| --------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Temperate fruit orchards          | Apples, Western Pears, Eastern Pears                                                                      | Combine temperate orchard fruits into one economic category.                                              |
| Stone fruit orchards              | Plums, Peaches, Cherries                                                                                  | Combine related stone-fruit orchard crops.                                                                |
| Mediterranean fruit orchards      | Figs, Pomegranates                                                                                        | Represent distinctive Mediterranean and semi-arid fruit cultivation together.                             |
| Citrus orchards                   | Lemons, both Orange types, Mandarins                                                                      | Consolidate related citrus crops.                                                                         |
| Old World tropical fruit orchards | Jackfruit, breadfruit, durian, rambutan, mangosteen, and similar indigenous Old World tropical tree crops | Represent diverse Old World tropical orchards and agroforestry without individual goods for each species. |
| New World tropical fruit orchards | Avocado, guava, sapote, cherimoya, and similar indigenous New World tree crops                            | Represent diverse New World tropical orchards and agroforestry without individual goods for each species. |
| Date palms                        | Date-palm agriculture                                                                                     | Represent the distinctive date-palm economy.                                                              |
| Coconuts                          | Coconut agriculture                                                                                       | Represent a distinctive tropical staple and coconut-palm economy.                                         |
| Taro                              | Old World tropical staple crop                                                                            | Represent taro and related Old World tropical staple cultivation.                                         |
| Cassava                           | New World tropical staple crop                                                                            | Represent cassava / manioc and related New World tropical staples.                                        |

The tropical orchard categories do not absorb goods that are already
historically distinctive in the design: mango, lychee, and banana for the Old
World; pineapple, cocoa, and chili for the New World. Nuts are not a separate
RGO; they are abstracted within the appropriate tree-fruit categories.

### Differences from vanilla EU5

Synthesis divides vanilla `fruit` into geographically and climatically
meaningful agricultural categories:

- Temperate fruit orchards for continental or temperate apples and pears.
- Stone fruit orchards for regionally appropriate plums, peaches, and
  cherries.
- Mediterranean fruit orchards for figs and pomegranates.
- Citrus orchards for lemons, oranges, mandarins, and similar citrus.
- Old World tropical fruit orchards for suitable Old World tropical regions,
  including Southeast Asia.
- New World tropical fruit orchards for suitable New World tropical regions.
- Date palms, coconuts, taro, and cassava as distinct agricultural systems or
  staple crops.

The specific locations and their final RGO assignments require a separate
geographic review; these categories do not by themselves authorize a
location-by-location change.

### Date-palm compatibility

An earlier compatibility direction was to use the existing generic `fruit`
identifier for date palms where practical, retaining that identifier for
compatibility rather than introducing a new date-palm key. Confirm this
against the Phase 1 goods definitions and compatibility requirements before
implementation.

## Playset and compatibility baseline

The standalone Synthesis profile starts from RGO Harmony's current playset
and compatibility payload. Required upstream items and Workshop load order:

1. Community Mod Framework
2. More Locations
3. Global Historical RGOs
4. Just Goods
5. RGO - Synthesis

The profile pins Just Goods 1.1 and targets EU5 1.4.5. Synthesis is intended
to take Fruits Expanded's place; Fruits Expanded should not be required or
included in this playset.

## Production-chain question: grapes and wine

Vanilla EU5 has `wine` as a directly extracted RGO, while Fruits Expanded
adds grapes as a separate agricultural good. A possible broader reform is:

`Grape RGO → Winery Building → Wine Good`

This could replace directly extracted wine RGOs, make wine exclusively
manufactured, and require wineries to consume grapes and employ workers.
This production-chain change is separate from the Phase 1 agricultural
taxonomy. Inspect the vanilla winery and orchard building definitions before
deciding whether or how to implement it.

## Implementation principles

1. Favor broad, economically meaningful agricultural categories over
   botanical specificity.
2. Preserve historically meaningful Old World versus New World crop
   distinctions.
3. Represent pre-1337 cultivation accurately and account for later crop
   introductions through appropriate geographic or chronological mechanics.
4. Prefer food-producing RGOs where historically appropriate.
5. Avoid introducing additional commodities when existing broader goods
   adequately represent their agricultural economies.
6. Treat location mapping and any consolidation beyond the Phase 1 taxonomy
   as separately reviewable decisions.
7. Maintain compatibility with EU5 1.4.5, Just Goods 1.1, More Locations, and
   the existing RGO Harmony ecosystem where practical.

## Desired outcome

The goal is greater historical and economic differentiation with fewer
unnecessary commodity types—not simply increasing the total number of RGOs.
The intended system distinguishes European temperate orchards, Mediterranean
fruit cultivation, Middle Eastern and Saharan date palms, Old World tropical
orchards and tubers, New World tropical orchards and tubers, and Pacific
coconut-based agricultural economies.
