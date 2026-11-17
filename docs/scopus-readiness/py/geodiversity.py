import json
import re
from pathlib import Path


def _load_country_map() -> dict:
    path = Path(__file__).resolve().parents[1] / "data" / "country_continent.json"
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


COUNTRY_MAP = _load_country_map()


def parse_people_from_text(text: str) -> list[dict]:
    people = []
    if not text:
        return people
    lines = [line.strip() for line in re.split(r"[\n\r]+", text) if line.strip()]
    for line in lines:
        lower = line.lower()
        if not any(word in lower for word in ["editor", "board", "reviewer", "university", "institute", "department"]):
            continue
        country = ""
        for candidate in COUNTRY_MAP:
            if candidate.lower() in lower:
                country = candidate
                break
        people.append(
            {
                "role": "Editor" if "editor" in lower else "Reviewer" if "reviewer" in lower else "",
                "name": line.split(",")[0][:80],
                "affiliation": line[:160],
                "country": country,
                "continent": classify_country_continent(country),
                "source_url": "",
                "verified": False,
            }
        )
    return people[:80]


def classify_country_continent(country: str) -> str:
    if not country:
        return "Unknown"
    return COUNTRY_MAP.get(country, "Unknown")


def summarize_geodiversity(people: list[dict]) -> dict:
    countries = sorted({item.get("country") for item in people if item.get("country")})
    continents = sorted({item.get("continent") for item in people if item.get("continent") and item.get("continent") != "Unknown"})
    return {
        "people_count": len(people),
        "distinct_countries": len(countries),
        "distinct_continents": len(continents),
        "countries": countries,
        "continents": continents,
        "status": "Pass" if len(countries) >= 3 and len(continents) >= 2 else "Weak" if len(countries) >= 2 else "Verification needed",
    }
