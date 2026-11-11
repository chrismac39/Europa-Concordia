import argparse
import io
import struct
import sys
from pathlib import Path

from PIL import Image


REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SOURCE = Path("integration/patches/rgo-synthesis/main_menu/gfx")
DEFAULT_PREVIEW_OUTPUT = Path(".local/rgo-synthesis-image-previews")
DDS_HEADER_SIZE = 128
DDSD_CAPS = 0x1
DDSD_HEIGHT = 0x2
DDSD_WIDTH = 0x4
DDSD_PITCH = 0x8
DDSD_PIXELFORMAT = 0x1000
DDSD_MIPMAPCOUNT = 0x20000
DDSCAPS_TEXTURE = 0x1000
DDSCAPS_COMPLEX = 0x8
DDSCAPS_MIPMAP = 0x400000
DDPF_ALPHAPIXELS = 0x1
DDPF_FOURCC = 0x4
DDPF_RGB = 0x40
BGRA_RED_MASK = 0x00FF0000
BGRA_GREEN_MASK = 0x0000FF00
BGRA_BLUE_MASK = 0x000000FF
BGRA_ALPHA_MASK = 0xFF000000
LEGACY_BC3 = "bc3"
BGRA = "b8g8r8a8"


def repository_path(value: str | Path) -> Path:
    path = Path(value)
    if not path.is_absolute():
        path = REPOSITORY_ROOT / path
    return path.resolve()


def is_trade_good_icon(relative_path: Path) -> bool:
    return relative_path.parent.parts[-2:] == ("icons", "trade_goods")


def is_modifier_type_icon(relative_path: Path) -> bool:
    return relative_path.parent.parts[-2:] == ("icons", "modifier_types")


def is_trade_good_illustration(relative_path: Path) -> bool:
    parts = relative_path.parent.parts
    expected = ("icons", "trade_goods", "illustrations")
    return any(
        parts[index : index + 3] == expected
        for index in range(len(parts) - 2)
    )


