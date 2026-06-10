import type { PmpFaq } from './types';

export const PMP_PRICING_NOTE =
  'Pricing and enrollment options may vary by region, currency, cohort, offer, or access type. Regional scholarship pricing applies only when residence and billing country qualify. Official PMI exam fees are excluded from tuition. Checkout is processed in USD equivalent.';

export const PMP_LMS_NOTE =
  'After enrollment is confirmed, learners receive access through the PM Structure learning environment. Private lesson areas and cohort spaces are not indexed for search.';

export const PMP_STANDARD_FAQS: PmpFaq[] = [
  {
    question: 'Is PM Structure an official PMI ATP?',
    answer:
      'No. PM Structure is an independent exam-preparation platform. We are not a PMI Authorized Training Partner unless formally confirmed on a live page.',
  },
  {
    question: 'Does PM Structure guarantee a PMP pass?',
    answer:
      'No. We provide structured preparation support; exam outcomes depend on your experience, study time, and performance on test day.',
  },
  {
    question: 'Which PMP pathway should I choose?',
    answer:
      'Foundation suits new candidates; Professional suits structured readiness with scenario practice; Mastery suits intensive final preparation. Use the readiness diagnostic if unsure.',
  },
];
