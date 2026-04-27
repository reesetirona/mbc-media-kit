# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Does
An internal web tool for MBC Media Group sales reps. A rep fills out a client intake form (industry, goals, budget, preferred SBUs), Claude AI generates tailored copy, and a customized PowerPoint media kit is automatically produced and downloaded — in under 5 minutes.

## Architecture at a Glance
```
mbc-media-kit/
├── frontend/          # Next.js (App Router) + TypeScript + Tailwind
│   ├── app/           # App router pages
│   ├── components/    # React components
│   ├── hooks/         # useKitGenerator — state machine for the generation flow
│   ├── lib/           # api.ts (fetch wrapper), constants.ts, supabase.ts
│   └── types/         # Shared TypeScript interfaces (KitRequest, KitContent, etc.)
├── backend/           # FastAPI (Python 3.11)
│   ├── main.py        # Single entry point — POST /generate-kit, GET /health
│   ├── pptx_engine.py # ZIP-based XML replacement (NOT python-pptx objects)
│   ├── claude_ai.py   # Anthropic SDK — web search tool + JSON output
│   └── drive.py       # Master deck fetch: Supabase → Google Drive → local
├── master-deck/
│   └── MBC_MASTER_DECK.pptx  # Branded template — NEVER edit directly
└── .claude/commands/  # /add-placeholder, /deploy, /generate-kit slash commands
```

