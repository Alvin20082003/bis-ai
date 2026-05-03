# -*- coding: utf-8 -*-
"""
eval_script.py — Evaluation Script
===================================
Computes Hit Rate @3, MRR @5, and Avg Latency from team results.

Usage:
    python eval_script.py --results team_results.json --ground_truth public_test_answers.json

Input formats:
  results JSON:       [{"id": "q1", "retrieved_standards": ["IS X", ...], "latency_seconds": 0.9}]
  ground_truth JSON:  [{"id": "q1", "relevant_standards": ["IS X", ...]}]
"""

import json
import argparse
import sys


def hit_rate_at_k(retrieved: list, relevant: list, k: int) -> float:
    top_k = set(retrieved[:k])
    return 1.0 if any(s in top_k for s in relevant) else 0.0


def reciprocal_rank(retrieved: list, relevant: list) -> float:
    for i, s in enumerate(retrieved):
        if s in relevant:
            return 1.0 / (i + 1)
    return 0.0


def evaluate(results_path: str, ground_truth_path: str) -> dict:
    with open(results_path, "r", encoding="utf-8") as f:
        results = json.load(f)

    with open(ground_truth_path, "r", encoding="utf-8") as f:
        ground_truth = json.load(f)

    gt_map = {item["id"]: item["relevant_standards"] for item in ground_truth}

    hr3_scores, mrr_scores, latencies = [], [], []
    missing = 0

    for r in results:
        qid = r["id"]
        retrieved = r.get("retrieved_standards", [])
        latency = r.get("latency_seconds", 0.0)

        if qid not in gt_map:
            missing += 1
            continue

        relevant = gt_map[qid]
        hr3_scores.append(hit_rate_at_k(retrieved, relevant, 3))
        mrr_scores.append(reciprocal_rank(retrieved, relevant))
        latencies.append(latency)

    n = len(hr3_scores)
    if n == 0:
        print("[ERROR] No matching query IDs found between results and ground truth.")
        sys.exit(1)

    metrics = {
        "num_queries_evaluated": n,
        "missing_ids": missing,
        "hit_rate_at_3": round(sum(hr3_scores) / n, 4),
        "mrr_at_5": round(sum(mrr_scores) / n, 4),
        "avg_latency_seconds": round(sum(latencies) / n, 4),
        "targets": {
            "hit_rate_at_3_target": ">0.80",
            "mrr_at_5_target": ">0.70",
            "avg_latency_target": "<5.0s",
        },
        "pass": {
            "hit_rate_at_3": sum(hr3_scores) / n > 0.80,
            "mrr_at_5": sum(mrr_scores) / n > 0.70,
            "avg_latency": sum(latencies) / n < 5.0,
        }
    }

    print("\n" + "="*55)
    print("  BIS RAG Evaluation Results")
    print("="*55)
    print(f"  Queries evaluated : {n}")
    print(f"  Hit Rate @3       : {metrics['hit_rate_at_3']:.4f}  (target >0.80)  {'PASS' if metrics['pass']['hit_rate_at_3'] else 'FAIL'}")
    print(f"  MRR @5            : {metrics['mrr_at_5']:.4f}  (target >0.70)  {'PASS' if metrics['pass']['mrr_at_5'] else 'FAIL'}")
    print(f"  Avg Latency       : {metrics['avg_latency_seconds']:.4f}s (target <5.0s) {'PASS' if metrics['pass']['avg_latency'] else 'FAIL'}")
    print("="*55 + "\n")

    return metrics


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="BIS RAG Evaluation Script")
    parser.add_argument("--results",      required=True, help="Path to team_results.json")
    parser.add_argument("--ground_truth", required=True, help="Path to ground truth JSON")
    parser.add_argument("--output",       default=None,  help="Optional: save metrics JSON")
    args = parser.parse_args()

    metrics = evaluate(args.results, args.ground_truth)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(metrics, f, indent=2)
        print(f"[OK] Metrics saved to {args.output}")
