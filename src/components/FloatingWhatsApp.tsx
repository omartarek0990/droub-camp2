import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../lib/translations';
import {
  BOOKING_INSTAGRAM_URL,
  buildGeneralStayInquiryMessage,
  copyMessageToClipboard,
} from '../lib/instagram';
import { Instagram, Check } from 'lucide-react';

interface FloatingWhatsAppProps {
  lang: Language;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ lang }) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const defaultMessage = buildGeneralStayInquiryMessage(lang);
    const ok = await copyMessageToClipboard(defaultMessage);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    }
  };

  return (
    <div
      id="floating-instagram-container"
      className="fixed bottom-5 end-4 md:bottom-7 md:end-7 z-50 flex items-center gap-2 group"
    >
      {/* Tooltip badge visible on desktop hover or when copied */}
      <span className="hidden sm:inline-block bg-[#0F223D] text-white text-xs font-['Cairo'] font-semibold py-1.5 px-3 rounded-full shadow-lg border border-white/10 group-hover:opacity-100 opacity-90 transition-opacity whitespace-nowrap">
        {copied
          ? lang === 'ar'
            ? 'تم نسخ الرسالة! الصقها في إنستجرام'
            : 'Copied! Paste in Instagram DM'
          : t.common.chatOnWhatsApp}
      </span>

      {/* Floating Action Button (Instagram DM link to @everyday.travelc) */}
      <a
        id="floating-instagram-btn"
        href={BOOKING_INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label={t.common.chatOnWhatsApp}
        className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:brightness-110 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-90 active:shadow-inner flex items-center justify-center transform transition-all duration-150 border-2 border-white focus:outline-none cursor-pointer group/btn"
      >
        {/* Subtle breathing pulse animation rings */}
        <span className="absolute -inset-1 rounded-full bg-[#DD2A7B]/40 animate-ping opacity-75 pointer-events-none" />
        <span className="absolute -inset-1 rounded-full bg-[#DD2A7B]/25 animate-pulse pointer-events-none" />

        {copied ? (
          <Check className="w-7 h-7 md:w-8 md:h-8 text-white relative z-10 drop-shadow-sm" />
        ) : (
          <Instagram className="w-7 h-7 md:w-8 md:h-8 text-white relative z-10 transition-transform duration-200 group-hover/btn:scale-110 drop-shadow-sm" />
        )}
      </a>
    </div>
  );
};


