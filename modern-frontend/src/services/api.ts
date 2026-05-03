import axios from 'axios';
import type { ApiResponse } from '../types';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({ baseURL: BASE, timeout: 30000 });

export async function analyze(query: string, topK = 5, useLlm = true): Promise<ApiResponse> {
  const { data } = await api.post<ApiResponse>('/recommend', {
    query,
    top_k: topK,
    use_llm: useLlm,
  });
  return data;
}

export async function checkHealth(): Promise<{ status: string; index_ready: boolean }> {
  const { data } = await api.get('/health');
  return data;
}

export async function getCategories(): Promise<{ categories: string[] }> {
  const { data } = await api.get('/standards/categories');
  return data;
}

import type { AdvancedResponse, Industry, Location } from '../types';

export async function analyzeAdvanced(
  query: string,
  options: {
    topK?: number;
    useLlm?: boolean;
    industry?: Industry;
    location?: Location;
    materialModifier?: string;
  } = {}
): Promise<AdvancedResponse> {
  const { data } = await api.post<AdvancedResponse>('/analyze/advanced', {
    query,
    top_k: options.topK ?? 5,
    use_llm: options.useLlm ?? true,
    industry: options.industry ?? 'construction',
    location: options.location ?? 'urban',
    material_modifier: options.materialModifier ?? '',
  });
  return data;
}
