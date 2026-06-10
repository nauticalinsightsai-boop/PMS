# Post-Deployment Submission Plan

1. Run `npm run seo:production-check` against https://pmstructure.com
2. Submit `sitemap.xml` in Google Search Console and Bing Webmaster
3. Inspect priority URLs per [PMSTRUCTURE_PRIORITY_URL_INSPECTION_LIST.md](./PMSTRUCTURE_PRIORITY_URL_INSPECTION_LIST.md)
4. Run `npm run seo:prepare-submission-list` for URL batches
5. IndexNow dry-run: `npm run seo:indexnow` (add `--send` only after key file deployed)
6. Execute AI baseline per [PMSTRUCTURE_AI_ANSWER_TESTING_PLAYBOOK.md](./PMSTRUCTURE_AI_ANSWER_TESTING_PLAYBOOK.md)
