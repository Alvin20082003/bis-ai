export interface StandardResult {
  rank: number;
  standard_no: string;
  title: string;
  category: string;
  scope: string;
  keywords: string[];
  applicable_products: string[];
  confidence_score: number;
  dense_score: number;
  bm25_score: number;
  rationale?: string;
}

export interface ApiResponse {
  query: string;
  expanded_query: string;
  matched_terms: string[];
  total_results: number;
  results: StandardResult[];
  latency_ms: number;
  retrieval_latency_ms: number;
  llm_rationale_generated: boolean;
  antigravity_active: boolean;
}

export interface HistoryItem {
  id: string;
  query: string;
  timestamp: number;
  results: StandardResult[];
  latency_ms: number;
  total_results: number;
}

export interface FavoriteItem {
  id: string;
  standard: StandardResult;
  savedAt: number;
  query: string;
}

// ── Advanced Analysis Types ────────────────────────────────────────────────────
export interface GapItem {
  standard_no: string;
  reason: string;
  status: 'satisfied' | 'missing';
}

export interface GapAnalysis {
  satisfied: GapItem[];
  missing: GapItem[];
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  risk_score: number;
  coverage_pct: number;
  summary: string;
}

export interface ChecklistItem {
  standard_no: string;
  items: string[];
}

export interface RiskSummary {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  score: number;
  avg_confidence: number;
  coverage_pct: number;
  action: string;
}

export interface AdvancedResponse extends ApiResponse {
  gap_analysis: GapAnalysis;
  checklists: ChecklistItem[];
  risk_summary: RiskSummary;
  industry: string;
  location: string;
  whatif_query: string;
}

export type Industry = 'construction' | 'manufacturing' | 'infrastructure';
export type Location = 'urban' | 'coastal' | 'rural' | 'seismic';
