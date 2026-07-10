/**
 * Scheduler chrome for Calendly popup theming (all portal channels).
 * Shell colors match resolvePortalTheme exactly; slot fills are mode-aware with contrast ≥ 3.
 */
import type { PortalColorMode } from './platformThemeModes'
import { resolvePortalTheme } from './resolvePortalTheme'
import {
  ensureButtonContrast,
  isLightHexColor,
  meetsContrast,
  parseHexColor,
  pickButtonForeground,
} from './contrastUtils'
import type { PlatformPortalTheme } from './platformThemes'

export type SchedulerShell = {
  background: string
  text: string
  primary: string
  primaryForeground: string
}

export type SchedulerSlots = {
  dateFill: string
  dateLabel: string
  dateSelectedFill: string
  dateSelectedLabel: string
  timeFill: string
  timeLabel: string
  timeBorder: string
  timeSelectedFill: string
  timeSelectedLabel: string
}

export type SchedulerFormChrome = {
  /**
   * Invitee form labels (and radio option text) sit on the Calendly page shell,
   * not inside the white inputs — contrast against page background.
   */
  label: string
  /** Typed text + placeholders inside white Name/Email inputs. */
  fieldText: string
  submitFill: string
  submitLabel: string
}

/** Calendly invitee Name/Email inputs are white surfaces. */
const INVITEE_FIELD_SURFACE = '#FFFFFF'

/**
 * Labels contrast on page shell; typed/placeholder text contrasts on white fields.
 * (Calendly paints labels on the page bg; inputs are white — one token cannot serve both.)
 */
function formChromeForInvitee(
  theme: PlatformPortalTheme,
  pageBg: string,
  text: string,
): { label: string; fieldText: string } {
  const muted = solidHex(theme.textMuted, text)
  const label = meetsContrast(muted, pageBg, 4.5)
    ? muted
    : meetsContrast(text, pageBg, 4.5)
      ? text
      : pickButtonForeground(pageBg)
  const fieldText = meetsContrast(text, INVITEE_FIELD_SURFACE, 4.5)
    ? (isLightHexColor(text) ? pickButtonForeground(INVITEE_FIELD_SURFACE) : text)
    : pickButtonForeground(INVITEE_FIELD_SURFACE)
  // Prefer a dark readable ink on white even when shell text is light (dark mode)
  const fieldInk = isLightHexColor(fieldText)
    ? pickButtonForeground(INVITEE_FIELD_SURFACE)
    : fieldText
  return { label, fieldText: fieldInk }
}

export type SchedulerChrome = {
  channelId: string
  mode: PortalColorMode
  shell: SchedulerShell
  slots: SchedulerSlots
  form: SchedulerFormChrome
}

function solidHex(value: string, fallback: string): string {
  const v = value?.trim()
  if (v && parseHexColor(v)) return v
  if (v?.startsWith('#') && v.length === 7) return v
  return fallback
}

/** Unselected control surface: never white on dark pages. */
function unselectedFill(theme: PlatformPortalTheme, mode: PortalColorMode, pageBg: string): string {
  const surface = solidHex(theme.surface, mode === 'dark' ? '#18181B' : '#F4F4F5')
  const muted = solidHex(theme.surfaceMuted, surface)
  const card = solidHex(theme.cardBg, surface)
  const candidate = mode === 'dark' ? muted : card
  if (mode === 'dark' && isLightHexColor(candidate)) {
    return solidHex(theme.surface, '#18181B')
  }
  if (mode === 'dark' && candidate.toLowerCase() === '#ffffff') {
    return '#27272A'
  }
  // Prefer a fill distinct from page background when possible
  if (candidate.toLowerCase() === pageBg.toLowerCase()) {
    return mode === 'dark' ? solidHex(muted, '#27272A') : solidHex(muted, '#F4F4F5')
  }
  return candidate
}

/**
 * Ink for selected day/time digits on primary fill.
 * Never dark-on-vivid-red (website `#ff4a38` + `#0F172A` looked blank).
 */
function slotDigitInk(fill: string): string {
  const white = '#FFFFFF'
  const dark = '#0F172A'
  if (!isLightHexColor(fill) && meetsContrast(white, fill, 3)) return white
  if (meetsContrast(dark, fill, 4.5)) return dark
  if (meetsContrast(white, fill, 4.5)) return white
  return pickButtonForeground(fill)
}

