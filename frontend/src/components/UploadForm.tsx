"use client";

import { useState, useRef } from "react";
import { Provider } from "@/types";

interface Props {
  onAnalyze: (file: File, jobDescription: string, provider: Provider) => void;
  loading: boolean;
}

export default function UploadForm({ onAnalyze, loading }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [provider, setProvider] = useState<Provider>("openai");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription.trim()) return;
    onAnalyze(file, jobDescription, provider);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.name.endsWith(".pdf") || dropped.name.endsWith(".txt"))) {
      setFile(dropped);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Resume <span className="text-gray-500">(.pdf or .txt)</span>
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
            ${dragOver
              ? "border-violet-500 bg-violet-500/10"
              : file
              ? "border-green-500 bg-green-500/10"
              : "border-gray-700 hover:border-gray-500 bg-gray-900"
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file ? (
            <div>
              <p className="text-green-400 font-medium">✓ {file.name}</p>
              <p className="text-gray-500 text-sm mt-1">
                {(file.size / 1024).toFixed(1)} KB · Click to change
              </p>
            </div>
          ) : (
            <div>
              <p className="text-4xl mb-3">📄</p>
              <p className="text-gray-300 font-medium">Drop your resume here</p>
              <p className="text-gray-500 text-sm mt-1">or click to browse · PDF or TXT · max 10MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Job Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here..."
          rows={8}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors resize-none text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          {jobDescription.length} characters
        </p>
      </div>

      {/* Provider Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          AI Model
        </label>
        <div className="flex gap-3">
          {(["openai", "anthropic"] as Provider[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProvider(p)}
              className={`
                flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors border
                ${provider === p
                  ? "bg-violet-600 border-violet-500 text-white"
                  : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500"
                }
              `}
            >
              {p === "openai" ? "⚡ GPT-4o-mini" : "🧠 Claude"}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!file || !jobDescription.trim() || loading}
        className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-semibold rounded-xl transition-colors text-sm"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⟳</span> Analyzing...
          </span>
        ) : (
          "Analyze Resume →"
        )}
      </button>
    </form>
  );
}
