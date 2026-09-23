import arData from '../i18n/ar.json';
import enData from '../i18n/en.json';
import { Language } from '../types';

export type TranslationSchema = typeof arData;

export const translations: Record<Language, TranslationSchema> = {
  ar: arData,
  en: enData,
};

export function getTranslations(lang: Language): TranslationSchema {
  return translations[lang] || translations.en;
}

/**
 * Clean & Translate Room Type
 * Guarantees zero linguistic mixing and strips any residual parentheses.
 */
export function translateRoomType(name: string, lang: Language): string {
  if (!name) return '';
  const lower = name.toLowerCase();

  if (lower.includes('ديلوكس') || lower.includes('deluxe') || lower.includes('seaview')) {
    return lang === 'ar' ? 'غرف ديلوكس مطلة على البحر' : 'Deluxe Sea View Rooms';
  }
  if (lower.includes('مميز') || lower.includes('special') || lower.includes('beachfront')) {
    return lang === 'ar' ? 'أكواخ مميزة على الشاطئ' : 'Special Beachfront Huts';
  }
  if (lower.includes('عادي') || lower.includes('تقليد') || lower.includes('normal') || lower.includes('classic')) {
    return lang === 'ar' ? 'أكواخ عادية تقليدية' : 'Classic Sinai Huts';
  }

  if (lang === 'ar') {
    return name.replace(/\s*\([A-Za-z0-9\s&—'-]+\)/g, '').trim();
  }
  return name.replace(/\s*\([\u0600-\u06FF\s]+\)/g, '').trim();
}

/**
 * Category translation helper (e.g. Full Board, Romantic, Adventure)
 */
export function translateCategory(category: string | undefined, lang: Language): string {
  if (!category) return '';
  const lower = category.toLowerCase();

  if (lower.includes('مغامرة') || lower.includes('adventure')) {
    return lang === 'ar' ? 'مغامرة' : 'Adventure';
  }
  if (lower.includes('رومانسي') || lower.includes('romantic')) {
    return lang === 'ar' ? 'رومانسي' : 'Romantic';
  }
  if (lower.includes('كامل') || lower.includes('full')) {
    return lang === 'ar' ? 'إقامة كاملة' : 'Full Board';
  }
  if (lower.includes('قصير') || lower.includes('short')) {
    return lang === 'ar' ? 'إجازة قصيرة' : 'Short Break';
  }
  if (lower.includes('ممتد') || lower.includes('extended')) {
    return lang === 'ar' ? 'إقامة ممتدة' : 'Extended Stay';
  }
  if (lower.includes('هدوء') || lower.includes('serenity')) {
    return lang === 'ar' ? 'المغامرة والهدوء' : 'Adventure & Serenity';
  }

  return category;
}

/**
 * Clean & Format Package Price per language
 * Zero mixing of "ج.م" in English or "EGP" in Arabic.
 */
export function formatPackagePrice(rawPrice: string | number | undefined, lang: Language): string {
  if (rawPrice === undefined || rawPrice === null || rawPrice === '') return '';
  const str = String(rawPrice);
  const numMatch = str.match(/[\d,.]+/);
  const num = numMatch ? numMatch[0] : str;

  const isRoom = str.includes('غرفة') || str.includes('room');
  const isPerson = str.includes('فرد') || str.includes('person') || !isRoom;

  if (lang === 'ar') {
    if (isRoom) return `${num} ج.م للغرفة`;
    if (isPerson) return `${num} ج.م للفرد`;
    return `${num} ج.م`;
  } else {
    if (isRoom) return `${num} EGP per room`;
    if (isPerson) return `${num} EGP per person`;
    return `${num} EGP`;
  }
}

export interface TranslatedPackage {
  title: string;
  description: string;
  category?: string;
  priceDisplay: string;
}

/**
 * Translate Package Item with complete isolation
 */
export function translatePackage(
  item: { title: string; description: string; category?: string; price?: string | number },
  lang: Language
): TranslatedPackage {
  const lower = (item.title || '').toLowerCase();
  const cat = translateCategory(item.category, lang);
  const priceDisplay = formatPackagePrice(item.price, lang);

  // 1. Escape Package
  if (lower.includes('هروب') || lower.includes('escape')) {
    return {
      title:
        lang === 'ar'
          ? 'باقة الهروب إلى سيناء (3 ليالٍ / 4 أيام)'
          : 'Sinai Escape Package (3 Nights / 4 Days)',
      description:
        lang === 'ar'
          ? 'إقامة هادئة شاملة الإفطار والعشاء، مع جلسة سمر بدوية مسائية، ومعدات سنوركلينج طوال فترة الإقامة للاستمتاع بشعاب رأس شيطان.'
          : 'Tranquil beachfront stay with half board (breakfast & dinner), evening campfire with Sinai tea, and free snorkeling gear to explore Ras Shitan reefs.',
      category: cat || (lang === 'ar' ? 'إقامة كاملة' : 'Full Board'),
      priceDisplay: priceDisplay || (lang === 'ar' ? '3,800 ج.م للفرد' : '3,800 EGP per person'),
    };
  }

  // 2. Romantic Package
  if (lower.includes('عشاق') || lower.includes('romantic') || lower.includes('استرخاء')) {
    return {
      title:
        lang === 'ar'
          ? 'باقة العشاق والاسترخاء - كوخ على البحر'
          : 'Romantic Seaside Retreat — Beachfront Hut',
      description:
        lang === 'ar'
          ? 'كوخ مميز مواجه لأمواج البحر الأحمر مباشرة، عشاء رومانسي على ضوء الشموع، جلسة شاي جبلي، وإفطار بلدي على الشاطئ.'
          : 'Direct waterfront hut right on the Red Sea shoreline, romantic candlelit dinner, mountain herbal tea session, and beachside breakfast.',
      category: cat || (lang === 'ar' ? 'رومانسي' : 'Romantic'),
      priceDisplay: priceDisplay || (lang === 'ar' ? '4,500 ج.م للغرفة' : '4,500 EGP per room'),
    };
  }

  // 3. Adventure & Canyons Package
  if (lower.includes('مغامرة') || lower.includes('adventure') || lower.includes('وديان')) {
    return {
      title:
        lang === 'ar'
          ? 'باقة المغامرة والوديان - 4 ليالٍ'
          : 'Adventure & Canyons Package — 4 Nights',
      description:
        lang === 'ar'
          ? 'تشمل الإقامة بنصف إقامة بالإضافة إلى رحلة هايكنج خاصة لوادي الوشواش مع مرشد بدوي محلي، وركوب كاياك في مياه خليج العقبة.'
          : 'Half-board accommodation with a private guided trek to Wadi El Washwash with a local Bedouin guide, plus complimentary sea kayaking.',
      category: cat || (lang === 'ar' ? 'مغامرة' : 'Adventure'),
      priceDisplay: priceDisplay || (lang === 'ar' ? '5,200 ج.م للفرد' : '5,200 EGP per person'),
    };
  }

  // 4. Full Week Package
  if (lower.includes('أسبوع') || lower.includes('week') || lower.includes('7 أيام')) {
    return {
      title:
        lang === 'ar'
          ? 'باقة الأسبوع الكامل — عيش روح رأس شيطان (7 أيام / 6 ليالٍ)'
          : 'Full Week Retreat — Soul of Ras Shitan (7 Days / 6 Nights)',
      description:
        lang === 'ar'
          ? 'أسبوع كامل من السلام المطلق في كوخ أو غرفة من اختيارك، نصف إقامة، رحلتين خارجيتين، تجديف كاياك مجاني، وخصم 15% على المشروبات.'
          : 'A full week of complete tranquility in your hut or room, half board, two guided day-trips, complimentary kayaking, and 15% off cafe items.',
      category: cat || (lang === 'ar' ? 'إقامة ممتدة' : 'Extended Stay'),
      priceDisplay: priceDisplay || (lang === 'ar' ? '8,900 ج.م للفرد' : '8,900 EGP per person'),
    };
  }

  // Fallback
  return {
    title: lang === 'ar' ? item.title.replace(/\s*\([A-Za-z0-9\s&—'-]+\)/g, '').trim() : item.title,
    description: item.description,
    category: cat,
    priceDisplay: priceDisplay,
  };
}

export interface TranslatedTrip {
  title: string;
  description: string;
}

/**
 * Translate Outdoor Trips with complete isolation
 */
export function translateTrip(item: { title: string; description: string }, lang: Language): TranslatedTrip {
  const lower = (item.title || '').toLowerCase();

  // 1. Wadi El Washwash
  if (lower.includes('وشواش') || lower.includes('washwash')) {
    return {
      title:
        lang === 'ar'
          ? 'رحلة وادي الوشواش والبحيرة العذبة'
          : 'Wadi El Washwash Hiking & Natural Pool',
      description:
        lang === 'ar'
          ? 'واحدة من أندر الظواهر الطبيعية في نويبع وجنوب سيناء. هايكنج بين الجبال الجرانيتية الوردية وصولاً إلى بحيرة مياه عذبة نقية محاطة بالجبال للسباحة والقفز الطبيعي.'
          : 'A breathtaking mountain hike through granite cliffs leading to an emerald natural freshwater pool for swimming and cliff jumps.',
    };
  }

  // 2. Colored & White Canyon
  if (lower.includes('كانيون') || lower.includes('canyon')) {
    return {
      title:
        lang === 'ar'
          ? 'رحلة الكانيون الملون والكانيون الأبيض'
          : 'Colored Canyon & White Canyon Expedition',
      description:
        lang === 'ar'
          ? 'مغامرة استثنائية سيراً على الأقدام بين التكوينات الصخرية الملونة بدرجات المغرة والأحمر والأبيض التي نحتتها الرياح والسيول عبر ملايين السنين مع مرشد بدوي.'
          : 'Explore vibrant swirling sandstone rock formations carved over millions of years with an expert local Bedouin guide.',
    };
  }

  // 3. Taba & Saladin Castle
  if (
    lower.includes('طابا') ||
    lower.includes('taba') ||
    lower.includes('صلاح الدين') ||
    lower.includes('castle') ||
    lower.includes('citadel')
  ) {
    return {
      title:
        lang === 'ar'
          ? 'رحلة طابا وقلعة صلاح الدين'
          : 'Taba, Pharaoh’s Island & Saladin Citadel',
      description:
        lang === 'ar'
          ? 'جولة ساحلية خلابة إلى جزيرة فرعون وزيارة قلعة صلاح الدين التاريخية التي تشرف على مياه أربع دول، مع وقفة في خليج فيورد الأخاذ.'
          : 'A scenic maritime and historical tour to Salah El-Din fortress on Pharaoh’s Island with panoramic views across 4 countries.',
    };
  }

  // 4. Dahab & Mountain Safari
  if (
    lower.includes('دهب') ||
    lower.includes('dahab') ||
    lower.includes('طويلات') ||
    lower.includes('بلوهول') ||
    lower.includes('blue hole')
  ) {
    return {
      title:
        lang === 'ar'
          ? 'رحلة دهب وسفاري الجبال'
          : 'Dahab, Blue Hole & Twilat Mountain Safari',
      description:
        lang === 'ar'
          ? 'يوم كامل لاكتشاف مدينة دهب الساحرة، وزيارة البلوهول الشهير سنوركلينج وغوص، ثم التوجه إلى سفاري جبل الطويلات لجلسة شاي وعشاء بدوي تحت النجوم.'
          : 'A full day starting with world-renowned snorkeling at the Blue Hole, shopping along Dahab promenade, and a Bedouin night at Mount Twilat.',
    };
  }

  // 5. St. Catherine
  if (lower.includes('كاترين') || lower.includes('catherine') || lower.includes('موسى')) {
    return {
      title:
        lang === 'ar'
          ? 'رحلة سانت كاترين وصعود جبل موسى'
          : 'St. Catherine & Mount Sinai Sunrise Trek',
      description:
        lang === 'ar'
          ? 'صعود جبل موسى ليلاً لمشاهدة واحدة من أجمل لحظات شروق الشمس على وجه الأرض، يعقبها زيارة دير سانت كاترين التاريخي.'
          : 'Ascend Mount Sinai under starry skies to witness an unforgettable sunrise above the clouds, followed by a visit to St. Catherine Monastery.',
    };
  }

  // 6. Boat Snorkeling
  if (lower.includes('قارب') || lower.includes('boat') || lower.includes('شعاب')) {
    return {
      title:
        lang === 'ar'
          ? 'سنوركلينج قارب في رأس شيطان والشعاب الحرة'
          : 'Boat Snorkeling & Outer Reefs in Ras Shitan',
      description:
        lang === 'ar'
          ? 'رحلة بحرية بالمركب لزيارة الشعاب المرجانية العميقة والمواقع البكر غير المزدحمة مع كامل معدات السنوركلينج والسلامة.'
          : 'Boat excursion to deep pristine reefs and coral gardens of the Gulf of Aqaba, complete with safety gear and snorkeling kits.',
    };
  }

  // Fallback: strip any bracketed foreign languages
  if (lang === 'ar') {
    return {
      title: item.title.replace(/\s*\([A-Za-z0-9\s&—'-]+\)/g, '').trim(),
      description: item.description,
    };
  }
  return {
    title: item.title.replace(/\s*\([\u0600-\u06FF\s]+\)/g, '').trim(),
    description: item.description,
  };
}

/**
 * Translate Gallery Caption for Lightbox
 */
export function translateGalleryCaption(caption: string | undefined, lang: Language): string {
  if (!caption) return '';
  if (lang === 'ar') return caption;
  const lower = caption.toLowerCase();
  if (lower.includes('شروق') || lower.includes('sunrise')) {
    return 'Mesmerizing sunrise over the Red Sea right in front of Droub Camp';
  }
  if (lower.includes('سمر') || lower.includes('نار') || lower.includes('campfire')) {
    return 'Authentic Bedouin evening gatherings around the cozy campfire';
  }
  if (lower.includes('مرجان') || lower.includes('سنوركلينج') || lower.includes('بحر') || lower.includes('coral') || lower.includes('snorkel')) {
    return 'Crystal-clear turquoise waters and pristine coral reefs';
  }
  if (lower.includes('كوخ') || lower.includes('hut')) {
    return 'Comfortable seaside huts embraced by mountains and the sea';
  }
  if (lower.includes('أفق') || lower.includes('سكون') || lower.includes('horizon')) {
    return 'Gulf of Aqaba horizon and untouched Sinai mountain vistas';
  }
  if (lower.includes('برجول') || lower.includes('ظل') || lower.includes('استرخاء') || lower.includes('pergola') || lower.includes('relaxation')) {
    return 'Peaceful shaded relaxation under traditional Bedouin pergolas';
  }
  return caption;
}
