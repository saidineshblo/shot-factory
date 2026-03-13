---
name: shot-factory
description: >
  Master skill for an AI movie pre-production
  pipeline. Understands user queries and routes
  work to sub-skills for script parsing, character
  sheets, location sheets, shot grids, and contact
  sheet generation, while keeping a consistent
  project state and memory.
version: 1.0.0
---

# Shot Factory

> Master skill for a movie AI generator plugin.
> Understands the user's request and either runs a
> full end-to-end pipeline or dispatches focused
> sub-skills for characters, locations, shots, or
> parsing only.

---

## What This Master Skill Does

Shot Factory takes a screenplay or shot breakdown
and produces visual references for characters,
locations, and shots. It uses a series of
sub-skills and agents to:

- Parse scripts into structured act CSVs, character
  lists, and location lists.
- Generate **multi-angle character sheets** (with
  optional user reference images).
- Generate **multi-angle location sheets** (with
  support for multiple views or floor-plan-style
  layouts via prompts).
- Generate **shot grids** per scene with continuity
  across shots, based on a master shot breakdown
  CSV.
- Keep a **stateful project folder** (via the
  Producer pattern) so you can resume, regenerate,
  or inspect progress at any time.
- Build a **contact sheet** summarizing the entire
  project.

For simple, targeted tasks (for example: just
generate character sheets, or only generate shots
from an existing breakdown), the master skill:

- Reads the user's intent.
- Locates or initializes a project via Producer.
- Dispatches only the necessary agents
  (character-sheet, location-sheet, shot-grid).

