"""
BIS Standard Discovery Engine - Evaluation Script
Computes Hit Rate @3, MRR @5, and latency metrics
"""

import json
import time
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from pipeline import run_pipeline

# ── Evaluation dataset ─────────────────────────────────────────────────
# Format: {"query": "...", "relevant_standards": ["IS XXX:YYYY", ...]}
EVAL_QUERIES = [
    {
        "query": "Ordinary Portland Cement 53 grade for high rise buildings",
        "relevant_standards": ["IS 12269:2013", "IS 269:2015"]
    },
    {
        "query": "TMT reinforcement bars Fe500 for RCC structure",
        "relevant_standards": ["IS 1786:2008"]
    },
    {
        "query": "Ready mix concrete M30 grade mix design",
        "relevant_standards": ["IS 10262:2019", "IS 456:2000"]
    },
    {
        "query": "Coarse aggregate crushed stone for concrete production",
        "relevant_standards": ["IS 383:2016", "IS 2386-1:2016"]
    },
    {
        "query": "Portland Pozzolana Cement fly ash blended for masonry",
        "relevant_standards": ["IS 1489-1:2015"]
    },
    {
        "query": "Structural steel plates and sections for industrial shed",
        "relevant_standards": ["IS 2062:2011", "IS 800:2007"]
    },
    {
        "query": "Plasticizer admixture for high workability concrete",
        "relevant_standards": ["IS 9103:1999"]
    },
    {
        "query": "Sand for wall plastering internal finish",
        "relevant_standards": ["IS 1542:1992"]
    },
    {
        "query": "Portland Slag Cement for marine coastal construction",
        "relevant_standards": ["IS 455:2015"]
    },
    {
        "query": "Prestressed concrete beam for bridge construction",
        "relevant_standards": ["IS 1343:2012", "IS 14268:1995"]
    },
    {
        "query": "Seismic earthquake resistant reinforced concrete building",
        "relevant_standards": ["IS 13920:2016", "IS 456:2000"]
    },
    {
        "query": "Water for concrete mixing quality testing",
        "relevant_standards": ["IS 3025-1:2000"]
    },
    {
        "query": "High alumina cement refractory high temperature application",
        "relevant_standards": ["IS 6452:1989"]
    },
    {
        "query": "Aggregate impact value crushing strength test",
        "relevant_standards": ["IS 2386-4:2016"]
    },
    {
        "query": "Cement mortar for brick masonry construction",
        "relevant_standards": ["IS 2250:1981", "IS 1489-1:2015"]
    },
]


def hit_rate_at_k(results: list[dict], relevant: list[str], k: int) -> float:
    """1 if any relevant standard is in top-k results, else 0."""
    top_k_nos = {r["standard_no"] for r in results[:k]}
    return 1.0 if any(std in top_k_nos for std in relevant) else 0.0


def reciprocal_rank(results: list[dict], relevant: list[str]) -> float:
    """Reciprocal rank of the first relevant result."""
    for i, r in enumerate(results):
        if r["standard_no"] in relevant:
            return 1.0 / (i + 1)
    return 0.0


def evaluate(top_k_retrieve: int = 5) -> dict:
    """Run evaluation across all queries."""
    print(f"\n{'='*65}")
    print(f"📊 BIS RAG Evaluation — {len(EVAL_QUERIES)} queries, top_k={top_k_retrieve}")
    print(f"{'='*65}\n")

    hr_at_1_scores = []
    hr_at_3_scores = []
    hr_at_5_scores = []
    mrr_scores = []
    latencies = []

    for i, eval_item in enumerate(EVAL_QUERIES):
        query = eval_item["query"]
        relevant = eval_item["relevant_standards"]

        output = run_pipeline(
            query=query,
            top_k=top_k_retrieve,
            generate_llm_rationale=False,  # Skip LLM for eval speed
        )
        results = output["results"]
        latency = output["retrieval_latency_ms"]
        latencies.append(latency)

        hr1 = hit_rate_at_k(results, relevant, 1)
        hr3 = hit_rate_at_k(results, relevant, 3)
        hr5 = hit_rate_at_k(results, relevant, 5)
        rr  = reciprocal_rank(results, relevant)

        hr_at_1_scores.append(hr1)
        hr_at_3_scores.append(hr3)
        hr_at_5_scores.append(hr5)
        mrr_scores.append(rr)

        status = "✅" if hr3 else "❌"
        print(f"  {status} Q{i+1:02d}: HR@3={hr3:.0f} | RR={rr:.3f} | {latency:.0f}ms")
        print(f"       Query: {query[:60]}...")
        if not hr3:
            top_result = results[0]["standard_no"] if results else "N/A"
            print(f"       Expected: {relevant} | Got: {top_result}")

    print(f"\n{'='*65}")
    print(f"📈 RESULTS SUMMARY")
    print(f"{'='*65}")
    print(f"  Hit Rate @1  : {sum(hr_at_1_scores)/len(hr_at_1_scores):.3f}")
    print(f"  Hit Rate @3  : {sum(hr_at_3_scores)/len(hr_at_3_scores):.3f}")
    print(f"  Hit Rate @5  : {sum(hr_at_5_scores)/len(hr_at_5_scores):.3f}")
    print(f"  MRR @5       : {sum(mrr_scores)/len(mrr_scores):.3f}")
    print(f"  Avg Latency  : {sum(latencies)/len(latencies):.1f}ms")
    print(f"  P95 Latency  : {sorted(latencies)[int(len(latencies)*0.95)]:.1f}ms")
    print(f"{'='*65}\n")

    return {
        "hit_rate_at_1": round(sum(hr_at_1_scores)/len(hr_at_1_scores), 3),
        "hit_rate_at_3": round(sum(hr_at_3_scores)/len(hr_at_3_scores), 3),
        "hit_rate_at_5": round(sum(hr_at_5_scores)/len(hr_at_5_scores), 3),
        "mrr_at_5": round(sum(mrr_scores)/len(mrr_scores), 3),
        "avg_latency_ms": round(sum(latencies)/len(latencies), 1),
        "num_queries": len(EVAL_QUERIES),
    }


if __name__ == "__main__":
    metrics = evaluate()
    print(json.dumps(metrics, indent=2))
