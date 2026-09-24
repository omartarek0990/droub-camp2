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

// Translation dictionaries for database items (Rooms, Packages, Trips, Gallery)
const ROOM_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  'غرف ديلوكس مطلة على البحر': {
    ar: 'غرف ديلوكس مطلة على البحر',
    en: 'Deluxe Sea View Rooms',
  },
  'غرف ديلوكس مطلة على البحر (Seaview Deluxe Rooms)': {
    ar: 'غرف ديلوكس مطلة على البحر',
    en: 'Deluxe Sea View Rooms',
  },
  'Deluxe Sea View Rooms': {
    ar: 'غرف ديلوكس مطلة على البحر',
    en: 'Deluxe Sea View Rooms',
  },
  'أكواخ مميزة على الشاطئ': {
    ar: 'أكواخ مميزة على الشاطئ',
    en: 'Special Beachfront Huts',
  },
  'أكواخ مميزة على الشاطئ (Special Huts)': {
    ar: 'أكواخ مميزة على الشاطئ',
    en: 'Special Beachfront Huts',
  },
  'Special Beachfront Huts': {
    ar: 'أكواخ مميزة على الشاطئ',
    en: 'Special Beachfront Huts',
  },
  'أكواخ عادية تقليدية': {
    ar: 'أكواخ عادية تقليدية',
    en: 'Classic Sinai Huts',
  },
  'أكواخ عادية تقليدية (Normal Huts)': {
    ar: 'أكواخ عادية تقليدية',
    en: 'Classic Sinai Huts',
  },
  'Classic Sinai Huts': {
    ar: 'أكواخ عادية تقليدية',
    en: 'Classic Sinai Huts',
  },
};

export function translateRoomType(name: string, lang: Language): string {
  if (!name) return '';
  const trimmed = name.trim();
  if (ROOM_TRANSLATIONS[trimmed]) {
    return ROOM_TRANSLATIONS[trimmed][lang];
  }
  // Check keywords for room category
  if (lang === 'en') {
    if (trimmed.includes('ديلوكس')) return 'Deluxe Sea View Rooms';
    if (trimmed.includes('مميز')) return 'Special Beachfront Huts';
    if (trimmed.includes('عادي') || trimmed.includes('تقليد')) return 'Classic Sinai Huts';
    // Remove Arabic characters if mixed
    return trimmed.replace(/[\u0600-\u06ff]/g, '').replace(/[()—]/g, '').trim() || trimmed;
  } else {
    if (trimmed.includes('Deluxe') || trimmed.includes('ديلوكس')) return 'غرف ديلوكس مطلة على البحر';
    if (trimmed.includes('Special') || trimmed.includes('مميز')) return 'أكواخ مميزة على الشاطئ';
    if (trimmed.includes('Classic') || trimmed.includes('عادي') || trimmed.includes('تقليد')) return 'أكواخ عادية تقليدية';
    // Clean trailing English parenthesis in Arabic mode
    return trimmed.replace(/\s*\([A-Za-z\s]+\)\s*/g, '').trim() || trimmed;
  }
}

