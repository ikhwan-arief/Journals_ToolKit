import json
import re

from extractors import (
    clean_html_text,
    detect_article_metadata,
    detect_ethics_coverage,
    detect_genai_coverage,
    detect_indexing_claims,
    detect_language_signals,
    detect_peer_review_signals,
    detect_transparency_coverage,
)
from regularity import evaluate_regularity, parse_issue_records
from report import build_report
from rules_scopus import CONFIRMATION_SCORES, HARD_GATES, NEARLY_READY_MIN, READY_MIN, WEIGHTS
from validators import is_valid_issn


def run_audit(payload: dict) -> dict:
    rules = payload.get("rules", {})
    criteria = rules.get("criteria", [])
    confirmations = payload.get("confirmations", {})
    journal = payload.get("journal", {})
    evidence = payload.get("evidence", [])
    operational = payload.get("operational", {})
    inferred = _infer_confirmations(criteria, journal, evidence, operational)
    merged = {**inferred, **{key: value for key, value in confirmations.items() if value}}
    derived_checks = _build_derived_checks(journal, evidence, merged)

    category_values = {category: [] for category in WEIGHTS}
    hard_gate_results = []
    priority_fixes = []
    needs_evidence = []

    for criterion in criteria:
        cid = criterion["id"]
        category = criterion["category"]
        confirmation = merged.get(cid, "Verification needed")
        score = CONFIRMATION_SCORES.get(confirmation, 0)
        if score is not None:
            category_values.setdefault(category, []).append(score)
        if criterion.get("hard_gate") or cid in HARD_GATES:
            failed = confirmation in {"Fail", "Verification needed"}
            hard_gate_results.append(
                {
                    "id": cid,
                    "label": criterion.get("label", cid),
                    "status": "Fail" if failed else confirmation,
                    "notes": "Hard gate requires confirmed evidence." if failed else "",
                }
            )
            if failed:
                priority_fixes.append(_fix_for(cid, criterion.get("label", cid)))

    category_scores = {}
    for category, values in category_values.items():
        if values:
            category_scores[category] = round((sum(values) / len(values)) / 5 * WEIGHTS[category], 2)
        else:
            category_scores[category] = 0.0

    total_score = round(sum(category_scores.values()), 2)
    required = [item for item in evidence if item.get("required")]
    confirmed = [
        item
        for item in required
        if item.get("fetch_status") in {"readable", "manual_text_added", "file_uploaded"}
        or item.get("user_confirmation") in {"Pass", "Weak"}
    ]
    evidence_completeness = len(confirmed) / len(required) if required else 0
    hard_failed = any(item["status"] == "Fail" for item in hard_gate_results)
    if hard_failed or total_score < NEARLY_READY_MIN:
        verdict = "Gaps"
    elif total_score >= READY_MIN:
        verdict = "Ready"
    else:
        verdict = "Nearly Ready"

    for item in required:
        if item.get("fetch_status") in {"blocked_by_cors", "failed_url", "empty_or_unreadable", "not_provided", "pending", "pdf_uploaded"}:
            needs_evidence.append(f"{item.get('label', item.get('id'))}: {item.get('fetch_status')}")

    if evidence_completeness < 0.8:
        priority_fixes.append("Complete the unresolved required evidence items before treating the score as reliable.")

    result = {
        "verdict": verdict,
        "total_score": total_score,
        "weights": WEIGHTS,
        "hard_fails": [item for item in hard_gate_results if item["status"] == "Fail"],
        "hard_gate_results": hard_gate_results,
        "category_scores": category_scores,
        "evidence_completeness": evidence_completeness,
        "findings": _build_findings(evidence),
        "priority_fixes": _dedupe(priority_fixes)[:7],
        "needs_evidence": needs_evidence,
        "people_geodiversity": payload.get("people_geodiversity", {}),
        "regularity": payload.get("regularity", {}),
        "scope_alignment": payload.get("scope_alignment", {}),
        "confirmations": merged,
        "derived_checks": derived_checks,
    }
    result["summary"] = _summary(result)
    result["report_markdown"] = build_report(result, {**payload, "evidence": evidence})
    return result


