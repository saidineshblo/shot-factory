---
name: pipeline-runner
description: Full pipeline orchestrator. Runs the complete shot factory pipeline from script parsing through image generation to contact sheet output.
---

# Pipeline Runner — Full Pipeline Orchestration

> **Dispatched by:** Master SKILL.md when intent is FULL_RUN or RESUME.
> This is the primary pipeline orchestrator.

---

## Pipeline Sequence

> **Note:** Preflight checks (path resolution, Replicate API validation) are
> performed by the master SKILL.md before dispatching this sub-skill.
> Do not repeat them here.

### Step 1: Producer Init or Resume
If the user has not already provided a project folder path in their message, ask for it:

```
What's the path to your project folder?
e.g. /Users/yourname/projects/my-film
     C:\Users\yourname\projects\my-film

This is where all outputs will be saved and where I'll look for
any existing pipeline state from a previous run.
```

Once you have the path, store it as `PROJECT_ROOT`. Every file reference in this pipeline is relative to `PROJECT_ROOT`. Do not proceed until this is confirmed.
**New project:**
- Follow Producer Init from `sub-skills/producer/SKILL.md`
- Ask user for their script file path
- Copy script to `{project_root}/script/original.{ext}`

**Resume:**
- Follow Producer Read from `sub-skills/producer/SKILL.md`
- Read `current_stage` from project.json
- Find the first item with status "pending" or "failed" in that stage
- Tell user: "Resuming from: {stage} — {N} items remaining"
- Jump to the appropriate step below
- **NEVER re-generate items with status "completed"**

### Step 2: Config Collection

Ask the user (skip if resuming and config already exists):

