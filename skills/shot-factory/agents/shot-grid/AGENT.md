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
- Load their `sheet_labelled_path` from `characters/characters.json`
- These will be passed as `image_prompt` inputs

**Location:** For this scene's location:
- Load `sheet_labelled_path` from `locations/locations.json`

**Style references:** If `style_profile` has custom style reference paths,
collect those too.

---

## Step 3: Process Each Pending Shot

For each shot with `status` "pending" or "failed" in this scene:

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
Assemble using the continuity context.

### 3c. Assemble image_prompt Input

Build the reference file list in this priority order:
1. Style reference paths (if any)
2. Character sheet labelled paths — all characters in this shot
3. Location sheet labelled path
4. Previous shot path (same scene only)

**Maximum 14 inputs total.** If over the limit, drop from the bottom of the
list (previous shot first, then location, then extra characters).

### 3d. Generate via Replicate MCP

Call `create_models_predictions` with assembled prompt and image inputs.

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
