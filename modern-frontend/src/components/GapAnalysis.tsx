import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import type { GapAnalysis as GapAnalysisType } from '../types';

interface Props { gap: GapAnalysisType; }

const RISK_CONFIG = {
  LOW:    { color: 'text-green-400',  bg: 'bg-green-400/10 border-green-400/20',  bar: 'bg-green-400',  icon: ShieldCheck,    label: 'Low Risk' },
  MEDIUM: { color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', bar: 'bg-yellow-400', icon: AlertTriangle,  label: 'Medium Risk' },
  HIGH:   { color: 'text-red-400',    bg: 'bg-red-400/10 border-red-400/20',       bar: 'bg-red-400',    icon: XCircle,        label: 'High Risk' },
};

export default function GapAnalysis({ gap }: Props) {
  const cfg = RISK_CONFIG[gap.risk_level];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0d1424] border border-white/5 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white">Compliance Gap Analysis</h3>
        </div>
        <span className={clsx('flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border', cfg.bg, cfg.color)}>
          <Icon className="w-3.5 h-3.5" />
          {cfg.label}
        </span>
      </div>

      <div className="p-5">
        {/* Risk score bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Compliance Coverage</span>
            <span className="font-bold text-white">{gap.coverage_pct}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${gap.coverage_pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={clsx('h-full rounded-full', cfg.bar)}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">{gap.summary}</p>
        </div>

        {/* Two columns: satisfied + missing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Satisfied */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs font-bold text-green-400 uppercase tracking-wider">
                Covered ({gap.satisfied.length})
              </span>
            </div>
            {gap.satisfied.length === 0 ? (
              <p className="text-xs text-slate-600 italic">None identified</p>
            ) : (
              <div className="space-y-1.5">
                {gap.satisfied.map((item) => (
                  <div key={item.standard_no} className="flex items-start gap-2 p-2 rounded-lg bg-green-500/5 border border-green-500/10">
                    <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-green-300">{item.standard_no}</p>
                      <p className="text-[10px] text-slate-500 leading-tight">{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Missing */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <XCircle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                Missing ({gap.missing.length})
              </span>
            </div>
            {gap.missing.length === 0 ? (
              <p className="text-xs text-slate-600 italic">No gaps detected ✓</p>
            ) : (
              <div className="space-y-1.5">
                {gap.missing.map((item) => (
                  <div key={item.standard_no} className="flex items-start gap-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10">
                    <XCircle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-red-300">{item.standard_no}</p>
                      <p className="text-[10px] text-slate-500 leading-tight">{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action */}
        <div className={clsx('mt-4 p-3 rounded-xl border text-xs font-medium', cfg.bg, cfg.color)}>
          <Icon className="w-3.5 h-3.5 inline mr-1.5" />
          {gap.summary}
        </div>
      </div>
    </motion.div>
  );
}
