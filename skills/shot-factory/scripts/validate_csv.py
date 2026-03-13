#!/usr/bin/env python3
"""
Validate a shot breakdown CSV against the required schema.

Usage:
    python validate_csv.py breakdown.csv

Returns exit code 0 if valid, 1 if invalid.
"""
import csv
import json
import os
import sys

REQUIRED_COLUMNS = [
    "act",
    "scene_number",
    "shot_number",
    "shot_type",
    "angle",
    "characters",
    "location",
    "action_description",
    "dialogue_hint",
    "time_of_day",
    "continuity_notes",
    "replicate_url",
    "local_path",
    "status",
    "error_log",
    "attempts",
]

VALID_SHOT_TYPES = {
    "WIDE", "MEDIUM", "CLOSE-UP", "EXTREME CLOSE-UP",
    "OTS", "POV", "INSERT", "AERIAL", "TRACKING", "STATIC",
}


def validate_breakdown_csv(path):
    """Validate a breakdown CSV file.

    Returns:
        dict with keys:
          valid (bool), errors (list[str]),
          missing_columns (list[str]), row_count (int)

    Raises:
        FileNotFoundError: if path does not exist.
    """
    if not os.path.exists(path):
        raise FileNotFoundError(f"CSV not found: {path}")

    errors = []
    missing_columns = []
    row_count = 0

    with open(path, newline="", encoding="utf-8-sig") as f:
        content = f.read().strip()

    if not content:
        return {
            "valid": False,
            "errors": ["File is empty"],
            "missing_columns": REQUIRED_COLUMNS,
            "row_count": 0,
        }

    reader = csv.DictReader(content.splitlines())
    headers = reader.fieldnames or []

    missing_columns = [c for c in REQUIRED_COLUMNS if c not in headers]
    if missing_columns:
        errors.append(f"Missing required columns: {missing_columns}")

    for i, row in enumerate(reader, start=2):
        row_count += 1
        shot_type = row.get("shot_type", "").strip().upper()
        if shot_type and shot_type not in VALID_SHOT_TYPES:
            errors.append(
                f"Row {i}: unknown shot_type '{shot_type}'. "
                f"Valid: {sorted(VALID_SHOT_TYPES)}"
            )

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "missing_columns": missing_columns,
        "row_count": row_count,
    }


def main():
    if len(sys.argv) < 2:
        print("Usage: python validate_csv.py <breakdown.csv>")
        sys.exit(1)

    path = sys.argv[1]
    try:
        result = validate_breakdown_csv(path)
    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

    print(json.dumps(result, indent=2))
    sys.exit(0 if result["valid"] else 1)


if __name__ == "__main__":
    main()
