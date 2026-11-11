import struct
import tempfile
import unittest
from pathlib import Path

from PIL import Image

from convert_rgo_images import (
    BGRA,
    LEGACY_BC3,
    convert_image,
    decode_dds,
    fit_rgba,
    save_bgra_dds,
    save_bc3_dds,
    validate_dds,
)


class ConvertRgoImagesTests(unittest.TestCase):
    def test_bgra_dds_round_trips_channels_and_alpha(self) -> None:
        image = Image.new("RGBA", (2, 1))
        pixels = [(11, 22, 33, 44), (200, 150, 100, 0)]
        image.putdata(pixels)

        with tempfile.TemporaryDirectory() as directory:
            dds_path = Path(directory) / "icon.dds"
            save_bgra_dds(image, dds_path, mipmaps=False)
            self.assertEqual(validate_dds(dds_path, image.size, BGRA, False), 1)

            data = dds_path.read_bytes()
            self.assertEqual(data[128:], bytes((33, 22, 11, 44, 100, 150, 200, 0)))
            self.assertEqual(struct.unpack_from("<I", data, 88)[0], 32)
            self.assertEqual(
                struct.unpack_from("<IIII", data, 92),
                (0x00FF0000, 0x0000FF00, 0x000000FF, 0xFF000000),
            )
            self.assertEqual(
                decode_dds(dds_path, image.size).get_flattened_data(),
                tuple(pixels),
            )

    def test_bgra_full_mipmap_chain_has_exact_payload_size(self) -> None:
        image = Image.new("RGBA", (8, 8), (17, 83, 149, 211))

        with tempfile.TemporaryDirectory() as directory:
            dds_path = Path(directory) / "icon.dds"
            self.assertEqual(save_bgra_dds(image, dds_path, mipmaps=True), 4)
            self.assertEqual(validate_dds(dds_path, image.size, BGRA, True), 4)
            self.assertEqual(dds_path.stat().st_size, 128 + (64 + 16 + 4 + 1) * 4)

    def test_fit_preserves_aspect_and_transparent_padding(self) -> None:
        source = Image.new("RGBA", (4, 2), (25, 50, 75, 255))

        fitted = fit_rgba(source, (8, 8))

        self.assertEqual(fitted.size, (8, 8))
        self.assertEqual(fitted.getchannel("A").getbbox(), (0, 2, 8, 6))
        self.assertEqual(fitted.getpixel((4, 0))[3], 0)
        self.assertEqual(fitted.getpixel((4, 3)), (25, 50, 75, 255))

    def test_resize_avoids_transparent_color_fringe(self) -> None:
        source = Image.new("RGBA", (2, 2), (255, 0, 0, 255))
        source.putpixel((1, 0), (0, 0, 255, 0))

        resized = fit_rgba(source, (16, 16))

        for red, green, blue, alpha in resized.get_flattened_data():
            if alpha:
                self.assertEqual((green, blue), (0, 0))

    def test_converter_writes_requested_previews_and_accepts_rectangular_icon(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source_path = root / "source.png"
            Image.new("RGBA", (4, 2), (120, 80, 40, 255)).save(source_path)
            relative_path = Path("interface/icons/trade_goods/icon.png")
            dds_root = root / "dds"
            preview_root = root / "resized"
            decoded_root = root / "decoded"
            small_root = root / "small"

            self.assertEqual(
                convert_image(
                    source_path,
                    relative_path,
                    dds_root,
                    preview_root,
                    icon_size=8,
                    modifier_icon_size=4,
                    illustration_size=(8, 4),
                    image_format=BGRA,
                    mipmaps=False,
                    decoded_preview_output=decoded_root,
                    small_preview_output=small_root,
                ),
                (8, 8, 1),
            )

            dds_path = dds_root / relative_path.with_suffix(".dds")
            resized_path = preview_root / relative_path
            decoded_path = decoded_root / relative_path.with_suffix(".png")
            small_path = small_root / relative_path.with_suffix(".png")
            with Image.open(resized_path) as resized, Image.open(decoded_path) as decoded:
                self.assertEqual(resized.size, (8, 8))
                self.assertEqual(decoded.size, (8, 8))
                self.assertEqual(
                    resized.get_flattened_data(),
                    decoded.get_flattened_data(),
                )
                self.assertEqual(resized.getpixel((4, 0))[3], 0)
            with Image.open(small_path) as small:
                self.assertEqual(small.size, (32, 32))
            self.assertEqual(validate_dds(dds_path, (8, 8), BGRA, False), 1)

    def test_modifier_type_icons_use_64px_target(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source_path = root / "source.png"
            Image.new("RGBA", (4, 2), (60, 120, 180, 255)).save(source_path)
            relative_path = Path("interface/icons/modifier_types/icon.png")
            dds_root = root / "dds"
            preview_root = root / "resized"

            self.assertEqual(
                convert_image(
                    source_path,
                    relative_path,
                    dds_root,
                    preview_root,
                    icon_size=128,
                    modifier_icon_size=64,
                    illustration_size=(1080, 440),
                    image_format=BGRA,
                    mipmaps=False,
                    decoded_preview_output=None,
                    small_preview_output=None,
                ),
                (64, 64, 1),
            )
            preview_path = preview_root / relative_path
            with Image.open(preview_path) as preview:
                self.assertEqual(preview.size, (64, 64))
                self.assertEqual(preview.getpixel((32, 0))[3], 0)

    def test_bc3_legacy_mode_remains_available(self) -> None:
        image = Image.new("RGBA", (8, 8), (10, 20, 30, 40))

        with tempfile.TemporaryDirectory() as directory:
            dds_path = Path(directory) / "legacy.dds"
            self.assertEqual(save_bc3_dds(image, dds_path, mipmaps=False), 1)
            self.assertEqual(
                validate_dds(dds_path, image.size, LEGACY_BC3, False),
                1,
            )


if __name__ == "__main__":
    unittest.main()
