import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, Search, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';
import StandardCard from '../components/StandardCard';

export default function Favorites() {
  const { favorites, removeFavorite } = useAppStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = favorites.filter(
    (f) =>
      f.standard.standard_no.toLowerCase().includes(search.toLowerCase()) ||
      f.standard.title.toLowerCase().includes(search.toLowerCase()) ||
      f.standard.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleRemoveAll = () => {
    favorites.forEach((f) => removeFavorite(f.standard.standard_no));
    toast.success('All favorites removed');
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Favorites</h1>
            <p className="text-slate-500 text-sm">{favorites.length} saved standards</p>
          </div>
          {favorites.length > 0 && (
            <button
              onClick={handleRemoveAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all"
            >
              <Trash2 className="w-4 h-4" /> Remove All
            </button>
          )}
        </div>

        {/* Search */}
        {favorites.length > 0 && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search favorites…"
              className="w-full pl-9 pr-4 py-2.5 bg-[#0d1424] border border-white/5 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors"
            />
          </div>
        )}

        {/* Empty state */}
        {favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart className="w-12 h-12 text-slate-700 mb-4" />
            <h3 className="text-lg font-bold text-slate-500 mb-2">No favorites yet</h3>
            <p className="text-slate-600 text-sm mb-6">
              Click the heart icon on any standard card to save it here
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all"
            >
              Search Standards
            </button>
          </div>
        )}

        {/* Category groups */}
        {filtered.length > 0 && (
          <div>
            {/* Group by category */}
            {Array.from(new Set(filtered.map((f) => f.standard.category))).map((cat) => (
              <div key={cat} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{cat}</h3>
                  <span className="text-[10px] px-1.5 py-0.5 bg-white/5 text-slate-600 rounded-full">
                    {filtered.filter((f) => f.standard.category === cat).length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <AnimatePresence>
                    {filtered
                      .filter((f) => f.standard.category === cat)
                      .map((fav, i) => (
                        <motion.div
                          key={fav.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <StandardCard
                            result={fav.standard}
                            index={i}
                            query={fav.query}
                            showFavorite
                          />
                          <p className="text-[10px] text-slate-600 mt-1 px-1">
                            Saved from: "{fav.query.slice(0, 50)}…" ·{' '}
                            {new Date(fav.savedAt).toLocaleDateString()}
                          </p>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && favorites.length > 0 && (
          <p className="text-center text-slate-600 py-12">No favorites match your search</p>
        )}
      </div>
    </div>
  );
}
