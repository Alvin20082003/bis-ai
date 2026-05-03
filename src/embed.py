# -*- coding: utf-8 -*-
import sys, io
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
"""
BIS Standard Discovery Engine - Embedding & FAISS Index Builder
Uses sentence-transformers for dense embeddings + saves FAISS index
"""

import json
import numpy as np
import faiss
import pickle
from pathlib import Path
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

DATA_DIR = Path(__file__).parent.parent / "data"
PROCESSED_DIR = DATA_DIR / "processed"
INDEX_DIR = DATA_DIR / "index"

STANDARDS_FILE = PROCESSED_DIR / "bis_standards_final.json"
FAISS_INDEX_FILE = INDEX_DIR / "bis_faiss.index"
METADATA_FILE = INDEX_DIR / "bis_metadata.pkl"

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
EMBEDDING_DIM = 384


def load_standards() -> list[dict]:
    with open(STANDARDS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def build_index(records: list[dict]) -> tuple:
    """
    Build FAISS index from BIS standards.
    Returns (index, embeddings, metadata_list)
    """
    print(f"[..] Loading embedding model: {MODEL_NAME}")
    model = SentenceTransformer(MODEL_NAME)

    texts = [r["text_for_embedding"] for r in records]

    print(f"[..] Embedding {len(texts)} standards...")
    embeddings = model.encode(
        texts,
        batch_size=32,
        show_progress_bar=True,
        normalize_embeddings=True,  # L2 normalize for cosine similarity
        convert_to_numpy=True,
    )

    # FAISS Inner Product index (equivalent to cosine similarity after normalization)
    index = faiss.IndexFlatIP(EMBEDDING_DIM)
    index.add(embeddings.astype(np.float32))

    print(f"[OK] FAISS index built with {index.ntotal} vectors (dim={EMBEDDING_DIM})")
    return index, embeddings, records


def save_index(index, records: list[dict]):
    """Persist FAISS index and metadata to disk."""
    INDEX_DIR.mkdir(parents=True, exist_ok=True)

    faiss.write_index(index, str(FAISS_INDEX_FILE))

    # Save metadata (all record fields except text_for_embedding for cleanliness)
    metadata = [
        {
            "standard_no": r["standard_no"],
            "title": r["title"],
            "category": r["category"],
            "scope": r["scope"],
            "keywords": r.get("keywords", []),
            "applicable_products": r.get("applicable_products", []),
        }
        for r in records
    ]
    with open(METADATA_FILE, "wb") as f:
        pickle.dump(metadata, f)

    print(f"[OK] Index saved to {FAISS_INDEX_FILE}")
    print(f"[OK] Metadata saved to {METADATA_FILE}")


def load_index():
    """Load FAISS index and metadata from disk."""
    if not FAISS_INDEX_FILE.exists():
        raise FileNotFoundError(
            f"FAISS index not found at {FAISS_INDEX_FILE}. Run embed.py first."
        )
    index = faiss.read_index(str(FAISS_INDEX_FILE))
    with open(METADATA_FILE, "rb") as f:
        metadata = pickle.load(f)
    return index, metadata


def build_and_save():
    """Full pipeline: load standards → embed → save index."""
    records = load_standards()
    index, embeddings, records = build_index(records)
    save_index(index, records)
    return index, records


if __name__ == "__main__":
    build_and_save()
    print("\n[DONE] Embedding pipeline complete! Ready for retrieval.")
