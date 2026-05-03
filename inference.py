# -*- coding: utf-8 -*-
"""
inference.py — MANDATORY ENTRY POINT FOR JUDGES
================================================
Usage:
    python inference.py --input hidden_private_dataset.json --output team_results.json

Input JSON format:
    [{"id": "q1", "query": "product description here"}, ...]

Output JSON format (strict):
    [{"id": "q1", "retrieved_standards": ["IS 269:2015", ...], "latency_seconds": 0.87}, ...]
"""

import sys
import os
import json
import time
import argparse

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))


def run_inference(input_path: str, output_path: str):
    """
    Main inference function called by judges.
    Reads input JSON, runs RAG pipeline, writes output JSON.
    """
    # Load input
    with open(input_path, "r", encoding="utf-8") as f:
        queries = json.load(f)

    print(f"[INFO] Loaded {len(queries)} queries from {input_path}")

    # Import pipeline (lazy to allow index loading once)
    from rag_pipeline import run_pipeline

    results = []
    for item in queries:
        qid = item.get("id", item.get("query_id", str(len(results) + 1)))
        query = item["query"]

        start = time.time()
        try:
            output = run_pipeline(
                query=query,
                top_k=5,
                generate_llm_rationale=False,  # Off for speed during eval
                use_antigravity=True,          # Showcase the expansion!
            )
            retrieved = [r["standard_no"] for r in output["results"]]
            latency = round(time.time() - start, 4)
            expanded = output.get("expanded_query", "")
        except Exception as e:
            print(f"[WARN] Failed on query '{qid}': {e}")
            retrieved = []
            latency = round(time.time() - start, 4)
            expanded = ""

        results.append({
            "id": qid,
            "retrieved_standards": retrieved,
            "latency_seconds": latency,
            "antigravity_expanded_query": expanded  # Extra transparency for judges
        })
        print(f"  [{qid}] {latency:.3f}s => {retrieved[:3]}")

    # Write output
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    avg_latency = sum(r["latency_seconds"] for r in results) / max(len(results), 1)
    print(f"\n[DONE] {len(results)} results saved to {output_path}")
    print(f"[INFO] Avg latency: {avg_latency:.3f}s")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="BIS Standard Discovery — Inference Script")
    parser.add_argument("--input", required=True, help="Path to input JSON file with queries")
    parser.add_argument("--output", required=True, help="Path to write output JSON results")
    args = parser.parse_args()

    run_inference(args.input, args.output)
