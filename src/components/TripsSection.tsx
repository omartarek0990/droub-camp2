import React from 'react';
import { TripItem, Language } from '../types';
import { translations } from '../lib/translations';
import { buildTripInquiryMessage, openWhatsApp } from '../lib/whatsapp';
import { Compass, MessageCircle, Info, Mountain, MapPin } from 'lucide-react';

interface TripsSectionProps {
  trips: TripItem[];
  lang: Language;
  tripsIntro?: string;
}

export const TripsSection: React.FC<TripsSectionProps> = ({
  trips,
  lang,
  tripsIntro,
}) => {
  const t = translations[lang];

  const activeTrips = trips.filter((t) => t.is_active !== false);

  const handleAskAboutTrip = (trip: TripItem) => {
    const msg = buildTripInquiryMessage(trip.title, lang);
    openWhatsApp(msg);
  };

  return (
    <section id="trips" className="py-14 sm:py-20 bg-[#F4EFEA] border-t border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <span className="inline-block text-[#0F223D] font-['Cairo'] font-bold text-xs sm:text-sm tracking-wider uppercase bg-[#E2E8F0] px-3.5 py-1 rounded-full mb-2.5">
            {lang === 'ar' ? 'مغامرات ووديان سيناء' : 'Sinai Mountain Adventures'}
          </span>
          <h2 className="font-['Cairo'] font-black text-2xl sm:text-3xl md:text-4xl text-[#0F223D] tracking-tight mb-3">
            {t.tripsTitle}
          </h2>
          <p className="font-['Tajawal'] text-base sm:text-lg text-[#475569] leading-relaxed mb-6">
            {t.tripsSubtitle}
          </p>

          {/* Pricing Disclaimer Note (as explicitly requested) */}
          <div className="bg-white border-s-4 border-[#D94E28] rounded-2xl p-4 sm:p-5 text-start shadow-sm border border-[#E2E8F0]">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#D94E28] flex-shrink-0 mt-0.5" />
              <p className="font-['Tajawal'] text-xs sm:text-sm text-[#334155] leading-relaxed font-medium">
                {tripsIntro || t.tripsIntro}
              </p>
            </div>
          </div>
        </div>

        {/* Trips Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {activeTrips.map((trip, index) => (
            <div
              key={trip.id || index}
              className="flex flex-col sm:flex-row rounded-3xl bg-white border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              {/* Trip Photo (Left or Top depending on responsive) */}
              <div className="relative w-full sm:w-2/5 min-h-[200px] sm:min-h-full overflow-hidden bg-[#E2E8F0]">
                <img
                  src={trip.image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80'}
                  alt={trip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden"></div>
                <div className="absolute top-3 start-3 bg-[#0F223D]/90 backdrop-blur-md text-white text-[11px] font-['Cairo'] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                  <Mountain className="w-3 h-3 text-[#D94E28]" />
                  <span>{lang === 'ar' ? 'مرشد بدوي محلي' : 'Local Bedouin Guide'}</span>
                </div>
              </div>

              {/* Trip Details */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-['Cairo'] font-black text-lg sm:text-xl text-[#0F223D] mb-2 leading-snug">
                    {trip.title}
                  </h3>
                  <p className="font-['Tajawal'] text-xs sm:text-sm text-[#475569] leading-relaxed mb-6">
                    {trip.description}
                  </p>
                </div>

                {/* Card Bottom: Contact & Action */}
                <div className="pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="text-[11px] text-[#64748B] font-['Cairo']">
                    <span>{lang === 'ar' ? 'الأسعار تُحدد حسب عدد الأفراد' : 'Quote based on group size'}</span>
                  </div>
                  <button
                    onClick={() => handleAskAboutTrip(trip)}
                    className="inline-flex items-center justify-center gap-2 bg-[#0F223D] hover:bg-[#1E3A5F] active:scale-95 text-white font-['Cairo'] font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-white/20" />
                    <span>{t.askAboutTrip}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
