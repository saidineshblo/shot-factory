"""Tests for build_contact_sheet.py"""
import json
import os
import pytest
from build_contact_sheet import build_contact_sheet


class TestBuildContactSheet:
    def test_output_file_created(self, minimal_project_state, tmp_path):
        out = str(tmp_path / "contact_sheet.html")
        build_contact_sheet(str(minimal_project_state), out)
        assert os.path.exists(out)

    def test_output_contains_project_name(self, minimal_project_state, tmp_path):
        out = str(tmp_path / "contact_sheet.html")
        build_contact_sheet(str(minimal_project_state), out)
        content = open(out).read()
        assert "TestFilm" in content

    def test_output_contains_character_section(self, minimal_project_state, tmp_path):
        out = str(tmp_path / "contact_sheet.html")
        build_contact_sheet(str(minimal_project_state), out)
        content = open(out).read()
        assert "Khan" in content

    def test_output_contains_location_section(self, minimal_project_state, tmp_path):
        out = str(tmp_path / "contact_sheet.html")
        build_contact_sheet(str(minimal_project_state), out)
        content = open(out).read()
        assert "Classroom" in content

    def test_output_is_valid_html(self, minimal_project_state, tmp_path):
        out = str(tmp_path / "contact_sheet.html")
        build_contact_sheet(str(minimal_project_state), out)
        content = open(out).read()
        assert "<html" in content
        assert "</html>" in content

    def test_missing_state_file_raises(self, tmp_path):
        with pytest.raises(FileNotFoundError):
            build_contact_sheet("/nonexistent/project.json",
                               str(tmp_path / "out.html"))

    def test_returns_output_path(self, minimal_project_state, tmp_path):
        out = str(tmp_path / "contact_sheet.html")
        result = build_contact_sheet(str(minimal_project_state), out)
        assert result == out
