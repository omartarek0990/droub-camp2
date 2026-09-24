import React from 'react';
import { PackageItem, Language, ItemPhoto } from '../types';
import { translations, translatePackage, translatePackagePrice } from '../lib/translations';
import { PhotoCarousel } from './PhotoCarousel';
import { Sparkles, Calendar, Tag } from 'lucide-react';

interface PackagesSectionProps {
  packages: PackageItem[];
  lang: Language;
  itemPhotos?: ItemPhoto[];
  onOpenBooking: (packageTitle: string) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  packages,
  lang,
  itemPhotos = [],
  onOpenBooking,
}) => {
  const t = translations[lang];

  const activePackages = packages.filter((p) => p.is_active !== false);

  if (activePackages.length === 0) {
    return null;
  }

  return (
    <section id="packages" className="py-14 sm:py-20 bg-[#FAF8F5] border-t border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="inline-block text-[#D94E28] font-['Cairo'] font-bold text-xs sm:text-sm tracking-wider uppercase bg-[#FFF1ED] border border-[#FFDDD3] px-3.5 py-1 rounded-full mb-2.5">
            {t.packages.badge}
          </span>
          <h2 className="font-['Cairo'] font-black text-2xl sm:text-3xl md:text-4xl text-[#0F223D] tracking-tight mb-3">
            {t.packages.title}
          </h2>
          <p className="font-['Tajawal'] text-base sm:text-lg text-[#475569] leading-relaxed">
            {t.packages.subtitle}
          </p>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {activePackages.map((pkg, index) => {
            const translated = translatePackage(pkg, lang);

            // Find all uploaded photos for this package
            const customPhotos = (itemPhotos || [])
              .filter(
                (p) =>
                  p.item_type === 'package' &&
                  (p.item_key === String(pkg.id) || p.item_key === pkg.title)
              )
              .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
              .map((p) => p.image_url);

            const fallbackImg =
              pkg.image_url ||
              'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80';
            const displayPhotos = customPhotos.length > 0 ? customPhotos : [fallbackImg];

            return (
              <div
                key={pkg.id || index}
                className="flex flex-col rounded-3xl bg-white border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                {/* Photo Carousel */}
                <PhotoCarousel
                  photos={displayPhotos}
                  alt={translated.title}
                  aspectRatioClass="h-52 sm:h-56"
                  fallbackImage={fallbackImg}
                  badge={
                    translated.category ? (
                      <span className="bg-[#D94E28] text-white text-xs font-['Cairo'] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{translated.category}</span>
                      </span>
                    ) : undefined
                  }
                  overlayContent={
                    <div className="inline-block bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/40 shadow-md">
                      <span className="text-[10px] text-[#64748B] font-['Cairo'] block leading-none">
                        {t.packages.priceLabel}
                      </span>
                      <span className="font-['Cairo'] font-extrabold text-sm sm:text-base text-[#D94E28]">
                        {translatePackagePrice(pkg.price, lang)}
                      </span>
                    </div>
                  }
                />

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-['Cairo'] font-bold text-lg sm:text-xl text-[#0F223D] mb-2.5 leading-snug">
                      {translated.title}
                    </h3>
                    <p className="font-['Tajawal'] text-xs sm:text-sm text-[#475569] leading-relaxed mb-6">
                      {translated.description}
                    </p>
                  </div>

                  {/* On-site booking request button */}
                  <button
                    onClick={() => onOpenBooking(translated.title)}
                    className="w-full flex items-center justify-center gap-2 bg-[#D94E28] hover:bg-[#C2411C] active:scale-[0.98] text-white font-['Cairo'] font-bold text-sm py-3.5 px-4 rounded-xl shadow-md transition-all duration-200"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{t.packages.requestBooking}</span>
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