def _infer_confirmations(criteria: list[dict], journal: dict, evidence: list[dict], operational: dict) -> dict:
    text_by_id = {item.get("id"): clean_html_text(item.get("captured_text", "")) for item in evidence}
    all_text = " ".join(text_by_id.values())
    inferred = {criterion["id"]: "Verification needed" for criterion in criteria}

    issn_values = [journal.get("online_issn", ""), journal.get("print_issn", "")]
    inferred["valid_issn"] = "Pass" if any(is_valid_issn(value) for value in issn_values) else "Verification needed"

    peer = detect_peer_review_signals(text_by_id.get("peer_review_url", "") or all_text)
    inferred["peer_review_content"] = "Pass" if peer["passed"] else "Weak" if peer["matches"] else "Verification needed"
    inferred["peer_review_model"] = inferred["peer_review_content"]

    ethics = detect_ethics_coverage(text_by_id.get("ethics_url", "") or all_text)
    inferred["publication_ethics"] = "Pass" if ethics["passed"] else "Weak" if ethics["matches"] else "Verification needed"

    transparency = detect_transparency_coverage(all_text)
    inferred["transparency_principles"] = "Pass" if transparency["passed"] else "Weak" if transparency["matches"] else "Verification needed"

    genai = detect_genai_coverage(text_by_id.get("genai_url", "") or all_text)
    inferred["genai_policy"] = "Pass" if genai["passed"] else "Weak" if genai["matches"] else "Verification needed"

    archive_records = parse_issue_records(text_by_id.get("archive_url", "") or text_by_id.get("current_issue_url", ""))
    regularity = evaluate_regularity(archive_records, journal.get("publication_frequency", ""))
    inferred["regular_publication"] = _derive_publication_regularity(journal, text_by_id, regularity["status"])
    inferred["publication_history"] = "Pass" if regularity.get("enough_history") else "Verification needed"
    inferred["archive_regular"] = regularity["status"]
    inferred["volume_stability"] = regularity["status"]

    language = detect_language_signals(all_text)
    inferred["english_titles_abstracts"] = "Pass" if language["passed"] else "Weak" if language["matches"] else "Verification needed"
    inferred["abstract_clarity"] = inferred["english_titles_abstracts"]
    metadata = detect_article_metadata(" ".join([all_text, _journal_text(journal, ["doi_evidence", "scope_alignment_notes"])]))
    inferred["metadata_completeness"] = "Pass" if metadata["passed"] else "Weak" if len(metadata["matches"]) >= 2 else "Verification needed"

    inferred["online_content_access"] = _derive_pdf_access(journal, evidence, text_by_id)
    inferred["english_homepage"] = _derive_english_homepage(text_by_id, all_text)
    inferred["dedicated_website"] = _derive_dedicated_website(journal, evidence)
    sample_count = _count_lines(journal.get("article_sample_urls") or "")
    inferred["sample_content_ready"] = "Pass" if sample_count >= 9 else "Weak" if sample_count >= 3 else "Verification needed"

    claims = detect_indexing_claims(text_by_id.get("indexing_url", "") + " " + text_by_id.get("metrics_url", ""))
    inferred["indexing_claims_accuracy"] = "Fail" if claims["risk"] else "Weak" if claims["neutral_matches"] else "Verification needed"

    for key in [
        "editorial_policy",
        "author_geodiversity",
        "editor_geodiversity",
        "contact_governance",
        "academic_contribution",
        "scope_fit",
        "readability",
        "editor_standing",
        "board_scope_fit",
        "citedness_evidence",
        "title_uniqueness",
        "production_dates",
        "site_navigation",
        "doi_resolution",
        "license_access_consistency",
        "website_qa",
    ]:
        inferred[key] = inferred.get(key) or "Verification needed"
    inferred["title_uniqueness"] = "Verification needed"
    inferred["scope_saturation"] = _derive_scope_saturation(journal, text_by_id)
    if _derive_scope_keywords(journal, text_by_id):
        inferred["scope_fit"] = "Weak"

    return inferred


