"""
BIS Antigravity AI — Query Expansion Layer
===========================================
The "Antigravity" innovation: takes a simple user query and expands it
into a richer, semantically-dense query that dramatically improves
FAISS + BM25 retrieval hit-rate for BIS standards.

This is the project's key differentiator. A basic query like
"steel for buildings" becomes a precise technical query covering
all relevant BIS-specific terminology.
"""

import re
from typing import Optional

# ── Domain Vocabulary Maps ─────────────────────────────────────────────────────
# Maps common user terms → BIS/technical expansions
DOMAIN_EXPANSIONS: dict[str, list[str]] = {
    # Cement
    "cement": ["ordinary portland cement", "OPC", "PPC", "portland pozzolana",
                "compressive strength", "IS 269", "IS 8112", "IS 12269", "clinker",
                "setting time", "fineness", "soundness"],
    "opc": ["ordinary portland cement", "IS 269", "IS 8112", "IS 12269",
             "grade 33 43 53", "strength class"],
    "ppc": ["portland pozzolana cement", "IS 1489", "fly ash", "volcanic ash",
             "pozzolanic activity"],
    "psc": ["portland slag cement", "IS 455", "granulated blast furnace slag"],

    # Steel / Rebar
    "steel": ["structural steel", "reinforcement", "TMT bars", "high strength deformed",
               "IS 1786", "IS 2062", "IS 808", "yield strength", "tensile strength",
               "elongation", "ductility", "weldability"],
    "tmt": ["thermo mechanically treated", "TMT bars", "IS 1786", "Fe415 Fe500 Fe550 Fe600",
             "high strength deformed bars", "ribbed bars", "seismic zone"],
    "rebar": ["reinforcement bars", "TMT", "IS 1786", "deformed bars", "yield strength"],
    "rebars": ["reinforcement bars", "TMT", "IS 1786", "deformed bars"],
    "reinforcement": ["reinforcement steel bars", "IS 1786", "TMT bars", "HYSD bars",
                       "Fe415 Fe500 Fe550", "deformed bars"],
    "structural": ["structural steel", "IS 2062", "IS 808", "rolled sections",
                    "I beams H beams angles channels", "yield strength tensile strength"],

    # Concrete
    "concrete": ["plain reinforced concrete", "IS 456", "mix design", "grade M20 M25 M30",
                  "water cement ratio", "workability", "durability", "compressive strength",
                  "admixture", "curing"],
    "rcc": ["reinforced cement concrete", "IS 456", "reinforced concrete", "design code",
             "load bearing", "structural element"],
    "pcc": ["plain cement concrete", "IS 456", "unreinforced concrete"],
    "m20": ["M20 grade concrete", "IS 456", "mix design", "characteristic strength 20 MPa"],
    "m25": ["M25 grade concrete", "IS 456", "mix design", "characteristic strength 25 MPa"],
    "m30": ["M30 grade concrete", "IS 456", "high strength", "mix design"],
    "ready mix": ["ready mixed concrete", "IS 4926", "batching plant", "fresh concrete",
                   "slump workability"],
    "admixture": ["chemical admixture", "IS 9103", "superplasticizer", "water reducer",
                   "plasticizer", "retarder", "accelerator"],

    # Aggregates
    "aggregate": ["coarse aggregate", "fine aggregate", "IS 383", "grading",
                   "specific gravity", "water absorption", "impact value",
                   "crushing value", "flakiness elongation"],
    "aggregates": ["coarse fine aggregate", "IS 383", "grading zone",
                    "specific gravity", "abrasion resistance"],
    "sand": ["fine aggregate", "IS 383", "grading zone I II III IV",
              "silt content", "organic impurities", "fineness modulus"],
    "gravel": ["coarse aggregate", "IS 383", "natural gravel", "crushed stone",
                "20mm 40mm nominal size"],
    "crushed stone": ["coarse aggregate", "IS 383", "crushed rock aggregate",
                       "impact value crushing value"],

    # Building / Construction
    "building": ["building construction", "BIS standards compliance",
                  "structural design", "load bearing", "safety performance"],
    "construction": ["construction materials", "BIS standards", "building code",
                      "structural requirements", "quality specification"],
    "residential": ["residential building", "IS 456", "IS 875", "live load dead load",
                     "earthquake resistance", "seismic zone"],
    "commercial": ["commercial building", "structural design", "IS 456", "IS 875",
                    "fire resistance", "load combination"],
    "industrial": ["industrial structure", "factory shed", "IS 800", "structural steel",
                    "IS 2062", "pre-engineered building"],
    "bridge": ["bridge construction", "IS 456", "IS 1343", "prestressed concrete",
                "high strength concrete", "durability exposure"],
    "dam": ["dam construction", "mass concrete", "IS 456", "low heat cement",
             "thermal control"],

    # Structural Elements
    "column": ["concrete column", "IS 456", "reinforced concrete", "lateral ties",
                 "axial load", "slenderness ratio"],
    "beam": ["reinforced concrete beam", "IS 456", "flexural design",
              "shear reinforcement", "deflection control"],
    "slab": ["reinforced concrete slab", "IS 456", "one way two way slab",
              "flat slab", "pre-stressed"],
    "foundation": ["foundation", "IS 1904", "IS 2911", "pile foundation",
                    "soil bearing capacity", "footing design"],
    "wall": ["masonry wall", "IS 1905", "brick wall", "load bearing non-load bearing",
              "mortar", "IS 2116"],

    # Seismic / Loads
    "seismic": ["earthquake resistant design", "IS 1893", "seismic zone",
                 "ductile detailing", "IS 13920", "lateral force"],
    "earthquake": ["earthquake resistant", "IS 1893", "seismic zone II III IV V",
                    "zone factor", "response spectrum"],
    "wind": ["wind load", "IS 875 Part 3", "basic wind speed", "terrain category"],
    "load": ["structural load", "IS 875", "dead load live load",
              "load combination", "factor of safety"],

    # Prestressed
    "prestressed": ["prestressed concrete", "IS 1343", "pre-tensioned post-tensioned",
                     "high tensile steel wire strand", "IS 6003", "IS 14268"],
    "prestressing": ["prestressing steel", "IS 1343", "IS 6003", "IS 14268",
                      "tendon wire strand bar"],

    # Water / Pipes
    "pipe": ["IS 1239", "IS 3589", "IS 4984", "mild steel pipes", "HDPE pipes",
              "water supply", "pressure rating"],
    "water": ["water supply", "IS 1239", "potable water", "water treatment",
               "plumbing", "IS 2065"],

    # Bricks / Masonry
    "brick": ["clay brick", "IS 1077", "burnt clay brick", "compressive strength",
               "water absorption", "efflorescence", "modular brick"],
    "masonry": ["masonry construction", "IS 1905", "IS 2116", "brick block",
                 "mortar mix", "load bearing"],
    "block": ["concrete hollow block", "IS 2185", "solid block",
               "load bearing", "compressive strength"],

    # Paint / Surface
    "paint": ["IS 2932", "IS 2933", "exterior interior paint",
               "protective coating", "weathering"],
    "coating": ["protective coating", "IS 2932", "anticorrosion", "surface treatment"],

    # Timber / Wood
    "timber": ["structural timber", "IS 287", "IS 1328", "wood grading",
                "moisture content", "preservative treatment"],
    "wood": ["timber", "IS 287", "plywood IS 303", "moisture content"],

    # Tiles / Floor
    "tile": ["ceramic tile", "IS 15622", "vitrified tile", "floor tile",
              "water absorption", "abrasion resistance", "IS 13630"],
    "flooring": ["floor tile", "IS 15622", "mosaic tile IS 1237",
                  "terrazzo", "hardness abrasion"],

    # Glass
    "glass": ["flat glass", "IS 2835", "float glass", "safety glass IS 2553",
               "tempered laminated glass", "thickness tolerance"],

    # Wire / Mesh
    "wire": ["galvanized wire", "IS 280", "binding wire", "barbed wire IS 278",
              "welded wire fabric"],
    "mesh": ["welded wire fabric", "IS 1566", "reinforcement mesh",
              "steel wire mesh"],

    # Common BIS terms
    "bis": ["Bureau of Indian Standards", "BIS standards", "IS number",
             "Indian Standard", "specification"],
    "is": ["Indian Standard", "BIS specification", "IS number"],
    "compliance": ["BIS compliance", "mandatory BIS certification", "ISI mark",
                    "quality specification", "testing standard"],
    "grade": ["material grade", "strength class", "quality grade", "BIS specification"],
    "specification": ["BIS specification", "Indian Standard", "technical requirement",
                       "quality standard", "testing method"],
    "test": ["testing method", "IS specification", "quality test",
              "compressive tensile strength test"],
    "mse": ["micro small enterprise", "MSME", "Indian manufacturer",
             "BIS compliance", "mandatory certification"],
    "msme": ["small enterprise manufacturer", "BIS mandatory certification",
              "ISI mark", "product certification"],
}

