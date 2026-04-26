# MBC Media Group — Media Kit Automation

AI-powered tool for MBC sales reps. Fill a client brief → Claude generates tailored content → branded PPTX downloads automatically.

**Stack:** Next.js · FastAPI · python-pptx · Claude API · Supabase · Vercel · Railway

---

## Quickstart (Local Development)

### 1. Clone and set up environment files
```bash
git clone https://github.com/your-org/mbc-media-kit.git
cd mbc-media-kit

# Backend
cp backend/.env.example backend/.env
# → Fill in your ANTHROPIC_API_KEY and other values

# Frontend
cp frontend/.env.local.example frontend/.env.local
# → Values can stay as-is for local dev
```

### 2. Start the backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# → API running at http://localhost:8000
# → Docs at http://localhost:8000/docs
```

### 3. Start the frontend
```bash
cd frontend
npm install
npm run dev
# → App running at http://localhost:3000
```

### 4. Place the master deck
Put `MBC_MASTER_DECK.pptx` in the `master-deck/` folder.  
The backend reads it from there by default.

---

## Project Structure

```
mbc-media-kit/
├── CLAUDE.md              ← Claude Code reads this every session
├── .claude/commands/      ← Custom slash commands for Claude Code
├── frontend/              ← Next.js 14 app (intake form UI)
├── backend/               ← FastAPI Python service
│   ├── main.py            ← Entry point: POST /generate-kit
│   ├── claude_ai.py       ← Anthropic API call + prompt
│   ├── pptx_engine.py     ← python-pptx placeholder replacement
│   └── drive.py           ← Master deck fetching (local or Drive)
└── master-deck/           ← Master PPTX lives here (gitignored output)
```

---

## Deployment

| Service | What it hosts | URL |
|---|---|---|
| Vercel | Frontend (Next.js) | `kit.mbcmediagroup.com` |
| Railway | Backend (FastAPI) | `mbc-kit-backend.railway.app` |
| Supabase | Database + Auth | `supabase.com/dashboard` |

See the [Deployment Guide](../mbc_deployment_guide.html) for full step-by-step instructions.

---

## Using Claude Code with this project

```bash
# Install Claude Code (requires Node 18+)
npm install -g @anthropic-ai/claude-code

# Open Claude Code in project root
cd mbc-media-kit
claude

# Available slash commands (defined in .claude/commands/)
/generate-kit       # Generate a kit from the terminal
/add-placeholder    # Add a new {{PLACEHOLDER}} end-to-end
/deploy             # Commit, push, and confirm deployments
```

Claude Code reads `CLAUDE.md` at the start of every session — the full project context, placeholder map, SBU definitions, and coding conventions are always loaded.

---

## Adding a New Placeholder

1. Add `{{NEW_TAG}}` to the PPTX in PowerPoint
2. Add to `backend/pptx_engine.py` → `build_replacements()`
3. Add to `backend/claude_ai.py` → system prompt JSON schema
4. Update `CLAUDE.md` → placeholder map table
5. Test: restart backend, generate a kit, verify the tag is replaced

Or just run `/add-placeholder` in Claude Code and it guides you through all 5 steps.

---

## Cost Estimate

| Service | Monthly |
|---|---|
| Vercel (Hobby) | Free |
| Railway | ~₱300–560 |
| Supabase (Free tier) | Free |
| Claude API (~100 kits) | ~₱500 |
| **Total** | **~₱800–1,100/mo** |