def _derive_dedicated_website(journal: dict, evidence: list[dict]) -> str:
    required_ids = {
        "homepage_url",
        "aims_scope_url",
        "peer_review_url",
        "ethics_url",
        "archive_url",
        "editorial_board_url",
        "contact_url",
    }
    provided = 1 if journal.get("homepage_url") else 0
    provided += sum(1 for item in evidence if item.get("id") in required_ids and item.get("id") != "homepage_url" and item.get("url"))
    if provided >= 6:
        return "Pass"
    if provided >= 4:
        return "Weak"
    return "Verification needed"


def _derive_english_homepage(text_by_id: dict, all_text: str) -> str:
    text = " ".join([text_by_id.get("homepage_url", ""), all_text]).lower()
    signals = ["abstract", "aims and scope", "author guidelines", "editorial board", "publication ethics", "current issue"]
    count = sum(1 for signal in signals if signal in text)
    if count >= 3:
        return "Pass"
    if count:
        return "Weak"
    return "Verification needed"


def _derive_pdf_access(journal: dict, evidence: list[dict], text_by_id: dict) -> str:
    fulltext = next((item for item in evidence if item.get("id") == "article_fulltext_url"), {})
    if fulltext.get("url") and fulltext.get("fetch_status") == "readable":
        return "Pass"
    text = " ".join(
        [
            journal.get("article_landing_urls", ""),
            journal.get("doi_evidence", ""),
            " ".join(text_by_id.values()),
            fulltext.get("url", ""),
        ]
    ).lower()
    if ".pdf" in text or "full text" in text or "download pdf" in text:
        return "Weak"
    return "Verification needed"


def _derive_publication_regularity(journal: dict, text_by_id: dict, regularity_status: str) -> str:
    if regularity_status == "Pass":
        return "Pass"
    source = " ".join(
        [
            text_by_id.get("archive_url", ""),
            text_by_id.get("current_issue_url", ""),
            journal.get("previous_issue_urls", ""),
        ]
    )
    years = set(re.findall(r"\b(19\d{2}|20\d{2})\b", source))
    if len(years) >= 2:
        return "Pass"
    if years or journal.get("declared_schedule") or regularity_status == "Weak":
        return "Weak"
    return "Verification needed"


def _derive_scope_saturation(journal: dict, text_by_id: dict) -> str:
    keywords = _derive_scope_keywords(journal, text_by_id)
    return "Weak" if len(keywords) >= 5 and journal.get("subject_area") else "Verification needed"


def _derive_scope_keywords(journal: dict, text_by_id: dict) -> list[str]:
    source = " ".join(
        [
            journal.get("subject_area", ""),
            journal.get("scope_alignment_notes", ""),
            text_by_id.get("aims_scope_url", ""),
        ]
    ).lower()
    blocked = {"journal", "article", "articles", "scope", "research", "study", "studies", "field", "published", "publication"}
    output = []
    for word in re.findall(r"\b[a-z][a-z-]{4,}\b", source):
        if word not in blocked and word not in output:
            output.append(word)
        if len(output) >= 10:
            break
    return output


def _build_derived_checks(journal: dict, evidence: list[dict], confirmations: dict) -> dict:
    text_by_id = {item.get("id"): clean_html_text(item.get("captured_text", "")) for item in evidence}
    title = f"\"{journal.get('title')}\"" if journal.get("title") else "the journal title"
    return {
        "Publication regularity confirmation": confirmations.get("regular_publication", "Verification needed"),
        "References and metadata visibility": confirmations.get("metadata_completeness", "Verification needed"),
        "Dedicated journal website": confirmations.get("dedicated_website", "Verification needed"),
        "English homepage availability": confirmations.get("english_homepage", "Verification needed"),
        "PDF access confirmation": confirmations.get("online_content_access", "Verification needed"),
        "Similar title findings": f"Verification needed: manually search Scopus Sources for {title}.",
        "Scope saturation keywords": _derive_scope_keywords(journal, text_by_id),
        "Scope saturation rating": confirmations.get("scope_saturation", "Verification needed"),
    }


