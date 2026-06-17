"""
API routes for resume analysis.
"""

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from typing import Literal

from app.models import AnalysisResponse
from app.services.parser import extract_text
from app.services.analyzer import analyze_resume
from app.config import settings

router = APIRouter(prefix="/api", tags=["analysis"])

MAX_BYTES = settings.max_file_size_mb * 1024 * 1024


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze(
    resume_file: UploadFile = File(..., description="Resume as .pdf or .txt"),
    job_description: str = Form(..., description="Job description text"),
    provider: Literal["openai", "anthropic"] = Form(
        default="openai", description="LLM provider to use"
    ),
):
    """
    Analyze a resume against a job description.
    Returns a match score, keywords, strengths, improvements, and a rewritten summary.
    """
    # Validate file size
    file_bytes = await resume_file.read()
    if len(file_bytes) > MAX_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.max_file_size_mb}MB.",
        )

    # Validate job description
    if not job_description.strip():
        raise HTTPException(
            status_code=422,
            detail="Job description cannot be empty.",
        )

    try:
        # Extract text from resume
        resume_text = extract_text(file_bytes, resume_file.filename or "resume.pdf")

        # Analyze
        result = analyze_resume(
            resume=resume_text,
            job_description=job_description,
            provider=provider,
        )

        return AnalysisResponse(success=True, result=result)

    except ValueError as e:
        return AnalysisResponse(success=False, error=str(e))
    except Exception as e:
        return AnalysisResponse(success=False, error=f"Analysis failed: {str(e)}")


@router.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok", "service": "ai-resume-analyzer"}