For complex tasks (for example: "generate an
end-to-end movie from this script"), the master
skill:

- Uses the pipeline-runner sub-skill to go from
  raw script through breakdown, confirmation,
  generation, retries, and contact sheet output.
- Ensures that the Producer pattern is respected
  so state is updated at every major step.

## Commands / Intents

| Intent            | Trigger phrases              |
| ----------------- | ---------------------------- |
| **Full pipeline** | "Run Shot Factory",          |
|                   | "Generate my film",          |
|                   | "Start the pipeline"         |
| **Parse only**    | "Parse my script",           |
|                   | "Break down this screenplay",|
|                   | "Just do the breakdown"      |
| **Resume**        | "Resume my project",         |
|                   | "Continue where I left off", |
|                   | "Pick up from {stage}"       |
| **Regenerate**    | "Regenerate Khan",           |
|                   | "Redo scene 3",              |
|                   | "Retry failed shots",        |
|                   | "Change style"               |
| **Status**        | "Show project status",       |
|                   | "Where are we?",             |
|                   | "How many shots left?"       |

---

## Intent Classification

Read the user's message and classify into one of:

### FULL_RUN

The user wants to run the complete pipeline from
script to contact sheet. They may or may not have
an existing project.

**Dispatch:**
`sub-skills/pipeline-runner/SKILL.md`

### PARSE_ONLY

The user wants to parse a script and review the
breakdown, but NOT generate images yet.

**Dispatch:**
`sub-skills/script-parser/SKILL.md`

### SIMPLE_GENERATION

The user clearly asks for **only one type of
asset** without running the whole pipeline.
Examples:

- "Just generate character sheets for these
  characters"
- "Only make the location sheets"
- "Create shots for this existing breakdown CSV"

Handle SIMPLE_GENERATION by:

1. Running **Producer Read** from
   `sub-skills/producer/SKILL.md` to locate or
   initialize a project.
2. Making sure the relevant registry file exists:
   - Characters:
     `{project_root}/characters/characters.json`
   - Locations:
     `{project_root}/locations/locations.json`
   - Shots:
     `{project_root}/shots/shots_master.csv`
3. Dispatching only the specific agents needed:
   - `agents/character-sheet/AGENT.md`
     for character sheets.
   - `agents/location-sheet/AGENT.md`
     for location sheets.
   - `agents/shot-grid/AGENT.md`
     for shot generation by scene.
4. Updating `project.json` via the Producer
   pattern so the work can be resumed or extended
   later.

### RESUME

The user references an existing project and wants
to continue from where it stopped. Look for:

- A project path they provide
- "resume", "continue", "pick up"
- A `project_*/state/project.json` with
  `status != "completed"`

**Dispatch:**
`sub-skills/pipeline-runner/SKILL.md` (resume mode)

### REGEN

The user wants to regenerate specific assets.
Look for:

- "regenerate", "redo", "retry"
- Specific character/location/shot references
- "change style"

**Dispatch:** `sub-skills/regen/SKILL.md`

### STATUS

The user wants to check progress on an existing
project.

**Handle directly** — no sub-skill dispatch needed:

1. Follow Producer Read from
   `sub-skills/producer/SKILL.md`.
2. Read `project.json`.
3. Report:
   - Project name and status.
   - Current stage (`breakdown`, `characters`,
     `locations`, `shots`, or `done`).
   - Characters: {completed}/{total}.
   - Locations: {completed}/{total}.
   - Shots: {completed}/{total}
     ({failed} failed).
   - Next action recommendation (for example:
     "confirm characters",
     "generate locations", "run shot grid",
     "review failed shots", or
     "rebuild contact sheet").

---

## Preflight (All Intents)

Before dispatching any sub-skill or agent, run
these checks in order:

### 1. Resolve Paths

1. **PLUGIN_ROOT** — the directory containing
   this SKILL.md file
2. **PLUGIN_SCRIPTS** —
   `{PLUGIN_ROOT}/scripts/`
3. **PLUGIN_AGENTS** —
   `{PLUGIN_ROOT}/agents/`
4. **PLUGIN_REFS** —
   `{PLUGIN_ROOT}/references/`
5. **PLUGIN_SUB_SKILLS** —
   `{PLUGIN_ROOT}/sub-skills/`

Verify `PLUGIN_SCRIPTS` exists. If not, tell the
user the plugin is misconfigured.

### 2. studioblo-replicate Health Check

Call the `health_check` tool from the
studioblo-replicate MCP server.

**If the tool is not found
(MCP server not installed):**
Tell the user:
"The studioblo-replicate MCP server is not
installed. Get the studioblo-replicate.mcpb file
from your admin and install it:
  Claude Desktop > Settings > Extensions >
  Install Extension... > select the .mcpb file
Then restart Claude Code."
**Do NOT proceed.**

**If the tool exists but is disabled:**
Tell the user:
"The studioblo-replicate MCP server is installed
but disabled. Enable it in Claude Desktop:
  Settings > Extensions >
  studioblo-replicate > enable
Then restart Claude Code."
**Do NOT proceed.**

**If health_check returns a response starting
with "FAIL":**
Show the exact error message to the user and
stop. The health_check response already includes
step-by-step instructions for the user to fix
the issue.
**Do NOT proceed.**

**If health_check returns "OK":**
Print the account info and continue to dispatch.

---

## Requirements

- **Python 3.9+** with Pillow installed
  (`pip install Pillow`)
- **studioblo-replicate** MCP server — install
  the MCPB bundle from your admin

---

## Project Structure

When running, Shot Factory uses the **Producer**
pattern to create and maintain a project folder
that all sub-skills and agents share.

At a high level the structure is:

```text
project_{name}_{timestamp}/
  script/
    original.{ext}
  breakdown/
    act_01.csv
    act_02.csv
    act_03.csv
    master_breakdown.csv
  characters/
    characters.json
    {character_name}/
      sheet.png
      sheet_labelled.png
      sheet.json
  locations/
    locations.json
    {location_name}/
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

### Characters Registry

`characters/characters.json` keeps a registry of
every character:

- `description` — free-text description of the
  character.
- `user_ref_path` — optional path to a
  user-provided reference image.
- `sheet_status` — `"pending"`, `"completed"`,
  or `"failed"`.
- `sheet_local_path`, `sheet_labelled_path`,
  `sidecar_path` — filled in by the
  character-sheet agent.
- `appearances` — list of scenes where the
  character appears.

The character-sheet agent generates a
**multi-angle character sheet** and always:

- Validates any `user_ref_path` using
  `scripts/validate_reference.py`.
- Generates `sheet.png`, labels it into
  `sheet_labelled.png`, and writes a `sheet.json`
  sidecar with details and Replicate URLs.
- Updates `characters.json` and increments the
  `characters.completed` count in
  `state/project.json`.

### Locations Registry

`locations/locations.json` keeps a registry of
every location:

- `description` — free-text description of the
  location.
- `int_ext` — whether the scene is INT or EXT.
- `time_of_day` — DAY, NIGHT, etc.
- `sheet_status` — `"pending"`, `"completed"`,
  or `"failed"`.
- `sheet_local_path`, `sheet_labelled_path`,
  `sidecar_path` — filled in by the
  location-sheet agent.
- `scenes` — list of scenes that use this
  location.

The location-sheet agent generates
**multi-angle overview sheets** and can support
multiple sheets per location via additional
entries or sidecar metadata, including layout
details like floor plans when prompted.

### Shots Registry and Continuity

`shots/shots_master.csv` is the canonical list
of shots. The Director agent:

- Parses the script
  (TXT, Fountain, FDX, PDF, DOCX, or CSV).
- Splits long scripts into acts and writes
  `act_*.csv` files.
- Writes a merged `master_breakdown.csv`.
- Copies the master breakdown into
  `shots/shots_master.csv` with at least:
  - `act, scene_number, shot_number, shot_type,
    angle, characters, location,
    action_description, dialogue_hint,
    time_of_day, continuity_notes,
    replicate_url, status, local_path,
    attempts`.
  - All `status` values start as `"pending"`
    and `replicate_url` is empty.

The shot-grid agent:

- Works **scene by scene**, generating every
  shot in that scene while:
  - Loading character and location labelled
    sheets as references.
  - Building continuity context from the
    previous shot in the same scene.
  - Ensuring that shots within a scene feel
    like a continuous sequence, not isolated
    images.
- Updates each row in `shots_master.csv` with:
  - `status = "completed"` or `"failed"`.
  - `local_path` to the saved PNG.
  - `replicate_url` pointing back to the
    Replicate prediction.
  - Any error information for failed shots.

Across all of these, **Producer Read/Write** and
`state/project.json` keep the global status in
sync so:

- You can **resume** a project without redoing
  completed work.
- You can **regenerate** specific characters,
  locations, or shots.
- You can **inspect status** at any time and
  know exactly what remains.
