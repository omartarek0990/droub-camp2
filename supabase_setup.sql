-- ==============================================================================
-- DROUB CAMP (دروب كامب — رأس شيطان) — COMPLETE SUPABASE DATABASE SETUP SCRIPT
-- ==============================================================================
-- هذا السكربت يقوم بإنشاء كافة الجداول، وصلاحيات الأمان (RLS)، ومجلد تخزين الصور (Storage)،
-- وتفعيل التحديث اللحظي (Realtime) لطلبات الحجز، بالإضافة إلى زراعة البيانات الافتراضية الأولية للكامب.
-- ==============================================================================

-- 1. جدول أسعار وأكواخ الإقامة (rooms_pricing)
CREATE TABLE IF NOT EXISTS public.rooms_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_type TEXT NOT NULL,
    single_price NUMERIC,
    double_price NUMERIC,
    triple_price NUMERIC,
    quadruple_price NUMERIC,
    display_order INTEGER DEFAULT 0,
    total_units INTEGER DEFAULT 6,
    description_ar TEXT,
    description_en TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ضمان وجود عمود عدد الغرف total_units
ALTER TABLE public.rooms_pricing ADD COLUMN IF NOT EXISTS total_units INTEGER DEFAULT 6;

-- 2. جدول العروض والباقات (packages)
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. جدول رحلات ومغامرات سيناء (trips)
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. جدول معرض الصور (gallery)
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. جدول معلومات وبيانات التواصل وسياسات الكامب (site_info)
CREATE TABLE IF NOT EXISTS public.site_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. جدول طلبات الحجز المباشرة (booking_requests)
CREATE TABLE IF NOT EXISTS public.booking_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_type TEXT NOT NULL CHECK (request_type IN ('room', 'package')),
    reference_name TEXT NOT NULL,
    occupancy TEXT,
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    guest_name TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    guests_count INTEGER DEFAULT 1,
    total_price NUMERIC,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 7. تفعيل التحديث المباشر اللحظي (Realtime) لجدول الحجوزات
-- ==============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'booking_requests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.booking_requests;
  END IF;
END $$;

-- ==============================================================================
-- 8. تفعيل سياسات الأمان (Row Level Security - RLS)
-- ==============================================================================
ALTER TABLE public.rooms_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- سياسات rooms_pricing
DROP POLICY IF EXISTS "Public read rooms_pricing" ON public.rooms_pricing;
CREATE POLICY "Public read rooms_pricing" ON public.rooms_pricing FOR SELECT USING (true);

DROP POLICY IF EXISTS "Full access rooms_pricing" ON public.rooms_pricing;
CREATE POLICY "Full access rooms_pricing" ON public.rooms_pricing FOR ALL USING (true) WITH CHECK (true);

-- سياسات packages
DROP POLICY IF EXISTS "Public read packages" ON public.packages;
CREATE POLICY "Public read packages" ON public.packages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Full access packages" ON public.packages;
CREATE POLICY "Full access packages" ON public.packages FOR ALL USING (true) WITH CHECK (true);

-- سياسات trips
DROP POLICY IF EXISTS "Public read trips" ON public.trips;
CREATE POLICY "Public read trips" ON public.trips FOR SELECT USING (true);

DROP POLICY IF EXISTS "Full access trips" ON public.trips;
CREATE POLICY "Full access trips" ON public.trips FOR ALL USING (true) WITH CHECK (true);

-- سياسات gallery
DROP POLICY IF EXISTS "Public read gallery" ON public.gallery;
CREATE POLICY "Public read gallery" ON public.gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Full access gallery" ON public.gallery;
CREATE POLICY "Full access gallery" ON public.gallery FOR ALL USING (true) WITH CHECK (true);

-- سياسات site_info
DROP POLICY IF EXISTS "Public read site_info" ON public.site_info;
CREATE POLICY "Public read site_info" ON public.site_info FOR SELECT USING (true);

DROP POLICY IF EXISTS "Full access site_info" ON public.site_info;
CREATE POLICY "Full access site_info" ON public.site_info FOR ALL USING (true) WITH CHECK (true);

