# Script Parser — Parse-Only Mode

> **Dispatched by:** Master SKILL.md when intent is PARSE_ONLY.
> Breaks down a script without generating any images.

---

## When to Use

The user wants to:
- Parse a script and review the breakdown before committing to generation
- Import a script into a new or existing project without running the full pipeline
- Re-parse a script after making edits

---

## Step 0: Preflight

1. Resolve `PLUGIN_SCRIPTS` — derive from where this file was loaded,
   navigate to `../../scripts/`. Verify the directory exists.
2. Resolve `PLUGIN_AGENTS` — same parent, `../../agents/`.
3. Resolve `PLUGIN_REFS` — same parent, `../../references/`.

---

## Step 1: Producer Init

- Follow Producer Init from `sub-skills/producer/SKILL.md`
- Ask user for their script file path
- Copy script to `{project_root}/script/original.{ext}`

If a project already exists (user provides project path):
- Follow Producer Read instead
- Confirm with user: "Re-parsing will overwrite the existing breakdown. Continue?"
- If no: stop

---

## Step 2: Dispatch Director Agent

```
Task tool:
  subagent_type: "general-purpose"
  prompt: "Read agents/director/AGENT.md and follow its instructions.
           script_path: {path}
           project_root: {project_root}
           PLUGIN_SCRIPTS: {scripts_path}"
```

Wait for completion. Read the updated project.json.

---

## Step 3: Show Summary

Read the generated files and present to the user:

1. **Breakdown stats:**
   - Total scenes: {N}
   - Total shots: {N}
   - Total characters: {N}
   - Total locations: {N}

2. **Character list:** Names and scene appearances

3. **Location list:** Names with INT/EXT and time of day

4. **Act structure:** How many acts, scenes per act

---

## Step 4: Interactive Edits (Optional)

Ask: "Would you like to make any changes before continuing?"

If yes, handle:
- **Add/remove characters** — update characters.json
- **Add/remove locations** — update locations.json
- **Adjust shot breakdowns** — edit the act CSV files
- **Re-split acts** — regenerate act boundaries

After each edit, re-read and re-display the affected section.

---

## Step 5: Complete

Tell user:
"Script parsed and breakdown saved to: {project_root}

To generate images, run the pipeline:
  'Run the Shot Factory pipeline on {project_root}'"

Set `current_stage = "breakdown"` in project.json.
