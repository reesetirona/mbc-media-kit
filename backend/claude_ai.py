"""
claude_ai.py — Calls the Anthropic API with web search enabled.
Claude researches the client before generating the media kit content.
Returns a structured dict of placeholder values for the PPTX.
"""

import os
import json
import anthropic
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from main import KitRequest

# ── System Prompt ──────────────────────────────────────────────────────────────
SYSTEM_PROMPT = """You are a senior media strategist for MBC Media Group, the Philippines' premier multi-platform broadcaster.

MBC has 6 Strategic Business Units:
1. MBC Radio — DZRH, Love Radio, Yes FM, Easy Rock, Radyo Natin, Aksyon Radyo. 200 stations nationwide, 4.5M daily listeners. DZRH for news/talk audiences. Love Radio and Yes FM for 18-35 household buyers. Radyo Natin for provincial/regional reach.
2. MBC Digital — Branded content, display ads, rich media, programmatic. Full campaign ideation to reporting, synced with on-air schedules.
3. MBC TV — News, public affairs, entertainment. Made-for-TV content and sponsorships. Strong in daytime and primetime news programming.
4. MBC Events — On-ground activations, regional fiestas, community events, in-store samplings. Decades of execution expertise.
5. MBC Promos — Multi-platform promotional campaigns, raffle draws, gamified audience engagement. Works across Radio, Digital, and Events.
6. MBC Talents — Talent management. Brand endorsements through MBC radio/TV personalities with massive loyal followings.

RESEARCH INSTRUCTIONS:
Before writing the media kit, you MUST use the web_search tool to research the client. Search for:
1. The client's brand positioning, recent campaigns, and marketing tone
2. Their target market and key products/services in the Philippines
3. Their competitors and how they differentiate
4. Any recent news, milestones, or initiatives relevant to marketing

Use what you find to make the media kit feel hand-crafted for this specific brand — not generic industry copy.

OUTPUT RULES:
- After researching, return ONLY a valid JSON object
- No preamble, no markdown fences, no explanation outside the JSON
- Follow this EXACT schema:

{
  "tagline": "One punchy sentence connecting MBC's reach to this client's specific brand mission (max 15 words)",
  "client_intro": "2-3 sentences on why MBC is the perfect integrated media partner for this specific client. Reference real brand details from your research.",
  "client_why": "2 sentences on the concrete MBC advantage for this client. Cite specific stations, audience numbers, or formats relevant to their actual target market.",
  "sbu_1_name": "Name of the most relevant SBU",
  "sbu_1_desc": "2-3 sentences on why this SBU fits this client. Reference specific stations, timing, or formats that match their brand.",
  "sbu_2_name": "Name of second most relevant SBU",
  "sbu_2_desc": "2-3 sentences on why this SBU fits.",
  "sbu_3_name": "Name of third most relevant SBU",
  "sbu_3_desc": "2-3 sentences on why this SBU fits.",
  "campaign_title": "Evocative 3-6 word campaign name. Filipino/English mix encouraged.",
  "campaign_desc": "3 sentences describing a concrete integrated campaign concept. Be specific about mechanics, timing, and platforms.",
  "deliverable_1": "Specific deliverable with format, duration, and platform (e.g. '30-sec radio spots on Love Radio + Yes FM, 8 weeks, breakfast drive time 6-9AM')",
  "deliverable_2": "Specific deliverable",
  "deliverable_3": "Specific deliverable",
  "platform_1": "Platform name — specific station or channel names",
  "pct_1": "Recommended % of media weight and one-sentence rationale tied to this client's audience",
  "platform_2": "Platform name",
  "pct_2": "Recommended % and rationale",
  "platform_3": "Platform name",
  "pct_3": "Recommended % and rationale",
  "cta_line": "One personalized closing line addressed to this specific client. Reference their brand or mission (max 15 words).",
  "recommended_sbus": ["SBU name 1", "SBU name 2", "SBU name 3"]
}

STRATEGY RULES:
- Select the 3 SBUs most relevant to this client's industry and objectives
- Use Filipino market context: payday weekends (15th & 30th), breakfast drive time, fiesta season, ber months
- Weight preferred SBUs heavily unless clearly a poor fit
- Keep all copy professional, confident, and specific — no generic filler"""


def build_user_prompt(req) -> str:
    sbus = ", ".join(req.selected_sbus) if req.selected_sbus else "No preference — AI to decide best fit"

    return f"""Generate a tailored MBC media kit for this client. First use web_search to research them thoroughly, then return the JSON.

CLIENT DETAILS:
Client Name: {req.client_name}
Industry: {req.industry}
Campaign Objective: {req.objective}
Target Audience: {req.audience or "Not specified"}
Budget Range: {req.budget}
Preferred Platforms: {sbus}
Additional Notes: {req.notes or "None"}

Research this client thoroughly — their brand positioning, recent campaigns, products, and competitors in the Philippines — before writing. The kit should feel like it was written by someone who knows their brand inside out."""


async def generate_kit_content(req) -> dict:
    """
    Calls Claude API with web search enabled.
    Claude researches the client then returns structured JSON.
    Raises ValueError if the response cannot be parsed.
    """
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    # ── Web search tool definition ────────────────────────────────────────────
    tools = [
        {
            "type": "web_search_20250305",
            "name": "web_search",
        }
    ]

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=5000,
        system=SYSTEM_PROMPT,
        tools=tools,
        messages=[
            {"role": "user", "content": build_user_prompt(req)}
        ],
    )

    # ── Extract the final text block (after tool use) ─────────────────────────
    # Claude may return multiple blocks: tool_use + tool_result + final text
    raw = ""
    for block in response.content:
        if hasattr(block, "text") and block.text:
            raw = block.text.strip()  # take the last text block

    if not raw:
        raise ValueError("Claude returned no text content")

    # Extract JSON — handle preamble text + optional ```json fence
    import re
    fence_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", raw, re.DOTALL)
    if fence_match:
        raw = fence_match.group(1)
    else:
        # No fence — find the first { and last } to isolate the object
        start = raw.find("{")
        end = raw.rfind("}")
        if start != -1 and end != -1:
            raw = raw[start:end + 1]

    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"Claude returned invalid JSON: {e}\nRaw: {raw[:300]}")
