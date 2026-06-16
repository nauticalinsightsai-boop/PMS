'use client';

import { MessageCircle } from 'lucide-react';
import { getPmsWhatsAppChatUrl, getPmsWhatsAppDisplay, isWhatsAppConfigured } from '@/config/pms-site';

export function WhatsAppChatButton() {
  if (!isWhatsAppConfigured()) return null;

  return (
    <a
      href={getPmsWhatsAppChatUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat on WhatsApp (${getPmsWhatsAppDisplay()})`}
      className="fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      <MessageCircle className="h-7 w-7" aria-hidden />
    </a>
  );
}
