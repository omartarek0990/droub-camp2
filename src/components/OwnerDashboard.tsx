import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { RoomPricing, PackageItem, TripItem, GalleryItem, SiteInfo, BookingRequest } from '../types';
import {
  DEFAULT_ROOM_PRICING,
  DEFAULT_PACKAGES,
  DEFAULT_TRIPS,
  DEFAULT_GALLERY,
  DEFAULT_SITE_INFO,
} from '../lib/supabase';
import {
  Lock,
  LogOut,
  Bed,
  Package,
  Compass,
  Image,
  FileText,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Eye,
  ArrowRight,
  Bell,
  Calendar,
  Check,
  Copy,
  MessageCircle,
  Phone,
  User,
  Clock,
  CreditCard,
  ExternalLink,
  Camera,
} from 'lucide-react';

interface OwnerDashboardProps {
  onClose: () => void;
  onDataUpdated: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onClose, onDataUpdated }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<'requests' | 'rooms' | 'packages' | 'trips' | 'gallery' | 'site_info'>('requests');

  // Booking Requests state
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('pending');
  const [confirmedReminderModal, setConfirmedReminderModal] = useState<BookingRequest | null>(null);
  const [copiedInstaPay, setCopiedInstaPay] = useState(false);
  const [cancellationNoticeModal, setCancellationNoticeModal] = useState<BookingRequest | null>(null);
  const [copiedCancellation, setCopiedCancellation] = useState(false);

  // Content Data states
  const [rooms, setRooms] = useState<RoomPricing[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [siteInfoList, setSiteInfoList] = useState<SiteInfo[]>([]);

  // Action status feedback
  const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Editing modals/states
  const [editingRoom, setEditingRoom] = useState<RoomPricing | null>(null);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);
  const [editingTrip, setEditingTrip] = useState<TripItem | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [editingSiteInfo, setEditingSiteInfo] = useState<SiteInfo | null>(null);

  // Uploading state & file input refs
  const [uploadingImage, setUploadingImage] = useState(false);
  const roomFileRef = useRef<HTMLInputElement>(null);
  const packageFileRef = useRef<HTMLInputElement>(null);
  const tripFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const [newRoomImageUrl, setNewRoomImageUrl] = useState('');

  // Check auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) {
        fetchAllData();
        fetchBookingRequests();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchAllData();
        fetchBookingRequests();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Supabase Realtime Subscription for booking_requests
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel('owner-booking-requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'booking_requests',
        },
        () => {
          fetchBookingRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setActionStatus({ type, message });
    setTimeout(() => setActionStatus(null), 5000);
  };

  // Auth Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        setAuthError(error.message || 'فشل تسجيل الدخول. يرجى التأكد من البريد وكلمة المرور.');
      } else {
        setSession(data.session);
        fetchAllData();
        fetchBookingRequests();
      }
    } catch (err: any) {
      setAuthError(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Fetch Booking Requests
  const fetchBookingRequests = async () => {
    setLoadingRequests(true);
    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setBookingRequests(data);
    } catch (err: any) {
      console.warn('Booking requests fetch warning:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Fetch all Supabase tables
  const fetchAllData = async () => {
    try {
      const [roomsRes, packagesRes, tripsRes, galleryRes, infoRes] = await Promise.all([
        supabase.from('rooms_pricing').select('*').order('display_order', { ascending: true }),
        supabase.from('packages').select('*').order('display_order', { ascending: true }),
        supabase.from('trips').select('*').order('display_order', { ascending: true }),
        supabase.from('gallery').select('*').order('display_order', { ascending: true }),
        supabase.from('site_info').select('*'),
      ]);

      if (roomsRes.data) setRooms(roomsRes.data);
      if (packagesRes.data) setPackages(packagesRes.data);
      if (tripsRes.data) setTrips(tripsRes.data);
      if (galleryRes.data) setGallery(galleryRes.data);
      if (infoRes.data) setSiteInfoList(infoRes.data);
      onDataUpdated();
    } catch (err) {
      console.error('Error fetching tables:', err);
    }
  };

  // Count pending requests for the live badge
  const pendingCount = bookingRequests.filter((r) => r.status === 'pending').length;

  // Handle Booking Status Update (Confirm / Cancel)
  const handleUpdateBookingStatus = async (
    request: BookingRequest,
    newStatus: 'confirmed' | 'cancelled' | 'pending'
  ) => {
    if (!request.id) return;

    try {
      const { error } = await supabase
        .from('booking_requests')
        .update({ status: newStatus })
        .eq('id', request.id);

      if (error) throw error;

      if (newStatus === 'confirmed') {
        showFeedback('success', `تم تأكيد حجز ${request.guest_name} بنجاح وحظر التواريخ على التقويم`);
        setConfirmedReminderModal({ ...request, status: 'confirmed' });
      } else if (newStatus === 'cancelled') {
        showFeedback('success', `تم إلغاء الحجز لـ ${request.guest_name} وإعادة إتاحة الغرفة على الموقع`);
      } else {
        showFeedback('success', `تمت إعادة الحجز لـ ${request.guest_name} إلى قيد الانتظار`);
      }

      fetchBookingRequests();
    } catch (err: any) {
      showFeedback('error', `فشل تحديث حالة الحجز: ${err.message}`);
    }
  };

  // Specific Action: Cancel Unpaid Booking & Prompt WhatsApp Notice
  const handleCancelUnpaidBooking = async (request: BookingRequest) => {
    if (!request.id) return;
    const confirmPrompt = window.confirm(
      `هل تريد بالتأكيد إلغاء حجز ${request.guest_name} لعدم تحويل الفلوس؟\n\nسيتم فوراً:\n1. تغيير حالة الحجز إلى "ملغي"\n2. إعادة فتح الغرفة والتواريخ فوراً على التقويم لجميع الزوار\n3. فتح رسالة واتساب جاهزة لإشعار النزيل بالإلغاء`
    );
    if (!confirmPrompt) return;

    try {
      const { error } = await supabase
        .from('booking_requests')
        .update({ status: 'cancelled' })
        .eq('id', request.id);

      if (error) throw error;

      showFeedback('success', `تم إلغاء حجز ${request.guest_name} بنجاح وإعادة فتح الغرفة على الموقع!`);
      fetchBookingRequests();
      // Open cancellation notice popup
      setCancellationNoticeModal(request);
    } catch (err: any) {
      showFeedback('error', `فشل إلغاء الحجز: ${err.message}`);
    }
  };

  // Delete Booking permanently
  const handleDeleteBooking = async (request: BookingRequest) => {
    if (!request.id) return;
    if (!window.confirm(`هل أنت متأكد من حذف سجل حجز ${request.guest_name} نهائياً من قاعدة البيانات؟`)) return;

    try {
      const { error } = await supabase.from('booking_requests').delete().eq('id', request.id);
      if (error) throw error;
      showFeedback('success', 'تم حذف سجل الحجز نهائياً');
      fetchBookingRequests();
    } catch (err: any) {
      showFeedback('error', `فشل حذف الحجز: ${err.message}`);
    }
  };

  // Fixed Direct Storage Upload to "images" bucket
  const handleDirectImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so re-selecting same file triggers change
    e.target.value = '';

    // Validate type
    if (!file.type.startsWith('image/')) {
      showFeedback('error', 'الملف المحدد ليس صورة. يرجى اختيار ملف بصيغة JPG أو PNG أو WebP.');
      return;
    }

    // Validate max size 15MB
    if (file.size > 15 * 1024 * 1024) {
      showFeedback('error', 'حجم الصورة كبير جداً (الحد الأقصى المسموح 15 ميجابايت).');
      return;
    }

    try {
      setUploadingImage(true);

      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanFileName = `droub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      const { data, error } = await supabase.storage.from('images').upload(cleanFileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

      if (error) {
        console.error('Storage bucket error:', error);
        showFeedback('error', `فشل رفع الصورة لمجلد images: ${error.message}`);
        return;
      }

      const { data: publicData } = supabase.storage.from('images').getPublicUrl(data.path);
      const publicUrl = publicData.publicUrl;

      onSuccess(publicUrl);
      showFeedback('success', 'تم رفع الصورة بنجاح إلى التخزين وتحديث الرابط!');
    } catch (err: any) {
      console.error('Upload exception:', err);
      showFeedback('error', `حدث خطأ أثناء رفع الصورة: ${err.message || 'يرجى المحاولة مجدداً'}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Upload multiple images for a Room
  const handleMultipleRoomImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingRoom) return;

    e.target.value = '';
    setUploadingImage(true);

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 15 * 1024 * 1024) continue;

        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const cleanFileName = `room_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

        const { data, error } = await supabase.storage.from('images').upload(cleanFileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

        if (!error && data) {
          const { data: publicData } = supabase.storage.from('images').getPublicUrl(data.path);
          if (publicData?.publicUrl) {
            uploadedUrls.push(publicData.publicUrl);
          }
        }
      }

      if (uploadedUrls.length > 0) {
        setEditingRoom((prev) => {
          if (!prev) return prev;
          const currentImages = prev.images || (prev.image_url ? [prev.image_url] : []);
          return {
            ...prev,
            images: [...currentImages, ...uploadedUrls],
            image_url: currentImages[0] || uploadedUrls[0],
          };
        });
        showFeedback('success', `تم رفع ${uploadedUrls.length} صورة بنجاح للغرفة!`);
      } else {
        showFeedback('error', 'تعذر رفع الصور، تأكد من صحة صيغة الملفات وحجمها.');
      }
    } catch (err: any) {
      showFeedback('error', `حدث خطأ أثناء رفع الصور: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Build copy-ready InstaPay message for confirmed booking
  const getInstaPayCopyText = (booking: BookingRequest) => {
    const halfDeposit = booking.total_price ? Math.round(booking.total_price * 0.5) : 0;
    return `مرحباً أستاذ/ة ${booking.guest_name}،
يسعدنا إبلاغك بأنه تم تأكيد قبول طلب حجزك في «دروب كامب — رأس شيطان، نويبع»!

تفاصيل الحجز:
• الإقامة / الباقة: ${booking.reference_name}
${booking.occupancy ? `• نوع الإشغال: ${booking.occupancy}\n` : ''}• تاريخ الوصول: ${booking.check_in}
• تاريخ المغادرة: ${booking.check_out}
• عدد النزلاء: ${booking.guests_count}
• إجمالي الإقامة: ${booking.total_price ? `${booking.total_price.toLocaleString()} ج.م` : 'حسب الاتفاق'}

لتثبيت وتأكيد الحجز النهائي، يرجى سداد عربون 50% (${halfDeposit > 0 ? `${halfDeposit.toLocaleString()} ج.م` : 'المتفق عليه'}):
بيانات التحويل عبر InstaPay:
• رقم الحساب / المحفظة: 01009124513
• الاسم المسجل: جمال عبدالله عزمي سعفan (Gamal Abdalla Azmy Saafan)

يرجى إرسال لقطة شاشة لإيصال التحويل فور السداد. نتطلع لاستضافتك في أحضان سيناء!`;
  };

  // Build copy-ready cancellation message when guest does not pay deposit
  const getCancellationCopyText = (booking: BookingRequest) => {
    return `مرحباً أستاذ/ة ${booking.guest_name}،
نحيطكم علماً بأنه نظراً لعدم استلام إشعار تحويل العربون (إنستاباي) لحجز ${booking.reference_name} للفترة من (${booking.check_in} إلى ${booking.check_out})، فقد تم إلغاء طلب الحجز وإعادة إتاحة الغرفة فوراً على الموقع لنزلاء آخرين.

نتطلع لاستضافتكم في دروب كامب — رأس شيطان في أوقات قادمة!
للتواصل والاستفسار: 01061189414`;
  };

  // Filtered booking requests list
  const filteredRequests = bookingRequests.filter((r) => {
    if (requestFilter === 'all') return true;
    return r.status === requestFilter;
  });

  // SEED INITIAL DATA
  const handleSeedInitialData = async () => {
    if (!window.confirm('هل تريد رفع البيانات الأولية للكامب إلى قاعدة بيانات سوبابيز؟')) return;
    setIsSeeding(true);
    try {
      if (rooms.length === 0) await supabase.from('rooms_pricing').insert(DEFAULT_ROOM_PRICING);
      if (packages.length === 0) await supabase.from('packages').insert(DEFAULT_PACKAGES);
      if (trips.length === 0) await supabase.from('trips').insert(DEFAULT_TRIPS);
      if (gallery.length === 0) await supabase.from('gallery').insert(DEFAULT_GALLERY);
      if (siteInfoList.length === 0) {
        const siteInfoRows = Object.entries(DEFAULT_SITE_INFO).map(([key, value]) => ({ key, value }));
        await supabase.from('site_info').insert(siteInfoRows);
      }
      await fetchAllData();
      showFeedback('success', 'تم تهيئة وتحديث جميع جداول قاعدة البيانات بنجاح!');
    } catch (err: any) {
      showFeedback('error', `حدث خطأ: ${err.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  // ROOMS CRUD
  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    try {
      const roomImages = editingRoom.images || (editingRoom.image_url ? [editingRoom.image_url] : []);
      const payload: any = {
        room_type: editingRoom.room_type,
        single_price: editingRoom.single_price ? Number(editingRoom.single_price) : null,
        double_price: editingRoom.double_price ? Number(editingRoom.double_price) : null,
        triple_price: editingRoom.triple_price ? Number(editingRoom.triple_price) : null,
        quadruple_price: editingRoom.quadruple_price ? Number(editingRoom.quadruple_price) : null,
        display_order: editingRoom.display_order ? Number(editingRoom.display_order) : 1,
        total_units: editingRoom.total_units ? Number(editingRoom.total_units) : 6,
        images: roomImages,
        image_url: roomImages[0] || null,
      };

      if (editingRoom.id) {
        const { error } = await supabase.from('rooms_pricing').update(payload).eq('id', editingRoom.id);
        if (error) throw error;
        showFeedback('success', 'تم تحديث أسعار الغرفة بنجاح');
      } else {
        const { error } = await supabase.from('rooms_pricing').insert([payload]);
        if (error) throw error;
        showFeedback('success', 'تم إضافة الغرفة بنجاح');
      }
      setEditingRoom(null);
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', `خطأ: ${err.message}`);
    }
  };

  const handleDeleteRoom = async (id?: string | number) => {
    if (!id || !window.confirm('هل أنت متأكد من حذف هذه الغرفة؟')) return;
    try {
      const { error } = await supabase.from('rooms_pricing').delete().eq('id', id);
      if (error) throw error;
      showFeedback('success', 'تم حذف الغرفة بنجاح');
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', `خطأ: ${err.message}`);
    }
  };

  // PACKAGES CRUD
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;

    try {
      const payload = {
        title: editingPackage.title,
        description: editingPackage.description,
        price: editingPackage.price,
        image_url: editingPackage.image_url,
        category: editingPackage.category || '',
        is_active: editingPackage.is_active !== false,
        display_order: Number(editingPackage.display_order) || 1,
      };

      if (editingPackage.id) {
        const { error } = await supabase.from('packages').update(payload).eq('id', editingPackage.id);
        if (error) throw error;
        showFeedback('success', 'تم تحديث الباقة بنجاح');
      } else {
        const { error } = await supabase.from('packages').insert([payload]);
        if (error) throw error;
        showFeedback('success', 'تم إضافة الباقة بنجاح');
      }
      setEditingPackage(null);
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', `خطأ: ${err.message}`);
    }
  };

  const handleDeletePackage = async (id?: string | number) => {
    if (!id || !window.confirm('هل أنت متأكد من حذف هذه الباقة؟')) return;
    try {
      const { error } = await supabase.from('packages').delete().eq('id', id);
      if (error) throw error;
      showFeedback('success', 'تم حذف الباقة بنجاح');
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', `خطأ: ${err.message}`);
    }
  };

  // TRIPS CRUD
  const handleSaveTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrip) return;

    try {
      const payload = {
        title: editingTrip.title,
        description: editingTrip.description,
        image_url: editingTrip.image_url,
        is_active: editingTrip.is_active !== false,
        display_order: Number(editingTrip.display_order) || 1,
      };

      if (editingTrip.id) {
        const { error } = await supabase.from('trips').update(payload).eq('id', editingTrip.id);
        if (error) throw error;
        showFeedback('success', 'تم تحديث الرحلة بنجاح');
      } else {
        const { error } = await supabase.from('trips').insert([payload]);
        if (error) throw error;
        showFeedback('success', 'تم إضافة الرحلة بنجاح');
      }
      setEditingTrip(null);
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', `خطأ: ${err.message}`);
    }
  };

  const handleDeleteTrip = async (id?: string | number) => {
    if (!id || !window.confirm('هل أنت متأكد من حذف هذه الرحلة؟')) return;
    try {
      const { error } = await supabase.from('trips').delete().eq('id', id);
      if (error) throw error;
      showFeedback('success', 'تم حذف الرحلة بنجاح');
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', `خطأ: ${err.message}`);
    }
  };

  // GALLERY CRUD
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery) return;

    try {
      const payload = {
        image_url: editingGallery.image_url,
        caption: editingGallery.caption || '',
        display_order: Number(editingGallery.display_order) || 1,
      };

      if (editingGallery.id) {
        const { error } = await supabase.from('gallery').update(payload).eq('id', editingGallery.id);
        if (error) throw error;
        showFeedback('success', 'تم تحديث صورة المعرض');
      } else {
        const { error } = await supabase.from('gallery').insert([payload]);
        if (error) throw error;
        showFeedback('success', 'تمت إضافة الصورة إلى المعرض بنجاح');
      }
      setEditingGallery(null);
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', `خطأ: ${err.message}`);
    }
  };

  const handleDeleteGallery = async (id?: string | number) => {
    if (!id || !window.confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
      showFeedback('success', 'تم حذف الصورة بنجاح');
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', `خطأ: ${err.message}`);
    }
  };

  // SITE INFO CRUD
  const handleSaveSiteInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSiteInfo) return;

    try {
      const { error } = await supabase
        .from('site_info')
        .upsert({ key: editingSiteInfo.key, value: editingSiteInfo.value }, { onConflict: 'key' });
      if (error) throw error;
      showFeedback('success', 'تم حفظ التعديل بنجاح');
      setEditingSiteInfo(null);
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', `خطأ: ${err.message}`);
    }
  };

  // If loading session
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F223D] text-white flex items-center justify-center p-4">
        <div className="flex items-center gap-3 font-['Cairo'] text-lg">
          <RefreshCw className="w-6 h-6 animate-spin text-[#D94E28]" />
          <span>جاري التحقق من الصلاحيات...</span>
        </div>
      </div>
    );
  }

  // 1. LOGIN SCREEN WITH REAL LOGO
  if (!session) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xl">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-3 p-1 rounded-2xl bg-[#0F223D] flex items-center justify-center shadow-md">
              <img src="/logo-emblem.svg" alt="Droub Camp" className="w-full h-full object-contain" />
            </div>
            <h1 className="font-['Cairo'] font-black text-2xl text-[#0F223D]">
              إدارة دروب كامب
            </h1>
            <p className="font-['Tajawal'] text-xs sm:text-sm text-[#64748B] mt-1">
              تسجيل الدخول المخصص لمالك الكامب لتأكيد الحجوزات وإدارة الأسعار والمحتوى
            </p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-4 p-3.5 rounded-xl bg-[#FEE2E2] text-[#991B1B] text-xs font-['Cairo'] flex items-center gap-2 border border-[#FCA5A5]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                البريد الإلكتروني (Email)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@droubcamp.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F223D] focus:outline-none text-sm font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                كلمة المرور (Password)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F223D] focus:outline-none text-sm font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#D94E28] hover:bg-[#C2411C] active:scale-95 disabled:opacity-60 text-white font-['Cairo'] font-bold text-base py-3.5 px-4 rounded-xl shadow-md transition-all mt-6"
            >
              {authLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>تسجيل الدخول للوحة الإدارة</span>
                </>
              )}
            </button>
          </form>

          {/* Back to public site */}
          <div className="mt-6 pt-4 border-t border-[#F1F5F9] text-center">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-['Cairo'] font-semibold text-[#64748B] hover:text-[#0F223D] transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة للموقع العام للزوار</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED OWNER DASHBOARD
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F223D] pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F223D] p-1 flex items-center justify-center shadow-sm">
              <img src="/logo-emblem.svg" alt="Droub Camp" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-['Cairo'] font-black text-lg text-[#0F223D] leading-none">
                  إدارة دروب كامب
                </h1>
                {pendingCount > 0 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D94E28] text-white text-[11px] font-['Cairo'] font-bold animate-pulse">
                    <Bell className="w-3 h-3" />
                    <span>{pendingCount} جديد</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] font-['Tajawal'] text-[#64748B]">
                الحساب: {session.user?.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-xs font-['Cairo'] font-bold text-[#0F223D] hover:bg-[#E2E8F0] transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#D94E28]" />
              <span>عرض الموقع</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FEE2E2] text-[#991B1B] text-xs font-['Cairo'] font-bold hover:bg-[#FCA5A5] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto border-t border-[#F1F5F9] pt-1 pb-1 no-scrollbar">
          {/* 1. BOOKING REQUESTS TAB (CRITICAL REQUIREMENT WITH REALTIME BADGE) */}
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-['Cairo'] font-bold whitespace-nowrap transition-colors relative ${
              activeTab === 'requests'
                ? 'bg-[#0F223D] text-white shadow-sm'
                : 'text-[#475569] hover:bg-[#F1F5F9]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#D94E28]" />
            <span>طلبات الحجز</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#D94E28] text-white text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          {/* 2. ROOMS PRICING */}
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-['Cairo'] font-bold whitespace-nowrap transition-colors ${
              activeTab === 'rooms' ? 'bg-[#0F223D] text-white shadow-sm' : 'text-[#475569] hover:bg-[#F1F5F9]'
            }`}
          >
            <Bed className="w-4 h-4" />
            <span>أسعار الغرف ({rooms.length})</span>
          </button>

          {/* 3. PACKAGES */}
          <button
            onClick={() => setActiveTab('packages')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-['Cairo'] font-bold whitespace-nowrap transition-colors ${
              activeTab === 'packages' ? 'bg-[#0F223D] text-white shadow-sm' : 'text-[#475569] hover:bg-[#F1F5F9]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>الباقات ({packages.length})</span>
          </button>

          {/* 4. TRIPS */}
          <button
            onClick={() => setActiveTab('trips')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-['Cairo'] font-bold whitespace-nowrap transition-colors ${
              activeTab === 'trips' ? 'bg-[#0F223D] text-white shadow-sm' : 'text-[#475569] hover:bg-[#F1F5F9]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>الرحلات ({trips.length})</span>
          </button>

          {/* 5. GALLERY */}
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-['Cairo'] font-bold whitespace-nowrap transition-colors ${
              activeTab === 'gallery' ? 'bg-[#0F223D] text-white shadow-sm' : 'text-[#475569] hover:bg-[#F1F5F9]'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>المعرض ({gallery.length})</span>
          </button>

          {/* 6. SITE INFO */}
          <button
            onClick={() => setActiveTab('site_info')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-['Cairo'] font-bold whitespace-nowrap transition-colors ${
              activeTab === 'site_info' ? 'bg-[#0F223D] text-white shadow-sm' : 'text-[#475569] hover:bg-[#F1F5F9]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>معلومات الموقع</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Action Status Feedback */}
        {actionStatus && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-['Cairo'] font-bold shadow-sm ${
              actionStatus.type === 'success'
                ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                : 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]'
            }`}
          >
            {actionStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{actionStatus.message}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: BOOKING REQUESTS MANAGEMENT (CRITICAL REQUIREMENT) */}
        {/* ======================================================== */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E2E8F0]">
              <div>
                <h2 className="font-['Cairo'] font-black text-xl text-[#0F223D] flex items-center gap-2">
                  <span>إدارة طلبات الحجز (Booking Requests)</span>
                  {pendingCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D94E28] text-white text-xs font-bold">
                      {pendingCount} بانتظار التأكيد
                    </span>
                  )}
                </h2>
                <p className="font-['Tajawal'] text-xs text-[#64748B]">
                  تأكيد أو إلغاء طلبات النزلاء، وتجهيز رسائل تحويل عربون إنستاباي بنقرة واحدة
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 p-1 bg-[#E2E8F0] rounded-xl self-start sm:self-auto">
                <button
                  onClick={() => setRequestFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-['Cairo'] font-bold transition-all ${
                    requestFilter === 'pending'
                      ? 'bg-white text-[#D94E28] shadow-sm'
                      : 'text-[#475569] hover:text-[#0F223D]'
                  }`}
                >
                  قيد الانتظار ({bookingRequests.filter((r) => r.status === 'pending').length})
                </button>
                <button
                  onClick={() => setRequestFilter('confirmed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-['Cairo'] font-bold transition-all ${
                    requestFilter === 'confirmed'
                      ? 'bg-white text-[#15803D] shadow-sm'
                      : 'text-[#475569] hover:text-[#0F223D]'
                  }`}
                >
                  مؤكدة ({bookingRequests.filter((r) => r.status === 'confirmed').length})
                </button>
                <button
                  onClick={() => setRequestFilter('cancelled')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-['Cairo'] font-bold transition-all ${
                    requestFilter === 'cancelled'
                      ? 'bg-white text-[#991B1B] shadow-sm'
                      : 'text-[#475569] hover:text-[#0F223D]'
                  }`}
                >
                  ملغية ({bookingRequests.filter((r) => r.status === 'cancelled').length})
                </button>
                <button
                  onClick={() => setRequestFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-['Cairo'] font-bold transition-all ${
                    requestFilter === 'all'
                      ? 'bg-white text-[#0F223D] shadow-sm'
                      : 'text-[#475569] hover:text-[#0F223D]'
                  }`}
                >
                  الكل ({bookingRequests.length})
                </button>
              </div>
            </div>

            {/* Requests List */}
            {filteredRequests.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-[#E2E8F0] shadow-sm space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] text-[#64748B] flex items-center justify-center mx-auto">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="font-['Cairo'] font-bold text-base text-[#0F223D]">
                  لا توجد طلبات حجز في هذه القائمة حالياً
                </h3>
                <p className="font-['Tajawal'] text-xs text-[#64748B]">
                  عندما يقوم الزوار بتقديم طلب حجز عبر الموقع ستظهر هنا فوراً وتحدث العداد مباشرة.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredRequests.map((req) => {
                  const isPending = req.status === 'pending';
                  const isConfirmed = req.status === 'confirmed';
                  const isCancelled = req.status === 'cancelled';

                  return (
                    <div
                      key={req.id}
                      className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all shadow-sm flex flex-col justify-between ${
                        isPending
                          ? 'border-[#D94E28]/40 ring-1 ring-[#D94E28]/20'
                          : isConfirmed
                          ? 'border-[#86EFAC] bg-[#F0FDF4]/30'
                          : 'border-[#E2E8F0] opacity-80'
                      }`}
                    >
                      <div>
                        {/* Top Meta Header */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <span className="text-[10px] font-mono text-[#64748B] block mb-0.5">
                              {req.created_at
                                ? new Date(req.created_at).toLocaleString('ar-EG', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                  })
                                : ''}
                            </span>
                            <h3 className="font-['Cairo'] font-black text-lg text-[#0F223D] flex items-center gap-2">
                              <span>{req.guest_name}</span>
                            </h3>
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-['Cairo'] font-bold border ${
                              isPending
                                ? 'bg-[#FFF7ED] text-[#C2411C] border-[#FFEDD5]'
                                : isConfirmed
                                ? 'bg-[#ECFDF5] text-[#15803D] border-[#BBF7D0]'
                                : 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]'
                            }`}
                          >
                            {isPending
                              ? '⏳ قيد الانتظار'
                              : isConfirmed
                              ? '✅ مؤكد ومحجوز'
                              : '❌ ملغي'}
                          </span>
                        </div>

                        {/* Booking Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-['Cairo'] mb-3">
                          <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2E8F0]">
                            <span className="text-[#64748B] block text-[10px]">نوع الحجز:</span>
                            <span className="font-bold text-[#0F223D] truncate block">
                              {req.reference_name}
                            </span>
                          </div>

                          {req.occupancy && (
                            <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2E8F0]">
                              <span className="text-[#64748B] block text-[10px]">نوع الإشغال:</span>
                              <span className="font-bold text-[#D94E28]">{req.occupancy}</span>
                            </div>
                          )}

                          <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2E8F0]">
                            <span className="text-[#64748B] block text-[10px]">النزلاء:</span>
                            <span className="font-bold text-[#0F223D]">{req.guests_count} فرد</span>
                          </div>

                          <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2E8F0]">
                            <span className="text-[#64748B] block text-[10px]">تاريخ الوصول:</span>
                            <span className="font-bold text-[#0F223D]">{req.check_in}</span>
                          </div>

                          <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2E8F0]">
                            <span className="text-[#64748B] block text-[10px]">تاريخ المغادرة:</span>
                            <span className="font-bold text-[#0F223D]">{req.check_out}</span>
                          </div>

                          <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2E8F0]">
                            <span className="text-[#64748B] block text-[10px]">إجمالي السعر:</span>
                            <span className="font-black text-[#D94E28]">
                              {req.total_price ? `${req.total_price.toLocaleString()} ج.م` : '—'}
                            </span>
                          </div>
                        </div>

                        {/* Phone & Notes */}
                        <div className="flex flex-wrap items-center gap-3 text-xs mb-3 font-['Tajawal']">
                          <a
                            href={`tel:${req.guest_phone}`}
                            className="inline-flex items-center gap-1.5 text-[#0F223D] font-bold hover:text-[#D94E28] dir-ltr"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#D94E28]" />
                            <span>{req.guest_phone}</span>
                          </a>

                          <a
                            href={`https://wa.me/${req.guest_phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25D366]/10 text-[#15803D] hover:bg-[#25D366]/20 font-bold"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                            <span>محادثة واتساب</span>
                          </a>
                        </div>

                        {req.notes && (
                          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2E8F0] text-xs font-['Tajawal'] text-[#475569] mb-3">
                            <span className="font-bold block text-[10px] text-[#64748B]">ملاحظات النزيل:</span>
                            {req.notes}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-[#F1F5F9] flex flex-col gap-2">
                        {isPending && (
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => handleUpdateBookingStatus(req, 'confirmed')}
                              className="flex-1 py-2.5 px-4 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-['Cairo'] font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
                            >
                              <Check className="w-4 h-4" />
                              <span>تأكيد الحجز وحظر التواريخ</span>
                            </button>
                            <button
                              onClick={() => handleCancelUnpaidBooking(req)}
                              className="py-2.5 px-3.5 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] text-[#991B1B] font-['Cairo'] font-bold text-xs transition-colors flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>إلغاء لعدم السداد</span>
                            </button>
                          </div>
                        )}

                        {isConfirmed && (
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <button
                              onClick={() => setConfirmedReminderModal(req)}
                              className="flex-1 py-2 px-3.5 rounded-xl bg-[#FFF7ED] border border-[#FFEDD5] hover:bg-[#FFEDD5] text-[#C2411C] font-['Cairo'] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <CreditCard className="w-4 h-4 text-[#D94E28]" />
                              <span>رسالة تحويل إنستاباي</span>
                            </button>
                            <button
                              onClick={() => handleCancelUnpaidBooking(req)}
                              className="py-2 px-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] hover:bg-[#FEE2E2] text-[#DC2626] font-['Cairo'] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                              title="إلغاء الحجز لعدم تحويل الفلوس وإعادة فتح الغرفة فوراً للنزلاء"
                            >
                              <X className="w-4 h-4 text-[#DC2626]" />
                              <span>إلغاء الحجز لعدم تحويل الفلوس (إعادة فتح الغرفة)</span>
                            </button>
                          </div>
                        )}

                        {isCancelled && (
                          <div className="flex items-center justify-between gap-2">
                            <button
                              onClick={() => handleUpdateBookingStatus(req, 'pending')}
                              className="py-1.5 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#E2E8F0] text-[#0F223D] font-['Cairo'] font-bold text-xs transition-colors"
                            >
                              إعادة تعيين (قيد الانتظار)
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(req)}
                              className="py-1.5 px-3 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] text-[#991B1B] font-['Cairo'] font-bold text-xs flex items-center gap-1 transition-colors"
                              title="حذف نهائي من قاعدة البيانات"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف السجل نهائياً</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ROOMS PRICING */}
        {/* ======================================================== */}
        {activeTab === 'rooms' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-['Cairo'] font-bold text-lg text-[#0F223D]">
                  إدارة أسعار الغرف (rooms_pricing)
                </h2>
                <p className="font-['Tajawal'] text-xs text-[#64748B]">
                  تعديل أسعار الغرف حسب الإشغال (فردي، مزدوج، ثلاثي، رباعي)
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingRoom({
                    room_type: '',
                    single_price: '',
                    double_price: '',
                    triple_price: '',
                    quadruple_price: '',
                    display_order: rooms.length + 1,
                    total_units: 6,
                    images: [],
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D94E28] text-white font-['Cairo'] font-bold text-xs hover:bg-[#C2411C] transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة غرفة جديدة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => {
                const roomImgs = room.images && room.images.length > 0 ? room.images : (room.image_url ? [room.image_url] : []);
                return (
                  <div
                    key={room.id}
                    className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Preview & Photo Count */}
                      {roomImgs.length > 0 && (
                        <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3 border border-[#E2E8F0] bg-[#FAF8F5]">
                          <img
                            src={roomImgs[0]}
                            alt={room.room_type}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=400&q=70';
                            }}
                          />
                          <span className="absolute bottom-2 start-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-['Cairo'] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Camera className="w-3 h-3 text-[#D94E28]" />
                            <span>{roomImgs.length} صور</span>
                          </span>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="font-['Cairo'] font-bold text-base text-[#0F223D]">
                          {room.room_type}
                        </h3>
                        <span className="text-[10px] font-['Cairo'] font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#64748B]">
                          ترتيب: {room.display_order}
                        </span>
                      </div>

                      <div className="bg-[#FAF8F5] p-2 rounded-lg flex items-center justify-between border border-[#E2E8F0] mb-3 text-xs font-['Cairo']">
                        <span className="text-[#64748B] text-[11px] font-['Tajawal']">عدد الغرف الإجمالي في الكامب:</span>
                        <span className="font-bold text-[#0F223D] bg-white px-2 py-0.5 rounded border border-[#CBD5E1]">
                          {room.total_units || 6} غرف
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-['Cairo'] mb-4">
                        <div className="bg-[#FAF8F5] p-2 rounded-lg">
                          <span className="text-[#64748B] block text-[10px]">فردي (Single):</span>
                          <span className="font-bold text-[#0F223D]">{room.single_price || '—'} ج.م</span>
                        </div>
                        <div className="bg-[#FAF8F5] p-2 rounded-lg">
                          <span className="text-[#64748B] block text-[10px]">مزدوج (Double):</span>
                          <span className="font-bold text-[#D94E28]">{room.double_price || '—'} ج.م</span>
                        </div>
                        <div className="bg-[#FAF8F5] p-2 rounded-lg">
                          <span className="text-[#64748B] block text-[10px]">ثلاثي (Triple):</span>
                          <span className="font-bold text-[#0F223D]">{room.triple_price || '—'} ج.م</span>
                        </div>
                        <div className="bg-[#FAF8F5] p-2 rounded-lg">
                          <span className="text-[#64748B] block text-[10px]">رباعي (Quad):</span>
                          <span className="font-bold text-[#0F223D]">{room.quadruple_price || '—'} ج.م</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-[#F1F5F9]">
                      <button
                        onClick={() =>
                          setEditingRoom({
                            ...room,
                            images: room.images || (room.image_url ? [room.image_url] : []),
                          })
                        }
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#E2E8F0] text-[#0F223D] font-['Cairo'] font-bold text-xs transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#D94E28]" />
                        <span>تعديل الغرفة والصور</span>
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="p-2 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] text-[#991B1B] transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: PACKAGES WITH FIXED DIRECT IMAGE UPLOADER */}
        {/* ======================================================== */}
        {activeTab === 'packages' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-['Cairo'] font-bold text-lg text-[#0F223D]">
                  إدارة الباقات والعروض (packages)
                </h2>
                <p className="font-['Tajawal'] text-xs text-[#64748B]">
                  إضافة وتعديل الباقات مع إمكانية رفع الصور مباشرة لمجلد images في سوبابيز
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingPackage({
                    title: '',
                    description: '',
                    price: '',
                    image_url: '',
                    category: '',
                    is_active: true,
                    display_order: packages.length + 1,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D94E28] text-white font-['Cairo'] font-bold text-xs hover:bg-[#C2411C] transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة باقة جديدة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="h-40 bg-[#E2E8F0] relative overflow-hidden">
                      {pkg.image_url ? (
                        <img src={pkg.image_url} alt={pkg.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-[#64748B]">
                          بدون صورة
                        </div>
                      )}
                      {pkg.category && (
                        <span className="absolute top-2 end-2 bg-[#D94E28] text-white text-[10px] font-['Cairo'] font-bold px-2 py-0.5 rounded-full">
                          {pkg.category}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-['Cairo'] font-bold text-base text-[#0F223D]">{pkg.title}</h3>
                        <span className="font-['Cairo'] font-extrabold text-sm text-[#D94E28]">{pkg.price}</span>
                      </div>
                      <p className="font-['Tajawal'] text-xs text-[#64748B] line-clamp-2">{pkg.description}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => setEditingPackage(pkg)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#E2E8F0] text-[#0F223D] font-['Cairo'] font-bold text-xs transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#D94E28]" />
                      <span>تعديل</span>
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-2 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] text-[#991B1B] transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: TRIPS WITH FIXED DIRECT IMAGE UPLOADER */}
        {/* ======================================================== */}
        {activeTab === 'trips' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-['Cairo'] font-bold text-lg text-[#0F223D]">
                  إدارة الرحلات الخارجية (trips)
                </h2>
                <p className="font-['Tajawal'] text-xs text-[#64748B]">
                  رحلات الهايكنج، الوديان، طابا، الكانيون، ودهب
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingTrip({
                    title: '',
                    description: '',
                    image_url: '',
                    is_active: true,
                    display_order: trips.length + 1,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F223D] text-white font-['Cairo'] font-bold text-xs hover:bg-[#1E3A5F] transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة رحلة جديدة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row justify-between"
                >
                  <div className="w-full sm:w-1/3 h-36 sm:h-auto bg-[#E2E8F0]">
                    {trip.image_url ? (
                      <img src={trip.image_url} alt={trip.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-[#64748B]">
                        بدون صورة
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-['Cairo'] font-bold text-base text-[#0F223D] mb-1">{trip.title}</h3>
                      <p className="font-['Tajawal'] text-xs text-[#64748B] line-clamp-3">{trip.description}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-3 mt-3 border-t border-[#F1F5F9]">
                      <button
                        onClick={() => setEditingTrip(trip)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#E2E8F0] text-[#0F223D] font-['Cairo'] font-bold text-xs transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#0F223D]" />
                        <span>تعديل</span>
                      </button>
                      <button
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="p-1.5 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] text-[#991B1B] transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: GALLERY WITH FIXED DIRECT IMAGE UPLOADER */}
        {/* ======================================================== */}
        {activeTab === 'gallery' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-['Cairo'] font-bold text-lg text-[#0F223D]">
                  إدارة معرض الصور (gallery)
                </h2>
                <p className="font-['Tajawal'] text-xs text-[#64748B]">
                  رفع صور عالية الجودة للشاطئ، الأكواخ، والأجواء مباشرة
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingGallery({
                    image_url: '',
                    caption: '',
                    display_order: gallery.length + 1,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D94E28] text-white font-['Cairo'] font-bold text-xs hover:bg-[#C2411C] transition-all shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span>رفع صورة جديدة</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm flex flex-col justify-between"
                >
                  <div className="h-36 sm:h-44 bg-[#E2E8F0] relative overflow-hidden">
                    <img src={item.image_url} alt={item.caption || ''} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="font-['Tajawal'] text-[11px] text-[#64748B] line-clamp-1 mb-2">
                      {item.caption || 'بدون وصف'}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingGallery(item)}
                        className="flex-1 py-1 rounded-lg bg-[#FAF8F5] text-[#0F223D] text-[10px] font-['Cairo'] font-bold hover:bg-[#E2E8F0]"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteGallery(item.id)}
                        className="p-1 rounded-lg bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FECACA]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: SITE INFO */}
        {/* ======================================================== */}
        {activeTab === 'site_info' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-['Cairo'] font-bold text-lg text-[#0F223D]">
                  إدارة نصوص ومعلومات الموقع (site_info)
                </h2>
                <p className="font-['Tajawal'] text-xs text-[#64748B]">
                  تعديل أرقام الهواتف، خطوات الحجز، إنستاباي، ونصوص الترحيب
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingSiteInfo({
                    key: '',
                    value: '',
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D94E28] text-white font-['Cairo'] font-bold text-xs hover:bg-[#C2411C] transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة نص جديد</span>
              </button>
            </div>

            <div className="space-y-3">
              {siteInfoList.map((info) => (
                <div
                  key={info.id || info.key}
                  className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <span className="font-mono text-xs text-[#D94E28] font-bold bg-[#FFF7ED] px-2 py-0.5 rounded-md inline-block mb-1">
                      {info.key}
                    </span>
                    <p className="font-['Tajawal'] text-xs sm:text-sm text-[#0F223D]">
                      {info.value}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingSiteInfo(info)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#E2E8F0] text-[#0F223D] font-['Cairo'] font-bold text-xs transition-colors self-end sm:self-center"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#D94E28]" />
                    <span>تعديل النص</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* INSTAPAY REMINDER TEXT MODAL (FOR CONFIRMED BOOKINGS) */}
      {/* ======================================================== */}
      {confirmedReminderModal && (
        <div className="fixed inset-0 z-50 bg-[#0F223D]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 border border-[#E2E8F0] shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#D94E28]" />
                <h3 className="font-['Cairo'] font-black text-lg text-[#0F223D]">
                  رسالة تحويل العربون عبر إنستاباي
                </h3>
              </div>
              <button
                onClick={() => {
                  setConfirmedReminderModal(null);
                  setCopiedInstaPay(false);
                }}
                className="p-1 rounded-full text-[#64748B] hover:bg-[#F1F5F9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-['Tajawal'] text-xs sm:text-sm text-[#64748B] mb-3">
              تم تجهيز نص رسالة التأكيد ومعلومات سداد العربون (50% على حساب جمال عبدالله عزمي سعفان). يمكنك نسخ النص أو إرساله مباشرة للنزيل عبر واتساب:
            </p>

            {/* Ready-to-copy textarea */}
            <textarea
              readOnly
              rows={9}
              value={getInstaPayCopyText(confirmedReminderModal)}
              className="w-full p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#CBD5E1] text-xs font-['Tajawal'] leading-relaxed mb-4 focus:outline-none"
            />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getInstaPayCopyText(confirmedReminderModal));
                  setCopiedInstaPay(true);
                  setTimeout(() => setCopiedInstaPay(false), 3000);
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#0F223D] hover:bg-[#1E3A5F] text-white font-['Cairo'] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {copiedInstaPay ? <Check className="w-4 h-4 text-[#86EFAC]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedInstaPay ? 'تم النسخ إلى الحافظة!' : 'نسخ الرسالة بالكامل'}</span>
              </button>

              <a
                href={`https://wa.me/${confirmedReminderModal.guest_phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  getInstaPayCopyText(confirmedReminderModal)
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-['Cairo'] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>إرسال عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CANCELLATION NOTICE MODAL (FOR UNPAID BOOKINGS) */}
      {/* ======================================================== */}
      {cancellationNoticeModal && (
        <div className="fixed inset-0 z-50 bg-[#0F223D]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 border border-[#E2E8F0] shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <X className="w-5 h-5 text-[#DC2626]" />
                <h3 className="font-['Cairo'] font-bold text-base sm:text-lg text-[#0F223D]">
                  تم إلغاء الحجز وإعادة فتح الغرفة
                </h3>
              </div>
              <button
                onClick={() => setCancellationNoticeModal(null)}
                className="p-1 rounded-full text-[#64748B] hover:bg-[#F1F5F9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-['Tajawal'] text-xs sm:text-sm text-[#64748B] mb-3">
              تم إلغاء الحجز وإعادة إتاحة تواريخ الغرفة فوراً في التقويم لجميع النزلاء. يمكنك الآن إرسال رسالة الإشعار الجاهزة للنزيل عبر واتساب أو نسخها:
            </p>

            {/* Ready-to-copy textarea */}
            <textarea
              readOnly
              rows={7}
              value={getCancellationCopyText(cancellationNoticeModal)}
              className="w-full p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] text-xs font-['Tajawal'] text-[#7F1D1D] leading-relaxed mb-4 focus:outline-none"
            />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getCancellationCopyText(cancellationNoticeModal));
                  setCopiedCancellation(true);
                  setTimeout(() => setCopiedCancellation(false), 3000);
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#0F223D] hover:bg-[#1E3A5F] text-white font-['Cairo'] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {copiedCancellation ? <Check className="w-4 h-4 text-[#86EFAC]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCancellation ? 'تم النسخ إلى الحافظة!' : 'نسخ الرسالة بالكامل'}</span>
              </button>

              <a
                href={`https://wa.me/${cancellationNoticeModal.guest_phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  getCancellationCopyText(cancellationNoticeModal)
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-['Cairo'] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>إرسال للنزيل واتساب</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT ROOM */}
      {/* ======================================================== */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 bg-[#0F223D]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto border border-[#E2E8F0] shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
              <h3 className="font-['Cairo'] font-bold text-lg text-[#0F223D]">
                {editingRoom.id ? 'تعديل أسعار وسعة الغرفة' : 'إضافة غرفة جديدة'}
              </h3>
              <button
                onClick={() => setEditingRoom(null)}
                className="p-1 rounded-full text-[#64748B] hover:bg-[#F1F5F9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  اسم ونوع الغرفة / الكوخ *
                </label>
                <input
                  type="text"
                  required
                  value={editingRoom.room_type}
                  onChange={(e) => setEditingRoom({ ...editingRoom, room_type: e.target.value })}
                  placeholder="غرف ديلوكس مطلة على البحر / Seaview Deluxe Rooms"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-['Tajawal']"
                />
              </div>

              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  إجمالي عدد الغرف المتوفرة في الكامب (Capacity Units) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editingRoom.total_units ?? 6}
                  onChange={(e) => setEditingRoom({ ...editingRoom, total_units: parseInt(e.target.value) || 1 })}
                  placeholder="6"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-mono"
                />
                <p className="text-[11px] text-[#64748B] font-['Tajawal'] mt-1">
                  العدد الفعلي المتاح في الكامب من هذا النوع (مثلاً 6 غرف ديلوكس). لن يتم قفل اليوم في التقويم إلا إذا تم حجز كافة الغرف لنفس التاريخ.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                    سعر الفردي (Single Price)
                  </label>
                  <input
                    type="number"
                    value={editingRoom.single_price || ''}
                    onChange={(e) => setEditingRoom({ ...editingRoom, single_price: e.target.value })}
                    placeholder="1800"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                    سعر المزدوج (Double Price) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingRoom.double_price || ''}
                    onChange={(e) => setEditingRoom({ ...editingRoom, double_price: e.target.value })}
                    placeholder="2400"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                    سعر الثلاثي (Triple Price)
                  </label>
                  <input
                    type="number"
                    value={editingRoom.triple_price || ''}
                    onChange={(e) => setEditingRoom({ ...editingRoom, triple_price: e.target.value })}
                    placeholder="3000"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                    سعر الرباعي (Quad Price)
                  </label>
                  <input
                    type="number"
                    value={editingRoom.quadruple_price || ''}
                    onChange={(e) => setEditingRoom({ ...editingRoom, quadruple_price: e.target.value })}
                    placeholder="3600"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-sm font-mono"
                  />
                </div>
              </div>

              {/* ROOM IMAGES (GALLERY & SLIDER) */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#CBD5E1] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D]">
                      صور الغرفة (سلايدر ومعرض صور الغرفة)
                    </label>
                    <p className="text-[11px] text-[#64748B] font-['Tajawal']">
                      يمكنك رفع عدة صور أو إدخال روابط لعرضها في سلايدر صور الغرفة على الموقع.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#0F223D] text-white">
                    {(editingRoom.images?.length || (editingRoom.image_url ? 1 : 0))} صور
                  </span>
                </div>

                {/* Hidden native multi-file input */}
                <input
                  ref={roomFileRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMultipleRoomImagesUpload}
                  className="hidden"
                />

                {/* Upload Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => roomFileRef.current?.click()}
                    className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#0F223D] hover:bg-[#1E3A5F] active:scale-95 text-white font-['Cairo'] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4 text-[#D94E28]" />
                    <span>{uploadingImage ? 'جاري رفع الصور...' : 'رفع عدة صور من جهازك'}</span>
                  </button>
                </div>

                {/* Add image URL input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newRoomImageUrl}
                    onChange={(e) => setNewRoomImageUrl(e.target.value)}
                    placeholder="أو الصق رابط صورة مباشرة هنا (https://...)"
                    className="flex-1 px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newRoomImageUrl.trim()) return;
                      const current = editingRoom.images || (editingRoom.image_url ? [editingRoom.image_url] : []);
                      setEditingRoom({
                        ...editingRoom,
                        images: [...current, newRoomImageUrl.trim()],
                        image_url: current[0] || newRoomImageUrl.trim(),
                      });
                      setNewRoomImageUrl('');
                      showFeedback('success', 'تمت إضافة رابط الصورة بنجاح!');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#E2E8F0] border border-[#CBD5E1] font-['Cairo'] font-bold text-xs text-[#0F223D]"
                  >
                    إضافة
                  </button>
                </div>

                {/* Image thumbnails list */}
                {((editingRoom.images && editingRoom.images.length > 0) || editingRoom.image_url) ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                    {(editingRoom.images && editingRoom.images.length > 0 ? editingRoom.images : [editingRoom.image_url!]).map(
                      (imgUrl, imgIdx) => (
                        <div
                          key={imgIdx}
                          className="relative group rounded-xl overflow-hidden border border-[#CBD5E1] bg-white h-24 shadow-xs"
                        >
                          <img
                            src={imgUrl}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=400&q=70';
                            }}
                          />
                          {/* Badge: Main photo */}
                          {imgIdx === 0 ? (
                            <span className="absolute top-1 start-1 bg-[#D94E28] text-white text-[9px] font-['Cairo'] font-bold px-1.5 py-0.5 rounded shadow-xs">
                              الرئيسية
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const current = [...(editingRoom.images || [])];
                                const selected = current.splice(imgIdx, 1)[0];
                                current.unshift(selected);
                                setEditingRoom({
                                  ...editingRoom,
                                  images: current,
                                  image_url: current[0],
                                });
                              }}
                              className="absolute top-1 start-1 bg-black/60 hover:bg-black text-white text-[9px] font-['Cairo'] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              تعيين كرئيسية
                            </button>
                          )}

                          {/* Delete photo button */}
                          <button
                            type="button"
                            onClick={() => {
                              const current = (editingRoom.images || []).filter((_, idx) => idx !== imgIdx);
                              setEditingRoom({
                                ...editingRoom,
                                images: current,
                                image_url: current[0] || null as any,
                              });
                            }}
                            className="absolute top-1 end-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-lg opacity-85 hover:opacity-100 transition-opacity shadow-xs"
                            title="حذف هذه الصورة"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-[#64748B] font-['Tajawal'] text-center py-2 italic">
                    لا توجد صور مخصصة لهذه الغرفة بعد. يمكنك رفع صورة أو أكثر الآن.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  ترتيب الظهور في الموقع (Display Order)
                </label>
                <input
                  type="number"
                  value={editingRoom.display_order || 1}
                  onChange={(e) => setEditingRoom({ ...editingRoom, display_order: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-sm font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#F1F5F9]">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#D94E28] text-white font-['Cairo'] font-bold text-sm hover:bg-[#C2411C] transition-colors"
                >
                  حفظ البيانات
                </button>
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="px-5 py-3 rounded-xl bg-[#F1F5F9] text-[#0F223D] font-['Cairo'] font-bold text-sm hover:bg-[#E2E8F0]"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT PACKAGE WITH RELIABLE NATIVE FILE PICKER */}
      {/* ======================================================== */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 bg-[#0F223D]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto border border-[#E2E8F0] shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
              <h3 className="font-['Cairo'] font-bold text-lg text-[#0F223D]">
                {editingPackage.id ? 'تعديل الباقة' : 'إضافة باقة جديدة'}
              </h3>
              <button
                onClick={() => setEditingPackage(null)}
                className="p-1 rounded-full text-[#64748B] hover:bg-[#F1F5F9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4">
              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  عنوان الباقة *
                </label>
                <input
                  type="text"
                  required
                  value={editingPackage.title}
                  onChange={(e) => setEditingPackage({ ...editingPackage, title: e.target.value })}
                  placeholder="باقة الهروب للسيناء - 3 ليالي"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-['Tajawal']"
                />
              </div>

              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  السعر (نص أو رقم) *
                </label>
                <input
                  type="text"
                  required
                  value={editingPackage.price}
                  onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value })}
                  placeholder="3,800 ج.م للفرد"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-['Cairo']"
                />
              </div>

              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  التصنيف (Category)
                </label>
                <input
                  type="text"
                  value={editingPackage.category || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, category: e.target.value })}
                  placeholder="إقامة كاملة / رومانسي / مغامرة"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-['Tajawal']"
                />
              </div>

              {/* Reliable Direct File Upload & URL */}
              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  صورة الباقة (رفع ملف مباشر لتخزين سوبابيز أو إدخال رابط)
                </label>

                {/* Hidden native file input triggered programmatically */}
                <input
                  ref={packageFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleDirectImageUpload(e, (url) => {
                      setEditingPackage({ ...editingPackage, image_url: url });
                    })
                  }
                />

                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={editingPackage.image_url}
                    onChange={(e) => setEditingPackage({ ...editingPackage, image_url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-sans"
                  />
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => packageFileRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-[#0F223D] hover:bg-[#1E3A5F] active:scale-95 text-white text-xs font-['Cairo'] font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-60"
                  >
                    {uploadingImage ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>جاري الرفع...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-[#D94E28]" />
                        <span>اختيار من الجهاز</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Immediate Image Preview */}
                {editingPackage.image_url && (
                  <div className="h-32 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E2E8F0] relative">
                    <img
                      src={editingPackage.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 end-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-['Cairo']">
                      معاينة الصورة
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  وصف الباقة *
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingPackage.description}
                  onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs font-['Tajawal']"
                ></textarea>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#F1F5F9]">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#D94E28] text-white font-['Cairo'] font-bold text-sm hover:bg-[#C2411C] transition-colors"
                >
                  حفظ الباقة
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="px-5 py-3 rounded-xl bg-[#F1F5F9] text-[#0F223D] font-['Cairo'] font-bold text-sm hover:bg-[#E2E8F0]"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT TRIP WITH RELIABLE NATIVE FILE PICKER */}
      {/* ======================================================== */}
      {editingTrip && (
        <div className="fixed inset-0 z-50 bg-[#0F223D]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto border border-[#E2E8F0] shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
              <h3 className="font-['Cairo'] font-bold text-lg text-[#0F223D]">
                {editingTrip.id ? 'تعديل الرحلة الخارجية' : 'إضافة رحلة جديدة'}
              </h3>
              <button
                onClick={() => setEditingTrip(null)}
                className="p-1 rounded-full text-[#64748B] hover:bg-[#F1F5F9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTrip} className="space-y-4">
              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  اسم ومسار الرحلة *
                </label>
                <input
                  type="text"
                  required
                  value={editingTrip.title}
                  onChange={(e) => setEditingTrip({ ...editingTrip, title: e.target.value })}
                  placeholder="رحلة وادي الوشواش"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-['Tajawal']"
                />
              </div>

              {/* Reliable Direct File Upload & URL */}
              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  صورة الرحلة (رفع ملف مباشر لتخزين سوبابيز أو إدخال رابط)
                </label>

                <input
                  ref={tripFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleDirectImageUpload(e, (url) => {
                      setEditingTrip({ ...editingTrip, image_url: url });
                    })
                  }
                />

                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={editingTrip.image_url}
                    onChange={(e) => setEditingTrip({ ...editingTrip, image_url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-sans"
                  />
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => tripFileRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-[#0F223D] hover:bg-[#1E3A5F] active:scale-95 text-white text-xs font-['Cairo'] font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-60"
                  >
                    {uploadingImage ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>جاري الرفع...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-[#D94E28]" />
                        <span>اختيار من الجهاز</span>
                      </>
                    )}
                  </button>
                </div>

                {editingTrip.image_url && (
                  <div className="h-32 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E2E8F0] relative">
                    <img src={editingTrip.image_url} alt="Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 end-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-['Cairo']">
                      معاينة الصورة
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  تفاصيل وبرنامج الرحلة *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editingTrip.description}
                  onChange={(e) => setEditingTrip({ ...editingTrip, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs font-['Tajawal']"
                ></textarea>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#F1F5F9]">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#0F223D] text-white font-['Cairo'] font-bold text-sm hover:bg-[#1E3A5F] transition-colors"
                >
                  حفظ الرحلة
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTrip(null)}
                  className="px-5 py-3 rounded-xl bg-[#F1F5F9] text-[#0F223D] font-['Cairo'] font-bold text-sm hover:bg-[#E2E8F0]"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT GALLERY WITH RELIABLE NATIVE FILE PICKER */}
      {/* ======================================================== */}
      {editingGallery && (
        <div className="fixed inset-0 z-50 bg-[#0F223D]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto border border-[#E2E8F0] shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
              <h3 className="font-['Cairo'] font-bold text-lg text-[#0F223D]">
                {editingGallery.id ? 'تعديل صورة المعرض' : 'إضافة صورة للمعرض'}
              </h3>
              <button
                onClick={() => setEditingGallery(null)}
                className="p-1 rounded-full text-[#64748B] hover:bg-[#F1F5F9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4">
              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  الصورة (رفع مباشر لتخزين سوبابيز أو إدخال رابط) *
                </label>

                <input
                  ref={galleryFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleDirectImageUpload(e, (url) => {
                      setEditingGallery({ ...editingGallery, image_url: url });
                    })
                  }
                />

                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    required
                    value={editingGallery.image_url}
                    onChange={(e) => setEditingGallery({ ...editingGallery, image_url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-sans"
                  />
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => galleryFileRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-[#D94E28] hover:bg-[#C2411C] active:scale-95 text-white text-xs font-['Cairo'] font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-60"
                  >
                    {uploadingImage ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>جاري الرفع...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>اختيار من الجهاز</span>
                      </>
                    )}
                  </button>
                </div>

                {editingGallery.image_url && (
                  <div className="h-40 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E2E8F0] relative">
                    <img src={editingGallery.image_url} alt="Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 end-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-['Cairo']">
                      معاينة الصورة
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  تعليق أو وصف الصورة (Caption)
                </label>
                <input
                  type="text"
                  value={editingGallery.caption || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, caption: e.target.value })}
                  placeholder="شروق الشمس الساحر فوق خليج العقبة"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs font-['Tajawal']"
                />
              </div>

              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  ترتيب العرض
                </label>
                <input
                  type="number"
                  value={editingGallery.display_order || 1}
                  onChange={(e) => setEditingGallery({ ...editingGallery, display_order: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#F1F5F9]">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#D94E28] text-white font-['Cairo'] font-bold text-sm hover:bg-[#C2411C] transition-colors"
                >
                  حفظ الصورة
                </button>
                <button
                  type="button"
                  onClick={() => setEditingGallery(null)}
                  className="px-5 py-3 rounded-xl bg-[#F1F5F9] text-[#0F223D] font-['Cairo'] font-bold text-sm hover:bg-[#E2E8F0]"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT SITE INFO */}
      {/* ======================================================== */}
      {editingSiteInfo && (
        <div className="fixed inset-0 z-50 bg-[#0F223D]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto border border-[#E2E8F0] shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
              <h3 className="font-['Cairo'] font-bold text-lg text-[#0F223D]">
                تعديل نص ومعلومات الموقع
              </h3>
              <button
                onClick={() => setEditingSiteInfo(null)}
                className="p-1 rounded-full text-[#64748B] hover:bg-[#F1F5F9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSiteInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  المفتاح (Key) *
                </label>
                <input
                  type="text"
                  required
                  value={editingSiteInfo.key}
                  onChange={(e) => setEditingSiteInfo({ ...editingSiteInfo, key: e.target.value })}
                  placeholder="phone, booking_step_1, pricing_note..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  القيمة / النص المعروض للزوار *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editingSiteInfo.value}
                  onChange={(e) => setEditingSiteInfo({ ...editingSiteInfo, value: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm font-['Tajawal']"
                ></textarea>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#F1F5F9]">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#D94E28] text-white font-['Cairo'] font-bold text-sm hover:bg-[#C2411C] transition-colors"
                >
                  حفظ التعديل
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSiteInfo(null)}
                  className="px-5 py-3 rounded-xl bg-[#F1F5F9] text-[#0F223D] font-['Cairo'] font-bold text-sm hover:bg-[#E2E8F0]"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
