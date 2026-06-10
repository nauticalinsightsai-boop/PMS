/**
 * Generate public AI/entity JSON files from live site content (Run 7).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  buildAiProfileJson,
  buildAnswersJson,
  buildCertificationsJson,
  buildCoursesJson,
  buildEntityJson,
  buildFaqJson,
  buildLearningPathwaysJson,
  buildPmp2026Json,
  buildPmpFaqJson,
  buildPmpKeywordsJson,
  buildPmpRoutesJson,
  buildPricingPolicyJson,
  buildTopicsJson,
} from '../lib/ai-files/builders.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

function writeJson(name, data) {
  fs.writeFileSync(path.join(publicDir, name), `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Wrote ${name}`);
}

writeJson('entity.json', buildEntityJson());
writeJson('ai-profile.json', buildAiProfileJson());
writeJson('courses.json', buildCoursesJson());
writeJson('certifications.json', buildCertificationsJson());
writeJson('learning-pathways.json', buildLearningPathwaysJson());
writeJson('pricing-policy.json', buildPricingPolicyJson());
writeJson('pmp-2026.json', buildPmp2026Json());
writeJson('pmp-keywords.json', buildPmpKeywordsJson());
writeJson('pmp-faq.json', buildPmpFaqJson());
writeJson('pmp-routes.json', buildPmpRoutesJson());
writeJson('faq.json', buildFaqJson());
writeJson('answers.json', buildAnswersJson());
writeJson('topics.json', buildTopicsJson());
