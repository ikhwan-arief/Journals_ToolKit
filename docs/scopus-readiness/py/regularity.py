import re


def parse_issue_records(text: str) -> list[dict]:
    if not text:
        return []
    years = sorted({int(value) for value in re.findall(r"\b(19\d{2}|20\d{2})\b", text)})
    issues = re.findall(r"\b(?:Vol\.?|Volume)\s*([0-9]+).{0,30}?(?:No\.?|Issue)\s*([0-9]+)", text, flags=re.IGNORECASE)
    records = []
    for year in years:
        records.append({"year": year, "volume": "", "issue": "", "article_count": None, "status": "Detected", "source_url": ""})
    for index, pair in enumerate(issues[: len(records)]):
        records[index]["volume"] = pair[0]
        records[index]["issue"] = pair[1]
    return records


def evaluate_regularity(records: list[dict], declared_frequency: str, issues_per_year: int = 0) -> dict:
    years = sorted({record.get("year") for record in records if record.get("year")})
    current_span = max(years) - min(years) + 1 if len(years) >= 2 else len(years)
    enough_history = current_span >= 2
    expected = issues_per_year or _frequency_to_issues(declared_frequency)
    status = "Pass" if enough_history and len(records) >= expected else "Weak" if records else "Verification needed"
    return {
        "records": records,
        "years": years,
        "expected_issues_per_year": expected,
        "enough_history": enough_history,
        "status": status,
    }


def _frequency_to_issues(value: str) -> int:
    lower = (value or "").lower()
    if "monthly" in lower:
        return 12
    if "bimonthly" in lower:
        return 6
    if "quarter" in lower:
        return 4
    if "triannual" in lower or "three" in lower:
        return 3
    if "biannual" in lower or "twice" in lower:
        return 2
    return 1
