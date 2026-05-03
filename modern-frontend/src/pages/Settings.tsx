import React, { useState } from 'react';
import { Settings as SettingsIcon, Server, Zap, Bell, Shield, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [apiUrl, setApiUrl] = useState('http://localhost:8000');
  const [topK, setTopK] = useState(5);
  const [useLlm, setUseLlm] = useState(true);
  const [antigravity, setAntigravity] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    localStorage.setItem('bis-settings', JSON.stringify({ apiUrl, topK, useLlm, antigravity, notifications }));
    toast.success('Settings saved');
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-all ${value ? 'bg-blue-600' : 'bg-white/10'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${value ? 'left-5' : 'left-0.5'}`} />
    </button>
  );

  const Section = ({ icon: Icon, title, children }: any) => (
    <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-5 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );

  const Row = ({ label, desc, children }: any) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm text-white">{label}</p>
        {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-slate-500 text-sm mb-6">Configure your BIS Antigravity AI preferences</p>

        <Section icon={Server} title="API Configuration">
          <Row label="Backend URL" desc="FastAPI server endpoint">
            <input
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-56 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500/40 transition-colors"
            />
          </Row>
          <Row label="Default Results" desc="Number of standards to return">
            <div className="flex items-center gap-3">
              <input type="range" min={3} max={7} value={topK} onChange={(e) => setTopK(Number(e.target.value))} className="w-24 accent-blue-500" />
              <span className="text-sm font-bold text-blue-400 w-4">{topK}</span>
            </div>
          </Row>
        </Section>

        <Section icon={Zap} title="AI Features">
          <Row label="Gemini AI Rationale" desc="Generate explanations using Google Gemini">
            <Toggle value={useLlm} onChange={() => setUseLlm((v) => !v)} />
          </Row>
          <Row label="Antigravity Query Expansion" desc="Automatically expand queries for better retrieval">
            <Toggle value={antigravity} onChange={() => setAntigravity((v) => !v)} />
          </Row>
        </Section>

        <Section icon={Bell} title="Notifications">
          <Row label="Toast Notifications" desc="Show success/error messages">
            <Toggle value={notifications} onChange={() => setNotifications((v) => !v)} />
          </Row>
        </Section>

        <Section icon={Shield} title="Data & Privacy">
          <Row label="Search History" desc="Stored locally in your browser">
            <button
              onClick={() => { localStorage.removeItem('bis-app-store'); toast.success('Local data cleared'); }}
              className="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-medium transition-all"
            >
              Clear All Data
            </button>
          </Row>
        </Section>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-bold rounded-xl transition-all"
        >
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}
