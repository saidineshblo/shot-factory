"""Tests for label_reference.py"""
import os
import pytest
from PIL import Image
from label_reference import add_label, resize_if_needed, resize_only


class TestResizeIfNeeded:
    def test_small_image_unchanged(self, tmp_rgb_png):
        img = Image.open(tmp_rgb_png)
        result, was_resized = resize_if_needed(img, max_dim=2048)
        assert not was_resized
        assert result.size == (400, 300)

    def test_large_image_downscaled(self):
        img = Image.new("RGB", (4096, 3072))
        result, was_resized = resize_if_needed(img, max_dim=2048)
        assert was_resized
        assert max(result.size) <= 2048

    def test_aspect_ratio_preserved(self):
        img = Image.new("RGB", (4000, 2000))
        result, _ = resize_if_needed(img, max_dim=2000)
        w, h = result.size
        assert abs(w / h - 2.0) < 0.01

    def test_exactly_at_limit_unchanged(self):
        img = Image.new("RGB", (2048, 1024))
        _, was_resized = resize_if_needed(img, max_dim=2048)
        assert not was_resized


class TestAddLabel:
    def test_output_file_created(self, tmp_rgb_png, tmp_path):
        out = str(tmp_path / "out.png")
        add_label(str(tmp_rgb_png), out, ref_type="character", name="Khan")
        assert os.path.exists(out)

    def test_output_taller_than_input(self, tmp_rgb_png, tmp_path):
        out = str(tmp_path / "out.png")
        h_in = Image.open(tmp_rgb_png).size[1]
        add_label(str(tmp_rgb_png), out, ref_type="character", name="Khan")
        h_out = Image.open(out).size[1]
        assert h_out > h_in

    def test_output_width_unchanged(self, tmp_rgb_png, tmp_path):
        out = str(tmp_path / "out.png")
        w_in = Image.open(tmp_rgb_png).size[0]
        add_label(str(tmp_rgb_png), out, ref_type="character", name="Khan")
        w_out = Image.open(out).size[0]
        assert w_out == w_in

    def test_all_types_work(self, tmp_rgb_png, tmp_path):
        for t in ("character", "location", "shot", "style"):
            out = str(tmp_path / f"out_{t}.png")
            result = add_label(str(tmp_rgb_png), out, ref_type=t, name="Test")
            assert os.path.exists(result)

    def test_rgba_input_does_not_lose_width(self, tmp_rgba_png, tmp_path):
        out = str(tmp_path / "out.png")
        w_in = Image.open(tmp_rgba_png).size[0]
        add_label(str(tmp_rgba_png), out, ref_type="style", name="Ref")
        w_out = Image.open(out).size[0]
        assert w_out == w_in

    def test_long_context_does_not_raise(self, tmp_rgb_png, tmp_path):
        out = str(tmp_path / "out.png")
        ctx = "x" * 200  # well over the truncation limit
        result = add_label(str(tmp_rgb_png), out, ref_type="character",
                           name="Khan", context=ctx)
        assert os.path.exists(result)

    def test_missing_input_raises(self, tmp_path):
        with pytest.raises(FileNotFoundError):
            add_label("/no/such/file.png", str(tmp_path / "out.png"),
                      ref_type="character", name="X")

    def test_returns_final_path(self, tmp_rgb_png, tmp_path):
        out = str(tmp_path / "out.png")
        result = add_label(str(tmp_rgb_png), out, ref_type="character", name="Khan")
        assert isinstance(result, str) and os.path.exists(result)


class TestResizeOnly:
    def test_output_created(self, tmp_rgb_png, tmp_path):
        out = str(tmp_path / "resized.png")
        resize_only(str(tmp_rgb_png), out)
        assert os.path.exists(out)

    def test_rgba_preserves_alpha(self, tmp_rgba_png, tmp_path):
        out = str(tmp_path / "resized.png")
        resize_only(str(tmp_rgba_png), out)
        assert Image.open(out).mode == "RGBA"

    def test_missing_input_raises(self, tmp_path):
        with pytest.raises(FileNotFoundError):
            resize_only("/no/such/file.png", str(tmp_path / "out.png"))
