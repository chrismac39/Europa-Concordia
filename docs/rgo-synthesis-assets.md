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
128 × 128 by default. Icons must be square before resizing. PNGs under
`interface/icons/trade_goods/illustrations/` are resized to 1080 × 440 by
default. Both sizes can be changed with command-line options. Other images,
including `interface/illustrations/bg/` backgrounds, keep their source
dimensions. Every image is encoded as BC3/DXT5 DDS with alpha support.

The resized PNG previews are written under
`.local/rgo-synthesis-image-previews/`, preserving the source tree structure.
Change the icon or illustration sizes and paths with `--icon-size`,
`--illustration-width`, `--illustration-height`, `--source`, `--dds-output`,
and `--preview-output`; run the script with `--help` for details.

The current profile build includes explicitly declared file patches, not an
entire asset directory. After generating DDS files, add their source and
target paths to `profiles/rgo-synthesis.json` before building the mod.
