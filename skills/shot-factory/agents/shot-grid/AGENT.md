---
name: shot-grid
description: Generates cinematic shot frames for one scene with continuity tracking across shots.
model: inherit
color: red
---

# Shot Grid Agent

> **Role:** Generate shot frames for ONE scene's worth of shots.
> **Dispatched by:** pipeline-runner sub-skill via Task tool.
> This is the most complex agent in the pipeline.

---

## Input

You receive:

- `scene_number`: which scene to process
- `project_root`: absolute path to the project folder
- `PLUGIN_SCRIPTS`: absolute path to the scripts directory
- `style_profile`: the style_profile object from project.json

---

## Step 1: Producer Read — Idempotent Check

1. Read `{project_root}/shots/shots_master.csv`
2. Filter rows where `scene_number` matches this scene
3. Filter for rows where `status` is "pending" or "failed"
4. **If all rows have status "completed" — exit immediately.**
   Print: "All shots in scene {N} already completed. Skipping."

---

## Step 2: Load References

Read from project.json and registry files:

**Characters:** For each character in this scene's shots:

- Load their `sheet_labelled_path` from `characters/characters.json`.
- If `sheet_labelled_path` is missing but `sheet_local_path` (or another
  base image path) exists, create a tagged version **once** using
  `label_reference.py` and update `sheet_labelled_path`:

  ```bash
  python "{PLUGIN_SCRIPTS}/label_reference.py" \
    "{project_root}/{sheet_local_path}" \
    --type character \
    --name "{character_name}" \
    --output "{project_root}/characters/{character_name}/sheet_labelled.png"
  ```

- Always use the **labelled** paths as `image_prompt` inputs.

**Location:** For this scene's location:

- Load `sheet_labelled_path` from `locations/locations.json`.
- If `sheet_labelled_path` is missing but `sheet_local_path` (or another base
  image path) exists, create a tagged version once using `label_reference.py`
  and update `sheet_labelled_path`.
- Always use the **labelled** path as the location `image_prompt` input.

**Style references:** If `style_profile` has custom style reference paths,
prefer any `style_reference_labelled_paths` that were created in the
pipeline-runner step. If only unlabelled style refs exist, tag them once here
using `label_reference.py --type style` and update `style_profile` so future
calls reuse the tagged versions.

All reference images passed to Replicate for shot generation should be the
**tagged** variants so the model can read the banners and clearly understand
which image is which.

---

## Step 3: Process Each Pending Shot

The simplest and most explicit approach is to generate **one Replicate call per
shot**. This agent is written to support that 1:1 mapping, but it can also be
extended to use grid-based batching (for example 2x2 grids) when there are
multiple shots remaining in a scene.

For the default 1-shot-per-call behavior, iterate over each row with
`status == "pending"` or `"failed"` in this scene:

### 3a. Build Continuity Context

```json
{
  "current_shot": {
    "scene": N,
    "shot_number": N,
    "shot_type": "MEDIUM",
    "action": "...",
    "time_of_day": "DAY"
  },
  "previous_shot": {
    "description": "...",
    "local_path": "shots/scene_N/shot_N.png",
    "scene": N
  },
  "scene_context": {
    "location_sheet_path": "locations/{name}/overview_sheet_labelled.png",
    "time_of_day": "DAY"
  },
  "character_refs": {
    "{char_name}": {
      "labelled_path": "characters/{name}/sheet_labelled.png"
    }
  }
}
```

**Previous shot rules:**

- If this is the FIRST shot in the scene → no previous shot
- If this is NOT the first shot → use the previous shot in this scene
- At SCENE BOUNDARIES → reset. Do NOT carry over from a different scene.

### 3b. Build Prompt

Read the shot grid prompt template from `references/prompt-templates.md`.

Use the current row from `shots_master.csv` plus the continuity context to
fill every placeholder in the template:

- `location_name`, `time_of_day`, `shot_type`, `angle`
- `action_description`, `dialogue_hint` (omit this block if empty)
- `characters` (comma-separated from the row)
- Any `continuity_notes` that apply
- Style details from `style_profile` (visual style, aspect ratio, etc.)

The result must be a **single text prompt string** that:

1. Clearly describes the scene, camera, characters, and action for this shot.
2. Includes the continuity and style lock instructions from the template so
   the model knows to follow the reference images exactly.

### 3c. Assemble image_prompt Input

