import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getAllChannelLandingPages,
  getChannelLandingPageByKey,
  upsertChannelLandingPage,
  unpublishChannelLandingPage,
  assertTierDurationsValid,
  buildFullShareUrl,
  buildGoPagePath,
} from '@pms/booking-crm';
import type { ChannelLandingPage } from '@pms/booking-crm';
import { requireDashboardMutationAuth } from '@/lib/auth/api-guard';

const MARKETING_SITE_URL =
  process.env.NEXT_PUBLIC_MARKETING_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000';

export async function GET(request: NextRequest) {
  const auth = await requireDashboardMutationAuth(request);
  if (auth) return auth;

  try {
    const channelKey = request.nextUrl.searchParams.get('channelKey');
    if (channelKey) {
      const page = getChannelLandingPageByKey(channelKey);
      const shareUrl = page ? buildFullShareUrl(page, MARKETING_SITE_URL) : null;
      return NextResponse.json({
        success: true,
        page,
        shareUrl,
        publicUrl: page?.status === 'published' ? shareUrl : null,
      });
    }
    return NextResponse.json({ success: true, pages: getAllChannelLandingPages() });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to load channel landing pages';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireDashboardMutationAuth(request);
  if (auth) return auth;

  try {
    const body = (await request.json()) as {
      channelKey: string;
      channelId: string;
      label: string;
      subtitle?: string;
      intent: 'saveDraft' | 'publish' | 'unpublish';
      page?: Partial<ChannelLandingPage>;
    };

    if (!body.channelKey || !body.channelId || !body.label) {
      return NextResponse.json(
        { success: false, error: 'Missing channelKey, channelId, or label' },
        { status: 400 },
      );
    }

    if (body.intent === 'unpublish') {
      const page = unpublishChannelLandingPage(body.channelKey);
      const goPath = page ? buildGoPagePath(page) : null;
      if (goPath) revalidatePath(goPath);
      return NextResponse.json({ success: true, page, publicUrl: null });
    }

    const intent = body.intent === 'publish' ? 'publish' : 'saveDraft';
    if (body.page?.consultationTiers?.length) {
      try {
        assertTierDurationsValid(body.page.consultationTiers);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Invalid tier durations';
        return NextResponse.json({ success: false, error: msg }, { status: 400 });
      }
    }

    const { page, publicUrl } = upsertChannelLandingPage(
      body.channelKey,
      {
        channelId: body.channelId,
        label: body.label,
        subtitle: body.subtitle,
        ...(body.page ?? {}),
      },
      intent,
    );

    const shareUrl = buildFullShareUrl(page, MARKETING_SITE_URL);
    const fullPublicUrl = page.status === 'published' ? shareUrl : null;
    const goPath = buildGoPagePath(page);

    if (goPath && intent === 'publish' && page.status === 'published') {
      revalidatePath(goPath);
      try {
        await fetch(`${MARKETING_SITE_URL}/api/revalidate?path=${encodeURIComponent(goPath)}`, {
          method: 'POST',
        }).catch(() => undefined);
      } catch {
        /* optional marketing revalidate */
      }
    }

    return NextResponse.json({
      success: true,
      page,
      shareUrl,
      publicUrl: fullPublicUrl ?? publicUrl,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to save channel landing page';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