const PACKAGE_TRANSLATIONS: Record<string, {
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
  category?: { ar: string; en: string };
}> = {
  'باقة الهروب إلى سيناء (3 أيام / ليلتان)': {
    title: {
      ar: 'باقة الهروب إلى سيناء (3 أيام / ليلتان)',
      en: 'Sinai Escape Package (3 Days / 2 Nights)',
    },
    desc: {
      ar: 'إقامة ليلتان في كوخ مميز على الشاطئ شامل إفطار وعشاء، جلسة سمر ليلية وشاي حبق، ومعدات سنوركلينج مجانية.',
      en: '2 nights in a beachfront hut with half board (breakfast & dinner), campfire evening with Sinai herbal tea, and free snorkeling equipment.',
    },
    category: {
      ar: 'إجازة قصيرة',
      en: 'Short Break',
    },
  },
  'باقة الهروب للسيناء - 3 ليالي / 4 أيام': {
    title: {
      ar: 'باقة الهروب للسيناء - 3 ليالي / 4 أيام',
      en: 'Sinai Escape Package - 4 Days / 3 Nights',
    },
    desc: {
      ar: 'إقامة 3 ليالي في كوخ أو غرفة مكيفة على البحر مباشرة شاملة وجبتي الإفطار والعشاء، وسهرة بدوية على الشاطئ ومعدات سنوركلينج طوال فترة الإقامة.',
      en: '3 nights in an oceanfront hut or AC room including daily breakfast and dinner, beach campfire night, and complimentary snorkeling gear.',
    },
    category: {
      ar: 'إقامة كاملة',
      en: 'Full Board',
    },
  },
  'باقة العشاق والاسترخاء - كوخ على البحر': {
    title: {
      ar: 'باقة العشاق والاسترخاء - كوخ على البحر',
      en: 'Romantic Beachfront Hut Retreat',
    },
    desc: {
      ar: 'كوخ شاطئي خاص بإطلالة بانورامية ساحرة على البحر الأحمر، عشاء رومانسي تحت النجوم على ضوء الشموع، مشروبات ترحيبية مجانية وأجواء هدوء لا تضاهى.',
      en: 'Private beachfront hut with panoramic Red Sea views, romantic candlelit beach dinner under the stars, complimentary welcome drinks, and serene privacy.',
    },
    category: {
      ar: 'رومانسي',
      en: 'Romantic',
    },
  },
  'باقة المغامرة والوديان - 4 ليالي': {
    title: {
      ar: 'باقة المغامرة والوديان - 4 ليالي',
      en: 'Adventure & Canyons Package (4 Nights)',
    },
    desc: {
      ar: 'إقامة 4 ليالي نصف إقامة، تشمل رحلة هايكنج وادي الوشواش مع مرشد محلي، ورحلة الكانيون الملون، ونقل داخلي مع تجهيزات الأمان والمغامرة.',
      en: '4 nights half board including guided Wadi El Washwash hiking trek, Colored Canyon day expedition, local transport, and safety gear.',
    },
    category: {
      ar: 'مغامرة',
      en: 'Adventure',
    },
  },
  'باقة الاستجمام والمغامرة (4 أيام / 3 ليالٍ)': {
    title: {
      ar: 'باقة الاستجمام والمغامرة (4 أيام / 3 ليالٍ)',
      en: 'Relaxation & Adventure Package (4 Days / 3 Nights)',
    },
    desc: {
      ar: 'إقامة 3 ليالٍ في غرفة ديلوكس مكيفة مع حمام خاص، وجبتي إفطار وعشاء، رحلة وادي الوشواش مع مرشد محلي وسفاري خفيف.',
      en: '3 nights in an AC Deluxe Sea View Room with private bath, half board, guided Wadi El Washwash adventure, and light desert safari.',
    },
    category: {
      ar: 'المغامرة والهدوء',
      en: 'Adventure & Serenity',
    },
  },
  'باقة الأسبوع الكامل — عيش روح رأس شيطان (7 أيام / 6 ليالٍ)': {
    title: {
      ar: 'باقة الأسبوع الكامل — عيش روح رأس شيطان (7 أيام / 6 ليالٍ)',
      en: 'Full Week Retreat — Soul of Ras Shitan (7 Days / 6 Nights)',
    },
    desc: {
      ar: 'أسبوع كامل من السلام المطلق في كوخ أو غرفة من اختيارك، نصف إقامة، رحلتين خارجيتين، تجديف كاياك مجاني، وخصم 15% على المشروبات.',
      en: 'A full week of complete tranquility in your hut or room, half board, two guided day-trips, complimentary kayaking, and 15% off cafe items.',
    },
    category: {
      ar: 'إقامة ممتدة',
      en: 'Extended Stay',
    },
  },
};

