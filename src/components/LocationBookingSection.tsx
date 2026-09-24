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
  ShieldCheck,
  CheckCircle2,
  Clock,
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-12">
          {/* Column 1: Camp Location & Direct Contact Info */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#0F223D] text-[#D94E28] flex items-center justify-center shadow-xs">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-['Cairo'] font-bold text-lg text-[#0F223D]">
                      {t.location.campLocationTitle}
                    </h3>
                    <p className="font-['Tajawal'] text-xs sm:text-sm text-[#64748B]">
                      {t.location.campLocationSubtitle}
                    </p>
                  </div>
                </div>

                <p className="font-['Tajawal'] text-xs sm:text-sm text-[#334155] leading-relaxed mb-6">
                  {t.location.campLocationDesc}
                </p>

                {/* Direct Contact Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {/* General WhatsApp Inquiries */}
                  <a
                    href={`https://wa.me/201061189414`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2E8F0] hover:border-[#25D366] hover:bg-[#F0FDF4] transition-all flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-5 h-5 fill-[#25D366]/20" />
                    </div>
                    <div>
                      <span className="text-[11px] font-['Cairo'] text-[#64748B] block">
                        {t.common.generalInquiries}
                      </span>
                      <span className="font-['Cairo'] font-bold text-xs sm:text-sm text-[#0F223D] dir-ltr inline-block">
                        {whatsapp}
                      </span>
                    </div>
                  </a>

                  {/* Direct Phone Call */}
                  <a
                    href={`tel:${phone}`}
                    className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2E8F0] hover:border-[#0F223D] hover:bg-white transition-all flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#0F223D]/10 text-[#0F223D] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-['Cairo'] text-[#64748B] block">
                        {t.common.directCall}
                      </span>
                      <span className="font-['Cairo'] font-bold text-xs sm:text-sm text-[#0F223D] dir-ltr inline-block">
                        {phone}
                      </span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                <span className="font-['Cairo'] font-bold text-xs text-[#0F223D]">
                  {t.location.followOfficialChannels}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://instagram.com/droub.camp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FBF2EF] text-[#C13584] text-xs font-bold font-['Cairo'] border border-[#E2E8F0] transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>@{instagram}</span>
                  </a>
                  <a
                    href="https://facebook.com/droub.camp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#EEF4FB] text-[#1877F2] text-xs font-bold font-['Cairo'] border border-[#E2E8F0] transition-colors"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                    <span>{facebook}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Official Booking System & InstaPay Confirmation Guide */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#D94E28]/15 text-[#D94E28] flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="font-['Cairo'] font-black text-lg text-[#0F223D]">
                      {t.location.howToBookTitle}
                    </h3>
                  </div>
                  <span className="text-[11px] font-['Cairo'] text-[#16a34a] font-bold bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-1 rounded-full">
                    {t.location.officialProcedure}
                  </span>
                </div>

                {/* Steps List */}
                <div className="space-y-3.5 mb-6">
                  {/* Step 1 */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2E8F0] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0F223D] text-white text-xs font-['Cairo'] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <h4 className="font-['Cairo'] font-bold text-xs sm:text-sm text-[#0F223D] mb-0.5">
                        {t.location.step1Title}
                      </h4>
                      <p className="font-['Tajawal'] text-xs text-[#475569] leading-relaxed">
                        {bookingStep1 || t.location.step1Desc}
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2E8F0] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0F223D] text-white text-xs font-['Cairo'] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <h4 className="font-['Cairo'] font-bold text-xs sm:text-sm text-[#0F223D] mb-0.5">
                        {t.location.step2Title}
                      </h4>
                      <p className="font-['Tajawal'] text-xs text-[#475569] leading-relaxed">
                        {t.location.step2Desc}
                      </p>
                    </div>
                  </div>

                  {/* Step 3: InstaPay */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2E8F0] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#D94E28] text-white text-xs font-['Cairo'] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <h4 className="font-['Cairo'] font-bold text-xs sm:text-sm text-[#0F223D] mb-0.5 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#D94E28]" />
                        <span>{t.location.step3Title}</span>
                      </h4>
                      <p className="font-['Tajawal'] text-xs text-[#475569] leading-relaxed">
                        {bookingStep2 || t.location.step3Desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button: Launch On-Site Calendar Booking */}
              {onOpenBooking && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenBooking}
                    className="w-full flex items-center justify-center gap-2.5 bg-[#D94E28] hover:bg-[#C2411C] active:scale-[0.98] text-white font-['Cairo'] font-black text-sm sm:text-base py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>{t.common.bookNow}</span>
                  </button>
                  <p className="text-center text-[11px] font-['Tajawal'] text-[#64748B] mt-2 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" />
                    <span>{t.location.realTimeAvailability}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Embedded Map Section */}
        <div className="rounded-3xl bg-white border border-[#E2E8F0] overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 border-b border-[#F1F5F9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F223D] text-[#D94E28] flex items-center justify-center shadow-xs">
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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F223D] hover:bg-[#1E3A5F] active:scale-95 text-white font-['Cairo'] font-bold text-xs transition-colors"
            >
              <span>{t.common.viewOnGoogleMaps}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Embedded Google Map */}
          <div className="w-full h-80 sm:h-96 bg-[#E2E8F0] relative">
            <iframe
              title="Jazz Camp Ras Shitan Map"
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
