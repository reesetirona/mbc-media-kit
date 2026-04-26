# /deploy
Commit all changes, push to GitHub, and confirm both Vercel and Railway deployments triggered.

## Usage
```
/deploy "your commit message"
```

## What this does
1. Run `git status` to show what changed
2. Run `git add -A`
3. Run `git commit -m "<your message>"`
4. Run `git push origin main`
5. Remind you to check Vercel dashboard for frontend deploy status
6. Remind you to check Railway dashboard for backend deploy status

## Notes
- Never commits `.env` or `.env.local` — these are in `.gitignore`
- Never commits files in `output/` — generated PPTX files are gitignored
- If push fails, check if you need to `git pull` first
