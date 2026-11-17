(function () {
  const MAX_RESPONSE_CHARS = 25000;
  const FETCH_TIMEOUT_MS = 9000;
  const requestCache = new Map();
  const runtimeConfig = {
    url_reader_endpoint: "",
    enable_public_cors_fallback: false
  };

  function setRuntimeConfig(config) {
    runtimeConfig.url_reader_endpoint = String(config?.url_reader_endpoint || "").trim();
    runtimeConfig.enable_public_cors_fallback = Boolean(config?.enable_public_cors_fallback);
  }

  function buildEvidenceRecord(field, value) {
    return {
      id: field.name,
      section: field.section || "Evidence",
      label: field.label,
      url: value || "",
      required: Boolean(field.required),
      fetch_status: value ? "pending" : field.required ? "not_provided" : "not_provided",
      source_type: "url",
      captured_text: "",
      detected_evidence: [],
      confidence: "none",
      user_confirmation: "Verification needed",
      score_impact: field.score_impact || "",
      notes: ""
    };
  }

  async function fetchEvidence(record) {
    if (!record.url) {
      return { ...record, fetch_status: "not_provided", notes: "No URL was provided." };
    }
    const cacheKey = buildCacheKey(record.url);
    const cached = requestCache.get(cacheKey);
    if (cached) return { ...record, ...cached, notes: appendNote(cached.notes, "Loaded from browser cache.") };

    const direct = await fetchReadableText(record.url, false);
    if (direct.ok) {
      const output = responseToRecord(record, direct, "Readable browser response.");
      requestCache.set(cacheKey, output);
      return output;
    }

    const attempts = [`Direct browser read failed (${direct.note}).`];
    let gateway = null;
    if (runtimeConfig.url_reader_endpoint) {
      gateway = await fetchViaUrlReader(record.url);
      if (gateway.ok) {
        const output = responseToRecord(record, gateway, `Readable via configured URL reader gateway after direct browser read failed.`);
        output.source_type = "url_reader_gateway";
        output.gateway_url = runtimeConfig.url_reader_endpoint;
        output.final_url = gateway.finalUrl || record.url;
        output.content_type = gateway.contentType || "";
        output.text_truncated = Boolean(gateway.truncated);
        requestCache.set(cacheKey, output);
        return output;
      }
      attempts.push(`URL reader gateway failed (${gateway.note}).`);
    } else {
      attempts.push("URL reader gateway is not configured.");
    }

    let proxied = null;
    if (shouldUsePublicCorsFallback()) {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(record.url)}`;
      proxied = await fetchReadableText(proxyUrl, true);
      if (proxied.ok) {
        const output = responseToRecord(record, proxied, "Readable via public CORS fallback after direct and gateway reads failed.");
        output.source_type = "proxy_url";
        output.proxy_url = proxyUrl;
        requestCache.set(cacheKey, output);
        return output;
      }
      attempts.push(`Public CORS fallback failed (${proxied.note}).`);
    }

    const failedType = failureStatus([direct, gateway, proxied]);
    return {
      ...record,
      fetch_status: failedType,
      notes: `${attempts.join(" ")} Paste public page text or upload saved HTML/TXT to complete this evidence.`
    };
  }

  function shouldUsePublicCorsFallback() {
    return runtimeConfig.enable_public_cors_fallback || !runtimeConfig.url_reader_endpoint;
  }

  async function fetchViaUrlReader(url) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS + 4000);
    try {
      const response = await fetch(runtimeConfig.url_reader_endpoint, {
        method: "POST",
        mode: "cors",
        credentials: "omit",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });
      const payload = await safeJson(response);
      if (!response.ok || !payload.ok) {
        return {
          ok: false,
          type: mapGatewayError(payload),
          note: payload.message || `HTTP ${response.status}`
        };
      }
      const text = cleanText(payload.text || "");
      if (!text || text.length < 80) {
        return { ok: false, type: "empty_or_unreadable", note: "The gateway returned little readable text." };
      }
      return {
        ok: true,
        type: "readable",
        text,
        contentType: payload.content_type || "",
        finalUrl: payload.final_url || url,
        title: payload.title || "",
        truncated: Boolean(payload.truncated),
        viaGateway: true
      };
    } catch (error) {
      return {
        ok: false,
        type: "gateway_error",
        note: error.name === "AbortError" ? "Request timed out." : "The configured URL reader gateway could not be reached."
      };
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function fetchReadableText(fetchUrl, viaProxy) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(fetchUrl, {
        mode: "cors",
        credentials: "omit",
        redirect: "follow",
        signal: controller.signal,
        headers: { Accept: "text/html,application/xhtml+xml,text/plain,application/pdf,*/*;q=0.8" }
      });
      if (!response.ok) {
        return { ok: false, type: "failed_url", note: `HTTP ${response.status}` };
      }
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/pdf")) {
        return { ok: false, type: "pdf_uploaded", note: "A PDF URL was detected. Paste relevant text in the evidence queue before scoring." };
      }
      const raw = await response.text();
      const text = cleanText(raw);
      if (!text || text.length < 80) {
        return { ok: false, type: "empty_or_unreadable", text, note: "The page returned little readable text." };
      }
      return { ok: true, type: "readable", text, contentType, viaProxy };
    } catch (error) {
      return { ok: false, type: viaProxy ? "proxy_error" : "blocked_by_cors", note: error.name === "AbortError" ? "Request timed out." : "Browser read was blocked or the network request failed." };
    } finally {
      window.clearTimeout(timer);
    }
  }

  function responseToRecord(record, response, note) {
    const detected = detectSignals(response.text);
    return {
      ...record,
      fetch_status: "readable",
      source_type: response.viaGateway ? "url_reader_gateway" : record.source_type,
      captured_text: response.text.slice(0, MAX_RESPONSE_CHARS),
      detected_evidence: detected.matches,
      confidence: detected.confidence,
      user_confirmation: detected.matches.length ? "Weak" : "Verification needed",
      notes: note
    };
  }

  async function safeJson(response) {
    try {
      return await response.json();
    } catch {
      return { ok: false, error_type: "fetch_failed", message: "The gateway returned a non-JSON response." };
    }
  }

  function mapGatewayError(payload) {
    const errorType = payload.error_type || "";
    const message = String(payload.message || "").toLowerCase();
    if (errorType === "unsupported_content_type" && message.includes("pdf")) return "pdf_uploaded";
    if (errorType === "unsupported_content_type") return "empty_or_unreadable";
    if (errorType === "http_error") return "failed_url";
    if (errorType === "empty_text") return "empty_or_unreadable";
    if (errorType === "timeout") return "blocked_by_cors";
    return "blocked_by_cors";
  }

  function failureStatus(results) {
    const types = results.filter(Boolean).map((result) => result.type);
    if (types.includes("pdf_uploaded")) return "pdf_uploaded";
    if (types.includes("failed_url")) return "failed_url";
    if (types.length && types.every((type) => ["empty_or_unreadable", "unsupported_content_type"].includes(type))) return "empty_or_unreadable";
    return "blocked_by_cors";
  }

  function buildCacheKey(url) {
    return [
      url,
      runtimeConfig.url_reader_endpoint || "no-gateway",
      runtimeConfig.enable_public_cors_fallback ? "public-fallback" : "no-public-fallback"
    ].join("|");
  }

  function cleanText(raw) {
    return String(raw || "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
  }

  function detectSignals(text) {
    const terms = [
      "aims and scope",
      "peer review",
      "reviewer",
      "double-blind",
      "single-blind",
      "publication ethics",
      "malpractice",
      "authorship",
      "conflict of interest",
      "plagiarism",
      "correction",
      "retraction",
      "abstract",
      "keywords",
      "doi",
      "editorial board",
      "open access",
      "creative commons",
      "article processing charge",
      "archive",
      "current issue",
      "issn"
    ];
    const lower = text.toLowerCase();
    const matches = terms.filter((term) => lower.includes(term));
    const confidence = matches.length >= 6 ? "high" : matches.length >= 3 ? "medium" : matches.length ? "low" : "none";
    return { matches, confidence };
  }

  function appendNote(existing, next) {
    return [existing, next].filter(Boolean).join(" ");
  }

  async function readEvidenceFile(file) {
    if (!file) return { text: "", status: "not_provided", notes: "" };
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      return {
        text: "",
        status: "pdf_uploaded",
        notes: `PDF file attached: ${file.name}. Paste relevant public text before scoring.`
      };
    }
    const text = await file.text();
    return {
      text: cleanText(text).slice(0, 25000),
      status: "file_uploaded",
      notes: `File uploaded: ${file.name}`
    };
  }

  window.ScopusEvidence = {
    buildEvidenceRecord,
    setRuntimeConfig,
    fetchEvidence,
    cleanText,
    detectSignals,
    readEvidenceFile
  };
})();