export function translatePackage(
  item: { title: string; description: string; category?: string; price?: string | number },
  lang: Language
): { title: string; description: string; category?: string; price?: string } {
  const trimmedTitle = item.title?.trim() || '';
  const translatedPrice = item.price ? translatePackagePrice(item.price, lang) : undefined;
  const found = PACKAGE_TRANSLATIONS[trimmedTitle];
  if (found) {
    return {
      title: found.title[lang],
      description: found.desc[lang],
      category: found.category ? found.category[lang] : item.category,
      price: translatedPrice,
    };
  }

  if (lang === 'en') {
    if (trimmedTitle.includes('الهروب') || trimmedTitle.includes('Escape')) {
      return {
        title: 'Sinai Escape Package - 4 Days / 3 Nights',
        description: '3 nights in an oceanfront hut or AC room including daily breakfast and dinner, beach campfire night, and complimentary snorkeling gear.',
        category: 'Full Board',
        price: translatedPrice,
      };
    }
    if (trimmedTitle.includes('العشاق') || trimmedTitle.includes('رومانسي') || trimmedTitle.includes('Romantic')) {
      return {
        title: 'Romantic Beachfront Hut Retreat',
        description: 'Private beachfront hut with panoramic Red Sea views, romantic candlelit beach dinner under the stars, complimentary welcome drinks, and serene privacy.',
        category: 'Romantic',
        price: translatedPrice,
      };
    }
    if (trimmedTitle.includes('المغامرة') || trimmedTitle.includes('الوديان') || trimmedTitle.includes('Adventure')) {
      return {
        title: 'Adventure & Canyons Package (4 Nights)',
        description: '4 nights half board including guided Wadi El Washwash hiking trek, Colored Canyon day expedition, local transport, and safety gear.',
        category: 'Adventure',
        price: translatedPrice,
      };
    }
    if (trimmedTitle.includes('الأسبوع') || trimmedTitle.includes('Week')) {
      return {
        title: 'Full Week Retreat — Soul of Ras Shitan',
        description: 'A full week of complete tranquility in your hut or room, half board, two guided day-trips, complimentary kayaking, and 15% off cafe items.',
        category: 'Extended Stay',
        price: translatedPrice,
      };
    }
  }

  return {
    title: item.title,
    description: item.description,
    category: item.category,
    price: translatedPrice,
  };
}

export function translatePackagePrice(price: string | number | undefined | null, lang: Language): string {
  if (price === undefined || price === null || price === '') return '';
  const priceStr = String(price).trim();

  if (lang === 'en') {
    let formatted = priceStr;
    formatted = formatted.replace(/ج\.م|جنيه/g, 'EGP');
    formatted = formatted.replace(/للفرد/g, '/ person');
    formatted = formatted.replace(/للغرفة/g, '/ room');
    formatted = formatted.replace(/لليلة/g, '/ night');
    if (!formatted.includes('EGP') && /^\d+$/.test(formatted)) {
      formatted = `${Number(formatted).toLocaleString()} EGP`;
    }
    return formatted;
  } else {
    let formatted = priceStr;
    formatted = formatted.replace(/EGP/gi, 'ج.م');
    formatted = formatted.replace(/\/ person|per person/gi, 'للفرد');
    formatted = formatted.replace(/\/ room|per room/gi, 'للغرفة');
    formatted = formatted.replace(/\/ night|per night/gi, 'لليلة');
    if (!formatted.includes('ج.م') && /^\d+$/.test(formatted)) {
      formatted = `${Number(formatted).toLocaleString()} ج.م`;
    }
    return formatted;
  }
}

