from rules_scopus import DISCLAIMER


def build_report(audit_result: dict, payload: dict) -> str:
    journal = payload.get("journal", {})
    lines = [
        "# Scopus Readiness Auditor Report",
        "",
        f"Journal name: {journal.get('title', '-') or '-'}",
        f"Homepage URL: {journal.get('homepage_url', '-') or '-'}",
        f"Publisher: {journal.get('publisher_name', '-') or '-'}",
        f"Verdict: {audit_result.get('verdict', '-')}",
        f"Indicative score: {audit_result.get('total_score', 0):.1f}",
        f"Evidence completeness: {audit_result.get('evidence_completeness', 0) * 100:.0f}%",
        "",
        "## Summary",
        audit_result.get("summary", "No summary available."),
        "",
        "## Hard-fail gates",
        "| Gate | Status | Notes |",
        "|---|---|---|",
    ]
    for gate in audit_result.get("hard_gate_results", []):
        lines.append(f"| {gate.get('label', gate.get('id', '-'))} | {gate.get('status', '-')} | {gate.get('notes', '')} |")
    lines.extend(["", "## Scorecard", "| Category | Score | Weight |", "|---|---:|---:|"])
    for category, score in audit_result.get("category_scores", {}).items():
        weight = audit_result.get("weights", {}).get(category, 0)
        lines.append(f"| {category} | {score:.1f} | {weight} |")
    lines.extend(["", "## Required evidence", "| Field | URL | Fetch status | Confirmation | Notes |", "|---|---|---|---|---|"])
    for record in payload.get("evidence", []):
        if record.get("required"):
            lines.append(
                f"| {record.get('label', '-')} | {record.get('url', '-')} | {record.get('fetch_status', '-')} | "
                f"{record.get('user_confirmation', '-')} | {record.get('notes', '')} |"
            )
    lines.extend(["", "## Derived application findings", "| Finding | Result |", "|---|---|"])
    for label, value in audit_result.get("derived_checks", {}).items():
        if isinstance(value, list):
            value = ", ".join(value)
        lines.append(f"| {label} | {value or '-'} |")
    lines.extend(["", "## Priority fixes"])
    fixes = audit_result.get("priority_fixes", [])
    if fixes:
        for index, fix in enumerate(fixes, start=1):
            lines.append(f"{index}. {fix}")
    else:
        lines.append("No priority fixes were generated from the supplied evidence.")
    lines.extend(["", "## Needs evidence"])
    needs = audit_result.get("needs_evidence", [])
    if needs:
        for item in needs:
            lines.append(f"- {item}")
    else:
        lines.append("No unresolved required evidence items were found.")
    lines.extend(["", "## Disclaimer", DISCLAIMER])
    return "\n".join(lines)
