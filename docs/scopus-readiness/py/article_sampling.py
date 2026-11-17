def summarize_samples(samples: list[dict]) -> dict:
    total = len(samples)
    research_like = [
        item
        for item in samples
        if (item.get("article_type") or "").lower() in {"research article", "review article", "case report", "short communication"}
    ]
    english_ready = [
        item
        for item in samples
        if item.get("english_title") in {True, "Yes", "Pass"} and item.get("english_abstract") in {True, "Yes", "Pass"}
    ]
    return {
        "total": total,
        "research_or_review_count": len(research_like),
        "english_ready_count": len(english_ready),
        "status": "Pass" if len(research_like) >= 9 and len(english_ready) >= 9 else "Weak" if total else "Verification needed",
    }
