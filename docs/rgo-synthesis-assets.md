# RGO Synthesis image assets

This repository keeps the RGO Synthesis PNG and DDS files that are part of the
mod payload. The image compositor, vanilla-icon importer, and DDS converter
are maintained only in the standalone EU5 Image Tools repository; there are no
image dependencies or generator scripts in Concordia.

Use the standalone tools to read the mod's existing trade-good PNGs, import
selected vanilla DDS icons as local modifier overlays, and write generated PNG
variants back into this repository. Then convert the target graphics tree to
DDS. See the standalone repository's README for setup and full usage.

From the standalone tools repository root, set `$modRoot` to the Concordia
checkout and use paths like these:

```powershell
$modRoot = "C:\path\to\Europa-Concordia"
$graphics = Join-Path $modRoot "integration\patches\rgo-synthesis\main_menu\gfx"
$goods = Join-Path $graphics "interface\icons\trade_goods"
$modifierTypes = Join-Path $graphics "interface\icons\modifier_types"

foreach ($modifier in @("positive", "negative", "inflation", "pop_demand")) {
  & .\.venv\Scripts\python.exe scripts\assets\build_modifier_icons.py `
    --all-goods --modifier $modifier `
    --source-dir $goods `
    --modifier-dir input\modifiers `
    --output-dir $modifierTypes `
    --overwrite
}

& .\.venv\Scripts\python.exe scripts\assets\convert_rgo_images.py `
  --source $graphics --dds-output $graphics
```

Use the standalone vanilla-icon importer first if a vanilla DDS should replace
one of the bundled badges. Map it to the matching modifier ID (for example,
`positive`) so the compositor uses that local PNG. Vanilla files are read-only;
the importer writes selected PNGs under the standalone repository's ignored
`input/modifiers/` directory.

Generated files remain ordinary RGO Synthesis patch assets. When adding new
files, include their source and target paths in
`profiles/rgo-synthesis.json`; builds include explicitly declared files, not
the entire asset directory.
