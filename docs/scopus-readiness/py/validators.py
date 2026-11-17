import re
from urllib.parse import urlparse


ISSN_RE = re.compile(r"\b\d{4}-\d{3}[\dXx]\b")
DOI_RE = re.compile(r"\b10\.\d{4,9}/[-._;()/:A-Z0-9]+\b", re.IGNORECASE)


def is_valid_url(value: str) -> bool:
    if not value:
        return False
    parsed = urlparse(value.strip())
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def is_valid_issn(value: str) -> bool:
    if not value or not ISSN_RE.fullmatch(value.strip()):
        return False
    digits = value.replace("-", "").upper()
    total = 0
    for index, char in enumerate(digits):
        weight = 8 - index
        number = 10 if char == "X" else int(char)
        total += number * weight
    return total % 11 == 0


def extract_issn_candidates(text: str) -> list[str]:
    if not text:
        return []
    return sorted(set(ISSN_RE.findall(text)))


def extract_doi_candidates(text: str) -> list[str]:
    if not text:
        return []
    return sorted(set(match.group(0).rstrip(".,;)") for match in DOI_RE.finditer(text)))