def _journal_text(journal: dict, keys: list[str]) -> str:
    return " ".join(str(journal.get(key, "")) for key in keys)


def _count_lines(value: str) -> int:
    return len([line for line in str(value or "").splitlines() if line.strip()])


def _fix_for(criterion_id: str, label: str) -> str:
    fixes = {
        "peer_review_content": "Publish a detailed peer review process page covering review model, screening, reviewer selection, revision, and editorial decisions.",
        "publication_ethics": "Publish or expand the publication ethics and malpractice statement to cover authorship, complaints, appeals, misconduct, conflicts of interest, data integrity, corrections, and retractions.",
        "valid_issn": "Verify the journal ISSN or e-ISSN and display the registered identifier consistently on the website and article pages.",
        "regular_publication": "Repair archive gaps and align actual issue publication with the declared schedule.",
        "publication_history": "Provide a clear archive showing enough published content and publication history for evaluation.",
        "english_titles_abstracts": "Ensure every sample article has an English title and English abstract on the landing page or PDF.",
        "online_content_access": "Ensure recent article landing pages and PDFs or full text open without login.",
        "english_homepage": "Provide an English homepage or English journal metadata and policy pages.",
        "dedicated_website": "Provide a dedicated journal website with homepage, archive, policies, editorial board, author guidelines, and articles.",
        "sample_content_ready": "Prepare three recent full issues or nine recent research or review articles with English abstracts.",
    }
    return fixes.get(criterion_id, f"Resolve the hard-gate issue: {label}.")


def _build_findings(evidence: list[dict]) -> list[dict]:
    findings = []
    for item in evidence:
        if item.get("detected_evidence"):
            findings.append({"field": item.get("label"), "signals": item.get("detected_evidence"), "confidence": item.get("confidence", "none")})
    return findings


def _summary(result: dict) -> str:
    if result["verdict"] == "Ready":
        return "The supplied evidence indicates strong readiness, subject to final human review and official Scopus evaluation."
    if result["verdict"] == "Nearly Ready":
        return "The supplied evidence indicates partial readiness. Address weak criteria and unresolved evidence before title suggestion."
    return "The supplied evidence shows material gaps. Resolve hard-fail gates and complete missing evidence before preparing a title suggestion."


def _dedupe(values: list[str]) -> list[str]:
    output = []
    for value in values:
        if value and value not in output:
            output.append(value)
    return output


def run_audit_json(payload_json: str) -> str:
    return json.dumps(run_audit(json.loads(payload_json)), ensure_ascii=False)


def extract_evidence_json(payload_json: str) -> str:
    payload = json.loads(payload_json)
    evidence = payload.get("evidence", [])
    for record in evidence:
        text = clean_html_text(record.get("captured_text", ""))
        signals = []
        for detector in [detect_peer_review_signals, detect_ethics_coverage, detect_genai_coverage, detect_transparency_coverage, detect_language_signals]:
            result = detector(text)
            signals.extend(result.get("matches", []))
        record["detected_evidence"] = sorted(set(signals))[:12]
        record["confidence"] = "medium" if record["detected_evidence"] else "none"
    return json.dumps({"evidence": evidence}, ensure_ascii=False)


def generate_report_json(payload_json: str) -> str:
    payload = json.loads(payload_json)
    audit_result = payload.get("audit_result") or run_audit(payload)
    markdown = build_report(audit_result, payload)
    return json.dumps({"markdown": markdown, "plain_text": markdown.replace("#", "")}, ensure_ascii=False)
