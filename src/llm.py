"""
BIS Standard Discovery Engine - LLM Rationale Generator
Uses Google Gemini to explain WHY each standard applies to the query product
"""

import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Configure Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    _llm_model = genai.GenerativeModel("gemini-2.5-flash")
    LLM_AVAILABLE = True
else:
    print("⚠️  GEMINI_API_KEY not set — rationale generation will use fallback mode")
    LLM_AVAILABLE = False


RATIONALE_PROMPT = """You are an expert in Bureau of Indian Standards (BIS) regulations for building materials.

A manufacturer is seeking regulatory compliance guidance for their product:
**Product Description**: {query}

The following BIS standards have been retrieved as potentially applicable:
{standards_list}

For EACH standard, write a concise 1-2 sentence rationale explaining WHY it applies to this specific product. 
Be specific, practical, and use technical language appropriate for MSE compliance teams.

Return your response as a JSON array with this exact structure:
[
  {{
    "standard_no": "<IS number>",
    "rationale": "<1-2 sentence explanation>"
  }},
  ...
]

Only return valid JSON. No markdown, no extra text."""


def generate_rationale(query: str, retrieved_standards: list[dict]) -> list[dict]:
    """
    Generate explanations for why each retrieved standard applies to the query.
    Falls back to rule-based rationale if Gemini is unavailable.
    """
    if LLM_AVAILABLE:
        return _gemini_rationale(query, retrieved_standards)
    else:
        return _fallback_rationale(query, retrieved_standards)


def _gemini_rationale(query: str, standards: list[dict]) -> list[dict]:
    """Call Gemini API to generate rationales."""
    standards_list = "\n".join([
        f"{i+1}. **{s['standard_no']}**: {s['title']} — {s['scope'][:200]}..."
        for i, s in enumerate(standards)
    ])

    prompt = RATIONALE_PROMPT.format(
        query=query,
        standards_list=standards_list,
    )

    try:
        response = _llm_model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.2,
                max_output_tokens=1024,
            )
        )
        text = response.text.strip()

        # Remove markdown code blocks if present
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]

        rationale_list = json.loads(text)

        # Map rationales back to standard_no
        rationale_map = {r["standard_no"]: r["rationale"] for r in rationale_list}

        for standard in standards:
            standard["rationale"] = rationale_map.get(
                standard["standard_no"],
                _simple_rationale(standard, query)
            )

        return standards

    except Exception as e:
        print(f"⚠️  Gemini error: {e} — using fallback rationale")
        return _fallback_rationale(query, standards)


def _fallback_rationale(query: str, standards: list[dict]) -> list[dict]:
    """Rule-based rationale when LLM is unavailable."""
    for standard in standards:
        standard["rationale"] = _simple_rationale(standard, query)
    return standards


def _simple_rationale(standard: dict, query: str) -> str:
    """Generate a simple template-based rationale."""
    return (
        f"This standard ({standard['standard_no']}) — '{standard['title']}' — is applicable "
        f"as it directly governs the specification and testing requirements for this category of "
        f"building material. Compliance ensures the product meets Indian regulatory benchmarks "
        f"for quality, safety, and performance."
    )


if __name__ == "__main__":
    # Quick test
    test_standards = [
        {
            "standard_no": "IS 269:2015",
            "title": "Ordinary Portland Cement - Specification",
            "scope": "Covers OPC grades 33, 43, 53 for general construction.",
        }
    ]
    result = generate_rationale("OPC cement bags for building construction", test_standards)
    print(result[0]["rationale"])
