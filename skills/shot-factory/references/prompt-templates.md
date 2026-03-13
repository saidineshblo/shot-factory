# Shot Factory — Prompt Templates & Schema Reference

> **For agents only.** This file is read by agents at
> generation time. It is never shown to the user directly.

---

## 1. Image Generation via studioblo-replicate

Every agent generates images via the studioblo-replicate
MCP server. Select the tool based on
`style_profile.model_owner`/`style_profile.model_name`:

| Model                   | Tool               |
| ----------------------- | ------------------ |
| google/nano-banana-pro  | `nano_banana_pro`  |
| google/nano-banana-2    | `nano_banana_2`    |
| bytedance/seedream-5    | `seedream_5`       |
| bytedance/seedream-4.5  | `seedream_4_5`     |

All tools accept these common parameters:

- `prompt` (required): the assembled text prompt
- `output_path`: directory to save images (tool handles
  download automatically)
- `image_input`: list of local file paths or URLs for
  reference images
- `aspect_ratio`: from `style_profile.aspect_ratio`
- `output_format`: "png" or "jpg"

When `output_path` is provided, the tool saves the image
directly and returns the file path. **Always use
`output_path`** -- never store Replicate URLs as final
assets since they expire.

### Preflight

Before any generation, the master SKILL.md calls
`health_check` to verify:

- studioblo-replicate MCP server is installed and enabled
- REPLICATE_API_TOKEN is valid
- Account is authenticated

---

## 1b. Prompt Input Sanitization

Before inserting any user-provided text into prompts
(`action_description`, `dialogue_hint`,
`continuity_notes`, character/location descriptions),
agents MUST sanitize the input:

1. **Strip control characters** — remove any character
   with Unicode category Cc (tabs are okay, but remove
   null bytes, backspaces, escape sequences, etc.)
2. **Collapse excessive whitespace** — replace runs of
   3+ newlines or 5+ spaces with a single newline or
   single space respectively
3. **Truncate extreme lengths** — if a single field
   exceeds 500 characters, truncate to 500 and
   append "..."
4. **Strip markdown/HTML injection** — remove `<script>`,
   `<img`, `<iframe`, and any HTML tags. Remove markdown
   image syntax `![](...)`.

This prevents malformed or adversarial text in imported
scripts from corrupting generation prompts or producing
unexpected model behavior.

---

## 2. Character Sheet Prompt Template

Use the **user-confirmed description** — not your own
inference.

```text
Generate a professional animation character sheet for
[CHARACTER NAME].
[USER-CONFIRMED CHARACTER DESCRIPTION — species, age,
build, clothing, colors, distinguishing features,
personality. Use the exact description the user approved
in Step 0].
[ART STYLE — from Generation Config, e.g. "High-end
Pixar/Disney quality 3D animation, rich cinematic
lighting, detailed textures, vibrant colors"].

Include the following views clearly labelled in a
single sheet:
- Full-body FRONT view
- Full-body SIDE view
- Full-body BACK view
- Close-up face FRONT
- Close-up face SIDE
- Close-up face BACK
- Expression variations close-up: happy, sad, angry,
  surprised, neutral
- Key prop / accessory detail callouts:
  [LIST CHARACTER PROPS]

Keep the visual style, color palette, and proportions
exactly consistent across all views. Label every view
clearly on the sheet.
```

## 3. Location Sheet Prompt Template

Use the **user-confirmed description** including
filled-in time of day and lighting.

```text
Create a LOCATION SHEET for [LOCATION NAME].
[USER-CONFIRMED LOCATION DESCRIPTION — architecture,
furniture, key objects, colors, materials. Include the
time of day and lighting quality that the user confirmed
during gap-filling].
[ART STYLE — from Generation Config, matching character
sheet style].

This is reference documentation, not a redesign.
ABSOLUTE LOCK: Same location, same layout, same geometry
and scale. Same materials, textures, lighting, color
tone, and time of day. Only camera position, height, and
angle may change between views.

Generate ALL of the following views clearly labelled in
one sheet:
1. MASTER WIDE — Full establishing view of the entire
   location
2. FRONT VIEW — Straight-on view aligned with the main
   axis of the space
3. SIDE VIEW — Side profile showing depth and elevation
4. REVERSE VIEW — Opposite direction of the master wide
   shot
5. TOP / HIGH VIEW — Overhead or high-angle showing
   full layout
6. KEY AREA PRIMARY — Medium close-up of
   [MOST IMPORTANT AREA]
7. KEY AREA SECONDARY — Medium close-up of
   [SECONDARY AREA]
8. DETAIL CLOSE-UP — Close-up of materials, textures,
   or surface details

All views must feel like the same physical space
captured from different camera positions only. Label
every view clearly.
```

