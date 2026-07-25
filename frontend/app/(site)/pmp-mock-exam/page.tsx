import type { Metadata } from 'next';
import { PmpServicePage } from '@/components/pmp/PmpServicePage';
import { buildPageMetadata, buildPhase2PageMetadata } from '@/lib/site-metadata';
import { buildKeywordAdaptedMetadata } from '@/lib/seo/build-keyword-adapted-metadata';
import { arrivalAppliesToHub, titleCaseKeyword } from '@/lib/seo/keyword-arrival-context';
import { resolveKeywordArrivalFromRequest } from '@/lib/seo/keyword-arrival-context.server';
import { titleNeedsNoSuffix } from '@/content/seo/phase-2-page-seo';
import { getPmpService } from '@/content/pmp/services';

const SLUG = 'pmp-mock-exam';
const HUB_PATH = '/pmp-mock-exam';

export const dynamic = 'force-dynamic';

function baseMetadata(): Metadata {
  const service = getPmpService(SLUG);
  if (!service) throw new Error(`Unknown PMP service slug: ${SLUG}`);
  return (
    buildPhase2PageMetadata(service.path) ??
    buildPageMetadata({
      title: service.title,
      description: service.description,
      path: service.path,
      noSuffix: titleNeedsNoSuffix(service.title),
    })
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const arrival = await resolveKeywordArrivalFromRequest();
  if (arrivalAppliesToHub(arrival, HUB_PATH)) {
    return buildKeywordAdaptedMetadata({ hubPath: HUB_PATH, arrival });
  }
  return baseMetadata();
}

export default async function Page() {
  const service = getPmpService(SLUG);
  if (!service) throw new Error(`Unknown PMP service slug: ${SLUG}`);
  const arrival = await resolveKeywordArrivalFromRequest();
  const adapted = arrivalAppliesToHub(arrival, HUB_PATH) ? arrival : null;
  return (
    <PmpServicePage
      service={service}
      overrideH1={adapted ? titleCaseKeyword(adapted.primaryKeyword) : undefined}
    />
  );
}
