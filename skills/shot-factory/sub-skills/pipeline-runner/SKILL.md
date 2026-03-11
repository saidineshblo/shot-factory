---
name: pipeline-runner
description: Full pipeline orchestrator. Runs the complete shot factory pipeline from script parsing through image generation to contact sheet output.
---

# Pipeline Runner — Full Pipeline Orchestration

> **Dispatched by:** Master SKILL.md when intent is FULL_RUN or RESUME.
> This is the primary pipeline orchestrator.

---

## Pipeline Sequence

### Step 0: Preflight

1. Resolve `PLUGIN_SCRIPTS` — derive from where this file was loaded,
   navigate to `../../scripts/`. Verify the directory exists.
2. Resolve `PLUGIN_AGENTS` — same parent, `../../agents/`.
3. Resolve `PLUGIN_REFS` — same parent, `../../references/`.
4. **Validate Replicate API token** — call the MCP tool `get_account`.
   If it returns account info, print "Replicate API: connected as {username}"
   and continue. If it returns an auth error or the tool is unavailable,
   stop and tell the user:
   "Replicate API token is missing or invalid.
   Set REPLICATE_API_TOKEN as a system environment variable and restart
   Claude Code."

### Step 1: Producer Init or Resume

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
2. "Color palette?" → e.g. "warm earth tones"
3. "Aspect ratio?" → 16:9, 1:1, or 9:16
4. "Which Replicate model?" → e.g. "black-forest-labs/flux-1.1-pro"
   (Show a few recommendations if they're unsure)

Save to `style_profile` in project.json.

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

Wait for completion. Read the updated project.json.

### Step 4: Character Confirmation

1. Read `characters/characters.json`
2. Show user the character list with any descriptions extracted
3. Ask: "Are these the characters? Add or remove any?"
4. For each character, ask: "Do you have a reference image for {name}?"
   If yes: save their uploaded image path to `user_ref_path`
5. Ask: "Brief description of {name}?" for any without descriptions
6. Update characters.json with confirmed data
7. Set `current_stage = "characters"` in project.json

### Step 5: Location Confirmation

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
"Ready to generate:
  - {N} character sheets
  - {N} location sheets
  - {N} shot frames
  Total: {N} Replicate API calls

  Proceed? [Y/N]"

### Step 7: Style Proof (Optional Gate)

Generate 1 character sheet + 1 shot as a style test:

1. Pick the first character and first shot
2. Prepend the Style Proof Preamble from prompt-templates.md
3. Generate both
4. Show user the results
5. Ask: "Does this style look right? [Y to continue / N to adjust style]"
6. If N: loop back to Step 2 for style adjustment

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

### Step 10: Retry Handling

After all shot agents complete:
1. Read `shots/shots_master.csv`
2. Count rows where `status == "failed"`
3. If failed > 0:
   Tell user: "{N} shots failed. Retry now? [Y/N]"
   If Y: re-dispatch shot-grid agents for failed scenes only
   If N: continue, note failures in output

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
