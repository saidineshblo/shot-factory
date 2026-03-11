"""
verify_state.py — Reconcile file-system reality with project state files.

Called by the pipeline-runner after major dispatch rounds as a safety net
to catch any state updates that LLM agents forgot to write.

Usage:
    python verify_state.py <project_root>

Exit codes:
    0  — success (state verified and any fixes applied)
    1  — project_root or project.json missing / unreadable
"""

import csv
import json
import sys
from pathlib import Path


def atomic_write_json(path: Path, data: dict) -> None:
    tmp_path = path.with_suffix(".json.tmp")
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    tmp_path.replace(path)


def atomic_write_csv(path: Path, rows: list[dict], fieldnames: list[str]) -> None:
    tmp_path = path.with_suffix(".csv.tmp")
    with open(tmp_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    tmp_path.replace(path)


def verify_characters(project_root: Path) -> tuple[dict, int]:
    """Returns (characters_data, fixes_count)."""
    chars_path = project_root / "characters" / "characters.json"
    if not chars_path.exists():
        return {}, 0

    with open(chars_path, "r", encoding="utf-8") as f:
        chars = json.load(f)

    fixes = 0
    for name, entry in chars.items():
        char_dir = project_root / "characters" / name
        sheet_path = char_dir / "sheet.png"
        labelled_path = char_dir / "sheet_labelled.png"
        sidecar_path = char_dir / "sheet.json"

        if sheet_path.exists() and entry.get("sheet_status") != "completed":
            entry["sheet_status"] = "completed"
            entry["sheet_local_path"] = f"characters/{name}/sheet.png"
            fixes += 1

        if labelled_path.exists() and not entry.get("sheet_labelled_path"):
            entry["sheet_labelled_path"] = f"characters/{name}/sheet_labelled.png"
            fixes += 1

        if sidecar_path.exists() and not entry.get("sidecar_path"):
            entry["sidecar_path"] = f"characters/{name}/sheet.json"
            fixes += 1

        if entry.get("sheet_status") == "completed" and not sheet_path.exists():
            entry["sheet_status"] = "pending"
            entry["sheet_local_path"] = None
            entry["sheet_labelled_path"] = None
            entry["sidecar_path"] = None
            fixes += 1

    if fixes > 0:
        atomic_write_json(chars_path, chars)

    return chars, fixes


def verify_locations(project_root: Path) -> tuple[dict, int]:
    """Returns (locations_data, fixes_count)."""
    locs_path = project_root / "locations" / "locations.json"
    if not locs_path.exists():
        return {}, 0

    with open(locs_path, "r", encoding="utf-8") as f:
        locs = json.load(f)

    fixes = 0
    for name, entry in locs.items():
        loc_dir = project_root / "locations" / name
        sheet_path = loc_dir / "overview_sheet.png"
        labelled_path = loc_dir / "overview_sheet_labelled.png"
        sidecar_path = loc_dir / "overview_sheet.json"

        if sheet_path.exists() and entry.get("sheet_status") != "completed":
            entry["sheet_status"] = "completed"
            entry["sheet_local_path"] = f"locations/{name}/overview_sheet.png"
            fixes += 1

        if labelled_path.exists() and not entry.get("sheet_labelled_path"):
            entry["sheet_labelled_path"] = f"locations/{name}/overview_sheet_labelled.png"
            fixes += 1

        if sidecar_path.exists() and not entry.get("sidecar_path"):
            entry["sidecar_path"] = f"locations/{name}/overview_sheet.json"
            fixes += 1

        if entry.get("sheet_status") == "completed" and not sheet_path.exists():
            entry["sheet_status"] = "pending"
            entry["sheet_local_path"] = None
            entry["sheet_labelled_path"] = None
            entry["sidecar_path"] = None
            fixes += 1

    if fixes > 0:
        atomic_write_json(locs_path, locs)

    return locs, fixes


def verify_shots(project_root: Path) -> tuple[list[dict], list[str], int]:
    """Returns (rows, fieldnames, fixes_count)."""
    csv_path = project_root / "shots" / "shots_master.csv"
    if not csv_path.exists():
        return [], [], 0

    with open(csv_path, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames or []
        rows = list(reader)

    fixes = 0
    for row in rows:
        scene = row.get("scene_number", "").strip()
        shot = row.get("shot_number", "").strip()
        if not scene or not shot:
            continue

        scene_padded = str(scene).zfill(2)
        shot_padded = str(shot).zfill(2)
        shot_file = project_root / "shots" / f"scene_{scene_padded}" / f"shot_{shot_padded}.png"

        if shot_file.exists() and row.get("status") != "completed":
            row["status"] = "completed"
            row["local_path"] = f"shots/scene_{scene_padded}/shot_{shot_padded}.png"
            fixes += 1

        if row.get("status") == "completed" and not shot_file.exists():
            local = row.get("local_path", "")
            alt_path = project_root / local if local else None
            if not (alt_path and alt_path.exists()):
                row["status"] = "pending"
                row["local_path"] = ""
                fixes += 1

    if fixes > 0:
        atomic_write_csv(csv_path, rows, fieldnames)

    return rows, fieldnames, fixes


def recount_project_json(
    project_root: Path,
    chars: dict,
    locs: dict,
    shot_rows: list[dict],
) -> int:
    """Recount totals in project.json. Returns number of fixes."""
    pj_path = project_root / "state" / "project.json"
    if not pj_path.exists():
        return 0

    with open(pj_path, "r", encoding="utf-8") as f:
        pj = json.load(f)

    fixes = 0

    char_completed = sum(1 for e in chars.values() if e.get("sheet_status") == "completed")
    char_total = len(chars)
    if pj.get("characters", {}).get("completed") != char_completed:
        pj.setdefault("characters", {})["completed"] = char_completed
        fixes += 1
    if pj.get("characters", {}).get("total") != char_total:
        pj.setdefault("characters", {})["total"] = char_total
        fixes += 1
    if char_total > 0 and char_completed == char_total:
        if pj.get("characters", {}).get("status") != "completed":
            pj["characters"]["status"] = "completed"
            fixes += 1

    loc_completed = sum(1 for e in locs.values() if e.get("sheet_status") == "completed")
    loc_total = len(locs)
    if pj.get("locations", {}).get("completed") != loc_completed:
        pj.setdefault("locations", {})["completed"] = loc_completed
        fixes += 1
    if pj.get("locations", {}).get("total") != loc_total:
        pj.setdefault("locations", {})["total"] = loc_total
        fixes += 1
    if loc_total > 0 and loc_completed == loc_total:
        if pj.get("locations", {}).get("status") != "completed":
            pj["locations"]["status"] = "completed"
            fixes += 1

    shot_completed = sum(1 for r in shot_rows if r.get("status") == "completed")
    shot_failed = sum(1 for r in shot_rows if r.get("status") == "failed")
    shot_total = len(shot_rows)
    if pj.get("shots", {}).get("completed") != shot_completed:
        pj.setdefault("shots", {})["completed"] = shot_completed
        fixes += 1
    if pj.get("shots", {}).get("failed") != shot_failed:
        pj.setdefault("shots", {})["failed"] = shot_failed
        fixes += 1
    if pj.get("shots", {}).get("total") != shot_total:
        pj.setdefault("shots", {})["total"] = shot_total
        fixes += 1
    if shot_total > 0 and shot_completed == shot_total:
        if pj.get("shots", {}).get("status") != "completed":
            pj["shots"]["status"] = "completed"
            fixes += 1

    if fixes > 0:
        from datetime import datetime, timezone
        pj["updated_at"] = datetime.now(timezone.utc).isoformat()
        atomic_write_json(pj_path, pj)

    return fixes


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python verify_state.py <project_root>", file=sys.stderr)
        return 1

    project_root = Path(sys.argv[1]).resolve()
    pj_path = project_root / "state" / "project.json"

    if not pj_path.exists():
        print(f"Error: project.json not found at {pj_path}", file=sys.stderr)
        return 1

    chars, char_fixes = verify_characters(project_root)
    locs, loc_fixes = verify_locations(project_root)
    shot_rows, _, shot_fixes = verify_shots(project_root)
    pj_fixes = recount_project_json(project_root, chars, locs, shot_rows)

    total_fixes = char_fixes + loc_fixes + shot_fixes + pj_fixes

    char_completed = sum(1 for e in chars.values() if e.get("sheet_status") == "completed")
    loc_completed = sum(1 for e in locs.values() if e.get("sheet_status") == "completed")
    shot_completed = sum(1 for r in shot_rows if r.get("status") == "completed")

    parts = [
        f"characters {char_completed}/{len(chars)}",
        f"locations {loc_completed}/{len(locs)}",
        f"shots {shot_completed}/{len(shot_rows)}",
    ]

    if total_fixes == 0:
        print(f"Verified: {', '.join(parts)}. No inconsistencies found.")
    else:
        fix_details = []
        if char_fixes:
            fix_details.append(f"{char_fixes} character fix(es)")
        if loc_fixes:
            fix_details.append(f"{loc_fixes} location fix(es)")
        if shot_fixes:
            fix_details.append(f"{shot_fixes} shot fix(es)")
        if pj_fixes:
            fix_details.append(f"{pj_fixes} project.json fix(es)")
        print(f"Verified: {', '.join(parts)}. Applied {total_fixes} fix(es): {', '.join(fix_details)}.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