/** Unselected day/time numbers: brand primary on gray fill when readable. */
function unselectedDigitInk(fill: string, primary: string, text: string): string {
  if (meetsContrast(primary, fill, 3)) return primary
  if (meetsContrast(text, fill, 3)) return text
  return slotDigitInk(fill)
}

/**
 * Resolve shell + date/time slot + form chrome for a portal channel.
 * Shell primary is theme.primary with no adjustHex drift.
 */
export function resolveSchedulerChrome(
  channelId: string,
  mode: PortalColorMode,
  typeLabel?: string,
): SchedulerChrome {
  const theme = resolvePortalTheme(channelId, mode, typeLabel)
  const pageBg = solidHex(theme.background, mode === 'dark' ? '#0A0A0B' : '#FFFFFF')
  const text = solidHex(theme.text, mode === 'dark' ? '#F4F4F5' : '#0F172A')
  const primary = solidHex(theme.primary, '#EA580C')
  const primaryFg = solidHex(
    theme.primaryForeground,
    ensureButtonContrast(primary, pickButtonForeground(primary)).foreground,
  )

  // Gray fills adapt to light/dark surface tokens; numbers = brand primary until selected
  const dateFill = unselectedFill(theme, mode, pageBg)
  const dateLabel = unselectedDigitInk(dateFill, primary, text)
  const selected = ensureButtonContrast(primary, primaryFg)
  // Selected: primary (orange) circle + white number
  const selectedDigit = slotDigitInk(selected.background)

  const timeFill = unselectedFill(theme, mode, pageBg)
  const timeLabel = unselectedDigitInk(timeFill, primary, text)
  const timeBorder = solidHex(theme.cardBorder, mode === 'dark' ? '#3F3F46' : '#E2E8F0')

  const formOnShell = formChromeForInvitee(theme, pageBg, text)

  return {
    channelId,
    mode,
    shell: {
      background: pageBg.replace(/^#/, ''),
      text: text.replace(/^#/, ''),
      primary: primary.replace(/^#/, ''),
      primaryForeground: selected.foreground.replace(/^#/, ''),
    },
    slots: {
      dateFill: dateFill.replace(/^#/, ''),
      dateLabel: dateLabel.replace(/^#/, ''),
      dateSelectedFill: selected.background.replace(/^#/, ''),
      dateSelectedLabel: selectedDigit.replace(/^#/, ''),
      timeFill: timeFill.replace(/^#/, ''),
      timeLabel: timeLabel.replace(/^#/, ''),
      timeBorder: timeBorder.replace(/^#/, ''),
      timeSelectedFill: selected.background.replace(/^#/, ''),
      timeSelectedLabel: selectedDigit.replace(/^#/, ''),
    },
    form: {
      label: formOnShell.label.replace(/^#/, ''),
      fieldText: formOnShell.fieldText.replace(/^#/, ''),
      submitFill: selected.background.replace(/^#/, ''),
      // Same digit/CTA ink rule — dark-on-red Schedule buttons were unreadable
      submitLabel: selectedDigit.replace(/^#/, ''),
    },
  }
}

/** Hex with leading # for CSS injection. */
export function schedulerHex(hexWithoutHash: string): string {
  const h = hexWithoutHash.replace(/^#/, '')
  return `#${h}`
}

/** Query params for proxy URL (slot_* + shell). */
export function schedulerChromeToQueryParams(chrome: SchedulerChrome): Record<string, string> {
  return {
    pms_channel: chrome.channelId,
    pms_mode: chrome.mode,
    background_color: chrome.shell.background,
    text_color: chrome.shell.text,
    primary_color: chrome.shell.primary,
    slot_date_fill: chrome.slots.dateFill,
    slot_date_label: chrome.slots.dateLabel,
    slot_date_selected_fill: chrome.slots.dateSelectedFill,
    slot_date_selected_label: chrome.slots.dateSelectedLabel,
    slot_time_fill: chrome.slots.timeFill,
    slot_time_label: chrome.slots.timeLabel,
    slot_time_border: chrome.slots.timeBorder,
    slot_time_selected_fill: chrome.slots.timeSelectedFill,
    slot_time_selected_label: chrome.slots.timeSelectedLabel,
    form_label: chrome.form.label,
    form_field_text: chrome.form.fieldText,
    form_submit_fill: chrome.form.submitFill,
    form_submit_label: chrome.form.submitLabel,
  }
}
