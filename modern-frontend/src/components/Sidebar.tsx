import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Search, History, Heart, BarChart2, BookOpen,
  Settings, HelpCircle, ChevronLeft, ChevronRight,
  ShieldCheck, Trophy, Zap, GitCompare,
} from 'lucide-react';
import { clsx } from 'clsx';

const NAV = [
  { to: '/',           icon: Home,       label: 'Home' },
  { to: '/search',     icon: Search,     label: 'New Search' },
  { to: '/history',    icon: History,    label: 'History' },
  { to: '/favorites',  icon: Heart,      label: 'Favorites' },
  { to: '/analytics',  icon: BarChart2,  label: 'Analytics' },
  { to: '/library',    icon: BookOpen,   label: 'Standards Library' },
  { to: '/compliance', icon: ShieldCheck,label: 'Compliance Check' },
  { to: '/compare',    icon: GitCompare, label: 'Compare' },
];

const BOTTOM_NAV = [
  { to: '/settings', icon: Settings,   label: 'Settings' },
  { to: '/help',     icon: HelpCircle, label: 'Help & Support' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <aside
      className={clsx(
        'relative flex flex-col h-screen bg-[#0a0f1e] border-r border-white/5 transition-all duration-300 shrink-0',
        collapsed ? 'w-[68px]' : 'w-[220px]'
      )}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 cursor-pointer select-none"
        onClick={() => navigate('/')}
      >
        <div className="w-9 h-9 shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white leading-tight">BIS Antigravity</p>
            <p className="text-[10px] text-slate-500 leading-tight">Compliance Engine</p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-[72px] w-6 h-6 bg-[#0a0f1e] border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 transition-all z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Main nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={clsx('w-4 h-4 shrink-0', isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-white')} />
                {!collapsed && <span className="truncate">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-2 py-2 space-y-0.5 border-t border-white/5">
        {BOTTOM_NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={clsx('w-4 h-4 shrink-0', isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-white')} />
                {!collapsed && <span className="truncate">{label}</span>}
              </>
            )}
          </NavLink>
        ))}

        {/* Hackathon badge */}
        {!collapsed && (
          <div className="mt-3 mx-1 p-3 rounded-xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/10">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">Built for</span>
            </div>
            <p className="text-xs font-bold text-white">BIS Hackathon 2026</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Accelerating MSE Compliance</p>
            <div className="flex items-center gap-1 mt-2">
              <Zap className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] text-blue-400 font-medium">Tech_Bridgers</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
