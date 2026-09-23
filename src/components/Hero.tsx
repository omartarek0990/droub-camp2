import React from 'react';
import { Calendar, Compass, MapPin, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../lib/translations';

interface HeroProps {
  lang: Language;
  onOpenBooking: () => void;
  siteInfo?: Record<string, string>;
}

export const Hero: React.FC<HeroProps> = ({ lang, onOpenBooking, siteInfo }) => {
  const t = translations[lang];

  const handleScrollToAccommodation = () => {
    const el = document.getElementById('accommodation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const dynamicTitle =
    lang === 'ar'
      ? siteInfo?.hero_title_ar || t.hero.defaultTitle
      : siteInfo?.hero_title_en || t.hero.defaultTitle;

  const dynamicSubtitle =
    lang === 'ar'
      ? siteInfo?.hero_subheadline_ar || t.hero.defaultSubtitle
      : siteInfo?.hero_subheadline_en || t.hero.defaultSubtitle;

  const dynamicHeroImg =
    siteInfo?.hero_image_url ||
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=75';

  const locationText =
    lang === 'ar'
      ? siteInfo?.location_name_ar || t.hero.brandEmblemBadge
      : siteInfo?.location_name_en || t.hero.brandEmblemBadge;

  return (
    <section
      id="home"
      className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0A1628]"
    >
      {/* Background Image with Cinematic Deep Navy Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={dynamicHeroImg}
          alt="Ras Shitan Nuweiba South Sinai Beach"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          loading="eager"
          decoding="async"
          // @ts-ignore
          fetchpriority="high"
          width="1400"
          height="900"
        />
        {/* Layered cinematic gradient in deep navy */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0F223D]/80 to-black/55 backdrop-blur-[0.5px]"></div>
        <div className="absolute inset-0 bg-[#0F223D]/30 mix-blend-multiply"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center text-white flex flex-col items-center">
        {/* Official Brand Badge */}
        <div
          id="hero-badge"
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FAF8F5] text-xs sm:text-sm font-semibold font-['Cairo'] mb-5 shadow-sm"
        >
          <img
            src="/logo-emblem.svg"
            alt="Emblem"
            className="w-5 h-5 object-contain rounded-full bg-white p-0.5"
            width="20"
            height="20"
          />
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#D94E28]" />
            <span>{locationText}</span>
          </span>
        </div>

        {/* Main Headline */}
        <h1
          id="hero-main-title"
          className="font-['Cairo'] font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight sm:leading-tight mb-4 drop-shadow-md"
        >
          {t.hero.titlePrefix} <span className="text-[#D94E28]">{t.hero.titleHighlighted}</span>
          <br />
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] block mt-2">
            {dynamicTitle}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          id="hero-subtitle"
          className="font-['Tajawal'] text-base sm:text-lg md:text-xl text-[#CBD5E1] max-w-2xl mx-auto font-normal leading-relaxed mb-8 sm:mb-10 drop-shadow"
        >
          {dynamicSubtitle}
        </p>

        {/* Primary CTA Buttons (Optimized for Mobile Thumb Taps) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 w-full sm:w-auto">
          {/* On-Site Booking Button */}
          <button
            id="hero-primary-cta"
            onClick={onOpenBooking}
            className="flex items-center justify-center gap-2.5 bg-[#D94E28] hover:bg-[#C2411C] active:scale-95 text-white font-['Cairo'] font-black text-base sm:text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-[#D94E28]/40 transition-all duration-200 border border-[#F97316]/30"
          >
            <Calendar className="w-5 h-5" />
            <span>{t.hero.bookNowCTA}</span>
          </button>

          {/* Secondary Explore Button */}
          <button
            id="hero-secondary-cta"
            onClick={handleScrollToAccommodation}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-['Cairo'] font-bold text-base sm:text-lg px-6 py-4 rounded-2xl backdrop-blur-md border border-white/25 transition-all duration-200"
          >
            <Compass className="w-5 h-5 text-[#38BDF8]" />
            <span>{t.hero.exploreCTA}</span>
          </button>
        </div>

        {/* Quick Highlights Strip under CTA */}
        <div className="mt-10 sm:mt-14 pt-6 border-t border-white/15 grid grid-cols-3 gap-2 sm:gap-6 text-center w-full max-w-2xl">
          <div className="flex flex-col items-center">
            <span className="font-['Cairo'] font-black text-lg sm:text-2xl text-[#38BDF8]">{t.hero.stat1Value}</span>
            <span className="font-['Tajawal'] text-xs sm:text-sm text-[#CBD5E1]">{t.hero.stat1Label}</span>
          </div>
          <div className="flex flex-col items-center border-x border-white/15">
            <span className="font-['Cairo'] font-black text-lg sm:text-2xl text-[#38BDF8]">{t.hero.stat2Value}</span>
            <span className="font-['Tajawal'] text-xs sm:text-sm text-[#CBD5E1]">{t.hero.stat2Label}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-['Cairo'] font-black text-lg sm:text-2xl text-[#38BDF8]">{t.hero.stat3Value}</span>
            <span className="font-['Tajawal'] text-xs sm:text-sm text-[#CBD5E1]">{t.hero.stat3Label}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
