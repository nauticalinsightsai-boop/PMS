import { createPmpServicePageExports } from '@/content/pmp/create-service-page';

const { metadata, Page } = createPmpServicePageExports('pmp-readiness-diagnostic');
export { metadata };
export default Page;
