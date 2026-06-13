# 🤖 AI Resume Analyzer

> Upload your resume, paste a job description, get an ATS match score, missing keywords, strengths, actionable improvements, and a rewritten professional summary — powered by GPT-4o-mini or Claude.

[![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs)](https://nextjs.org)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai)](https://openai.com)
[![Anthropic](https://img.shields.io/badge/Anthropic-Claude-D97706)](https://anthropic.com)

**[🚀 Live Demo →](#)** *(add your deployed URL here)*

---

## 📸 Screenshot

![AI Resume Analyzer Screenshot](docs/screenshot.png)

---

## ✨ Features

- 📄 **PDF & TXT resume upload** — drag and drop or click to browse
- 📊 **ATS match score** — 0–100 with visual progress bar
- 🔍 **Keyword analysis** — matched vs missing keywords from the JD
- 💪 **Strengths & improvements** — specific, actionable feedback
- ✨ **Rewritten summary** — tailored professional summary for the role
- 🤖 **Dual LLM support** — choose GPT-4o-mini or Claude in the UI
- ⚡ **FastAPI backend** — structured JSON output via Pydantic
- 🎨 **Next.js 14 frontend** — dark mode, Tailwind CSS, TypeScript

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│           Next.js 14 Frontend (Port 3000)       │
│  UploadForm → fetch() → ResultsDashboard        │
└──────────────────────┬──────────────────────────┘
                       │ POST /api/analyze
                       │ (proxied via Next.js rewrites)
                       ▼
┌─────────────────────────────────────────────────┐
│           FastAPI Backend (Port 8000)           │
│                                                 │
│  /api/analyze                                   │
│    ↓ parser.py (PDF/TXT extraction)             │
│    ↓ analyzer.py (OpenAI or Anthropic)          │
│    ↓ AnalysisResult (Pydantic structured output)│
└─────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/Babarali2k21/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Start the backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Open .env and add your API keys
uvicorn main:app --reload
```

API docs available at [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### Backend `.env`

| Variable | Default | Description |
|---|---|---|
| `OPENAI_API_KEY` | — | OpenAI API key |
| `ANTHROPIC_API_KEY` | — | Anthropic API key |
| `OPENAI_MODEL` | `gpt-4o-mini` | LLM for OpenAI analysis |
| `ANTHROPIC_MODEL` | `claude-haiku-4-5-20251001` | LLM for Claude analysis |
| `MAX_FILE_SIZE_MB` | `10` | Max resume file size |

### Frontend

No configuration needed — the frontend proxies all `/api/*` requests to `http://localhost:8000` via Next.js rewrites. No CORS issues.

---

## 📁 Project Structure

```
ai-resume-analyzer/
├── backend/
│   ├── main.py                      # FastAPI app entry point
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── config.py                # Pydantic BaseSettings
│       ├── models.py                # Request/response schemas
│       ├── routers/
│       │   └── analyze.py           # POST /api/analyze endpoint
│       └── services/
│           ├── parser.py            # PDF/TXT text extraction
│           └── analyzer.py          # OpenAI + Anthropic LLM calls
├── frontend/
│   ├── next.config.js               # API proxy configuration
│   ├── package.json
│   └── src/
│       ├── app/
│       │   ├── page.tsx             # Main page
│       │   └── layout.tsx
│       ├── components/
│       │   ├── UploadForm.tsx       # File upload + JD input + LLM toggle
│       │   └── ResultsDashboard.tsx # Score + keywords + improvements UI
│       └── types/
│           └── index.ts             # TypeScript interfaces
├── docs/
│   └── screenshot.png
└── .gitignore
```

---

## 🧪 Tests

```bash
cd backend
source venv/bin/activate
pytest tests/ -v
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.11, Pydantic v2 |
| LLMs | OpenAI GPT-4o-mini, Anthropic Claude |
| PDF Parsing | pdfplumber, PyPDF |
| API Proxy | Next.js rewrites (no CORS) |
| Testing | pytest, httpx |

---

## 👤 Author

**Babar Ali** — AI Engineer · Vienna, Austria

[![LinkedIn](https://img.shields.io/badge/LinkedIn-babarali2k21-0A66C2?logo=linkedin)](https://linkedin.com/in/babarali2k21)
[![GitHub](https://img.shields.io/badge/GitHub-Babarali2k21-181717?logo=github)](https://github.com/Babarali2k21)

---

## 📄 License

MIT