(function () {
  const confirmationOptions = ["Pass", "Weak", "Fail", "Verification needed", "Not applicable"];
  const countryOptions = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
    "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
    "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
    "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
    "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait",
    "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
    "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru",
    "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
    "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
    "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
    "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
    "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];
  const asjcSubjectAreaOptions = [];

  const fieldSections = [
    {
      id: "section-journal",
      eyebrow: "Identity",
      title: "Journal Identity",
      fields: [
        { name: "title", scope: "journal", label: "Journal title", type: "text", required: true, help: "Use the official full title as shown on the website, article pages, PDFs, DOI metadata, and ISSN records." },
        { name: "homepage_url", scope: "journal", label: "Homepage URL", type: "url", required: true, help: "Use the journal homepage, not a publisher portal or faculty landing page." },
        { name: "publisher_name", scope: "journal", label: "Publisher name", type: "text", required: true, help: "Use the responsible publisher, institution, society, or academic unit." },
        { name: "publisher_country", scope: "journal", label: "Publisher country", type: "select", required: true, options: countryOptions, defaultValue: "Indonesia", help: "Select the country of the publisher's official address." },
        { name: "print_issn", scope: "journal", label: "Print ISSN", type: "text", required: false, help: "Use the format 1234-567X. Leave blank if there is no print edition." },
        { name: "online_issn", scope: "journal", label: "Online ISSN / e-ISSN", type: "text", required: true, help: "Use the registered online ISSN in the format 1234-567X." },
        { name: "current_title_start_year", scope: "journal", label: "Start year of current title", type: "number", required: true, help: "Use the year when the current title began, not a previous title." },
        {
          name: "publication_frequency",
          scope: "journal",
          label: "Publication frequency",
          type: "select",
          required: true,
          options: ["Annual", "Biannual", "Triannual", "Quarterly", "Bimonthly", "Monthly", "Continuous publication", "Other"],
          help: "Use the declared frequency shown on the journal website."
        },
        { name: "subject_area", scope: "journal", label: "Primary subject area", type: "select", required: true, options: asjcSubjectAreaOptions, help: "Select the closest ASJC subject area from the reference file." }
      ]
    },
    {
      id: "section-evidence",
      eyebrow: "Gate evidence",
      title: "Required Public Website URLs",
      fields: [
        { name: "aims_scope_url", scope: "evidence", label: "Aims and Scope URL", type: "url", required: true, section: "Required Scopus Gate Evidence", score_impact: "editorial_policy" },
        { name: "peer_review_url", scope: "evidence", label: "Peer Review Process URL", type: "url", required: true, section: "Required Scopus Gate Evidence", score_impact: "peer_review_content" },
        { name: "ethics_url", scope: "evidence", label: "Publication Ethics and Malpractice Statement URL", type: "url", required: true, section: "Required Scopus Gate Evidence", score_impact: "publication_ethics" },
        { name: "archive_url", scope: "evidence", label: "Archive URL", type: "url", required: true, section: "Required Scopus Gate Evidence", score_impact: "publication_history" },
        { name: "article_landing_urls", scope: "journal", label: "Article landing page sample URLs", type: "textarea", required: true, full: true, help: "Enter at least 9 recent research or review article landing pages, one URL per line." },
        { name: "article_fulltext_url", scope: "evidence", label: "Article full text or PDF evidence URL", type: "url", required: true, section: "Required Scopus Gate Evidence", score_impact: "online_content_access" }
      ]
    },
    {
      id: "section-policy",
      eyebrow: "Policies",
      title: "Journal Policy",
      fields: [
        { name: "editorial_policy_url", scope: "evidence", label: "Editorial Policy URL", type: "url", required: true, section: "Journal Policy", score_impact: "editorial_policy" },
        { name: "author_guidelines_url", scope: "evidence", label: "Author Guidelines URL", type: "url", required: true, section: "Journal Policy", score_impact: "transparency_principles" },
        { name: "oa_policy_url", scope: "evidence", label: "Open Access or Access Policy URL", type: "url", required: true, section: "Journal Policy", score_impact: "license_access_consistency" },
        { name: "license_url", scope: "evidence", label: "Copyright and Licensing URL", type: "url", required: true, section: "Journal Policy", score_impact: "license_access_consistency" },
        { name: "fees_url", scope: "evidence", label: "Article Processing Charge / Publication Fee URL", type: "url", required: true, section: "Journal Policy", score_impact: "transparency_principles" },
        { name: "genai_url", scope: "evidence", label: "Generative AI Policy URL", type: "url", required: false, section: "Journal Policy", score_impact: "genai_policy" }
      ]
    },
    {
      id: "section-people",
      eyebrow: "People",
      title: "People and Geodiversity",
      fields: [
        { name: "editorial_board_url", scope: "evidence", label: "Editorial Team / Editorial Board URL", type: "url", required: true, section: "People and Geodiversity", score_impact: "editor_geodiversity" },
        { name: "eic_name", scope: "journal", label: "Editor-in-Chief name", type: "text", required: true, help: "Use the name as shown on the editorial board page." },
        { name: "eic_profile_url", scope: "journal", label: "Editor-in-Chief public profile URL", type: "url", required: false, help: "Use an institutional profile, ORCID, Scopus Author Profile, or other relevant public academic profile." },
        { name: "reviewer_board_url", scope: "evidence", label: "Reviewer Board or Reviewer Acknowledgement URL", type: "url", required: false, section: "People and Geodiversity", score_impact: "editor_geodiversity" },
        { name: "people_notes", scope: "journal", label: "People and geodiversity notes", type: "textarea", required: false, full: true, help: "Paste editor or author country summaries if the website cannot be read directly." }
      ]
    },
    {
      id: "section-regularity",
      eyebrow: "Schedule",
      title: "Publishing Regularity",
      fields: [
        { name: "current_issue_url", scope: "evidence", label: "Current Issue URL", type: "url", required: true, section: "Publishing Regularity", score_impact: "regular_publication" },
        { name: "previous_issue_urls", scope: "journal", label: "Previous Issue URLs", type: "textarea", required: false, full: true, help: "Enter the last four issue URLs or all issues from the last two years, one URL per line." },
        { name: "declared_schedule", scope: "journal", label: "Declared publication schedule", type: "text", required: true, help: "Example: quarterly, twice a year in June and December, or continuous publication." }
      ]
    },
    {
      id: "section-content",
      eyebrow: "Content",
      title: "Content and Article Metadata",
      fields: [
        { name: "issue_urls", scope: "journal", label: "Issue URLs from the last two years", type: "textarea", required: true, full: true, help: "Enter issue URLs, one per line." },
        { name: "doi_evidence", scope: "journal", label: "DOI evidence", type: "textarea", required: false, full: true, help: "Enter article DOIs, one per line, if they cannot be extracted from article pages." },
        { name: "scope_alignment_notes", scope: "journal", label: "Scope alignment notes", type: "textarea", required: false, full: true, help: "Record in-scope, borderline, and off-scope article patterns." }
      ]
    },
    {
      id: "section-availability",
      eyebrow: "Availability",
      title: "Online Availability",
      fields: [
        { name: "contact_url", scope: "evidence", label: "Contact Page URL", type: "url", required: true, section: "Online Availability", score_impact: "contact_governance" },
        { name: "website_notes", scope: "journal", label: "Website functionality notes", type: "textarea", required: false, full: true, help: "Record broken links, redirects, empty pages, misleading badges, or mobile layout issues." }
      ]
    },
    {
      id: "section-standing",
      eyebrow: "Standing",
      title: "Title Uniqueness and Claims",
      fields: [
        { name: "indexing_url", scope: "evidence", label: "Indexing and Abstracting URL", type: "url", required: false, section: "Journal Standing", score_impact: "indexing_claims_accuracy" },
        { name: "metrics_url", scope: "evidence", label: "Metrics or citation claims URL", type: "url", required: false, section: "Journal Standing", score_impact: "indexing_claims_accuracy" }
      ]
    }
  ];

  function renderForm(container) {
    container.innerHTML = fieldSections.map(renderSection).join("");
  }

  function setSubjectAreaOptions(options) {
    asjcSubjectAreaOptions.splice(0, asjcSubjectAreaOptions.length, ...options);
  }

  function renderSection(section) {
    return `
      <section id="${section.id}" class="audit-section" aria-labelledby="${section.id}-title">
        <div class="section-heading">
          <div>
            <p class="scopus-eyebrow">${escapeHtml(section.eyebrow)}</p>
            <h2 id="${section.id}-title">${escapeHtml(section.title)}</h2>
          </div>
        </div>
        <div class="field-grid">
          ${section.fields.map(renderField).join("")}
        </div>
      </section>
    `;
  }

  function renderField(field) {
    const required = field.required ? `<span class="required-mark" aria-label="required">*</span>` : "";
    const help = field.help ? `<small>${escapeHtml(field.help)}</small>` : "";
    const classes = field.full || field.type === "textarea" ? "field full" : "field";
    let control = "";
    if (field.type === "select") {
      control = `<select id="${field.name}" name="${field.name}" data-scope="${field.scope}" ${field.required ? "required" : ""}>
        <option value="">Select one</option>
        ${(field.options || []).map((option) => `<option value="${escapeHtml(option)}" ${option === field.defaultValue ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
      </select>`;
    } else if (field.type === "textarea") {
      control = `<textarea id="${field.name}" name="${field.name}" data-scope="${field.scope}" ${field.required ? "required" : ""}></textarea>`;
    } else {
      control = `<input id="${field.name}" name="${field.name}" data-scope="${field.scope}" type="${field.type}" ${field.required ? "required" : ""} />`;
    }
    return `
      <div class="${classes}" data-field="${field.name}">
        <label for="${field.name}">${escapeHtml(field.label)}${required}</label>
        ${control}
        ${help}
      </div>
    `;
  }

  function renderEvidenceQueue(container, evidenceRecords) {
    const unresolved = evidenceRecords.filter((record) => isUnresolved(record));
    const count = document.getElementById("queueCount");
    if (count) count.textContent = `${unresolved.length} ${unresolved.length === 1 ? "item" : "items"}`;
    if (!unresolved.length) {
      container.className = "queue-list empty-state";
      container.innerHTML = "No unresolved required evidence items. Review the confirmation table before relying on the score.";
      return;
    }
    container.className = "queue-list";
    container.innerHTML = unresolved.map((record) => `
      <article class="queue-item" data-evidence-id="${escapeHtml(record.id)}">
        <div class="queue-item-header">
          <div>
            <h3>${escapeHtml(record.label)}</h3>
            <p>${escapeHtml(record.url || "No URL provided")}</p>
          </div>
          ${statusBadge(record.fetch_status)}
        </div>
        <div class="field full">
          <label for="manual-${escapeHtml(record.id)}">Paste evidence text</label>
          <textarea id="manual-${escapeHtml(record.id)}" data-manual-evidence="${escapeHtml(record.id)}" placeholder="Paste visible public page text here."></textarea>
          <small>Use this when direct browser reading is blocked, empty, or incomplete.</small>
        </div>
        <div class="field full">
          <label for="file-${escapeHtml(record.id)}">Upload saved HTML, TXT, or PDF</label>
          <input id="file-${escapeHtml(record.id)}" data-file-evidence="${escapeHtml(record.id)}" type="file" accept=".html,.htm,.txt,.pdf,text/html,text/plain,application/pdf" />
          <small>For PDF evidence, paste relevant text above before scoring.</small>
        </div>
        <div class="button-row">
          <button class="button secondary" type="button" data-mark-needed="${escapeHtml(record.id)}">Mark as verification needed</button>
          <button class="button primary" type="button" data-save-evidence="${escapeHtml(record.id)}">Save evidence</button>
        </div>
      </article>
    `).join("");
  }

  function renderConfirmationTable(container, criteria, confirmations, findingsByCriterion) {
    if (!criteria || !criteria.length) {
      container.className = "table-wrap empty-state";
      container.textContent = "Run the audit to review detected signals and confirm each criterion.";
      return;
    }
    container.className = "table-wrap";
    container.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Criterion</th>
            <th>Category</th>
            <th>Gate</th>
            <th>Detected signals</th>
            <th>Confirmation</th>
          </tr>
        </thead>
        <tbody>
          ${criteria.map((criterion) => {
            const value = confirmations[criterion.id] || "Verification needed";
            const signals = findingsByCriterion[criterion.id] || criterion.signals || [];
            return `
              <tr>
                <td><strong>${escapeHtml(criterion.label)}</strong></td>
                <td>${escapeHtml(criterion.category)}</td>
                <td>${criterion.hard_gate ? statusBadge("hard gate") : "Advisory"}</td>
                <td>${signals.length ? signals.map(escapeHtml).join(", ") : "No signal detected"}</td>
                <td>
                  <select data-confirmation="${escapeHtml(criterion.id)}">
                    ${confirmationOptions.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
                  </select>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    `;
  }

  function renderScoreSummary(container, auditResult) {
    if (!auditResult) {
      container.innerHTML = "";
      return;
    }
    const verdictClass = auditResult.verdict === "Ready" ? "ready" : auditResult.verdict === "Nearly Ready" ? "nearly-ready" : "gaps";
    const completeness = Math.round((auditResult.evidence_completeness || 0) * 100);
    container.innerHTML = `
      <div class="score-card">
        <span>Verdict</span>
        <strong>${escapeHtml(auditResult.verdict)}</strong>
        ${statusBadge(verdictClass)}
      </div>
      <div class="score-card">
        <span>Indicative score</span>
        <strong>${Number(auditResult.total_score || 0).toFixed(1)}</strong>
      </div>
      <div class="score-card">
        <span>Evidence completeness</span>
        <strong>${completeness}%</strong>
      </div>
      <div class="score-card">
        <span>Hard-fail gates</span>
        <strong>${(auditResult.hard_fails || []).length}</strong>
      </div>
    `;
  }

  function renderDerivedChecks(container, auditResult) {
    if (!auditResult || !auditResult.derived_checks) {
      container.innerHTML = "";
      return;
    }
    const checks = auditResult.derived_checks;
    container.innerHTML = Object.entries(checks).map(([label, value]) => `
      <div class="derived-card">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(Array.isArray(value) ? value.join(", ") : value || "-")}</strong>
      </div>
    `).join("");
  }

  function statusBadge(value) {
    const raw = String(value || "pending");
    const normalized = raw.toLowerCase().replace(/\s+/g, "-").replace(/_/g, "_");
    return `<span class="badge ${escapeHtml(normalized)}">${escapeHtml(raw.replace(/_/g, " "))}</span>`;
  }

  function isUnresolved(record) {
    return ["blocked_by_cors", "failed_url", "empty_or_unreadable", "not_provided", "pending", "pdf_uploaded"].includes(record.fetch_status);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  window.ScopusUI = {
    confirmationOptions,
    fieldSections,
    setSubjectAreaOptions,
    renderForm,
    renderEvidenceQueue,
    renderConfirmationTable,
    renderScoreSummary,
    renderDerivedChecks,
    statusBadge,
    escapeHtml
  };
})();
