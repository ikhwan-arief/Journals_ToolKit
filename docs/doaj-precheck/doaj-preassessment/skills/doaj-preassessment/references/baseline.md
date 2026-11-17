# Frozen criteria baseline

This independent pilot uses the source versions recorded in the stakeholder
rulebook dated 1 October 2026. The packaged maps, not the live pages, define
the assessment performed by plugin version **0.1.0**.

| Source | Frozen version | Reference URL |
| --- | --- | --- |
| DOAJ Guide to applying | 2.9 | https://doaj.org/apply/guide/ |
| DOAJ application form, reference PDF | 3.1, January 2026 | https://doaj.org/static/doaj/docs/DOAJquestions-for-reference-only.pdf |
| Principles of Transparency and Best Practice in Scholarly Publishing | 4.0, September 2022 | https://doaj.org/apply/transparency/ |
| Stakeholder rulebook data | 2026.10.0 | Packaged criteria-map.md and form-map.md |

The live URLs are offered for readers and maintainers. They may change after
the baseline date. During a journal assessment, do not fetch them to revise
the frozen rule meaning. Journal pages and accessible public registries
remain live evidence and must carry their access date.

## Authority and levels

The URD, PRD, and rulebook are stakeholder proposals. They do not confer
DOAJ authority. The rulebook distinguishes must/basic requirements,
should recommendations, best practices, principles, and warning-only
record checks. A principle is not automatically an eligibility blocker.

No overall percentage or acceptance probability should be reported. The
official application is completed by the editor at https://doaj.org/apply/.

## Decisions this pilot cannot settle

The source rulebook marks these values or interpretations TBD by DOAJ:

- A numerical click-depth threshold for information being easily
  accessible from the homepage.
- Whether a change from non-open licensing to open licensing triggers
  the new/flipped journal one-year or ten-article threshold outside the
  explicitly described flipped-journal case.
- A minimum count of dated articles for a reliable weeks-to-publication
  estimate.
- Which national accreditation lists qualify under the metrics rule.
- Registry access terms and any private DOAJ application, rejection,
  exclusion, or waiting-period records.
- Automated crawl limits, model identity, confidence and quote-length
  thresholds, accuracy targets, and cost limits.
- Thresholds for optional profile matching and scope similarity checks.

Do not invent a DOAJ decision for these. Explain the uncertainty and use
Unverifiable or For DOAJ review where it affects a finding. Engineering
limits from the original server-oriented proposal do not imply that this
skills-only plugin performs a controlled crawl.

## Version update procedure

A maintainer compares a later official DOAJ release with this frozen
baseline, updates this file plus criteria-map.md and form-map.md, reviews
SKILL.md and the report template, increments the manifest version, and
records changes in CHANGELOG.md. Existing reports retain the baseline
versions printed when they were produced. A live DOAJ page changing does
not automatically update the plugin.
