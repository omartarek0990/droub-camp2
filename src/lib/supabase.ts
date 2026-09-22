import { createClient } from '@supabase/supabase-js';
import { RoomPricing, PackageItem, TripItem, GalleryItem, SiteInfo } from '../types';

export const SUPABASE_URL = 'https://dhxhqyoadxffunxcvktj.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoeGhxeW9hZHhmZnVueGN2a3RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMjkyMzcsImV4cCI6MjEwNTYwNTIzN30.1Uwhv7iVq-tZdVD5ekaVIyfwOrDsYjbkrkRrSTXsFNs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Authentic Ras Shitan & Sinai photography (Unsplash high-res curated photography of Sinai, Red Sea coast, Ras Shitan style camps)
export const DEFAULT_ROOM_PRICING: RoomPricing[] = [
  {
    room_type: 'غرف ديلوكس مطلة على البحر (Seaview Deluxe Rooms)',
    single_price: 1800,
    double_price: 2400,
    triple_price: 3000,
    quadruple_price: 3600,
    display_order: 1,
  },
  {
    room_type: 'أكواخ مميزة على الشاطئ (Special Huts)',
    single_price: 1300,
    double_price: 1800,
    triple_price: 2300,
    quadruple_price: 2800,
    display_order: 2,
  },
  {
    room_type: 'أكواخ عادية تقليدية (Normal Huts)',
    single_price: 900,
    double_price: 1300,
    triple_price: 1700,
    quadruple_price: 2100,
    display_order: 3,
  },
];

export const DEFAULT_PACKAGES: PackageItem[] = [
  {
    title: 'باقة الهروب للسيناء - 3 ليالي / 4 أيام',
    description: 'إقامة هادئة شاملة الإفطار والعشاء، مع جلسة سمر بدوية مسائية، ومعدات سنوركلينج طوال فترة الإقامة للاستمتاع بشعاب رأس شيطان.',
    price: '3,800 ج.م للفرد',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    category: 'إقامة كاملة',
    is_active: true,
    display_order: 1,
  },
  {
    title: 'باقة العشاق والاسترخاء - كوخ على البحر',
    description: 'كوخ مميز مواجه لأمواج البحر الأحمر مباشرة، عشاء رومانسي على ضوء الشموع، جلسة شاي جبلي، وإفطار بلدي على الشاطئ.',
    price: '4,500 ج.م للغرفة',
    image_url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1000&q=80',
    category: 'رومانسي',
    is_active: true,
    display_order: 2,
  },
  {
    title: 'باقة المغامرة والوديان - 4 ليالي',
    description: 'تشمل الإقامة بنصف إقامة بالإضافة إلى رحلة هايكنج خاصة لوادي الوشواش مع مرشد بدوي محلي، وركوب كاياك في مياه خليج العقبة.',
    price: '5,200 ج.م للفرد',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    category: 'مغامرة',
    is_active: true,
    display_order: 3,
  },
];

export const DEFAULT_TRIPS: TripItem[] = [
  {
    title: 'رحلة وادي الوشواش (Wadi El Washwash Hiking)',
    description: 'واحدة من أندر الظواهر الطبيعية في نويبع وجنوب سيناء. هايكنج بين الجبال الجرانيتية الوردية وصولاً إلى بحيرة مياه عذبة نقية محاطة بالجبال للسباحة والقفز الطبيعي.',
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    is_active: true,
    display_order: 1,
  },
  {
    title: 'رحلة الكانيون الملون والكانيون الأبيض (White & Color Canyon)',
    description: 'مغامرة استثنائية سيراً على الأقدام بين التكوينات الصخرية الملونة بدرجات المغرة والأحمر والأبيض التي نحتتها الرياح والسيول عبر ملايين السنين مع مرشد بدوي.',
    image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80',
    is_active: true,
    display_order: 2,
  },
  {
    title: 'رحلة طابا وقلعة صلاح الدين (Taba & Salah El Din Castle)',
    description: 'جولة ساحلية خلابة إلى جزيرة فرعون وزيارة قلعة صلاح الدين التاريخية التي تشرف على مياه أربع دول، مع وقفة في خليج فيورد (Fjord Bay) الأخاذ.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    is_active: true,
    display_order: 3,
  },
  {
    title: 'رحلة دهب وسفاري الجبال (Dahab & Mountain Safari)',
    description: 'يوم كامل لاكتشاف مدينة دهب الساحرة، وزيارة البلوهول الشهير سنوركلينج وغوص، ثم التوجه إلى سفاري جبل الطويلات لجلسة شاي وعشاء بدوي تحت النجوم.',
    image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b271?auto=format&fit=crop&w=1000&q=80',
    is_active: true,
    display_order: 4,
  },
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    caption: 'شروق الشمس الساحر فوق خليج العقبة من أمام غرف وأكواخ دروب كامب',
    display_order: 1,
  },
  {
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    caption: 'جلسات بدوية أصيلة على شاطئ رأس شيطان حيث الهدوء المطلق والسكينة',
    display_order: 2,
  },
  {
    image_url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1000&q=80',
    caption: 'أكواخ الشاطئ البسيطة والأنيقة المصنوعة من خامات الطبيعة السيناوية',
    display_order: 3,
  },
  {
    image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b271?auto=format&fit=crop&w=1000&q=80',
    caption: 'حيث تلتقي مياه البحر الأحمر الصافية بجبال سيناء الشامخة',
    display_order: 4,
  },
  {
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    caption: 'مياه وادي الوشواش العذبة في قلب الجبال الجرانيتية',
    display_order: 5,
  },
  {
    image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80',
    caption: 'أمسيات النار والموسيقى الهادئة تحت سماء سيناء المرصعة بالنجوم',
    display_order: 6,
  },
];

export const DEFAULT_SITE_INFO: Record<string, string> = {
  phone: '01061189414',
  whatsapp: '01061189414',
  instagram: 'droub.camp',
  facebook: 'droub.camp',
  location_name: 'شاطئ رأس شيطان، نويبع، جنوب سيناء، مصر',
  location_map_url: 'https://maps.app.goo.gl/VQwFt5UE4rWu6R9y6',
  booking_step_1: 'الحجز عبر التواصل المباشر مع إدارة الكامب على واتساب 01061189414',
  booking_step_2: 'تأكيد الحجز بتحويل 50% من إجمالي المبلغ عبر تطبيق إنستاباي (InstaPay)',
  pricing_note: 'الأسعار المعروضة هي للغرفة الواحدة في الليلة الواحدة، شاملة وجبتي الإفطار والعشاء.',
  trips_intro: 'تختلف أسعار الرحلات الخارجية بحسب عدد الأفراد المشاركين وعدد نزلاء الكامب الراغبين في الانضمام في ذلك التوقيت — يرجى التواصل معنا لمعرفة السعر الدقيق لمواعيدكم.',
  amenities_intro: 'نقدم لكم ضيافة سيناوية أصيلة في قلب الطبيعة البكر مع كافة وسائل الراحة التي تضمن استرخاءكم التام.',
  about_philosophy: 'دروب كامب هو ملاذ هادئ يقع مباشرة على شاطئ رأس شيطان برماله ومياهه الفيروزية البكر. يتميز بشاطئ صخري رائع لمحبي السنوركلينج واستكشاف الشعاب المرجانية، مع جزء رملي للسباحة والاسترخاء. فلسفتنا هي العودة للبساطة، والضيافة البدوية الأصيلة، والهروب من زحام وصخب المدينة لعيش تجربة سينائية حقيقية لا تُنسى.',
};
