(function () {
  const state = {
    rules: null,
    pyEngine: null,
    journal: {},
    operational: {},
    evidence: [],
    confirmations: {},
    auditResult: null,
    reportMarkdown: "",
    runtimeConfig: {
      url_reader_endpoint: "",
      enable_public_cors_fallback: false
    }
  };

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    const [rules, subjectAreas, runtimeConfig] = await Promise.all([loadRules(), loadSubjectAreas(), loadRuntimeConfig()]);
    state.rules = rules;
    state.runtimeConfig = runtimeConfig;
    ScopusEvidence.setRuntimeConfig(runtimeConfig);
    ScopusUI.setSubjectAreaOptions(subjectAreas);
    ScopusUI.renderForm(document.getElementById("formSections"));
    bindEvents();
    setEngineStatus("Loading audit engine", "The app runs in your browser and uses a JavaScript fallback if Pyodide is unavailable.");
    ScopusPyodide.loadPythonEngine(setEngineStatus).then((engine) => {
      state.pyEngine = engine;
    });
  }

  function bindEvents() {
    document.getElementById("auditForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      await runEvidenceAcquisition();
    });
    document.getElementById("resetButton").addEventListener("click", resetAudit);
    document.getElementById("evidenceQueue").addEventListener("click", handleQueueClick);
    document.getElementById("evidenceQueue").addEventListener("change", handleQueueFileChange);
    document.getElementById("confirmationTable").addEventListener("change", handleConfirmationChange);
    document.getElementById("copyReportButton").addEventListener("click", copyReport);
    document.getElementById("downloadMarkdownButton").addEventListener("click", () => downloadReport("markdown"));
    document.getElementById("downloadTxtButton").addEventListener("click", () => downloadReport("txt"));
    document.getElementById("printButton").addEventListener("click", () => window.print());
  }

  async function loadRules() {
    const response = await fetch("data/scopus_rules.json");
    if (!response.ok) throw new Error("Cannot load Scopus rules.");
    return response.json();
  }

  async function loadSubjectAreas() {
    try {
      const response = await fetch("data/asjc_subject_areas.json");
      if (!response.ok) throw new Error("Cannot load ASJC subject areas.");
      const rows = await response.json();
      return rows
        .filter((row) => Number(row.code) >= 10 && Number(row.code) <= 36)
        .map((row) => row.label)
        .filter(Boolean);
    } catch (error) {
      console.warn("[Scopus Readiness Auditor] ASJC subject areas could not be loaded. Using minimal fallback options.", error);
      return ["10 - Multidisciplinary", "22 - Engineering", "33 - Social Sciences"];
    }
  }

  async function loadRuntimeConfig() {
    try {
      const response = await fetch("data/runtime_config.json");
      if (!response.ok) throw new Error("Cannot load runtime config.");
      const config = await response.json();
      return {
        url_reader_endpoint: String(config.url_reader_endpoint || "").trim(),
        enable_public_cors_fallback: Boolean(config.enable_public_cors_fallback)
      };
    } catch (error) {
      console.warn("[Scopus Readiness Auditor] Runtime config could not be loaded. URL reader gateway is disabled.", error);
      return {
        url_reader_endpoint: "",
        enable_public_cors_fallback: false
      };
    }
  }

  async function runEvidenceAcquisition() {
    const form = document.getElementById("auditForm");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    collectFormState();
    setActionBusy(true);
    try {
      const records = buildEvidenceRecords();
      const fetched = [];
      for (const record of records) {
        const previous = state.evidence.find((item) => item.id === record.id && item.url === record.url);
        if (previous && ["manual_text_added", "file_uploaded"].includes(previous.fetch_status)) {
          fetched.push(previous);
        } else if (!record.url) {
          fetched.push(record);
        } else {
          fetched.push(await ScopusEvidence.fetchEvidence(record));
        }
      }
      state.evidence = fetched;
      await evaluateAudit();
    } finally {
      setActionBusy(false);
    }
  }

  function collectFormState() {
    state.journal = {};
    state.operational = {};
    for (const field of allFields()) {
      const node = document.getElementById(field.name);
      if (!node) continue;
      const value = node.value.trim();
      if (field.scope === "operational") {
        state.operational[field.name] = value;
      } else if (field.scope === "journal") {
        state.journal[field.name] = value;
      }
    }
    state.journal.article_sample_urls = state.journal.article_landing_urls || "";
  }

  function buildEvidenceRecords() {
    const records = [];
    const homepageField = {
      name: "homepage_url",
      label: "Homepage URL",
      section: "Journal Identity",
      required: true,
      score_impact: "english_homepage"
    };
    records.push(ScopusEvidence.buildEvidenceRecord(homepageField, state.journal.homepage_url));
    for (const field of allFields().filter((item) => item.scope === "evidence")) {
      const node = document.getElementById(field.name);
      records.push(ScopusEvidence.buildEvidenceRecord(field, node ? node.value.trim() : ""));
    }
    return records;
  }

  async function evaluateAudit() {
    const findingsByCriterion = buildFindingsByCriterion(state.evidence);
    const inferred = inferConfirmations(findingsByCriterion);
    state.confirmations = { ...inferred, ...state.confirmations };
    const payload = {
      journal: state.journal,
      operational: state.operational,
      evidence: state.evidence.map((record) => ({
        ...record,
        user_confirmation: state.confirmations[record.score_impact] || record.user_confirmation || "Verification needed"
      })),
      confirmations: state.confirmations,
      rules: state.rules
    };
    let result = null;
    if (state.pyEngine && state.pyEngine.ready) {
      try {
        result = state.pyEngine.runAudit(payload);
      } catch (error) {
        result = runAuditFallback(payload);
      }
    } else {
      result = runAuditFallback(payload);
    }
    state.auditResult = result;
    state.reportMarkdown = result.report_markdown || buildReportFallback(result, payload);
    renderAll(findingsByCriterion);
  }

  function renderAll(findingsByCriterion) {
    ScopusUI.renderEvidenceQueue(document.getElementById("evidenceQueue"), state.evidence);
    ScopusUI.renderConfirmationTable(document.getElementById("confirmationTable"), state.rules.criteria, state.confirmations, findingsByCriterion || buildFindingsByCriterion(state.evidence));
    ScopusUI.renderScoreSummary(document.getElementById("scoreSummary"), state.auditResult);
    ScopusUI.renderDerivedChecks(document.getElementById("derivedChecks"), state.auditResult);
    document.getElementById("reportOutput").value = state.reportMarkdown || "";
    const hasReport = Boolean(state.reportMarkdown);
    for (const id of ["copyReportButton", "downloadMarkdownButton", "downloadTxtButton", "printButton"]) {
      document.getElementById(id).disabled = !hasReport;
    }
  }

  async function handleQueueClick(event) {
    const saveId = event.target.closest("[data-save-evidence]")?.dataset.saveEvidence;
    const markId = event.target.closest("[data-mark-needed]")?.dataset.markNeeded;
    if (saveId) {
      await saveManualEvidence(saveId);
    }
    if (markId) {
      const record = state.evidence.find((item) => item.id === markId);
      if (record) {
        record.user_confirmation = "Verification needed";
        record.notes = appendNote(record.notes, "User marked this item as requiring verification.");
      }
      await evaluateAudit();
    }
  }

  async function handleQueueFileChange(event) {
    const id = event.target.dataset.fileEvidence;
    if (!id) return;
    const record = state.evidence.find((item) => item.id === id);
    if (!record) return;
    const file = event.target.files[0];
    const fileEvidence = await ScopusEvidence.readEvidenceFile(file);
    record.fetch_status = fileEvidence.status;
    record.source_type = fileEvidence.status === "pdf_uploaded" ? "pdf_uploaded" : "file_uploaded";
    record.captured_text = fileEvidence.text || record.captured_text;
    record.notes = appendNote(record.notes, fileEvidence.notes);
    if (fileEvidence.text) {
      const detected = ScopusEvidence.detectSignals(fileEvidence.text);
      record.detected_evidence = detected.matches;
      record.confidence = detected.confidence;
    }
    ScopusUI.renderEvidenceQueue(document.getElementById("evidenceQueue"), state.evidence);
  }

  async function saveManualEvidence(id) {
    const record = state.evidence.find((item) => item.id === id);
    if (!record) return;
    const textarea = document.querySelector(`[data-manual-evidence="${CSS.escape(id)}"]`);
    const text = ScopusEvidence.cleanText(textarea ? textarea.value : "");
    if (!text) {
      record.notes = appendNote(record.notes, "No pasted evidence text was provided.");
      ScopusUI.renderEvidenceQueue(document.getElementById("evidenceQueue"), state.evidence);
      return;
    }
    const detected = ScopusEvidence.detectSignals(text);
    record.fetch_status = "manual_text_added";
    record.source_type = "manual_text";
    record.captured_text = text.slice(0, 25000);
    record.detected_evidence = detected.matches;
    record.confidence = detected.confidence;
    record.user_confirmation = detected.matches.length ? "Weak" : "Verification needed";
    record.notes = appendNote(record.notes, "Manual evidence text was added by the user.");
    await evaluateAudit();
  }

  function handleConfirmationChange(event) {
    const id = event.target.dataset.confirmation;
    if (!id) return;
    state.confirmations[id] = event.target.value;
    evaluateAudit();
  }

  function inferConfirmations(findingsByCriterion) {
    const inferred = {};
    const criteria = state.rules.criteria || [];
    for (const criterion of criteria) {
      inferred[criterion.id] = "Verification needed";
    }
    inferred.valid_issn = [state.journal.online_issn, state.journal.print_issn].some(isValidIssn) ? "Pass" : "Verification needed";
    inferred.dedicated_website = deriveDedicatedWebsite();
    inferred.english_homepage = deriveEnglishHomepage();
    inferred.online_content_access = derivePdfAccess();
    inferred.regular_publication = derivePublicationRegularity();
    inferred.metadata_completeness = deriveMetadataVisibility();
    inferred.scope_saturation = deriveScopeSaturation();
    inferred.sample_content_ready = countLines(state.journal.article_sample_urls) >= 9 ? "Pass" : countLines(state.journal.article_sample_urls) >= 3 ? "Weak" : "Verification needed";

    for (const [criterionId, signals] of Object.entries(findingsByCriterion)) {
      if (!signals.length) continue;
      if (["peer_review_content", "publication_ethics", "editorial_policy", "transparency_principles", "genai_policy", "contact_governance", "indexing_claims_accuracy", "license_access_consistency"].includes(criterionId)) {
        inferred[criterionId] = signals.length >= 4 ? "Pass" : "Weak";
      }
    }

    const archiveRecord = state.evidence.find((record) => record.id === "archive_url");
    if (archiveRecord && ["readable", "manual_text_added", "file_uploaded"].includes(archiveRecord.fetch_status)) {
      const years = (archiveRecord.captured_text.match(/\b(19\d{2}|20\d{2})\b/g) || []);
      inferred.publication_history = new Set(years).size >= 2 ? "Pass" : "Verification needed";
      inferred.archive_regular = years.length ? "Weak" : "Verification needed";
    }

    const articleEvidence = [state.journal.article_landing_urls, state.journal.doi_evidence, state.journal.scope_alignment_notes, combinedEvidenceText()].join("\n").toLowerCase();
    if (articleEvidence.includes("abstract") || inferred.metadata_completeness === "Pass") {
      inferred.english_titles_abstracts = inferred.metadata_completeness === "Pass" ? "Pass" : "Weak";
      inferred.abstract_clarity = inferred.english_titles_abstracts;
    }
    inferred.title_uniqueness = "Verification needed";
    if (deriveScopeKeywords().length) inferred.scope_fit = "Weak";
    if (state.journal.eic_profile_url) inferred.editor_standing = "Weak";
    if (state.journal.people_notes) {
      inferred.editor_geodiversity = "Weak";
      inferred.author_geodiversity = "Weak";
    }
    return inferred;
  }

  function deriveDedicatedWebsite() {
    const requiredIds = ["homepage_url", "aims_scope_url", "peer_review_url", "ethics_url", "archive_url", "editorial_board_url", "contact_url"];
    const provided = requiredIds.filter((id) => {
      if (id === "homepage_url") return Boolean(state.journal.homepage_url);
      return state.evidence.some((record) => record.id === id && record.url);
    }).length;
    return provided >= 6 ? "Pass" : provided >= 4 ? "Weak" : "Verification needed";
  }

  function deriveEnglishHomepage() {
    const homepage = state.evidence.find((record) => record.id === "homepage_url");
    const text = [homepage?.captured_text || "", combinedEvidenceText()].join(" ").toLowerCase();
    const signals = ["abstract", "aims and scope", "author guidelines", "editorial board", "publication ethics", "current issue"];
    const count = signals.filter((signal) => text.includes(signal)).length;
    return count >= 3 ? "Pass" : count > 0 ? "Weak" : "Verification needed";
  }

  function derivePdfAccess() {
    const text = [state.journal.article_landing_urls, state.journal.doi_evidence, combinedEvidenceText()].join(" ").toLowerCase();
    const fullTextRecord = state.evidence.find((record) => record.id === "article_fulltext_url");
    if (fullTextRecord && fullTextRecord.url && fullTextRecord.fetch_status === "readable") return "Pass";
    if (text.includes(".pdf") || text.includes("full text") || text.includes("download pdf")) return "Weak";
    return "Verification needed";
  }

  function derivePublicationRegularity() {
    const archiveText = state.evidence.find((record) => record.id === "archive_url")?.captured_text || "";
    const issueText = state.evidence.find((record) => record.id === "current_issue_url")?.captured_text || "";
    const years = new Set(`${archiveText} ${issueText} ${state.journal.previous_issue_urls || ""}`.match(/\b(19\d{2}|20\d{2})\b/g) || []);
    if (years.size >= 2) return "Pass";
    if (years.size === 1 || state.journal.declared_schedule) return "Weak";
    return "Verification needed";
  }

  function deriveMetadataVisibility() {
    const text = [combinedEvidenceText(), state.journal.doi_evidence, state.journal.scope_alignment_notes].join(" ").toLowerCase();
    const signals = ["abstract", "keyword", "doi", "author", "affiliation", "received", "accepted", "published", "references"];
    const count = signals.filter((signal) => text.includes(signal)).length;
    return count >= 5 ? "Pass" : count >= 2 ? "Weak" : "Verification needed";
  }

  function deriveScopeSaturation() {
    const keywords = deriveScopeKeywords();
    if (keywords.length >= 5 && state.journal.subject_area) return "Weak";
    return "Verification needed";
  }

  function deriveScopeKeywords() {
    const source = [state.journal.subject_area, state.journal.scope_alignment_notes, state.evidence.find((record) => record.id === "aims_scope_url")?.captured_text || ""].join(" ");
    const words = source.toLowerCase().match(/\b[a-z][a-z-]{4,}\b/g) || [];
    const blocked = new Set(["journal", "article", "articles", "scope", "research", "study", "studies", "field", "published", "publication"]);
    return Array.from(new Set(words.filter((word) => !blocked.has(word)))).slice(0, 10);
  }

  function combinedEvidenceText() {
    return state.evidence.map((record) => record.captured_text || "").join(" ");
  }

  function buildFindingsByCriterion(evidence) {
    const output = {};
    for (const record of evidence) {
      if (!record.score_impact) continue;
      output[record.score_impact] = Array.from(new Set([...(output[record.score_impact] || []), ...(record.detected_evidence || [])]));
    }
    return output;
  }

  function runAuditFallback(payload) {
    const criteria = payload.rules.criteria || [];
    const weights = payload.rules.weights || {};
    const scores = payload.rules.confirmation_scores || {};
    const categoryValues = {};
    const hardGateResults = [];
    const hardFails = [];
    const priorityFixes = [];
    const needsEvidence = [];

    for (const criterion of criteria) {
      const confirmation = payload.confirmations[criterion.id] || "Verification needed";
      const value = scores[confirmation];
      if (value !== null && value !== undefined) {
        categoryValues[criterion.category] = categoryValues[criterion.category] || [];
        categoryValues[criterion.category].push(value);
      }
      if (criterion.hard_gate) {
        const failed = confirmation === "Fail" || confirmation === "Verification needed";
        const gate = {
          id: criterion.id,
          label: criterion.label,
          status: failed ? "Fail" : confirmation,
          notes: failed ? "Hard gate requires confirmed evidence." : ""
        };
        hardGateResults.push(gate);
        if (failed) {
          hardFails.push(gate);
          priorityFixes.push(fixForCriterion(criterion.id, criterion.label));
        }
      }
    }

    const categoryScores = {};
    for (const [category, weight] of Object.entries(weights)) {
      const values = categoryValues[category] || [];
      categoryScores[category] = values.length ? round((sum(values) / values.length) / 5 * weight) : 0;
    }
    const totalScore = round(sum(Object.values(categoryScores)));
    const requiredEvidence = payload.evidence.filter((record) => record.required);
    const confirmedEvidence = requiredEvidence.filter((record) => ["readable", "manual_text_added", "file_uploaded"].includes(record.fetch_status) || ["Pass", "Weak"].includes(record.user_confirmation));
    for (const record of requiredEvidence) {
      if (["blocked_by_cors", "failed_url", "empty_or_unreadable", "not_provided", "pending", "pdf_uploaded"].includes(record.fetch_status)) {
        needsEvidence.push(`${record.label}: ${record.fetch_status.replace(/_/g, " ")}`);
      }
    }
    const evidenceCompleteness = requiredEvidence.length ? confirmedEvidence.length / requiredEvidence.length : 0;
    if (evidenceCompleteness < 0.8) {
      priorityFixes.push("Complete unresolved required evidence items before treating the score as reliable.");
    }
    const verdict = hardFails.length || totalScore < 70 ? "Gaps" : totalScore >= 85 ? "Ready" : "Nearly Ready";
    const result = {
      verdict,
      total_score: totalScore,
      weights,
      hard_fails: hardFails,
      hard_gate_results: hardGateResults,
      category_scores: categoryScores,
      evidence_completeness: evidenceCompleteness,
      findings: [],
      priority_fixes: Array.from(new Set(priorityFixes)).slice(0, 7),
      needs_evidence: needsEvidence,
      confirmations: payload.confirmations,
      derived_checks: buildDerivedChecks(payload, payload.confirmations),
      summary: summaryForVerdict(verdict)
    };
    result.report_markdown = buildReportFallback(result, payload);
    return result;
  }

  function buildReportFallback(result, payload) {
    const lines = [
      "# Scopus Readiness Auditor Report",
      "",
      `Journal name: ${payload.journal.title || "-"}`,
      `Homepage URL: ${payload.journal.homepage_url || "-"}`,
      `Publisher: ${payload.journal.publisher_name || "-"}`,
      `Verdict: ${result.verdict}`,
      `Indicative score: ${Number(result.total_score || 0).toFixed(1)}`,
      `Evidence completeness: ${Math.round((result.evidence_completeness || 0) * 100)}%`,
      "",
      "## Summary",
      result.summary,
      "",
      "## Hard-fail gates",
      "| Gate | Status | Notes |",
      "|---|---|---|",
      ...result.hard_gate_results.map((gate) => `| ${gate.label} | ${gate.status} | ${gate.notes || ""} |`),
      "",
      "## Scorecard",
      "| Category | Score | Weight |",
      "|---|---:|---:|",
      ...Object.entries(result.category_scores).map(([category, score]) => `| ${category} | ${Number(score).toFixed(1)} | ${payload.rules.weights[category] || 0} |`),
      "",
      "## Required evidence",
      "| Field | URL | Fetch status | Confirmation | Notes |",
      "|---|---|---|---|---|",
      ...payload.evidence.filter((record) => record.required).map((record) => `| ${record.label} | ${record.url || "-"} | ${record.fetch_status} | ${record.user_confirmation || "-"} | ${record.notes || ""} |`),
      "",
      "## Derived application findings",
      "| Finding | Result |",
      "|---|---|",
      ...Object.entries(result.derived_checks || {}).map(([label, value]) => `| ${label} | ${Array.isArray(value) ? value.join(", ") : value || "-"} |`),
      "",
      "## Priority fixes",
      ...(result.priority_fixes.length ? result.priority_fixes.map((fix, index) => `${index + 1}. ${fix}`) : ["No priority fixes were generated from the supplied evidence."]),
      "",
      "## Needs evidence",
      ...(result.needs_evidence.length ? result.needs_evidence.map((item) => `- ${item}`) : ["No unresolved required evidence items were found."]),
      "",
      "## Disclaimer",
      "This audit is an indicative self-assessment based on the evidence you provide. It is not an official Scopus, Elsevier, or CSAB evaluation and does not guarantee acceptance for Scopus coverage."
    ];
    return lines.join("\n");
  }

  function fixForCriterion(id, label) {
    const fixes = {
      peer_review_content: "Publish a detailed peer review process page covering review model, screening, reviewer selection, revision, and editorial decisions.",
      publication_ethics: "Publish or expand the publication ethics and malpractice statement to cover authorship, complaints, appeals, misconduct, conflicts of interest, data integrity, corrections, and retractions.",
      valid_issn: "Verify the ISSN or e-ISSN and display the registered identifier consistently on the website and article pages.",
      regular_publication: "Repair archive gaps and align actual issue publication with the declared schedule.",
      publication_history: "Provide a clear archive showing enough published content and publication history for evaluation.",
      english_titles_abstracts: "Ensure every sample article has an English title and English abstract on the landing page or PDF.",
      online_content_access: "Ensure recent article landing pages and PDFs or full text open without login.",
      english_homepage: "Provide an English homepage or English journal metadata and policy pages.",
      dedicated_website: "Provide a dedicated journal website with homepage, archive, policies, editorial board, author guidelines, and articles.",
      sample_content_ready: "Prepare three recent full issues or nine recent research or review articles with English abstracts."
    };
    return fixes[id] || `Resolve the hard-gate issue: ${label}.`;
  }

  function summaryForVerdict(verdict) {
    if (verdict === "Ready") return "The supplied evidence indicates strong readiness, subject to final human review and official Scopus evaluation.";
    if (verdict === "Nearly Ready") return "The supplied evidence indicates partial readiness. Address weak criteria and unresolved evidence before title suggestion.";
    return "The supplied evidence shows material gaps. Resolve hard-fail gates and complete missing evidence before preparing a title suggestion.";
  }

  function resetAudit() {
    document.getElementById("auditForm").reset();
    state.journal = {};
    state.operational = {};
    state.evidence = [];
    state.confirmations = {};
    state.auditResult = null;
    state.reportMarkdown = "";
    ScopusUI.renderEvidenceQueue(document.getElementById("evidenceQueue"), []);
    ScopusUI.renderConfirmationTable(document.getElementById("confirmationTable"), [], {}, {});
    ScopusUI.renderScoreSummary(document.getElementById("scoreSummary"), null);
    ScopusUI.renderDerivedChecks(document.getElementById("derivedChecks"), null);
    document.getElementById("reportOutput").value = "";
    for (const id of ["copyReportButton", "downloadMarkdownButton", "downloadTxtButton", "printButton"]) {
      document.getElementById(id).disabled = true;
    }
  }

  async function copyReport() {
    if (!state.reportMarkdown) return;
    await navigator.clipboard.writeText(state.reportMarkdown);
  }

  function downloadReport(type) {
    if (!state.reportMarkdown) return;
    const extension = type === "markdown" ? "md" : "txt";
    const text = type === "markdown" ? state.reportMarkdown : state.reportMarkdown.replace(/^#+\s*/gm, "");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `scopus_readiness_report.${extension}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function setActionBusy(isBusy) {
    const button = document.getElementById("runAuditButton");
    button.disabled = isBusy;
    button.textContent = isBusy ? "Reading evidence..." : "Run Scopus Readiness Audit";
  }

  function setEngineStatus(title, detail, failed) {
    const level = failed ? "warn" : "debug";
    console[level](`[Scopus Readiness Auditor] ${title}: ${detail}`);
  }

  function buildDerivedChecks(payload, confirmations) {
    const title = payload.journal.title ? `"${payload.journal.title}"` : "the journal title";
    return {
      "Publication regularity confirmation": confirmations.regular_publication || "Verification needed",
      "References and metadata visibility": confirmations.metadata_completeness || "Verification needed",
      "Dedicated journal website": confirmations.dedicated_website || "Verification needed",
      "English homepage availability": confirmations.english_homepage || "Verification needed",
      "PDF access confirmation": confirmations.online_content_access || "Verification needed",
      "Similar title findings": `Verification needed: manually search Scopus Sources for ${title}.`,
      "Scope saturation keywords": deriveScopeKeywords(),
      "Scope saturation rating": confirmations.scope_saturation || "Verification needed"
    };
  }

  function allFields() {
    return ScopusUI.fieldSections.flatMap((section) => section.fields);
  }

  function normalizeConfirmation(value) {
    return value || "Verification needed";
  }

  function countLines(value) {
    return String(value || "").split(/\r?\n/).filter((line) => line.trim()).length;
  }

  function isValidIssn(value) {
    const text = String(value || "").trim().toUpperCase();
    if (!/^\d{4}-\d{3}[\dX]$/.test(text)) return false;
    const digits = text.replace("-", "");
    const total = digits.split("").reduce((acc, char, index) => {
      const number = char === "X" ? 10 : Number(char);
      return acc + number * (8 - index);
    }, 0);
    return total % 11 === 0;
  }

  function appendNote(existing, next) {
    return [existing, next].filter(Boolean).join(" ");
  }

  function sum(values) {
    return values.reduce((total, value) => total + Number(value || 0), 0);
  }

  function round(value) {
    return Math.round(Number(value || 0) * 10) / 10;
  }
})();
