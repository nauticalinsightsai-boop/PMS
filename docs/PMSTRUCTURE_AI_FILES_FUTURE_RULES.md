# AI Files. Future Update Rules

When shipping new SEO content, regenerate AI files before deploy:

```bash
npm run seo:generate-ai-files
npm run seo:ai-files-check
```

## Triggers

| Change | Files affected |
|--------|----------------|
| New PMP route | `pmp-routes.json`, `pmp-2026.json`, `llms.txt` |
| FAQ expansion | `faq.json`, `pmp-faq.json` |
| New answer page | `answers.json` |
| New topic hub | `topics.json` |
| Certification catalogue | `courses.json`, `certifications.json`, `entity.json` |
| Pricing policy | `pricing-policy.json` |

## Manual

- Update `frontend/public/llms.txt` when adding new cite-worthy URLs or compliance notes
- Do not list checkout, enroll, or admin URLs as citations
- Keep `pmiAtpClaim: false` in entity.json unless legal approves ATP status