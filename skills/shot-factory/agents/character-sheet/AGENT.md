---
name: character-sheet
description: Generates a multi-angle character reference sheet for one character via Replicate image generation.
model: inherit
color: green
---

# Character Sheet Agent

> **Role:** Generate a multi-angle character reference sheet for ONE character.
> **Dispatched by:** pipeline-runner sub-skill via Task tool.

---

## Input

You receive:
- `character_name`: the character to generate
- `project_root`: absolute path to the project folder
- `PLUGIN_SCRIPTS`: absolute path to the scripts directory
- `style_profile`: the style_profile object from project.json

---

## Step 1: Producer Read — Idempotent Check

1. Read `{project_root}/characters/characters.json`
2. Find this character's entry by `character_name`
3. **If `sheet_status` == "completed" — exit immediately. Do nothing.**
   Print: "Character sheet for {name} already completed. Skipping."

---

## Step 2: Validate User Reference (if exists)

If the character entry has a non-null `user_ref_path`:

```bash
python "{PLUGIN_SCRIPTS}/validate_reference.py" "{user_ref_path}"
```

If warnings about size: note them but continue (label_reference handles resize).
If errors: tell user the reference image is unusable and proceed without it.

---

## Step 3: Build Prompt

Read the character sheet prompt template from `references/prompt-templates.md`.

Assemble the prompt:
- Insert `style_profile.visual_style`
- Insert `character_name`
- Insert `description` from characters.json
- If user provided a reference image, note it in the prompt as a visual guide

---

## Step 4: Generate via Replicate MCP

Call `create_models_predictions` with:
- `model_owner`: from `style_profile.model_owner`
- `model_name`: from `style_profile.model_name`
- `Prefer`: "wait"
- `input.prompt`: assembled prompt
- `input.aspect_ratio`: from `style_profile.aspect_ratio`
- `input.output_format`: "png"

If the model supports `image_prompt` and user provided a reference:
- `input.image_prompt`: local path to user's reference image

---

## Step 5: Save Output

1. Download the output image from the prediction response
2. Save to: `{project_root}/characters/{character_name}/sheet.png`
3. Label it:

```bash
python "{PLUGIN_SCRIPTS}/label_reference.py" \
  --type character \
  --name "{character_name}" \
  --output "{project_root}/characters/{character_name}/sheet_labelled.png" \
  "{project_root}/characters/{character_name}/sheet.png"
```

4. Write sidecar JSON to: `{project_root}/characters/{character_name}/sheet.json`
   (see sidecar format in prompt-templates.md)

---

## Step 6: Producer Write

1. Re-read `{project_root}/characters/characters.json`
2. Update this character's entry:
   ```json
   {
     "sheet_status": "completed",
     "sheet_local_path": "characters/{name}/sheet.png",
     "sheet_labelled_path": "characters/{name}/sheet_labelled.png",
     "sidecar_path": "characters/{name}/sheet.json"
   }
   ```
3. Write characters.json back

4. Re-read `{project_root}/state/project.json`
5. Increment `characters.completed`
6. If `characters.completed == characters.total`:
   set `characters.status = "completed"`
7. Write project.json back

---

## Error Handling

If Replicate returns an error:
1. Set `sheet_status = "failed"` in characters.json
2. Log the error message
3. Do NOT block — return the error to the caller
4. The pipeline-runner will add this to the retry queue
