"""
Tests for AI Resume Analyzer backend.
Run: pytest tests/ -v
All LLM calls are mocked — no API key required.
"""

import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient

from main import app
from app.models import AnalysisResult
from app.services.parser import extract_text

client = TestClient(app)


# ── Parser tests ──────────────────────────────────────────────────────────────

def test_extract_text_from_txt():
    content = b"John Doe\nSoftware Engineer\nPython, FastAPI, Docker"
    result = extract_text(content, "resume.txt")
    assert "John Doe" in result
    assert "Python" in result


def test_extract_text_unsupported_format():
    with pytest.raises(ValueError, match="Unsupported file type"):
        extract_text(b"content", "resume.docx")


def test_extract_text_empty_txt():
    result = extract_text(b"   ", "resume.txt")
    assert result.strip() == ""


# ── Analyzer tests (mocked) ───────────────────────────────────────────────────

MOCK_RESULT = AnalysisResult(
    match_score=82,
    summary="Strong match for the Python backend role.",
    matched_keywords=["Python", "FastAPI", "Docker"],
    missing_keywords=["Kubernetes", "Terraform"],
    strengths=["Strong Python skills", "API development experience"],
    improvements=["Add Kubernetes experience", "Learn Terraform basics"],
    rewritten_summary="Experienced Python engineer specializing in FastAPI microservices.",
    provider_used="openai",
)


@patch("app.routers.analyze.analyze_resume", return_value=MOCK_RESULT)
@patch("app.routers.analyze.extract_text", return_value="John Doe Python Engineer")
def test_analyze_endpoint_success(mock_extract, mock_analyze):
    response = client.post(
        "/api/analyze",
        data={"job_description": "We need a Python engineer", "provider": "openai"},
        files={"resume_file": ("resume.txt", b"John Doe Python Engineer", "text/plain")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["result"]["match_score"] == 82
    assert "Python" in data["result"]["matched_keywords"]


@patch("app.routers.analyze.analyze_resume", return_value=MOCK_RESULT)
@patch("app.routers.analyze.extract_text", return_value="resume text")
def test_analyze_endpoint_empty_jd(mock_extract, mock_analyze):
    response = client.post(
        "/api/analyze",
        data={"job_description": "   ", "provider": "openai"},
        files={"resume_file": ("resume.txt", b"content", "text/plain")},
    )
    assert response.status_code == 422


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "AI Resume Analyzer" in response.json()["service"]


# ── Model tests ───────────────────────────────────────────────────────────────

def test_analysis_result_score_bounds():
    result = AnalysisResult(
        match_score=95,
        summary="Great match.",
        matched_keywords=["Python"],
        missing_keywords=[],
        strengths=["Python expertise"],
        improvements=[],
        rewritten_summary="Senior Python engineer.",
        provider_used="anthropic",
    )
    assert 0 <= result.match_score <= 100
    assert result.provider_used == "anthropic"
