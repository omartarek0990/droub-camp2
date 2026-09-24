import { createClient } from '@supabase/supabase-js';
import { RoomPricing, PackageItem, TripItem, GalleryItem, SiteInfo } from '../types';

export const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string) || 'https://usassxgcytbjovrggrzw.supabase.co';
export const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzYXNzeGdjeXRiam92cmdncnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNjIwNjYsImV4cCI6MjEwNTYzODA2Nn0.J2YzSAxNFuCLlFx0UgKitaqfRgX3re3IXp_AYJ4XIi4';

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
    total_units: 6,
  },
  {
    room_type: 'أكواخ مميزة على الشاطئ (Special Huts)',
    single_price: 1300,
    double_price: 1800,
    triple_price: 2300,
    quadruple_price: 2800,
    display_order: 2,
    total_units: 8,
  },
  {
    room_type: 'أكواخ عادية تقليدية (Normal Huts)',
    single_price: 900,
    double_price: 1300,
    triple_price: 1700,
    quadruple_price: 2100,
    display_order: 3,
    total_units: 12,
  },
];

export const DEFAULT_PACKAGES: PackageItem[] = [
  {
    title: 'باقة الهروب للسيناء - 3 ليالي / 4 أيام',
    description: 'إقامة هادئة شاملة الإفطار والعشاء، مع جلسة سمر بدوية مسائية، ومعدات سنوركلينج طوال فترة الإقامة للاستمتاع بشعاب رأس شيطان.',
    price: '3,800 ج.م للفرد',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=75',
    category: 'إقامة كاملة',
    is_active: true,
    display_order: 1,
  },
  {
    title: 'باقة العشاق والاسترخاء - كوخ على البحر',
    description: 'كوخ مميز مواجه لأمواج البحر الأحمر مباشرة، عشاء رومانسي على ضوء الشموع، جلسة شاي جبلي، وإفطار بلدي على الشاطئ.',
    price: '4,500 ج.م للغرفة',
    image_url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=75',
    category: 'رومانسي',
    is_active: true,
    display_order: 2,
  },
  {
    title: 'باقة المغامرة والوديان - 4 ليالي',
    description: 'تشمل الإقامة بنصف إقامة بالإضافة إلى رحلة هايكنج خاصة لوادي الوشواش مع مرشد بدوي محلي، وركوب كاياك في مياه خليج العقبة.',
    price: '5,200 ج.م للفرد',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=75',
    category: 'مغامرة',
    is_active: true,
    display_order: 3,
  },
];

export const DEFAULT_TRIPS: TripItem[] = [
  {
    title: 'رحلة وادي الوشواش (Wadi El Washwash Hiking)',
    description: 'واحدة من أندر الظواهر الطبيعية في نويبع وجنوب سيناء. هايكنج بين الجبال الجرانيتية الوردية وصولاً إلى بحيرة مياه عذبة نقية محاطة بالجبال للسباحة والقفز الطبيعي.',
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=75',
    is_active: true,
    display_order: 1,
  },
  {
    title: 'رحلة الكانيون الملون والكانيون الأبيض (White & Color Canyon)',
    description: 'مغامرة استثنائية سيراً على الأقدام بين التكوينات الصخرية الملونة بدرجات المغرة والأحمر والأبيض التي نحتتها الرياح والسيول عبر ملايين السنين مع مرشد بدوي.',
    image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=75',
    is_active: true,
    display_order: 2,
  },
  {
    title: 'رحلة طابا وقلعة صلاح الدين (Taba & Salah El Din Castle)',
    description: 'جولة ساحلية خلابة إلى جزيرة فرعون وزيارة قلعة صلاح الدين التاريخية التي تشرف على مياه أربع دول، مع وقفة في خليج فيورد (Fjord Bay) الأخاذ.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=75',
    is_active: true,
    display_order: 3,
  },
  {
    title: 'رحلة دهب وسفاري الجبال (Dahab & Mountain Safari)',
    description: 'يوم كامل لاكتشاف مدينة دهب الساحرة، وزيارة البلوهول الشهير سنوركلينج وغوص، ثم التوجه إلى سفاري جبل الطويلات لجلسة شاي وعشاء بدوي تحت النجوم.',
    image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b271?auto=format&fit=crop&w=800&q=75',
    is_active: true,
    display_order: 4,
  },
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=75',
    caption: 'شروق الشمس الساحر فوق خليج العقبة من أمام غرف وأكواخ جاز كامب',
    display_order: 1,
  },
  {
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=75',
    caption: 'جلسات بدوية أصيلة على شاطئ رأس شيطان حيث الهدوء المطلق والسكينة',
    display_order: 2,
  },
  {
    image_url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=75',
    caption: 'أكواخ الشاطئ البسيطة والأنيقة المصنوعة من خامات الطبيعة السيناوية',
    display_order: 3,
  },
  {
    image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b271?auto=format&fit=crop&w=800&q=75',
    caption: 'حيث تلتقي مياه البحر الأحمر الصافية بجبال سيناء الشامخة',
    display_order: 4,
  },
  {
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=75',
    caption: 'مياه وادي الوشواش العذبة في قلب الجبال الجرانيتية',
    display_order: 5,
  },
  {
    image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=75',
    caption: 'أمسيات النار والموسيقى الهادئة تحت سماء سيناء المرصعة بالنجوم',
    display_order: 6,
  },
];

