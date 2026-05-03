import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, SlidersHorizontal, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { analyze } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import StandardCard from '../components/StandardCard';
import type { ApiResponse } from '../types';

export default function NewSearch() {
  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState(5);
  const [useLlm, setUseLlm] = useState(true);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { addHistory, updateAnalytics } = useAppStore();

  const handleSearch = async () => {
    const q = query.trim();
    if (!q || q.length < 5) { toast.error('Enter at least 5 characters'); return; }
    setIsLoading(true); setData(null);
    try {
      const result = await analyze(q, topK, useLlm);
      setData(result);
      addHistory({ id: crypto.randomUUID(), query: q, timestamp: Date.now(), results: result.results, latency_ms: result.latency_ms, total_results: result.total_results });
      updateAnalytics(result.latency_ms);
      toast.success(`Found ${result.total_results} standards`);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'API error');
    } finally { setIsLoading(false); }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">New Search</h1>
        <p className="text-slate-500 text-sm mb-6">Describe your product to find applicable BIS standards</p>

        <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-6 mb-6">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Product Description
          </label>
          <textarea
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch(); } }}
            placeholder="Describe your building material product in detail…&#10;e.g., OPC 53 grade cement for high-rise residential building construction in seismic zone III"
            rows={4}
            className="w-full bg-transparent text-white placeholder-slate-600 text-sm resize-none focus:outline-none leading-relaxed border border-white/5 rounded-xl p-3 focus:border-blue-500/40 transition-colors"
          />

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <label className="text-xs text-slate-400 font-medium">Standards to return:</label>
              <input
                type="range" min={3} max={7} value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="w-24 accent-blue-500"
              />
              <span className="text-xs font-bold text-blue-400 w-4">{topK}</span>
            </div>

            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-slate-500" />
              <label className="text-xs text-slate-400 font-medium">AI Rationale (Gemini):</label>
              <button
                onClick={() => setUseLlm((v) => !v)}
                className={`relative w-10 h-5 rounded-full transition-all ${useLlm ? 'bg-blue-600' : 'bg-white/10'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${useLlm ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>

            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all"
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isLoading ? 'Analyzing…' : 'Analyze with AI'}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-12">
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Running RAG pipeline…</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {data && !isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-base font-bold text-white">Results</h2>
              <span className="text-xs px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full">{data.total_results} found</span>
              <span className="text-xs text-slate-600">{(data.latency_ms / 1000).toFixed(2)}s</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.results.map((r, i) => <StandardCard key={r.standard_no} result={r} index={i} query={data.query} />)}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
