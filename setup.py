# -*- coding: utf-8 -*-
import sys, io
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
"""
BIS Standard Discovery Engine - One-click setup script
Run this ONCE to: ingest data → build embeddings → save FAISS index
"""

import sys
import os
from pathlib import Path

# Add backend to path
BACKEND_DIR = Path(__file__).parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))


def setup():
    print("\n" + "="*60)
    print("  BIS Standard Discovery Engine - Setup")
    print("="*60)

    print("\n[1/2] Ingesting BIS standards data...")
    from ingest import ingest_pipeline
    records = ingest_pipeline()
    print(f"      [OK] {len(records)} standards ready")

    print("\n[2/2] Building embedding index (FAISS)...")
    from embed import build_and_save
    build_and_save()
    print("      [OK] FAISS index saved")

    print("\n" + "="*60)
    print("  Setup complete! Start the server with:")
    print("     python backend/api.py")
    print("     Then open: http://localhost:8000")
    print("="*60 + "\n")


if __name__ == "__main__":
    setup()