const TRIP_TRANSLATIONS: Record<string, {
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
}> = {
  'رحلة وادي الوشواش (Wadi El Washwash Hiking)': {
    title: {
      ar: 'رحلة وادي الوشواش (Wadi El Washwash Hiking)',
      en: 'Wadi El Washwash Canyon & Fresh Water Pools Trek',
    },
    desc: {
      ar: 'مغامرة هايكنج بين جبال الجرانيت المذهلة للوصول إلى بحيرة المياه العذبة الساحرة وسط الصخور للسباحة والقفز.',
      en: 'A breathtaking mountain hike through granite cliffs leading to the emerald natural freshwater pool for swimming and cliff jumps.',
    },
  },
  'رحلة وادي الوشواش والبحيرة العذبة': {
    title: {
      ar: 'رحلة وادي الوشواش والبحيرة العذبة',
      en: 'Wadi El Washwash & Natural Freshwater Lake',
    },
    desc: {
      ar: 'مغامرة هايكنج رائعة بين جبال الجرانيت المذهلة للوصول إلى بحيرة المياه العذبة الساحرة وسط الصخور للسباحة والقفز.',
      en: 'A breathtaking mountain hike through granite cliffs leading to the emerald natural freshwater pool for swimming and cliff jumps.',
    },
  },
  'رحلة الكانيون الملون والكانيون الأبيض (White & Color Canyon)': {
    title: {
      ar: 'رحلة الكانيون الملون والكانيون الأبيض (White & Color Canyon)',
      en: 'Colored Canyon & White Canyon Expedition',
    },
    desc: {
      ar: 'استكشاف التكوينات الصخرية الملونة بدرجات المغرة والأحمر والأبيض التي تشكلت عبر ملايين السنين مع مرشد بدوي محلي خبير.',
      en: 'Explore vibrant swirling sandstone rock formations carved over millions of years with an expert local Bedouin guide.',
    },
  },
  'رحلة الكانيون الملون والكانيون الأبيض': {
    title: {
      ar: 'رحلة الكانيون الملون والكانيون الأبيض',
      en: 'Colored Canyon & White Canyon Expedition',
    },
    desc: {
      ar: 'استكشاف التكوينات الصخرية الملونة بدرجات المغرة والأحمر والأبيض التي تشكلت عبر ملايين السنين مع مرشد بدوي محلي خبير.',
      en: 'Explore vibrant swirling sandstone rock formations carved over millions of years with an expert local Bedouin guide.',
    },
  },
  'رحلة طابا وقلعة صلاح الدين (Taba & Salah El Din Castle)': {
    title: {
      ar: 'رحلة طابا وقلعة صلاح الدين (Taba & Salah El Din Castle)',
      en: 'Taba & Saladin Citadel on Pharaoh’s Island',
    },
    desc: {
      ar: 'جولة تاريخية وبحرية ساحرة لزيارة قلعة صلاح الدين الأثرية الواقعة في قلب خليج العقبة، مع إطلالة على 4 دول عربية.',
      en: 'A scenic maritime and historical tour to Salah El-Din fortress on Pharaoh’s Island with panoramic views across 4 countries.',
    },
  },
  'رحلة طابا وقلعة صلاح الدين وجزيرة فرعون': {
    title: {
      ar: 'رحلة طابا وقلعة صلاح الدين وجزيرة فرعون',
      en: 'Taba, Pharaoh’s Island & Saladin Castle',
    },
    desc: {
      ar: 'جولة تاريخية وبحرية ساحرة لزيارة قلعة صلاح الدين الأثرية الواقعة في قلب خليج العقبة، مع إطلالة على 4 دول عربية.',
      en: 'A scenic maritime and historical tour to Salah El-Din fortress on Pharaoh’s Island with panoramic views across 4 countries.',
    },
  },
  'رحلة دهب وسفاري الجبال (Dahab & Mountain Safari)': {
    title: {
      ar: 'رحلة دهب وسفاري الجبال (Dahab & Mountain Safari)',
      en: 'Dahab, Blue Hole & Twilat Mountain Safari',
    },
    desc: {
      ar: 'يوم كامل يبدأ بالسنوركلينج في أشهر بقعة بحرية في العالم (البلوهول)، ثم جولة في ممشى دهب وسهرة بدوية على جبل الطويلات.',
      en: 'A full day starting with world-renowned snorkeling at the Blue Hole, shopping along Dahab promenade, and a Bedouin night at Mount Twilat.',
    },
  },
  'رحلة دهب، البلوهول وسفاري جبل الطويلات': {
    title: {
      ar: 'رحلة دهب، البلوهول وسفاري جبل الطويلات',
      en: 'Dahab, Blue Hole & Twilat Mountain Safari',
    },
    desc: {
      ar: 'يوم كامل يبدأ بالسنوركلينج في أشهر بقعة بحرية في العالم (البلوهول)، ثم جولة في ممشى دهب وسهرة بدوية على جبل الطويلات.',
      en: 'A full day starting with world-renowned snorkeling at the Blue Hole, shopping along Dahab promenade, and a Bedouin night at Mount Twilat.',
    },
  },
  'رحلة سانت كاترين وصعود جبل موسى': {
    title: {
      ar: 'رحلة سانت كاترين وصعود جبل موسى',
      en: 'St. Catherine & Mount Sinai Sunrise Trek',
    },
    desc: {
      ar: 'صعود جبل موسى ليلاً لمشاهدة واحدة من أجمل لحظات شروق الشمس على وجه الأرض، يعقبها زيارة دير سانت كاترين التاريخي.',
      en: 'Ascend Mount Sinai under starry skies to witness an unforgettable sunrise above the clouds, followed by a visit to St. Catherine Monastery.',
    },
  },
  'سنوركلينج قارب في رأس شيطان والشعاب الحرة': {
    title: {
      ar: 'سنوركلينج قارب في رأس شيطان والشعاب الحرة',
      en: 'Boat Snorkeling & Outer Reefs in Ras Shitan',
    },
    desc: {
      ar: 'رحلة بحرية بالمركب لزيارة الشعاب المرجانية العميقة والمواقع البكر غير المزدحمة مع كامل معدات السنوركلينج والسلامة.',
      en: 'Boat excursion to deep pristine reefs and coral gardens of the Gulf of Aqaba, complete with safety gear and snorkeling kits.',
    },
  },
};