-- سياسات booking_requests (تتيح للزوار الحجز ورؤية التواريخ المحجوزة، وتتيح للإدارة إدارة الحجوزات)
DROP POLICY IF EXISTS "Public read booking_requests" ON public.booking_requests;
CREATE POLICY "Public read booking_requests" ON public.booking_requests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert booking_requests" ON public.booking_requests;
CREATE POLICY "Public insert booking_requests" ON public.booking_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Full manage booking_requests" ON public.booking_requests;
CREATE POLICY "Full manage booking_requests" ON public.booking_requests FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full delete booking_requests" ON public.booking_requests;
CREATE POLICY "Full delete booking_requests" ON public.booking_requests FOR DELETE USING (true);

-- ==============================================================================
-- 9. إنشاء مجلد تخزين الصور (Storage Bucket: images) وسياسات رفعه
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'images',
    'images',
    true,
    15728640, -- 15MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read storage images" ON storage.objects;
CREATE POLICY "Public read storage images" ON storage.objects FOR SELECT USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Public upload storage images" ON storage.objects;
CREATE POLICY "Public upload storage images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "Public update storage images" ON storage.objects;
CREATE POLICY "Public update storage images" ON storage.objects FOR UPDATE USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Public delete storage images" ON storage.objects;
CREATE POLICY "Public delete storage images" ON storage.objects FOR DELETE USING (bucket_id = 'images');

-- ==============================================================================
-- 10. إدخال البيانات الافتراضية الأولية للكامب (Default Seed Data)
-- ==============================================================================

-- أسعار الغرف والأكواخ
INSERT INTO public.rooms_pricing (room_type, single_price, double_price, triple_price, quadruple_price, display_order, total_units)
VALUES
('غرف ديلوكس مطلة على البحر (Seaview Deluxe Rooms)', 1800, 2400, 3000, 3600, 1, 6),
('أكواخ مميزة على الشاطئ (Special Huts)', 1300, 1800, 2300, 2800, 2, 8),
('أكواخ عادية تقليدية (Normal Huts)', 900, 1300, 1700, 2100, 3, 12)
ON CONFLICT DO NOTHING;

