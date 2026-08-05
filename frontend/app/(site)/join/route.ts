import { COMMUNITY_JOIN_FALLBACK_PATH } from '../../../config/community';

/**
 * Legacy join path. Query parameters (including old invitation tokens) are intentionally dropped.
 */
export function GET() {
  return new Response(null, {
    status: 307,
    headers: {
      Location: COMMUNITY_JOIN_FALLBACK_PATH,
    },
  });
}
