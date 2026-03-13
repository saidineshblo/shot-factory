---
name: producer
description: State management pattern for reading, initializing, and writing project.json across all agents and sub-skills.
---

# Producer — State Management Pattern

> **This is NOT an agent.** This is an instruction set that every agent and
> sub-skill follows at the start and end of execution to manage project state.
>
> Read this file to understand the state contract. Do not dispatch this as a task.

---

## Producer Read

Every agent runs this at the START of execution:

1. **Locate project.json:**
   - If `project_root` was passed as input → use `{project_root}/state/project.json`
   - If not → search for the most recently modified `project_*/state/project.json`
     in the current working directory
   - If none found → this is a new project, see Producer Init below

2. **Read project.json** into memory

3. **Version check:** Verify `version == "3.0.0"`.
   If older version found, tell user:
   "Found a project from an older plugin version. It may not be compatible.
   Proceed anyway? [Y/N]"

4. **Return** the project state object

---

## Producer Init

The pipeline-runner uses this when starting a fresh project:

1. Ask user: "What is your project name?"
   (Use a sanitized version for the folder name: lowercase, hyphens, no spaces)

2. Generate a timestamp: `YYYYMMDD_HHMMSS`

3. Create folder: `project_{name}_{timestamp}/`

4. Create subfolders:
   ```
   state/
   script/
   breakdown/
   characters/
   locations/
   shots/
   ```

5. Write initial `state/project.json`:
   ```json
   {
     "version": "3.1.0",
     "project_id": "{generated UUID}",
     "project_name": "{user's project name}",
     "project_root": "{absolute path to project folder}",
     "created_at": "{ISO8601}",
     "updated_at": "{ISO8601}",
     "status": "initializing",
     "current_stage": "breakdown",
     "style_profile": {},
     "script": {},
     "breakdown": { "status": "pending" },
     "characters": { "status": "pending", "total": 0, "completed": 0 },
     "locations": { "status": "pending", "total": 0, "completed": 0 },
     "shots": { "status": "pending", "total": 0, "completed": 0, "failed": 0, "retry_queue": [] }
   }
   ```

6. Return `project_root` path

---

## Producer Write

Every agent runs this at the END of execution:

1. **Re-read** current project.json (always re-read before writing to avoid
   clobbering updates from parallel agents)

2. **Merge** the agent's updates into the relevant section ONLY.
   Never overwrite sections owned by other agents.

3. **Set** `updated_at` to current ISO 8601 timestamp

4. **Write atomically:**
   - Write to `project.json.tmp`
   - Rename `project.json.tmp` → `project.json`

5. **Print:** "State updated: {brief description of what changed}"

---

## Stage Progression

The `current_stage` field tracks overall pipeline progress:

```
breakdown → characters → locations → shots → done
```

Stage transitions:
- `breakdown` → `characters`: when `breakdown.status == "completed"`
- `characters` → `locations`: when `characters.status == "completed"`
- `locations` → `shots`: when `locations.status == "completed"`
- `shots` → `done`: when `shots.status == "completed"`

Only the pipeline-runner advances the stage. Individual agents do not.

---

## Canonical project.json Schema

See `references/prompt-templates.md` section 6 for the full schema definition.
That is the single source of truth.

---

## State Verification

`scripts/verify_state.py` is a deterministic safety net that reconciles
file-system reality with the project state files. It exists because LLM agents
occasionally complete their work (files are generated and saved) but forget to
update the corresponding JSON or CSV state entries.

**How it works:**

1. Reads `state/project.json`, `characters/characters.json`,
   `locations/locations.json`, and `shots/shots_master.csv`.
2. For each asset, checks whether the expected output file exists on disk.
   If the file exists but the status says "pending", it corrects the status
   to "completed" and populates the local path. If the status says "completed"
   but the file is missing, it resets the status to "pending".
3. Recounts totals in `project.json` to match the corrected registries.
4. Writes corrections using the same atomic-write pattern (`.tmp` + rename)
   defined in the Producer Write section above.

**When it runs:**

The pipeline-runner calls `verify_state.py` after each major dispatch round:

- After Step 3 (Script Parsing)
- After Step 8 (Character + Location Generation)
- After Step 9 (Shot Generation)
- After Step 10 (Retry Handling)

**Important:** Individual agents should still perform their own Producer Write
at the end of their task. `verify_state.py` is a safety net, not a replacement
for proper state management. It catches the edge cases where an agent completes
its work but fails to persist the state update.
