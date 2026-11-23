import argparse
import json
import sys
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont


REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_CONFIG = Path("scripts/assets/modifier_icon_config.json")
MODIFIER_NAMES = ("positive", "negative", "inflation", "pop_demand")
OUTPUT_SUFFIXES = {f"_{name}" for name in MODIFIER_NAMES}
RESAMPLING_METHODS = {
    "nearest": Image.Resampling.NEAREST,
    "bilinear": Image.Resampling.BILINEAR,
    "bicubic": Image.Resampling.BICUBIC,
    "lanczos": Image.Resampling.LANCZOS,
}


def repository_path(value: str | Path) -> Path:
    path = Path(value)
    if not path.is_absolute():
        path = REPOSITORY_ROOT / path
    return path.resolve()


def alpha_bbox(
    image: Image.Image, threshold: int = 0
) -> tuple[int, int, int, int] | None:
    alpha = image.getchannel("A")
    if threshold:
        alpha = alpha.point(lambda value: 255 if value > threshold else 0)
    return alpha.getbbox()


def load_rgba(path: Path) -> Image.Image:
    with Image.open(path) as source:
        return source.convert("RGBA")


def trim_visible(
    image: Image.Image, label: str, alpha_threshold: int = 0
) -> Image.Image:
    bbox = alpha_bbox(image, alpha_threshold)
    if bbox is None:
        raise ValueError(f"{label} has no visible (nontransparent) pixels")
    return image.crop(bbox)


def resize_rgba(
    image: Image.Image,
    size: tuple[int, int],
    resampling: Image.Resampling = Image.Resampling.LANCZOS,
) -> Image.Image:
    if image.size == size:
        return image.copy()
    return (
        image.convert("RGBa")
        .resize(size, resample=resampling)
        .convert("RGBA")
    )


def fit_size(
    source_size: tuple[int, int], max_size: tuple[float, float]
) -> tuple[int, int]:
    source_width, source_height = source_size
    max_width, max_height = max_size
    scale = min(max_width / source_width, max_height / source_height)
    return (
        max(1, round(source_width * scale)),
        max(1, round(source_height * scale)),
    )


def prepare_base(
    source: Image.Image,
    output_size: tuple[int, int],
    settings: dict[str, Any],
    resampling: Image.Resampling = Image.Resampling.LANCZOS,
) -> tuple[Image.Image, tuple[int, int]]:
    visible = trim_visible(source, "Base RGO image")
    max_fraction = float(settings["max_fraction"])
    if not 0 < max_fraction <= 1:
        raise ValueError("base.max_fraction must be greater than 0 and at most 1")
    target_size = fit_size(
        visible.size,
        (output_size[0] * max_fraction, output_size[1] * max_fraction),
    )
    resized = resize_rgba(visible, target_size, resampling)
    x = round(output_size[0] * float(settings["center_x"]) - target_size[0] / 2)
    y = round(output_size[1] * float(settings["center_y"]) - target_size[1] / 2)
    x += int(settings.get("offset_x", 0))
    y += int(settings.get("offset_y", 0))
    if x < 0 or y < 0 or x + resized.width > output_size[0] or y + resized.height > output_size[1]:
        raise ValueError("Base RGO placement would clip the visible artwork")

    canvas = Image.new("RGBA", output_size, (0, 0, 0, 0))
    canvas.alpha_composite(resized, dest=(x, y))
    return canvas, (x, y)


def prepare_modifier(
    source: Image.Image,
    output_size: tuple[int, int],
    settings: dict[str, Any],
    resampling: Image.Resampling = Image.Resampling.LANCZOS,
) -> tuple[Image.Image, tuple[int, int, int, int]]:
    visible = trim_visible(
        source,
        "Modifier image",
        int(settings.get("alpha_bbox_threshold", 0)),
    )
    scale = float(settings.get("scale", 1.0))
    if scale <= 0:
        raise ValueError("Modifier scale must be greater than zero")
    max_width = float(settings["max_width"]) * scale
    max_height = float(settings["max_height"]) * scale
    target_size = fit_size(visible.size, (max_width, max_height))
    resized = resize_rgba(visible, target_size, resampling)
    x = (
        output_size[0]
        - int(settings.get("right_margin", 24))
        - resized.width
        + int(settings.get("horizontal_offset", 0))
    )
    y = (
        output_size[1]
        - int(settings.get("bottom_margin", 24))
        - resized.height
        + int(settings.get("vertical_offset", 0))
    )
    if x < 0 or y < 0 or x + resized.width > output_size[0] or y + resized.height > output_size[1]:
        raise ValueError("Modifier placement would clip the visible symbol")
    canvas = Image.new("RGBA", output_size, (0, 0, 0, 0))
    canvas.alpha_composite(resized, dest=(x, y))
    return canvas, (x, y, x + resized.width, y + resized.height)


