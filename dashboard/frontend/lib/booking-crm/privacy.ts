const PHONE_KEYS = ['phone', 'phoneNumber', 'contactNumber', 'whatsapp', 'whatsappNumber'] as const;

export function maskEmail(value: string): string {
  const email = value.trim();
  if (!email) return '-';
  const separator = email.lastIndexOf('@');
  if (separator <= 0 || separator === email.length - 1) return '••••';
  const local = email.slice(0, separator);
  const domain = email.slice(separator + 1);
  return `${local.slice(0, 1)}***@${domain}`;
}

export function maskPhone(value: string): string {
  const phone = value.trim();
  if (!phone) return '-';
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '••••';
  return `•••• ${digits.slice(-4).padStart(Math.min(4, digits.length), '•')}`;
}

export function phoneFromPayload(payload: Record<string, unknown>): string {
  for (const key of PHONE_KEYS) {
    const value = payload[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return '';
}