Build the reference file list in this priority order:

1. Style reference paths (if any)
2. Character sheet labelled paths — all characters in this shot
3. Location sheet labelled path
4. Previous shot path (same scene only)

**Maximum 14 inputs total.** If over the limit, drop from the bottom of the
list (previous shot first, then location, then extra characters).

The final structure passed to Replicate should look like:

- `input.prompt`: the single assembled text prompt from **3b**.
- `input.aspect_ratio`: from `style_profile.aspect_ratio`.
- `input.output_format`: `"png"`.
- `input.image_prompt` (or the model's equivalent image-input field):
  the ordered list of reference image file paths described above.

### 3d. Generate Image

Call the appropriate studioblo-replicate tool based on the model in
`style_profile.model_owner`/`style_profile.model_name`:

| Model | Tool |
| ----- | ---- |
| google/nano-banana-pro | `nano_banana_pro` |
| google/nano-banana-2 | `nano_banana_2` |
| bytedance/seedream-5 | `seedream_5` |
| bytedance/seedream-4.5 | `seedream_4_5` |

Pass:

- `prompt`: the assembled text prompt from 3b
- `image_input`: the ordered list of reference image paths from 3c
- `aspect_ratio`: from `style_profile.aspect_ratio`
- `output_format`: "png"
- `output_path`: `{project_root}/shots/scene_{NN}/`

The tool saves the image directly and returns the file path.

---

### Optional: Grid-Based Batching (2×2)

If you want to use grid-based generation (for example, generating 4 panels in a
single 2×2 grid image and then splitting it into individual shots), you can
batch **up to 4 consecutive shots in the same scene** into one Replicate call:

1. Look at the ordered list of pending/failed shots in this scene.
2. While at least 2–4 shots remain:
   - Take the next **up to 4** shots as one batch.
   - Build a **grid-style prompt** using the grid template from
     `references/prompt-templates.md` (panel-by-panel section), filling in the
     data for each of the batched shots.
   - Assemble the `image_prompt` list using the same priority rules as above,
     making sure all referenced characters/locations for the batch are
     included.
   - Call the appropriate studioblo-replicate tool once to generate the grid image.
   - After generation, call the split script to cut the grid into per-shot
     images:

   ```bash
   python "{PLUGIN_SCRIPTS}/split_grid.py" \
     "{grid_path}" "{project_root}/shots/scene_{NN}/" \
     --rows 2 --cols 2 \
     --names {SHOT_ID_1},{SHOT_ID_2},{SHOT_ID_3},{SHOT_ID_4}
   ```

   - Map each output image back to the corresponding row in
     `shots_master.csv` by `scene_number` and `shot_number`, set `local_path`,
     `replicate_url`, and `status = "completed"` for each.

3. If **only one shot** remains in the scene, fall back to the default
   single-shot flow described in Steps 3a–3d above (no grid, no splitting).

This keeps grid usage meaningful (only when there are multiple shots to batch)
and still supports the simple case where a scene ends with a single remaining
shot.

### 3e. Save & Post-Process

1. Create directory: `{project_root}/shots/scene_{NN}/`
2. Download output to: `shots/scene_{NN}/shot_{NN}.png`
3. Write sidecar: `shots/scene_{NN}/shot_{NN}.json`
   Include the full continuity_context used for this shot.

### 3f. Update shots_master.csv

For this shot's row:

- Set `status = "completed"`
- Set `local_path` to the saved file path
- Set `replicate_url` to the original URL (for reference only)

---

## Step 4: Producer Write

After processing all shots in this scene:

1. Re-read `{project_root}/state/project.json`
2. Count completed shots across ALL scenes (not just this one)
3. Update:

   ```json
   {
     "shots": {
       "completed": N,
       "failed": N
     }
   }
   ```

4. Write project.json back

---

## Error Handling

On Replicate failure for any individual shot:

1. Set `status = "failed"` in shots_master.csv
2. Set `error_log` to the error message
3. Increment `attempts` counter
4. **Continue to next shot — do NOT block the pipeline**
5. Return failure count to the pipeline-runner

The pipeline-runner will handle retry logic after all scenes complete.

---

## Performance Note

Each shot is generated sequentially within a scene (because continuity
depends on previous shots). But DIFFERENT scenes can run in parallel
since they have independent continuity chains. The pipeline-runner
handles cross-scene parallelism.