export const DEFAULT_SITE_INFO: Record<string, string> = {
  hero_title_ar: 'حيث يلتقي البحر الأحمر بجبال سيناء',
  hero_title_en: 'Where the Red Sea Meets the Sinai Mountains',
  hero_subheadline_ar: 'ملاذكم الهادئ والخلاب على رمال رأس شيطان في نويبع. شواطئ عذراء، أكواخ وغرف مريحة، جلسات سمر بدوية دافئة، وتجارب سنوركلينج وغوص لا تُنسى.',
  hero_subheadline_en: 'Your serene seaside sanctuary on the shores of Ras Shitan, Nuweiba. Pristine beaches, comfortable huts, authentic Bedouin hospitality, and unforgettable snorkeling.',
  hero_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=75',
  phone: '01061189414',
  whatsapp: '01061189414',
  social_facebook_url: 'https://www.facebook.com/share/19QJubXeUs/?mibextid=wwXIfr',
  social_instagram_url: '',
  social_tiktok_url: '',
  location_name_ar: 'شاطئ رأس شيطان، نويبع، جنوب سيناء، مصر',
  location_name_en: 'Ras Shitan Beach, Nuweiba, South Sinai, Egypt',
  location_name: 'شاطئ رأس شيطان، نويبع، جنوب سيناء، مصر',
  location_map_url: 'https://maps.app.goo.gl/VQwFt5UE4rWu6R9y6',
  booking_step_1_ar: 'الحجز عبر التواصل المباشر مع إدارة الكامب على واتساب 01061189414 أو الحجز الفوري من الموقع',
  booking_step_1_en: 'Inquire & check availability via WhatsApp: 01061189414 or instant online request',
  booking_step_1: 'الحجز عبر التواصل المباشر مع إدارة الكامب على واتساب 01061189414 أو الحجز الفوري من الموقع',
  booking_step_2_ar: 'تأكيد الحجز بتحويل 50% من إجمالي المبلغ عبر تطبيق إنستاباي (InstaPay) وتثبيت الحجز رسمياً',
  booking_step_2_en: 'Confirm reservation by transferring 50% deposit via InstaPay to lock dates',
  booking_step_2: 'تأكيد الحجز بتحويل 50% من إجمالي المبلغ عبر تطبيق إنستاباي (InstaPay) وتثبيت الحجز رسمياً',
  pricing_note_ar: 'الأسعار المعروضة هي للغرفة الواحدة في الليلة الواحدة، شاملة وجبتي الإفطار والعشاء.',
  pricing_note_en: 'Prices shown are per room per night, including daily breakfast and dinner.',
  pricing_note: 'الأسعار المعروضة هي للغرفة الواحدة في الليلة الواحدة، شاملة وجبتي الإفطار والعشاء.',
  trips_intro_ar: 'تختلف أسعار الرحلات الخارجية بحسب عدد الأفراد المشاركين وعدد نزلاء الكامب الراغبين في الانضمام في ذلك التوقيت — يرجى التواصل معنا لمعرفة السعر الدقيق لمواعيدكم.',
  trips_intro_en: 'Outdoor trip prices depend on group size and current camp guest participation. Please contact us for an exact quote for your dates.',
  trips_intro: 'تختلف أسعار الرحلات الخارجية بحسب عدد الأفراد المشاركين وعدد نزلاء الكامب الراغبين في الانضمام في ذلك التوقيت — يرجى التواصل معنا لمعرفة السعر الدقيق لمواعيدكم.',
  amenities_intro_ar: 'نقدم لكم ضيافة سيناوية أصيلة في قلب الطبيعة البكر مع كافة وسائل الراحة التي تضمن استرخاءكم التام.',
  amenities_intro_en: 'Authentic Sinai hospitality in the heart of untouched nature with all amenities to ensure total relaxation.',
  amenities_intro: 'نقدم لكم ضيافة سيناوية أصيلة في قلب الطبيعة البكر مع كافة وسائل الراحة التي تضمن استرخاءكم التام.',
  about_philosophy_ar: 'جاز كامب هو ملاذ هادئ يقع مباشرة على شاطئ رأس شيطان برماله ومياهه الفيروزية البكر. يتميز بشاطئ صخري رائع لمحبي السنوركلينج واستكشاف الشعاب المرجانية، مع جزء رملي للسباحة والاسترخاء. فلسفتنا هي العودة للبساطة، والضيافة البدوية الأصيلة، والهروب من زحام وصخب المدينة لعيش تجربة سينائية حقيقية لا تُنسى.',
  about_philosophy_en: 'Jazz Camp is nestled directly on the renowned Ras Shitan beach in Nuweiba, South Sinai, where rugged red mountains plunge straight into the turquoise Gulf of Aqaba. Designed as a sanctuary from modern city rush, we believe true luxury lies in simplicity, purity, and nature.',
  about_philosophy: 'جاز كامب هو ملاذ هادئ يقع مباشرة على شاطئ رأس شيطان برماله ومياهه الفيروزية البكر. يتميز بشاطئ صخري رائع لمحبي السنوركلينج واستكشاف الشعاب المرجانية، مع جزء رملي للسباحة والاسترخاء. فلسفتنا هي العودة للبساطة، والضيافة البدوية الأصيلة، والهروب من زحام وصخب المدينة لعيش تجربة سينائية حقيقية لا تُنسى.',
};
