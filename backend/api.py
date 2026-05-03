"""
BIS Standard Discovery Engine - FastAPI Backend
Provides REST API endpoints for the frontend
"""

import sys
import os
import time

sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import Optional, List
from pathlib import Path

from pipeline import run_pipeline
from ingest import ingest_pipeline
from embed import build_and_save
from advanced import (
    generate_checklist, compute_gap_analysis,
    apply_whatif, compute_overall_risk, INDUSTRY_CONTEXT, LOCATION_MODIFIERS,
)

# ── App ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="BIS Standard Discovery Engine",
    description="AI-powered RAG system to find applicable BIS standards for building materials",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve modern React frontend
FRONTEND_DIR = Path(__file__).parent.parent / "modern-frontend" / "dist"
if FRONTEND_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIR / "assets")), name="assets")

# CORS for dev server
ALLOWED_ORIGINS = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "*"]


# ── Schemas ────────────────────────────────────────────────────────────
class RecommendRequest(BaseModel):
    query: str = Field(
        ...,
        min_length=5,
        max_length=500,
        example="TMT Fe500 steel bars for reinforced concrete columns",
    )
    top_k: int = Field(default=5, ge=1, le=10)
    use_llm: bool = Field(default=True, description="Enable Gemini rationale generation")


class StandardResult(BaseModel):
    rank: int
    standard_no: str
    title: str
    category: str
    scope: str
    keywords: list[str]
    applicable_products: list[str]
    confidence_score: float
    dense_score: float
    bm25_score: float
    rationale: Optional[str] = None


class RecommendResponse(BaseModel):
    query: str
    expanded_query: str
    matched_terms: list[str]
    total_results: int
    results: list[StandardResult]
    latency_ms: float
    retrieval_latency_ms: float
    llm_rationale_generated: bool
    antigravity_active: bool


# ── Routes ─────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    """Serve the frontend."""
    index_path = FRONTEND_DIR / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return {"message": "BIS Standard Discovery Engine API", "docs": "/docs"}


@app.get("/health")
async def health():
    """Health check endpoint."""
    from embed import FAISS_INDEX_FILE
    return {
        "status": "healthy",
        "index_ready": FAISS_INDEX_FILE.exists(),
        "timestamp": time.time(),
    }


class AnalyzeRequest(BaseModel):
    query: str = Field(..., min_length=5, max_length=500)
    top_k: int = Field(default=5, ge=1, le=10)
    use_llm: bool = Field(default=True)


@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    """Alias for /recommend — used by the React frontend."""
    rec_req = RecommendRequest(query=request.query, top_k=request.top_k, use_llm=request.use_llm)
    return await recommend(rec_req)


@app.post("/recommend", response_model=RecommendResponse)
async def recommend(request: RecommendRequest):
    """
    Main endpoint: accepts product description, returns top BIS standards.
    """
    try:
        output = run_pipeline(
            query=request.query,
            top_k=request.top_k,
            generate_llm_rationale=request.use_llm,
            use_antigravity=True,  # Default on for API
        )
        return RecommendResponse(**output)
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Index not ready. Please run the setup script first. Error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/admin/rebuild-index")
async def rebuild_index():
    """Rebuild the FAISS index from latest data (admin use)."""
    try:
        records = ingest_pipeline()
        build_and_save()
        return {"status": "success", "standards_indexed": len(records)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/standards/categories")
async def get_categories():
    """Return available standard categories."""
    import json
    from pathlib import Path
    standards_file = Path(__file__).parent.parent / "data" / "processed" / "bis_standards_final.json"
    if not standards_file.exists():
        return {"categories": ["Cement", "Steel", "Concrete", "Aggregates", "Building Materials"]}
    with open(standards_file) as f:
        data = json.load(f)
    categories = sorted(set(r["category"] for r in data))
    return {"categories": categories}


# ── Advanced Analysis Endpoint ─────────────────────────────────────────
class AdvancedRequest(BaseModel):
    query: str = Field(..., min_length=5, max_length=500)
    top_k: int = Field(default=5, ge=1, le=10)
    use_llm: bool = Field(default=True)
    industry: str = Field(default="construction")   # construction | manufacturing | infrastructure
    location: str = Field(default="urban")          # urban | coastal | rural | seismic
    material_modifier: str = Field(default="")


class GapItem(BaseModel):
    standard_no: str
    reason: str
    status: str  # "satisfied" | "missing"


class GapAnalysis(BaseModel):
    satisfied: List[GapItem]
    missing: List[GapItem]
    risk_level: str
    risk_score: int
    coverage_pct: int
    summary: str


class ChecklistItem(BaseModel):
    standard_no: str
    items: List[str]


class RiskSummary(BaseModel):
    level: str
    score: int
    avg_confidence: float
    coverage_pct: int
    action: str


class AdvancedResponse(BaseModel):
    query: str
    expanded_query: str
    matched_terms: List[str]
    total_results: int
    results: List[StandardResult]
    latency_ms: float
    retrieval_latency_ms: float
    llm_rationale_generated: bool
    antigravity_active: bool
    # New fields
    gap_analysis: GapAnalysis
    checklists: List[ChecklistItem]
    risk_summary: RiskSummary
    industry: str
    location: str
    whatif_query: str


@app.post("/analyze/advanced", response_model=AdvancedResponse)
async def analyze_advanced(request: AdvancedRequest):
    """
    Advanced analysis endpoint — returns standards + gap analysis + checklists + risk.
    """
    try:
        # Apply what-if modifiers to query
        whatif_q = apply_whatif(
            base_query=request.query,
            location=request.location,
            industry=request.industry,
            material_modifier=request.material_modifier,
        )

        # Run pipeline on modified query
        output = run_pipeline(
            query=whatif_q,
            top_k=request.top_k,
            generate_llm_rationale=request.use_llm,
            use_antigravity=True,
        )
        # Keep original query visible to user
        output["query"] = request.query

        results = output["results"]

        # Gap analysis
        gap = compute_gap_analysis(request.query, results)

        # Checklists per standard
        checklists = [
            {"standard_no": r["standard_no"], "items": generate_checklist(r["standard_no"], r["scope"])}
            for r in results
        ]

        # Risk summary
        risk = compute_overall_risk(results, gap)

        return AdvancedResponse(
            **output,
            gap_analysis=GapAnalysis(**gap),
            checklists=checklists,
            risk_summary=RiskSummary(**risk),
            industry=request.industry,
            location=request.location,
            whatif_query=whatif_q,
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=f"Index not ready: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
