"""
AI Resume Analyzer — FastAPI Backend
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers.analyze import router

app = FastAPI(
    title="AI Resume Analyzer",
    description="Analyze resumes against job descriptions using GPT-4o-mini or Claude.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
async def root():
    return {
        "service": "AI Resume Analyzer API",
        "docs": "/docs",
        "health": "/api/health",
    }
