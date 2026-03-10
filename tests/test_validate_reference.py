"""Tests for validate_reference.py"""
import pytest
from PIL import Image
from validate_reference import validate_reference_image


class TestValidateReferenceImage:
    def test_valid_image_passes(self, tmp_rgb_png):
        result = validate_reference_image(str(tmp_rgb_png))
        assert result["valid"] is True

    def test_missing_file_raises(self, tmp_path):
        with pytest.raises(FileNotFoundError):
            validate_reference_image(str(tmp_path / "missing.png"))

    def test_returns_dimensions(self, tmp_rgb_png):
        result = validate_reference_image(str(tmp_rgb_png))
        assert result["width"] == 400
        assert result["height"] == 300

    def test_returns_mode(self, tmp_rgb_png):
        result = validate_reference_image(str(tmp_rgb_png))
        assert result["mode"] in ("RGB", "RGBA")

    def test_too_small_image_warns(self, tmp_path):
        """Images under 256x256 get a warning — not an error."""
        p = tmp_path / "tiny.png"
        Image.new("RGB", (100, 100), (0, 0, 0)).save(p)
        result = validate_reference_image(str(p))
        assert result["valid"] is True
        assert any("small" in w.lower() for w in result["warnings"])

    def test_very_large_image_warns(self, tmp_large_png):
        """Images over 2048px on longest side get a resize warning."""
        result = validate_reference_image(str(tmp_large_png))
        assert result["valid"] is True
        assert any("resize" in w.lower() for w in result["warnings"])

    def test_rgba_image_is_valid(self, tmp_rgba_png):
        result = validate_reference_image(str(tmp_rgba_png))
        assert result["valid"] is True

    def test_returns_file_size_bytes(self, tmp_rgb_png):
        result = validate_reference_image(str(tmp_rgb_png))
        assert result["file_size_bytes"] > 0

    def test_corrupt_image_fails(self, tmp_path):
        p = tmp_path / "corrupt.png"
        p.write_bytes(b"this is not an image")
        result = validate_reference_image(str(p))
        assert result["valid"] is False
        assert len(result["errors"]) > 0
