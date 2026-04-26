# /add-placeholder
Safely add a new `{{PLACEHOLDER}}` tag to the system end-to-end.

## Usage
```
/add-placeholder
```

## What this does
Guides you through the 5 steps needed to add a new placeholder consistently across all layers — PPTX, backend engine, AI prompt, and frontend form — without missing any.

## Steps Claude will follow
1. Ask for: placeholder name (e.g. `RATE_PACKAGE`), slide number it appears on, what it represents
2. Update `CLAUDE.md` placeholder map table
3. Update `backend/pptx_engine.py` → `PLACEHOLDER_MAP` dict
4. Update `backend/claude_ai.py` → system prompt JSON schema definition
5. Ask if this needs a new frontend form field — if yes, add to `IntakeForm.tsx`
6. Remind you to manually add the `{{PLACEHOLDER}}` tag to the PowerPoint file

## Notes
- This command does NOT modify the PPTX file itself — that must be done manually in PowerPoint
- Always test with `/generate-kit` after adding a new placeholder
