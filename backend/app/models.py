from pydantic import BaseModel, Field
from typing import Literal


class AnalysisRequest(BaseModel):
    resume_text: str
    job_description: str
    provider: Literal["openai", "anthropic"] = "openai"


class SkillMatch(BaseModel):
    skill: str
    found: bool


class AnalysisResult(BaseModel):
    match_score: int = Field(..., ge=0, le=100, description="Overall match score 0-100")
    summary: str = Field(..., description="2-3 sentence executive summary")
    matched_keywords: list[str] = Field(default_factory=list)
    missing_keywords: list[str] = Field(default_factory=list)
    strengths: list[str] = Field(default_factory=list)
    improvements: list[str] = Field(default_factory=list)
    rewritten_summary: str = Field(..., description="Improved resume summary tailored to the JD")
    provider_used: str


class AnalysisResponse(BaseModel):
    success: bool
    result: AnalysisResult | None = None
    error: str | None = None
