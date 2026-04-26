# MBC Media Group — Media Kit Automation
> Claude Code project briefing. Read this before every session.

## What This Project Does
An internal web tool for MBC Media Group sales reps. A rep fills out a client intake form (industry, goals, budget, preferred SBUs), Claude AI generates tailored copy, and a customized PowerPoint media kit is automatically produced and downloaded — in under 5 minutes.

## Architecture at a Glance
```
mbc-media-kit/
├── frontend/          # Next.js 14 (App Router) + TypeScript + Tailwind
│   ├── app/           # App router pages
│   ├── components/    # React components
│   └── lib/           # Supabase client, API helpers
├── backend/           # FastAPI (Python 3.11)
│   ├── main.py        # Single entry point — POST /generate-kit
│   ├── pptx_engine.py # python-pptx surgical replacement logic
│   ├── claude_ai.py   # Anthropic SDK call + prompt
│   └── drive.py       # Google Drive / S3 master deck fetch
├── master-deck/
│   └── MBC_MASTER_DECK.pptx  # The branded template — NEVER edit this directly
├── .claude/
│   └── commands/      # Custom slash commands for this project
└── CLAUDE.md          # ← You are here
```

## Tech Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Supabase Auth
- **Backend:** FastAPI, Python 3.11, python-pptx, Anthropic SDK
- **Database:** Supabase (Postgres) — table: `kit_submissions`
- **Storage:** Google Drive (master deck) or Railway Volume
- **AI:** Claude Sonnet (claude-sonnet-4-20250514) via Anthropic API
- **Deployment:** Vercel (frontend) + Railway (backend)

## Key Conventions
- All placeholder tags in the PPTX use `{{SCREAMING_SNAKE_CASE}}` e.g. `{{CLIENT_NAME}}`
- The master deck is **always copied before editing** — never mutated directly
- The Anthropic API key lives **only in the backend `.env`** — never in the frontend
- Frontend calls backend at `NEXT_PUBLIC_BACKEND_URL/generate-kit` — not Claude directly
- All kit generation events are logged to Supabase `kit_submissions` table
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

| Placeholder | Description | Slide |
|---|---|---|
| `{{CLIENT_NAME}}` | Client/brand name | 1, 2, 3, 5 |
| `{{CLIENT_INDUSTRY}}` | Industry vertical | 2 |
| `{{TAGLINE}}` | One-line tagline for this client | 1 |
| `{{CLIENT_INTRO}}` | 2-3 sentence intro paragraph | 2 |
| `{{CLIENT_WHY}}` | Why MBC for this industry | 2 |
| `{{SBU_1_NAME}}` | Primary SBU name | 3 |
| `{{SBU_1_DESC}}` | Primary SBU description | 3 |
| `{{SBU_2_NAME}}` | Secondary SBU name | 3 |
| `{{SBU_2_DESC}}` | Secondary SBU description | 3 |
| `{{SBU_3_NAME}}` | Third SBU name | 3 |
| `{{SBU_3_DESC}}` | Third SBU description | 3 |
| `{{CAMPAIGN_TITLE}}` | Campaign concept title | 4 |
| `{{CAMPAIGN_DESC}}` | Campaign description | 4 |
| `{{DELIVERABLE_1}}` | First deliverable | 4 |
| `{{DELIVERABLE_2}}` | Second deliverable | 4 |
| `{{DELIVERABLE_3}}` | Third deliverable | 4 |
| `{{PLATFORM_1}}` | Platform 1 name | 4 |
| `{{PCT_1}}` | Platform 1 media weight | 4 |
| `{{PLATFORM_2}}` | Platform 2 name | 4 |
| `{{PCT_2}}` | Platform 2 media weight | 4 |
| `{{PLATFORM_3}}` | Platform 3 name | 4 |
| `{{PCT_3}}` | Platform 3 media weight | 4 |
| `{{CTA_LINE}}` | Closing CTA line | 5 |
| `{{CONTACT_NAME}}` | MBC contact name | 5 |
| `{{CONTACT_TITLE}}` | MBC contact title | 5 |
| `{{CONTACT_EMAIL}}` | MBC contact email | 5 |

## MBC SBUs (Source of Truth)
1. **MBC Radio** — DZRH, Love Radio, Yes FM, Easy Rock, Radyo Natin, Aksyon Radyo. 200 stations, 4.5M daily listeners.
2. **MBC Digital** — Branded content, display, rich media, programmatic. Full digital lifecycle management.
3. **MBC TV** — News, public affairs, entertainment. Made-for-TV content.
4. **MBC Events** — On-ground activations, community events, regional fiestas.
5. **MBC Promos** — Multi-platform promos, raffle draws, gamified campaigns.
6. **MBC Talents** — Talent management and brand endorsements.

## Common Claude Code Tasks for This Project

### Adding a new placeholder to the master deck
1. Add the `{{NEW_TAG}}` to the PPTX in PowerPoint
2. Add the key to the placeholder map table above
3. Add it to `backend/pptx_engine.py` → `PLACEHOLDER_MAP`
4. Add the field to `backend/claude_ai.py` → system prompt JSON schema
5. Add the field to `frontend/components/IntakeForm.tsx` if it needs user input

### Adding a new SBU or updating SBU descriptions
- Update the SBU list in this file (above)
- Update `backend/claude_ai.py` → `SYSTEM_PROMPT` SBU definitions section

### Running locally
```bash
# Backend
cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000

# Frontend (separate terminal)
cd frontend && npm run dev
```

### Deploying
```bash
# Frontend auto-deploys on git push to main (Vercel)
git push origin main

# Backend: push triggers Railway redeploy automatically
# Or manually in Railway dashboard → Deploy
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
