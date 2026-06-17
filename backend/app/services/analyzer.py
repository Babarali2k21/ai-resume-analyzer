"""
LLM-powered resume analysis service.
Supports OpenAI and Anthropic with structured JSON output.
"""

import json
from typing import Literal

import openai
import anthropic

from app.config import settings
from app.models import AnalysisResult


# ---------------------------------------------------------------------------
# Prompt
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = """You are an expert ATS (Applicant Tracking System) and career coach.
Analyze the provided resume against the job description and return a detailed assessment.

You MUST respond with valid JSON only — no markdown, no backticks, no preamble.

JSON structure:
{
  "match_score": <integer 0-100>,
  "summary": "<2-3 sentence executive summary of the match>",
  "matched_keywords": ["<keyword>", ...],
  "missing_keywords": ["<keyword>", ...],
  "strengths": ["<strength>", ...],
  "improvements": ["<specific actionable improvement>", ...],
  "rewritten_summary": "<improved resume professional summary tailored to this JD>"
}

Scoring guide:
- 90-100: Excellent match, apply immediately
- 70-89: Good match, minor gaps
- 50-69: Moderate match, significant gaps
- 30-49: Weak match, major upskilling needed
- 0-29: Poor match, different direction needed
"""

USER_TEMPLATE = """RESUME:
{resume}

JOB DESCRIPTION:
{job_description}

Analyze the resume against the job description and return JSON only."""


# ---------------------------------------------------------------------------
# OpenAI
# ---------------------------------------------------------------------------

def _analyze_with_openai(resume: str, job_description: str) -> dict:
    client = openai.OpenAI(api_key=settings.openai_api_key)
    response = client.chat.completions.create(
        model=settings.openai_model,
        temperature=0,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": USER_TEMPLATE.format(
                resume=resume[:6000],
                job_description=job_description[:3000],
            )},
        ],
    )
    return json.loads(response.choices[0].message.content)


# ---------------------------------------------------------------------------
# Anthropic
# ---------------------------------------------------------------------------

def _analyze_with_anthropic(resume: str, job_description: str) -> dict:
    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    response = client.messages.create(
        model=settings.anthropic_model,
        max_tokens=2000,
        temperature=0,
        system=SYSTEM_PROMPT,
        messages=[
            {"role": "user", "content": USER_TEMPLATE.format(
                resume=resume[:6000],
                job_description=job_description[:3000],
            )},
        ],
    )
    raw = response.content[0].text.strip()
    # Strip markdown fences if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def analyze_resume(
    resume: str,
    job_description: str,
    provider: Literal["openai", "anthropic"] = "openai",
) -> AnalysisResult:
    """
    Analyze a resume against a job description using the chosen LLM.
    Returns a structured AnalysisResult.
    """
    if provider == "openai":
        if not settings.openai_api_key:
            raise ValueError("OpenAI API key not configured.")
        data = _analyze_with_openai(resume, job_description)
    elif provider == "anthropic":
        if not settings.anthropic_api_key:
            raise ValueError("Anthropic API key not configured.")
        data = _analyze_with_anthropic(resume, job_description)
    else:
        raise ValueError(f"Unknown provider: {provider}")

    return AnalysisResult(
        match_score=int(data.get("match_score", 0)),
        summary=data.get("summary", ""),
        matched_keywords=data.get("matched_keywords", []),
        missing_keywords=data.get("missing_keywords", []),
        strengths=data.get("strengths", []),
        improvements=data.get("improvements", []),
        rewritten_summary=data.get("rewritten_summary", ""),
        provider_used=provider,
    )
