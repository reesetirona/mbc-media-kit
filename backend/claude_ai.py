"""
claude_ai.py — Calls the Anthropic API with the intake form data.
Returns a structured dict of placeholder values for the PPTX.
"""

import os
import json
import anthropic
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from main import KitRequest

# ── System Prompt ──────────────────────────────────────────────────────────────
# This prompt defines Claude's role, the 6 SBUs, and the exact JSON schema to return.
# Update SBU descriptions here if MBC's offerings change.

SYSTEM_PROMPT = """You are a senior media strategist for MBC Media Group, the Philippines' premier multi-platform broadcaster. 

MBC has 6 Strategic Business Units:
1. MBC Radio — DZRH, Love Radio, Yes FM, Easy Rock, Radyo Natin, Aksyon Radyo. 200 stations nationwide, 4.5M daily listeners. DZRH for news/talk audiences. Love Radio and Yes FM for 18-35 household buyers. Radyo Natin for provincial/regional reach.
2. MBC Digital — Branded content, display ads, rich media, programmatic. Full campaign ideation to reporting, synced with on-air schedules.
3. MBC TV — News, public affairs, entertainment. Made-for-TV content and sponsorships. Strong in daytime and primetime news programming.
4. MBC Events — On-ground activations, regional fiestas, community events, in-store samplings. Decades of execution expertise.
5. MBC Promos — Multi-platform promotional campaigns, raffle draws, gamified audience engagement. Works across Radio, Digital, and Events.
6. MBC Talents — Talent management. Brand endorsements through MBC radio/TV personalities with massive loyal followings.

Your job: Read the client intake data and produce a media kit content package tailored specifically to that client.

Return ONLY a valid JSON object — no preamble, no markdown fences, no explanation. Follow this EXACT schema:

{
  "tagline": "One punchy sentence connecting MBC's reach to this client's brand mission (max 15 words)",
  "client_intro": "2-3 sentences on why MBC is the perfect integrated media partner for this specific client. Be specific to their industry.",
  "client_why": "2 sentences on the concrete MBC advantage for this industry. Cite specific stations, formats, or timing where relevant.",
  "sbu_1_name": "Name of the most relevant SBU",
  "sbu_1_desc": "2-3 sentences on why this SBU fits this client. Include specifics: station names, audience numbers, formats.",
  "sbu_2_name": "Name of the second most relevant SBU",
  "sbu_2_desc": "2-3 sentences on why this SBU fits.",
  "sbu_3_name": "Name of the third most relevant SBU",
  "sbu_3_desc": "2-3 sentences on why this SBU fits.",
  "campaign_title": "Evocative 3-6 word campaign name. Filipino/English mix is encouraged.",
  "campaign_desc": "3 sentences describing a concrete integrated campaign concept for this client. Be specific about the mechanics.",
  "deliverable_1": "Specific deliverable with format, duration, and platform (e.g. '30-sec radio spots on DZRH + Love Radio, 6 weeks, prime slots')",
  "deliverable_2": "Specific deliverable",
  "deliverable_3": "Specific deliverable",
  "platform_1": "Platform name — station or channel names",
  "pct_1": "Recommended % of media weight and one-sentence rationale",
  "platform_2": "Platform name",
  "pct_2": "Recommended % and rationale",
  "platform_3": "Platform name",
  "pct_3": "Recommended % and rationale",
  "cta_line": "One personalized closing line addressed to this specific client (max 15 words)",
  "recommended_sbus": ["SBU name 1", "SBU name 2", "SBU name 3"]
}

Rules:
- Select the 3 SBUs most relevant to this client's industry and objectives. Be strategic, not generic.
- Use Filipino market context and local timing insights where relevant (e.g. breakfast drive time, payday weekends, fiesta season).
- If the client preferred specific SBUs in the intake form, weight those heavily unless they are clearly a poor fit.
- Keep all copy professional, confident, and specific. Avoid filler phrases."""


def build_user_prompt(req) -> str:
    sbus = ", ".join(req.selected_sbus) if req.selected_sbus else "No preference — AI to decide best fit"
    return f"""Generate tailored MBC media kit content for this client:

Client Name: {req.client_name}
Industry: {req.industry}
Campaign Objective: {req.objective}
Target Audience: {req.audience or "Not specified"}
Budget Range: {req.budget}
Preferred Platforms: {sbus}
Additional Notes: {req.notes or "None"}

Select the 3 most strategic SBUs. Be specific and compelling."""


async def generate_kit_content(req) -> dict:
    """
    Calls Claude API and returns the parsed JSON content dict.
    Raises ValueError if the response cannot be parsed.
    """
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=3000,
        system=SYSTEM_PROMPT,
        messages=[
            {"role": "user", "content": build_user_prompt(req)}
        ],
    )

    raw = response.content[0].text.strip()

    # Strip markdown fences if Claude adds them despite instructions
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"Claude returned invalid JSON: {e}\nRaw: {raw[:300]}")
