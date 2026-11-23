# RGO Synthesis image assets

Use the bulk converter to create DDS files from authored PNG images. It
recursively scans the Synthesis graphics source tree, leaves the original PNGs
unchanged, and writes converted DDS files beside them while preserving their
relative paths.

## Set up the converter

From the repository root, create a local Python environment and install the
image dependency:

```powershell
py -m venv .local\rgo-synthesis-image-venv
.local\rgo-synthesis-image-venv\Scripts\python.exe -m pip install -r scripts\assets\requirements.txt
```

## Convert images

Put source PNGs under
`integration/patches/rgo-synthesis/main_menu/gfx/`, then run:

```powershell
.local\rgo-synthesis-image-venv\Scripts\python.exe scripts\assets\convert_rgo_images.py
```

PNG files directly inside `interface/icons/trade_goods/` are resized to
128 × 128 by default. PNGs directly inside `interface/icons/modifier_types/`
are resized to 64 × 64, matching the Just Goods modifier icon assets. Both
icon categories are fitted inside a transparent square canvas without
stretching. PNGs under
`interface/icons/trade_goods/illustrations/` are fitted to 1080 × 440 by
default. Other images, including `interface/illustrations/bg/` backgrounds,
keep their source dimensions.
Name trade-good icons and their illustrations `icon_goods_<good_id>.png`;
the converter preserves that name for the generated DDS.

The default DDS format is uncompressed **B8G8R8A8**: four 8-bit channels per
pixel, stored as B, G, R, A bytes, with DDS channel masks describing the color
and alpha channels. This avoids BC block-compression artifacts and preserves
partial alpha. BC3/DXT5 remains available as a legacy option. Both formats use
a complete mip chain by default, preserving the previous pipeline's mipmap
behavior; use `--mipmaps none` to write only the base level.
For a 128 × 128 icon, the full-chain B8G8R8A8 file is 87,508 bytes; without
mipmaps it is 65,664 bytes. The previous BC3/DXT5 file with eight mip levels
was 22,000 bytes.

Downscaling uses Lanczos on premultiplied-alpha pixels, then converts back to
straight RGBA for PNG previews and DDS output. The converter does not apply an
ICC profile or otherwise transform the source color values. Transparent RGB
values are premultiplied during filtering so hidden colors do not bleed into
visible edge pixels.

The 128 × 128 resized PNG preview is always written under
`.local/rgo-synthesis-image-previews/`, preserving the source tree structure.
Optional `--decoded-preview-output` and `--small-preview-output` roots write
the DDS-decoded 128 × 128 image and a 32 × 32 downscale of that decoded image,
respectively. For example:

```powershell
.local\rgo-synthesis-image-venv\Scripts\python.exe scripts\assets\convert_rgo_images.py `
  --decoded-preview-output .local\rgo-synthesis-image-previews-decoded `
  --small-preview-output .local\rgo-synthesis-image-previews-32
```

To retain the previous compressed format:

```powershell
.local\rgo-synthesis-image-venv\Scripts\python.exe scripts\assets\convert_rgo_images.py --format bc3
```

For a typical RGO, the base trade-good icon is separate from four modifier
icon variants: positive, negative, global population demand, and inflation
impact. Just Clocks also has a guild-building-level icon for its specific
mechanics; the converter processes any PNG placed under `modifier_types/`.

## Build RGO modifier variants

`scripts/assets/build_modifier_icons.py` composes each original transparent
trade-good PNG with the supplied positive, negative, inflation, and population
demand modifier overlays. The script trims transparent padding for layout
calculations, resizes with premultiplied-alpha Lanczos filtering, and writes
1254 × 1254 RGBA masters. It never modifies the source images and does not
replace the DDS converter.

The default configuration reads the existing overlays from
`.local/rgo-synthesis-modifier-overlays/`: `Green Plus.png`, `Red Minus.png`,
`Impact Inflation.png`, and `global pop demand.png`. Each overlay is trimmed
using its alpha bounds. The supplied files have isolated alpha values around
the canvas border, so the config ignores alpha values at or below 16 when
finding the crop bounds while preserving all pixels inside those bounds.
Update the modifier directory, filenames, and sizing/placement settings in
`scripts/assets/modifier_icon_config.json` if these assets move. The default
master output directory is
`integration/patches/rgo-synthesis/main_menu/gfx/interface/icons/modifier_types`;
previews and contact sheets remain under ignored `.local/` paths.
The config's `resampling` can be `lanczos`, `bicubic`, `bilinear`, or
`nearest`; all methods resize premultiplied-alpha pixels before converting
back to RGBA.

Build all four variants for one good or every directly-contained
`icon_goods_*.png` base icon:

```powershell
.local\rgo-synthesis-image-venv\Scripts\python.exe scripts\assets\build_modifier_icons.py `
  --good cassava --all-modifiers

.local\rgo-synthesis-image-venv\Scripts\python.exe scripts\assets\build_modifier_icons.py `
  --all-goods --all-modifiers
```

Select one modifier with `--modifier positive` (also `negative`, `inflation`,
or `pop_demand`). Variants are named like
`cassava_positive.png`, `cassava_negative.png`,
`cassava_impacts_inflation.png`, and `global_cassava_pop_demand.png`.
Trade-good IDs are copied intact from `icon_goods_<trade_good>.png`, including
any underscores. A 128 × 128 alpha-preserving preview is written for each
variant; add `--no-previews` to omit them. Add
`--contact-sheet` to write a neutral-background comparison sheet (base plus
the selected variants). A separate sheet is written for each good, including
when batching. Existing master outputs are skipped by default;
`--overwrite` explicitly replaces them and refreshes previews/contact sheets.
Use `--config` to select another JSON configuration. The existing converter treats images in `modifier_types/` as 64 × 64 DDS
icons. After reviewing the masters, run the DDS converter and register the DDS
source/target paths in the RGO Synthesis profile before building; the profile
includes explicitly declared files, not the whole asset directory.

Test the compositor and converter together with:

```powershell
.local\rgo-synthesis-image-venv\Scripts\python.exe -m unittest discover -s scripts\assets -p "test_*.py"
```

Change image sizes and paths with `--icon-size`, `--modifier-icon-size`,
`--illustration-width`, `--illustration-height`, `--source`, `--dds-output`,
and `--preview-output`. Run the script with `--help` for all options.

Run the conversion tests with:

```powershell
.local\rgo-synthesis-image-venv\Scripts\python.exe -m unittest discover -s scripts\assets -p "test_*.py"
```

The current profile build includes explicitly declared file patches, not an
entire asset directory. After generating DDS files, add their source and
target paths to `profiles/rgo-synthesis.json` before building the mod.
