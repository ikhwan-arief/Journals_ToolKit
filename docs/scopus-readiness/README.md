# Scopus Readiness Auditor

Static GitHub Pages application for an evidence-first self-audit before preparing a Scopus title suggestion.

## Runtime

- Runs entirely in the browser.
- Attempts browser-side URL fetch for public pages.
- Retries public pages through a configured Cloudflare Worker URL reader gateway when direct browser reads are blocked.
- Public CORS fallback is enabled as a temporary emergency fallback until a Cloudflare Worker endpoint is configured.
- Uses an Evidence Completion Queue when pages are still blocked, fail, or return unreadable content.
- Loads the Primary subject area dropdown from broad ASJC codes `10-36` generated from `refs/ASJC.xlsx`.
- Loads Pyodide when available and falls back to a JavaScript audit engine when Pyodide cannot be loaded.
- Does not use a database, login, API key, server-side crawler, or remote storage. The optional URL reader gateway only extracts text from public URLs.

## URL Reader Gateway

The default runtime config leaves the gateway disabled and enables public fallback temporarily:

```json
{
  "url_reader_endpoint": "",
  "enable_public_cors_fallback": true
}
```

Deploy `cloudflare/url-reader/` to Cloudflare Workers, then set `url_reader_endpoint` to the deployed `/read-url` endpoint. After the Worker is stable, set `enable_public_cors_fallback` to `false`.

## Language Rule

All application UI and generated reports are English. User-supplied evidence may be Indonesian or English.

## Local Test

```bash
cd docs
python3 -m http.server 8765
```

Open:

```text
http://127.0.0.1:8765/scopus-readiness/
```
