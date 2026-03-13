# Shot Factory

End-to-end animated film pre-production pipeline for
Claude Code.

Turns a screenplay or shot breakdown into character
reference sheets, location concept art, and individual
shot frames — all generated via Replicate and saved
locally.

## Requirements

- Claude Code with plugin support
- Python 3.9+ with Pillow (`pip install Pillow`)
- studioblo-replicate MCP server (MCPB bundle)

## Setup

### 1. Install studioblo-replicate MCP server

Get the `studioblo-replicate.mcpb` bundle from your
admin and double-click it to install in Claude Desktop.
You will be prompted to enter your Replicate API token
during installation. Get a token at
<https://replicate.com/account/api-tokens>

### 2. Install Python dependencies

```bash
pip install Pillow pytest
```

### 3. Verify setup

Start Claude Code and run Shot Factory. The plugin
automatically runs a health check on startup to verify
studioblo-replicate is installed, enabled, and your
token is valid. If anything is wrong, you'll see a
clear error message.

## Usage

Start a conversation with Claude Code and say:

- **"Run Shot Factory on my script"** — full pipeline
  from script to contact sheet
- **"Parse my script"** — breakdown only, no image
  generation
- **"Resume my project"** — continue from where it
  stopped
- **"Regenerate Khan"** — redo specific
  character/location/shot assets
- **"Show project status"** — check progress

## Pipeline Steps

1. Script parsing
   (supports CSV, TXT, Fountain, FDX, PDF, DOCX)
2. Character and location extraction
3. User confirmation of characters and locations
4. Style configuration
   (visual style, color palette, model selection)
5. Optional style proof
   (test generation before full run)
6. Character sheet generation
   (2x2 turnaround grids)
7. Location sheet generation
   (2x2 environment concepts)
8. Shot frame generation
   (scene by scene with continuity context)
9. HTML contact sheet output

## Project Structure

```text
project_{name}_{timestamp}/
  script/original.{ext}
  breakdown/act_01.csv, master_breakdown.csv
  characters/characters.json, {name}/sheet.png
  locations/locations.json,
    {name}/overview_sheet.png
  shots/shots_master.csv,
    scene_{N}/shot_{N}.png
  state/project.json
  contact_sheet.html
```

## Plugin Architecture

```text
skills/shot-factory/
  SKILL.md                    # Master intent router
  sub-skills/
    pipeline-runner/SKILL.md  # Full pipeline
    script-parser/SKILL.md    # Parse-only mode
    producer/SKILL.md         # State management
    regen/SKILL.md            # Targeted regen
  agents/
    director/AGENT.md         # Script parsing
    character-sheet/AGENT.md  # Character sheets
    location-sheet/AGENT.md   # Location sheets
    shot-grid/AGENT.md        # Shot frames
  scripts/
    validate_csv.py           # CSV validation
    validate_reference.py     # Image validation
    split_grid.py             # Grid splitter
    label_reference.py        # Reference labeler
    build_contact_sheet.py    # HTML builder
  references/
    prompt-templates.md       # Prompt templates
```

## Testing

```bash
pytest tests/ -v
```

## License

Proprietary - Studioblo
