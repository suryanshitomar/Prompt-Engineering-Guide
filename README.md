# Prompt Engineering Portfolio Lab

A 16-page practical handbook and reproducible support-ticket prompt evaluation project.

**Status:** working local toolkit with illustrative fixtures. No live model benchmark has been run. The demo calls no model and needs no API key.

## Project highlights

- Baseline and revised prompts with an explicit fictional support policy.
- 20 labeled tickets: 12 development and 8 held-out cases.
- Strict output validation, full-denominator scoring and Markdown reports.
- Automated regression tests and GitHub Actions CI.
- Human review rubric and portfolio case-study template.

## Quick start

Install Node.js 22 or newer. No package installation or external dependencies are needed.

~~~sh
git clone https://github.com/suryanshitomar/Prompt-Engineering-Guide.git
cd Prompt-Engineering-Guide
npm test
npm run demo
~~~

[View the demo report](results/demo/report.md). Its deliberately imperfect fixtures produce 9/12 overall passes, 11/12 contract passes and 10/12 correct routes. **These are fixture scores, not model performance.**

## Run your own experiment

Prepare baseline requests:

~~~sh
npm run prepare -- --split development --prompt baseline
~~~

Open results/local/requests.jsonl. Send each prompt to your chosen model in a fresh conversation with consistent settings. Capture the exact response and its case ID as one record per line in results/local/baseline-responses.jsonl:

~~~json
{"id":"D01","response":{"category":"billing","needs_review":true,"missing_fields":["order_id","days_since_delivery"],"reply":"Please share your order ID and days since delivery for staff review."}}
~~~

The response can instead be a string containing the exact output, allowing malformed JSON or Markdown fences to count as failures. See [the record example](examples/real-response-format.jsonl). No provider integration or automatic API call is included.

Evaluate captured responses, replacing metadata with your actual model ID and run name:

~~~sh
npm run evaluate -- --split development --input results/local/baseline-responses.jsonl --model YOUR_EXACT_MODEL_ID --prompt baseline --run baseline-01
~~~

The command writes results/local/report.json and report.md. **Archive these before another evaluation because the paths are overwritten.** Prepared requests are also overwritten on each preparation run.

Repeat preparation with --prompt revised and collect a separate response file. Compare the same tickets on the same model and settings. Freeze prompts before using --split held_out with preparation and evaluation. Do not tune on held-out cases and then claim an unseen result. This small public fictional dataset is a teaching artifact.

Review the reply text using [the human rubric](docs/manual-review.md). Record settings, prompt commit, date and raw-output locations in [the experiment log](docs/experiment-log.csv). Preserve all runs, not just the best ones.

## Scoring

| Check | Rule |
| --- | --- |
| Contract | Exact keys, types, allowed labels, unique permitted missing fields and nonempty reply |
| Routing | Category matches the expected label |
| Review | Review flag matches the expected Boolean |
| Fields | Missing-field names match regardless of order |
| Length | At most 90 whitespace-separated words |
| Overall | All five checks pass |

Missing responses fail within the full selected split denominator. Duplicate, unknown and wrong-split IDs stop evaluation. Invalid model JSON fails contract validation. Automated checks do not measure semantic policy compliance or usefulness: a correctly formatted reply could still promise an unauthorized refund. Human review is required.

## Repository map

~~~text
.github/workflows/ci.yml       Tests and fixture report reproducibility
src/                          CLI, validation and evaluation logic
tests/                        Dependency-free regression tests
prompts/                      Baseline, revised prompt and policy
schemas/                      Machine-readable response contract
data/                         Labeled development and held-out tickets
examples/                     Explicitly illustrative fixtures
results/demo/                 Reproducible fixture reports
docs/                         Review rubric and portfolio guides
prompt-engineering-handbook.pdf   Shareable e-book
prompt-engineering-handbook.html  Editable source
~~~

## Prompt library across 20 use cases

[Browse the practical prompt library](docs/prompt-library.md) for AI video planning, meeting notes, presentations, deep research and more. Copy-ready templates live in prompts/library/. These templates are separate from the 20 support-ticket test cases and are not scored by the current CLI.

## Handbook and portfolio

[Read the PDF](prompt-engineering-handbook.pdf) · [Editable HTML](prompt-engineering-handbook.html)

The lab extends the book into executable checks. Its versioned policy explicitly defines empty-input handling, multi-issue refund fields and credential non-repetition. Use prompts/policy.txt as the source of truth for lab experiments.

Write up your own results with [the case-study template](docs/case-study-template.md). Include your decisions, sanitized raw evidence, failures and limitations. Add your name, repository URL and screenshots when ready.

[Publishing instructions](docs/publishing.md) explain the future GitHub push. GitHub repository: https://github.com/suryanshitomar/Prompt-Engineering-Guide

## Data and limitations

All tickets and policies are fictional. https://example.com/reset is a demonstration link. This tool scores text; it does not send replies, issue refunds or access accounts. Prompts are not a security boundary. Keep credentials and personal data out of source control.

The ignored results/local/ folder holds private experiments. Deliberately publish only sanitized evidence. Render intermediates in qa/ are ignored too.

## License

No reuse license has been selected; package metadata is UNLICENSED. Choose a license before offering the project for others to reuse.
