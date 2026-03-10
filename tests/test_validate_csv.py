"""Tests for validate_csv.py"""
import csv
import pytest
from validate_csv import validate_breakdown_csv, REQUIRED_COLUMNS


class TestRequiredColumns:
    def test_valid_csv_passes(self, valid_breakdown_csv):
        result = validate_breakdown_csv(str(valid_breakdown_csv))
        assert result["valid"] is True
        assert result["errors"] == []

    def test_missing_column_fails(self, tmp_path):
        p = tmp_path / "bad.csv"
        with open(p, "w", newline="") as f:
            csv.writer(f).writerow(["act", "scene_number"])  # missing cols
        result = validate_breakdown_csv(str(p))
        assert result["valid"] is False
        assert len(result["errors"]) > 0

    def test_reports_which_columns_are_missing(self, tmp_path):
        p = tmp_path / "bad.csv"
        with open(p, "w", newline="") as f:
            csv.writer(f).writerow(["act"])
        result = validate_breakdown_csv(str(p))
        missing = result["missing_columns"]
        assert "shot_number" in missing
        assert "location" in missing

    def test_empty_csv_fails(self, tmp_path):
        p = tmp_path / "empty.csv"
        p.write_text("")
        result = validate_breakdown_csv(str(p))
        assert result["valid"] is False

    def test_header_only_csv_passes_structure(self, tmp_path):
        """CSV with only headers is structurally valid (0 data rows is OK)."""
        p = tmp_path / "headers_only.csv"
        with open(p, "w", newline="") as f:
            csv.writer(f).writerow(REQUIRED_COLUMNS)
        result = validate_breakdown_csv(str(p))
        assert result["valid"] is True
        assert result["row_count"] == 0

    def test_returns_row_count(self, valid_breakdown_csv):
        result = validate_breakdown_csv(str(valid_breakdown_csv))
        assert result["row_count"] == 1

    def test_missing_file_raises(self, tmp_path):
        with pytest.raises(FileNotFoundError):
            validate_breakdown_csv(str(tmp_path / "nonexistent.csv"))

    def test_extra_columns_are_allowed(self, tmp_path):
        """CSV may have extra columns beyond required — should still pass."""
        p = tmp_path / "extra.csv"
        with open(p, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(REQUIRED_COLUMNS + ["extra_col"])
            writer.writerow(["1", "1", "1", "WIDE", "EYE LEVEL",
                             "Khan", "Classroom", "enters", "",
                             "DAY", "", "", "pending", "extra_val"])
        result = validate_breakdown_csv(str(p))
        assert result["valid"] is True
