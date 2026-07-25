import { createPmpServicePageExports } from '@/content/pmp/create-service-page';

const { metadata, Page } = createPmpServicePageExports('pmp-mock-exam');
export { metadata };
export default Page;
