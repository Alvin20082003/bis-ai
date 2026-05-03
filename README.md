<div align="center">

<img src="https://img.shields.io/badge/BIS-Antigravity%20AI-3b82f6?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkw0IDdWMTdMMTIgMjJMMjAgMTdWN0wxMiAyWiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=&logoColor=white" alt="BIS AI"/>

# ðŸš€ BIS AI â€” Compliance Engine

### *From product idea â†’ BIS standards in under 3 seconds*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?style=flat-square&logo=google)](https://aistudio.google.com)
[![FAISS](https://img.shields.io/badge/FAISS-Vector%20DB-FF6B35?style=flat-square)](https://faiss.ai)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**Built by Team Tech_Bridgers Â· BIS Ã— Sigma Squad AI Hackathon 2026**

[ðŸŒ Live Demo](#-how-to-run) Â· [ðŸ“Š Evaluation Results](#-evaluation-results) Â· [ðŸ’¼ Business Case](#-business-opportunity)

</div>

---

## ðŸ“¸ Screenshots

<div align="center">

![Hero Banner](docs/screenshots/hero-banner.svg)

</div>

---

## ðŸ¤” What Problem Does This Solve?

Indian **Micro and Small Enterprises (MSEs)** spend **weeks** figuring out which Bureau of Indian Standards (BIS) regulations apply to their products.

| Without This App | With This App |
|-----------------|---------------|
| âŒ 2â€“4 weeks of manual research | âœ… Under 3 seconds |
| âŒ Hire expensive consultants | âœ… Free AI-powered search |
| âŒ Risk of missing critical standards | âœ… Gap analysis catches what's missing |
| âŒ No actionable compliance steps | âœ… Smart checklist per standard |
| âŒ Generic advice | âœ… Product-specific AI explanations |

> **1.3 million+ MSEs in India** deal with BIS compliance every year. This app gives them a superpower.

---

## âš¡ How It Works â€” The Antigravity Pipeline

<div align="center">

![Pipeline Diagram](docs/screenshots/pipeline-diagram.svg)

</div>

---

## ðŸ“ Project Structure

```
bis-antigravity-ai/
â”‚
â”œâ”€â”€ ðŸ backend/                    â† Python AI server
â”‚   â”œâ”€â”€ api.py                     â† FastAPI server (START THIS)
â”‚   â”œâ”€â”€ pipeline.py                â† Full RAG orchestration
â”‚   â”œâ”€â”€ retriever.py               â† FAISS + BM25 hybrid search
â”‚   â”œâ”€â”€ generator.py               â† Gemini AI explanations
â”‚   â”œâ”€â”€ antigravity.py             â† Query expansion engine
â”‚   â”œâ”€â”€ advanced.py                â† Gap analysis + checklists
â”‚   â”œâ”€â”€ embed.py                   â† Build FAISS vector index
â”‚   â””â”€â”€ ingest.py                  â† Load BIS standards data
â”‚
â”œâ”€â”€ âš›ï¸  modern-frontend/            â† React website
â”‚   â””â”€â”€ src/
â”‚       â”œâ”€â”€ pages/                 â† 10 pages (Home, Library, etc.)
â”‚       â”œâ”€â”€ components/            â† Reusable UI components
â”‚       â”œâ”€â”€ services/api.ts        â† Backend communication
â”‚       â”œâ”€â”€ store/useAppStore.ts   â† Zustand state management
â”‚       â””â”€â”€ types/index.ts         â† TypeScript definitions
â”‚
â”œâ”€â”€ ðŸ—„ï¸  data/
â”‚   â”œâ”€â”€ index/                     â† Pre-built FAISS index
â”‚   â””â”€â”€ processed/                 â† BIS standards JSON database
â”‚
â”œâ”€â”€ ðŸ src/                        â† Python modules for inference
â”‚   â”œâ”€â”€ rag_pipeline.py            â† Pipeline for inference.py
â”‚   â”œâ”€â”€ retriever.py               â† Search logic
â”‚   â””â”€â”€ utils.py                   â† BIS AI Expansion
â”‚
â”œâ”€â”€ ðŸ“‹ inference.py                â† ðŸ† JUDGES RUN THIS
â”œâ”€â”€ ðŸ“Š eval_script.py              â† Calculates Hit Rate, MRR
â”œâ”€â”€ ðŸ“¦ requirements.txt            â† Python dependencies
â”œâ”€â”€ âš™ï¸  setup.py                    â† One-click index builder
â””â”€â”€ ðŸ”‘ .env.example                â† API key template
```

---

## ðŸš€ How to Run

### Prerequisites
- Python 3.10 or newer
- Node.js 18 or newer
- A free Google Gemini API key

---

### Step 1 â€” Clone the Repository

```bash
git clone https://github.com/Alvin20082003/bis-antigravity-ai.git
cd bis-antigravity-ai
```

---

### Step 2 â€” Install Python Dependencies

```bash
pip install -r requirements.txt
```

---

### Step 3 â€” Set Up Your API Key

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

> ðŸ”‘ Get a **free** key at: https://aistudio.google.com/app/apikey

---

### Step 4 â€” Build the AI Search Index

> Only needed once. Takes about 1 minute.

```bash
python setup.py
```

---

### Step 5 â€” Start the Backend

```bash
python backend/api.py
```

âœ… API running at: http://localhost:8000
ðŸ“– API docs at: http://localhost:8000/docs

---

### Step 6 â€” Start the Frontend

Open a **new terminal**:

```bash
cd modern-frontend
npm install
npm run dev
```

âœ… App running at: **http://localhost:5173**

---

## ðŸ† For Judges â€” Evaluation

```bash
# Run inference on test dataset
python inference.py --input hidden_private_dataset.json --output team_results.json

# Calculate scores
python eval_script.py --results team_results.json --ground_truth ground_truth.json
```

---

## ðŸ“Š Evaluation Results

<div align="center">

| Metric | Target | **Our Score** | Status |
|--------|--------|---------------|--------|
| Hit Rate @3 | > 80% | **87%** | âœ… PASS |
| MRR @5 | > 0.70 | **0.74** | âœ… PASS |
| Avg Latency | < 5.0s | **~1.9s** | âœ… PASS |

</div>

---

## ðŸŒŸ Features

<div align="center">

![Features Grid](docs/screenshots/features-grid.svg)

</div>

### Core Features
| Feature | Description |
|---------|-------------|
| ðŸ” Smart Search | Type any product description, get top BIS standards instantly |
| ðŸ¤– AI Rationale | Gemini 2.5 Flash explains WHY each standard applies to your product |
| ðŸš€ BIS AI Expansion | Automatically enriches queries with 100+ BIS domain terms |
| âš¡ Hybrid Retrieval | FAISS semantic (70%) + BM25 keyword (30%) fusion |

### Advanced Features (click "Advanced Mode")
| Feature | Description |
|---------|-------------|
| ðŸ”¬ Gap Analysis | Shows covered vs missing standards with risk level (LOW/MEDIUM/HIGH) |
| âœ… Smart Checklist | Interactive compliance checklist per standard (e.g., "Test 28-day strength â‰¥ 53 MPa") |
| ðŸŽ›ï¸ What-If Simulator | Change location (coastal/seismic/urban) and industry to update recommendations |
| ðŸ“„ Download Report | Full compliance report with standards, gap analysis, and checklists |

### All 10 Pages
| Page | Purpose |
|------|---------|
| ðŸ  Home | Main search + results + advanced analysis |
| ðŸ” New Search | Clean search with top-k and LLM controls |
| ðŸ“œ History | All past searches, click to re-run |
| â¤ï¸ Favorites | Saved standards grouped by category |
| ðŸ“Š Analytics | Charts: query count, latency, category distribution |
| ðŸ“š Standards Library | Browse all 30+ standards with full detail panel |
| ðŸ›¡ï¸ Compliance Check | Generate compliance report for any product |
| âš–ï¸ Compare | Side-by-side comparison of up to 4 standards |
| âš™ï¸ Settings | Configure API URL, AI features, data |
| â“ Help | FAQ, architecture guide, quick start |

---

## ðŸ› ï¸ Tech Stack

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

## ðŸ’¼ Business Opportunity

<div align="center">

![Business Model](docs/screenshots/business-model.svg)

</div>

### The Market Problem

> India has **63 million MSMEs**. Every product manufacturer must comply with BIS standards before selling. Currently, compliance consulting costs **â‚¹50,000â€“â‚¹5,00,000 per product** and takes **4â€“12 weeks**.

### How This Becomes a Business

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                   MONETIZATION ROADMAP                       â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                                              â”‚
â”‚  PHASE 1 â€” FREEMIUM SaaS (Month 1â€“6)                       â”‚
â”‚  â”œâ”€â”€ Free: 10 searches/month                                â”‚
â”‚  â”œâ”€â”€ Starter â‚¹999/month: 100 searches + reports            â”‚
â”‚  â””â”€â”€ Pro â‚¹4,999/month: Unlimited + API access              â”‚
â”‚                                                              â”‚
â”‚  PHASE 2 â€” B2B ENTERPRISE (Month 6â€“18)                     â”‚
â”‚  â”œâ”€â”€ White-label for BIS consultants                        â”‚
â”‚  â”œâ”€â”€ Integration with ERP systems (SAP, Tally)             â”‚
â”‚  â””â”€â”€ â‚¹50,000â€“â‚¹2,00,000/year per enterprise                â”‚
â”‚                                                              â”‚
â”‚  PHASE 3 â€” PLATFORM PLAY (Month 18â€“36)                     â”‚
â”‚  â”œâ”€â”€ Marketplace: connect MSMEs with BIS labs              â”‚
â”‚  â”œâ”€â”€ Auto-generate BIS application documents               â”‚
â”‚  â”œâ”€â”€ Track certification status                             â”‚
â”‚  â””â”€â”€ Commission: 5â€“10% on lab bookings                     â”‚
â”‚                                                              â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Revenue Projections

| Year | Users | Revenue Model | Projected ARR |
|------|-------|---------------|---------------|
| Year 1 | 500 MSMEs | Freemium SaaS | â‚¹25 Lakhs |
| Year 2 | 5,000 MSMEs | SaaS + Enterprise | â‚¹2.5 Crores |
| Year 3 | 50,000 MSMEs | Platform + API | â‚¹25 Crores |

### Why We Win the Market

```
ðŸŽ¯ UNFAIR ADVANTAGES
â”œâ”€â”€ 1. First-mover: No AI-powered BIS compliance tool exists today
â”œâ”€â”€ 2. Data moat: Proprietary BIS standards database + embeddings
â”œâ”€â”€ 3. Network effect: More users â†’ better query data â†’ better AI
â”œâ”€â”€ 4. Switching cost: History, favorites, reports stored in platform
â””â”€â”€ 5. Government alignment: BIS is pushing digital compliance
```

### Target Customers

| Segment | Size | Pain | Willingness to Pay |
|---------|------|------|-------------------|
| Cement manufacturers | 3,000+ | High | â‚¹5,000â€“50,000/yr |
| Steel fabricators | 15,000+ | High | â‚¹3,000â€“30,000/yr |
| Construction firms | 50,000+ | Medium | â‚¹1,000â€“10,000/yr |
| BIS consultants | 2,000+ | Low | â‚¹20,000â€“2,00,000/yr |
| Testing labs | 500+ | Medium | â‚¹50,000â€“5,00,000/yr |

### Expansion Roadmap

```
TODAY                    6 MONTHS                 2 YEARS
Building Materials  â†’   All BIS categories   â†’   Global standards
(30 standards)          (1,248+ standards)        (ISO, ASTM, EN)

India only          â†’   India + SAARC        â†’   Global MSMEs
```

---

## ðŸ”§ Troubleshooting

| Problem | Solution |
|---------|----------|
| "API Offline" in app | Run `python backend/api.py` in a terminal |
| "Index not ready" error | Run `python setup.py` first |
| White screen in browser | Run `npm install` inside `modern-frontend/` |
| Gemini not working | Check `.env` has valid `GEMINI_API_KEY` |
| Port already in use | Backend=8000, Frontend=5173. Close conflicting apps |
| Slow first query | Normal â€” model loads on first request (~6s), then ~1.9s |

---

## ðŸ‘¥ Team

<div align="center">

### ðŸ† Team Tech_Bridgers

*BIS Ã— Sigma Squad AI Hackathon 2026*

**Accelerating MSE Compliance with AI**

</div>

---

## ðŸ“œ License

MIT License â€” Built for BIS Ã— Sigma Squad AI Hackathon 2026.

BIS standard data sourced from Bureau of Indian Standards public documents (SP 21).

---

<div align="center">

**â­ Star this repo if it helped you!**

Made with â¤ï¸ by Team Tech_Bridgers

</div>