---

## 4. Shot Grid Prompt (2x2)

Adjust rows/columns if user chose 3x3 in Generation
Config. Pull all shot data from the **updated CSV**.

```text
Generate a [GRID_ROWS]x[GRID_COLS] grid of
[TOTAL_PANELS] sequential cinematic animation film
shots in [ASPECT_RATIO] format.
[ART STYLE DESCRIPTION from Generation Config].

Each panel must be clearly separated with thin borders.
All panels must feel like consecutive frames from the
same high-budget animated film.

SETTING: [LOCATION NAME from updated CSV] —
[LOCATION DESCRIPTION, TIME OF DAY, LIGHTING from
updated CSV]

CHARACTER REFERENCES: See attached images for character
designs and location layout. Match them exactly.

STYLE LOCK:
- Match the exact visual style, color palette, line
  quality, and art direction from the attached reference
  sheets exactly.
- Characters must match their character sheets exactly
  (face, costume, colors, proportions — no deviations).
- Location must match the location sheet exactly
  (layout, lighting, materials, color tone —
  no deviations).
- Maintain consistent character scale relative to
  environment.

[INCLUDE THIS BLOCK ONLY IF PREVIOUS SHOT REFERENCE
IS ATTACHED:]
CONTINUITY LOCK:
- The attached previous shot image shows the immediately
  preceding frame.
- Character positions, expressions, and environment
  state must continue naturally from that frame. This is
  a sequential scene — not a restart.

PANEL-BY-PANEL:
Panel 1 ([SHOT_ID]): [CAMERA_ANGLE from CSV],
  [MAGNIFICATION from CSV], [MOVEMENT from CSV] |
  [CHARACTER(S) from CSV] | [ACTION DESCRIPTION from
  CSV] | [MOOD from CSV], [LIGHTING from CSV]

Panel 2 ([SHOT_ID]): ...
Panel 3 ([SHOT_ID]): ...
Panel 4 ([SHOT_ID]): ...

OUTPUT: A single [GRID_ROWS]x[GRID_COLS] grid image in
[ASPECT_RATIO] containing all [TOTAL_PANELS] panels
with clear thin borders.
```

---

## 5. Style Proof Preamble

Prepended to the FIRST character sheet and FIRST shot
during dry run:

```text
"This is a STYLE TEST. Generate a single high-quality
sample to verify the visual style matches the director's
vision. The user will review this before committing to
full production."
```

---

## 6. project.json Schema

Canonical definition. Only `producer/SKILL.md` creates
this file. All other agents READ and UPDATE their
relevant sections only.

```json
{
  "version": "3.1.0",
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
    "style_reference_paths": [
      "references/style_ref_1.png"
    ],
    "style_reference_labelled_paths": [
      "references/style_ref_1_labelled.png"
    ],
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

| Column             | Type   | Description            |
| ------------------ | ------ | ---------------------- |
| act                | int    | Act number             |
| scene_number       | int    | Scene number           |
| shot_number        | int    | Shot number in scene   |
| shot_type          | enum   | WIDE, MEDIUM, etc.     |
| angle              | string | Camera angle           |
| characters         | string | Comma-separated names  |
| location           | string | Location name          |
| action_description | string | What happens           |
| dialogue_hint      | string | Key dialogue (opt.)    |
| time_of_day        | enum   | DAY, NIGHT, DUSK, DAWN |
| continuity_notes   | string | Visual continuity      |
| replicate_url      | string | Temp URL (expires)     |
| local_path         | string | Local path (permanent) |
| status             | enum   | pending/completed/fail |
| error_log          | string | Error msg if failed    |
| attempts           | int    | Number of attempts     |

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
    "character_refs_used": [
      "characters/Khan/sheet_labelled.png"
    ],
    "location_ref_used": "locations/Classroom/overview_sheet_labelled.png"
  }
}
```
