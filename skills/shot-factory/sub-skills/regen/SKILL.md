---
name: regen
description: >-
  Targeted regeneration of specific characters, locations,
  or shots without re-running the full pipeline.
---

# Regen — Targeted Regeneration

> **Dispatched by:** Master SKILL.md when intent is REGEN.
> Regenerates specific characters, locations, or shots
> without re-running the full pipeline.

---

## When to Use

The user wants to:

- Regenerate one or more character sheets
- Regenerate one or more location sheets
- Regenerate specific shots (by scene/shot number)
- Retry all failed shots
- Regenerate everything for a specific scene

---

## Step 0: Preflight

1. Resolve `PLUGIN_SCRIPTS` — derive from where this
   file was loaded, navigate to `../../scripts/`.
   Verify the directory exists.
2. Resolve `PLUGIN_AGENTS` — same parent, `../../agents/`.
3. Resolve `PLUGIN_REFS` — same parent,
   `../../references/`.

---

## Step 1: Producer Read

- Follow Producer Read from
  `sub-skills/producer/SKILL.md`
- Verify the project exists and has been through at
  least the breakdown stage
- Load project.json, characters.json, locations.json,
  shots_master.csv

---

## Step 2: Parse User Request

Identify what the user wants to regenerate. Categories:

### A: Specific characters

- User says: "regenerate Khan" or "redo the character
  sheet for Khan"
- Target: characters.json entry for Khan
- Reset: `sheet_status = "pending"`, clear
  `sheet_local_path`

### B: Specific locations

- User says: "regenerate Classroom" or "redo the
  location for Classroom"
- Target: locations.json entry for Classroom
- Reset: `sheet_status = "pending"`, clear
  `sheet_local_path`

### C: Specific shots

- User says: "regenerate scene 3 shot 2" or
  "redo SC3-SH2"
- Target: matching row in shots_master.csv
- Reset: `status = "pending"`, clear `local_path`,
  increment `attempts`

### D: All failed shots

- User says: "retry all failed" or "redo failures"
- Target: all rows in shots_master.csv where
  `status == "failed"`
- Reset: same as C, for each

### E: Entire scene

- User says: "regenerate scene 5" or "redo all of
  scene 5"
- Target: all rows in shots_master.csv where
  `scene_number == 5`
- Reset: same as C, for each

### F: Style change

- User says: "change style to watercolor and regenerate
  everything"
- Update `style_profile` in project.json first
- Then reset ALL characters, locations, and shots to
  pending

---

## Step 3: Confirm Scope

Show the user what will be regenerated:

"Will regenerate:

- {N} character sheets: {names}
- {N} location sheets: {names}
- {N} shots: {list}

  Total Replicate API calls: {N}

  Proceed? [Y/N]"

---

## Step 4: Archive & Reset State

For each targeted item, **archive the existing assets
before resetting**:

1. Create `{asset_dir}/archive/v{N}/` where N is the
   current `attempts` count (or 1 if no attempts field
   exists).
   - Characters:
     `{project_root}/characters/{name}/archive/v{N}/`
   - Locations:
     `{project_root}/locations/{name}/archive/v{N}/`
   - Shots:
     `{project_root}/shots/scene_{NN}/archive/v{N}/`
2. Move (not copy) the existing generated files into the
   archive folder:
   - `sheet.png`, `sheet_labelled.png`, `sheet.json` for
     characters/locations
   - `shot_{NN}.png`, `shot_{NN}.json` for shots
3. Then reset state:
   - Set status back to "pending"
   - Clear generated file paths
   - Write updated state files

This preserves a full history of previous generations
for comparison or rollback.

---

## Step 5: Dispatch Agents

Follow the same dispatch pattern as pipeline-runner:

**Characters** — dispatch character-sheet agents
(one per character):

```text
Task tool:
  subagent_type: "general-purpose"
  prompt: "Read agents/character-sheet/AGENT.md...
           character_name: {name}
           project_root: {project_root}
           PLUGIN_SCRIPTS: {scripts_path}
           style_profile: {json}"
```

**Locations** — dispatch location-sheet agents
(one per location):

```text
Task tool:
  subagent_type: "general-purpose"
  prompt: "Read agents/location-sheet/AGENT.md...
           location_name: {name}
           project_root: {project_root}
           PLUGIN_SCRIPTS: {scripts_path}
           style_profile: {json}"
```

**Shots** — dispatch shot-grid agents (one per scene
that has targeted shots):

```text
Task tool:
  subagent_type: "general-purpose"
  prompt: "Read agents/shot-grid/AGENT.md...
           scene_number: {N}
           project_root: {project_root}
           PLUGIN_SCRIPTS: {scripts_path}
           style_profile: {json}
           regen_only: [list of shot numbers to
           regenerate]"
```

IMPORTANT: If characters or locations were regenerated,
dispatch those FIRST and wait for completion BEFORE
dispatching shot agents (shots depend on
character/location reference sheets).

All character agents can run in parallel with each other.
All location agents can run in parallel with each other.
Shot agents for independent scenes can run in parallel.

---

## Step 6: Verify Results

After all agents complete:

1. Re-read state files
2. Count successes and failures
3. Report to user:

"Regeneration complete:

- Characters: {N}/{N} succeeded
- Locations: {N}/{N} succeeded
- Shots: {N}/{N} succeeded ({F} failed)

  {Optional: '{F} shots still failed. Retry? [Y/N]'}"

---

## Step 7: Rebuild Contact Sheet (if shots changed)

If any shots were regenerated:

```bash
python "{PLUGIN_SCRIPTS}/build_contact_sheet.py" \
  "{project_root}/state/project.json" \
  "{project_root}/contact_sheet.html"
```

Tell user: "Updated contact sheet: contact_sheet.html"
