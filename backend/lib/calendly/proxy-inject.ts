/**
 * HTML/CSS/JS injection for same-origin Calendly scheduler proxy.
 * Slot colors come from query params (resolveSchedulerChrome) — never a global DOM palette.
 */

export type ProxyThemeParams = {
  background: string
  text: string
  primary: string
  slotDateFill: string
  slotDateLabel: string
  slotDateSelectedFill: string
  slotDateSelectedLabel: string
  slotTimeFill: string
  slotTimeLabel: string
  slotTimeBorder: string
  slotTimeSelectedFill: string
  slotTimeSelectedLabel: string
  formLabel: string
  formFieldText: string
  formSubmitFill: string
  formSubmitLabel: string
  channelId: string
  mode: string
  calendlyEventUrl: string
  paidEscape: boolean
}

function hash(hex: string): string {
  const h = hex.replace(/^#/, '')
  return `#${h}`
}

export function parseProxyThemeFromSearchParams(sp: URLSearchParams): ProxyThemeParams {
  const g = (k: string, fallback: string) => (sp.get(k) || fallback).replace(/^#/, '')
  return {
    background: g('background_color', '0A0A0B'),
    text: g('text_color', 'F4F4F5'),
    primary: g('primary_color', 'EA580C'),
    slotDateFill: g('slot_date_fill', '27272A'),
    slotDateLabel: g('slot_date_label', 'F4F4F5'),
    slotDateSelectedFill: g('slot_date_selected_fill', 'EA580C'),
    slotDateSelectedLabel: g('slot_date_selected_label', 'FFFFFF'),
    slotTimeFill: g('slot_time_fill', '27272A'),
    slotTimeLabel: g('slot_time_label', 'F4F4F5'),
    slotTimeBorder: g('slot_time_border', '3F3F46'),
    slotTimeSelectedFill: g('slot_time_selected_fill', 'EA580C'),
    slotTimeSelectedLabel: g('slot_time_selected_label', 'FFFFFF'),
    formLabel: g('form_label', 'A1A1AA'),
    formFieldText: g('form_field_text', '18181B'),
    formSubmitFill: g('form_submit_fill', 'EA580C'),
    formSubmitLabel: g('form_submit_label', 'FFFFFF'),
    channelId: sp.get('pms_channel') || 'website',
    mode: sp.get('pms_mode') || 'dark',
    calendlyEventUrl: sp.get('url') || '',
    paidEscape: sp.get('pms_paid') === '1',
  }
}

export function buildInjectedSchedulerCss(t: ProxyThemeParams): string {
  const bg = hash(t.background)
  const text = hash(t.text)
  const primary = hash(t.primary)
  const dateFill = hash(t.slotDateFill)
  const dateLabel = hash(t.slotDateLabel)
  const dateSelFill = hash(t.slotDateSelectedFill)
  const dateSelLabel = hash(t.slotDateSelectedLabel)
  const timeFill = hash(t.slotTimeFill)
  const timeLabel = hash(t.slotTimeLabel)
  const timeBorder = hash(t.slotTimeBorder)
  const timeSelFill = hash(t.slotTimeSelectedFill)
  const timeSelLabel = hash(t.slotTimeSelectedLabel)
  const formLabel = hash(t.formLabel)
  const formFieldText = hash(t.formFieldText)
  const submitFill = hash(t.formSubmitFill)
  const submitLabel = hash(t.formSubmitLabel)

  return `
/* PMS scheduler chrome — from resolveSchedulerChrome */
:root {
  --pms-cal-bg: ${bg};
  --pms-cal-text: ${text};
  --pms-cal-primary: ${primary};
  --pms-slot-date-fill: ${dateFill};
  --pms-slot-date-label: ${dateLabel};
  --pms-slot-date-sel-fill: ${dateSelFill};
  --pms-slot-date-sel-label: ${dateSelLabel};
  --pms-slot-time-fill: ${timeFill};
  --pms-slot-time-label: ${timeLabel};
  --pms-slot-time-border: ${timeBorder};
  --pms-slot-time-sel-fill: ${timeSelFill};
  --pms-slot-time-sel-label: ${timeSelLabel};
  --pms-form-label: ${formLabel};
  --pms-form-field-text: ${formFieldText};
  --pms-form-submit-fill: ${submitFill};
  --pms-form-submit-label: ${submitLabel};
}
html, body {
  background: var(--pms-cal-bg) !important;
  color: var(--pms-cal-text) !important;
  /* Calendly-native: scroll the full event page (details → calendar → times) */
  height: 100% !important;
  max-height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  /* No stable gutter — empty track looked like a second box on the right */
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.55) transparent;
}
html::-webkit-scrollbar,
body::-webkit-scrollbar {
  width: 10px;
}
html::-webkit-scrollbar-track,
body::-webkit-scrollbar-track {
  background: transparent;
}
html::-webkit-scrollbar-thumb,
body::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.45);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
html::-webkit-scrollbar-thumb:hover,
body::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.7);
  background-clip: padding-box;
}
/* Keep main booking column readable; don’t force 100vh lock on inner app shells */
#root, #main, [data-component="spot"], main {
  min-height: 100% !important;
  max-width: 100% !important;
  margin: 0 auto !important;
  box-sizing: border-box !important;
}
/* Avoid a second “frame” from Calendly’s own card chrome inside our iframe */
[data-component="spot"],
.spot,
.calendar-container,
main > div {
  box-shadow: none !important;
  border: 0 !important;
  outline: 0 !important;
}
/* Unselected date circles — beat Calendly primary-as-available-day styling */
button[data-container="day"],
button[data-container="day"] span,
[data-testid="calendar-table"] button:not([aria-pressed="true"]):not([disabled]),
[data-testid="calendar-table"] button:not([aria-pressed="true"]):not([disabled]) span,
.calendar .day:not(.selected):not(.disabled) button,
.calendar .day:not(.selected):not(.disabled) button span,
[data-component="spot-list"] button[data-container="day"],
[data-component="spot-list"] button[data-container="day"] span,
table[role="presentation"] button[aria-label*="Times available"],
table[role="presentation"] button[aria-label*="Times available"] span,
table[role="presentation"] button[aria-label*="times available"],
.calendar-table button:not([aria-pressed="true"]):not([disabled]),
.calendar-table button:not([aria-pressed="true"]):not([disabled]) span,
[role="gridcell"] button:not([disabled]):not([aria-pressed="true"]) {
  background: var(--pms-slot-date-fill) !important;
  background-color: var(--pms-slot-date-fill) !important;
  background-image: none !important;
  color: var(--pms-slot-date-label) !important;
  -webkit-text-fill-color: var(--pms-slot-date-label) !important;
  border-color: transparent !important;
  fill: var(--pms-slot-date-label) !important;
}
button[aria-pressed="true"][data-container="day"],
button[aria-pressed="true"][data-container="day"] span,
[data-testid="calendar-table"] button[aria-pressed="true"],
[data-testid="calendar-table"] button[aria-pressed="true"] span,
.calendar .day.selected button,
.calendar .day.selected button span,
table[role="presentation"] button[aria-pressed="true"],
table[role="presentation"] button[aria-pressed="true"] span,
.calendar-table button[aria-pressed="true"],
.calendar-table button[aria-pressed="true"] span,
[role="gridcell"] button[aria-pressed="true"] {
  background: var(--pms-slot-date-sel-fill) !important;
  background-color: var(--pms-slot-date-sel-fill) !important;
  background-image: none !important;
  color: var(--pms-slot-date-sel-label) !important;
  -webkit-text-fill-color: var(--pms-slot-date-sel-label) !important;
  fill: var(--pms-slot-date-sel-label) !important;
}
/* Month chevrons stay on primary */
button[aria-label*="previous month"],
button[aria-label*="next month"],
button[aria-label*="Go to previous"],
button[aria-label*="Go to next"] {
  color: var(--pms-cal-primary) !important;
  -webkit-text-fill-color: var(--pms-cal-primary) !important;
}
button[aria-label*="previous month"] svg,
button[aria-label*="next month"] svg,
button[aria-label*="Go to previous"] svg,
button[aria-label*="Go to next"] svg {
  fill: var(--pms-cal-primary) !important;
  color: var(--pms-cal-primary) !important;
}
button[data-container="time-button"],
button[data-container="time-button"] span,
[data-testid="time-button"],
[data-testid="time-button"] span,
.time-button:not(.selected),
[data-component="spot-list"] button[data-container="time-button"] {
  background: var(--pms-slot-time-fill) !important;
  background-color: var(--pms-slot-time-fill) !important;
  color: var(--pms-slot-time-label) !important;
  -webkit-text-fill-color: var(--pms-slot-time-label) !important;
  border: 1px solid var(--pms-slot-time-border) !important;
}
button[data-container="time-button"][aria-pressed="true"],
button[data-container="time-button"][aria-pressed="true"] span,
.time-button.selected {
  background: var(--pms-slot-time-sel-fill) !important;
  background-color: var(--pms-slot-time-sel-fill) !important;
  color: var(--pms-slot-time-sel-label) !important;
  -webkit-text-fill-color: var(--pms-slot-time-sel-label) !important;
  border-color: var(--pms-slot-time-sel-fill) !important;
}
button[type="submit"],
button[data-container="continue-button"],
.button--primary,
button[data-container="next-button"],
[data-testid="continue-button"],
button[aria-label^="Next"] {
  background-color: var(--pms-form-submit-fill) !important;
  color: var(--pms-form-submit-label) !important;
  -webkit-text-fill-color: var(--pms-form-submit-label) !important;
  border-color: var(--pms-form-submit-fill) !important;
}
/* Invitee form: labels on page shell; typed text on white inputs */
label,
.form-field__label,
[data-component="spot-form"] label,
[data-component="invitee-details"] label,
.invitee-details label,
.form-field label,
span.form-field__label,
label[for],
[class*="FormField"] label,
[class*="form-field"] label {
  color: var(--pms-form-label) !important;
  -webkit-text-fill-color: var(--pms-form-label) !important;
}
input[type="text"],
input[type="email"],
input[type="tel"],
input[name="full_name"],
input[name="email"],
input[autocomplete="name"],
input[autocomplete="email"],
input[autocomplete="tel"],
[data-component="spot-form"] input,
[data-component="invitee-details"] input,
.invitee-details input,
.form-field input,
input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"]):not([type="submit"]) {
  background-color: #ffffff !important;
  color: var(--pms-form-field-text) !important;
  -webkit-text-fill-color: var(--pms-form-field-text) !important;
  border-color: var(--pms-slot-time-border) !important;
  caret-color: var(--pms-form-field-text) !important;
}
input::placeholder,
input::-webkit-input-placeholder,
textarea::placeholder {
  color: var(--pms-form-field-text) !important;
  -webkit-text-fill-color: var(--pms-form-field-text) !important;
  opacity: 0.65 !important;
}
/* Floating labels painted over white fields */
.form-field__label--floating,
[class*="floating"] label,
input + label,
.form-field input + span,
.form-field__label[data-id] {
  color: var(--pms-form-field-text) !important;
  -webkit-text-fill-color: var(--pms-form-field-text) !important;
}
/* Add guests — outline primary, readable label */
button[data-container="add-guest-button"],
button[aria-label*="guest" i],
button[aria-label*="Guest"],
a[data-container="add-guest-button"] {
  color: var(--pms-cal-primary) !important;
  -webkit-text-fill-color: var(--pms-cal-primary) !important;
  border-color: var(--pms-cal-primary) !important;
  background: transparent !important;
}
`
}

/**
 * MUST run before Calendly app boot — rewrite iframe path to the real event path
 * so lookup uses profile_slug=pm-structure&event_type_slug=so-discovery-mentorship
 * instead of parsing /api/calendly/scheduler as profile_slug=api.
 * Pathname stays LIVE after that (Calendly may navigate to /event/ISO…).
 */
export function buildInjectedBootstrapJs(t: ProxyThemeParams): string {
  const eventUrl = JSON.stringify(t.calendlyEventUrl)
  return `
(function () {
  var EVENT_URL = ${eventUrl};
  try {
    if (!EVENT_URL) return;
    if (!/\\/api\\/calendly\\/scheduler/i.test(location.pathname)) return;
    var eu = new URL(EVENT_URL);
    try { sessionStorage.setItem('pms_cal_event_url', EVENT_URL); } catch (e) {}
    try { sessionStorage.setItem('pms_cal_proxy_origin', location.origin); } catch (e) {}
    /* Live path: replace proxy path with Calendly event path; do NOT freeze afterward */
    history.replaceState(null, '', eu.pathname + (eu.search || ''));
  } catch (e) {}
})();
`
}

export function buildInjectedSchedulerJs(t: ProxyThemeParams): string {
  const eventUrl = JSON.stringify(t.calendlyEventUrl)
  const paid = t.paidEscape ? 'true' : 'false'
  return `
(function () {
  var EVENT_URL = ${eventUrl} || (function(){ try { return sessionStorage.getItem('pms_cal_event_url') || ''; } catch(e){ return ''; } })();
  var PAID_ESCAPE = ${paid};
  var SLOT_QS = ${JSON.stringify({
    background_color: t.background,
    text_color: t.text,
    primary_color: t.primary,
    slot_date_fill: t.slotDateFill,
    slot_date_label: t.slotDateLabel,
    slot_date_selected_fill: t.slotDateSelectedFill,
    slot_date_selected_label: t.slotDateSelectedLabel,
    slot_time_fill: t.slotTimeFill,
    slot_time_label: t.slotTimeLabel,
    slot_time_border: t.slotTimeBorder,
    slot_time_selected_fill: t.slotTimeSelectedFill,
    slot_time_selected_label: t.slotTimeSelectedLabel,
    form_label: t.formLabel,
    form_field_text: t.formFieldText,
    form_submit_fill: t.formSubmitFill,
    form_submit_label: t.formSubmitLabel,
    pms_channel: t.channelId,
    pms_mode: t.mode,
  })};

  function applySlotQsToUrl(href) {
    try {
      var u = new URL(href, location.origin);
      var keys = Object.keys(SLOT_QS);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (SLOT_QS[k] != null && SLOT_QS[k] !== '') u.searchParams.set(k, String(SLOT_QS[k]));
      }
      return u.pathname + u.search + u.hash;
    } catch (e) {
      return href;
    }
  }

  function patchHistoryMethod(methodName) {
    var orig = history[methodName];
    if (!orig || orig.__pmsSlotPatched) return;
    history[methodName] = function (state, title, url) {
      if (url != null && String(url).length) {
        try {
          arguments[2] = applySlotQsToUrl(String(url));
        } catch (e) {}
      }
      return orig.apply(this, arguments);
    };
    history[methodName].__pmsSlotPatched = true;
  }
  try {
    patchHistoryMethod('pushState');
    patchHistoryMethod('replaceState');
    if (location.search && /primary_color=|background_color=/.test(location.search)) {
      history.replaceState(history.state, '', applySlotQsToUrl(location.href));
    }
  } catch (e) {}

  function toBookingProxy(url) {
    if (!url) return null;
    var s = String(url);
    if (/calendly\\.com\\/api\\/booking/i.test(s)) {
      return s.replace(/https?:\\/\\/[^/]+\\/api\\/booking/i, '/api/calendly/booking');
    }
    if (/\\/api\\/booking(\\/|\\?|$)/i.test(s) && s.indexOf('/api/calendly/booking') === -1) {
      var path = s.replace(/^https?:\\/\\/[^/]+/i, '');
      if (path.indexOf('/api/booking') === 0) {
        return '/api/calendly/booking' + path.replace(/^\\/api\\/booking/, '');
      }
    }
    return null;
  }

  var _fetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    try {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      var proxied = toBookingProxy(url);
      if (proxied) input = proxied;
    } catch (e) {}
    return _fetch(input, init);
  };
  if (window.XMLHttpRequest) {
    var _open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
      try {
        var proxied = toBookingProxy(arguments[1]);
        if (proxied) arguments[1] = proxied;
      } catch (e) {}
      return _open.apply(this, arguments);
    };
  }

  function maybeEscapePaid() {
    if (!PAID_ESCAPE || !EVENT_URL) return;
    var path = location.pathname || '';
    if (/\\/invitee|\\/payment|stripe|checkout/i.test(path + location.search + location.hash)) {
      var dest = EVENT_URL;
      try {
        var u = new URL(EVENT_URL);
        if (path.indexOf('/event') >= 0 || path.indexOf('/invitee') >= 0) u.pathname = path;
        u.search = location.search;
        dest = u.toString();
      } catch (e) {}
      location.replace(dest);
    }
  }
  maybeEscapePaid();
  setInterval(maybeEscapePaid, 800);

  /* Debounced i18n fix — leaf text nodes only */
  var i18nTimer = null;
  function fixMissingTranslations() {
    if (!document.body) return;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      var t = node.nodeValue;
      if (!t || t.indexOf('[missing') === -1) continue;
      if (/en\\.time\\.formats\\.date_full/i.test(t)) {
        try {
          node.nodeValue = t.replace(/\\[missing[^\\]]*\\]/g, new Date().toLocaleDateString(undefined, {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          }));
        } catch (e) {
          node.nodeValue = t.replace(/\\[missing[^\\]]*\\]/g, '');
        }
      } else {
        node.nodeValue = t.replace(/\\[missing[^\\]]*\\]/g, '');
      }
    }
  }
  function scheduleI18n() {
    if (i18nTimer) clearTimeout(i18nTimer);
    i18nTimer = setTimeout(fixMissingTranslations, 120);
  }
  function startI18n() {
    if (!document.body) return;
    var mo = new MutationObserver(scheduleI18n);
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    scheduleI18n();
  }
  if (document.body) startI18n();
  else document.addEventListener('DOMContentLoaded', startI18n);

  /* Force slot paints — Calendly often reapplies primary as available-day fill after boot */
  function paintSlots() {
    try {
      var days = document.querySelectorAll(
        'button[data-container="day"], [data-testid="calendar-table"] button, [role="gridcell"] button, table[role="presentation"] button[aria-label]'
      );
      for (var i = 0; i < days.length; i++) {
        var b = days[i];
        if (b.disabled || /no times/i.test(b.getAttribute('aria-label') || '')) continue;
        var selected = b.getAttribute('aria-pressed') === 'true' || b.getAttribute('aria-current') === 'true';
        var fill = selected ? SLOT_QS.slot_date_selected_fill : SLOT_QS.slot_date_fill;
        var ink = selected ? SLOT_QS.slot_date_selected_label : SLOT_QS.slot_date_label;
        b.style.setProperty('background', '#' + String(fill).replace(/^#/, ''), 'important');
        b.style.setProperty('background-color', '#' + String(fill).replace(/^#/, ''), 'important');
        b.style.setProperty('background-image', 'none', 'important');
        b.style.setProperty('color', '#' + String(ink).replace(/^#/, ''), 'important');
        b.style.setProperty('-webkit-text-fill-color', '#' + String(ink).replace(/^#/, ''), 'important');
        var spans = b.querySelectorAll('span');
        for (var s = 0; s < spans.length; s++) {
          spans[s].style.setProperty('color', '#' + String(ink).replace(/^#/, ''), 'important');
          spans[s].style.setProperty('-webkit-text-fill-color', '#' + String(ink).replace(/^#/, ''), 'important');
        }
      }
      var inputs = document.querySelectorAll(
        'input[type="text"],input[type="email"],input[type="tel"],input[name="full_name"],input[name="email"]'
      );
      for (var j = 0; j < inputs.length; j++) {
        var inp = inputs[j];
        inp.style.setProperty('background-color', '#ffffff', 'important');
        inp.style.setProperty('color', '#' + String(SLOT_QS.form_field_text).replace(/^#/, ''), 'important');
        inp.style.setProperty('-webkit-text-fill-color', '#' + String(SLOT_QS.form_field_text).replace(/^#/, ''), 'important');
        inp.style.setProperty('caret-color', '#' + String(SLOT_QS.form_field_text).replace(/^#/, ''), 'important');
        // Calendly often omits Name/Email <label> nodes — ensure visible placeholders
        if (inp.name === 'full_name' && !inp.placeholder) inp.placeholder = 'Name';
        if (inp.name === 'email' && !inp.placeholder) inp.placeholder = 'Email';
        if ((inp.type === 'tel' || /phone|question_0/i.test(inp.name || '')) && !inp.placeholder) {
          /* keep phone as-is */
        }
      }
      // Add guests: Calendly sometimes renders an empty icon button — force visible label
      var guestBtns = document.querySelectorAll('button[type="button"]');
      for (var g = 0; g < guestBtns.length; g++) {
        var gb = guestBtns[g];
        var gcls = String(gb.className || '');
        var garia = gb.getAttribute('aria-label') || '';
        var gtxt = (gb.textContent || '').trim();
        var looksGuest =
          /guest/i.test(garia) ||
          /guest/i.test(gtxt) ||
          (gb.querySelector('span') && !gtxt && gb.closest('form') && gcls.indexOf('booking-kit') === -1);
        // Heuristic: lone outline button between name/email fieldset and phone questions
        if (!looksGuest && !gtxt && gb.querySelector('span') && gb.closest('form')) {
          var prev = gb.parentElement && gb.parentElement.previousElementSibling;
          var next = gb.parentElement && gb.parentElement.nextElementSibling;
          if (prev && next && prev.tagName === 'FIELDSET' && next.tagName === 'FIELDSET') looksGuest = true;
        }
        if (!looksGuest) continue;
        gb.style.setProperty('color', '#' + String(SLOT_QS.primary_color).replace(/^#/, ''), 'important');
        gb.style.setProperty('-webkit-text-fill-color', '#' + String(SLOT_QS.primary_color).replace(/^#/, ''), 'important');
        gb.style.setProperty('border-color', '#' + String(SLOT_QS.primary_color).replace(/^#/, ''), 'important');
        gb.style.setProperty('background', 'transparent', 'important');
        if (!gtxt && !/guest/i.test(garia)) {
          gb.setAttribute('aria-label', 'Add guests');
          var span = gb.querySelector('span') || gb;
          if (span && !(span.textContent || '').trim()) {
            span.textContent = 'Add guests';
            span.style.setProperty('color', '#' + String(SLOT_QS.primary_color).replace(/^#/, ''), 'important');
            span.style.setProperty('-webkit-text-fill-color', '#' + String(SLOT_QS.primary_color).replace(/^#/, ''), 'important');
            span.style.setProperty('width', 'auto', 'important');
            span.style.setProperty('height', 'auto', 'important');
            span.style.setProperty('font-size', '14px', 'important');
          }
        }
      }
      // Ensure Name/Email have visible shell labels when Calendly omits them
      function ensureFieldLabel(input, text) {
        if (!input || !input.parentElement) return;
        var id = input.id;
        if (id && document.querySelector('label[for=\"' + id + '\"]')) return;
        var existing = input.parentElement.querySelector('[data-pms-synth-label]');
        if (existing) return;
        var lab = document.createElement('div');
        lab.setAttribute('data-pms-synth-label', '1');
        lab.textContent = text;
        lab.style.cssText = 'color:#' + String(SLOT_QS.form_label).replace(/^#/, '') +
          ' !important;-webkit-text-fill-color:#' + String(SLOT_QS.form_label).replace(/^#/, '') +
          ' !important;font-size:14px;font-weight:600;margin:0 0 6px;';
        input.parentElement.insertBefore(lab, input);
      }
      ensureFieldLabel(document.querySelector('input[name=\"full_name\"]'), 'Name *');
      ensureFieldLabel(document.querySelector('input[name=\"email\"]'), 'Email *');
    } catch (e) {}
  }
  var paintTimer = null;
  function schedulePaint() {
    if (paintTimer) clearTimeout(paintTimer);
    paintTimer = setTimeout(paintSlots, 80);
  }
  function startPaint() {
    if (!document.body) return;
    paintSlots();
    var mo2 = new MutationObserver(schedulePaint);
    mo2.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-pressed', 'style'] });
  }
  if (document.body) startPaint();
  else document.addEventListener('DOMContentLoaded', startPaint);
})();
`
}

/** Rewrite relative src/href to absolute Calendly/CDN URLs. */
export function rewriteCalendlyAssetUrls(html: string, baseOrigin = 'https://calendly.com'): string {
  let out = html
  out = out.replace(
    /(src|href)=["'](\/[^"']+)["']/gi,
    (_, attr, path) => `${attr}="${baseOrigin}${path}"`,
  )
  out = out.replace(
    /(src|href)=["'](\/\/[^"']+)["']/gi,
    (_, attr, path) => `${attr}="https:${path}"`,
  )
  return out
}

export function injectIntoCalendlyHtml(html: string, theme: ProxyThemeParams): string {
  const css = `<style id="pms-calendly-slots">${buildInjectedSchedulerCss(theme)}</style>`
  const bootstrap = `<script id="pms-calendly-bootstrap">${buildInjectedBootstrapJs(theme)}</script>`
  const js = `<script id="pms-calendly-shims">${buildInjectedSchedulerJs(theme)}</script>`
  const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'self' https://calendly.com https://*.calendly.com https://*.cloudfront.net https://assets.calendly.com data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://calendly.com https://*.calendly.com https://assets.calendly.com; style-src 'self' 'unsafe-inline' https://calendly.com https://*.calendly.com; img-src 'self' data: blob: https: http:; connect-src 'self' https://calendly.com https://*.calendly.com https://*.cloudfront.net; frame-src https://calendly.com https://*.calendly.com https://js.stripe.com; font-src 'self' data: https:;">`
  let out = rewriteCalendlyAssetUrls(html)
  // Bootstrap FIRST in head so pathname is correct before Calendly scripts run
  if (/<head[^>]*>/i.test(out)) {
    out = out.replace(/<head[^>]*>/i, (m) => `${m}${bootstrap}${csp}${css}`)
  } else {
    out = bootstrap + csp + css + out
  }
  if (/<\/body>/i.test(out)) {
    out = out.replace(/<\/body>/i, `${js}</body>`)
  } else {
    out = out + js
  }
  return out
}

/** Heuristic: paid Calendly events from known URL patterns / query. */
export function isPaidCalendlyEventUrl(url: string): boolean {
  return /executive|design-review|talk-to-advisor|webinar-paid|services/i.test(url)
}
