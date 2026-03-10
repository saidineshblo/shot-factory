"""Tests for split_grid.py"""
import os
import pytest
from PIL import Image
from split_grid import split_grid


class TestSplitGridHappyPath:
    def test_2x2_produces_four_files(self, tmp_grid_2x2, tmp_path):
        results = split_grid(str(tmp_grid_2x2), str(tmp_path / "out"), rows=2, cols=2)
        assert len(results) == 4

    def test_all_output_files_exist(self, tmp_grid_2x2, tmp_path):
        results = split_grid(str(tmp_grid_2x2), str(tmp_path / "out"), rows=2, cols=2)
        for r in results:
            assert os.path.exists(r["path"])

    def test_2x2_panel_size_is_half(self, tmp_grid_2x2, tmp_path):
        results = split_grid(str(tmp_grid_2x2), str(tmp_path / "out"), rows=2, cols=2)
        for r in results:
            img = Image.open(r["path"])
            assert img.size == (200, 200)

    def test_3x3_produces_nine_files(self, tmp_grid_3x3, tmp_path):
        results = split_grid(str(tmp_grid_3x3), str(tmp_path / "out"), rows=3, cols=3)
        assert len(results) == 9

    def test_default_names_use_prefix_and_start(self, tmp_grid_2x2, tmp_path):
        results = split_grid(str(tmp_grid_2x2), str(tmp_path / "out"),
                             rows=2, cols=2, prefix="SC", start=3)
        assert [r["name"] for r in results] == ["SC3", "SC4", "SC5", "SC6"]

    def test_custom_names_are_used(self, tmp_grid_2x2, tmp_path):
        results = split_grid(str(tmp_grid_2x2), str(tmp_path / "out"),
                             rows=2, cols=2, names=["A", "B", "C", "D"])
        assert [r["name"] for r in results] == ["A", "B", "C", "D"]

    def test_short_names_padded(self, tmp_grid_2x2, tmp_path):
        results = split_grid(str(tmp_grid_2x2), str(tmp_path / "out"),
                             rows=2, cols=2, names=["A", "B"])
        assert results[2]["name"].startswith("panel_")

    def test_creates_output_dir(self, tmp_grid_2x2, tmp_path):
        out = tmp_path / "nested" / "new"
        split_grid(str(tmp_grid_2x2), str(out), rows=2, cols=2)
        assert out.exists()

    def test_result_has_name_path_size(self, tmp_grid_2x2, tmp_path):
        results = split_grid(str(tmp_grid_2x2), str(tmp_path / "out"), rows=2, cols=2)
        for r in results:
            assert "name" in r and "path" in r and "size" in r


class TestSplitGridErrors:
    def test_missing_input_raises_file_not_found(self, tmp_path):
        with pytest.raises(FileNotFoundError, match="not found"):
            split_grid("/nonexistent/grid.png", str(tmp_path))

    def test_zero_rows_raises_value_error(self, tmp_grid_2x2, tmp_path):
        with pytest.raises(ValueError, match="rows"):
            split_grid(str(tmp_grid_2x2), str(tmp_path), rows=0, cols=2)

    def test_zero_cols_raises_value_error(self, tmp_grid_2x2, tmp_path):
        with pytest.raises(ValueError, match="cols"):
            split_grid(str(tmp_grid_2x2), str(tmp_path), rows=2, cols=0)
