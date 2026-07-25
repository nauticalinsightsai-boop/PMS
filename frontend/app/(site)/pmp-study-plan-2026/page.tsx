import type { Metadata } from 'next';
import { PmpAuthorityPage } from '@/components/pmp/PmpAuthorityPage';
import { buildPageMetadata, buildPhase2PageMetadata } from '@/lib/site-metadata';
import { buildKeywordAdaptedMetadata } from '@/lib/seo/build-keyword-adapted-metadata';
import { arrivalAppliesToHub, titleCaseKeyword } from '@/lib/seo/keyword-arrival-context';
import { resolveKeywordArrivalFromRequest } from '@/lib/seo/keyword-arrival-context.server';
import { titleNeedsNoSuffix } from '@/content/seo/phase-2-page-seo';
import { getPmpPage } from '@/content/pmp/pages';

const SLUG = 'pmp-study-plan-2026';
const HUB_PATH = '/pmp-study-plan-2026';

export const dynamic = 'force-dynamic';

function baseMetadata(): Metadata {
  const page = getPmpPage(SLUG);
  if (!page) throw new Error(`Unknown PMP page slug: ${SLUG}`);
  return (
    buildPhase2PageMetadata(page.path) ??
    buildPageMetadata({
      title: page.title,
      description: page.description,
      path: page.path,
      noSuffix: titleNeedsNoSuffix(page.title),
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
  const page = getPmpPage(SLUG);
  if (!page) throw new Error(`Unknown PMP page slug: ${SLUG}`);
  const arrival = await resolveKeywordArrivalFromRequest();
  const adapted = arrivalAppliesToHub(arrival, HUB_PATH) ? arrival : null;
  return (
    <PmpAuthorityPage
      page={page}
      overrideH1={adapted ? titleCaseKeyword(adapted.primaryKeyword) : undefined}
    />
  );
}
