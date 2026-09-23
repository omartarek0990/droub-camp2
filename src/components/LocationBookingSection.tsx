import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../lib/translations';
import { WHATSAPP_PHONE_DISPLAY, buildCustomBookingFormMessage, openWhatsApp } from '../lib/whatsapp';
import {
  MapPin,
  Phone,
  MessageCircle,
  Instagram,
  Facebook,
  CreditCard,
  Calendar,
  Users,
  CheckCircle,
  ExternalLink,
  Sparkles,
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

  // Quick inquiry state
  const [formData, setFormData] = useState({
    name: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    roomType: t.location.roomOptionDeluxe,
    notes: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const message = buildCustomBookingFormMessage({
      name: formData.name,
      checkIn: formData.checkIn || (lang === 'ar' ? 'غير محدد بعد' : 'Not set'),
      checkOut: formData.checkOut || (lang === 'ar' ? 'غير محدد بعد' : 'Not set'),
      guests: formData.guests,
      roomType: formData.roomType,
      notes: formData.notes,
      lang: lang,
    });

    openWhatsApp(message);
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

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
          {/* Column 1: Steps & Contact Details */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            {/* Booking Steps Banner */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#0F223D] text-[#D94E28] flex items-center justify-center shadow-xs">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="font-['Cairo'] font-bold text-lg text-[#0F223D]">
                    {t.location.bookingStepsTitle}
                  </h3>
                </div>

                {onOpenBooking && (
                  <button
                    onClick={onOpenBooking}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D94E28] hover:bg-[#C2411C] text-white text-xs font-['Cairo'] font-bold transition-all shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{t.location.bookOnlineBtn}</span>
                  </button>
                )}
              </div>

              {/* Step 1 */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] mb-3">
                <span className="w-7 h-7 rounded-full bg-[#0F223D] text-white font-['Cairo'] font-bold text-sm flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-['Cairo'] font-bold text-sm sm:text-base text-[#0F223D]">
                    {bookingStep1 || t.location.step1Title}
                  </h4>
                  <p className="font-['Tajawal'] text-xs text-[#64748B] mt-0.5">
                    {t.location.step1Desc}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5]">
                <span className="w-7 h-7 rounded-full bg-[#D94E28] text-white font-['Cairo'] font-bold text-sm flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-['Cairo'] font-bold text-sm sm:text-base text-[#0F223D]">
                    {bookingStep2 || t.location.step2Title}
                  </h4>
                  <p className="font-['Tajawal'] text-xs text-[#7C2D12] mt-0.5">
                    {t.location.step2Desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Contact Cards & Socials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp Card */}
              <a
                href={`https://wa.me/201061189414`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#25D366] transition-colors flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 fill-[#25D366]/20" />
                </div>
                <div>
                  <span className="text-[11px] font-['Cairo'] text-[#64748B] block">
                    {lang === 'ar' ? 'واتساب الإدارة والاستفسار' : 'WhatsApp Desk'}
                  </span>
                  <span className="font-['Cairo'] font-extrabold text-base text-[#0F223D] dir-ltr inline-block">
                    {whatsapp}
                  </span>
                </div>
              </a>

              {/* Phone Direct */}
              <a
                href={`tel:${phone}`}
                className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#0F223D] transition-colors flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0F223D]/10 text-[#0F223D] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-['Cairo'] text-[#64748B] block">
                    {lang === 'ar' ? 'الاتصال الهاتفي المباشر' : 'Direct Phone Call'}
                  </span>
                  <span className="font-['Cairo'] font-extrabold text-base text-[#0F223D] dir-ltr inline-block">
                    {phone}
                  </span>
                </div>
              </a>
            </div>

            {/* Social Media Links */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <span className="font-['Cairo'] font-bold text-sm text-[#0F223D]">
                {t.location.followOfficialChannels}
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/droub.camp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FBF2EF] hover:bg-[#F8E3DD] text-[#C13584] text-xs font-bold font-['Cairo'] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@{instagram}</span>
                </a>
                <a
                  href="https://facebook.com/droub.camp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#EEF4FB] hover:bg-[#DDE9F7] text-[#1877F2] text-xs font-bold font-['Cairo'] transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  <span>{facebook}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Direct Contact Inquiry Form */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E2E8F0] shadow-md h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-['Cairo'] font-extrabold text-lg text-[#0F223D]">
                    {t.location.inquiryFormTitle}
                  </h3>
                  <span className="text-[11px] font-['Cairo'] text-[#0F223D] font-bold bg-[#F1F5F9] border border-[#CBD5E1] px-2.5 py-1 rounded-full">
                    {t.location.fastInquiry}
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                      {t.location.nameLabel} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t.location.namePlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F223D]/30 text-sm font-['Tajawal'] text-[#0F223D]"
                    />
                  </div>

                  {/* Dates: Check-in / Check-out */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                        {t.location.checkInLabel}
                      </label>
                      <input
                        type="date"
                        value={formData.checkIn}
                        onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-xl border border-[#CBD5E1] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F223D]/30 text-xs font-['Tajawal'] text-[#0F223D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                        {t.location.checkOutLabel}
                      </label>
                      <input
                        type="date"
                        value={formData.checkOut}
                        onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-xl border border-[#CBD5E1] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F223D]/30 text-xs font-['Tajawal'] text-[#0F223D]"
                      />
                    </div>
                  </div>

                  {/* Guests & Room Choice */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                        {t.location.guestsLabel}
                      </label>
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F223D]/30 text-xs font-['Cairo'] text-[#0F223D]"
                      >
                        <option value="1">{t.location.guest1}</option>
                        <option value="2">{t.location.guest2}</option>
                        <option value="3">{t.location.guest3}</option>
                        <option value="4">{t.location.guest4}</option>
                        <option value="5+">{t.location.guest5Plus}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                        {t.location.roomTypeLabel}
                      </label>
                      <select
                        value={formData.roomType}
                        onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                        className="w-full px-2 py-2 rounded-xl border border-[#CBD5E1] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F223D]/30 text-xs font-['Cairo'] text-[#0F223D]"
                      >
                        <option value={t.location.roomOptionDeluxe}>{t.location.roomOptionDeluxe}</option>
                        <option value={t.location.roomOptionSpecial}>{t.location.roomOptionSpecial}</option>
                        <option value={t.location.roomOptionNormal}>{t.location.roomOptionNormal}</option>
                        <option value={t.location.roomOptionPackage}>{t.location.roomOptionPackage}</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                      {t.location.notesLabel}
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder={t.location.notesPlaceholder}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F223D]/30 text-xs font-['Tajawal'] text-[#0F223D]"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] active:scale-95 text-white font-['Cairo'] font-black text-sm py-3.5 px-4 rounded-xl shadow-md transition-all mt-4"
                  >
                    <MessageCircle className="w-4 h-4 fill-white/20" />
                    <span>{t.location.sendWaInquiry}</span>
                  </button>
                </form>
              </div>

              {formSubmitted && (
                <div className="mt-3 p-3 rounded-xl bg-[#E8F5E9] text-[#2E7D32] text-xs font-['Cairo'] font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {t.location.inquirySentSuccess}
                  </span>
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

