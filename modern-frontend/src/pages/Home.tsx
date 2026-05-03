import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, ArrowRight, Sparkles, ChevronRight, Sliders, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { analyze } from '../services/api';
import { analyzeAdvanced } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import StandardCard from '../components/StandardCard';
import RightPanel from '../components/RightPanel';
import GapAnalysis from '../components/GapAnalysis';
import SmartChecklist from '../components/SmartChecklist';
import WhatIfControls from '../components/WhatIfControls';
import ReportGenerator from '../components/ReportGenerator';
import type { ApiResponse, AdvancedResponse, Industry, Location } from '../types';

const EXAMPLES = [
  'Ordinary Portland Cement',
  'TMT Steel Bars',
  'Concrete Blocks',
  'Fly Ash Bricks',
  'Coarse Aggregates',
  'Structural Steel',
];

const SUGGESTIONS = [
  { label: 'OPC 53 Cement', query: 'OPC 53 grade cement for high rise residential building construction' },
  { label: 'TMT Fe500 Steel', query: 'Fe500 TMT reinforcement bars for earthquake resistant RCC structure' },
  { label: 'M30 Concrete', query: 'M30 ready mix concrete with superplasticizer admixture for bridge deck' },
  { label: 'Crushed Aggregate', query: '20mm crushed stone coarse aggregate for high strength concrete production' },
  { label: 'Structural Steel', query: 'Hot rolled structural steel I beams and columns for industrial factory shed' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [advData, setAdvData] = useState<AdvancedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [industry, setIndustry] = useState<Industry>('construction');
  const [location, setLocation] = useState<Location>('urban');
  const [materialModifier, setMaterialModifier] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { addHistory, updateAnalytics } = useAppStore();

  const handleWhatIfChange = (field: 'industry' | 'location' | 'materialModifier', value: string) => {
    if (field === 'industry') setIndustry(value as Industry);
    else if (field === 'location') setLocation(value as Location);
    else setMaterialModifier(value);
  };

  const handleSearch = async () => {
    const q = query.trim();
    if (!q || q.length < 5) {
      toast.error('Please enter at least 5 characters');
      inputRef.current?.focus();
      return;
    }
    setIsLoading(true);
    setData(null);
    setAdvData(null);
    try {
      if (advancedMode) {
        const result = await analyzeAdvanced(q, { industry, location, materialModifier, useLlm: true });
        setAdvData(result);
        setData(result);
        addHistory({ id: crypto.randomUUID(), query: q, timestamp: Date.now(), results: result.results, latency_ms: result.latency_ms, total_results: result.total_results });
        updateAnalytics(result.latency_ms);
        toast.success(`Found ${result.total_results} standards · Risk: ${result.risk_summary.level}`);
      } else {
        const result = await analyze(q, 5, true);
        setData(result);
        setAdvData(null);
        addHistory({ id: crypto.randomUUID(), query: q, timestamp: Date.now(), results: result.results, latency_ms: result.latency_ms, total_results: result.total_results });
        updateAnalytics(result.latency_ms);
        toast.success(`Found ${result.total_results} applicable standards`);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to connect to API. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch(); }
  };

  return (
    <div className="flex h-full overflow-hidden">

      {/* ── Main scrollable area — takes all remaining space ── */}
      <div className="flex-1 overflow-y-auto min-w-0">
        <div className="px-6 py-5 max-w-5xl">  {/* wider cap, left-aligned */}

        {/* Hero */}
        <div className="mb-7">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-2 mb-4"
          >
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
              <Zap className="w-3 h-3 fill-current" />
              Antigravity AI Active
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Precise Match
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold">
              Trusted Compliance
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl lg:text-5xl font-extrabold text-white mb-3 leading-tight"
          >
            AI-Powered<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              BIS Compliance Engine
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-base max-w-xl"
          >
            Instantly discover the right BIS standards for your product using advanced AI
          </motion.p>
        </div>

        {/* Search box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
            Describe your product
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-focus-within:opacity-30 transition duration-500" />
            <div className="relative flex gap-3 p-3 bg-[#0d1424] border border-white/10 rounded-2xl focus-within:border-blue-500/50 transition-all">
              <textarea
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="e.g., High-strength cement for marine construction…"
                rows={2}
                className="flex-1 bg-transparent text-white placeholder-slate-600 text-sm resize-none focus:outline-none leading-relaxed"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="self-end flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 shrink-0"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isLoading ? 'Analyzing…' : 'Analyze with AI'}
              </button>
            </div>
          </div>

          {/* Example chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs text-slate-600 font-medium">Try examples:</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => { setQuery(s.query); inputRef.current?.focus(); }}
                className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all"
              >
                {s.label}
              </button>
            ))}
            {/* Advanced mode toggle */}
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setAdvancedMode(v => !v)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-medium transition-all ${
                  advancedMode
                    ? 'bg-orange-500/15 border-orange-500/30 text-orange-400'
                    : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
                }`}
              >
                <Sliders className="w-3 h-3" />
                {advancedMode ? 'Advanced ON' : 'Advanced Mode'}
              </button>
            </div>
          </div>

          {/* What-If controls — shown when advanced mode is on */}
          <AnimatePresence>
            {advancedMode && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden mt-4"
              >
                <WhatIfControls
                  industry={industry}
                  location={location}
                  materialModifier={materialModifier}
                  onChange={handleWhatIfChange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Loading state */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 gap-4"
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-purple-500/30 animate-ping" style={{ animationDelay: '0.3s' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">Analyzing with Antigravity AI…</p>
                <p className="text-slate-500 text-sm mt-1">Searching FAISS index + BM25 scoring</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {data && !isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-bold text-white">Top Recommended BIS Standards</h2>
                  <span className="text-xs px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full font-medium">
                    {data.total_results} Results
                  </span>
                </div>
                <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {data.antigravity_active && data.matched_terms.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-xl bg-purple-500/5 border border-purple-500/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-bold text-purple-400">Antigravity Expansion Active</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.matched_terms.map((t) => (
                      <span key={t} className="text-[11px] px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Cards — 2 cols max so they don't get too narrow */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {data.results.map((r, i) => (
                  <StandardCard key={r.standard_no} result={r} index={i} query={data.query} />
                ))}
              </div>

              <div className="flex justify-center">
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 text-sm font-medium transition-all">
                  View All Standards <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* ── Advanced Analysis Panels ── */}
              {advData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 space-y-4"
                >
                  {/* Report download — always first */}
                  <ReportGenerator data={advData} />

                  {/* Gap Analysis */}
                  <GapAnalysis gap={advData.gap_analysis} />

                  {/* Smart Checklist */}
                  <SmartChecklist checklists={advData.checklists} />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state category cards */}
        {!data && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              { icon: '🏭', title: 'Cement Standards', desc: 'OPC, PPC, PSC and all cement types', count: '8 standards' },
              { icon: '🔩', title: 'Steel Standards',  desc: 'TMT bars, structural sections',      count: '7 standards' },
              { icon: '🏗️', title: 'Concrete Codes',   desc: 'Mix design, RCC, prestressed',       count: '8 standards' },
            ].map((c) => (
              <div key={c.title} className="p-4 rounded-2xl bg-[#0d1424] border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                <div className="text-2xl mb-2">{c.icon}</div>
                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{c.title}</h3>
                <p className="text-xs text-slate-500 mb-2">{c.desc}</p>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">{c.count}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-slate-600 border-t border-white/5 pt-6">
          {['🔒 Secure & Reliable', '✅ Trusted by MSEs', '⚡ Powered by AI'].map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>

        </div>{/* end max-w-4xl */}
      </div>

      {/* ── Right panel — narrow, sticky, supportive ── */}
      <RightPanel data={data} isLoading={isLoading} />
    </div>
  );
}
