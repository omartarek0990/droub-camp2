import React, { useState } from 'react';
import { RoomPricing, Language, OccupancyType, ItemPhoto } from '../types';
import { translations, translateRoomType } from '../lib/translations';
import { PhotoCarousel } from './PhotoCarousel';
import { BedDouble, Users, Sparkles, Check, Info, Calendar } from 'lucide-react';

interface PricingSectionProps {
  rooms: RoomPricing[];
  lang: Language;
  pricingNote?: string;
  itemPhotos?: ItemPhoto[];
  onOpenBooking: (roomType: string, occupancy: OccupancyType) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  rooms,
  lang,
  pricingNote,
  itemPhotos = [],
  onOpenBooking,
}) => {
  const t = translations[lang];
  const [selectedOccupancy, setSelectedOccupancy] = useState<'all' | OccupancyType>('all');

  // Representative room imagery and feature tags for Jazz Camp accommodations
  const getRoomMeta = (roomType: string) => {
    const lower = roomType.toLowerCase();
    if (lower.includes('ديلوكس') || lower.includes('deluxe') || lower.includes('seaview')) {
      return {
        defaultPhotos: [
          'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        ],
        badge: t.pricing.deluxeBadge,
        features: t.pricing.deluxeFeatures,
        idealFor: t.pricing.deluxeIdealFor,
      };
    } else if (lower.includes('مميز') || lower.includes('special')) {
      return {
        defaultPhotos: [
          'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        ],
        badge: t.pricing.specialBadge,
        features: t.pricing.specialFeatures,
        idealFor: t.pricing.specialIdealFor,
      };
    } else {
      return {
        defaultPhotos: [
          'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1519046904884-53103b34b271?auto=format&fit=crop&w=800&q=80',
        ],
        badge: t.pricing.classicBadge,
        features: t.pricing.classicFeatures,
        idealFor: t.pricing.classicIdealFor,
      };
    }
  };

  return (
    <section id="accommodation" className="py-14 sm:py-20 bg-[#FAF8F5] border-t border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="inline-block text-[#D94E28] font-['Cairo'] font-bold text-xs sm:text-sm tracking-wider uppercase bg-[#FFF1ED] border border-[#FFDDD3] px-3.5 py-1 rounded-full mb-2.5">
            {t.pricing.badge}
          </span>
          <h2 className="font-['Cairo'] font-black text-2xl sm:text-3xl md:text-4xl text-[#0F223D] tracking-tight mb-3">
            {t.pricing.title}
          </h2>
          <p className="font-['Tajawal'] text-base sm:text-lg text-[#475569] leading-relaxed">
            {t.pricing.subtitle}
          </p>

          {/* Pricing Note Callout */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs sm:text-sm font-semibold font-['Tajawal']">
            <Info className="w-4 h-4 text-[#16a34a] flex-shrink-0" />
            <span>
              {lang === 'en'
                ? pricingNote && !/[\u0600-\u06ff]/.test(pricingNote)
                  ? pricingNote
                  : t.pricing.note
                : pricingNote || t.pricing.note}
            </span>
          </div>
        </div>

        {/* Occupancy Filter Bar (Mobile-Optimized Horizontal Scroll / Pills) */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-8 overflow-x-auto pb-2 px-2 no-scrollbar">
          <button
            onClick={() => setSelectedOccupancy('all')}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-['Cairo'] font-bold transition-all whitespace-nowrap ${
              selectedOccupancy === 'all'
                ? 'bg-[#0F223D] text-white shadow-sm'
                : 'bg-white text-[#64748B] border border-[#CBD5E1] hover:border-[#0F223D]'
            }`}
          >
            {t.pricing.allOccupancies}
          </button>
          <button
            onClick={() => setSelectedOccupancy('single')}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-['Cairo'] font-bold transition-all whitespace-nowrap ${
              selectedOccupancy === 'single'
                ? 'bg-[#0F223D] text-white shadow-sm'
                : 'bg-white text-[#64748B] border border-[#CBD5E1] hover:border-[#0F223D]'
            }`}
          >
            {t.pricing.single}
          </button>
          <button
            onClick={() => setSelectedOccupancy('double')}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-['Cairo'] font-bold transition-all whitespace-nowrap ${
              selectedOccupancy === 'double'
                ? 'bg-[#0F223D] text-white shadow-sm'
                : 'bg-white text-[#64748B] border border-[#CBD5E1] hover:border-[#0F223D]'
            }`}
          >
            {t.pricing.double}
          </button>
          <button
            onClick={() => setSelectedOccupancy('triple')}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-['Cairo'] font-bold transition-all whitespace-nowrap ${
              selectedOccupancy === 'triple'
                ? 'bg-[#0F223D] text-white shadow-sm'
                : 'bg-white text-[#64748B] border border-[#CBD5E1] hover:border-[#0F223D]'
            }`}
          >
            {t.pricing.triple}
          </button>
          <button
            onClick={() => setSelectedOccupancy('quadruple')}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-['Cairo'] font-bold transition-all whitespace-nowrap ${
              selectedOccupancy === 'quadruple'
                ? 'bg-[#0F223D] text-white shadow-sm'
                : 'bg-white text-[#64748B] border border-[#CBD5E1] hover:border-[#0F223D]'
            }`}
          >
            {t.pricing.quadruple}
          </button>
        </div>

        {/* Room Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {rooms.map((room, index) => {
            const meta = getRoomMeta(room.room_type);
            const isDeluxe = room.room_type.includes('ديلوكس') || room.room_type.includes('Deluxe');
            const translatedTitle = translateRoomType(room.room_type, lang);

            // Find all photos uploaded for this room
            const customPhotos = (itemPhotos || [])
              .filter(
                (p) =>
                  p.item_type === 'room' &&
                  (p.item_key === room.room_type || p.item_key === String(room.id))
              )
              .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
              .map((p) => p.image_url);

            const displayPhotos = customPhotos.length > 0 ? customPhotos : meta.defaultPhotos;

            return (
              <div
                key={room.id || index}
                className={`relative flex flex-col rounded-3xl bg-white border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
                  isDeluxe ? 'border-[#0F223D]/30 ring-1 ring-[#0F223D]/10' : 'border-[#E2E8F0]'
                }`}
              >
                {/* Multi-Photo Carousel */}
                <PhotoCarousel
                  photos={displayPhotos}
                  alt={translatedTitle}
                  aspectRatioClass="h-52 sm:h-56"
                  badge={
                    <span className="bg-[#0F223D]/85 backdrop-blur-md text-white text-xs font-['Cairo'] font-bold px-3 py-1 rounded-full border border-white/20">
                      {meta.badge}
                    </span>
                  }
                  overlayContent={
                    <h3 className="font-['Cairo'] font-black text-lg sm:text-xl text-white drop-shadow-md">
                      {translatedTitle}
                    </h3>
                  }
                />

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
                      <span>{t.pricing.ratesByOccupancy}</span>
                      <span className="text-[11px] text-[#D94E28] font-semibold">{t.common.perRoomPerNight}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Single */}
                      {(selectedOccupancy === 'all' || selectedOccupancy === 'single') && (
                        <div className={`p-2.5 rounded-xl border text-center transition-colors ${
                          selectedOccupancy === 'single' ? 'bg-[#FFF7ED] border-[#FDBA74]' : 'bg-[#FAF8F5] border-[#E2E8F0]'
                        }`}>
                          <div className="text-[11px] text-[#64748B] font-['Tajawal']">{t.pricing.singleWithCount}</div>
                          <div className="font-['Cairo'] font-extrabold text-sm sm:text-base text-[#0F223D]">
                            {room.single_price ? `${room.single_price} ${t.common.currency}` : (lang === 'ar' ? 'عند الطلب' : 'Upon Request')}
                          </div>
                        </div>
                      )}

                      {/* Double */}
                      {(selectedOccupancy === 'all' || selectedOccupancy === 'double') && (
                        <div className={`p-2.5 rounded-xl border text-center transition-colors ${
                          selectedOccupancy === 'double' ? 'bg-[#FFF7ED] border-[#FDBA74]' : 'bg-[#FAF8F5] border-[#E2E8F0]'
                        }`}>
                          <div className="text-[11px] text-[#64748B] font-['Tajawal']">{t.pricing.doubleWithCount}</div>
                          <div className="font-['Cairo'] font-extrabold text-sm sm:text-base text-[#0F223D]">
                            {room.double_price ? `${room.double_price} ${t.common.currency}` : (lang === 'ar' ? 'عند الطلب' : 'Upon Request')}
                          </div>
                        </div>
                      )}

                      {/* Triple */}
                      {(selectedOccupancy === 'all' || selectedOccupancy === 'triple') && (
                        <div className={`p-2.5 rounded-xl border text-center transition-colors ${
                          selectedOccupancy === 'triple' ? 'bg-[#FFF7ED] border-[#FDBA74]' : 'bg-[#FAF8F5] border-[#E2E8F0]'
                        }`}>
                          <div className="text-[11px] text-[#64748B] font-['Tajawal']">{t.pricing.tripleWithCount}</div>
                          <div className="font-['Cairo'] font-extrabold text-sm sm:text-base text-[#0F223D]">
                            {room.triple_price ? `${room.triple_price} ${t.common.currency}` : (lang === 'ar' ? 'عند الطلب' : 'Upon Request')}
                          </div>
                        </div>
                      )}

                      {/* Quadruple */}
                      {(selectedOccupancy === 'all' || selectedOccupancy === 'quadruple') && (
                        <div className={`p-2.5 rounded-xl border text-center transition-colors ${
                          selectedOccupancy === 'quadruple' ? 'bg-[#FFF7ED] border-[#FDBA74]' : 'bg-[#FAF8F5] border-[#E2E8F0]'
                        }`}>
                          <div className="text-[11px] text-[#64748B] font-['Tajawal']">{t.pricing.quadrupleWithCount}</div>
                          <div className="font-['Cairo'] font-extrabold text-sm sm:text-base text-[#0F223D]">
                            {room.quadruple_price ? `${room.quadruple_price} ${t.common.currency}` : (lang === 'ar' ? 'عند الطلب' : 'Upon Request')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* On-Site Booking Action */}
                  <div className="pt-2">
                    <button
                      onClick={() => onOpenBooking(room.room_type, selectedOccupancy === 'all' ? 'double' : selectedOccupancy)}
                      className="w-full flex items-center justify-center gap-2 bg-[#D94E28] hover:bg-[#C2411C] active:scale-[0.98] text-white font-['Cairo'] font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all duration-200"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{t.pricing.bookNowCheckDates}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
