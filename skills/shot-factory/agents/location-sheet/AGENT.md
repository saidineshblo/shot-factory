---
name: location-sheet
description: Generates a multi-angle location reference sheet for one location via Replicate image generation.
model: inherit
color: yellow
---

# Location Sheet Agent

> **Role:** Generate a multi-angle location reference sheet for ONE location.
> **Dispatched by:** pipeline-runner sub-skill via Task tool.

---

## Input

You receive:
- `location_name`: the location to generate
- `project_root`: absolute path to the project folder
- `PLUGIN_SCRIPTS`: absolute path to the scripts directory
- `style_profile`: the style_profile object from project.json

---

## Step 1: Producer Read — Idempotent Check

1. Read `{project_root}/locations/locations.json`
2. Find this location's entry by `location_name`
3. **If `sheet_status` == "completed" — exit immediately. Do nothing.**
   Print: "Location sheet for {name} already completed. Skipping."

---

## Step 2: Validate User Reference (if exists)

Before generating location sheets, you may receive user-provided reference
images for some locations (for example, existing layout or concept sheets).
If so, copy each provided file path or public URL into the project and store
its local path in the location's `user_ref_path` field in `locations.json`.

If the location entry has a non-null `user_ref_path`:

```bash
python "{PLUGIN_SCRIPTS}/validate_reference.py" "{user_ref_path}"
```

If `validate_reference.py` reports that the image is too large or suggests
resizing, first run the resize-only mode of `label_reference.py` to create
a safe copy:

```bash
python "{PLUGIN_SCRIPTS}/label_reference.py" \
  "{user_ref_path}" \
  --resize-only \
  --max-size 2048 \
  --output "{project_root}/locations/{location_name}/user_ref_resized.png"
```

Then, create a **tagged** version of the safe reference so that the model
can clearly read what this location is:

```bash
python "{PLUGIN_SCRIPTS}/label_reference.py" \
  "{project_root}/locations/{location_name}/user_ref_resized.png" \
  --type location \
  --name "{location_name}" \
  --output "{project_root}/locations/{location_name}/user_ref_resized_labelled.png"
```

Update `user_ref_path` in memory to point to the **tagged, resized** file
(`user_ref_resized_labelled.png`) so that any subsequent validation or
`image_prompt` usage relies on the safe, tagged reference.

---

## Step 3: Build Prompt

Read the location sheet prompt template from `references/prompt-templates.md`.

Assemble the prompt:
- Insert `style_profile.visual_style`
- Insert `location_name`
- Insert `description` from locations.json
- Insert `int_ext` (INT or EXT)
- Insert `time_of_day`

---

## Step 4: Generate Image

Call the appropriate studioblo-replicate tool based on the model in
`style_profile.model_owner`/`style_profile.model_name`:

| Model | Tool |
|-------|------|
| google/nano-banana-pro | `nano_banana_pro` |
| google/nano-banana-2 | `nano_banana_2` |
| bytedance/seedream-5 | `seedream_5` |
| bytedance/seedream-4.5 | `seedream_4_5` |

Pass these parameters:
- `prompt`: assembled prompt
- `aspect_ratio`: from `style_profile.aspect_ratio`
- `output_format`: "png"
- `output_path`: `{project_root}/locations/{location_name}/`

The tool saves the image directly to `output_path` and returns the file path.

---

## Step 5: Save Output

1. Download the output image from the prediction response
2. Save to: `{project_root}/locations/{location_name}/overview_sheet.png`
3. Label it:

```bash
python "{PLUGIN_SCRIPTS}/label_reference.py" \
  --type location \
  --name "{location_name}" \
  --output "{project_root}/locations/{location_name}/overview_sheet_labelled.png" \
  "{project_root}/locations/{location_name}/overview_sheet.png"
```

4. Write sidecar JSON to: `{project_root}/locations/{location_name}/overview_sheet.json`
   (see sidecar format in prompt-templates.md)

---

## Step 6: Producer Write

1. Re-read `{project_root}/locations/locations.json`
2. Update this location's entry:
   ```json
   {
     "sheet_status": "completed",
     "sheet_local_path": "locations/{name}/overview_sheet.png",
     "sheet_labelled_path": "locations/{name}/overview_sheet_labelled.png",
     "sidecar_path": "locations/{name}/overview_sheet.json"
   }
   ```
3. Write locations.json back

4. Re-read `{project_root}/state/project.json`
5. Increment `locations.completed`
6. If `locations.completed == locations.total`:
   set `locations.status = "completed"`
7. Write project.json back

---

## Error Handling

If Replicate returns an error:
1. Set `sheet_status = "failed"` in locations.json
2. Log the error message
3. Do NOT block — return the error to the caller
4. The pipeline-runner will add this to the retry queue
