def normalize_evidence(record: dict) -> dict:
    output = {
        "id": record.get("id", ""),
        "section": record.get("section", ""),
        "label": record.get("label", ""),
        "url": record.get("url", ""),
        "required": bool(record.get("required", False)),
        "fetch_status": record.get("fetch_status", "pending"),
        "source_type": record.get("source_type", "url"),
        "captured_text": record.get("captured_text", ""),
        "detected_evidence": record.get("detected_evidence", []),
        "confidence": record.get("confidence", "none"),
        "user_confirmation": record.get("user_confirmation", "Verification needed"),
        "score_impact": record.get("score_impact", ""),
        "notes": record.get("notes", ""),
    }
    if output["fetch_status"] in {"manual_text_added", "readable"} and output["captured_text"]:
        output["confidence"] = "medium" if output["confidence"] == "none" else output["confidence"]
    return output


def unresolved_required(evidence_records: list[dict]) -> list[dict]:
    unresolved = []
    for record in evidence_records:
        if not record.get("required"):
            continue
        status = record.get("fetch_status", "pending")
        if status in {"blocked_by_cors", "failed_url", "empty_or_unreadable", "not_provided", "pending", "pdf_uploaded"}:
            unresolved.append(record)
    return unresolved
