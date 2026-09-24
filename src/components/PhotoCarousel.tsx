import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface PhotoCarouselProps {
  photos: string[];
  alt: string;
  fallbackImage?: string;
  className?: string;
  badge?: React.ReactNode;
  overlayContent?: React.ReactNode;
  aspectRatioClass?: string;
}

export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({
  photos,
  alt,
  fallbackImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=75',
  className = '',
  badge,
  overlayContent,
  aspectRatioClass = 'h-52 sm:h-60',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Normalize valid photos array, filtering out empty strings
  const validPhotos = (photos && photos.length > 0)
    ? photos.filter(p => p && typeof p === 'string' && p.trim().length > 0)
    : [];

  const displayList = validPhotos.length > 0 ? validPhotos : [fallbackImage];
  const hasMultiple = displayList.length > 1;

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setCurrentIndex((prev) => (prev + 1) % displayList.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setCurrentIndex((prev) => (prev - 1 + displayList.length) % displayList.length);
  };

  const handleDotClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex(index);
  };

  // Mobile Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    // In LTR: left swipe = next, right swipe = prev
    // Direction will naturally feel intuitive
    const isRtl = document.documentElement.dir === 'rtl';
    if (isLeftSwipe) {
      if (isRtl) {
        handlePrev();
      } else {
        handleNext();
      }
    } else if (isRightSwipe) {
      if (isRtl) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentPhoto = displayList[currentIndex] || fallbackImage;

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#0F223D] group select-none ${aspectRatioClass} ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Current Active Image */}
      <img
        key={`${currentPhoto}-${currentIndex}`}
        src={currentPhoto}
        alt={`${alt} - photo ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300 group-hover:scale-105"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = fallbackImage;
        }}
      />

      {/* Gradient Vignette Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none"></div>

      {/* Top Badge (Deluxe, Included, Guide, etc.) */}
      {badge && (
        <div className="absolute top-3 end-3 z-10 pointer-events-auto">
          {badge}
        </div>
      )}

      {/* Multiple Photos Counter Badge (e.g. 1 / 4) */}
      {hasMultiple && (
        <div className="absolute top-3 start-3 z-10 pointer-events-none flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono font-medium border border-white/20">
          <ImageIcon className="w-3 h-3 text-[#38BDF8]" />
          <span>{currentIndex + 1}/{displayList.length}</span>
        </div>
      )}

      {/* Left/Right Arrow Navigation Buttons (Shown when > 1 photo) */}
      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous photo"
            className="absolute start-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-md focus:outline-none"
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next photo"
            className="absolute end-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-md focus:outline-none"
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 start-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-xs">
            {displayList.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={(e) => handleDotClick(dotIdx, e)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`transition-all rounded-full focus:outline-none ${
                  dotIdx === currentIndex
                    ? 'w-4 h-1.5 bg-white shadow-xs'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Bottom Overlay Content (e.g. Card Title) */}
      {overlayContent && (
        <div className={`absolute bottom-3 start-4 end-4 z-10 ${hasMultiple ? 'mb-4 sm:mb-3' : ''}`}>
          {overlayContent}
        </div>
      )}
    </div>
  );
};
