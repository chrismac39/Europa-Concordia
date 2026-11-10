import argparse
import io
import struct
import sys
from pathlib import Path

from PIL import Image


REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SOURCE = Path(
    "integration/patches/rgo-synthesis/main_menu/gfx"
)
DEFAULT_PREVIEW_OUTPUT = Path(".local/rgo-synthesis-image-previews")
DDS_HEADER_SIZE = 128
DDSD_MIPMAPCOUNT = 0x20000
DDSCAPS_COMPLEX = 0x8
DDSCAPS_MIPMAP = 0x400000


def repository_path(value: str | Path) -> Path:
    path = Path(value)
    if not path.is_absolute():
        path = REPOSITORY_ROOT / path
    return path.resolve()


def is_trade_good_icon(relative_path: Path) -> bool:
    return relative_path.parent.parts[-2:] == ("icons", "trade_goods")


def is_trade_good_illustration(relative_path: Path) -> bool:
    parts = relative_path.parent.parts
    expected = ("icons", "trade_goods", "illustrations")
    return any(
        parts[index : index + 3] == expected
        for index in range(len(parts) - 2)
    )


def resize_rgba(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    return (
        image.convert("RGBa")
        .resize(size, resample=Image.Resampling.LANCZOS)
        .convert("RGBA")
    )


def mip_chain(image: Image.Image) -> list[Image.Image]:
    levels = [image]
    while levels[-1].size != (1, 1):
        width, height = levels[-1].size
        size = (max(1, width // 2), max(1, height // 2))
        levels.append(resize_rgba(levels[-1], size))
    return levels


def save_dxt5_mip_chain(image: Image.Image, dds_path: Path) -> int:
    levels = mip_chain(image)
    header: bytearray | None = None
    compressed_levels: list[bytes] = []

    for level in levels:
        encoded = io.BytesIO()
        level.save(encoded, format="DDS", pixel_format="DXT5")
        data = encoded.getvalue()
        if len(data) < DDS_HEADER_SIZE or data[84:88] != b"DXT5":
            raise RuntimeError("Pillow did not produce a DXT5 DDS mip level")
        if header is None:
            header = bytearray(data[:DDS_HEADER_SIZE])
        compressed_levels.append(data[DDS_HEADER_SIZE:])

    if header is None:
        raise RuntimeError("Cannot write an empty DDS mip chain")

    flags = struct.unpack_from("<I", header, 8)[0] | DDSD_MIPMAPCOUNT
    struct.pack_into("<I", header, 8, flags)
    struct.pack_into("<I", header, 28, len(levels))
    caps = struct.unpack_from("<I", header, 108)[0]
    struct.pack_into(
        "<I",
        header,
        108,
        caps | DDSCAPS_COMPLEX | DDSCAPS_MIPMAP,
    )
    dds_path.write_bytes(bytes(header) + b"".join(compressed_levels))
    return len(levels)


def convert_image(
    source_path: Path,
    relative_path: Path,
    dds_output: Path,
    preview_output: Path,
    icon_size: int,
    illustration_size: tuple[int, int],
) -> tuple[int, int]:
    with Image.open(source_path) as source:
        source.load()
        image = source.convert("RGBA")

    if is_trade_good_icon(relative_path):
        if image.width != image.height:
            raise ValueError(
                f"Trade-good icons must be square: {source_path} is "
                f"{image.width}x{image.height}"
            )
        target_size = (icon_size, icon_size)
    elif is_trade_good_illustration(relative_path):
        target_size = illustration_size
    else:
        target_size = image.size

    if image.size != target_size:
        image = resize_rgba(image, target_size)

    png_path = preview_output / relative_path
    dds_path = dds_output / relative_path.with_suffix(".dds")
    png_path.parent.mkdir(parents=True, exist_ok=True)
    dds_path.parent.mkdir(parents=True, exist_ok=True)

    image.save(png_path, format="PNG")
    mip_count = save_dxt5_mip_chain(image, dds_path)

    with dds_path.open("rb") as dds_file:
        header = dds_file.read(DDS_HEADER_SIZE)
    if (
        len(header) < DDS_HEADER_SIZE
        or header[84:88] != b"DXT5"
        or struct.unpack_from("<I", header, 28)[0] != mip_count
    ):
        raise RuntimeError(f"Expected a DXT5 DDS file at {dds_path}")

    return image.size


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Convert Synthesis PNG assets to BC3/DXT5 DDS. PNGs directly "
            "inside icons/trade_goods are resized to a square icon size, and "
            "trade-good illustrations are resized to their configured size. "
            "Other images retain their source dimensions."
        )
    )
    parser.add_argument(
        "--source",
        default=str(DEFAULT_SOURCE),
        help="Root to scan recursively for PNG files.",
    )
    parser.add_argument(
        "--dds-output",
        help="Root for DDS files. Defaults to --source, preserving relative paths.",
    )
    parser.add_argument(
        "--preview-output",
        default=str(DEFAULT_PREVIEW_OUTPUT),
        help="Root for PNG previews (default: .local/rgo-synthesis-image-previews).",
    )
    parser.add_argument(
        "--icon-size",
        type=int,
        default=128,
        help="Square output size for trade-good icons (default: 128).",
    )
    parser.add_argument(
        "--illustration-width",
        type=int,
        default=1080,
        help="Output width for trade-good illustrations (default: 1080).",
    )
    parser.add_argument(
        "--illustration-height",
        type=int,
        default=440,
        help="Output height for trade-good illustrations (default: 440).",
    )
    args = parser.parse_args()

    for argument_name, dimension in (
        ("--icon-size", args.icon_size),
        ("--illustration-width", args.illustration_width),
        ("--illustration-height", args.illustration_height),
    ):
        if dimension <= 0 or dimension % 4 != 0:
            parser.error(f"{argument_name} must be a positive multiple of 4")

    source_root = repository_path(args.source)
    if not source_root.is_dir():
        parser.error(f"Source directory does not exist: {source_root}")
    dds_output = repository_path(args.dds_output or source_root)
    preview_output = repository_path(args.preview_output)

    png_files = sorted(
        (
            path
            for path in source_root.rglob("*")
            if path.is_file() and path.suffix.lower() == ".png"
        ),
        key=lambda path: path.as_posix().casefold(),
    )
    if not png_files:
        parser.error(f"No PNG files found under {source_root}")

    failures: list[tuple[Path, Exception]] = []
    for source_path in png_files:
        relative_path = source_path.relative_to(source_root)
        try:
            width, height = convert_image(
                source_path,
                relative_path,
                dds_output,
                preview_output,
                args.icon_size,
                (args.illustration_width, args.illustration_height),
            )
        except (OSError, ValueError, RuntimeError) as error:
            failures.append((source_path, error))
            continue
        print(
            f"{relative_path}: {width}x{height} PNG preview and BC3/DXT5 DDS"
        )

    if failures:
        for source_path, error in failures:
            print(f"Failed {source_path}: {error}", file=sys.stderr)
        return 1

    print(
        f"Converted {len(png_files)} PNG file(s); "
        f"DDS output: {dds_output}; PNG previews: {preview_output}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
