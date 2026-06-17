"use client";

import { AnalysisResponse } from "@/types";

interface Props {
  result: AnalysisResponse;
}

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 80 ? "text-green-400" :
    score >= 60 ? "text-yellow-400" :
    score >= 40 ? "text-orange-400" : "text-red-400";

  const label =
    score >= 80 ? "Excellent Match" :
    score >= 60 ? "Good Match" :
    score >= 40 ? "Moderate Match" : "Weak Match";

  return (
    <div className="flex flex-col items-center">
      <div className={`text-7xl font-bold ${color}`}>{score}</div>
      <div className="text-gray-400 text-sm mt-1">/ 100</div>
      <div className={`text-sm font-semibold mt-2 ${color}`}>{label}</div>
    </div>
  );
}

function Chip({ text, variant }: { text: string; variant: "matched" | "missing" }) {
  return (
    <span className={`
      inline-block px-2.5 py-1 rounded-full text-xs font-medium
      ${variant === "matched"
        ? "bg-green-500/15 text-green-400 border border-green-500/30"
        : "bg-red-500/15 text-red-400 border border-red-500/30"
      }
    `}>
      {variant === "matched" ? "✓ " : "✗ "}{text}
    </span>
  );
}

function ListCard({
  title,
  items,
  icon,
  color,
}: {
  title: string;
  items: string[];
  icon: string;
  color: string;
}) {
  return (
    <div className={`bg-gray-900 border ${color} rounded-xl p-5`}>
      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
            <span className="text-gray-500 flex-shrink-0 mt-0.5">→</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ResultsDashboard({ result }: Props) {
  if (!result.success || !result.result) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-700 rounded-xl text-red-300">
        <p className="font-semibold mb-1">Analysis Failed</p>
        <p className="text-sm">{result.error}</p>
      </div>
    );
  }

  const r = result.result;

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ScoreRing score={r.match_score} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Summary
              </span>
              <span className="text-xs text-gray-600">
                via {r.provider_used === "openai" ? "GPT-4o-mini" : "Claude"}
              </span>
            </div>
            <p className="text-gray-200 leading-relaxed">{r.summary}</p>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-6 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              r.match_score >= 80 ? "bg-green-500" :
              r.match_score >= 60 ? "bg-yellow-500" :
              r.match_score >= 40 ? "bg-orange-500" : "bg-red-500"
            }`}
            style={{ width: `${r.match_score}%` }}
          />
        </div>
      </div>

      {/* Keywords */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-semibold text-white mb-4">🔍 Keyword Analysis</h3>
        <div className="space-y-3">
          {r.matched_keywords.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Matched</p>
              <div className="flex flex-wrap gap-2">
                {r.matched_keywords.map((k) => (
                  <Chip key={k} text={k} variant="matched" />
                ))}
              </div>
            </div>
          )}
          {r.missing_keywords.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Missing</p>
              <div className="flex flex-wrap gap-2">
                {r.missing_keywords.map((k) => (
                  <Chip key={k} text={k} variant="missing" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid md:grid-cols-2 gap-4">
        <ListCard
          title="Strengths"
          items={r.strengths}
          icon="💪"
          color="border-green-900/50"
        />
        <ListCard
          title="Improvements"
          items={r.improvements}
          icon="🎯"
          color="border-yellow-900/50"
        />
      </div>

      {/* Rewritten Summary */}
      <div className="bg-gray-900 border border-violet-900/50 rounded-xl p-5">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          ✨ Rewritten Professional Summary
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed italic">
          "{r.rewritten_summary}"
        </p>
        <button
          onClick={() => navigator.clipboard.writeText(r.rewritten_summary)}
          className="mt-3 text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          Copy to clipboard →
        </button>
      </div>
    </div>
  );
}
