import React, { useState } from 'react';
import { GalleryItem, Language } from '../types';
import { translations } from '../lib/translations';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface GallerySectionProps {
  gallery: GalleryItem[];
  lang: Language;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery, lang }) => {
  const t = translations[lang];
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
    document.body.style.overflow = '';
  };

  const nextImage = () => {
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex + 1) % gallery.length);
    }
  };

  const prevImage = () => {
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex - 1 + gallery.length) % gallery.length);
    }
  };

  return (
    <section id="gallery" className="py-14 sm:py-20 bg-[#F4EFEA] border-t border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="inline-block text-[#D94E28] font-['Cairo'] font-bold text-xs sm:text-sm tracking-wider uppercase bg-[#FFF1ED] border border-[#FFDDD3] px-3.5 py-1 rounded-full mb-2.5">
            {t.gallery.badge}
          </span>
          <h2 className="font-['Cairo'] font-black text-2xl sm:text-3xl md:text-4xl text-[#0F223D] tracking-tight mb-3">
            {t.gallery.title}
          </h2>
          <p className="font-['Tajawal'] text-base sm:text-lg text-[#475569] leading-relaxed">
            {t.gallery.subtitle}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {gallery.map((item, index) => (
            <div
              key={item.id || index}
              onClick={() => openLightbox(index)}
              className="group relative h-44 sm:h-64 md:h-72 rounded-2xl sm:rounded-3xl overflow-hidden bg-[#E2E8F0] cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <img
                src={item.image_url}
                alt={item.caption || `Droub Camp photo ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 sm:p-4 text-white">
                {item.caption && (
                  <p className="font-['Tajawal'] text-xs sm:text-sm font-medium line-clamp-2 drop-shadow">
                    {item.caption}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-1 text-[11px] text-[#38BDF8] font-['Cairo']">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{t.gallery.zoom}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      {activeImageIndex !== null && gallery[activeImageIndex] && (
        <div
          className="fixed inset-0 z-50 bg-[#0F223D]/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 end-4 z-50 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Prev / Next */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute start-4 z-50 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute end-4 z-50 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none"
                aria-label="Next image"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          {/* Image & Caption Container */}
          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={gallery[activeImageIndex].image_url}
              alt={gallery[activeImageIndex].caption || 'Droub Camp photo'}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            />
            {gallery[activeImageIndex].caption && (
              <p className="mt-4 text-center font-['Tajawal'] text-white/90 text-sm sm:text-base max-w-xl bg-black/40 px-4 py-2 rounded-xl backdrop-blur-md">
                {gallery[activeImageIndex].caption}
              </p>
            )}
            <span className="mt-2 text-xs font-['Cairo'] text-white/60">
              {activeImageIndex + 1} / {gallery.length}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};
