#!/usr/bin/env python3
"""
Build an HTML contact sheet from a completed project.json state file.

Outputs a single self-contained HTML file with:
  - Project summary
  - Character reference sheets (inline base64 or relative paths)
  - Location reference sheets
  - All shots organized by scene

Usage:
    python build_contact_sheet.py <project.json> <output.html>
"""
import base64
import json
import os
import sys
from datetime import datetime


def _img_tag(local_path, alt, project_root):
    """Return an <img> tag. Embeds image as base64 if file exists."""
    full_path = os.path.join(project_root, local_path) if local_path else None
    if full_path and os.path.exists(full_path):
        ext = os.path.splitext(full_path)[1].lower().lstrip(".")
        fmt = "jpeg" if ext in ("jpg", "jpeg") else "png"
        with open(full_path, "rb") as f:
            b64 = base64.b64encode(f.read()).decode()
        return f'<img src="data:image/{fmt};base64,{b64}" alt="{alt}" style="max-width:100%">'
    return f'<div style="background:#333;color:#aaa;padding:20px;text-align:center">[{alt} — not found]</div>'


def build_contact_sheet(state_path, output_path):
    """Build HTML contact sheet from project.json.

    Raises:
        FileNotFoundError: if state_path does not exist.
    """
    if not os.path.exists(state_path):
        raise FileNotFoundError(f"State file not found: {state_path}")

    with open(state_path) as f:
        state = json.load(f)

    project_root = state.get("project_root", os.path.dirname(state_path))
    project_name = state.get("project_name", "Untitled")
    generated_at = datetime.now().strftime("%Y-%m-%d %H:%M")

    sections = []

    # Characters
    chars = state.get("characters", {})
    if chars:
        items = ""
        for name, data in chars.items():
            if isinstance(data, dict):
                path = data.get("sheet_local_path", "")
                img = _img_tag(path, f"{name} character sheet", project_root)
                items += f'<div class="card"><h3>{name}</h3>{img}</div>'
        sections.append(f'<section><h2>Character Sheets</h2>'
                        f'<div class="grid">{items}</div></section>')

    # Locations
    locs = state.get("locations", {})
    if locs:
        items = ""
        for name, data in locs.items():
            if isinstance(data, dict):
                path = data.get("sheet_local_path", "")
                img = _img_tag(path, f"{name} location sheet", project_root)
                items += f'<div class="card"><h3>{name}</h3>{img}</div>'
        sections.append(f'<section><h2>Location Sheets</h2>'
                        f'<div class="grid">{items}</div></section>')

    # Shots
    shots = state.get("shots", {})
    registry_path = shots.get("registry_path", "") if isinstance(shots, dict) else ""
    full_csv = os.path.join(project_root, registry_path) if registry_path else None
    if full_csv and os.path.exists(full_csv):
        import csv
        scene_map = {}
        with open(full_csv, newline="") as f:
            for row in csv.DictReader(f):
                scene = row.get("scene_number", "?")
                scene_map.setdefault(scene, []).append(row)
        scene_html = ""
        for scene_num in sorted(scene_map, key=lambda x: int(x) if x.isdigit() else 0):
            shot_items = ""
            for shot in scene_map[scene_num]:
                lp = shot.get("local_path", "")
                sid = shot.get("shot_number", "?")
                img = _img_tag(lp, f"Scene {scene_num} Shot {sid}", project_root)
                shot_items += f'<div class="card"><p>SC{scene_num} Shot {sid}</p>{img}</div>'
            scene_html += (f'<h3>Scene {scene_num}</h3>'
                           f'<div class="grid">{shot_items}</div>')
        sections.append(f'<section><h2>Shots</h2>{scene_html}</section>')

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{project_name} — Contact Sheet</title>
<style>
  body {{ font-family: sans-serif; background: #1a1a1a; color: #eee; margin: 0; padding: 24px; }}
  h1   {{ color: #fff; border-bottom: 2px solid #444; padding-bottom: 12px; }}
  h2   {{ color: #aaa; margin-top: 32px; }}
  h3   {{ color: #ccc; font-size: 0.9rem; }}
  .grid {{ display: flex; flex-wrap: wrap; gap: 16px; margin-top: 12px; }}
  .card {{ background: #2a2a2a; border-radius: 8px; padding: 12px; width: 220px; }}
  .card p {{ font-size: 0.8rem; color: #888; margin: 4px 0 0; }}
  footer {{ color: #555; font-size: 0.75rem; margin-top: 48px; }}
</style>
</head>
<body>
<h1>{project_name} — Production Contact Sheet</h1>
{''.join(sections)}
<footer>Generated: {generated_at} | Shot Factory v3.0</footer>
</body>
</html>"""

    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"Contact sheet written: {output_path}")
    return output_path


def main():
    if len(sys.argv) < 3:
        print("Usage: python build_contact_sheet.py <project.json> <output.html>")
        sys.exit(1)
    try:
        build_contact_sheet(sys.argv[1], sys.argv[2])
    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
