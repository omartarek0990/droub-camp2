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

// Translation dictionaries for database items (Rooms, Packages, Trips)
const ROOM_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  'غرف ديلوكس مطلة على البحر': {
    ar: 'غرف ديلوكس مطلة على البحر',
    en: 'Deluxe Sea View Rooms',
  },
  'أكواخ مميزة على الشاطئ': {
    ar: 'أكواخ مميزة على الشاطئ',
    en: 'Special Beachfront Huts',
  },
  'أكواخ عادية تقليدية': {
    ar: 'أكواخ عادية تقليدية',
    en: 'Classic Sinai Huts',
  },
};

export function translateRoomType(name: string, lang: Language): string {
  if (ROOM_TRANSLATIONS[name]) {
    return ROOM_TRANSLATIONS[name][lang];
  }
  // If in English and the name is in Arabic but not in dictionary, check keywords
  if (lang === 'en') {
    if (name.includes('ديلوكس')) return 'Deluxe Sea View Room';
    if (name.includes('مميز')) return 'Special Beachfront Hut';
    if (name.includes('عادي') || name.includes('تقليد')) return 'Classic Sinai Hut';
  }
  return name;
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

export function translatePackage(item: { title: string; description: string; category?: string }, lang: Language) {
  const found = PACKAGE_TRANSLATIONS[item.title];
  if (found) {
    return {
      title: found.title[lang],
      description: found.desc[lang],
      category: found.category ? found.category[lang] : item.category,
    };
  }
  return {
    title: item.title,
    description: item.description,
    category: item.category,
  };
}

const TRIP_TRANSLATIONS: Record<string, {
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
}> = {
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

export function translateTrip(item: { title: string; description: string }, lang: Language) {
  const found = TRIP_TRANSLATIONS[item.title];
  if (found) {
    return {
      title: found.title[lang],
      description: found.desc[lang],
    };
  }
  return {
    title: item.title,
    description: item.description,
  };
}