def compose_icon(
    base: Image.Image,
    modifier: Image.Image,
    output_size: tuple[int, int],
    base_settings: dict[str, Any],
    modifier_settings: dict[str, Any],
    resampling: Image.Resampling = Image.Resampling.LANCZOS,
) -> tuple[Image.Image, tuple[int, int, int, int]]:
    composed, _ = prepare_base(base, output_size, base_settings, resampling)
    modifier_layer, modifier_box = prepare_modifier(
        modifier, output_size, modifier_settings, resampling
    )
    composed.alpha_composite(modifier_layer)
    validate_output(composed, output_size, modifier_box)
    return composed, modifier_box


def validate_output(
    image: Image.Image,
    expected_size: tuple[int, int],
    modifier_box: tuple[int, int, int, int],
) -> None:
    if image.mode != "RGBA":
        raise ValueError(f"Expected RGBA output, got {image.mode}")
    if image.size != expected_size:
        raise ValueError(f"Expected {expected_size} output, got {image.size}")
    if image.getpixel((0, 0))[3] != 0:
        raise ValueError("Upper-left output background is not transparent")
    alpha = image.getchannel("A")
    if alpha.getextrema() == (255, 255):
        raise ValueError("Output has no transparent pixels")
    if not (
        0 <= modifier_box[0] < modifier_box[2] <= expected_size[0]
        and 0 <= modifier_box[1] < modifier_box[3] <= expected_size[1]
    ):
        raise ValueError("Modifier is outside the output canvas")


def make_preview(
    image: Image.Image,
    size: tuple[int, int],
    resampling: Image.Resampling = Image.Resampling.LANCZOS,
) -> Image.Image:
    return resize_rgba(image, size, resampling)


