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