# ── BIS-specific booster phrases ───────────────────────────────────────────────
BIS_CONTEXT_BOOSTER = (
    "BIS standards Indian Standard IS compliance specification "
    "testing requirement quality performance"
)

# ── Category-specific technical boosters ──────────────────────────────────────
CATEGORY_BOOSTERS: dict[str, str] = {
    "cement": "cement specification compressive strength fineness soundness setting time",
    "steel": "yield strength tensile strength elongation ductility weldability",
    "concrete": "concrete mix design water cement ratio workability durability strength",
    "aggregate": "grading specific gravity water absorption impact value crushing value",
    "rebar": "yield strength tensile strength bend re-bend ductility seismic",
    "prestressed": "prestressing steel wire strand tendon high tensile",
    "masonry": "compressive strength mortar water absorption efflorescence",
    "structural": "structural steel rolled sections beam column yield strength",
}


def expand_query(query: str, verbose: bool = False) -> dict:
    """
    Antigravity Query Expansion.

    Takes a plain user query and returns an enriched version that dramatically
    improves retrieval precision and recall in the BIS standards corpus.

    Args:
        query: Raw user product description
        verbose: If True, returns detailed expansion breakdown

    Returns:
        dict with 'expanded_query', 'original_query', 'matched_terms', 'expansion_tokens'
    """
    original = query.strip()
    lower = original.lower()

    expansion_tokens: list[str] = []
    matched_terms: list[str] = []

    # ── Step 1: Domain vocabulary expansion ───────────────────────────────────
    for term, expansions in DOMAIN_EXPANSIONS.items():
        # Check for whole-word match (handles plurals, partial phrases)
        pattern = r'\b' + re.escape(term) + r'\b'
        if re.search(pattern, lower):
            matched_terms.append(term)
            expansion_tokens.extend(expansions[:4])  # Top 4 expansions per term

    # ── Step 2: Category-specific technical booster ───────────────────────────
    for cat_key, booster in CATEGORY_BOOSTERS.items():
        if cat_key in lower:
            expansion_tokens.append(booster)
            break

    # ── Step 3: Always append BIS context ─────────────────────────────────────
    expansion_tokens.append(BIS_CONTEXT_BOOSTER)

    # ── Step 4: Deduplicate and build expanded query ───────────────────────────
    seen: set[str] = set()
    unique_tokens: list[str] = []
    for token in expansion_tokens:
        key = token.lower().strip()
        if key and key not in seen:
            seen.add(key)
            unique_tokens.append(token)

    expanded = f"{original} {' '.join(unique_tokens)}"

    result = {
        "original_query": original,
        "expanded_query": expanded,
        "matched_terms": matched_terms,
        "expansion_count": len(unique_tokens),
    }

    if verbose:
        result["expansion_tokens"] = unique_tokens

    return result


def expand_query_simple(query: str) -> str:
    """
    Simplified single-string expansion for use in pipeline.
    """
    return expand_query(query)["expanded_query"]


# ── CLI test ──────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    test_queries = [
        "steel for buildings",
        "OPC 53 grade cement for high rise construction",
        "TMT Fe500 bars for earthquake resistant structure",
        "M30 ready mix concrete for bridge deck",
        "crushed stone aggregate for high strength concrete",
    ]

    print("\n" + "=" * 70)
    print("  🚀 BIS ANTIGRAVITY QUERY EXPANSION — Test Run")
    print("=" * 70)

    for q in test_queries:
        result = expand_query(q)
        print(f"\n📝 Original : {result['original_query']}")
        print(f"🔍 Matched  : {result['matched_terms']}")
        print(f"✨ Expanded : {result['expanded_query'][:200]}...")
        print(f"   Tokens added: {result['expansion_count']}")
