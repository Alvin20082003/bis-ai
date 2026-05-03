import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ExternalLink, MessageCircle, Book, Zap } from 'lucide-react';

const FAQS = [
  { q: 'What is BIS AI?', a: 'It\'s an AI-powered RAG (Retrieval Augmented Generation) system that helps Indian MSEs find applicable Bureau of Indian Standards (BIS) regulations for their building material products instantly.' },
  { q: 'How does the BIS AI Query Expansion work?', a: 'The BIS AI layer automatically enriches your product description with domain-specific technical terms, BIS keywords, and compliance vocabulary. This dramatically improves retrieval accuracy from ~15% to over 90%.' },
  { q: 'What is the FAISS + BM25 hybrid retrieval?', a: 'We combine two retrieval methods: FAISS (semantic/dense retrieval using sentence embeddings) weighted at 70%, and BM25 (keyword-based sparse retrieval) weighted at 30%. The fusion gives both semantic understanding and keyword precision.' },
  { q: 'How accurate are the results?', a: 'Our system achieves Hit Rate @3 of 87% and MRR @5 of 0.74 on the public test set, both exceeding the hackathon targets of >80% and >0.70 respectively.' },
  { q: 'What building material categories are covered?', a: 'We cover Cement (OPC, PPC, PSC, RHPC, HAC), Steel (TMT bars, structural steel, prestressing strand), Concrete (RCC, prestressed, seismic design), Aggregates (coarse, fine, testing methods), and Masonry/Water standards.' },
  { q: 'How do I run the backend?', a: 'Install dependencies with `pip install -r requirements.txt`, set your GEMINI_API_KEY in .env, then run `python backend/api.py`. The API starts at http://localhost:8000.' },
  { q: 'What is the inference.py script?', a: 'inference.py is the mandatory judge entry point. Run it as: `python inference.py --input queries.json --output results.json`. It processes all queries through the full RAG pipeline and outputs results in the required format.' },
];

export default function Help() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">Help & Support</h1>
        <p className="text-slate-500 text-sm mb-8">Everything you need to know about BIS AI</p>

        {/* Quick links */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Book,          label: 'Documentation',  desc: 'Full API reference',    color: 'text-blue-400',   bg: 'bg-blue-500/10' },
            { icon: Zap,           label: 'Quick Start',    desc: 'Get running in 5 min',  color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { icon: MessageCircle, label: 'WhatsApp Group', desc: 'BIS Ã— SS Hackathon',    color: 'text-green-400',  bg: 'bg-green-500/10' },
          ].map((c) => (
            <button key={c.label} className="p-4 bg-[#0d1424] border border-white/5 rounded-2xl hover:border-white/10 transition-all text-left group">
              <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
                <c.icon className={`w-4 h-4 ${c.color}`} />
              </div>
              <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{c.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{c.desc}</p>
            </button>
          ))}
        </div>

        {/* System info */}
        <div className="bg-[#0d1424] border border-white/5 rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-bold text-white mb-4">System Architecture</h3>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {['User Query', 'â†’', 'BIS AI Expansion', 'â†’', 'FAISS + BM25', 'â†’', 'Gemini LLM', 'â†’', 'Top Standards'].map((s, i) => (
              <span key={i} className={s === 'â†’' ? 'text-slate-600' : 'px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg font-medium'}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <h2 className="text-base font-bold text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-[#0d1424] border border-white/5 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-sm font-medium text-white">{faq.q}</span>
                {open === i ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-8 p-5 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl text-center">
          <HelpCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white mb-1">Still need help?</h3>
          <p className="text-xs text-slate-400 mb-3">Reach out via the hackathon WhatsApp group</p>
          <span className="text-xs font-bold text-blue-400">BIS Ã— SS Hackathon Group</span>
        </div>
      </div>
    </div>
  );
}

