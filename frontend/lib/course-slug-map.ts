/**
 * Maps matrix course names → siteData certification ids (Phase 0 stub).
 * Extend as siteData grows; offerings without a page use courseSlug from catalogue.
 */

export const MATRIX_COURSE_TO_SITE_ID: Record<string, string> = {
  'CAPM Preparation': 'capm',
  'PMP Preparation': 'pmp',
  'PgMP Preparation': 'pgmp',
  'PfMP Preparation': 'pfmp',
  'PMI-ACP Preparation': 'pmi-acp',
  'PMI-RMP Preparation': 'pmi-rmp',
  'PMI-SP Preparation': 'pmi-sp',
  'PMI-PBA Preparation': 'pmi-pba',
  'PMI-CP Preparation': 'pmi-cp',
  'PMI-PMOCP Preparation': 'pmi-pmocp',
  'PMI-CPMAI Preparation': 'pmi-cpmai',
  'PRINCE2 7 Foundation Preparation': 'prince2',
  'PRINCE2 7 Practitioner Preparation': 'prince2-practitioner',
  'PRINCE2 Agile Foundation Preparation': 'prince2-agile',
  'PRINCE2 Agile Practitioner Preparation': 'prince2-agile-practitioner',
  'MSP Foundation Preparation': 'msp',
  'MSP Practitioner Preparation': 'msp',
  'MoP Foundation Preparation': 'mop',
  'MoP Practitioner Preparation': 'mop',
  'M_o_R Foundation Preparation': 'mor',
  'M_o_R 4 Practitioner Preparation': 'mor',
  'P3O Foundation Preparation': 'p3o',
  'P3O Practitioner Preparation': 'p3o',
  'Six Sigma Champion': 'lss-champion',
  'Six Sigma White Belt': 'lss-white',
  'Six Sigma Yellow Belt': 'lss-yellow',
  'Six Sigma Green Belt': 'lss-green',
  'Six Sigma Black Belt': 'lss-black',
  'Six Sigma Master Black Belt': 'lss-master',
};

export function siteIdForMatrixCourse(courseName: string): string | undefined {
  return MATRIX_COURSE_TO_SITE_ID[courseName];
}
