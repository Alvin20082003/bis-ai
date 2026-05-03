import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight, ChevronDown, CheckCircle2, XCircle, Shield } from 'lucide-react';
import { clsx } from 'clsx';
import type { StandardResult } from '../types';
import { useAppStore } from '../store/useAppStore';
import StandardDetailModal from './StandardDetailModal';

interface Props {
  result: StandardResult;
  index: number;
  query?: string;
  showFavorite?: boolean;
}

const RANK_COLORS = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-yellow-500',
  'from-green-500 to-emerald-500',
  'from-red-500 to-rose-500',
];

const CONF_MAP: Record<string, { label: string; color: string; bar: string }> = {
  high:   { label: 'High',   color: 'text-green-400 bg-green-400/10 border-green-400/20',    bar: 'bg-green-400' },
  medium: { label: 'Medium', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', bar: 'bg-yellow-400' },
  low:    { label: 'Low',    color: 'text-red-400 bg-red-400/10 border-red-400/20',           bar: 'bg-red-400' },
};

function getConf(score: number) {
  if (score >= 65) return CONF_MAP.high;
  if (score >= 40) return CONF_MAP.medium;
  return CONF_MAP.low;
}

export default function StandardCard({ result, index, query = '', showFavorite = true }: Props) {
  const { addFavorite, removeFavorite, isFavorite } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const fav = isFavorite(result.standard_no);
  const conf = getConf(result.confidence_score);
  const gradient = RANK_COLORS[index % RANK_COLORS.length];

  const toggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    fav ? removeFavorite(result.standard_no) : addFavorite(result, query);
  };

  const whyText = result.rationale || result.scope.slice(0, 160) + '...';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
        className="group relative flex flex-col p-5 rounded-2xl bg-[#0d1424] border border-white/5 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />
        <div className={clsx('absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-gradient-to-b', gradient)} />

        <div className="flex items-start justify-between mb-3 pl-2">
          <div className="flex items-center gap-2">
            <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white bg-gradient-to-br shrink-0', gradient)}>
              {result.rank}
            </div>
            <span className="font-mono text-sm font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg">
              {result.standard_no}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-lg border', conf.color)}>
              {conf.label}
            </span>
            {showFavorite && (
              <button onClick={toggleFav} className={clsx('p-1.5 rounded-lg transition-all', fav ? 'text-red-400 bg-red-400/10' : 'text-slate-600 hover:text-red-400 hover:bg-red-400/10')}>
                <Heart className={clsx('w-3.5 h-3.5', fav && 'fill-current')} />
              </button>
            )}
          </div>
        </div>

        <h3 className="text-sm font-bold text-white mb-2 pl-2 leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">{result.title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-3 pl-2 flex-grow line-clamp-3">{result.rationale || result.scope.slice(0, 140) + '...'}</p>

        <div className="pl-2 mb-2">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Relevance</span><span className="font-bold text-white">{result.confidence_score}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence_score}%` }} transition={{ delay: index * 0.08 + 0.3, duration: 0.6, ease: 'easeOut' }} className={clsx('h-full rounded-full bg-gradient-to-r', gradient)} />
          </div>
        </div>

        <div className="pl-2 mb-3">
          <button onClick={() => setShowWhy(v => !v)} className="flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-blue-400 transition-colors font-medium">
            <ChevronDown className={clsx('w-3 h-3 transition-transform', showWhy && 'rotate-180')} />
            {showWhy ? 'Hide explanation' : 'Why this standard?'}
          </button>
          <AnimatePresence>
            {showWhy && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="mt-2 flex gap-2 p-2 rounded-lg bg-green-500/5 border border-green-500/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-300 leading-relaxed">{whyText}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between pl-2 pt-2 border-t border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{result.category}</span>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 font-medium transition-colors">
            View Details <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {result.keywords?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 pl-2">
            {result.keywords.slice(0, 4).map(k => (
              <span key={k} className="text-[10px] px-1.5 py-0.5 bg-white/5 text-slate-500 rounded-md">{k}</span>
            ))}
          </div>
        )}
      </motion.div>

      {showModal && <StandardDetailModal result={result} query={query} onClose={() => setShowModal(false)} />}
    </>
  );
}
