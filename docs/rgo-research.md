# RGO location research workflow

The research tool supports the 71 Harmony locations currently assigned generic
`fruit`, or a user-supplied list of EU5 locations. It uses public Wikidata and
Wikipedia APIs and deterministic keyword matching; it does not use an LLM or
change any RGO assignments.

## Two-stage workflow

1. Run `npm run rgo:research -- resolve`. This reads the 71-location pilot
   table in `integration/decisions/RGO-Harmony-Expanded-Inventory.md`, reads
   each location's EU5 province from the installed game's
   `in_game/map_data/definitions.txt`, searches Wikidata by each English
   in-game name, retains entities whose Wikidata type hierarchy identifies
   them as geographic places or features, and writes:
   - `reports/rgo-research/pilot-resolution.json`
   - `reports/rgo-research/pilot-resolution.md`
   - `reports/rgo-research/pilot-resolution.csv`
2. Review the candidate rows in the CSV, including the EU5 province, modern
   country/admin area, coordinates, and Wikipedia links. Set `correct` to
   `TRUE` for one candidate per confirmed location. Leave all rows `FALSE` when
   the match is uncertain. The tool deliberately never auto-selects a
   candidate.
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
  sitelinks. Candidate entities are retained only when their `instance of`
  (`P31`) type or its `subclass of` (`P279`) ancestry matches a geographic
  place/feature class, and none of that ancestry matches a person/name class.
  This excludes people, family names, ships, and other non-geographic
  namesakes, including name classes that Wikidata also classifies as
  geographic. Candidate scores are ranking aids only.
- The EU5 province is included as contextual information in both reports. It
  comes from the game's province-to-location definitions and is not itself a
  modern-country or administrative-boundary assertion. The default game path
  is the standard Steam install; set `EU5_GAME_PATH` or pass `--game-path
"C:\\path\\to\\Europa Universalis V\\game"` for another installation.
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
