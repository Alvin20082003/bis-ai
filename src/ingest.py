# -*- coding: utf-8 -*-
import sys, io
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
"""
BIS Standard Discovery Engine - Data Ingestion Pipeline
Handles CSV/JSON input from hackathon dataset + seed data
"""

import json
import csv
import os
import re
import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"

SEED_FILE = PROCESSED_DIR / "bis_standards_seed.json"
OUTPUT_FILE = PROCESSED_DIR / "bis_standards_final.json"


def clean_text(text: str) -> str:
    """Normalize whitespace and remove special characters."""
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', str(text).strip())
    return text


def load_seed_data() -> list[dict]:
    """Load the curated seed dataset."""
    with open(SEED_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"[OK] Loaded {len(data)} records from seed dataset")
    return data


def load_from_csv(csv_path: str) -> list[dict]:
    """
    Load BIS standards from a CSV file (hackathon dataset format).
    Expected columns: standard_no, title, category, scope, keywords (comma-separated)
    Flexible enough to handle variations.
    """
    records = []
    df = pd.read_csv(csv_path, encoding="utf-8", on_bad_lines="skip")
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

    # Map common column name variants
    col_map = {
        "standard_number": "standard_no",
        "standard": "standard_no",
        "is_number": "standard_no",
        "is_no": "standard_no",
        "name": "title",
        "description": "scope",
        "tags": "keywords",
    }
    df.rename(columns=col_map, inplace=True)

    required = ["standard_no", "title"]
    for col in required:
        if col not in df.columns:
            raise ValueError(f"Missing required column: {col}")

    for _, row in df.iterrows():
        record = {
            "standard_no": clean_text(row.get("standard_no", "")),
            "title": clean_text(row.get("title", "")),
            "category": clean_text(row.get("category", "Building Materials")),
            "scope": clean_text(row.get("scope", row.get("description", ""))),
            "keywords": [],
            "applicable_products": [],
        }

        # Parse keywords
        kw_raw = row.get("keywords", row.get("tags", ""))
        if pd.notna(kw_raw) and kw_raw:
            record["keywords"] = [k.strip() for k in str(kw_raw).split(",") if k.strip()]

        records.append(record)

    print(f"[OK] Loaded {len(records)} records from CSV: {csv_path}")
    return records


def create_text_representation(record: dict) -> str:
    """
    Create a single rich text string for embedding.
    Combines all fields with appropriate weighting via repetition.
    """
    parts = [
        f"Standard Number: {record['standard_no']}",
        f"Title: {record['title']}",
        f"Category: {record['category']}",
        f"Scope: {record['scope']}",
        f"Keywords: {', '.join(record.get('keywords', []))}",
        f"Applicable Products: {', '.join(record.get('applicable_products', []))}",
    ]
    return " | ".join(parts)


def ingest_pipeline() -> list[dict]:
    """
    Full ingestion pipeline:
    1. Load seed data
    2. Merge any CSVs found in data/raw/
    3. Deduplicate by standard_no
    4. Add text_for_embedding field
    5. Save to processed/bis_standards_final.json
    """
    all_records = load_seed_data()

    # Check for any CSV files in raw dir
    csv_files = list(RAW_DIR.glob("*.csv"))
    for csv_file in csv_files:
        try:
            csv_records = load_from_csv(str(csv_file))
            all_records.extend(csv_records)
        except Exception as e:
            print(f"[WARN] Could not load {csv_file.name}: {e}")

    # Deduplicate by standard_no (prefer CSV over seed if duplicate)
    seen = {}
    for record in all_records:
        key = record["standard_no"].strip().upper()
        seen[key] = record  # later entries overwrite earlier ones

    final_records = list(seen.values())

    # Add rich text representation for embedding
    for record in final_records:
        record["text_for_embedding"] = create_text_representation(record)

    # Save
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(final_records, f, indent=2, ensure_ascii=False)

    print(f"\n[OK] Ingestion complete: {len(final_records)} standards saved to {OUTPUT_FILE}")
    return final_records


if __name__ == "__main__":
    records = ingest_pipeline()
    print(f"\nCategories: {set(r['category'] for r in records)}")
    print(f"Sample: {records[0]['standard_no']} - {records[0]['title']}")
