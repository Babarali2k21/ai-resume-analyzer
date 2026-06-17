"use client";

import { useState } from "react";
import { AnalysisResponse, Provider } from "@/types";
import ResultsDashboard from "@/components/ResultsDashboard";
import UploadForm from "@/components/UploadForm";

export default function Home() {
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (
    file: File,
    jobDescription: string,
    provider: Provider
  ) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("resume_file", file);
    formData.append("job_description", jobDescription);
    formData.append("provider", provider);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      const data: AnalysisResponse = await res.json();
      setResult(data);
    } catch (err) {
      setError("Failed to connect to the API. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <h1 className="text-lg font-bold text-white">AI Resume Analyzer</h1>
              <p className="text-xs text-gray-400">Powered by GPT-4o-mini & Claude</p>
            </div>
          </div>
          <a
            href="https://github.com/Babarali2k21"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            GitHub →
          </a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        {!result && !loading && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Match Your Resume to Any Job
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Upload your resume and paste a job description. Get an ATS match score,
              missing keywords, strengths, and a rewritten summary — in seconds.
            </p>
          </div>
        )}

        {/* Upload Form */}
        {!result && (
          <UploadForm onAnalyze={handleAnalyze} loading={loading} />
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            <ResultsDashboard result={result} />
            <div className="mt-8 text-center">
              <button
                onClick={() => setResult(null)}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
              >
                ← Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
