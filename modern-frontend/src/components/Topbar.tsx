import { useEffect, useState } from 'react';
import { User, ChevronDown, Wifi, WifiOff, ShieldCheck, GitCompare, BookOpen, Bell } from 'lucide-react';
import { checkHealth } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ title }: { title?: string }) {
  const [online, setOnline] = useState<boolean | null>(null);
  const [showActions, setShowActions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      try {
        const h = await checkHealth();
        setOnline(h.status === 'healthy' && h.index_ready);
      } catch { setOnline(false); }
    };
    check();
    const t = setInterval(check, 30000);
    return () => clearInterval(t);
  }, []);

  const QUICK = [
    { icon: ShieldCheck, label: 'Compliance Check', path: '/compliance', color: 'text-green-400' },
    { icon: GitCompare,  label: 'Compare Standards', path: '/compare',    color: 'text-blue-400' },
    { icon: BookOpen,    label: 'Standards Library', path: '/library',    color: 'text-purple-400' },
  ];

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-white/5 bg-[#020617]/90 backdrop-blur-xl">
      {/* Left: breadcrumb title */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-600 font-medium">BIS Antigravity</span>
        <span className="text-slate-700">/</span>
        <span className="text-sm font-semibold text-slate-200">{title || 'Home'}</span>
      </div>

      {/* Right: actions + status + profile */}
      <div className="flex items-center gap-3">

        {/* Quick action buttons */}
        <div className="hidden md:flex items-center gap-1">
          {QUICK.map((q) => (
            <button
              key={q.path}
              onClick={() => navigate(q.path)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-slate-500 hover:text-white hover:bg-white/5 transition-all"
            >
              <q.icon className={`w-3.5 h-3.5 ${q.color}`} />
              {q.label}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-white/10" />

        {/* API status pill */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
          online === null ? 'border-white/10 text-slate-500'
          : online ? 'border-green-500/20 bg-green-500/5 text-green-400'
          : 'border-red-500/20 bg-red-500/5 text-red-400'
        }`}>
          {online === null ? <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          : online ? <Wifi className="w-3 h-3" />
          : <WifiOff className="w-3 h-3" />}
          {online === null ? 'Connecting' : online ? 'API Online' : 'API Offline'}
        </div>

        {/* Notification bell */}
        <button className="relative p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
        </button>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowActions((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] font-black text-white">
              TB
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-tight">Tech_Bridgers</p>
              <p className="text-[9px] text-slate-500 leading-tight">BIS Hackathon 2026</p>
            </div>
            <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${showActions ? 'rotate-180' : ''}`} />
          </button>

          {showActions && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-[#0d1424] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="px-3 py-2.5 border-b border-white/5">
                <p className="text-xs font-bold text-white">Tech_Bridgers</p>
                <p className="text-[10px] text-slate-500">BIS Hackathon 2026 · Team</p>
              </div>
              {[
                { label: 'Analytics', path: '/analytics' },
                { label: 'Settings',  path: '/settings' },
                { label: 'Help',      path: '/help' },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setShowActions(false); }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
