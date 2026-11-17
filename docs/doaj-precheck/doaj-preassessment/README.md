# DOAJ Pre-Assessment Pilot

This independent, skills-only ChatGPT plugin helps journal editors inspect
public evidence before they complete the official DOAJ application. It is a
stakeholder pilot, not a DOAJ service. It does not submit an application or
predict DOAJ's decision.

## Package

The compatibility manifest is in .codex-plugin/plugin.json. The workflow is
in skills/doaj-preassessment/SKILL.md, with a frozen criteria baseline,
criterion map, form map, and report template beside it. The three original
requirements documents in the parent directory are design inputs; the
installed skill uses its own packaged references.

No MCP server, external service, dependency, custom UI, or marketplace entry
is included. Installing and enabling this package in ChatGPT requires an
available local or private plugin distribution path. The package has not
been published.

## Use

Enable the plugin and provide the journal homepage URL. ChatGPT reads public
pages when browsing is available, then reports observed evidence, unresolved
checks, suggested actions, and a guide to application-form answers supported
by that evidence. The official application remains at https://doaj.org/apply/.

The assessment uses Guide v2.9, application form v3.1 (January 2026),
Transparency Principles v4.0 (September 2022), and proposal rulebook
2026.10.0. Criteria do not update during a run. A new plugin release is
needed when the baseline changes.

## Coverage limits

One URL starts the workflow; no upload or additional evidence is requested.
ChatGPT's ability to open journal pages, PDFs, and registries varies by
session and site. An unseen page or incomplete article sample remains
unverifiable. This package does not perform exhaustive crawling, keep
snapshots, use internal DOAJ records, or save runs for incremental checks.
If browsing is unavailable, it cannot run a URL-only assessment.

## Validation

From the parent doaj-precheck directory, use a Python interpreter with
PyYAML available. On this host, Python 3.12 has it:

    /Library/Frameworks/Python.framework/Versions/3.12/bin/python3.12 ~/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py doaj-preassessment
    /Library/Frameworks/Python.framework/Versions/3.12/bin/python3.12 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py doaj-preassessment/skills/doaj-preassessment

These commands validate package structure and skill metadata. The editor
workflow also needs evaluation in an installed ChatGPT session before use.
