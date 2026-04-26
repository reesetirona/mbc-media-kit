"""
drive.py — Fetches the master PPTX from storage.
Supports:
  - Local file path (development)
  - Supabase Storage (production) — set SUPABASE_URL + SUPABASE_SERVICE_KEY + MASTER_DECK_BUCKET
  - Google Drive (optional) — set MASTER_DECK_DRIVE_ID + GOOGLE_SERVICE_ACCOUNT_JSON
"""

import os
import io
import logging

logger = logging.getLogger(__name__)


def get_master_deck() -> bytes:
    """
    Returns the master PPTX as bytes.
    Priority: Supabase → Google Drive → Local file
    """
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    drive_id     = os.getenv("MASTER_DECK_DRIVE_ID")

    if supabase_url and supabase_key:
        return _fetch_from_supabase(supabase_url, supabase_key)
    elif drive_id:
        return _fetch_from_drive(drive_id)
    else:
        return _fetch_from_local()


def _fetch_from_supabase(url: str, key: str) -> bytes:
    """Download master deck from Supabase Storage."""
    try:
        from supabase import create_client

        bucket = os.getenv("MASTER_DECK_BUCKET", "master-deck")
        file   = os.getenv("MASTER_DECK_FILE",   "MBC_MASTER_DECK.pptx")

        client   = create_client(url, key)
        response = client.storage.from_(bucket).download(file)

        logger.info(f"Master deck downloaded from Supabase: {bucket}/{file}")
        return response

    except ImportError:
        raise ImportError(
            "Supabase library not installed. Run:\n"
            "pip install supabase"
        )
    except Exception as e:
        raise RuntimeError(f"Failed to fetch master deck from Supabase: {e}")


def _fetch_from_local() -> bytes:
    """Read master deck from local filesystem (development mode)."""
    path = os.getenv("MASTER_DECK_PATH", "./master-deck/MBC_MASTER_DECK.pptx")

    if not os.path.exists(path):
        raise FileNotFoundError(
            f"Master deck not found at: {path}\n"
            "Set MASTER_DECK_PATH in your .env or place the file at the default path."
        )

    logger.info(f"Loading master deck from local path: {path}")
    with open(path, "rb") as f:
        return f.read()


def _fetch_from_drive(file_id: str) -> bytes:
    """Download master deck from Google Drive using a service account."""
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaIoBaseDownload

        sa_path = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON", "./service-account.json")
        creds = service_account.Credentials.from_service_account_file(
            sa_path,
            scopes=["https://www.googleapis.com/auth/drive.readonly"],
        )

        service = build("drive", "v3", credentials=creds)
        request = service.files().get_media(fileId=file_id)

        buffer = io.BytesIO()
        downloader = MediaIoBaseDownload(buffer, request)

        done = False
        while not done:
            _, done = downloader.next_chunk()

        logger.info(f"Master deck downloaded from Google Drive: {file_id}")
        buffer.seek(0)
        return buffer.read()

    except ImportError:
        raise ImportError(
            "Google API libraries not installed. Run:\n"
            "pip install google-api-python-client google-auth"
        )