export function translateTrip(
  item: { title: string; description: string },
  lang: Language
): { title: string; description: string } {
  const trimmedTitle = item.title?.trim() || '';
  const found = TRIP_TRANSLATIONS[trimmedTitle];
  if (found) {
    return {
      title: found.title[lang],
      description: found.desc[lang],
    };
  }

  if (lang === 'en') {
    if (trimmedTitle.includes('الوشواش') || trimmedTitle.includes('Washwash')) {
      return {
        title: 'Wadi El Washwash Canyon & Fresh Water Pools Trek',
        description: 'A breathtaking mountain hike through granite cliffs leading to the emerald natural freshwater pool for swimming and cliff jumps.',
      };
    }
    if (trimmedTitle.includes('الكانيون') || trimmedTitle.includes('Canyon')) {
      return {
        title: 'Colored Canyon & White Canyon Expedition',
        description: 'Explore vibrant swirling sandstone rock formations carved over millions of years with an expert local Bedouin guide.',
      };
    }
    if (trimmedTitle.includes('طابا') || trimmedTitle.includes('صلاح الدين') || trimmedTitle.includes('Taba')) {
      return {
        title: 'Taba & Saladin Citadel on Pharaoh’s Island',
        description: 'A scenic maritime and historical tour to Salah El-Din fortress on Pharaoh’s Island with panoramic views across 4 countries.',
      };
    }
    if (trimmedTitle.includes('دهب') || trimmedTitle.includes('Dahab')) {
      return {
        title: 'Dahab, Blue Hole & Twilat Mountain Safari',
        description: 'A full day starting with world-renowned snorkeling at the Blue Hole, shopping along Dahab promenade, and a Bedouin night at Mount Twilat.',
      };
    }
    if (trimmedTitle.includes('كاترين') || trimmedTitle.includes('موسى') || trimmedTitle.includes('Catherine')) {
      return {
        title: 'St. Catherine & Mount Sinai Sunrise Trek',
        description: 'Ascend Mount Sinai under starry skies to witness an unforgettable sunrise above the clouds, followed by a visit to St. Catherine Monastery.',
      };
    }
    if (trimmedTitle.includes('سنوركلينج') || trimmedTitle.includes('قارب') || trimmedTitle.includes('Snorkeling')) {
      return {
        title: 'Boat Snorkeling & Outer Reefs in Ras Shitan',
        description: 'Boat excursion to deep pristine reefs and coral gardens of the Gulf of Aqaba, complete with safety gear and snorkeling kits.',
      };
    }
  }

  return {
    title: item.title,
    description: item.description,
  };
}

