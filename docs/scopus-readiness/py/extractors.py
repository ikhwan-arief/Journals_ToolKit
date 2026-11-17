import re

from validators import extract_doi_candidates, extract_issn_candidates


def _lower(text: str) -> str:
    return (text or "").lower()


def _find_terms(text: str, terms: list[str]) -> list[str]:
    lower = _lower(text)
    return [term for term in terms if term.lower() in lower]


def _confidence(matches: list[str], high: int = 4, medium: int = 2) -> str:
    if len(matches) >= high:
        return "high"
    if len(matches) >= medium:
        return "medium"
    if matches:
        return "low"
    return "none"


def clean_html_text(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"(?is)<script.*?</script>|<style.*?</style>", " ", text)
    text = re.sub(r"(?s)<[^>]+>", " ", text)
    text = re.sub(r"&nbsp;", " ", text)
    text = re.sub(r"&amp;", "&", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_issn(text: str) -> list[str]:
    return extract_issn_candidates(text)


def extract_doi(text: str) -> list[str]:
    return extract_doi_candidates(text)


def detect_peer_review_signals(text: str) -> dict:
    terms = [
        "peer review",
        "reviewer",
        "double-blind",
        "double blind",
        "single-blind",
        "single blind",
        "open peer review",
        "editorial screening",
        "revision",
        "acceptance",
        "rejection",
        "editorial decision",
        "plagiarism",
    ]
    matches = _find_terms(text, terms)
    return {"matches": matches, "confidence": _confidence(matches), "passed": len(matches) >= 3}


def detect_ethics_coverage(text: str) -> dict:
    terms = [
        "authorship",
        "contributorship",
        "complaints",
        "appeals",
        "misconduct",
        "conflict of interest",
        "data sharing",
        "reproducibility",
        "ethical oversight",
        "intellectual property",
        "post-publication",
        "correction",
        "retraction",
        "plagiarism",
        "citation manipulation",
        "fabrication",
        "falsification",
    ]
    matches = _find_terms(text, terms)
    return {"matches": matches, "confidence": _confidence(matches, high=8, medium=4), "passed": len(matches) >= 5}


def detect_genai_coverage(text: str) -> dict:
    terms = [
        "generative ai",
        "artificial intelligence",
        "ai-assisted",
        "ai tools",
        "disclosure",
        "ai authorship",
        "human responsibility",
        "confidentiality",
        "peer review confidentiality",
    ]
    matches = _find_terms(text, terms)
    return {"matches": matches, "confidence": _confidence(matches), "passed": len(matches) >= 3}


def detect_transparency_coverage(text: str) -> dict:
    terms = [
        "aims and scope",
        "editorial board",
        "copyright",
        "license",
        "article processing charge",
        "publication fee",
        "owner",
        "publisher",
        "contact",
        "archiving",
        "preservation",
        "advertising",
        "direct marketing",
    ]
    matches = _find_terms(text, terms)
    return {"matches": matches, "confidence": _confidence(matches, high=7, medium=3), "passed": len(matches) >= 4}


def detect_article_metadata(text: str) -> dict:
    terms = [
        "abstract",
        "keywords",
        "doi",
        "author",
        "affiliation",
        "received",
        "revised",
        "accepted",
        "published",
        "references",
    ]
    matches = _find_terms(text, terms)
    return {
        "matches": matches,
        "issn": extract_issn(text),
        "doi": extract_doi(text),
        "confidence": _confidence(matches, high=7, medium=4),
        "passed": len(matches) >= 5,
    }


def detect_language_signals(text: str) -> dict:
    terms = ["abstract", "keywords", "introduction", "method", "results", "conclusion", "references"]
    matches = _find_terms(text, terms)
    return {"matches": matches, "confidence": _confidence(matches), "passed": len(matches) >= 3}


def detect_indexing_claims(text: str) -> dict:
    risky = [
        "indexed in scopus",
        "scopus indexed",
        "impact factor",
        "global impact factor",
        "cosmos impact factor",
        "sjif",
        "isi indexed",
    ]
    neutral = ["doaj", "crossref", "google scholar", "web of science", "sinta", "ebsco", "proquest"]
    risky_matches = _find_terms(text, risky)
    neutral_matches = _find_terms(text, neutral)
    return {
        "risky_matches": risky_matches,
        "neutral_matches": neutral_matches,
        "confidence": "medium" if risky_matches or neutral_matches else "none",
        "risk": bool(risky_matches),
    }
