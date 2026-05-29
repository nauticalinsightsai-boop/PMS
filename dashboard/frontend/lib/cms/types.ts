export type CmsStatus = 'active' | 'draft';

export const CMS_STATUS_LABEL: Record<CmsStatus, string> = {
  active: 'ACTIVE',
  draft: 'DRAFT',
};
