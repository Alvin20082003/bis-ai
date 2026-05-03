import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistoryIcon, Trash2, Search, Clock, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';
import StandardCard from '../components/StandardCard';

export default function History() {
  const { history, clearHistory, removeHistory } = useAppStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = history.filter((h) =>
    h.query.toLowerCase().includes(search.toLowerCase())
  );

  const handleClear = () => {
    clearHistory();
    toast.success('History cleared');
  };

  const handleReload = (query: string) => {
    navigate('/', { state: { query } });
    toast('Reloading search…', { icon: '🔄' });
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Search History</h1>
            <p className="text-slate-500 text-sm">{history.length} searches saved locally</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          )}
        </div>

        {/* Search filter */}
        {history.length > 0 && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter history…"
              className="w-full pl-9 pr-4 py-2.5 bg-[#0d1424] border border-white/5 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors"
            />
          </div>
        )}

        {/* Empty state */}
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <HistoryIcon className="w-12 h-12 text-slate-700 mb-4" />
            <h3 className="text-lg font-bold text-slate-500 mb-2">No history yet</h3>
            <p className="text-slate-600 text-sm mb-6">Your searches will appear here</p>
            <button
              onClick={() => navigate('/search')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all"
            >
              Start Searching
            </button>
          </div>
        )}

        {/* History list */}
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#0d1424] border border-white/5 rounded-2xl overflow-hidden"
              >
                {/* Row header */}
                <div className="flex items-center gap-4 p-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Search className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.query}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-600">·</span>
                      <span className="text-[11px] text-slate-500">{item.total_results} standards</span>
                      <span className="text-[11px] text-slate-600">·</span>
                      <span className="text-[11px] text-slate-500">{(item.latency_ms / 1000).toFixed(2)}s</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleReload(item.query)}
                      className="p-2 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                      title="Re-run search"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeHistory(item.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                    >
                      {expanded === item.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded results */}
                <AnimatePresence>
                  {expanded === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-white/5"
                    >
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {item.results.map((r, i) => (
                          <StandardCard key={r.standard_no} result={r} index={i} query={item.query} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
