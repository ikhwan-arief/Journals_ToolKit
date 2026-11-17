# Instructions for @plugin-creator: DOAJ Pre-Assessment Pilot

Create or maintain the local, skills-only plugin package in the new
doaj-preassessment/ directory beside this file. The package is an independent
pilot for journal editors preparing an application to the Directory of Open
Access Journals. It must not claim to be made, endorsed, or operated by DOAJ.

## Design inputs

Read these three source documents in this directory before changing the package:

1. DOAJ-AI-PreAssessment-URD.docx — user needs and requirement identifiers.
2. DOAJ-AI-PreAssessment-PRD.md — product scope, releases, and user journey.
3. DOAJ-PreAssessment-Rulebook.md — rule IDs, levels, source mapping, explanations, and suggested corrections.

They are stakeholder proposals, not official DOAJ documents. Preserve the
originals. The separate DOAJ-AI-Application-Form-URD.docx is outside this
package's source set.

## Package to produce

Use the plugin-creator compatibility layout. Set the plugin name to
doaj-preassessment and the version to 0.1.0. Include:

- .codex-plugin/plugin.json with honest independent-pilot metadata and a
  skills path.
- skills/doaj-preassessment/SKILL.md with the URL-only assessment workflow.
- skills/doaj-preassessment/references/baseline.md with the frozen source
  versions and update procedure.
- skills/doaj-preassessment/references/criteria-map.md with rule IDs, levels,
  source sections, and rulebook-based action guidance.
- skills/doaj-preassessment/references/form-map.md with every application-form
  question in version 3.1 order.
- skills/doaj-preassessment/assets/report-template.md for the user output.
- README.md and CHANGELOG.md at the plugin root.

Do not create an MCP server, .mcp.json, .app.json, a Python service, a
dependency manifest, a hook, or a marketplace entry. The package must remain
usable as instructions and resources inside ChatGPT. Do not advertise an
automated crawler or an official eligibility decision.

## Frozen criteria contract

Bundle the source baseline recorded in the rulebook:

- Guide to applying, version 2.9.
- DOAJ application form, reference PDF version 3.1, January 2026.
- Principles of Transparency and Best Practice, version 4.0, September 2022.
- Proposed rulebook data version 2026.10.0.

An assessment reads these packaged references. It does not fetch DOAJ guidance
to detect changes at runtime. It may show official source URLs for the reader,
but a changed live page must not silently alter the assessment baseline.
Stamp the plugin version and all four baseline versions on every report.

## Editor workflow

Accept one journal homepage URL. Use only ChatGPT browsing and document-reading
capabilities that are actually available in the session. Read reachable journal
policies, recent articles, and relevant public registry records. For each
finding, name the rule, criterion level, result, exact journal or registry
URL, a short supporting quote when one is available, and a rulebook-based
suggested action. Distinguish requirements, recommendations, best practices,
principles, and matters for DOAJ review.

Never turn an unseen page, an incomplete article sample, an inaccessible PDF,
an unavailable registry, or a value marked TBD by DOAJ into a pass. Mark it
unverifiable or for DOAJ review and explain why. Do not request uploads or
other inputs as a fallback. If browsing is unavailable, explain that a
URL-only assessment cannot run in that session.

Build a form guide in version 3.1 question order. FQ-01 through FQ-18 are
groups of official questions; expand them into individual fields. FQ-19 and
FQ-20 are internal extraction checks, not questions in the official form.
Do not supply an application answer without evidence. Treat subject keywords
as suggestions, and leave the final accuracy declaration to the editor.

Never fill in or submit the official DOAJ application, draft journal policies,
predict acceptance, claim comprehensive crawling, claim stored snapshots, or
claim incremental re-checking. A later check reads the site again using the
same bundled baseline.

## Maintenance and validation

Update criteria only in a new package version after a maintainer compares a
new official DOAJ release with the frozen baseline. Review the baseline,
criteria map, form map, skill instructions, and report wording together;
record the update in CHANGELOG.md.

Run the plugin manifest validator and the skill quick validator. Evaluate
direct and indirect activation, missing or conflicting evidence, unreadable
PDFs, an incomplete article sample, unavailable browsing, and a request for
the latest criteria. The plugin must retain the frozen baseline and disclose
the limits of what it observed. This instruction prepares a private pilot;
it does not authorize publication.
