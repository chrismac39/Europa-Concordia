# RGO location research workflow

The research tool supports the 71 Harmony locations currently assigned generic
`fruit`, or a user-supplied list of EU5 locations. It uses public Wikidata and
Wikipedia APIs and deterministic keyword matching; it does not use an LLM or
change any RGO assignments.

## Two-stage workflow

1. Run `npm run rgo:research -- resolve`. This reads the 71-location pilot
   table in `integration/decisions/RGO-Harmony-Expanded-Inventory.md`, reads
   each location's EU5 region, area, and province from the installed game's
   `in_game/map_data/definitions.txt`, searches Wikidata by the English name
   and again with the game geography and historical context appended, retains
   entities whose Wikidata type hierarchy identifies them as administrative
   units linked to matching geographic places, and writes:
   - `reports/rgo-research/pilot-resolution.json`
   - `reports/rgo-research/pilot-resolution.md`
   - `reports/rgo-research/pilot-resolution.csv`
2. Review the candidate rows in the CSV, including the EU5 province, modern
   administrative unit, coordinates, Wikipedia links, EU5 region/area/province
   context, and the country's area-based subdivision-scale target. The target
   is a guide, not a guarantee
   that a Wikidata candidate is exactly at that boundary tier. Standalone
   towns/cities and natural features are not candidates, though a city that is
   itself an administrative unit can qualify. Set `correct` to `TRUE` for one
   candidate per confirmed location. Leave all rows `FALSE` when the match is
   uncertain. The tool deliberately never auto-selects a candidate.
3. Run `npm run rgo:research -- research`. It reads the CSV flags and, for each
   confirmed place, retrieves article pages linked for the country's official
   languages when available. It uses the English Wikipedia page only when no
   local-language page is linked. It extracts history/economy/agriculture/
   trade/industry sections, matching year signals from 1300–1899, citation
   URLs, and matches against configured RGO crop aliases.
4. Review:
   - `reports/rgo-research/pilot-research.json`
   - `reports/rgo-research/pilot-research.md`
   - `reports/rgo-research/pilot-research.rgo-review.csv`

The RGO review CSV contains goods in the vanilla, Just Goods, and Fruits
Expanded RGO catalogs that matched crop aliases in the retrieved evidence. It
groups evidence by location and good, includes detected 1300–1899 year signals
and source URLs, and starts each `valid_rgo` field as `FALSE`. Mark a suggestion
`TRUE` only after reviewing its location-specific evidence. No RGO assignments
are changed automatically. A location with no matching RGO suggestions has no
row in this CSV.

The report's keyword matches are leads for examination, not crop recommendations.
They do not establish that the crop was grown at the precise EU5 location or in
the target historical period. Local Wikipedia articles can be incomplete, and
administrative boundaries and names have changed over time. Assess whether each
passage is about the location itself, a wider region, or a later period before
using it in an RGO decision.

Wikipedia excerpts are attributed to the linked page and revision in the
report. Wikipedia text is available under CC BY-SA; anyone redistributing
excerpts should retain attribution and follow the applicable license terms.

## Custom location input

Provide a JSON array with a stable location ID, its English EU5 name, and any
historical context that helps a human disambiguate it:

```json
[
  {
    "id": "example_location",
    "englishName": "Example",
    "context": "Historical polity or nearby reference"
  }
]
```

Run `npm run rgo:research -- resolve --input locations.json`. Paths are resolved
from the repository root. `--output path.json` changes the generated JSON path;
companion Markdown and CSV review files use `.md` and `.csv` extensions. For the
research command, `--review path.csv` can select an edited location-review CSV
other than the default file adjacent to the resolution JSON.

## APIs, cache, and limitations

- The resolver uses Wikidata search/entity endpoints for candidate names,
  coordinates, administrative links, country languages, and Wikipedia
  sitelinks. Search matches are used to find linked administrative units;
  output candidates are limited to current administrative divisions, not
  standalone settlements or natural features. Local LAU-like and broader
  NUTS-3-like units can both appear because national administrative systems
  differ. EU5 area and region names are searched independently as geographic
  context; when those results identify a clear country, candidates in other
  countries are deprioritized if a candidate in the contextual country exists.
  EU5 province, area, and region names can also boost candidates whose
  administrative ancestry aligns with that context. These are historical
  game-map hints, not modern-country or administrative-boundary assertions.
  Candidate scores are ranking aids only; boundaries and levels are not
  asserted to match historical EU5 borders.
- The EU5 region, area, and province are included as contextual information in
  both reports. They come from the game's nested map definitions and are not
  themselves modern-country or administrative-boundary assertions. The default game path
  is the standard Steam install; set `EU5_GAME_PATH` or pass `--game-path
"C:\\path\\to\\Europa Universalis V\\game"` for another installation.
- The country subdivision-scale index is stored in
  `config/rgo-research-admin-scales.json`. It uses the median land area of
  2024 LAUs in EU member countries as its reference size. For countries with
  GISCO LAU/NUTS-3 data, the index chooses whichever available tier has a
  median area closest to that reference. Elsewhere it chooses the closest
  geoBoundaries ADM1–ADM5 tier using the API's published mean area as a
  lightweight proxy for typical size. Closeness is measured by the absolute
  logarithm of the area ratio so proportional differences are compared
  consistently. Regenerate it with
  `npm run rgo:research:index`. GISCO's 2024 LAU and NUTS sources are fixed;
  geoBoundaries metadata comes from its current `gbOpen` API, so regeneration
  can update the global entries. Source and license metadata are retained for
  each entry. The index covers countries for which one of those sources
  provides usable administrative-area data.
  Sources: [Eurostat GISCO LAU 2024](https://gisco-services.ec.europa.eu/distribution/v2/lau/lau-2024-files.html),
  [Eurostat GISCO NUTS 2024](https://gisco-services.ec.europa.eu/distribution/v2/nuts/nuts-2024-files.html),
  [geoBoundaries API documentation](https://www.geoboundaries.org/api.html).
- Requests are sequential and rate-limited to at least one second per host.
  Successful JSON responses are cached in ignored
  `.local/rgo-research/api-cache.json`; cached results are reused on later runs.
- The tool makes no search-engine requests. Wikipedia coverage is selected
  through Wikidata sitelinks rather than a full-text web search. It can miss
  relevant local-language sources that are not linked to the selected place.
- Crop matching uses the aliases in `config/rgo-research-crops.json` and the
  raw-material goods assigned in the installed vanilla map, Just Goods
  compatibility map, and Fruits Expanded map, plus raw-material goods defined
  by the vanilla, Just Goods, and Fruits Expanded sources. A match is a literal
  keyword signal, not
  semantic classification.
- Reports are local review artifacts under the ignored `reports/` directory.
  No game-content files or RGO assignments are written.
