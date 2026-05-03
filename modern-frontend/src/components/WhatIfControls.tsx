import { Sliders, MapPin, Building2, Wrench } from 'lucide-react';
import { clsx } from 'clsx';
import type { Industry, Location } from '../types';

interface Props {
  industry: Industry;
  location: Location;
  materialModifier: string;
  onChange: (field: 'industry' | 'location' | 'materialModifier', value: string) => void;
}

const INDUSTRIES: { value: Industry; label: string; icon: string }[] = [
  { value: 'construction',   label: 'Construction',   icon: '🏗️' },
  { value: 'manufacturing',  label: 'Manufacturing',  icon: '🏭' },
  { value: 'infrastructure', label: 'Infrastructure', icon: '🌉' },
];

const LOCATIONS: { value: Location; label: string; icon: string; risk: string }[] = [
  { value: 'urban',   label: 'Urban',   icon: '🏙️', risk: 'Standard' },
  { value: 'coastal', label: 'Coastal', icon: '🌊', risk: 'High' },
  { value: 'rural',   label: 'Rural',   icon: '🌾', risk: 'Low' },
  { value: 'seismic', label: 'Seismic', icon: '⚡', risk: 'Critical' },
];

const RISK_COLOR: Record<string, string> = {
  Standard: 'text-blue-400',
  High:     'text-yellow-400',
  Low:      'text-green-400',
  Critical: 'text-red-400',
};

export default function WhatIfControls({ industry, location, materialModifier, onChange }: Props) {
  return (
    <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sliders className="w-4 h-4 text-orange-400" />
        <h3 className="text-sm font-bold text-white">What-If Simulator</h3>
        <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
          Modifies retrieval context
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Industry */}
        <div>
          <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Building2 className="w-3 h-3" /> Industry
          </label>
          <div className="flex flex-col gap-1">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind.value}
                onClick={() => onChange('industry', ind.value)}
                className={clsx(
                  'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left',
                  industry === ind.value
                    ? 'bg-blue-600/20 border border-blue-500/30 text-blue-300'
                    : 'bg-white/3 border border-white/5 text-slate-400 hover:bg-white/8 hover:text-white'
                )}
              >
                <span>{ind.icon}</span>
                {ind.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            <MapPin className="w-3 h-3" /> Location
          </label>
          <div className="flex flex-col gap-1">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.value}
                onClick={() => onChange('location', loc.value)}
                className={clsx(
                  'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all',
                  location === loc.value
                    ? 'bg-orange-600/20 border border-orange-500/30 text-orange-300'
                    : 'bg-white/3 border border-white/5 text-slate-400 hover:bg-white/8 hover:text-white'
                )}
              >
                <span className="flex items-center gap-2">
                  <span>{loc.icon}</span>
                  {loc.label}
                </span>
                <span className={clsx('text-[9px] font-bold', RISK_COLOR[loc.risk])}>
                  {loc.risk}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Material modifier */}
        <div>
          <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Wrench className="w-3 h-3" /> Material Modifier
          </label>
          <textarea
            value={materialModifier}
            onChange={(e) => onChange('materialModifier', e.target.value)}
            placeholder="e.g., high strength, corrosion resistant, lightweight…"
            rows={4}
            className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors resize-none"
          />
          <p className="text-[10px] text-slate-600 mt-1">
            Additional material properties to factor into analysis
          </p>
        </div>
      </div>
    </div>
  );
}
