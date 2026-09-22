import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { WHATSAPP_PHONE_DISPLAY, openWhatsApp } from '../lib/whatsapp';

interface FloatingWhatsAppProps {
  lang: Language;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ lang }) => {
  const handleClick = () => {
    const text = lang === 'ar'
      ? 'مرحباً دروب كامب 🌊، أود الاستفسار عن حجز إقامة في رأس شيطان.'
      : 'Hello Droub Camp 🌊, I would like to inquire about booking a stay.';
    openWhatsApp(text);
  };

  return (
    <div
      id="floating-whatsapp-container"
      className="fixed bottom-5 end-4 md:bottom-7 md:end-7 z-50 flex items-center gap-2 group"
    >
      {/* Tooltip badge visible on hover or mobile glance */}
      <span className="hidden sm:inline-block bg-[#0F223D] text-white text-xs font-['Cairo'] font-semibold py-1.5 px-3 rounded-full shadow-lg border border-white/10 group-hover:opacity-100 opacity-90 transition-opacity">
        {lang === 'ar' ? 'تواصل معنا واتساب' : 'Chat on WhatsApp'}
      </span>

      {/* Floating Action Button */}
      <button
        id="floating-whatsapp-btn"
        onClick={handleClick}
        aria-label="Contact Droub Camp on WhatsApp"
        className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-xl hover:shadow-2xl active:scale-95 flex items-center justify-center transition-all duration-200 border-2 border-white focus:outline-none"
      >
        {/* Subtle breathing pulse ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping opacity-75 pointer-events-none"></span>
        <MessageCircle className="w-7 h-7 md:w-8 md:h-8 fill-white relative z-10" />
      </button>
    </div>
  );
};