const GALLERY_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  'شروق الشمس الساحر فوق خليج العقبة من أمام غرف وأكواخ جاز كامب': {
    ar: 'شروق الشمس الساحر فوق خليج العقبة من أمام غرف وأكواخ جاز كامب',
    en: 'Enchanting sunrise over the Gulf of Aqaba in front of Jazz Camp rooms and huts',
  },
  'شروق الشمس الساحر فوق خليج العقبة من أمام غرف وأكواخ دروب كامب': {
    ar: 'شروق الشمس الساحر فوق خليج العقبة من أمام غرف وأكواخ جاز كامب',
    en: 'Enchanting sunrise over the Gulf of Aqaba in front of Jazz Camp rooms and huts',
  },
  'جلسات بدوية أصيلة على شاطئ رأس شيطان حيث الهدوء المطلق والسكينة': {
    ar: 'جلسات بدوية أصيلة على شاطئ رأس شيطان حيث الهدوء المطلق والسكينة',
    en: 'Authentic Bedouin seaside gatherings in Ras Shitan amidst pure serenity',
  },
  'أكواخ الشاطئ البسيطة والأنيقة المصنوعة من خامات الطبيعة السيناوية': {
    ar: 'أكواخ الشاطئ البسيطة والأنيقة المصنوعة من خامات الطبيعة السيناوية',
    en: 'Simple, authentic Sinai beach huts built with natural palm and wood',
  },
  'حيث تلتقي مياه البحر الأحمر الصافية بجبال سيناء الشامخة': {
    ar: 'حيث تلتقي مياه البحر الأحمر الصافية بجبال سيناء الشامخة',
    en: 'Where crystalline Red Sea waters meet majestic Sinai mountains',
  },
  'مياه وادي الوشواش العذبة في قلب الجبال الجرانيتية': {
    ar: 'مياه وادي الوشواش العذبة في قلب الجبال الجرانيتية',
    en: 'Emerald freshwater pools of Wadi El Washwash hidden in granite mountains',
  },
  'أمسيات النار والموسيقى الهادئة تحت سماء سيناء المرصعة بالنجوم': {
    ar: 'أمسيات النار والموسيقى الهادئة تحت سماء سيناء المرصعة بالنجوم',
    en: 'Cozy campfire evenings and quiet music under the star-studded Sinai night sky',
  },
};

export function translateGalleryCaption(caption: string | undefined | null, lang: Language): string {
  if (!caption) return '';
  const trimmed = caption.trim();
  if (GALLERY_TRANSLATIONS[trimmed]) {
    return GALLERY_TRANSLATIONS[trimmed][lang];
  }
  if (lang === 'en') {
    if (trimmed.includes('شروق')) return 'Enchanting sunrise over the Gulf of Aqaba in front of Jazz Camp';
    if (trimmed.includes('بدوية') || trimmed.includes('شاطئ')) return 'Authentic seaside gatherings in Ras Shitan amidst pure serenity';
    if (trimmed.includes('أكواخ') || trimmed.includes('خامات')) return 'Sinai beach huts crafted from natural regional wood and palm';
    if (trimmed.includes('البحر') || trimmed.includes('جبال')) return 'Where crystalline Red Sea waters meet majestic Sinai mountains';
    if (trimmed.includes('الوشواش')) return 'Emerald freshwater pools of Wadi El Washwash hidden in granite mountains';
    if (trimmed.includes('النار') || trimmed.includes('نجوم')) return 'Campfire evenings under the star-studded Sinai sky';
  }
  return caption;
}
