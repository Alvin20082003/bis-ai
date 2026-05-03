import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, BookOpen, Tag, Target, CheckCircle2, Info,
  ChevronRight, Heart, Copy, ExternalLink,
} from 'lucide-react';
import { clsx } from 'clsx';
import type { StandardResult } from '../types';
import { useAppStore } from '../store/useAppStore';
import toast from 'react-hot-toast';

interface Props {
  result: StandardResult | null;
  query?: string;
  onClose: () => void;
}

const RANK_COLORS = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-yellow-500',
  'from-green-500 to-emerald-500',
  'from-red-500 to-rose-500',
];

const CONF_MAP: Record<string, { label: string; color: string; bar: string; bg: string }> = {
  high:   { label: 'High Confidence',   color: 'text-green-400',  bar: 'bg-green-400',  bg: 'bg-green-400/10 border-green-400/20' },
  medium: { label: 'Medium Confidence', color: 'text-yellow-400', bar: 'bg-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
  low:    { label: 'Low Confidence',    color: 'text-red-400',    bar: 'bg-red-400',    bg: 'bg-red-400/10 border-red-400/20' },
};

function getConf(score: number) {
  if (score >= 65) return CONF_MAP.high;
  if (score >= 40) return CONF_MAP.medium;
  return CONF_MAP.low;
}

export default function StandardDetailModal({ result, query = '', onClose }: Props) {
  const { addFavorite, removeFavorite, isFavorite } = useAppStore();

  if (!result) return null;

  const fav = isFavorite(result.standard_no);
  const conf = getConf(result.confidence_score);
  const gradient = RANK_COLORS[(result.rank - 1) % RANK_COLORS.length];

  const toggleFav = () => {
    fav ? removeFavorite(result.standard_no) : addFavorite(result, query);
    toast(fav ? 'Removed from favorites' : 'Saved to favorites', {
      icon: fav ? '💔' : '❤️',
    });
  };

  const copyStdNo = () => {
    navigator.clipboard.writeText(result.standard_no);
    toast.success(`Copied ${result.standard_no}`);
  };

  return (
    <AnimatePresence>
      {result && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0f1e] border border-white/10 rounded-3xl shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top gradient stripe */}
              <div className={clsx('h-1.5 w-full rounded-t-3xl bg-gradient-to-r', gradient)} />

              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white bg-gradient-to-br shrink-0', gradient)}>
                    {result.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-lg">
                        {result.standard_no}
                      </span>
                      <button
                        onClick={copyStdNo}
                        className="p-1 rounded-md text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all"
                        title="Copy standard number"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5 block">{result.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFav}
                    className={clsx(
                      'p-2 rounded-xl transition-all',
                      fav ? 'text-red-400 bg-red-400/10 border border-red-400/20' : 'text-slate-600 hover:text-red-400 hover:bg-red-400/10 border border-transparent'
                    )}
                  >
                    <Heart className={clsx('w-4 h-4', fav && 'fill-current')} />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 border border-transparent transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <div className="px-6 pb-4">
                <h2 className="text-xl font-bold text-white leading-snug">{result.title}</h2>
              </div>

              {/* Confidence + Relevance badges */}
              <div className="px-6 pb-5 flex flex-wrap gap-3">
                <div className={clsx('flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-bold', conf.bg, conf.color)}>
                  <CheckCircle2 className="w-4 h-4" />
                  {conf.label}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 text-sm font-bold">
                  <Target className="w-4 h-4" />
                  {result.confidence_score}% Relevance
                </div>
              </div>

              {/* Divider */}
              <div className="mx-6 border-t border-white/5 mb-5" />

              {/* Rationale */}
              {result.rationale && (
                <div className="px-6 mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-purple-400" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Why This Applies</h3>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                    <p className="text-sm text-slate-300 leading-relaxed">{result.rationale}</p>
                  </div>
                </div>
              )}

              {/* Scope */}
              <div className="px-6 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Scope</h3>
                </div>
                <div className="p-4 rounded-xl bg-white/3 border border-white/5">
                  <p className="text-sm text-slate-300 leading-relaxed">{result.scope}</p>
                </div>
              </div>

              {/* Score breakdown */}
              <div className="px-6 mb-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Score Breakdown</h3>
                <div className="grid grid-cols-2 gap-3">
                  {/* Semantic score */}
                  <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-500">Semantic (FAISS)</span>
                      <span className="font-bold text-blue-400">{Math.round(result.dense_score * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.dense_score * 100}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      />
                    </div>
                  </div>
                  {/* BM25 score */}
                  <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-500">Keyword (BM25)</span>
                      <span className="font-bold text-purple-400">{Math.round(result.bm25_score * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.bm25_score * 100}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              {result.keywords?.length > 0 && (
                <div className="px-6 mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-green-400" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Keywords</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((k) => (
                      <span key={k} className="text-xs px-2.5 py-1 bg-green-500/5 border border-green-500/15 text-green-400 rounded-lg">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Applicable products */}
              {result.applicable_products?.length > 0 && (
                <div className="px-6 mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <ChevronRight className="w-4 h-4 text-orange-400" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applicable Products</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.applicable_products.map((p) => (
                      <span key={p} className="text-xs px-2.5 py-1 bg-orange-500/5 border border-orange-500/15 text-orange-400 rounded-lg">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-600">Bureau of Indian Standards · {result.category}</span>
                <a
                  href={`https://www.bis.gov.in`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  BIS Official Site
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
