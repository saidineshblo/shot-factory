# Shot Factory

End-to-end animated film pre-production pipeline for Claude Code.

Turns a screenplay or shot breakdown into character reference sheets, location concept art, and individual shot frames — all generated via Replicate and saved locally.

## Requirements

- Claude Code with plugin support
- Python 3.9+ with Pillow (`pip install Pillow`)
- Replicate API token

## Setup

1. Copy `.env.example` to `.env` and add your Replicate API token
2. Install Python dependencies: `pip install Pillow pytest`
3. The MCP server (`@replicate/mcp`) is auto-configured in `mcp.json`

## Usage

Start a conversation with Claude Code and say:

- **"Run Shot Factory on my script"** — full pipeline from script to contact sheet
- **"Parse my script"** — breakdown only, no image generation
- **"Resume my project"** — continue from where it stopped
- **"Regenerate Khan"** — redo specific character/location/shot assets
- **"Show project status"** — check progress

## Pipeline Steps

1. Script parsing (supports CSV, TXT, Fountain, FDX, PDF, DOCX)
2. Character and location extraction
3. User confirmation of characters and locations
4. Style configuration (visual style, color palette, model selection)
5. Optional style proof (test generation before full run)
6. Character sheet generation (2x2 turnaround grids)
7. Location sheet generation (2x2 environment concepts)
8. Shot frame generation (scene by scene with continuity context)
9. HTML contact sheet output

## Project Structure

```
project_{name}_{timestamp}/
  script/original.{ext}
  breakdown/act_01.csv, master_breakdown.csv
  characters/characters.json, {name}/sheet.png
  locations/locations.json, {name}/overview_sheet.png
  shots/shots_master.csv, scene_{N}/shot_{N}.png
  state/project.json
  contact_sheet.html
```

## Plugin Architecture

```
skills/shot-factory/
  SKILL.md                    # Master intent router
  sub-skills/
    pipeline-runner/SKILL.md  # Full pipeline orchestration
    script-parser/SKILL.md    # Parse-only mode
    producer/SKILL.md         # State management pattern
    regen/SKILL.md            # Targeted regeneration
  agents/
    director/AGENT.md         # Script parsing agent
    character-sheet/AGENT.md  # Character sheet generation
    location-sheet/AGENT.md   # Location sheet generation
    shot-grid/AGENT.md        # Shot frame generation
  scripts/
    validate_csv.py           # CSV schema validation
    validate_reference.py     # Image validation
    split_grid.py             # Grid image splitter
    label_reference.py        # Reference image labeler
    build_contact_sheet.py    # HTML contact sheet builder
  references/
    prompt-templates.md       # Prompt templates and schemas
```

## Testing

```bash
pytest tests/ -v
```

## License

Proprietary - Studioblo
