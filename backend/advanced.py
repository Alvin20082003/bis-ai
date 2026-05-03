"""
BIS Antigravity AI — Advanced Analysis Module
Provides: Gap Analysis, Smart Checklist, Risk Assessment, What-If simulation
All logic is deterministic (no extra LLM calls) for speed.
"""

from __future__ import annotations
import re

# ── Checklist database per standard ───────────────────────────────────────────
CHECKLISTS: dict[str, list[str]] = {
    "IS 269:2015": [
        "Verify compressive strength at 3, 7, and 28 days meets grade requirements",
        "Test fineness (specific surface ≥ 225 m²/kg for 33 grade)",
        "Check initial setting time ≥ 30 min, final ≤ 600 min",
        "Perform Le Chatelier soundness test (expansion ≤ 10 mm)",
        "Confirm chemical composition: SO₃ ≤ 3.5%, MgO ≤ 6%",
        "Ensure ISI mark certification on bags",
    ],
    "IS 12269:2013": [
        "Verify 28-day compressive strength ≥ 53 MPa",
        "Confirm 3-day strength ≥ 27 MPa for early strength applications",
        "Test fineness ≥ 300 m²/kg (Blaine)",
        "Check soundness ≤ 10 mm (Le Chatelier)",
        "Validate storage: use within 3 months of manufacture date",
        "Ensure BIS certification mark on packaging",
    ],
    "IS 8112:2013": [
        "Verify 28-day compressive strength ≥ 43 MPa",
        "Confirm 3-day strength ≥ 23 MPa",
        "Test initial setting time ≥ 30 min",
        "Check soundness ≤ 10 mm",
        "Validate bag weight and labelling per BIS requirements",
    ],
    "IS 1489-1:2015": [
        "Confirm fly ash content between 15–35% by mass",
        "Verify 28-day strength ≥ 33 MPa",
        "Test pozzolanic activity index ≥ 80% at 28 days",
        "Check fineness ≥ 300 m²/kg",
        "Validate fly ash source and quality certificate",
        "Ensure proper storage away from moisture",
    ],
    "IS 455:2015": [
        "Confirm slag content 25–70% by mass",
        "Verify 28-day compressive strength ≥ 33 MPa",
        "Test sulphate resistance for marine/underground use",
        "Check chloride content ≤ 0.05%",
        "Validate BIS certification for coastal applications",
    ],
    "IS 1786:2008": [
        "Verify yield strength (0.2% proof stress) meets grade: Fe415 ≥ 415 MPa, Fe500 ≥ 500 MPa",
        "Test ultimate tensile strength ≥ 1.08 × yield strength",
        "Confirm elongation ≥ 14.5% (Fe415) or ≥ 12% (Fe500)",
        "Perform bend and re-bend test per IS 1786",
        "Check rib geometry and marking on bars",
        "Verify chemical composition: carbon ≤ 0.30%, sulphur ≤ 0.055%",
        "For seismic zones: use Fe415D or Fe500D grade",
    ],
    "IS 2062:2011": [
        "Verify yield strength meets grade (E250: ≥ 250 MPa, E350: ≥ 350 MPa)",
        "Test Charpy impact energy at 0°C",
        "Check dimensional tolerances for plates/sections",
        "Confirm weldability: carbon equivalent ≤ 0.42%",
        "Verify mill test certificate from manufacturer",
    ],
    "IS 800:2007": [
        "Design all members using limit state method",
        "Check load combinations per IS 875",
        "Verify deflection limits: span/300 for beams",
        "Design connections for full member capacity",
        "Provide corrosion protection: painting or galvanizing",
        "Ensure stability against lateral-torsional buckling",
    ],
    "IS 456:2000": [
        "Confirm concrete grade meets exposure class requirements",
        "Verify minimum cement content per exposure class",
        "Check maximum water-cement ratio (0.45 for moderate, 0.40 for severe)",
        "Ensure minimum cover to reinforcement (25–75 mm by exposure)",
        "Test cube compressive strength at 28 days",
        "Verify mix design per IS 10262",
        "Check curing duration: minimum 7 days for OPC",
    ],
    "IS 10262:2019": [
        "Calculate target mean strength = fck + 1.65σ",
        "Select water-cement ratio from durability and strength requirements",
        "Determine water content based on workability and aggregate size",
        "Calculate cement content from w/c ratio and water content",
        "Proportion fine and coarse aggregates",
        "Conduct trial mixes and verify workability (slump/flow)",
        "Confirm 28-day cube strength meets target",
    ],
    "IS 1343:2012": [
        "Use minimum M30 concrete for prestressed elements",
        "Calculate prestress losses: elastic shortening, creep, shrinkage, relaxation",
        "Verify anchorage zone reinforcement design",
        "Check minimum cover: 40 mm for pre-tensioned, 50 mm for post-tensioned",
        "Test prestressing steel for UTS and relaxation",
        "Verify grouting of post-tensioned ducts",
    ],
    "IS 13920:2016": [
        "Use Fe415D or Fe500D steel for ductile detailing",
        "Provide confinement reinforcement in column plastic hinge zones",
        "Design beam-column joints for shear",
        "Ensure strong column–weak beam design philosophy",
        "Provide special boundary elements in shear walls",
        "Check lap splice locations away from plastic hinge zones",
    ],
    "IS 9103:1999": [
        "Verify water reduction ≥ 5% for plasticizers, ≥ 12% for superplasticizers",
        "Test compatibility with cement brand before use",
        "Check setting time: initial ≥ 30 min, final ≤ 600 min",
        "Confirm compressive strength ratio ≥ 90% at 28 days",
        "Verify dosage per manufacturer recommendation",
        "Store admixture away from freezing temperatures",
    ],
    "IS 383:2016": [
        "Perform sieve analysis and verify grading within specified zone",
        "Test deleterious materials: clay lumps ≤ 1%, fine material ≤ 3%",
        "Check specific gravity 2.5–3.0 and water absorption ≤ 2%",
        "Perform soundness test (sodium sulphate: ≤ 12%)",
        "Test for alkali-silica reactivity if using reactive aggregates",
        "Verify flakiness index ≤ 35% and elongation index ≤ 45%",
    ],
    "IS 2386-4:2016": [
        "Test aggregate impact value (AIV): ≤ 30% for structural concrete",
        "Test aggregate crushing value (ACV): ≤ 30%",
        "Perform Los Angeles abrasion test: ≤ 30%",
        "Test ten percent fines value: ≥ 150 kN",
        "Document all test results with batch numbers",
    ],
    "IS 2250:1981": [
        "Proportion mortar mix per application type (1:3 for brickwork, 1:6 for plastering)",
        "Verify water retention of mortar ≥ 75%",
        "Test 28-day compressive strength of mortar cubes",
        "Ensure sand grading per IS 1542",
        "Mix mortar within 30 minutes of water addition",
    ],
    "IS 3025-1:2000": [
        "Test pH of mixing water: 6–8",
        "Check chloride content ≤ 500 mg/L for RCC, ≤ 2000 mg/L for PCC",
        "Verify sulphate content ≤ 400 mg/L",
        "Test organic matter ≤ 200 mg/L",
        "Confirm turbidity ≤ 2000 mg/L",
        "Use potable water or test non-potable sources",
    ],
}

