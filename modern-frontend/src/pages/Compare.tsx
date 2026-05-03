import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, Plus, X, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

const ALL_STANDARDS = [
  { standard_no: 'IS 269:2015',    title: 'Ordinary Portland Cement',                  category: 'Cement',     year: '2015', strength: '33/43/53 MPa', scope: 'General construction cement, all grades', setting_time: '≥30 min initial', soundness: '≤10 mm', applicable: 'Buildings, roads, bridges' },
  { standard_no: 'IS 12269:2013',  title: '53 Grade OPC',                              category: 'Cement',     year: '2013', strength: '≥53 MPa (28d)', scope: 'High-rise, precast, prestressed concrete', setting_time: '≥30 min initial', soundness: '≤10 mm', applicable: 'High-rise, precast, rapid construction' },
  { standard_no: 'IS 1489-1:2015', title: 'Portland Pozzolana Cement (Fly Ash)',       category: 'Cement',     year: '2015', strength: '≥33 MPa (28d)', scope: 'Mass concrete, marine, general construction', setting_time: '≥30 min initial', soundness: '≤10 mm', applicable: 'Mass concrete, marine structures' },
  { standard_no: 'IS 455:2015',    title: 'Portland Slag Cement',                      category: 'Cement',     year: '2015', strength: '≥33 MPa (28d)', scope: 'Marine, underground, sulphate-rich environments', setting_time: '≥30 min initial', soundness: '≤10 mm', applicable: 'Marine, underground, sewage' },
  { standard_no: 'IS 1786:2008',   title: 'High Strength Deformed Steel Bars (TMT)',   category: 'Steel',      year: '2008', strength: 'Fe415–Fe600', scope: 'Concrete reinforcement, seismic zones', setting_time: 'N/A', soundness: 'N/A', applicable: 'RCC structures, seismic zones' },
  { standard_no: 'IS 2062:2011',   title: 'Hot Rolled Structural Steel',               category: 'Steel',      year: '2011', strength: 'E250–E650', scope: 'Structural steel for buildings, bridges', setting_time: 'N/A', soundness: 'N/A', applicable: 'Industrial sheds, bridges, towers' },
  { standard_no: 'IS 456:2000',    title: 'Plain and Reinforced Concrete',             category: 'Concrete',   year: '2000', strength: 'M10–M55+', scope: 'All concrete structures design code', setting_time: 'N/A', soundness: 'N/A', applicable: 'All RCC structures' },
  { standard_no: 'IS 10262:2019',  title: 'Concrete Mix Proportioning',                category: 'Concrete',   year: '2019', strength: 'All grades', scope: 'Mix design guidelines for all concrete', setting_time: 'N/A', soundness: 'N/A', applicable: 'All concrete mix design' },
  { standard_no: 'IS 383:2016',    title: 'Coarse and Fine Aggregates',                category: 'Aggregates', year: '2016', strength: 'AIV ≤30%', scope: 'Aggregates for concrete production', setting_time: 'N/A', soundness: 'Sulphate test', applicable: 'All concrete production' },
  { standard_no: 'IS 13920:2016',  title: 'Ductile Detailing of RC Structures',        category: 'Concrete',   year: '2016', strength: 'Fe415D/Fe500D', scope: 'Seismic zone III, IV, V structures', setting_time: 'N/A', soundness: 'N/A', applicable: 'Earthquake resistant buildings' },
];

const ROWS = [
  { key: 'standard_no', label: 'Standard No.' },
  { key: 'category',    label: 'Category' },
  { key: 'year',        label: 'Year' },
  { key: 'strength',    label: 'Strength / Grade' },
  { key: 'scope',       label: 'Scope' },
  { key: 'setting_time',label: 'Setting Time' },
  { key: 'soundness',   label: 'Soundness' },
  { key: 'applicable',  label: 'Best For' },
];

const CAT_COLORS: Record<string, string> = {
  Cement:     'text-yellow-400',
  Steel:      'text-blue-400',
  Concrete:   'text-green-400',
  Aggregates: 'text-orange-400',
};

export default function Compare() {
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const add = (no: string) => {
    if (selected.includes(no) || selected.length >= 4) return;
    setSelected((s) => [...s, no]);
    setOpen(false);
  };
  const remove = (no: string) => setSelected((s) => s.filter((x) => x !== no));

  const compared = selected.map((no) => ALL_STANDARDS.find((s) => s.standard_no === no)!).filter(Boolean);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <GitCompare className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Compare Standards</h1>
            <p className="text-slate-500 text-sm">Side-by-side comparison of up to 4 BIS standards</p>
          </div>
        </div>

        {/* Add standards */}
        <div className="flex flex-wrap items-center gap-3 mt-5 mb-6">
          {selected.map((no) => {
            const s = ALL_STANDARDS.find((x) => x.standard_no === no)!;
            return (
              <div key={no} className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <span className="font-mono text-xs font-bold text-blue-400">{no}</span>
                <button onClick={() => remove(no)} className="text-slate-500 hover:text-red-400 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {selected.length < 4 && (
            <div className="relative">
              <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-white/20 text-xs font-medium transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Standard
                <ChevronDown className={clsx('w-3 h-3 transition-transform', open && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute top-full mt-1 left-0 w-72 bg-[#0d1424] border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden"
                  >
                    {ALL_STANDARDS.filter((s) => !selected.includes(s.standard_no)).map((s) => (
                      <button
                        key={s.standard_no}
                        onClick={() => add(s.standard_no)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                      >
                        <span className="font-mono text-xs font-bold text-blue-400 w-28 shrink-0">{s.standard_no}</span>
                        <span className="text-xs text-slate-300 truncate">{s.title}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {selected.length > 0 && (
            <button onClick={() => setSelected([])} className="text-xs text-slate-500 hover:text-red-400 transition-colors ml-2">
              Clear all
            </button>
          )}
        </div>

        {/* Empty state */}
        {selected.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <GitCompare className="w-12 h-12 text-slate-700 mb-4" />
            <h3 className="text-lg font-bold text-slate-500 mb-2">No standards selected</h3>
            <p className="text-slate-600 text-sm">Click "Add Standard" to start comparing</p>
          </div>
        )}

        {/* Comparison table */}
        {compared.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3 bg-[#0d1424] rounded-tl-xl w-32">
                    Property
                  </th>
                  {compared.map((s, i) => (
                    <th key={s.standard_no} className={clsx('px-4 py-3 bg-[#0d1424] text-left', i === compared.length - 1 && 'rounded-tr-xl')}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={clsx('font-mono text-sm font-bold', CAT_COLORS[s.category] || 'text-blue-400')}>{s.standard_no}</p>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{s.title}</p>
                        </div>
                        <button onClick={() => remove(s.standard_no)} className="text-slate-600 hover:text-red-400 transition-colors ml-2">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, ri) => (
                  <tr key={row.key} className={ri % 2 === 0 ? 'bg-white/2' : ''}>
                    <td className="px-4 py-3 text-xs font-bold text-slate-500 border-t border-white/5 whitespace-nowrap">
                      {row.label}
                    </td>
                    {compared.map((s) => (
                      <td key={s.standard_no} className="px-4 py-3 text-xs text-slate-300 border-t border-white/5">
                        {row.key === 'standard_no'
                          ? <span className={clsx('font-mono font-bold', CAT_COLORS[s.category] || 'text-blue-400')}>{(s as any)[row.key]}</span>
                          : row.key === 'category'
                          ? <span className={clsx('font-bold', CAT_COLORS[s.category] || 'text-slate-300')}>{(s as any)[row.key]}</span>
                          : <span>{(s as any)[row.key]}</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
}