-- الباقات والعروض
INSERT INTO public.packages (title, description, price, image_url, category, is_active, display_order)
VALUES
('باقة الهروب للسيناء - 3 ليالي / 4 أيام', 'إقامة هادئة شاملة الإفطار والعشاء، مع جلسة سمر بدوية مسائية، ومعدات سنوركلينج طوال فترة الإقامة للاستمتاع بشعاب رأس شيطان.', '3,800 ج.م للفرد', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80', 'إقامة كاملة', true, 1),
('باقة العشاق والاسترخاء - كوخ على البحر', 'كوخ مميز مواجه لأمواج البحر الأحمر مباشرة، عشاء رومانسي على ضوء الشموع، جلسة شاي جبلي، وإفطار بلدي على الشاطئ.', '4,500 ج.م للغرفة', 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1000&q=80', 'رومانسي', true, 2),
('باقة المغامرة والوديان - 4 ليالي', 'تشمل الإقامة بنصف إقامة بالإضافة إلى رحلة هايكنج خاصة لوادي الوشواش مع مرشد بدوي محلي، وركوب كاياك في مياه خليج العقبة.', '5,200 ج.م للفرد', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80', 'مغامرة', true, 3)
ON CONFLICT DO NOTHING;

-- رحلات سيناء
INSERT INTO public.trips (title, description, image_url, is_active, display_order)
VALUES
('رحلة وادي الوشواش (Wadi El Washwash Hiking)', 'واحدة من أندر الظواهر الطبيعية في نويبع وجنوب سيناء. هايكنج بين الجبال الجرانيتية الوردية وصولاً إلى بحيرة مياه عذبة نقية محاطة بالجبال للسباحة والقفز الطبيعي.', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', true, 1),
('رحلة الكانيون الملون والكانيون الأبيض (White & Color Canyon)', 'مغامرة استثنائية سيراً على الأقدام بين التكوينات الصخرية الملونة بدرجات المغرة والأحمر والأبيض التي نحتتها الرياح والسيول عبر ملايين السنين مع مرشد بدوي.', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80', true, 2),
('رحلة طابا وقلعة صلاح الدين (Taba & Salah El Din Castle)', 'جولة ساحلية خلابة إلى جزيرة فرعون وزيارة قلعة صلاح الدين التاريخية التي تشرف على مياه أربع دول، مع وقفة في خليج فيورد (Fjord Bay) الأخاذ.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80', true, 3),
('رحلة دهب وسفاري الجبال (Dahab & Mountain Safari)', 'يوم كامل لاكتشاف مدينة دهب الساحرة، وزيارة البلوهول الشهير سنوركلينج وغوص، ثم التوجه إلى سفاري جبل الطويلات لجلسة شاي وعشاء بدوي تحت النجوم.', 'https://images.unsplash.com/photo-1519046904884-53103b34b271?auto=format&fit=crop&w=1000&q=80', true, 4)
ON CONFLICT DO NOTHING;

-- معرض الصور
INSERT INTO public.gallery (image_url, caption, display_order)
VALUES
('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80', 'شروق الشمس الساحر فوق خليج العقبة من أمام غرف وأكواخ دروب كامب', 1),
('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80', 'جلسات بدوية أصيلة على شاطئ رأس شيطان حيث الهدوء المطلق والسكينة', 2),
('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1000&q=80', 'أكواخ الشاطئ البسيطة والأنيقة المصنوعة من خامات الطبيعة السيناوية', 3),
('https://images.unsplash.com/photo-1519046904884-53103b34b271?auto=format&fit=crop&w=1000&q=80', 'حيث تلتقي مياه البحر الأحمر الصافية بجبال سيناء الشامخة', 4),
('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', 'مياه وادي الوشواش العذبة في قلب الجبال الجرانيتية', 5),
('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80', 'أمسيات النار والموسيقى الهادئة تحت سماء سيناء المرصعة بالنجوم', 6)
ON CONFLICT DO NOTHING;

-- بيانات ومعلومات الموقع
INSERT INTO public.site_info (key, value)
VALUES
('phone', '01061189414'),
('whatsapp', '01061189414'),
('instagram', 'droub.camp'),
('facebook', 'droub.camp'),
('location_name', 'شاطئ رأس شيطان، نويبع، جنوب سيناء، مصر'),
('location_map_url', 'https://maps.app.goo.gl/VQwFt5UE4rWu6R9y6'),
('booking_step_1', 'الحجز عبر التواصل المباشر مع إدارة الكامب على واتساب 01061189414 أو الحجز الفوري من الموقع'),
('booking_step_2', 'تأكيد الحجز بتحويل 50% من إجمالي المبلغ عبر تطبيق إنستاباي (InstaPay) وتثبيت الحجز رسمياً'),
('pricing_note', 'الأسعار المعروضة هي للغرفة أو الكوخ في الليلة الواحدة، شاملة وجبتي الإفطار والعشاء.'),
('trips_intro', 'تختلف أسعار الرحلات الخارجية بحسب عدد الأفراد المشاركين وعدد نزلاء الكامب الراغبين في الانضمام في ذلك التوقيت — يرجى التواصل معنا لمعرفة السعر الدقيق لمواعيدكم.'),
('amenities_intro', 'نقدم لكم ضيافة سيناوية أصيلة في قلب الطبيعة البكر مع كافة وسائل الراحة التي تضمن استرخاءكم التام.'),
('about_philosophy', 'دروب كامب هو ملاذ هادئ يقع مباشرة على شاطئ رأس شيطان برماله ومياهه الفيروزية البكر. يتميز بشاطئ صخري رائع لمحبي السنوركلينج واستكشاف الشعاب المرجانية، مع جزء رملي للسباحة والاسترخاء. فلسفتنا هي العودة للبساطة، والضيافة البدوية الأصيلة، والهروب من زحام وصخب المدينة لعيش تجربة سينائية حقيقية لا تُنسى.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
