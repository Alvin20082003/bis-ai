"""
BIS Standard Discovery Engine - Hybrid Retriever
Combines FAISS dense retrieval + BM25 keyword retrieval (fusion scoring)
"""

import numpy as np
import time
from sentence_transformers import SentenceTransformer
from rank_bm25 import BM25Okapi
from embed import load_index

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# Module-level singletons (loaded once)
_model = None
_index = None
_metadata = None
_bm25 = None
_bm25_corpus = None


def _get_resources():
    """Lazy-load and cache model, index, and BM25."""
    global _model, _index, _metadata, _bm25, _bm25_corpus

    if _model is None:
        print("🔄 Loading embedding model...")
        _model = SentenceTransformer(MODEL_NAME)

    if _index is None:
        print("🔄 Loading FAISS index...")
        _index, _metadata = load_index()
        _build_bm25()

    return _model, _index, _metadata, _bm25


def _build_bm25():
    """Build BM25 index from metadata."""
    global _bm25, _bm25_corpus
    corpus = []
    for m in _metadata:
        tokens = (
            m["title"] + " " +
            m["scope"] + " " +
            " ".join(m.get("keywords", [])) + " " +
            " ".join(m.get("applicable_products", []))
        ).lower().split()
        corpus.append(tokens)
    _bm25_corpus = corpus
    _bm25 = BM25Okapi(corpus)
    print(f"✅ BM25 index built with {len(corpus)} documents")


def retrieve(
    query: str,
    top_k: int = 5,
    dense_weight: float = 0.7,
    bm25_weight: float = 0.3,
) -> list[dict]:
    """
    Hybrid retrieval: FAISS dense + BM25 sparse.
    Returns top_k results with combined scores.
    """
    model, index, metadata, bm25 = _get_resources()
    n_docs = len(metadata)
    start_time = time.time()

    # --- Dense retrieval ---
    query_embedding = model.encode(
        [query], normalize_embeddings=True, convert_to_numpy=True
    ).astype(np.float32)

    dense_k = min(n_docs, max(top_k * 3, 15))
    dense_scores_raw, dense_indices = index.search(query_embedding, dense_k)
    dense_scores_raw = dense_scores_raw[0]
    dense_indices = dense_indices[0]

    # Normalize dense scores to [0, 1]
    d_min, d_max = dense_scores_raw.min(), dense_scores_raw.max()
    dense_scores_norm = (dense_scores_raw - d_min) / (d_max - d_min + 1e-9)

    dense_score_map = {}
    for idx, score in zip(dense_indices, dense_scores_norm):
        dense_score_map[int(idx)] = float(score)

    # --- BM25 retrieval ---
    query_tokens = query.lower().split()
    bm25_scores_raw = bm25.get_scores(query_tokens)

    b_max = bm25_scores_raw.max()
    bm25_scores_norm = bm25_scores_raw / (b_max + 1e-9)

    # --- Hybrid fusion ---
    combined = {}
    for i in range(n_docs):
        d_score = dense_score_map.get(i, 0.0)
        b_score = float(bm25_scores_norm[i])
        combined[i] = dense_weight * d_score + bm25_weight * b_score

    # Sort and take top_k
    sorted_indices = sorted(combined.keys(), key=lambda x: combined[x], reverse=True)[:top_k]

    latency_ms = (time.time() - start_time) * 1000

    results = []
    for rank, idx in enumerate(sorted_indices):
        m = metadata[idx]
        results.append({
            "rank": rank + 1,
            "standard_no": m["standard_no"],
            "title": m["title"],
            "category": m["category"],
            "scope": m["scope"],
            "keywords": m.get("keywords", []),
            "applicable_products": m.get("applicable_products", []),
            "confidence_score": round(combined[idx] * 100, 1),
            "dense_score": round(dense_score_map.get(idx, 0.0), 4),
            "bm25_score": round(float(bm25_scores_norm[idx]), 4),
        })

    return results, round(latency_ms, 1)


if __name__ == "__main__":
    query = "OPC cement for residential building construction"
    results, latency = retrieve(query, top_k=5)
    print(f"\n🔍 Query: '{query}' | Latency: {latency}ms\n")
    for r in results:
        print(f"  #{r['rank']} [{r['confidence_score']}%] {r['standard_no']} — {r['title']}")