1. "What visual style?" → e.g. "Pixar-style 3D animation"
2. **Style Reference Images** — Yes, I have one | No, skip this
3. "Aspect ratio?" → 16:9, 1:1, or 9:16
4. "Which Replicate model?" → e.g. "google/nano-banana-2"
   (Show a few recommendations if they're unsure)

Save to `style_profile` in project.json.

### Handling Style Reference Images — Important

If the user says "Yes, I have one" for style references, respond with:

```
I can work with either of these:

  A) A file path on your computer
     e.g. /Users/yourname/Desktop/style-ref.png
          C:\Users\yourname\Pictures\style-ref.png

  B) A publicly accessible URL
     e.g. a Google Drive share link, Dropbox link, imgur link, etc.
     (make sure sharing is set to "Anyone with the link")

Paste whichever is easier and I'll copy it into your project folder.
```

Once the user provides a path or URL:

- **If a file path:** Copy the file into the project folder as
  `references/style_ref_[N].png` using the Bash or Shell tool. Verify the copy
  succeeded before continuing.
- **If a URL:** Download the file into the project folder as
  `references/style_ref_[N].png` using `curl`, `wget`, or WebFetch. Verify the
  download succeeded.
- **If multiple references:** Number them sequentially —
  `style_ref_1.png`, `style_ref_2.png`, etc.

After copying, **immediately resize** the image to prevent API errors:

```bash
python "{PLUGIN_SCRIPTS}/label_reference.py" \
  "references/style_ref_[N].png" \
  --resize-only \
  --max-size 2048 \
  --output "references/style_ref_[N]_safe.png"
```

Then replace the original with the resized version:

```bash
mv "references/style_ref_[N]_safe.png" "references/style_ref_[N].png"
```

Next, create a **tagged version** that will be used for all image generation:

```bash
python "{PLUGIN_SCRIPTS}/label_reference.py" \
  "references/style_ref_[N].png" \
  --type style \
  --name "Style Reference [N]" \
  --output "references/style_ref_[N]_labelled.png"
```

Store both paths in `style_profile`:

- `style_reference_paths`: the resized originals (`style_ref_[N].png`).
- `style_reference_labelled_paths`: the tagged versions
  (`style_ref_[N]_labelled.png`).

Shot-generation agents should always use the **labelled** style reference
paths when assembling `image_prompt` inputs.

---

### Step 3: Script Parsing

Dispatch the director agent:

```
Task tool:
  subagent_type: "general-purpose"
  prompt: "Read agents/director/AGENT.md and follow its instructions.
           script_path: {path}
           project_root: {project_root}
           PLUGIN_SCRIPTS: {scripts_path}"
```

Wait for completion. Run the state verification script to catch any missed
updates from the Director agent:

```bash
python "{PLUGIN_SCRIPTS}/verify_state.py" "{project_root}"
```

Read the corrected project.json before continuing.

### Step 4: Character Confirmation

1. Read `characters/characters.json`
2. Show user the character list with any descriptions extracted
3. Ask: "Are these the characters? Add or remove any?"
4. For each character, ask: "Do you have a reference image for {name}?"
   If yes: save their uploaded image path to `user_ref_path`
5. Build a description for every unique character, then show it for approval:

```
CHARACTER 1: NM (Narsee Monjee)
  My description: Older Indian man in his 60s, wearing traditional kurta.
  Warm, gentle personality. Props: mouth organ.
  → Is this accurate? Any corrections?

CHARACTER 2: JIMMY
  My description: Young Indian man in his 20s, energetic. Casual clothing.
  → Is this accurate? Is Jimmy human? What does he look like?
```
6. Ask: "Brief description of {name}?" for any without descriptions
7. Update characters.json with confirmed data
8. Set `current_stage = "characters"` in project.json

Do not proceed until every character is confirmed or corrected.

### Step 5: Location Confirmation

Same approach as character confirmation. Show inferred descriptions, wait for
user to confirm or correct each one.

1. Read `locations/locations.json`
2. Show user the location list
3. Ask: "Are these the locations? Add or remove any?"
4. For each location, confirm INT/EXT and time_of_day
5. Ask: "Brief description of {name}?" for any without descriptions
6. Update locations.json with confirmed data
7. Set `current_stage = "locations"` in project.json

### Step 6: Cost Estimate

Count total items:
- {N} character sheets
- {N} location sheets
- {N} shots

Tell user:

```
Ready to generate:
  - {N} character sheets
  - {N} location sheets
  - {N} shot frames
  Total: {N} Replicate API calls

Estimated cost: ${X.XX}
(Based on current per-call pricing for {model_name}.)

Proceed? [Y/N]
```

Look up the model's per-prediction cost via Replicate and multiply by the
total call count to give the user a dollar estimate.

### Step 7: Dry Run (Style Proof)

Generate two test images for style approval before committing to the full pipeline:

1. **One character sheet** — The most visually important character
2. **One shot grid** — The first 4 shots (or fewer if script is short)

Present results and ask:

```
Here's your style proof. Does this match what you want?
  A) Yes, looks great — run the full pipeline
  B) Adjust the style description, then re-run the proof
  C) I'll upload new reference images
```

Do not proceed until approved. If the user picks B or C, loop back to Step 2
for style adjustment or new references, then re-run the dry run.

Mark `dry_run: complete` in state file once approved.

### Step 8: Character & Location Generation (Parallel)

Dispatch ALL character and location agents in a SINGLE message
using multiple Task tool calls:

```
For each character:
  Task tool:
    subagent_type: "general-purpose"
    prompt: "Read agents/character-sheet/AGENT.md...
             character_name: {name}
             project_root: {project_root}
             PLUGIN_SCRIPTS: {scripts_path}
             style_profile: {json}"

For each location:
  Task tool:
    subagent_type: "general-purpose"
    prompt: "Read agents/location-sheet/AGENT.md...
             location_name: {name}
             project_root: {project_root}
             PLUGIN_SCRIPTS: {scripts_path}
             style_profile: {json}"
```

All tasks in ONE message = true parallel execution.
Wait for all to complete.

Run the state verification script to reconcile any missed updates from
parallel character and location agents:

```bash
python "{PLUGIN_SCRIPTS}/verify_state.py" "{project_root}"
```

Read the corrected project.json before continuing.

### Step 9: Shot Generation

1. Set `current_stage = "shots"` in project.json
2. Read `shots/shots_master.csv`
3. Group shots by `scene_number`
4. Dispatch shot-grid agents — one per scene:

```
For each scene:
  Task tool:
    subagent_type: "general-purpose"
    prompt: "Read agents/shot-grid/AGENT.md...
             scene_number: {N}
             project_root: {project_root}
             PLUGIN_SCRIPTS: {scripts_path}
             style_profile: {json}"
```

Scenes WITHOUT continuity dependencies between them can run in parallel.
Scenes WITHIN the same act should generally run sequentially if they share
locations or characters that need visual consistency.

After all shot agents complete, run the state verification script to catch
any missed updates from shot-grid agents:

```bash
python "{PLUGIN_SCRIPTS}/verify_state.py" "{project_root}"
```

Read the corrected project.json before continuing.

### Step 10: Retry Handling

After all shot agents complete:
1. Read `shots/shots_master.csv`
2. Count rows where `status == "failed"`
3. If failed > 0:
   Tell user: "{N} shots failed. Retry now? [Y/N]"
   If Y: re-dispatch shot-grid agents for failed scenes only
   If N: continue, note failures in output

After retries complete (or if no retries were needed), run the state
verification script one final time:

```bash
python "{PLUGIN_SCRIPTS}/verify_state.py" "{project_root}"
```

Read the corrected project.json before continuing.

### Step 11: Contact Sheet

```bash
python "{PLUGIN_SCRIPTS}/build_contact_sheet.py" \
  "{project_root}/state/project.json" \
  "{project_root}/contact_sheet.html"
```

### Step 12: Complete

1. Set `status = "completed"` and `current_stage = "done"` in project.json
2. Tell user:
   "Pipeline complete!
    - {N} character sheets
    - {N} location sheets
    - {N} shots ({F} failed)
    Open contact_sheet.html to review all assets."
