import React, { useState } from 'react';
import { RoomPricing, Language, OccupancyType } from '../types';
import { translations } from '../lib/translations';
import { BedDouble, Users, Sparkles, Check, Info, Calendar } from 'lucide-react';

interface PricingSectionProps {
  rooms: RoomPricing[];
  lang: Language;
  pricingNote?: string;
  onOpenBooking: (roomType: string, occupancy: OccupancyType) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  rooms,
  lang,
  pricingNote,
  onOpenBooking,
}) => {
  const t = translations[lang];
  const [selectedOccupancy, setSelectedOccupancy] = useState<'all' | OccupancyType>('all');

  // Representative room imagery and feature tags for Droub Camp accommodations
  const getRoomMeta = (roomType: string) => {
    const lower = roomType.toLowerCase();
    if (lower.includes('ديلوكس') || lower.includes('deluxe') || lower.includes('seaview')) {
      return {
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
        badge: lang === 'ar' ? 'الأكثر طلباً' : 'Most Popular',
        features: lang === 'ar' 
          ? ['إطلالة بانورامية مباشرة على البحر', 'تكييف وحمام خاص متكامل', 'شرفة خاصة مواجهة لأمواج خليج العقبة', 'شامل إفطار وعشاء يومياً']
          : ['Direct Panoramic Sea View', 'Private Bath & AC', 'Private Beachfront Balcony', 'Breakfast & Dinner Included'],
        idealFor: lang === 'ar' ? 'مثالية للباحثين عن أقصى درجات الراحة مع هدوء الشاطئ' : 'Ideal for travelers seeking utmost comfort by the sea'
      };
    } else if (lower.includes('مميز') || lower.includes('special')) {
      return {
        image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
        badge: lang === 'ar' ? 'أجواء الشاطئ' : 'Beachfront Hut',
        features: lang === 'ar'
          ? ['مواجه للشاطئ على الرمال مباشرة', 'مروحة وتصميم بيئي طبيعي مريح', 'حمامات نظيفة مشتركة قريبة', 'شامل إفطار وعشاء يومياً']
          : ['Direct on the Sand', 'Eco Fan & Natural Build', 'Modern Clean Shared Facilities', 'Breakfast & Dinner Included'],
        idealFor: lang === 'ar' ? 'تجربة سينائية أصيلة على صوت تلاطم الأمواج' : 'Authentic Sinai hut experience steps from the water'
      };
    } else {
      return {
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
        badge: lang === 'ar' ? 'اقتصادي وأصيل' : 'Classic Sinai Hut',
        features: lang === 'ar'
          ? ['كوخ من خامات الجريد والخشب البسيط', 'إضاءة ومروحة وكهرباء لشحن الهواتف', 'حمامات نظيفة مشتركة', 'شامل إفطار وعشاء يومياً']
          : ['Classic Reeds & Timber Hut', 'Light & Power Outlet', 'Clean Shared Bathrooms', 'Breakfast & Dinner Included'],
        idealFor: lang === 'ar' ? 'الخيار الكلاسيكي لبساطة رأس شيطان التاريخية' : 'The classic way to experience historic Ras Shitan'
      };
    }
  };

  return (
    <section id="accommodation" className="py-14 sm:py-20 bg-[#FAF8F5] border-t border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="inline-block text-[#D94E28] font-['Cairo'] font-bold text-xs sm:text-sm tracking-wider uppercase bg-[#FFF1ED] border border-[#FFDDD3] px-3.5 py-1 rounded-full mb-2.5">
            {lang === 'ar' ? 'خيارات الإقامة في رأس شيطان' : 'Accommodations in Ras Shitan'}
          </span>
          <h2 className="font-['Cairo'] font-black text-2xl sm:text-3xl md:text-4xl text-[#0F223D] tracking-tight mb-3">
            {t.roomPricingTitle}
          </h2>
          <p className="font-['Tajawal'] text-base sm:text-lg text-[#475569] leading-relaxed">
            {t.roomPricingSubtitle}
          </p>

          {/* Pricing Note Callout */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs sm:text-sm font-semibold font-['Tajawal']">
            <Info className="w-4 h-4 text-[#16a34a] flex-shrink-0" />
            <span>{pricingNote || t.pricingNote || 'الأسعار المعروضة هي للغرفة في الليلة الواحدة، شاملة وجبتي الإفطار والعشاء.'}</span>
          </div>
        </div>

        {/* Occupancy Filter Bar (Mobile-Optimized Horizontal Scroll / Pills) */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-8 overflow-x-auto pb-2 px-2 no-scrollbar">
          <button
            onClick={() => setSelectedOccupancy('all')}
            className={`px-3.5 py-2 rounded-xl font-['Cairo'] text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              selectedOccupancy === 'all'
                ? 'bg-[#0F223D] text-white shadow-sm'
                : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
            }`}
          >
            {lang === 'ar' ? 'جميع الإشغالات' : 'All Occupancies'}
          </button>
          <button
            onClick={() => setSelectedOccupancy('single')}
            className={`px-3.5 py-2 rounded-xl font-['Cairo'] text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              selectedOccupancy === 'single'
                ? 'bg-[#0F223D] text-white shadow-sm'
                : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
            }`}
          >
            {t.singleOccupancy} (فردي)
          </button>
          <button
            onClick={() => setSelectedOccupancy('double')}
            className={`px-3.5 py-2 rounded-xl font-['Cairo'] text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              selectedOccupancy === 'double'
                ? 'bg-[#0F223D] text-white shadow-sm'
                : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
            }`}
          >
            {t.doubleOccupancy} (مزدوج)
          </button>
          <button
            onClick={() => setSelectedOccupancy('triple')}
            className={`px-3.5 py-2 rounded-xl font-['Cairo'] text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              selectedOccupancy === 'triple'
                ? 'bg-[#0F223D] text-white shadow-sm'
                : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
            }`}
          >
            {t.tripleOccupancy} (ثلاثي)
          </button>
          <button
            onClick={() => setSelectedOccupancy('quadruple')}
            className={`px-3.5 py-2 rounded-xl font-['Cairo'] text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              selectedOccupancy === 'quadruple'
                ? 'bg-[#0F223D] text-white shadow-sm'
                : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
            }`}
          >
            {t.quadOccupancy} (رباعي)
          </button>
        </div>

        {/* Room Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {rooms.map((room, index) => {
            const meta = getRoomMeta(room.room_type);
            const isDeluxe = room.room_type.includes('ديلوكس') || room.room_type.includes('Deluxe');

            return (
              <div
                key={room.id || index}
                className={`relative flex flex-col rounded-3xl bg-white border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
                  isDeluxe ? 'border-[#0F223D]/30 ring-1 ring-[#0F223D]/10' : 'border-[#E2E8F0]'
                }`}
              >
                {/* Room Image Container */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#E2E8F0]">
                  <img
                    src={meta.image}
                    alt={room.room_type}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                  {/* Room Category Badge */}
                  <span className="absolute top-3 end-3 bg-[#0F223D]/85 backdrop-blur-md text-white text-xs font-['Cairo'] font-bold px-3 py-1 rounded-full border border-white/20">
                    {meta.badge}
                  </span>

                  {/* Room Title on Image Bottom */}
                  <div className="absolute bottom-3 start-4 end-4">
                    <h3 className="font-['Cairo'] font-black text-lg sm:text-xl text-white drop-shadow-md">
                      {room.room_type}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  {/* Features List */}
                  <div>
                    <p className="font-['Tajawal'] text-xs sm:text-sm text-[#64748B] italic mb-4">
                      {meta.idealFor}
                    </p>

                    <div className="space-y-2 mb-6">
                      {meta.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs sm:text-sm font-['Tajawal'] text-[#334155]">
                          <Check className="w-4 h-4 text-[#D94E28] flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Occupancy Price Matrix */}
                  <div className="pt-4 border-t border-[#F1F5F9] mb-5">
                    <div className="text-xs font-['Cairo'] font-bold text-[#64748B] mb-2.5 flex items-center justify-between">
                      <span>{lang === 'ar' ? 'الأسعار حسب عدد النزلاء:' : 'Rates by Occupancy:'}</span>
                      <span className="text-[11px] text-[#D94E28] font-semibold">{t.perRoomPerNight}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Single */}
                      {(selectedOccupancy === 'all' || selectedOccupancy === 'single') && (
                        <div className={`p-2.5 rounded-xl border text-center transition-colors ${
                          selectedOccupancy === 'single' ? 'bg-[#FFF7ED] border-[#FDBA74]' : 'bg-[#FAF8F5] border-[#E2E8F0]'
                        }`}>
                          <div className="text-[11px] text-[#64748B] font-['Tajawal']">{t.singleOccupancy} (1 فرد)</div>
                          <div className="font-['Cairo'] font-extrabold text-sm sm:text-base text-[#0F223D]">
                            {room.single_price ? `${room.single_price} ${t.egp}` : '—'}
                          </div>
                        </div>
                      )}

                      {/* Double */}
                      {(selectedOccupancy === 'all' || selectedOccupancy === 'double') && (
                        <div className={`p-2.5 rounded-xl border text-center transition-colors ${
                          selectedOccupancy === 'double' ? 'bg-[#FFF7ED] border-[#FDBA74]' : 'bg-[#FAF8F5] border-[#E2E8F0]'
                        }`}>
                          <div className="text-[11px] text-[#64748B] font-['Tajawal']">{t.doubleOccupancy} (2 أفراد)</div>
                          <div className="font-['Cairo'] font-extrabold text-sm sm:text-base text-[#D94E28]">
                            {room.double_price ? `${room.double_price} ${t.egp}` : '—'}
                          </div>
                        </div>
                      )}

                      {/* Triple */}
                      {(selectedOccupancy === 'all' || selectedOccupancy === 'triple') && (
                        <div className={`p-2.5 rounded-xl border text-center transition-colors ${
                          selectedOccupancy === 'triple' ? 'bg-[#FFF7ED] border-[#FDBA74]' : 'bg-[#FAF8F5] border-[#E2E8F0]'
                        }`}>
                          <div className="text-[11px] text-[#64748B] font-['Tajawal']">{t.tripleOccupancy} (3 أفراد)</div>
                          <div className="font-['Cairo'] font-extrabold text-sm sm:text-base text-[#0F223D]">
                            {room.triple_price ? `${room.triple_price} ${t.egp}` : '—'}
                          </div>
                        </div>
                      )}

                      {/* Quadruple */}
                      {(selectedOccupancy === 'all' || selectedOccupancy === 'quadruple') && (
                        <div className={`p-2.5 rounded-xl border text-center transition-colors ${
                          selectedOccupancy === 'quadruple' ? 'bg-[#FFF7ED] border-[#FDBA74]' : 'bg-[#FAF8F5] border-[#E2E8F0]'
                        }`}>
                          <div className="text-[11px] text-[#64748B] font-['Tajawal']">{t.quadOccupancy} (4 أفراد)</div>
                          <div className="font-['Cairo'] font-extrabold text-sm sm:text-base text-[#0F223D]">
                            {room.quadruple_price ? `${room.quadruple_price} ${t.egp}` : '—'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* REAL ON-SITE BOOKING BUTTON */}
                  <button
                    onClick={() => {
                      const occToUse = selectedOccupancy === 'all' ? 'double' : selectedOccupancy;
                      onOpenBooking(room.room_type, occToUse);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[#D94E28] hover:bg-[#C2411C] active:scale-[0.98] text-white font-['Cairo'] font-bold text-sm py-3.5 px-4 rounded-xl shadow-md transition-all duration-200"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'احجز الآن وافحص التواريخ المتاحة' : 'Book Now & Check Dates'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
