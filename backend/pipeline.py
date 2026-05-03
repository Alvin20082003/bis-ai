"""
BIS Standard Discovery Engine - End-to-End RAG Pipeline
Orchestrates: Antigravity Expansion → retrieve → generate rationale → structure response
"""

import time
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from retriever import retrieve
from generator import generate_rationale
from antigravity import expand_query


def run_pipeline(
    query: str,
    top_k: int = 5,
    dense_weight: float = 0.7,
    bm25_weight: float = 0.3,
    generate_llm_rationale: bool = True,
    use_antigravity: bool = True,
) -> dict:
    """
    Full RAG pipeline for BIS standard discovery.

    Args:
        query: Product description from user
        top_k: Number of standards to return (3–5 recommended)
        dense_weight: Weight for semantic (FAISS) scores
        bm25_weight: Weight for keyword (BM25) scores
        generate_llm_rationale: Whether to call Gemini for rationales
        use_antigravity: Enable Antigravity query expansion (recommended: True)

    Returns:
        dict with 'query', 'expanded_query', 'results', 'latency_ms', 'retrieval_latency_ms'
    """
    total_start = time.time()

    # Step 1: 🚀 Antigravity Query Expansion
    expanded_query = query
    matched_terms: list[str] = []
    if use_antigravity:
        expansion = expand_query(query)
        expanded_query = expansion["expanded_query"]
        matched_terms = expansion["matched_terms"]
        print(f"🚀 [Antigravity] Expanded '{query[:60]}' → {len(expansion['expansion_count'])} tokens added"  # type: ignore
              if False else
              f"🚀 [Antigravity] Terms matched: {matched_terms} | +{expansion['expansion_count']} tokens")

    # Step 2: Hybrid Retrieval (on expanded query)
    results, retrieval_latency_ms = retrieve(
        query=expanded_query,
        top_k=top_k,
        dense_weight=dense_weight,
        bm25_weight=bm25_weight,
    )

    # Step 3: LLM Rationale Generation (uses original query for clean context)
    if generate_llm_rationale and results:
        results = generate_rationale(query, results)
    else:
        for r in results:
            r["rationale"] = r.get("rationale", "")

    total_latency_ms = round((time.time() - total_start) * 1000, 1)

    return {
        "query": query,
        "expanded_query": expanded_query,
        "matched_terms": matched_terms,
        "total_results": len(results),
        "results": results,
        "latency_ms": total_latency_ms,
        "retrieval_latency_ms": retrieval_latency_ms,
        "llm_rationale_generated": generate_llm_rationale,
        "antigravity_active": use_antigravity,
    }


def format_results_cli(pipeline_output: dict) -> str:
    """Format pipeline output for CLI display."""
    lines = [
        f"\n{'='*70}",
        f"🔍 Query: {pipeline_output['query']}",
        f"⏱️  Total Latency: {pipeline_output['latency_ms']}ms  |  "
        f"Retrieval: {pipeline_output['retrieval_latency_ms']}ms",
        f"📋 Found {pipeline_output['total_results']} applicable standards:",
        f"{'='*70}",
    ]

    for r in pipeline_output["results"]:
        lines.append(f"\n#{r['rank']}  [{r['confidence_score']}% match]")
        lines.append(f"     📌 {r['standard_no']} — {r['title']}")
        lines.append(f"     🏷️  Category: {r['category']}")
        if r.get("rationale"):
            lines.append(f"     💬 Rationale: {r['rationale']}")
        lines.append(f"     📖 Scope (excerpt): {r['scope'][:150]}...")

    lines.append(f"\n{'='*70}")
    return "\n".join(lines)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="BIS Standard Discovery Engine")
    parser.add_argument("query", nargs="?",
                        default="OPC 53 grade cement for high rise residential building",
                        help="Product description to find applicable BIS standards for")
    parser.add_argument("--top-k", type=int, default=5)
    parser.add_argument("--no-llm", action="store_true",
                        help="Skip LLM rationale generation")
    args = parser.parse_args()

    output = run_pipeline(
        query=args.query,
        top_k=args.top_k,
        generate_llm_rationale=not args.no_llm,
    )
    print(format_results_cli(output))