def resize_rgba(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    rgba = image.convert("RGBA")
    if rgba.size == size:
        return rgba.copy()
    return (
        rgba.convert("RGBa")
        .resize(size, resample=Image.Resampling.LANCZOS)
        .convert("RGBA")
    )


def fit_rgba(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    target_width, target_height = size
    source_width, source_height = image.size
    scale = min(target_width / source_width, target_height / source_height)
    resized_size = (
        max(1, min(target_width, round(source_width * scale))),
        max(1, min(target_height, round(source_height * scale))),
    )
    resized = resize_rgba(image, resized_size)
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    offset = (
        (target_width - resized_size[0]) // 2,
        (target_height - resized_size[1]) // 2,
    )
    canvas.alpha_composite(resized, dest=offset)
    return canvas


def mip_chain(image: Image.Image, enabled: bool) -> list[Image.Image]:
    levels = [image]
    while enabled and levels[-1].size != (1, 1):
        width, height = levels[-1].size
        size = (max(1, width // 2), max(1, height // 2))
        levels.append(resize_rgba(levels[-1], size))
    return levels


def set_mipmap_header(header: bytearray, level_count: int) -> None:
    flags = struct.unpack_from("<I", header, 8)[0]
    caps = struct.unpack_from("<I", header, 108)[0]
    if level_count > 1:
        flags |= DDSD_MIPMAPCOUNT
        caps |= DDSCAPS_COMPLEX | DDSCAPS_MIPMAP
    else:
        flags &= ~DDSD_MIPMAPCOUNT
        caps &= ~(DDSCAPS_COMPLEX | DDSCAPS_MIPMAP)
    struct.pack_into("<I", header, 8, flags)
    struct.pack_into("<I", header, 28, level_count)
    struct.pack_into("<I", header, 108, caps)


def bgra_dds_header(width: int, height: int, level_count: int) -> bytearray:
    header = bytearray(DDS_HEADER_SIZE)
    header[:4] = b"DDS "
    flags = DDSD_CAPS | DDSD_HEIGHT | DDSD_WIDTH | DDSD_PITCH | DDSD_PIXELFORMAT
    if level_count > 1:
        flags |= DDSD_MIPMAPCOUNT
    struct.pack_into("<I", header, 4, 124)
    struct.pack_into("<I", header, 8, flags)
    struct.pack_into("<IIIII", header, 12, height, width, width * 4, 0, level_count)
    struct.pack_into(
        "<II4sIIIII",
        header,
        76,
        32,
        DDPF_RGB | DDPF_ALPHAPIXELS,
        b"\0\0\0\0",
        32,
        BGRA_RED_MASK,
        BGRA_GREEN_MASK,
        BGRA_BLUE_MASK,
        BGRA_ALPHA_MASK,
    )
    caps = DDSCAPS_TEXTURE
    if level_count > 1:
        caps |= DDSCAPS_COMPLEX | DDSCAPS_MIPMAP
    struct.pack_into("<I", header, 108, caps)
    return header


def save_bgra_dds(
    image: Image.Image,
    dds_path: Path,
    mipmaps: bool,
) -> int:
    levels = mip_chain(image, mipmaps)
    header = bgra_dds_header(image.width, image.height, len(levels))
    pixel_data = b"".join(level.tobytes("raw", "BGRA") for level in levels)
    dds_path.write_bytes(bytes(header) + pixel_data)
    return len(levels)


def save_bc3_dds(
    image: Image.Image,
    dds_path: Path,
    mipmaps: bool,
) -> int:
    levels = mip_chain(image, mipmaps)
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

    set_mipmap_header(header, len(levels))
    dds_path.write_bytes(bytes(header) + b"".join(compressed_levels))
    return len(levels)


def expected_mip_sizes(
    size: tuple[int, int],
    mipmaps: bool,
) -> list[tuple[int, int]]:
    sizes = [size]
    while mipmaps and sizes[-1] != (1, 1):
        width, height = sizes[-1]
        sizes.append((max(1, width // 2), max(1, height // 2)))
    return sizes


def validate_dds(
    dds_path: Path,
    expected_size: tuple[int, int],
    image_format: str,
    mipmaps: bool,
) -> int:
    data = dds_path.read_bytes()
    if len(data) < DDS_HEADER_SIZE or data[:4] != b"DDS ":
        raise RuntimeError(f"Invalid DDS header at {dds_path}")
    if struct.unpack_from("<I", data, 4)[0] != 124:
        raise RuntimeError(f"Invalid DDS header size at {dds_path}")

    height, width = struct.unpack_from("<II", data, 12)
    if (width, height) != expected_size:
        raise RuntimeError(
            f"Expected {expected_size[0]}x{expected_size[1]} DDS at {dds_path}, "
            f"got {width}x{height}"
        )

    levels = expected_mip_sizes(expected_size, mipmaps)
    expected_level_count = len(levels)
    mip_count = struct.unpack_from("<I", data, 28)[0]
    if mip_count != expected_level_count:
        raise RuntimeError(
            f"Expected {expected_level_count} mip level(s) at {dds_path}, "
            f"got {mip_count}"
        )
    header_flags = struct.unpack_from("<I", data, 8)[0]
    caps = struct.unpack_from("<I", data, 108)[0]
    if not caps & DDSCAPS_TEXTURE:
        raise RuntimeError(f"Missing DDS texture capability at {dds_path}")
    if expected_level_count > 1:
        if not header_flags & DDSD_MIPMAPCOUNT:
            raise RuntimeError(f"Missing DDS mipmap flag at {dds_path}")
        if caps & (DDSCAPS_COMPLEX | DDSCAPS_MIPMAP) != (
            DDSCAPS_COMPLEX | DDSCAPS_MIPMAP
        ):
            raise RuntimeError(f"Invalid DDS mipmap capabilities at {dds_path}")
    elif header_flags & DDSD_MIPMAPCOUNT or caps & (
        DDSCAPS_COMPLEX | DDSCAPS_MIPMAP
    ):
        raise RuntimeError(f"Unexpected DDS mipmap flags at {dds_path}")

    pixel_flags = struct.unpack_from("<I", data, 80)[0]
    fourcc = data[84:88]
    bits_per_pixel = struct.unpack_from("<I", data, 88)[0]
    masks = struct.unpack_from("<IIII", data, 92)
    if image_format == BGRA:
        expected_masks = (
            BGRA_RED_MASK,
            BGRA_GREEN_MASK,
            BGRA_BLUE_MASK,
            BGRA_ALPHA_MASK,
        )
        if (
            pixel_flags != (DDPF_RGB | DDPF_ALPHAPIXELS)
            or fourcc != b"\0\0\0\0"
            or bits_per_pixel != 32
            or masks != expected_masks
        ):
            raise RuntimeError(f"Expected uncompressed B8G8R8A8 DDS at {dds_path}")
        if struct.unpack_from("<I", data, 20)[0] != width * 4:
            raise RuntimeError(f"Invalid B8G8R8A8 row pitch at {dds_path}")
        expected_data_size = sum(level_width * level_height * 4 for level_width, level_height in levels)
    elif image_format == LEGACY_BC3:
        if pixel_flags != DDPF_FOURCC or fourcc != b"DXT5":
            raise RuntimeError(f"Expected BC3/DXT5 DDS at {dds_path}")
        expected_data_size = sum(
            max(1, (level_width + 3) // 4)
            * max(1, (level_height + 3) // 4)
            * 16
            for level_width, level_height in levels
        )
    else:
        raise ValueError(f"Unsupported DDS format: {image_format}")

    if len(data) != DDS_HEADER_SIZE + expected_data_size:
        raise RuntimeError(
            f"Unexpected DDS data length at {dds_path}: {len(data)} bytes"
        )
    return expected_level_count


def decode_dds(dds_path: Path, expected_size: tuple[int, int]) -> Image.Image:
    with Image.open(dds_path) as dds:
        dds.load()
        decoded = dds.convert("RGBA")
    if decoded.size != expected_size:
        raise RuntimeError(
            f"Decoded DDS has unexpected dimensions at {dds_path}: {decoded.size}"
        )
    return decoded


def convert_image(
    source_path: Path,
    relative_path: Path,
    dds_output: Path,
    preview_output: Path,
    icon_size: int,
    modifier_icon_size: int,
    illustration_size: tuple[int, int],
    image_format: str,
    mipmaps: bool,
    decoded_preview_output: Path | None,
    small_preview_output: Path | None,
) -> tuple[int, int, int]:
    with Image.open(source_path) as source:
        source.load()
        image = source.convert("RGBA")

    if is_trade_good_icon(relative_path):
        target_size = (icon_size, icon_size)
    elif is_modifier_type_icon(relative_path):
        target_size = (modifier_icon_size, modifier_icon_size)
    elif is_trade_good_illustration(relative_path):
        target_size = illustration_size
    else:
        target_size = None

    if target_size is not None:
        image = fit_rgba(image, target_size)

    png_path = preview_output / relative_path
    dds_path = dds_output / relative_path.with_suffix(".dds")
    png_path.parent.mkdir(parents=True, exist_ok=True)
    dds_path.parent.mkdir(parents=True, exist_ok=True)

    image.save(png_path, format="PNG")
    if image_format == BGRA:
        mip_count = save_bgra_dds(image, dds_path, mipmaps)
    elif image_format == LEGACY_BC3:
        mip_count = save_bc3_dds(image, dds_path, mipmaps)
    else:
        raise ValueError(f"Unsupported DDS format: {image_format}")
    validate_dds(dds_path, image.size, image_format, mipmaps)

    decoded: Image.Image | None = None
    if image_format == BGRA or (
        decoded_preview_output is not None or small_preview_output is not None
    ):
        decoded = decode_dds(dds_path, image.size)
    if image_format == BGRA and decoded is not None:
        if decoded.tobytes() != image.tobytes():
            raise RuntimeError(
                f"B8G8R8A8 DDS pixels differ from the resized PNG at {dds_path}"
            )

    if decoded_preview_output is not None or small_preview_output is not None:
        if decoded is None:
            decoded = decode_dds(dds_path, image.size)
        if decoded_preview_output is not None:
            decoded_path = decoded_preview_output / relative_path.with_suffix(".png")
            decoded_path.parent.mkdir(parents=True, exist_ok=True)
            decoded.save(decoded_path, format="PNG")
        if small_preview_output is not None:
            small_preview = fit_rgba(decoded, (32, 32))
            small_path = small_preview_output / relative_path.with_suffix(".png")
            small_path.parent.mkdir(parents=True, exist_ok=True)
            small_preview.save(small_path, format="PNG")

    return image.width, image.height, mip_count


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Convert Synthesis PNG assets to uncompressed B8G8R8A8 DDS by "
            "default. Trade-good icons, modifier-type icons, and "
            "illustrations are fitted into their target canvas without "
            "changing aspect ratio."
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
        "--decoded-preview-output",
        help="Optional root for PNGs decoded back from the final DDS files.",
    )
    parser.add_argument(
        "--small-preview-output",
        help="Optional root for 32x32 PNG previews decoded from the final DDS files.",
    )
    parser.add_argument(
        "--icon-size",
        type=int,
        default=128,
        help="Square output size for trade-good icons (default: 128).",
    )
    parser.add_argument(
        "--modifier-icon-size",
        type=int,
        default=64,
        help="Square output size for icons/modifier_types (default: 64).",
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
    parser.add_argument(
        "--format",
        choices=(BGRA, LEGACY_BC3),
        default=BGRA,
        help="DDS pixel format (default: b8g8r8a8; bc3 retains legacy DXT5).",
    )
    parser.add_argument(
        "--mipmaps",
        choices=("full", "none"),
        default="full",
        help="Generate a complete mip chain or only the base level (default: full).",
    )
    args = parser.parse_args()

    for argument_name, dimension in (
        ("--icon-size", args.icon_size),
        ("--modifier-icon-size", args.modifier_icon_size),
        ("--illustration-width", args.illustration_width),
        ("--illustration-height", args.illustration_height),
    ):
        if dimension <= 0:
            parser.error(f"{argument_name} must be positive")

    source_root = repository_path(args.source)
    if not source_root.is_dir():
        parser.error(f"Source directory does not exist: {source_root}")
    dds_output = repository_path(args.dds_output or source_root)
    preview_output = repository_path(args.preview_output)
    decoded_preview_output = (
        repository_path(args.decoded_preview_output)
        if args.decoded_preview_output
        else None
    )
    small_preview_output = (
        repository_path(args.small_preview_output)
        if args.small_preview_output
        else None
    )
    mipmaps = args.mipmaps == "full"

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
            width, height, mip_count = convert_image(
                source_path,
                relative_path,
                dds_output,
                preview_output,
                args.icon_size,
                args.modifier_icon_size,
                (args.illustration_width, args.illustration_height),
                args.format,
                mipmaps,
                decoded_preview_output,
                small_preview_output,
            )
        except (OSError, ValueError, RuntimeError) as error:
            failures.append((source_path, error))
            continue
        print(
            f"{relative_path}: {width}x{height} {args.format.upper()} DDS "
            f"({mip_count} mip level(s))"
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
