"""Shared fixtures for shot-factory script tests."""
import os
import sys
import csv
import pytest
from PIL import Image

SCRIPTS_DIR = os.path.join(
    os.path.dirname(__file__), "..",
    "skills", "shot-factory", "scripts"
)
sys.path.insert(0, SCRIPTS_DIR)


@pytest.fixture
def tmp_rgb_png(tmp_path):
    """400x300 RGB PNG."""
    p = tmp_path / "test.png"
    Image.new("RGB", (400, 300), (100, 150, 200)).save(p)
    return p


@pytest.fixture
def tmp_rgba_png(tmp_path):
    """400x300 RGBA PNG with transparency."""
    p = tmp_path / "test_rgba.png"
    Image.new("RGBA", (400, 300), (100, 150, 200, 128)).save(p)
    return p


@pytest.fixture
def tmp_large_png(tmp_path):
    """3000x2000 PNG — needs resizing."""
    p = tmp_path / "large.png"
    Image.new("RGB", (3000, 2000), (80, 80, 80)).save(p)
    return p


@pytest.fixture
def tmp_grid_2x2(tmp_path):
    """400x400 grid — 2x2 panels of 200x200."""
    p = tmp_path / "grid_2x2.png"
    Image.new("RGB", (400, 400), (50, 50, 50)).save(p)
    return p


@pytest.fixture
def tmp_grid_3x3(tmp_path):
    """600x600 grid — 3x3 panels of 200x200."""
    p = tmp_path / "grid_3x3.png"
    Image.new("RGB", (600, 600), (80, 80, 80)).save(p)
    return p


@pytest.fixture
def valid_breakdown_csv(tmp_path):
    """Minimal valid shot breakdown CSV."""
    p = tmp_path / "breakdown.csv"
    rows = [
        ["act", "scene_number", "shot_number", "shot_type", "angle",
         "characters", "location", "action_description",
         "dialogue_hint", "time_of_day", "continuity_notes",
         "replicate_url", "status"],
        ["1", "1", "1", "WIDE", "EYE LEVEL", "Khan",
         "Classroom", "Khan enters room", "", "DAY", "", "", "pending"],
    ]
    with open(p, "w", newline="") as f:
        csv.writer(f).writerows(rows)
    return p


@pytest.fixture
def minimal_project_state(tmp_path):
    """Minimal project.json state for contact sheet tests."""
    import json
    state = {
        "project_name": "TestFilm",
        "project_root": str(tmp_path),
        "characters": {
            "Khan": {
                "sheet_local_path": "characters/Khan/sheet.png",
                "sheet_status": "completed"
            }
        },
        "locations": {
            "Classroom": {
                "sheet_local_path": "locations/Classroom/overview_sheet.png",
                "sheet_status": "completed"
            }
        },
        "shots": {
            "status": "completed",
            "registry_path": "shots/shots_master.csv"
        }
    }
    state_dir = tmp_path / "state"
    state_dir.mkdir()
    p = state_dir / "project.json"
    p.write_text(json.dumps(state, indent=2))
    return p
