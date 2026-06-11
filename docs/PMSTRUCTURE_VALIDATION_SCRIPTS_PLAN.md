# Validation Scripts Plan (Phase 16)

## Commands

| Script | npm command |
|--------|-------------|
| Metadata | `seo:metadata-check` |
| Robots | `seo:robots-check` |
| Compliance | `seo:compliance-check` |
| Conversion | `seo:conversion-check` |
| Submission lists | `seo:prepare-submission-list` |
| Production smoke | `seo:production-check` |
| AI test sheet | `seo:generate-ai-test-sheet` |
| AI citation map | `seo:check-ai-citation-map` |

## Aggregates

- `seo:check`: all static checks
- `seo:all`: audit + check + generate-ai-files
- `seo:release-verify`: build + seo:all + postbuild

## Reports

JSON reports written to `reports/seo/` (gitignored).