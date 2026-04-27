"""
MBC Media Group — Media Kit Generator Backend
FastAPI service: receives intake form data → calls Claude → edits PPTX → returns file
"""

import os
import io
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

from claude_ai import generate_kit_content
from pptx_engine import apply_replacements
from drive import get_master_deck

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="MBC Media Kit Generator", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "*")],
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)


# ── Request / Response Models ─────────────────────────────────────────────────

class KitRequest(BaseModel):
    client_name: str
    industry: str
    objective: str
    audience: Optional[str] = ""
    budget: str
    selected_sbus: List[str] = []
    notes: Optional[str] = ""
    rep_name: Optional[str] = ""
    rep_mobile: Optional[str] = ""
    rep_email: Optional[str] = ""



class HealthResponse(BaseModel):
    status: str
    version: str


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/health", response_model=HealthResponse)
async def health():
    return {"status": "ok", "version": "1.0.0"}


@app.post("/generate-kit")
async def generate_kit(req: KitRequest):
    """
    Main endpoint. Orchestrates:
    1. Claude API call → structured JSON content
    2. Master deck fetch from Drive/local
    3. python-pptx placeholder replacement
    4. Return PPTX as streaming response
    """
    logger.info(f"Generating kit for: {req.client_name} | {req.industry}")

    try:
        # Step 1: Generate content via Claude
        kit_content = await generate_kit_content(req)
        logger.info("Claude content generated successfully")

        # Step 2: Get a fresh copy of the master deck
        master_bytes = get_master_deck()

        # Step 3: Apply placeholder replacements
        output_bytes = apply_replacements(
            pptx_bytes=master_bytes,
            client_name=req.client_name,
            industry=req.industry,
            kit=kit_content,
            rep_name=req.rep_name or "",
            rep_mobile=req.rep_mobile or "",
            rep_email=req.rep_email or "",
        )
        logger.info("PPTX replacements applied successfully")

        # Step 4: Stream the file back
        safe_name = req.client_name.replace(" ", "_").replace("/", "-")
        filename = f"MBC_{safe_name}_MediaKit.pptx"

        return StreamingResponse(
            io.BytesIO(output_bytes),
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Kit generation failed: {str(e)}")
