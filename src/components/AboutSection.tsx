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
      title: lang === 'ar' ? 'مباشرة على البحر' : 'Right on the Beach',
      desc:
        lang === 'ar'
          ? 'شاطئ بكر يجمع بين صخور الشعاب المرجانية للسنوركلينج وبقعة رملية ناعمة للسباحة والاستجمام.'
          : 'Untouched shoreline with a marine-rich rocky reef for snorkeling and a sandy patch for swimming.',
    },
    {
      icon: Sunrise,
      title: lang === 'ar' ? 'هدوء وسكينة مطلقة' : 'True Peace & Silence',
      desc:
        lang === 'ar'
          ? 'بعيداً عن صخب المدن والمنتجعات الصاخبة، حيث لا تسمع سوى صوت تلاطم الأمواج ونسيم خليج العقبة.'
          : 'Far from commercial resorts and crowd noise, where only the waves and mountain breeze are heard.',
    },
    {
      icon: Flame,
      title: lang === 'ar' ? 'جلسات سمر أصيلة' : 'Campfire Traditions',
      desc:
        lang === 'ar'
          ? 'أمسيات هادئة حول النار مع الشاي بالحبق الجبلي، وتبادل الحكايات تحت سماء مرصعة بنجوم جنوب سيناء.'
          : 'Evenings around the campfire sipping wild Sinai herbal tea under some of the clearest skies on Earth.',
    },
    {
      icon: HeartHandshake,
      title: lang === 'ar' ? 'ضيافة سيناوية حقيقية' : 'Sinai Warmth',
      desc:
        lang === 'ar'
          ? 'فريق عمل ودود ومرحب يعاملك كفرد من العائلة، حريص على راحتك وتلبية كل ما تحتاجه لإجازة لا تُنسى.'
          : 'A warm, welcoming family environment dedicated to making your Sinai escape restorative and unforgettable.',
    },
  ];

  return (
    <section id="about" className="py-14 sm:py-20 bg-[#FAF8F5] border-t border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Text Content */}
          <div>
            <span className="inline-block text-[#D94E28] font-['Cairo'] font-bold text-xs sm:text-sm tracking-wider uppercase bg-[#FFF1ED] border border-[#FFDDD3] px-3.5 py-1 rounded-full mb-2.5">
              {lang === 'ar' ? 'قصتنا وفلسفتنا' : 'Our Story & Philosophy'}
            </span>
            <h2 className="font-['Cairo'] font-black text-2xl sm:text-3xl md:text-4xl text-[#0F223D] tracking-tight mb-4">
              {lang === 'ar' ? 'دروب كامب — ملاذك البسيط في قلب رأس شيطان' : 'Droub Camp — Your Sinai Beach Haven'}
            </h2>
            <div className="font-['Tajawal'] text-base sm:text-lg text-[#334155] leading-relaxed space-y-4">
              <p>
                {aboutText ||
                  (lang === 'ar'
                    ? 'يقع «دروب كامب» مباشرة على شاطئ رأس شيطان الشهير بنويبع، جنوب سيناء، في البقعة الساحرة التي تحتضن فيها الجبال الشاهقة مياه البحر الأحمر الصافية. صُمم الكامب ليكون ملاذاً حقيقياً من صخب الحياة السريعة، حيث نؤمن بأن الفخامة الحقيقية تكمن في البساطة والنقاء.'
                    : 'Droub Camp is nestled directly on the renowned Ras Shitan beach in Nuweiba, South Sinai, where rugged red mountains plunge straight into the turquoise Gulf of Aqaba. Designed as a sanctuary from modern city rush, we believe true luxury lies in simplicity, purity, and nature.')}
              </p>
              <p>
                {lang === 'ar'
                  ? 'سواء كنت تبحث عن استكشاف الشعاب المرجانية العذراء عبر السنوركلينج من الشاطئ الصخري، أو الاسترخاء على الرمال، أو الانطلاق في مغامرات الهايكنج في الوديان الساحرة كوادي الوشواش والكانيون الملون، فإن دروب كامب يقدم لك البيئة المثالية لتجديد طاقتك.'
                  : 'Whether you wish to snorkel pristine house reefs straight from our rocky shoreline, unwind on the sand, or hike hidden canyons like Wadi El Washwash and the Colored Canyon, Droub Camp offers the ultimate atmosphere to reconnect.'}
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
                <img src="/logo-emblem.svg" alt="Droub Camp" className="w-full h-full object-contain" />
              </div>
              <span className="font-['Cairo'] font-black text-xs tracking-wider uppercase text-white block">
                دروب كامب
              </span>
              <span className="font-['Tajawal'] text-[10px] text-[#94A3B8] block">
                رأس شيطان • نويبع
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
