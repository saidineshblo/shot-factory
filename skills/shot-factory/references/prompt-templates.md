# Shot Factory — Prompt Templates & Schema Reference

> **For agents only.** This file is read by agents at generation time.
> It is never shown to the user directly.

---

## 1. Replicate MCP Call Pattern

Every agent uses this exact pattern to call Replicate via the local MCP server:

```
Tool: create_models_predictions

Parameters:
  model_owner: "{style_profile.model_owner from project.json}"
  model_name:  "{style_profile.model_name from project.json}"
  Prefer: "wait"
  input:
    prompt: "{ASSEMBLED PROMPT — see templates below}"
    aspect_ratio: "{style_profile.aspect_ratio from project.json}"
    output_format: "png"
```

### Local file input

When the model supports image inputs (e.g. `image_prompt`, `image`), pass local
file paths directly. The MCP server handles upload to Replicate automatically:

```
  input:
    prompt: "..."
    image_prompt: "C:/Users/.../characters/Khan/sheet_labelled.png"
```

### After receiving output

The prediction response includes an `output` field with a URL. Download the
image immediately and save to the project folder:

```bash
# Windows (PowerShell):
Invoke-WebRequest -Uri "{output_url}" -OutFile "{target_path}"

# macOS/Linux:
curl -o "{target_path}" "{output_url}"
```

Or use the Bash tool with `WebFetch` to download. NEVER store the URL as the
final asset path — URLs expire. Always save locally.

---

## 2. Character Sheet Prompt Template

```
PROMPT STRUCTURE:
  "{style_profile.visual_style} character turnaround sheet of {character_name}.

  Character description: {character_description}

  Layout: 2x2 grid showing:
  - Top-left: Front view, full body, neutral pose
  - Top-right: 3/4 view, full body, slight turn
  - Bottom-left: Side profile, full body
  - Bottom-right: Back view, full body

  CONSISTENCY LOCK: Same outfit, same proportions, same colors in every panel.
  White or neutral background. No text overlays. Clean edges between panels."
```

**Grid config:** rows=2, cols=2
**Panel names:** front, three_quarter, side, back

---

## 3. Location Sheet Prompt Template

```
PROMPT STRUCTURE:
  "{style_profile.visual_style} environment concept art of {location_name}.

  Location description: {location_description}
  Time of day: {time_of_day}
  Interior/Exterior: {int_ext}

  Layout: 2x2 grid showing:
  - Top-left: Wide establishing shot
  - Top-right: Medium shot, key feature detail
  - Bottom-left: Different angle, showing depth
  - Bottom-right: Close-up of distinctive architectural/environmental detail

  GEOMETRY LOCK: Same physical space in every panel. Consistent lighting
  for {time_of_day}. No characters. No text overlays."
```

**Grid config:** rows=2, cols=2
**Panel names:** establishing, detail, depth, closeup

---

## 4. Shot Grid Prompt Template

```
PROMPT STRUCTURE:
  "{style_profile.visual_style} cinematic frame.

  Scene: {location_name}, {time_of_day}
  Shot type: {shot_type}, camera angle: {angle}
  Action: {action_description}
  Characters present: {characters}

  {dialogue_hint — include ONLY if non-empty}

  CONTINUITY LOCK:
  - Characters must match their reference sheets exactly
  - Location must match the location reference sheet
  - Lighting consistent with {time_of_day}
  - {continuity_notes — include ONLY if non-empty}

  STYLE LOCK: {style_profile.visual_style}. Consistent with all previous frames.
  Single frame, no panels, no text, no borders."
```

**Grid config:** Single image (rows=1, cols=1) — no splitting needed.

---

## 5. Style Proof Preamble

Prepended to the FIRST character sheet and FIRST shot during dry run:

```
"This is a STYLE TEST. Generate a single high-quality sample to verify
the visual style matches the director's vision. The user will review
this before committing to full production."
```

---

## 6. project.json Schema

Canonical definition. Only `producer/SKILL.md` creates this file.
All other agents READ and UPDATE their relevant sections only.