# ── Gap analysis rules ─────────────────────────────────────────────────────────
# Maps keywords in query → required standards
REQUIRED_STANDARDS_MAP: dict[str, list[str]] = {
    "cement":        ["IS 269:2015", "IS 12269:2013"],
    "opc":           ["IS 269:2015", "IS 12269:2013"],
    "concrete":      ["IS 456:2000", "IS 10262:2019"],
    "rcc":           ["IS 456:2000", "IS 1786:2008"],
    "reinforced":    ["IS 456:2000", "IS 1786:2008"],
    "steel":         ["IS 1786:2008"],
    "tmt":           ["IS 1786:2008"],
    "rebar":         ["IS 1786:2008"],
    "aggregate":     ["IS 383:2016"],
    "sand":          ["IS 383:2016"],
    "water":         ["IS 3025-1:2000"],
    "admixture":     ["IS 9103:1999"],
    "plasticizer":   ["IS 9103:1999"],
    "prestressed":   ["IS 1343:2012"],
    "seismic":       ["IS 13920:2016"],
    "earthquake":    ["IS 13920:2016"],
    "structural":    ["IS 2062:2011", "IS 800:2007"],
    "mortar":        ["IS 2250:1981"],
    "masonry":       ["IS 2250:1981"],
    "mix design":    ["IS 10262:2019"],
    "marine":        ["IS 455:2015"],
    "coastal":       ["IS 455:2015"],
    "fly ash":       ["IS 1489-1:2015"],
    "ppc":           ["IS 1489-1:2015"],
}

# ── Industry context modifiers ─────────────────────────────────────────────────
INDUSTRY_CONTEXT: dict[str, dict] = {
    "construction": {
        "prefix": "Building construction application:",
        "extra_terms": ["structural safety", "load bearing", "durability", "BIS compliance"],
        "risk_multiplier": 1.0,
    },
    "manufacturing": {
        "prefix": "Manufacturing/production application:",
        "extra_terms": ["quality control", "batch testing", "production specification", "ISI mark"],
        "risk_multiplier": 0.9,
    },
    "infrastructure": {
        "prefix": "Infrastructure/civil engineering application:",
        "extra_terms": ["long-term durability", "environmental exposure", "maintenance", "design life"],
        "risk_multiplier": 1.2,
    },
}

