# /generate-kit
Generate a complete media kit for a client by providing intake data directly in the terminal.

## Usage
```
/generate-kit
```

## What this does
Prompts you for client details, calls the local backend at localhost:8000/generate-kit, and saves the resulting PPTX to the `output/` folder.

## Steps Claude will follow
1. Ask for: client name, industry, objective, audience, budget, notes
2. POST to `http://localhost:8000/generate-kit` with the data
3. Save the returned PPTX to `output/{client_name}_MediaKit.pptx`
4. Confirm the file was saved and open it if on Mac

## Notes
- Backend must be running locally first: `cd backend && uvicorn main:app --reload`
- Output folder is gitignored — generated kits are never committed
