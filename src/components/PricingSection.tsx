import React, { useState } from 'react';
import { RoomPricing, Language, OccupancyType } from '../types';
import { translations, translateRoomType } from '../lib/translations';
import { Check, Info, Calendar, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

interface PricingSectionProps {
  rooms: RoomPricing[];
  lang: Language;
  pricingNote?: string;
  onOpenBooking: (roomType: string, occupancy: OccupancyType) => void;
}

interface RoomImageSliderProps {
  images: string[];
  title: string;
  badge: string;
}

const RoomImageSlider: React.FC<RoomImageSliderProps> = ({ images, title, badge }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const validImages = images && images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
  ];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const handleSelect = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  return (
    <div className="flex flex-col">
      {/* Main Image Stage */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#0F223D] group">
        <img
          src={validImages[currentIndex]}
          alt={`${title} - ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none"></div>

        {/* Room Category Badge */}
        <span className="absolute top-3 end-3 bg-[#0F223D]/90 backdrop-blur-md text-white text-xs font-['Cairo'] font-bold px-3 py-1 rounded-full border border-white/20 z-10 shadow-xs">
          {badge}
        </span>

        {/* Image Counter Badge (like Booking.com) */}
        {validImages.length > 1 && (
          <span className="absolute top-3 start-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border border-white/20 z-10 shadow-xs flex items-center gap-1">
            <Camera className="w-3 h-3" />
            <span>{currentIndex + 1} / {validImages.length}</span>
          </span>
        )}

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Image"
              className="absolute top-1/2 start-2.5 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-85 group-hover:opacity-100 hover:scale-105 active:scale-95 backdrop-blur-xs z-20 border border-white/25 shadow-md"
            >
              <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Image"
              className="absolute top-1/2 end-2.5 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-85 group-hover:opacity-100 hover:scale-105 active:scale-95 backdrop-blur-xs z-20 border border-white/25 shadow-md"
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </button>

            {/* Slider Dots */}
            <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-20 pointer-events-auto">
              {validImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => handleSelect(e, idx)}
                  aria-label={`Image ${idx + 1}`}
                  className={`transition-all rounded-full ${
                    idx === currentIndex
                      ? 'w-5 h-1.5 bg-[#D94E28] shadow-sm'
                      : 'w-1.5 h-1.5 bg-white/70 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Room Title on Image Bottom */}
        <div className="absolute bottom-6 start-4 end-4 pointer-events-none z-10">
          <h3 className="font-['Cairo'] font-black text-lg sm:text-xl text-white drop-shadow-md">
            {title}
          </h3>
        </div>
      </div>

      {/* Mini Thumbnails Strip (if multiple photos) */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-1.5 px-3 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] overflow-x-auto no-scrollbar">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => handleSelect(e, idx)}
              className={`relative flex-shrink-0 w-12 h-9 rounded-lg overflow-hidden border transition-all ${
                idx === currentIndex
                  ? 'border-[#D94E28] ring-2 ring-[#D94E28]/30 scale-105'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=70';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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
        defaultImages: [
          'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
        ],
        badge: t.pricing.deluxeBadge,
        features: t.pricing.deluxeFeatures,
        idealFor: t.pricing.deluxeIdealFor,
      };
    } else if (lower.includes('مميز') || lower.includes('special')) {
      return {
        defaultImages: [
          'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        ],
        badge: t.pricing.specialBadge,
        features: t.pricing.specialFeatures,
        idealFor: t.pricing.specialIdealFor,
      };
    } else {
      return {
        defaultImages: [
          'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
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
            <span>{lang === 'ar' ? (pricingNote || t.pricing.note) : t.pricing.note}</span>
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
            {t.pricing.allOccupancies}
          </button>
          <button
            onClick={() => setSelectedOccupancy('single')}
            className={`px-3.5 py-2 rounded-xl font-['Cairo'] text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              selectedOccupancy === 'single'
                ? 'bg-[#0F223D] text-white shadow-sm'
                : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
            }`}
          >
            {t.pricing.singleWithCount}
          </button>
          <button
            onClick={() => setSelectedOccupancy('double')}
            className={`px-3.5 py-2 rounded-xl font-['Cairo'] text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              selectedOccupancy === 'double'
                ? 'bg-[#0F223D] text-white shadow-sm'
                : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
            }`}
          >
            {t.pricing.doubleWithCount}
          </button>
          <button
            onClick={() => setSelectedOccupancy('triple')}
            className={`px-3.5 py-2 rounded-xl font-['Cairo'] text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              selectedOccupancy === 'triple'
                ? 'bg-[#0F223D] text-white shadow-sm'
                : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
            }`}
          >
            {t.pricing.tripleWithCount}
          </button>
          <button
            onClick={() => setSelectedOccupancy('quadruple')}
            className={`px-3.5 py-2 rounded-xl font-['Cairo'] text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              selectedOccupancy === 'quadruple'
                ? 'bg-[#0F223D] text-white shadow-sm'
                : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
            }`}
          >
            {t.pricing.quadrupleWithCount}
          </button>
        </div>

        {/* Room Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {rooms.map((room, index) => {
            const meta = getRoomMeta(room.room_type);
            const isDeluxe = room.room_type.includes('ديلوكس') || room.room_type.includes('Deluxe');
            const translatedTitle = translateRoomType(room.room_type, lang);

            // Determine room images: prioritize room.images array, then room.image_url, then defaultImages
            const roomImages: string[] =
              room.images && room.images.length > 0
                ? room.images
                : room.image_url
                ? [room.image_url, ...meta.defaultImages.slice(1)]
                : meta.defaultImages;

            return (
              <div
                key={room.id || index}
                className={`relative flex flex-col rounded-3xl bg-white border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
                  isDeluxe ? 'border-[#0F223D]/30 ring-1 ring-[#0F223D]/10' : 'border-[#E2E8F0]'
                }`}
              >
                {/* Room Image Gallery / Slider */}
                <RoomImageSlider
                  images={roomImages}
                  title={translatedTitle}
                  badge={meta.badge}
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
                            {room.single_price ? `${room.single_price} ${t.common.currency}` : '—'}
                          </div>
                        </div>
                      )}

                      {/* Double */}
                      {(selectedOccupancy === 'all' || selectedOccupancy === 'double') && (
                        <div className={`p-2.5 rounded-xl border text-center transition-colors ${
                          selectedOccupancy === 'double' ? 'bg-[#FFF7ED] border-[#FDBA74]' : 'bg-[#FAF8F5] border-[#E2E8F0]'
                        }`}>
                          <div className="text-[11px] text-[#64748B] font-['Tajawal']">{t.pricing.doubleWithCount}</div>
                          <div className="font-['Cairo'] font-extrabold text-sm sm:text-base text-[#D94E28]">
                            {room.double_price ? `${room.double_price} ${t.common.currency}` : '—'}
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
                            {room.triple_price ? `${room.triple_price} ${t.common.currency}` : '—'}
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
                            {room.quadruple_price ? `${room.quadruple_price} ${t.common.currency}` : '—'}
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
                    <span>{t.pricing.bookNowCheckDates}</span>
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
