WEIGHTS = {
    "Journal Policy": 25,
    "Content": 20,
    "Journal Standing": 35,
    "Publishing Regularity": 10,
    "Online Availability": 10,
}

READY_MIN = 85
NEARLY_READY_MIN = 70

HARD_GATES = {
    "valid_issn",
    "peer_review_content",
    "regular_publication",
    "publication_history",
    "english_titles_abstracts",
    "publication_ethics",
    "online_content_access",
    "english_homepage",
    "dedicated_website",
    "sample_content_ready",
}

CONFIRMATION_SCORES = {
    "Pass": 5,
    "Weak": 3,
    "Verification needed": 0,
    "Fail": 0,
    "Not applicable": None,
}

DISCLAIMER = (
    "This audit is an indicative self-assessment based on the evidence you provide. "
    "It is not an official Scopus, Elsevier, or CSAB evaluation and does not guarantee "
    "acceptance for Scopus coverage."
)
