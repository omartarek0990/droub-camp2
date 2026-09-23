import React from 'react';
import { Language } from '../types';
import { translations } from '../lib/translations';
import { WHATSAPP_PHONE_DISPLAY } from '../lib/whatsapp';
import {
  MapPin,
  Phone,
  MessageCircle,
  Instagram,
  Facebook,
  CreditCard,
  Calendar,
  ExternalLink,
} from 'lucide-react';

interface LocationBookingSectionProps {
  lang: Language;
  bookingStep1?: string;
  bookingStep2?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  onOpenBooking?: () => void;
}

export const LocationBookingSection: React.FC<LocationBookingSectionProps> = ({
  lang,
  bookingStep1,
  bookingStep2,
  phone = WHATSAPP_PHONE_DISPLAY,
  whatsapp = WHATSAPP_PHONE_DISPLAY,
  instagram = 'droub.camp',
  facebook = 'droub.camp',
  onOpenBooking,
}) => {
  const t = translations[lang];

  return (
    <section id="location" className="py-14 sm:py-20 bg-[#FAF8F5] border-t border-[#E8E2D8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="inline-block text-[#D94E28] font-['Cairo'] font-bold text-xs sm:text-sm tracking-wider uppercase bg-[#FFF1ED] border border-[#FFDDD3] px-3.5 py-1 rounded-full mb-2.5">
            {t.location.badge}
          </span>
          <h2 className="font-['Cairo'] font-black text-2xl sm:text-3xl md:text-4xl text-[#0F223D] tracking-tight mb-3">
            {t.location.title}
          </h2>
          <p className="font-['Tajawal'] text-base sm:text-lg text-[#475569] leading-relaxed">
            {t.location.subtitle}
          </p>
        </div>

        {/* Content Stack */}
        <div className="space-y-6 mb-12">
          {/* Booking Steps Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#0F223D] text-[#D94E28] flex items-center justify-center shadow-xs">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-['Cairo'] font-bold text-lg sm:text-xl text-[#0F223D]">
                    {t.location.bookingStepsTitle}
                  </h3>
                  <p className="font-['Tajawal'] text-xs text-[#64748B]">
                    {lang === 'ar'
                      ? 'خطوتان بسيطتان لتثبيت حجزك وضمان غرفتك في دروب كامب'
                      : 'Two simple steps to guarantee and secure your stay at Droub Camp'}
                  </p>
                </div>
              </div>

              {onOpenBooking && (
                <button
                  onClick={onOpenBooking}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D94E28] hover:bg-[#C2411C] active:scale-95 text-white text-xs sm:text-sm font-['Cairo'] font-bold transition-all shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t.location.bookOnlineBtn}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Step 1 */}
              <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="w-8 h-8 rounded-full bg-[#0F223D] text-white font-['Cairo'] font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                  1
                </span>
                <div>
                  <h4 className="font-['Cairo'] font-bold text-sm sm:text-base text-[#0F223D]">
                    {lang === 'ar' ? (bookingStep1 || t.location.step1Title) : t.location.step1Title}
                  </h4>
                  <p className="font-['Tajawal'] text-xs text-[#64748B] mt-1 leading-relaxed">
                    {t.location.step1Desc}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5]">
                <span className="w-8 h-8 rounded-full bg-[#D94E28] text-white font-['Cairo'] font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                  2
                </span>
                <div>
                  <h4 className="font-['Cairo'] font-bold text-sm sm:text-base text-[#0F223D]">
                    {lang === 'ar' ? (bookingStep2 || t.location.step2Title) : t.location.step2Title}
                  </h4>
                  <p className="font-['Tajawal'] text-xs text-[#7C2D12] mt-1 leading-relaxed">
                    {t.location.step2Desc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* WhatsApp Card */}
            <a
              href={`https://wa.me/201061189414`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#25D366] hover:shadow-md transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <MessageCircle className="w-6 h-6 fill-[#25D366]/20" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-['Cairo'] text-[#64748B] block">
                  {t.location.whatsappLabel}
                </span>
                <span className="font-['Cairo'] font-extrabold text-base sm:text-lg text-[#0F223D] dir-ltr inline-block">
                  {whatsapp}
                </span>
              </div>
              <span className="text-xs font-['Cairo'] font-bold text-[#25D366] bg-[#E8F5E9] px-3 py-1 rounded-full hidden sm:inline-block">
                {lang === 'ar' ? 'متاح الآن' : 'Available'}
              </span>
            </a>

            {/* Phone Direct */}
            <a
              href={`tel:${phone}`}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#0F223D] hover:shadow-md transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#0F223D]/10 text-[#0F223D] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-['Cairo'] text-[#64748B] block">
                  {t.location.phoneLabel}
                </span>
                <span className="font-['Cairo'] font-extrabold text-base sm:text-lg text-[#0F223D] dir-ltr inline-block">
                  {phone}
                </span>
              </div>
              <span className="text-xs font-['Cairo'] font-bold text-[#0F223D] bg-[#F1F5F9] px-3 py-1 rounded-full hidden sm:inline-block">
                {lang === 'ar' ? 'اتصال مباشر' : 'Direct Call'}
              </span>
            </a>
          </div>

          {/* Social Media Links */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <span className="font-['Cairo'] font-bold text-sm sm:text-base text-[#0F223D] text-center sm:text-start">
              {t.location.followOfficialChannels}
            </span>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/droub.camp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FBF2EF] hover:bg-[#F8E3DD] text-[#C13584] text-xs font-bold font-['Cairo'] transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>@{instagram}</span>
              </a>
              <a
                href="https://facebook.com/droub.camp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EEF4FB] hover:bg-[#DDE9F7] text-[#1877F2] text-xs font-bold font-['Cairo'] transition-colors"
              >
                <Facebook className="w-4 h-4" />
                <span>{facebook}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Embedded Map Section */}
        <div className="rounded-3xl bg-white border border-[#E2E8F0] overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 border-b border-[#F1F5F9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0F223D] text-[#D94E28] flex items-center justify-center shadow-xs">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-['Cairo'] font-bold text-base text-[#0F223D]">
                  {t.location.mapTitle}
                </h4>
                <p className="font-['Tajawal'] text-xs text-[#64748B]">
                  {t.location.mapAddress}
                </p>
              </div>
            </div>

            <a
              href="https://maps.app.goo.gl/VQwFt5UE4rWu6R9y6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F223D] hover:bg-[#1E3A5F] active:scale-95 text-white font-['Cairo'] font-bold text-xs transition-colors"
            >
              <span>{t.common.viewOnGoogleMaps}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Embedded Google Map */}
          <div className="w-full h-80 sm:h-96 bg-[#E2E8F0] relative">
            <iframe
              title="Droub Camp Ras Shitan Map"
              src="https://maps.google.com/maps?q=Ras+Shitan+Nuweiba+South+Sinai&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};