def make_contact_sheet(
    base: Image.Image,
    variants: list[tuple[str, Image.Image]],
    preview_size: tuple[int, int],
    resampling: Image.Resampling = Image.Resampling.LANCZOS,
) -> Image.Image:
    labels = [("Base", base), *variants]
    cell_width = preview_size[0] + 24
    cell_height = preview_size[1] + 42
    sheet = Image.new(
        "RGB",
        (cell_width * len(labels), cell_height),
        (128, 128, 128),
    )
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for index, (label, image) in enumerate(labels):
        x = index * cell_width + (cell_width - preview_size[0]) // 2
        y = 4
        preview = make_preview(image, preview_size, resampling)
        neutral = Image.new("RGBA", preview_size, (128, 128, 128, 255))
        neutral.alpha_composite(preview)
        sheet.paste(neutral.convert("RGB"), (x, y))
        text_width = draw.textbbox((0, 0), label, font=font)[2]
        draw.text(
            (index * cell_width + (cell_width - text_width) // 2, y + preview_size[1] + 8),
            label,
            fill=(255, 255, 255),
            font=font,
        )
    return sheet


def load_config(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as file:
        config = json.load(file)
    for key in ("source_dir", "modifier_dir", "output_dir", "output_size", "base", "modifiers"):
        if key not in config:
            raise ValueError(f"Missing required configuration key: {key}")
    if len(config["output_size"]) != 2 or any(
        int(dimension) <= 0 for dimension in config["output_size"]
    ):
        raise ValueError("output_size must contain two positive dimensions")
    missing_modifiers = set(MODIFIER_NAMES) - set(config["modifiers"])
    if missing_modifiers:
        raise ValueError(
            "Missing modifier configuration(s): "
            + ", ".join(sorted(missing_modifiers))
        )
    return config


def source_candidates(source_dir: Path) -> list[Path]:
    return sorted(
        (
            path
            for path in source_dir.glob("icon_goods_*.png")
            if not any(path.stem.endswith(suffix) for suffix in OUTPUT_SUFFIXES)
        ),
        key=lambda path: path.name.casefold(),
    )


def trade_good_id(source_path: Path) -> str:
    prefix = "icon_goods_"
    if not source_path.stem.startswith(prefix):
        raise ValueError(f"Expected an icon_goods_<trade_good>.png: {source_path}")
    return source_path.stem[len(prefix) :]


def variant_filename(source_path: Path, modifier_name: str) -> str:
    good_id = trade_good_id(source_path)
    if modifier_name == "inflation":
        return f"{good_id}_impacts_inflation.png"
    if modifier_name == "pop_demand":
        return f"global_{good_id}_pop_demand.png"
    if modifier_name in ("positive", "negative"):
        return f"{good_id}_{modifier_name}.png"
    raise ValueError(f"Unsupported modifier name: {modifier_name}")


def process_good(
    source_path: Path,
    modifier_names: tuple[str, ...],
    config: dict[str, Any],
    overwrite: bool,
    previews: bool,
    contact_sheet: bool,
) -> tuple[int, int]:
    output_size = tuple(int(value) for value in config["output_size"])
    resampling_name = config.get("resampling", "lanczos")
    if resampling_name not in RESAMPLING_METHODS:
        raise ValueError(f"Unsupported resampling method: {resampling_name}")
    resampling = RESAMPLING_METHODS[resampling_name]
    source = load_rgba(source_path)
    base_canvas, _ = prepare_base(
        source, output_size, config["base"], resampling
    )
    output_dir = repository_path(config["output_dir"])
    preview_dir = repository_path(config["preview_dir"]) if previews else None
    output_dir.mkdir(parents=True, exist_ok=True)
    if preview_dir is not None:
        preview_dir.mkdir(parents=True, exist_ok=True)
    preview_size = tuple(int(value) for value in config.get("preview_size", [128, 128]))
    variants: list[tuple[str, Image.Image]] = []
    completed = 0

    for name in modifier_names:
        settings = config["modifiers"][name]
        modifier_path = repository_path(config["modifier_dir"]) / settings["file"]
        if not modifier_path.is_file():
            raise FileNotFoundError(f"Missing {name} modifier PNG: {modifier_path}")
        output_path = output_dir / variant_filename(source_path, name)
        preview_path = (
            preview_dir / output_path.name
            if preview_dir is not None
            else None
        )
        if output_path.exists() and not overwrite:
            print(f"Skipped existing output (use --overwrite): {output_path}")
            if contact_sheet:
                variants.append(
                    (name.replace("_", " ").title(), load_rgba(output_path))
                )
            continue
        modifier = load_rgba(modifier_path)
        composed, _ = compose_icon(
            source, modifier, output_size, config["base"], settings, resampling
        )
        composed.save(output_path, format="PNG")
        if preview_path is not None and (overwrite or not preview_path.exists()):
            make_preview(composed, preview_size, resampling).save(
                preview_path, format="PNG"
            )
        elif preview_path is not None:
            print(f"Kept existing preview (use --overwrite): {preview_path}")
        variants.append((name.replace("_", " ").title(), composed))
        completed += 1
        print(f"Wrote {output_path}")

    if contact_sheet:
        good_id = trade_good_id(source_path)
        sheet_path = repository_path(
            str(config["contact_sheet"]).format(good=good_id)
        )
        if sheet_path.exists() and not overwrite:
            print(f"Kept existing contact sheet (use --overwrite): {sheet_path}")
        elif variants:
            sheet_path.parent.mkdir(parents=True, exist_ok=True)
            make_contact_sheet(
                base_canvas, variants, preview_size, resampling
            ).save(sheet_path, format="PNG")
            print(f"Wrote {sheet_path}")
    return completed, len(modifier_names) - completed


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Compose transparent RGO master icons with supplied modifier PNGs."
    )
    goods = parser.add_mutually_exclusive_group(required=True)
    goods.add_argument("--good", help="Good ID, such as cassava.")
    goods.add_argument("--all-goods", action="store_true")
    modifiers = parser.add_mutually_exclusive_group(required=True)
    modifiers.add_argument("--modifier", choices=MODIFIER_NAMES)
    modifiers.add_argument("--all-modifiers", action="store_true")
    parser.add_argument("--config", default=str(DEFAULT_CONFIG))
    parser.add_argument("--overwrite", action="store_true")
    parser.add_argument("--no-previews", action="store_true")
    parser.add_argument("--contact-sheet", action="store_true")
    args = parser.parse_args()

    try:
        config_path = repository_path(args.config)
        config = load_config(config_path)
        source_dir = repository_path(config["source_dir"])
        if args.good:
            good_id = args.good
            if good_id.startswith("icon_goods_"):
                good_id = good_id[len("icon_goods_") :]
            source_path = source_dir / f"icon_goods_{good_id}.png"
            if not source_path.is_file():
                raise FileNotFoundError(f"Missing RGO PNG: {source_path}")
            goods_to_process = [source_path]
        else:
            goods_to_process = source_candidates(source_dir)
            if not goods_to_process:
                raise FileNotFoundError(
                    f"No base icon_goods_*.png files found in {source_dir}"
                )
        modifier_names = (
            MODIFIER_NAMES
            if args.all_modifiers
            else (args.modifier,)
        )
        failures: list[tuple[Path, Exception]] = []
        total_written = 0
        total_skipped = 0
        for source_path in goods_to_process:
            try:
                written, skipped = process_good(
                    source_path,
                    modifier_names,
                    config,
                    args.overwrite,
                    not args.no_previews,
                    args.contact_sheet,
                )
                total_written += written
                total_skipped += skipped
            except (OSError, ValueError) as error:
                failures.append((source_path, error))
        for source_path, error in failures:
            print(f"Failed {source_path}: {error}", file=sys.stderr)
        if failures:
            return 1
        print(
            f"Processed {len(goods_to_process)} good(s): {total_written} "
            f"variant(s) written, {total_skipped} skipped."
        )
        return 0
    except (OSError, ValueError, json.JSONDecodeError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
