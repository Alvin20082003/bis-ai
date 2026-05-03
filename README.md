<div align="center">

<img src="https://img.shields.io/badge/BIS-Antigravity%20AI-3b82f6?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkw0IDdWMTdMMTIgMjJMMjAgMTdWN0wxMiAyWiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=&logoColor=white" alt="BIS Antigravity AI"/>

# 🚀 BIS Antigravity AI — Compliance Engine

### *From product idea → BIS standards in under 3 seconds*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?style=flat-square&logo=google)](https://aistudio.google.com)
[![FAISS](https://img.shields.io/badge/FAISS-Vector%20DB-FF6B35?style=flat-square)](https://faiss.ai)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**Built by Team Tech_Bridgers · BIS × Sigma Squad AI Hackathon 2026**

[🌐 Live Demo](#-how-to-run) · [📊 Evaluation Results](#-evaluation-results) · [💼 Business Case](#-business-opportunity)

</div>

---

## 📸 Screenshots

<div align="center">

### 🏠 Home Dashboard — Search & Results
![Home Dashboard](https://raw.githubusercontent.com/Alvin20082003/bis-antigravity-ai/main/docs/screenshots/home.png)
*AI-powered search with real-time BIS standard recommendations, relevance scores, and Gemini rationale*

### 🔬 Advanced Mode — Gap Analysis & Compliance Checklist
![Advanced Mode](https://raw.githubusercontent.com/Alvin20082003/bis-antigravity-ai/main/docs/screenshots/advanced.png)
*Gap analysis shows what's covered vs missing · Smart checklist with interactive checkboxes per standard*

### 📚 Standards Library — Full Detail Panel
![Standards Library](https://raw.githubusercontent.com/Alvin20082003/bis-antigravity-ai/main/docs/screenshots/library.png)
*Browse all 30+ indexed BIS standards with scope, requirements, testing methods, and related standards*

</div>

---

## 🤔 What Problem Does This Solve?

Indian **Micro and Small Enterprises (MSEs)** spend **weeks** figuring out which Bureau of Indian Standards (BIS) regulations apply to their products.

| Without This App | With This App |
|-----------------|---------------|
| ❌ 2–4 weeks of manual research | ✅ Under 3 seconds |
| ❌ Hire expensive consultants | ✅ Free AI-powered search |
| ❌ Risk of missing critical standards | ✅ Gap analysis catches what's missing |
| ❌ No actionable compliance steps | ✅ Smart checklist per standard |
| ❌ Generic advice | ✅ Product-specific AI explanations |

> **1.3 million+ MSEs in India** deal with BIS compliance every year. This app gives them a superpower.

---

## ⚡ How It Works — The Antigravity Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    ANTIGRAVITY AI PIPELINE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User types:  "OPC 53 cement for high rise building"             │
│                          │                                        │
│                          ▼                                        │
│  ┌─────────────────────────────────────────┐                     │
│  │  1. ANTIGRAVITY QUERY EXPANSION         │                     │
│  │  Adds: "ordinary portland cement        │                     │
│  │  IS 269 IS 12269 compressive strength   │                     │
│  │  fineness soundness BIS compliance..."  │                     │
│  └─────────────────────────────────────────┘                     │
│                          │                                        │
│              ┌───────────┴───────────┐                           │
│              ▼                       ▼                           │
│  ┌─────────────────┐     ┌─────────────────┐                    │
│  │  FAISS SEARCH   │     │   BM25 SEARCH   │                    │
│  │  (Semantic 70%) │     │  (Keyword 30%)  │                    │
│  └────────┬────────┘     └────────┬────────┘                    │
│           └───────────┬───────────┘                              │
│                       ▼                                           │
│  ┌─────────────────────────────────────────┐                     │
│  │  3. HYBRID FUSION SCORING               │                     │
│  │  Combined score = 0.7×dense + 0.3×bm25 │                     │
│  └─────────────────────────────────────────┘                     │
│                       │                                           │
│                       ▼                                           │
│  ┌─────────────────────────────────────────┐                     │
│  │  4. GEMINI 2.5 FLASH RATIONALE          │                     │
│  │  "IS 12269:2013 is applicable because   │                     │
│  │  it specifically covers 53 grade OPC,   │                     │
│  │  ideal for high-rise buildings due to   │                     │
│  │  higher early strength gain..."         │                     │
│  └─────────────────────────────────────────┘                     │
│                       │                                           │
│                       ▼                                           │
│  Result: IS 12269:2013 [100%] + IS 269:2015 [90%] + more        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
bis-antigravity-ai/
│
├── 🐍 backend/                    ← Python AI server
│   ├── api.py                     ← FastAPI server (START THIS)
│   ├── pipeline.py                ← Full RAG orchestration
│   ├── retriever.py               ← FAISS + BM25 hybrid search
│   ├── generator.py               ← Gemini AI explanations
│   ├── antigravity.py             ← Query expansion engine
│   ├── advanced.py                ← Gap analysis + checklists
│   ├── embed.py                   ← Build FAISS vector index
│   └── ingest.py                  ← Load BIS standards data
│
├── ⚛️  modern-frontend/            ← React website
│   └── src/
│       ├── pages/                 ← 10 pages (Home, Library, etc.)
│       ├── components/            ← Reusable UI components
│       ├── services/api.ts        ← Backend communication
│       ├── store/useAppStore.ts   ← Zustand state management
│       └── types/index.ts         ← TypeScript definitions
│
├── 🗄️  data/
│   ├── index/                     ← Pre-built FAISS index
│   └── processed/                 ← BIS standards JSON database
│
├── 🐍 src/                        ← Python modules for inference
│   ├── rag_pipeline.py            ← Pipeline for inference.py
│   ├── retriever.py               ← Search logic
│   └── utils.py                   ← Antigravity expansion
│
├── 📋 inference.py                ← 🏆 JUDGES RUN THIS
├── 📊 eval_script.py              ← Calculates Hit Rate, MRR
├── 📦 requirements.txt            ← Python dependencies
├── ⚙️  setup.py                    ← One-click index builder
└── 🔑 .env.example                ← API key template
```

---

## 🚀 How to Run

### Prerequisites
- Python 3.10 or newer
- Node.js 18 or newer
- A free Google Gemini API key

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Alvin20082003/bis-antigravity-ai.git
cd bis-antigravity-ai
```

---

### Step 2 — Install Python Dependencies

```bash
pip install -r requirements.txt
```

---

### Step 3 — Set Up Your API Key

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Open `.env` and add your key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> 🔑 Get a **free** key at: https://aistudio.google.com/app/apikey

---

### Step 4 — Build the AI Search Index

> Only needed once. Takes about 1 minute.

```bash
python setup.py
```

---

### Step 5 — Start the Backend

```bash
python backend/api.py
```

✅ API running at: http://localhost:8000
📖 API docs at: http://localhost:8000/docs

---

### Step 6 — Start the Frontend

Open a **new terminal**:

```bash
cd modern-frontend
npm install
npm run dev
```

✅ App running at: **http://localhost:5173**

---

## 🏆 For Judges — Evaluation

```bash
# Run inference on test dataset
python inference.py --input hidden_private_dataset.json --output team_results.json

# Calculate scores
python eval_script.py --results team_results.json --ground_truth ground_truth.json
```

---

## 📊 Evaluation Results

<div align="center">

| Metric | Target | **Our Score** | Status |
|--------|--------|---------------|--------|
| Hit Rate @3 | > 80% | **87%** | ✅ PASS |
| MRR @5 | > 0.70 | **0.74** | ✅ PASS |
| Avg Latency | < 5.0s | **~1.9s** | ✅ PASS |

</div>

---

## 🌟 Features

### Core Features
| Feature | Description |
|---------|-------------|
| 🔍 Smart Search | Type any product description, get top BIS standards instantly |
| 🤖 AI Rationale | Gemini 2.5 Flash explains WHY each standard applies to your product |
| 🚀 Antigravity Expansion | Automatically enriches queries with 100+ BIS domain terms |
| ⚡ Hybrid Retrieval | FAISS semantic (70%) + BM25 keyword (30%) fusion |

### Advanced Features (click "Advanced Mode")
| Feature | Description |
|---------|-------------|
| 🔬 Gap Analysis | Shows covered vs missing standards with risk level (LOW/MEDIUM/HIGH) |
| ✅ Smart Checklist | Interactive compliance checklist per standard (e.g., "Test 28-day strength ≥ 53 MPa") |
| 🎛️ What-If Simulator | Change location (coastal/seismic/urban) and industry to update recommendations |
| 📄 Download Report | Full compliance report with standards, gap analysis, and checklists |

### All 10 Pages
| Page | Purpose |
|------|---------|
| 🏠 Home | Main search + results + advanced analysis |
| 🔍 New Search | Clean search with top-k and LLM controls |
| 📜 History | All past searches, click to re-run |
| ❤️ Favorites | Saved standards grouped by category |
| 📊 Analytics | Charts: query count, latency, category distribution |
| 📚 Standards Library | Browse all 30+ standards with full detail panel |
| 🛡️ Compliance Check | Generate compliance report for any product |
| ⚖️ Compare | Side-by-side comparison of up to 4 standards |
| ⚙️ Settings | Configure API URL, AI features, data |
| ❓ Help | FAQ, architecture guide, quick start |

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | React 19 + Vite + Tailwind CSS v4 | Fast, modern, beautiful dark UI |
| **Backend** | FastAPI (Python) | High-performance async API |
| **Vector Search** | FAISS IndexFlatIP | Sub-millisecond semantic search |
| **Keyword Search** | BM25Okapi (rank-bm25) | Precise keyword matching |
| **Embeddings** | all-MiniLM-L6-v2 | 384-dim sentence embeddings |
| **LLM** | Google Gemini 2.5 Flash | Fast, accurate rationale generation |
| **State** | Zustand + localStorage | Persistent history and favorites |
| **Charts** | Recharts | Analytics visualizations |
| **Animations** | Framer Motion | Smooth, professional transitions |

</div>

---

## 💼 Business Opportunity

### The Market Problem

> India has **63 million MSMEs**. Every product manufacturer must comply with BIS standards before selling. Currently, compliance consulting costs **₹50,000–₹5,00,000 per product** and takes **4–12 weeks**.

### How This Becomes a Business

```
┌─────────────────────────────────────────────────────────────┐
│                   MONETIZATION ROADMAP                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PHASE 1 — FREEMIUM SaaS (Month 1–6)                       │
│  ├── Free: 10 searches/month                                │
│  ├── Starter ₹999/month: 100 searches + reports            │
│  └── Pro ₹4,999/month: Unlimited + API access              │
│                                                              │
│  PHASE 2 — B2B ENTERPRISE (Month 6–18)                     │
│  ├── White-label for BIS consultants                        │
│  ├── Integration with ERP systems (SAP, Tally)             │
│  └── ₹50,000–₹2,00,000/year per enterprise                │
│                                                              │
│  PHASE 3 — PLATFORM PLAY (Month 18–36)                     │
│  ├── Marketplace: connect MSMEs with BIS labs              │
│  ├── Auto-generate BIS application documents               │
│  ├── Track certification status                             │
│  └── Commission: 5–10% on lab bookings                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Revenue Projections

| Year | Users | Revenue Model | Projected ARR |
|------|-------|---------------|---------------|
| Year 1 | 500 MSMEs | Freemium SaaS | ₹25 Lakhs |
| Year 2 | 5,000 MSMEs | SaaS + Enterprise | ₹2.5 Crores |
| Year 3 | 50,000 MSMEs | Platform + API | ₹25 Crores |

### Why We Win the Market

```
🎯 UNFAIR ADVANTAGES
├── 1. First-mover: No AI-powered BIS compliance tool exists today
├── 2. Data moat: Proprietary BIS standards database + embeddings
├── 3. Network effect: More users → better query data → better AI
├── 4. Switching cost: History, favorites, reports stored in platform
└── 5. Government alignment: BIS is pushing digital compliance
```

### Target Customers

| Segment | Size | Pain | Willingness to Pay |
|---------|------|------|-------------------|
| Cement manufacturers | 3,000+ | High | ₹5,000–50,000/yr |
| Steel fabricators | 15,000+ | High | ₹3,000–30,000/yr |
| Construction firms | 50,000+ | Medium | ₹1,000–10,000/yr |
| BIS consultants | 2,000+ | Low | ₹20,000–2,00,000/yr |
| Testing labs | 500+ | Medium | ₹50,000–5,00,000/yr |

### Expansion Roadmap

```
TODAY                    6 MONTHS                 2 YEARS
Building Materials  →   All BIS categories   →   Global standards
(30 standards)          (1,248+ standards)        (ISO, ASTM, EN)

India only          →   India + SAARC        →   Global MSMEs
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| "API Offline" in app | Run `python backend/api.py` in a terminal |
| "Index not ready" error | Run `python setup.py` first |
| White screen in browser | Run `npm install` inside `modern-frontend/` |
| Gemini not working | Check `.env` has valid `GEMINI_API_KEY` |
| Port already in use | Backend=8000, Frontend=5173. Close conflicting apps |
| Slow first query | Normal — model loads on first request (~6s), then ~1.9s |

---

## 👥 Team

<div align="center">

### 🏆 Team Tech_Bridgers

*BIS × Sigma Squad AI Hackathon 2026*

**Accelerating MSE Compliance with AI**

</div>

---

## 📜 License

MIT License — Built for BIS × Sigma Squad AI Hackathon 2026.

BIS standard data sourced from Bureau of Indian Standards public documents (SP 21).

---

<div align="center">

**⭐ Star this repo if it helped you!**

Made with ❤️ by Team Tech_Bridgers

</div>
