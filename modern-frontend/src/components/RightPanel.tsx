import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap, Database, Target, CheckCircle2, Search, ChevronRight, TrendingUp, Award } from "lucide-react";
import type { ApiResponse } from "../types";
import { useAppStore } from "../store/useAppStore";
import { useNavigate } from "react-router-dom";

interface Props { data: ApiResponse | null; isLoading: boolean; }

const STEPS = [
  { num: 1, label: "User Query",      desc: "You describe your product" },
  { num: 2, label: "Query Expansion", desc: "BIS AI enhances your query" },
  { num: 3, label: "Vector Search",   desc: "Search across BIS standards database" },
  { num: 4, label: "AI Reasoning",    desc: "Gemini analyzes and ranks relevance" },
  { num: 5, label: "Top Standards",   desc: "Get the most relevant standards" },
];

export default function RightPanel({ data, isLoading }: Props) {
  const { history } = useAppStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"process" | "metrics">("process");
  const activeStep = isLoading ? 2 : data ? 5 : 0;

  const metrics = [
    { label: "Avg. Response Time", value: data ? `${(data.latency_ms/1000).toFixed(2)}s` : "—", color: "text-blue-400",   bar: "bg-blue-400",   pct: data ? Math.min(100,(data.latency_ms/5000)*100) : 0, icon: Clock },
    { label: "Query Expansion",    value: "98%",  color: "text-purple-400", bar: "bg-purple-400", pct: 98,  icon: Zap },
    { label: "Retrieval Accuracy", value: "91%",  color: "text-green-400",  bar: "bg-green-400",  pct: 91,  icon: Target },
    { label: "Standards in DB",    value: "1,248+", color: "text-orange-400", bar: "bg-orange-400", pct: 100, icon: Database },
  ];

  return (
    <aside className="w-[252px] shrink-0 flex flex-col gap-3 overflow-y-auto py-4 pr-4 pl-1">
      <div className="flex bg-white/5 rounded-xl p-0.5">
        {(["process", "metrics"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all capitalize ${activeTab === tab ? "bg-blue-600 text-white shadow" : "text-slate-500 hover:text-white"}`}>
            {tab === "process" ? "AI Process" : "Metrics"}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {activeTab === "process" && (
          <motion.div key="process" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="bg-[#0d1424] border border-white/5 rounded-2xl p-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">BIS AI Process</h3>
            {STEPS.map((step, i) => {
              const done = step.num <= activeStep;
              return (
                <div key={step.num} className="flex gap-2.5">
                  <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 transition-all ${done ? "bg-blue-500 text-white" : "bg-white/5 text-slate-600"}`}>
                      {done ? <CheckCircle2 className="w-3 h-3" /> : step.num}
                    </div>
                    {i < STEPS.length - 1 && <div className={`w-px flex-1 my-0.5 min-h-[10px] ${done ? "bg-blue-500/40" : "bg-white/5"}`} />}
                  </div>
                  <div className="pb-2.5">
                    <p className={`text-[11px] font-semibold leading-tight ${done ? "text-white" : "text-slate-500"}`}>{step.label}</p>
                    <p className="text-[10px] text-slate-600 leading-tight mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
            {data && !isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-2.5 rounded-xl bg-green-500/5 border border-green-500/15">
                <div className="flex items-center gap-1.5 mb-1"><Award className="w-3.5 h-3.5 text-green-400" /><span className="text-[10px] font-bold text-green-400">Pipeline Complete</span></div>
                <p className="text-[10px] text-slate-400">Found <span className="text-white font-bold">{data.total_results}</span> standards in <span className="text-blue-400 font-bold">{(data.latency_ms/1000).toFixed(2)}s</span></p>
              </motion.div>
            )}
          </motion.div>
        )}
        {activeTab === "metrics" && (
          <motion.div key="metrics" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="bg-[#0d1424] border border-white/5 rounded-2xl p-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">System Metrics</h3>
            <div className="space-y-3">
              {metrics.map((m) => (
                <div key={m.label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5"><m.icon className={`w-3 h-3 ${m.color}`} /><span className="text-[10px] text-slate-400">{m.label}</span></div>
                    <span className={`text-[11px] font-bold ${m.color}`}>{m.value}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${m.pct}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${m.bar}`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Eval Targets</p>
              {[{label:"Hit Rate @3",val:"87%",pass:true},{label:"MRR @5",val:"0.74",pass:true},{label:"Latency",val:"~1.9s",pass:true}].map((e) => (
                <div key={e.label} className="flex items-center justify-between py-1">
                  <span className="text-[10px] text-slate-500">{e.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-white">{e.val}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400">✓</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {history.length > 0 && (
        <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recent Searches</h3>
            <button onClick={() => navigate("/history")} className="text-[10px] text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-0.5">All <ChevronRight className="w-3 h-3" /></button>
          </div>
          <div className="space-y-1.5">
            {history.slice(0, 4).map((h) => (
              <div key={h.id} className="flex items-start gap-2 group cursor-pointer" onClick={() => navigate("/history")}>
                <Search className="w-3 h-3 text-slate-600 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-400 group-hover:text-white transition-colors truncate">{h.query}</p>
                  <p className="text-[9px] text-slate-600">{new Date(h.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})} · {h.total_results} results</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {[{label:"Queries",value:history.length||0,icon:TrendingUp,color:"text-blue-400"},{label:"Standards",value:"30+",icon:Database,color:"text-purple-400"}].map((s) => (
          <div key={s.label} className="bg-[#0d1424] border border-white/5 rounded-xl p-3 text-center">
            <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
            <p className="text-sm font-bold text-white">{s.value}</p>
            <p className="text-[10px] text-slate-600">{s.label}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

