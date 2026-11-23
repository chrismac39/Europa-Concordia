import tempfile
import unittest
from pathlib import Path

from PIL import Image

from build_modifier_icons import (
    alpha_bbox,
    compose_icon,
    fit_size,
    load_rgba,
    process_good,
    resize_rgba,
    source_candidates,
    trim_visible,
    variant_filename,
)


class BuildModifierIconsTests(unittest.TestCase):
    def test_alpha_bbox_uses_alpha_channel(self) -> None:
        image = Image.new("RGBA", (8, 6), (255, 0, 0, 0))
        image.putpixel((2, 1), (255, 0, 0, 255))
        image.putpixel((5, 4), (0, 0, 255, 12))

        self.assertEqual(alpha_bbox(image), (2, 1, 6, 5))

    def test_trim_visible_rejects_fully_transparent_images(self) -> None:
        with self.assertRaisesRegex(ValueError, "no visible"):
            trim_visible(Image.new("RGBA", (5, 5)), "test image")

    def test_fit_size_preserves_aspect_ratio(self) -> None:
        self.assertEqual(fit_size((400, 200), (100, 100)), (100, 50))
        self.assertEqual(fit_size((200, 400), (100, 100)), (50, 100))

    def test_resize_rgba_avoids_transparent_color_fringe(self) -> None:
        source = Image.new("RGBA", (2, 2), (255, 0, 0, 255))
        source.putpixel((1, 0), (0, 0, 255, 0))

        resized = resize_rgba(source, (16, 16))

        for red, green, blue, alpha in resized.get_flattened_data():
            if alpha:
                self.assertEqual((green, blue), (0, 0))

    def test_composite_is_rgba_transparent_and_modifier_is_overlaid(self) -> None:
        base = Image.new("RGBA", (20, 20), (20, 40, 60, 255))
        modifier = Image.new("RGBA", (4, 4), (220, 30, 20, 128))
        settings = {
            "max_fraction": 0.5,
            "center_x": 0.75,
            "center_y": 0.75,
            "offset_x": 0,
            "offset_y": 0,
        }
        modifier_settings = {
            "max_width": 4,
            "max_height": 4,
            "scale": 1,
            "right_margin": 2,
            "bottom_margin": 2,
            "horizontal_offset": 0,
            "vertical_offset": 0,
        }

        result, box = compose_icon(
            base, modifier, (20, 20), settings, modifier_settings
        )

        self.assertEqual(result.mode, "RGBA")
        self.assertEqual(result.size, (20, 20))
        self.assertEqual(result.getpixel((0, 0))[3], 0)
        self.assertEqual(box, (14, 14, 18, 18))
        self.assertEqual(result.getpixel((14, 14)), (120, 35, 40, 255))

    def test_composite_results_are_deterministic(self) -> None:
        base = Image.new("RGBA", (20, 20), (1, 2, 3, 255))
        modifier = Image.new("RGBA", (4, 4), (4, 5, 6, 200))
        base_settings = {
            "max_fraction": 0.5,
            "center_x": 0.4,
            "center_y": 0.4,
        }
        modifier_settings = {
            "max_width": 4,
            "max_height": 4,
            "right_margin": 2,
            "bottom_margin": 2,
        }

        first, _ = compose_icon(
            base, modifier, (20, 20), base_settings, modifier_settings
        )
        second, _ = compose_icon(
            base, modifier, (20, 20), base_settings, modifier_settings
        )

        self.assertEqual(first.tobytes(), second.tobytes())

    def test_missing_image_is_reported(self) -> None:
        with self.assertRaises(FileNotFoundError):
            load_rgba(Path("missing-rgo-test-image.png"))

    def test_invalid_image_is_reported(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "invalid.png"
            path.write_bytes(b"not a PNG")
            with self.assertRaises(OSError):
                load_rgba(path)

    def test_source_scan_excludes_variants_and_nested_outputs(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / "icon_goods_cassava.png").touch()
            (root / "icon_goods_cassava_positive.png").touch()
            nested = root / "generated"
            nested.mkdir()
            (nested / "icon_goods_taro.png").touch()

            self.assertEqual(
                source_candidates(root),
                [root / "icon_goods_cassava.png"],
            )

    def test_variant_names_preserve_trade_good_underscores(self) -> None:
        source = Path("icon_goods_oldworld_tropical_orchard.png")

        self.assertEqual(
            variant_filename(source, "positive"),
            "oldworld_tropical_orchard_positive.png",
        )
        self.assertEqual(
            variant_filename(source, "negative"),
            "oldworld_tropical_orchard_negative.png",
        )
        self.assertEqual(
            variant_filename(source, "inflation"),
            "oldworld_tropical_orchard_impacts_inflation.png",
        )
        self.assertEqual(
            variant_filename(source, "pop_demand"),
            "global_oldworld_tropical_orchard_pop_demand.png",
        )

    def test_processes_different_source_resolutions_without_overwriting(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source_path = root / "icon_goods_test.png"
            Image.new("RGBA", (64, 32), (20, 40, 60, 255)).save(source_path)
            modifier_dir = root / "modifiers"
            modifier_dir.mkdir()
            Image.new("RGBA", (100, 50), (255, 0, 0, 255)).save(
                modifier_dir / "positive.png"
            )
            output_dir = root / "output"
            preview_dir = root / "previews"
            config = {
                "modifier_dir": str(modifier_dir),
                "output_dir": str(output_dir),
                "preview_dir": str(preview_dir),
                "contact_sheet": str(root / "sheet.png"),
                "output_size": [1254, 1254],
                "preview_size": [128, 128],
                "base": {
                    "max_fraction": 0.83,
                    "center_x": 0.45,
                    "center_y": 0.45,
                },
                "modifiers": {
                    "positive": {
                        "file": "positive.png",
                        "max_width": 430,
                        "max_height": 430,
                        "alpha_bbox_threshold": 16,
                        "right_margin": 24,
                        "bottom_margin": 24,
                    }
                },
            }

            written, skipped = process_good(
                source_path, ("positive",), config, False, True, False
            )

            self.assertEqual((written, skipped), (1, 0))
            with Image.open(output_dir / "test_positive.png") as output:
                self.assertEqual(output.size, (1254, 1254))
                self.assertEqual(output.mode, "RGBA")
                self.assertEqual(output.getpixel((0, 0))[3], 0)
            with Image.open(preview_dir / "test_positive.png") as preview:
                self.assertEqual(preview.size, (128, 128))
                self.assertEqual(preview.mode, "RGBA")
            self.assertEqual(
                process_good(
                    source_path, ("positive",), config, False, True, False
                ),
                (0, 1),
            )
            self.assertEqual(
                process_good(
                    source_path, ("positive",), config, True, True, False
                ),
                (1, 0),
            )


if __name__ == "__main__":
    unittest.main()
