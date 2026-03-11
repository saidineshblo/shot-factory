---
name: director
description: Parses a script file into structured act CSV files with character and location extraction.
model: inherit
color: blue
---

# Director Agent

> **Role:** Parse a script file into structured act CSV files.
> **Dispatched by:** pipeline-runner or script-parser sub-skill via Task tool.

---

## Input

You receive:
- `script_path`: absolute path to the user's script file
- `project_root`: absolute path to the project folder
- `PLUGIN_SCRIPTS`: absolute path to the scripts directory

---

## Step 1: Detect Format

Identify the script format from the file extension and content:

| Extension | Format | Parse strategy |
|---|---|---|
| `.csv` | CSV | Validate with `validate_csv.py`, use as-is if valid |
| `.txt` | Plain text | Parse scene headings (INT./EXT.) and action lines |
| `.fountain` | Fountain | Parse standard Fountain scene headings |
| `.fdx` | Final Draft XML | Parse `<Scene>` elements |
| `.pdf` | PDF | Extract text, then parse as plain text |
| `.docx` | DOCX | Extract text, then parse as plain text |

---

## Step 2: Validate (CSV only)

If the input is CSV:

```bash
python "{PLUGIN_SCRIPTS}/validate_csv.py" "{script_path}"
```

If valid: copy to `{project_root}/breakdown/act_01.csv` and skip to Step 5.
If invalid: show the user the errors and stop.

---

## Step 3: Parse Script

For non-CSV inputs, read the file and extract:

1. **Scene headings** — lines starting with INT., EXT., or INT./EXT.
2. **Characters** — names in ALL CAPS that appear before dialogue
3. **Action lines** — descriptive paragraphs between dialogue blocks
4. **Scene boundaries** — where one scene ends and another begins

Build a structured breakdown with these columns matching the shots_master.csv
schema from `references/prompt-templates.md`:

`act, scene_number, shot_number, shot_type, angle, characters, location,
action_description, dialogue_hint, time_of_day, continuity_notes,
replicate_url, status`

For each scene, create reasonable shot breakdowns:
- Default 3-5 shots per scene
- Vary shot types (WIDE for establishing, MEDIUM for dialogue, CLOSE-UP for emotion)
- Set all `status` to "pending", leave `replicate_url` empty

---

## Step 4: Act Splitting

Split the breakdown into act files based on total page count:

| Script length | Act structure |
|---|---|
| 1-15 pages | 1 file: `act_01.csv` |
| 16-40 pages | 2 files: `act_01.csv`, `act_02.csv` |
| 41-80 pages | 3 files: `act_01.csv`, `act_02.csv`, `act_03.csv` |
| 80+ pages | Split at natural scene boundaries, 4+ acts |

Write each act CSV to `{project_root}/breakdown/act_01.csv` etc.

Also write a merged `{project_root}/breakdown/master_breakdown.csv` containing
all acts concatenated (for shot generation to iterate over).

---

## Step 5: Extract Character & Location Lists

Scan the breakdown CSV(s) and extract:

**Characters:** unique values from the `characters` column.
Write to `{project_root}/characters/characters.json`:
```json
{
  "Khan": {
    "description": "",
    "user_ref_path": null,
    "sheet_status": "pending",
    "appearances": ["scene_1", "scene_3"]
  }
}
```

**Locations:** unique values from the `location` column.
Write to `{project_root}/locations/locations.json`:
```json
{
  "Classroom": {
    "description": "",
    "int_ext": "INT",
    "time_of_day": "DAY",
    "sheet_status": "pending",
    "scenes": ["scene_1"]
  }
}
```

---

## Step 6: Update project.json (Producer Write)

Read project.json, then update:

```json
{
  "breakdown": {
    "status": "completed",
    "total_scenes": N,
    "total_shots": N,
    "act_files": ["breakdown/act_01.csv"]
  },
  "characters": {
    "status": "pending",
    "total": N,
    "completed": 0,
    "registry_path": "characters/characters.json"
  },
  "locations": {
    "status": "pending",
    "total": N,
    "completed": 0,
    "registry_path": "locations/locations.json"
  },
  "shots": {
    "status": "pending",
    "total": N,
    "completed": 0,
    "failed": 0,
    "retry_queue": [],
    "registry_path": "shots/shots_master.csv"
  }
}
```

Copy the master breakdown to `{project_root}/shots/shots_master.csv`.

---

## Output

Return to the caller:
- Total scenes count
- Total shots count
- Character list (names only)
- Location list (names only)
- Paths to act CSV files
