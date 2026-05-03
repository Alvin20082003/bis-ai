import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, ChevronDown, CheckSquare, Square } from 'lucide-react';
import { clsx } from 'clsx';
import type { ChecklistItem } from '../types';

interface Props { checklists: ChecklistItem[]; }

export default function SmartChecklist({ checklists }: Props) {
  const [openStd, setOpenStd] = useState<string | null>(checklists[0]?.standard_no ?? null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setChecked(p => ({ ...p, [key]: !p[key] }));

  const totalItems = checklists.reduce((s, c) => s + c.items.length, 0);
  const doneItems  = Object.values(checked).filter(Boolean).length;
  const pct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-[#0d1424] border border-white/5 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Smart Compliance Checklist</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{doneItems}/{totalItems}</span>
          <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${pct}%` }}
              className="h-full bg-purple-400 rounded-full"
            />
          </div>
          <span className="text-xs font-bold text-purple-400">{pct}%</span>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {checklists.map((cl) => {
          const isOpen = openStd === cl.standard_no;
          const clDone = cl.items.filter((_, i) => checked[`${cl.standard_no}-${i}`]).length;

          return (
            <div key={cl.standard_no}>
              {/* Accordion header */}
              <button
                onClick={() => setOpenStd(isOpen ? null : cl.standard_no)}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/3 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-400">{cl.standard_no}</span>
                  <span className="text-[10px] text-slate-600">{clDone}/{cl.items.length} done</span>
                </div>
                <div className="flex items-center gap-2">
                  {clDone === cl.items.length && cl.items.length > 0 && (
                    <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Complete</span>
                  )}
                  <ChevronDown className={clsx('w-3.5 h-3.5 text-slate-500 transition-transform', isOpen && 'rotate-180')} />
                </div>
              </button>

              {/* Checklist items */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 space-y-2">
                      {cl.items.map((item, i) => {
                        const key = `${cl.standard_no}-${i}`;
                        const done = !!checked[key];
                        return (
                          <button
                            key={key}
                            onClick={() => toggle(key)}
                            className="w-full flex items-start gap-2.5 text-left group"
                          >
                            {done
                              ? <CheckSquare className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                              : <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-400 shrink-0 mt-0.5 transition-colors" />
                            }
                            <span className={clsx(
                              'text-xs leading-relaxed transition-colors',
                              done ? 'text-slate-600 line-through' : 'text-slate-300 group-hover:text-white'
                            )}>
                              {item}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
