---
name: shot-factory
description: End-to-end animated film pre-production pipeline MASTER AGENT. Turns USER INTENT AND THEN PROPERLY ASSIGN IT TO VARIOUS SUB AGENTS TO GO FOR  script into character sheets, location sheets, and shot frames using Replicate image generation BY MAINTAINING PROER MEMORY AND TO DO LIST .
---

# Shot Factory

> End-to-end animated film pre-production pipeline.
> Turns a script into character sheets, location sheets, and shot frames using various sub-agnets and sub-skills

---

## What This Plugin Does

Shot Factory takes a screenplay or shot breakdown and produces visual references for characters, locations, and shots. It uses a series of sub-skills to parse the script, generate character and location sheets, and create shot frames. The final output is a contact sheet summarizing the entire project.

## Commands

| Intent            | Trigger phrases                                                          |
| ----------------- | ------------------------------------------------------------------------ |
| **Full pipeline** | "Run Shot Factory", "Generate my film", "Start the pipeline"             |
| **Parse only**    | "Parse my script", "Break down this screenplay", "Just do the breakdown" |
| **Resume**        | "Resume my project", "Continue where I left off", "Pick up from {stage}" |
| **Regenerate**    | "Regenerate Khan", "Redo scene 3", "Retry failed shots", "Change style"  |
| **Status**        | "Show project status", "Where are we?", "How many shots left?"           |

---

## Intent Classification

Read the user's message and classify into one of:

### FULL_RUN

The user wants to run the complete pipeline from script to contact sheet.
They may or may not have an existing project.

**Dispatch:** `sub-skills/pipeline-runner/SKILL.md`

### PARSE_ONLY

The user wants to parse a script and review the breakdown, but NOT generate
images yet.

**Dispatch:** `sub-skills/script-parser/SKILL.md`

### RESUME

The user references an existing project and wants to continue from where
it stopped. Look for:

- A project path they provide
- "resume", "continue", "pick up"
- A `project_*/state/project.json` with `status != "completed"`

**Dispatch:** `sub-skills/pipeline-runner/SKILL.md` (resume mode)

### REGEN

The user wants to regenerate specific assets. Look for:

- "regenerate", "redo", "retry"
- Specific character/location/shot references
- "change style"

**Dispatch:** `sub-skills/regen/SKILL.md`

### STATUS

The user wants to check progress on an existing project.

**Handle directly** — no sub-skill dispatch needed:

1. Follow Producer Read from `sub-skills/producer/SKILL.md`
2. Read project.json
3. Report:
   - Project name and status
   - Current stage
   - Characters: {completed}/{total}
   - Locations: {completed}/{total}
   - Shots: {completed}/{total} ({failed} failed)
   - Next action recommendation

---

## Preflight (All Intents)

Before dispatching any sub-skill, run these checks in order:

### 1. Resolve Paths

1. **PLUGIN_ROOT** — the directory containing this SKILL.md file
2. **PLUGIN_SCRIPTS** — `{PLUGIN_ROOT}/scripts/`
3. **PLUGIN_AGENTS** — `{PLUGIN_ROOT}/agents/`
4. **PLUGIN_REFS** — `{PLUGIN_ROOT}/references/`
5. **PLUGIN_SUB_SKILLS** — `{PLUGIN_ROOT}/sub-skills/`

Verify `PLUGIN_SCRIPTS` exists. If not, tell the user the plugin is misconfigured.

### 2. Validate Replicate API Token

Call the Replicate MCP tool `get_account` (no parameters needed).

- **If it returns account info** — token is valid. Print:
  "Replicate API: connected as {username}"
  Continue to dispatch.

- **If it returns an auth error or the MCP tool is not available** — stop
  immediately and tell the user:
  "Replicate API token is missing or invalid.
  Set REPLICATE_API_TOKEN as a system environment variable and restart
  Claude Code. See README for setup instructions."
  **Do NOT proceed to any sub-skill.**

---

## Requirements

- **Replicate API token** — set `REPLICATE_API_TOKEN` as a system environment
  variable (see README for platform-specific instructions). The MCP server
  declared in `plugin.json` picks it up automatically via variable substitution.
- **Python 3.9+** with Pillow installed (`pip install Pillow`)
- **Replicate MCP server** — local fork at `replicate-mcp-fork/` (auto-configured in plugin.json)

---

## Project Structure

When running, Shot Factory creates a project folder:

```
project_{name}_{timestamp}/
  script/
    original.{ext}
  breakdown/
    act_01.csv
    master_breakdown.csv
  characters/
    characters.json
    {name}/
      sheet.png
      sheet_labelled.png
      sheet.json
  locations/
    locations.json
    {name}/
      overview_sheet.png
      overview_sheet_labelled.png
      overview_sheet.json
  shots/
    shots_master.csv
    scene_{N}/
      shot_{N}.png
      shot_{N}.json
  state/
    project.json
  contact_sheet.html
```