## Development Commands

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate  # first time only
pip install -r requirements.txt                   # first time only
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install          # first time only
npm run dev          # dev server
npm run build        # production build + type check
npm run lint         # ESLint
```

### Audit PPTX placeholders (verify master deck tags are complete)
```python
from backend.pptx_engine import audit_placeholders
tags = audit_placeholders(open("master-deck/MBC_MASTER_DECK.pptx", "rb").read())
print(tags)
```

## Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Supabase Auth
- **Backend:** FastAPI, Python 3.11, Anthropic SDK, python-pptx (as dep only — see note below)
- **Database:** Supabase (Postgres) — table: `kit_submissions`
- **Storage:** Supabase Storage (primary) → Google Drive (fallback) → local file (dev)
- **AI:** `claude-sonnet-4-6` via Anthropic API with `web_search_20250305` tool
- **Deployment:** Vercel (frontend) + Railway (backend)

## Key Architectural Notes

### PPTX Manipulation Uses Raw ZIP/XML
`pptx_engine.py` does **not** use python-pptx's object model. It treats the `.pptx` as a ZIP archive and does string replacement directly on slide XML files (`ppt/slides/slide*.xml`). This preserves all fonts, colors, and layouts exactly — but means XML characters in AI output must be escaped (handled by `xml_escape()`).

### Claude Uses Web Search Before Writing
`claude_ai.py` passes a `web_search_20250305` tool to the API. Claude researches the client's brand, campaigns, and competitors in the Philippines before generating copy. The API call is synchronous (not streaming); the response may contain multiple content blocks (tool_use + tool_result + final text) — only the last text block is extracted.

### Hardcoded Contact Fields
`{{CONTACT_NAME}}`, `{{CONTACT_TITLE}}`, and `{{CONTACT_EMAIL}}` are hardcoded constants in `pptx_engine.py:build_replacements()`, not AI-generated. The `recommended_sbus` key in the Claude JSON response is metadata only — it has no corresponding PPTX placeholder.

## Key Conventions
- All placeholder tags in the PPTX use `{{SCREAMING_SNAKE_CASE}}` e.g. `{{CLIENT_NAME}}`
- The master deck is **always copied before editing** — never mutated directly
- The Anthropic API key lives **only in the backend `.env`** — never in the frontend
- Frontend calls backend at `NEXT_PUBLIC_BACKEND_URL/generate-kit` — not Claude directly
- Python: use type hints everywhere, Pydantic models for request/response
- TypeScript: strict mode on, no `any` types

## Environment Variables

### Backend (`backend/.env`)
```
ANTHROPIC_API_KEY=sk-ant-...
FRONTEND_URL=https://your-app.vercel.app
MASTER_DECK_PATH=./master-deck/MBC_MASTER_DECK.pptx
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
MASTER_DECK_BUCKET=master-deck
MASTER_DECK_FILE=MBC_MASTER_DECK.pptx
GOOGLE_SERVICE_ACCOUNT_JSON=./service-account.json
MASTER_DECK_DRIVE_ID=1xxxxxxxxxxxxxxx
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_BACKEND_URL=https://mbc-kit-backend.railway.app
```

## PPTX Placeholder Map
These are the exact tags in `MBC_MASTER_DECK.pptx`. The AI must populate all of them.

| Placeholder | Description | Slide | Source |
|---|---|---|---|
| `{{CLIENT_NAME}}` | Client/brand name | 1, 2, 3, 5 | Form input |
| `{{CLIENT_INDUSTRY}}` | Industry vertical | 2 | Form input |
| `{{TAGLINE}}` | One-line tagline for this client | 1 | Claude |
| `{{CLIENT_INTRO}}` | 2-3 sentence intro paragraph | 2 | Claude |
| `{{CLIENT_WHY}}` | Why MBC for this industry | 2 | Claude |
| `{{SBU_1_NAME}}` | Primary SBU name | 3 | Claude |
| `{{SBU_1_DESC}}` | Primary SBU description | 3 | Claude |
| `{{SBU_2_NAME}}` | Secondary SBU name | 3 | Claude |
| `{{SBU_2_DESC}}` | Secondary SBU description | 3 | Claude |
| `{{SBU_3_NAME}}` | Third SBU name | 3 | Claude |
| `{{SBU_3_DESC}}` | Third SBU description | 3 | Claude |
| `{{CAMPAIGN_TITLE}}` | Campaign concept title | 4 | Claude |
| `{{CAMPAIGN_DESC}}` | Campaign description | 4 | Claude |
| `{{DELIVERABLE_1}}` | First deliverable | 4 | Claude |
| `{{DELIVERABLE_2}}` | Second deliverable | 4 | Claude |
| `{{DELIVERABLE_3}}` | Third deliverable | 4 | Claude |
| `{{PLATFORM_1}}` | Platform 1 name | 4 | Claude |
| `{{PCT_1}}` | Platform 1 media weight | 4 | Claude |
| `{{PLATFORM_2}}` | Platform 2 name | 4 | Claude |
| `{{PCT_2}}` | Platform 2 media weight | 4 | Claude |
| `{{PLATFORM_3}}` | Platform 3 name | 4 | Claude |
| `{{PCT_3}}` | Platform 3 media weight | 4 | Claude |
| `{{CTA_LINE}}` | Closing CTA line | 5 | Claude |
| `{{CONTACT_NAME}}` | MBC contact name | 5 | Hardcoded |
| `{{CONTACT_TITLE}}` | MBC contact title | 5 | Hardcoded |
| `{{CONTACT_EMAIL}}` | MBC contact email | 5 | Hardcoded |

## MBC SBUs (Source of Truth)
1. **MBC Radio** — DZRH, Love Radio, Yes FM, Easy Rock, Radyo Natin, Aksyon Radyo. 200 stations, 4.5M daily listeners.
2. **MBC Digital** — Branded content, display, rich media, programmatic. Full digital lifecycle management.
3. **MBC TV** — News, public affairs, entertainment. Made-for-TV content.
4. **MBC Events** — On-ground activations, community events, regional fiestas.
5. **MBC Promos** — Multi-platform promos, raffle draws, gamified campaigns.
6. **MBC Talents** — Talent management and brand endorsements.

## Custom Slash Commands
- `/add-placeholder` — guides through adding a new `{{TAG}}` end-to-end across all layers
- `/generate-kit` — prompts for client details, POSTs to localhost:8000, saves PPTX to `output/`
- `/deploy "message"` — commits, pushes, and confirms Vercel + Railway redeploys

## Adding a New Placeholder
1. Add the `{{NEW_TAG}}` to the PPTX manually in PowerPoint
2. Add the key to the placeholder map table above (with slide number and source)
3. Add it to `backend/pptx_engine.py` → `build_replacements()`
4. Add the field to `backend/claude_ai.py` → system prompt JSON schema (if Claude-generated)
5. Add the field to `frontend/components/IntakeForm.tsx` if it needs user input

## Adding or Updating SBU Descriptions
- Update the SBU list in this file (above)
- Update `backend/claude_ai.py` → `SYSTEM_PROMPT` SBU definitions section

## Deploying
```bash
# Frontend auto-deploys on git push to main (Vercel)
git push origin main
# Backend: Railway auto-redeploys on push — or trigger manually in Railway dashboard
```

## Database Schema
```sql
CREATE TABLE kit_submissions (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    timestamptz DEFAULT now(),
  rep_email     text,
  client_name   text NOT NULL,
  industry      text,
  objective     text,
  audience      text,
  budget        text,
  selected_sbus text[],
  notes         text,
  ai_output     jsonb,
  pptx_url      text,
  status        text DEFAULT 'pending'
);
```

## Do Not
- Do NOT call the Anthropic API from the frontend
- Do NOT commit `.env` or `.env.local` files
- Do NOT modify `MBC_MASTER_DECK.pptx` programmatically — always copy first
- Do NOT remove placeholder tags from the PPTX without updating the backend map
- Do NOT use `any` types in TypeScript
