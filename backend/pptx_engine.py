"""
pptx_engine.py — Applies AI-generated content to the master PPTX.
Opens the master as a ZIP, finds placeholder tags in slide XML,
replaces them, and returns the modified file as bytes.

The master deck is NEVER modified. Always works on a copy.
"""

import io
import zipfile
from typing import Dict


# ── Placeholder Map ───────────────────────────────────────────────────────────
# Maps {{TAG}} → key in the AI-generated kit dict.
# Update this whenever a new placeholder is added to the PPTX.

def build_replacements(client_name: str, industry: str, kit: dict, rep_name: str = "", rep_mobile: str = "", rep_email: str = "") -> Dict[str, str]:
    """
    Constructs the full placeholder → value mapping.
    Add new placeholders here when expanding the master deck.
    """
    return {
        "{{CLIENT_NAME}}":      client_name,
        "{{CLIENT_INDUSTRY}}":  industry,
        "{{TAGLINE}}":          kit.get("tagline", ""),
        "{{CLIENT_INTRO}}":     kit.get("client_intro", ""),
        "{{CLIENT_WHY}}":       kit.get("client_why", ""),
        "{{SBU_1_NAME}}":       kit.get("sbu_1_name", ""),
        "{{SBU_1_DESC}}":       kit.get("sbu_1_desc", ""),
        "{{SBU_2_NAME}}":       kit.get("sbu_2_name", ""),
        "{{SBU_2_DESC}}":       kit.get("sbu_2_desc", ""),
        "{{SBU_3_NAME}}":       kit.get("sbu_3_name", ""),
        "{{SBU_3_DESC}}":       kit.get("sbu_3_desc", ""),
        "{{CAMPAIGN_TITLE}}":   kit.get("campaign_title", ""),
        "{{CAMPAIGN_DESC}}":    kit.get("campaign_desc", ""),
        "{{DELIVERABLE_1}}":    kit.get("deliverable_1", ""),
        "{{DELIVERABLE_2}}":    kit.get("deliverable_2", ""),
        "{{DELIVERABLE_3}}":    kit.get("deliverable_3", ""),
        "{{PLATFORM_1}}":       kit.get("platform_1", ""),
        "{{PCT_1}}":            kit.get("pct_1", ""),
        "{{PLATFORM_2}}":       kit.get("platform_2", ""),
        "{{PCT_2}}":            kit.get("pct_2", ""),
        "{{PLATFORM_3}}":       kit.get("platform_3", ""),
        "{{PCT_3}}":            kit.get("pct_3", ""),
        "{{CTA_LINE}}":         kit.get("cta_line", ""),
        "{{CONTACT_NAME}}":     rep_name   or "MBC Media Group Sales Team",
        "{{CONTACT_TITLE}}":    rep_mobile or "Integrated Media Solutions",
        "{{CONTACT_EMAIL}}":    rep_email  or "corporate@mbcmediagroup.com",
    }


def xml_escape(value: str) -> str:
    """Escape special XML characters in replacement values."""
    return (
        value
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&apos;")
    )


def apply_replacements(pptx_bytes: bytes, client_name: str, industry: str, kit: dict, rep_name: str = "", rep_mobile: str = "", rep_email: str = "") -> bytes:
    """
    Takes the master PPTX as bytes, applies all placeholder replacements,
    and returns the modified PPTX as bytes.

    Works by treating the PPTX as a ZIP archive and doing string replacement
    on the raw XML of each slide — preserving all fonts, colors, and layouts.
    """
    replacements = build_replacements(client_name, industry, kit, rep_name, rep_mobile, rep_email)

    # Check for any unreplaced placeholders after we're done (for debugging)
    replaced_count = 0

    input_zip = zipfile.ZipFile(io.BytesIO(pptx_bytes))
    output_buffer = io.BytesIO()

    with zipfile.ZipFile(output_buffer, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as output_zip:
        for item_name in input_zip.namelist():
            item_data = input_zip.read(item_name)

            # Only process slide XML files — leave everything else untouched
            is_slide_xml = (
                item_name.startswith("ppt/slides/slide")
                and item_name.endswith(".xml")
            )

            if is_slide_xml:
                content = item_data.decode("utf-8")
                for placeholder, value in replacements.items():
                    if placeholder in content:
                        content = content.replace(placeholder, xml_escape(value))
                        replaced_count += 1
                item_data = content.encode("utf-8")

            output_zip.writestr(item_name, item_data)

    input_zip.close()
    return output_buffer.getvalue()


def audit_placeholders(pptx_bytes: bytes) -> list[str]:
    """
    Utility: scans the PPTX and returns a list of all {{PLACEHOLDER}} tags found.
    Useful for verifying the master deck's placeholder map is complete.
    Run via: python -c "from pptx_engine import audit_placeholders; ..."
    """
    import re
    found = set()
    z = zipfile.ZipFile(io.BytesIO(pptx_bytes))
    for name in z.namelist():
        if name.startswith("ppt/slides/slide") and name.endswith(".xml"):
            content = z.read(name).decode("utf-8")
            tags = re.findall(r"\{\{[A-Z_]+\}\}", content)
            found.update(tags)
    z.close()
    return sorted(found)
