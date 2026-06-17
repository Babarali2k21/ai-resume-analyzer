export type Provider = "openai" | "anthropic";

export interface AnalysisResult {
  match_score: number;
  summary: string;
  matched_keywords: string[];
  missing_keywords: string[];
  strengths: string[];
  improvements: string[];
  rewritten_summary: string;
  provider_used: string;
}

export interface AnalysisResponse {
  success: boolean;
  result?: AnalysisResult;
  error?: string;
}
