/**
 * Unit smoke for Calendly HTML inject — slot CSS, i18n fix, paid escape, booking shim.
 * Does not replace manual cohort click-through.
 */
import { describe, expect, it } from 'vitest';
import {
  injectIntoCalendlyHtml,
  isPaidCalendlyEventUrl,
  parseProxyThemeFromSearchParams,
} from '../../../backend/lib/calendly/proxy-inject';

const FIXTURE = `<!DOCTYPE html><html><head><title>Calendly</title></head><body>
<div class="calendar">Pick a date</div>
<script>window.Calendly={}</script>
</body></html>`;

describe('calendly proxy inject smoke', () => {
  it('injects slot CSS and shims without Oops / missing date_full markers', () => {
    const params = new URLSearchParams({
      url: 'https://calendly.com/pm-structure/talk-to-mentor',
      pms_channel: 'instagram',
      pms_mode: 'dark',
      background_color: '000000',
      text_color: 'ffffff',
      primary_color: 'c13584',
      slot_date_fill: '1a1a1a',
      slot_date_label: 'c13584',
      slot_date_selected_fill: 'c13584',
      slot_date_selected_label: 'ffffff',
      slot_time_fill: '1a1a1a',
      slot_time_label: 'c13584',
      slot_time_border: '333333',
      slot_time_selected_fill: 'c13584',
      slot_time_selected_label: 'ffffff',
      form_label: 'a1a1aa',
      form_field_text: '18181b',
      form_submit_fill: 'c13584',
      form_submit_label: 'ffffff',
      pms_paid: '0',
    });
    const theme = parseProxyThemeFromSearchParams(params);
    const html = injectIntoCalendlyHtml(FIXTURE, theme);

    expect(html).toContain('slot_date_fill');
    expect(html).toMatch(/#1a1a1a|#c13584/i);
    expect(html).toContain('date_full');
    expect(html).toMatch(/api\/calendly\/booking|booking/);
    expect(html).toContain('pms-calendly-bootstrap');
    expect(html).toContain('history.replaceState');
    expect(html).toMatch(/overflow-y:\s*auto/);
    expect(html).toMatch(/::-webkit-scrollbar/);
    expect(html).toMatch(/--pms-form-label/);
    expect(html).toMatch(/--pms-form-field-text/);
    expect(html).toMatch(/input::placeholder/);
    expect(html).toMatch(/background-color:\s*#ffffff/i);
    expect(html).toMatch(/applySlotQsToUrl|SLOT_QS/);
    expect(html).toMatch(/paintSlots|ensureFieldLabel|Add guests/);
    expect(html).not.toMatch(/\[missing\s+"en\.time\.formats\.date_full"\]/);
    expect(html).not.toMatch(/Oops[\s\S]*something went wrong/i);
    // Must not freeze pathname to a string literal assignment in shim
    expect(html).not.toMatch(/pathname\s*=\s*['"`]\/[^'"`]+['"`]/);
  });

  it('marks paid advisor URLs for escape', () => {
    expect(isPaidCalendlyEventUrl('https://calendly.com/pm-structure/talk-to-advisor')).toBe(true);
    expect(isPaidCalendlyEventUrl('https://calendly.com/pm-structure/talk-to-mentor')).toBe(false);
  });

  it('covers free + paid samples across families via paid heuristic', () => {
    const samples = [
      'https://calendly.com/pm-structure/talk-to-mentor',
      'https://calendly.com/pm-structure/talk-to-advisor',
      'https://calendly.com/pm-structure/go-webinar-open',
      'https://calendly.com/pm-structure/go-webinar-paid',
      'https://calendly.com/pm-structure/go-newsletters-discovery',
      'https://calendly.com/pm-structure/go-newsletters-executive',
      'https://calendly.com/pm-structure/go-social-media-executive',
      'https://calendly.com/pm-structure/go-podcasts-discovery',
      'https://calendly.com/pm-structure/go-messaging-design-review',
      'https://calendly.com/pm-structure/go-syndicated-discovery',
    ];
    for (const url of samples) {
      const paid = isPaidCalendlyEventUrl(url);
      const params = new URLSearchParams({
        url,
        pms_channel: 'website',
        pms_mode: 'light',
        background_color: 'ffffff',
        text_color: '0f172a',
        primary_color: 'ff4a38',
        slot_date_fill: 'f4f4f5',
        slot_date_label: 'ff4a38',
        slot_date_selected_fill: 'ff4a38',
        slot_date_selected_label: 'ffffff',
        slot_time_fill: 'f4f4f5',
        slot_time_label: 'ff4a38',
        slot_time_border: 'e2e8f0',
        slot_time_selected_fill: 'ff4a38',
        slot_time_selected_label: 'ffffff',
        form_label: '64748b',
        form_submit_fill: 'ff4a38',
        form_submit_label: 'ffffff',
        pms_paid: paid ? '1' : '0',
      });
      const html = injectIntoCalendlyHtml(FIXTURE, parseProxyThemeFromSearchParams(params));
      expect(html.length).toBeGreaterThan(FIXTURE.length);
      if (paid) {
        expect(html).toMatch(/paidEscape|pms_paid|calendly\.com/i);
      }
    }
  });
});