# ── Location modifiers ─────────────────────────────────────────────────────────
LOCATION_MODIFIERS: dict[str, dict] = {
    "coastal": {
        "extra_query": "marine environment chloride attack sulphate resistance",
        "risk_boost": 1,
        "note": "Coastal environment requires enhanced durability standards",
    },
    "urban": {
        "extra_query": "urban construction high rise load bearing",
        "risk_boost": 0,
        "note": "Standard urban construction requirements apply",
    },
    "rural": {
        "extra_query": "general construction basic requirements",
        "risk_boost": -1,
        "note": "Rural construction with standard exposure conditions",
    },
    "seismic": {
        "extra_query": "earthquake resistant seismic zone ductile detailing",
        "risk_boost": 2,
        "note": "Seismic zone requires ductile detailing per IS 13920",
    },
}


def generate_checklist(standard_no: str, scope: str) -> list[str]:
    """Return actionable checklist for a standard."""
    if standard_no in CHECKLISTS:
        return CHECKLISTS[standard_no]
    # Fallback: generate generic checklist from scope
    return [
        f"Obtain BIS certification for {standard_no}",
        "Verify material properties meet specified minimum values",
        "Conduct required tests at accredited laboratory",
        "Maintain test records and certificates",
        "Ensure proper storage and handling per standard",
        "Check labelling and marking requirements",
    ]


def compute_gap_analysis(query: str, retrieved_standards: list[dict]) -> dict:
    """
    Analyze what's covered and what's missing based on query keywords.
    Returns satisfied, missing, and overall risk level.
    """
    query_lower = query.lower()
    retrieved_nos = {r["standard_no"] for r in retrieved_standards}

    satisfied: list[dict] = []
    missing: list[dict] = []

    # Check each keyword match
    checked_standards: set[str] = set()
    for keyword, required in REQUIRED_STANDARDS_MAP.items():
        if keyword in query_lower:
            for std_no in required:
                if std_no in checked_standards:
                    continue
                checked_standards.add(std_no)
                if std_no in retrieved_nos:
                    satisfied.append({
                        "standard_no": std_no,
                        "reason": f"Covers {keyword} requirements",
                        "status": "satisfied",
                    })
                else:
                    missing.append({
                        "standard_no": std_no,
                        "reason": f"Required for {keyword} compliance but not in top results",
                        "status": "missing",
                    })

    # Compute risk
    total = len(satisfied) + len(missing)
    if total == 0:
        risk = "LOW"
        risk_score = 20
    else:
        missing_ratio = len(missing) / total
        if missing_ratio >= 0.5:
            risk = "HIGH"
            risk_score = 85
        elif missing_ratio >= 0.25:
            risk = "MEDIUM"
            risk_score = 55
        else:
            risk = "LOW"
            risk_score = 20

    # Add confidence-based risk boost
    avg_confidence = sum(r["confidence_score"] for r in retrieved_standards) / max(len(retrieved_standards), 1)
    if avg_confidence < 50:
        risk_score = min(100, risk_score + 20)
        if risk == "LOW":
            risk = "MEDIUM"

    return {
        "satisfied": satisfied,
        "missing": missing,
        "risk_level": risk,
        "risk_score": risk_score,
        "coverage_pct": round(len(satisfied) / max(total, 1) * 100),
        "summary": _risk_summary(risk, len(satisfied), len(missing)),
    }


def _risk_summary(risk: str, n_satisfied: int, n_missing: int) -> str:
    if risk == "HIGH":
        return f"{n_missing} critical standard(s) missing. Immediate compliance action required."
    elif risk == "MEDIUM":
        return f"{n_missing} standard(s) may be needed. Review before production."
    else:
        return f"All {n_satisfied} key standard(s) covered. Compliance looks good."


def apply_whatif(
    base_query: str,
    location: str = "urban",
    industry: str = "construction",
    material_modifier: str = "",
) -> str:
    """
    Apply what-if conditions to expand the query for re-retrieval.
    Returns modified query string.
    """
    parts = [base_query]

    loc = LOCATION_MODIFIERS.get(location, LOCATION_MODIFIERS["urban"])
    parts.append(loc["extra_query"])

    ind = INDUSTRY_CONTEXT.get(industry, INDUSTRY_CONTEXT["construction"])
    parts.extend(ind["extra_terms"])

    if material_modifier:
        parts.append(material_modifier)

    return " ".join(parts)


def compute_overall_risk(results: list[dict], gap: dict) -> dict:
    """Compute final risk summary for report."""
    avg_conf = sum(r["confidence_score"] for r in results) / max(len(results), 1)
    return {
        "level": gap["risk_level"],
        "score": gap["risk_score"],
        "avg_confidence": round(avg_conf, 1),
        "coverage_pct": gap["coverage_pct"],
        "action": {
            "HIGH":   "Consult BIS-certified compliance officer immediately",
            "MEDIUM": "Review missing standards before production",
            "LOW":    "Proceed with documented compliance records",
        }.get(gap["risk_level"], "Review standards"),
    }