```json
{
  "version": "3.0.0",
  "project_id": "uuid",
  "project_name": "string",
  "project_root": "absolute path to project_* folder",
  "created_at": "ISO8601",
  "updated_at": "ISO8601",
  "status": "initializing | in_progress | completed | failed",
  "current_stage": "breakdown | characters | locations | shots | done",
  "style_profile": {
    "visual_style": "e.g. 'Pixar-style 3D animation'",
    "color_palette": "e.g. 'warm earth tones'",
    "aspect_ratio": "16:9 | 1:1 | 9:16",
    "resolution": "1K | 2K",
    "model_owner": "e.g. 'black-forest-labs'",
    "model_name": "e.g. 'flux-1.1-pro'",
    "custom_prompts": {}
  },
  "script": {
    "path": "script/original.ext",
    "format": "pdf | docx | csv | fountain | text",
    "total_pages": 0
  },
  "breakdown": {
    "status": "pending | completed",
    "total_scenes": 0,
    "total_shots": 0,
    "act_files": ["breakdown/act_01.csv"]
  },
  "characters": {
    "status": "pending | in_progress | completed",
    "total": 0,
    "completed": 0,
    "registry_path": "characters/characters.json"
  },
  "locations": {
    "status": "pending | in_progress | completed",
    "total": 0,
    "completed": 0,
    "registry_path": "locations/locations.json"
  },
  "shots": {
    "status": "pending | in_progress | completed",
    "total": 0,
    "completed": 0,
    "failed": 0,
    "retry_queue": [],
    "registry_path": "shots/shots_master.csv"
  }
}
```

---

## 7. characters.json Schema

```json
{
  "{character_name}": {
    "description": "Physical description used in prompts",
    "user_ref_path": "path to user-uploaded reference or null",
    "sheet_status": "pending | completed | failed",
    "sheet_local_path": "characters/{name}/sheet.png",
    "sheet_labelled_path": "characters/{name}/sheet_labelled.png",
    "sidecar_path": "characters/{name}/sheet.json",
    "appearances": ["scene_1", "scene_3"]
  }
}
```

---

## 8. locations.json Schema

```json
{
  "{location_name}": {
    "description": "Physical description used in prompts",
    "int_ext": "INT | EXT",
    "time_of_day": "DAY | NIGHT | DUSK | DAWN",
    "sheet_status": "pending | completed | failed",
    "sheet_local_path": "locations/{name}/overview_sheet.png",
    "sheet_labelled_path": "locations/{name}/overview_sheet_labelled.png",
    "sidecar_path": "locations/{name}/overview_sheet.json",
    "scenes": ["scene_1", "scene_5"]
  }
}
```

---

## 9. shots_master.csv Schema

| Column | Type | Description |
|---|---|---|
| act | int | Act number |
| scene_number | int | Scene number |
| shot_number | int | Shot number within scene |
| shot_type | enum | WIDE, MEDIUM, CLOSE-UP, EXTREME CLOSE-UP, OTS, POV, INSERT, AERIAL, TRACKING, STATIC |
| angle | string | Camera angle description |
| characters | string | Comma-separated character names |
| location | string | Location name |
| action_description | string | What happens in this shot |
| dialogue_hint | string | Key dialogue line (optional) |
| time_of_day | enum | DAY, NIGHT, DUSK, DAWN |
| continuity_notes | string | Notes for visual continuity |
| replicate_url | string | Temporary URL from Replicate (expires) |
| local_path | string | Local file path (permanent) |
| status | enum | pending, completed, failed |
| error_log | string | Error message if failed |
| attempts | int | Number of generation attempts |

---

## 10. Sidecar JSON Formats

### Character sidecar (`characters/{name}/sheet.json`)
```json
{
  "character_name": "Khan",
  "prompt_used": "full prompt text",
  "model": "owner/name",
  "generated_at": "ISO8601",
  "replicate_prediction_id": "abc123",
  "grid_config": {"rows": 2, "cols": 2},
  "panels": ["front", "three_quarter", "side", "back"]
}
```

### Location sidecar (`locations/{name}/overview_sheet.json`)
```json
{
  "location_name": "Classroom",
  "prompt_used": "full prompt text",
  "model": "owner/name",
  "generated_at": "ISO8601",
  "replicate_prediction_id": "abc123",
  "grid_config": {"rows": 2, "cols": 2},
  "panels": ["establishing", "detail", "depth", "closeup"]
}
```

### Shot sidecar (`shots/scene_{N}/shot_{N}.json`)
```json
{
  "scene": 1,
  "shot_number": 3,
  "prompt_used": "full prompt text",
  "model": "owner/name",
  "generated_at": "ISO8601",
  "replicate_prediction_id": "abc123",
  "continuity_context": {
    "previous_shot_path": "shots/scene_1/shot_2.png",
    "character_refs_used": ["characters/Khan/sheet_labelled.png"],
    "location_ref_used": "locations/Classroom/overview_sheet_labelled.png"
  }
}
```
