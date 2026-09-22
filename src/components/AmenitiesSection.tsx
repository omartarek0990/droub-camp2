import React from 'react';
import { Utensils, Coffee, Waves, Eye, Gamepad2, Wifi, Bus, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../lib/translations';

interface AmenitiesSectionProps {
  lang: Language;
}

export const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({ lang }) => {
  const t = translations[lang];

  const amenities = [
    {
      icon: Utensils,
      title: t.amenity1Title,
      description: t.amenity1Desc,
      tag: lang === 'ar' ? 'مشمول بالإقامة' : 'Included in Stay',
      highlight: true,
    },
    {
      icon: Coffee,
      title: t.amenity2Title,
      description: t.amenity2Desc,
      tag: lang === 'ar' ? 'طوال اليوم' : 'All-Day Dining',
      highlight: false,
    },
    {
      icon: Waves,
      title: t.amenity3Title,
      description: t.amenity3Desc,
      tag: lang === 'ar' ? 'مباشرة على البحر' : 'Beachfront',
      highlight: true,
    },
    {
      icon: Eye,
      title: t.amenity4Title,
      description: t.amenity4Desc,
      tag: lang === 'ar' ? 'مجاناً للنزلاء' : 'Complimentary',
      highlight: false,
    },
    {
      icon: Gamepad2,
      title: t.amenity5Title,
      description: t.amenity5Desc,
      tag: lang === 'ar' ? 'أنشطة شاطئية' : 'Beach Activities',
      highlight: false,
    },
    {
      icon: Wifi,
      title: t.amenity6Title,
      description: t.amenity6Desc,
      tag: lang === 'ar' ? 'إنترنت مجاني' : 'Free Internet',
      highlight: false,
    },
    {
      icon: Bus,
      title: t.amenity7Title,
      description: t.amenity7Desc,
      tag: lang === 'ar' ? 'انتقالات خاصة' : 'Transfers Available',
      highlight: true,
    },
  ];

  return (
    <section id="amenities" className="py-14 sm:py-20 bg-[#F4EFEA] border-t border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="inline-block text-[#D94E28] font-['Cairo'] font-bold text-xs sm:text-sm tracking-wider uppercase bg-[#FFF1ED] border border-[#FFDDD3] px-3.5 py-1 rounded-full mb-2.5">
            {lang === 'ar' ? 'خدمات ومرافق الكامب' : 'Hospitality & Inclusions'}
          </span>
          <h2 className="font-['Cairo'] font-black text-2xl sm:text-3xl md:text-4xl text-[#0F223D] tracking-tight mb-3">
            {t.amenitiesTitle}
          </h2>
          <p className="font-['Tajawal'] text-base sm:text-lg text-[#475569] leading-relaxed">
            {t.amenitiesSubtitle}
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {amenities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`relative p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border transition-all duration-300 hover:shadow-md flex flex-col justify-between ${
                  item.highlight
                    ? 'border-[#0F223D]/25 ring-1 ring-[#0F223D]/10 bg-gradient-to-b from-white to-[#F8FAFC]'
                    : 'border-[#E2E8F0]'
                }`}
              >
                <div>
                  {/* Top Bar with Icon and Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#0F223D] text-white flex items-center justify-center shadow-sm">
                      <Icon className="w-6 h-6 text-[#D94E28]" />
                    </div>
                    <span className="text-[11px] font-['Cairo'] font-bold px-2.5 py-1 rounded-full bg-[#FAF8F5] text-[#0F223D] border border-[#E2E8F0]">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-['Cairo'] font-bold text-base sm:text-lg text-[#0F223D] mb-2 leading-snug">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="font-['Tajawal'] text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Subtle reassurance icon */}
                <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center gap-1.5 text-[11px] font-['Cairo'] text-[#64748B]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" />
                  <span>{lang === 'ar' ? 'متاح ومضمون لجميع النزلاء' : 'Available for all guests'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transportation Governorates Callout Banner */}
        <div className="mt-10 sm:mt-12 bg-white rounded-3xl p-5 sm:p-7 border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0F223D] text-[#D94E28] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bus className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-['Cairo'] font-bold text-base sm:text-lg text-[#0F223D]">
                {lang === 'ar' ? 'خدمة الانتقالات المباشرة للكامب' : 'Direct Transportation to Droub Camp'}
              </h4>
              <p className="font-['Tajawal'] text-xs sm:text-sm text-[#64748B] mt-0.5">
                {lang === 'ar'
                  ? 'نوفر رحلات وباصات مكيفة خاصة من وإلى: القاهرة • الإسكندرية • المحلة الكبرى • المنصورة • طنطا • كفر الشيخ (برسوم إضافية مخفضة لنزلائنا).'
                  : 'Door-to-door shuttle buses available from: Cairo • Alexandria • El Mahalla • Mansoura • Tanta • Kafr El Sheikh (at discounted rates).'}
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/201061189414?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D9%85%D9%88%D8%A7%D8%B9%D9%8A%D8%AF%20%D9%88%D8%A3%D8%B3%D8%B9%D8%A7%D8%B1%20%D8%A7%D9%86%D8%AA%D9%82%D8%A7%D9%84%D8%A7%D8%AA%20%D8%AF%D8%B1%D9%88%D8%A8%20%D9%83%D8%A7%D9%85%D8%A8"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto text-center px-6 py-3.5 rounded-xl bg-[#0F223D] hover:bg-[#1E3A5F] active:scale-95 text-white font-['Cairo'] font-bold text-xs sm:text-sm transition-all whitespace-nowrap shadow-sm"
          >
            {lang === 'ar' ? 'استفسر عن مواعيد الانتقالات' : 'Ask about Transfers'}
          </a>
        </div>
      </div>
    </section>
  );
};
