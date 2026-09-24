import React from 'react';
import { Language } from '../types';
import { translations } from '../lib/translations';
import { Sunrise, Waves, Flame, HeartHandshake } from 'lucide-react';

interface AboutSectionProps {
  lang: Language;
  aboutText?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang, aboutText }) => {
  const t = translations[lang];

  const pillars = [
    {
      icon: Waves,
      title: t.about.pillar1Title,
      desc: t.about.pillar1Desc,
    },
    {
      icon: Sunrise,
      title: t.about.pillar2Title,
      desc: t.about.pillar2Desc,
    },
    {
      icon: Flame,
      title: t.about.pillar3Title,
      desc: t.about.pillar3Desc,
    },
    {
      icon: HeartHandshake,
      title: t.about.pillar4Title,
      desc: t.about.pillar4Desc,
    },
  ];

  return (
    <section id="about" className="py-14 sm:py-20 bg-[#FAF8F5] border-t border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Text Content */}
          <div>
            <span className="inline-block text-[#D94E28] font-['Cairo'] font-bold text-xs sm:text-sm tracking-wider uppercase bg-[#FFF1ED] border border-[#FFDDD3] px-3.5 py-1 rounded-full mb-2.5">
              {t.about.badge}
            </span>
            <h2 className="font-['Cairo'] font-black text-2xl sm:text-3xl md:text-4xl text-[#0F223D] tracking-tight mb-4">
              {t.about.title}
            </h2>
            <div className="font-['Tajawal'] text-base sm:text-lg text-[#334155] leading-relaxed space-y-4">
              <p>
                {lang === 'en'
                  ? aboutText && !/[\u0600-\u06ff]/.test(aboutText)
                    ? aboutText
                    : t.about.defaultP1
                  : aboutText || t.about.defaultP1}
              </p>
              <p>
                {t.about.defaultP2}
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-[#0F223D] text-[#D94E28] flex items-center justify-center mb-2.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-['Cairo'] font-bold text-sm sm:text-base text-[#0F223D] mb-1">
                      {p.title}
                    </h3>
                    <p className="font-['Tajawal'] text-xs text-[#64748B] leading-normal">
                      {p.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Showcase (Mosaic of Ras Shitan imagery) */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <div className="h-44 sm:h-56 rounded-3xl overflow-hidden shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=700&q=80"
                    alt="Sinai Red Sea Sunrise"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="h-56 sm:h-72 rounded-3xl overflow-hidden shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80"
                    alt="Ras Shitan Beachfront"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8">
                <div className="h-56 sm:h-72 rounded-3xl overflow-hidden shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=700&q=80"
                    alt="Sinai Beach Huts"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="h-44 sm:h-56 rounded-3xl overflow-hidden shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1519046904884-53103b34b271?auto=format&fit=crop&w=700&q=80"
                    alt="Mountains meet the sea"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Floating Brand Stamp with real emblem */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0F223D] text-white p-4 sm:p-5 rounded-3xl shadow-2xl border-4 border-[#FAF8F5] text-center pointer-events-none transform -rotate-3 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-white p-1 mb-1.5 shadow-sm">
                <img src="/logo-emblem.svg" alt="Jazz Camp" className="w-full h-full object-contain" />
              </div>
              <span className="font-['Cairo'] font-black text-xs tracking-wider uppercase text-white block">
                {lang === 'ar' ? 'جاز كامب' : 'Jazz Camp'}
              </span>
              <span className="font-['Tajawal'] text-[10px] text-[#94A3B8] block">
                {lang === 'ar' ? 'رأس شيطان • نويبع' : 'Ras Shitan • Nuweiba'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

