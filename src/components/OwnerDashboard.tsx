import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { RoomPricing, PackageItem, TripItem, GalleryItem, SiteInfo, BookingRequest, Language, ItemPhoto } from '../types';
import { translations, translateRoomType, translatePackage, translateTrip, translateGalleryCaption } from '../lib/translations';
import { useLanguage } from '../lib/LanguageContext';
import { MultiPhotoUploader } from './MultiPhotoUploader';
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
  Globe,
  Facebook,
  Instagram,
  Share2,
} from 'lucide-react';

interface OwnerDashboardProps {
  onClose: () => void;
  onDataUpdated: () => void;
  lang?: Language;
  onToggleLang?: () => void;
  onSelectLang?: (lang: Language) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  onClose,
  onDataUpdated,
  lang: propLang,
  onToggleLang: propOnToggleLang,
  onSelectLang: propOnSelectLang,
}) => {
  const { lang: contextLang, setLang: contextSetLang, toggleLang: contextToggleLang } = useLanguage();
  const currentLang = propLang || contextLang || 'en';
  const t = translations[currentLang];
  const ta = t.admin;

  const translateOccupancy = (occ?: string) => {
    if (!occ) return '';
    if (currentLang === 'en') {
      if (occ === 'فردي' || occ.toLowerCase() === 'single') return 'Single';
      if (occ === 'مزدوج' || occ.toLowerCase() === 'double') return 'Double';
      if (occ === 'ثلاثي' || occ.toLowerCase() === 'triple') return 'Triple';
      if (occ === 'رباعي' || occ.toLowerCase() === 'quad') return 'Quad';
    }
    return occ;
  };

  const handleSelectLang = (newLang: Language) => {
    contextSetLang(newLang);
    if (propOnSelectLang) {
      propOnSelectLang(newLang);
    }
  };

  const handleToggleLang = () => {
    const next = currentLang === 'ar' ? 'en' : 'ar';
    contextSetLang(next);
    if (propOnSelectLang) {
      propOnSelectLang(next);
    } else if (propOnToggleLang) {
      propOnToggleLang();
    }
  };
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
  const [itemPhotos, setItemPhotos] = useState<ItemPhoto[]>([]);

  // Action status feedback
  const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Editing modals/states
  const [editingRoom, setEditingRoom] = useState<RoomPricing | null>(null);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);
  const [editingTrip, setEditingTrip] = useState<TripItem | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [editingSiteInfo, setEditingSiteInfo] = useState<SiteInfo | null>(null);

  // Social media links state (social_facebook_url, social_instagram_url, social_tiktok_url)
  const [socialFacebook, setSocialFacebook] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialTiktok, setSocialTiktok] = useState('');
  const [isSavingSocial, setIsSavingSocial] = useState(false);

  // Sync social inputs when siteInfoList changes
  useEffect(() => {
    const fbItem = siteInfoList.find((i) => i.key === 'social_facebook_url');
    const igItem = siteInfoList.find((i) => i.key === 'social_instagram_url');
    const ttItem = siteInfoList.find((i) => i.key === 'social_tiktok_url');

    setSocialFacebook(fbItem ? fbItem.value : (DEFAULT_SITE_INFO.social_facebook_url || ''));
    setSocialInstagram(igItem ? igItem.value : (DEFAULT_SITE_INFO.social_instagram_url || ''));
    setSocialTiktok(ttItem ? ttItem.value : (DEFAULT_SITE_INFO.social_tiktok_url || ''));
  }, [siteInfoList]);

  // Uploading state & file input refs
  const [uploadingImage, setUploadingImage] = useState(false);
  const packageFileRef = useRef<HTMLInputElement>(null);
  const tripFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);

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

  const showFeedback = (type: 'success' | 'error' | 'info', message: string) => {
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
        setAuthError(error.message || ta.loginErrorDefault);
      } else {
        setSession(data.session);
        fetchAllData();
        fetchBookingRequests();
      }
    } catch (err: any) {
      setAuthError(err.message || ta.errorPrefix);
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
      const [roomsRes, packagesRes, tripsRes, galleryRes, infoRes, photosRes] = await Promise.all([
        supabase.from('rooms_pricing').select('*').order('display_order', { ascending: true }),
        supabase.from('packages').select('*').order('display_order', { ascending: true }),
        supabase.from('trips').select('*').order('display_order', { ascending: true }),
        supabase.from('gallery').select('*').order('display_order', { ascending: true }),
        supabase.from('site_info').select('*'),
        supabase.from('item_photos').select('*').order('display_order', { ascending: true }),
      ]);

      if (roomsRes.data) setRooms(roomsRes.data);
      if (packagesRes.data) setPackages(packagesRes.data);
      if (tripsRes.data) setTrips(tripsRes.data);
      if (galleryRes.data) setGallery(galleryRes.data);
      if (infoRes.data) setSiteInfoList(infoRes.data);
      if (photosRes.data) setItemPhotos(photosRes.data);
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
        showFeedback(
          'success',
          currentLang === 'ar'
            ? `تم تأكيد حجز ${request.guest_name} بنجاح وحظر التواريخ على التقويم`
            : `Booking for ${request.guest_name} confirmed successfully and dates blocked on calendar`
        );
        setConfirmedReminderModal({ ...request, status: 'confirmed' });
      } else if (newStatus === 'cancelled') {
        showFeedback(
          'success',
          currentLang === 'ar'
            ? `تم إلغاء الحجز لـ ${request.guest_name} وإعادة إتاحة الغرفة على الموقع`
            : `Booking for ${request.guest_name} cancelled and dates reopened on the website`
        );
      } else {
        showFeedback(
          'success',
          currentLang === 'ar'
            ? `تمت إعادة الحجز لـ ${request.guest_name} إلى قيد الانتظار`
            : `Booking for ${request.guest_name} reset to pending`
        );
      }

      fetchBookingRequests();
    } catch (err: any) {
      showFeedback('error', `${ta.updateStatusError}: ${err.message}`);
    }
  };

  // Specific Action: Cancel Unpaid Booking & Prompt WhatsApp Notice
  const handleCancelUnpaidBooking = async (request: BookingRequest) => {
    if (!request.id) return;
    const confirmPrompt = window.confirm(
      currentLang === 'ar'
        ? `هل تريد بالتأكيد إلغاء حجز ${request.guest_name} لعدم تحويل الفلوس؟\n\nسيتم فوراً:\n1. تغيير حالة الحجز إلى "ملغي"\n2. إعادة فتح الغرفة والتواريخ فوراً على التقويم لجميع الزوار\n3. فتح رسالة واتساب جاهزة لإشعار النزيل بالإلغاء`
        : `Are you sure you want to cancel the booking for ${request.guest_name} due to unpaid deposit?\n\nThis will immediately:\n1. Change status to "cancelled"\n2. Reopen the dates on the website calendar\n3. Prepare a WhatsApp cancellation notice for the guest`
    );
    if (!confirmPrompt) return;

    try {
      const { error } = await supabase
        .from('booking_requests')
        .update({ status: 'cancelled' })
        .eq('id', request.id);

      if (error) throw error;

      showFeedback('success', ta.cancelledReopenedSuccess.replace('{name}', request.guest_name));
      fetchBookingRequests();
      // Open cancellation notice popup
      setCancellationNoticeModal(request);
    } catch (err: any) {
      showFeedback('error', `${ta.cancelError}: ${err.message}`);
    }
  };

  // Delete Booking permanently
  const handleDeleteBooking = async (request: BookingRequest) => {
    if (!request.id) return;
    const confirmDelete = window.confirm(
      currentLang === 'ar'
        ? `هل أنت متأكد من حذف سجل حجز ${request.guest_name} نهائياً من قاعدة البيانات؟`
        : `Are you sure you want to permanently delete the booking record for ${request.guest_name}?`
    );
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from('booking_requests').delete().eq('id', request.id);
      if (error) throw error;
      showFeedback('success', ta.deleteSuccess);
      fetchBookingRequests();
    } catch (err: any) {
      showFeedback('error', `${ta.deleteError}: ${err.message}`);
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
      showFeedback('error', ta.notAnImage);
      return;
    }

    // Validate max size 15MB
    if (file.size > 15 * 1024 * 1024) {
      showFeedback('error', ta.imageTooLarge);
      return;
    }

    try {
      setUploadingImage(true);

      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanFileName = `jazz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      const { data, error } = await supabase.storage.from('images').upload(cleanFileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

      if (error) {
        console.error('Storage bucket error:', error);
        showFeedback('error', `${ta.uploadBucketFailed}: ${error.message}`);
        return;
      }

      const { data: publicData } = supabase.storage.from('images').getPublicUrl(data.path);
      const publicUrl = publicData.publicUrl;

      onSuccess(publicUrl);
      showFeedback('success', ta.uploadSuccess);
    } catch (err: any) {
      console.error('Upload exception:', err);
      showFeedback('error', `${ta.uploadError}: ${err.message || ta.tryAgain}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Build copy-ready InstaPay message for confirmed booking
  const getInstaPayCopyText = (booking: BookingRequest) => {
    const halfDeposit = booking.total_price ? Math.round(booking.total_price * 0.5) : 0;
    if (currentLang === 'en') {
      return `Dear ${booking.guest_name},
We are pleased to inform you that your booking request at Jazz Camp — Ras Shitan, Nuweiba has been accepted!

Booking Details:
• Accommodation / Package: ${booking.reference_name}
${booking.occupancy ? `• Occupancy: ${booking.occupancy}\n` : ''}• Check-in: ${booking.check_in}
• Check-out: ${booking.check_out}
• Guests: ${booking.guests_count}
• Total: ${booking.total_price ? `${booking.total_price.toLocaleString()} EGP` : 'As agreed'}

To secure your reservation, please transfer a 50% deposit (${halfDeposit > 0 ? `${halfDeposit.toLocaleString()} EGP` : 'Agreed amount'}):
InstaPay Transfer Details:
• Account / Wallet Number: 01009124513
• Registered Name: Gamal Abdalla Azmy Saafan

Please send a screenshot of the transfer receipt once completed. We look forward to welcoming you to Sinai!`;
    }
    return `مرحباً أستاذ/ة ${booking.guest_name}،
يسعدنا إبلاغك بأنه تم تأكيد قبول طلب حجزك في «جاز كامب — رأس شيطان، نويبع»!

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
    if (currentLang === 'en') {
      return `Dear ${booking.guest_name},
Please note that due to not receiving the deposit payment (InstaPay) for your booking of ${booking.reference_name} from (${booking.check_in} to ${booking.check_out}), the booking request has been cancelled and dates reopened.

We hope to welcome you at Jazz Camp — Ras Shitan in the future!
For contact & inquiries: 01061189414`;
    }
    return `مرحباً أستاذ/ة ${booking.guest_name}،
نحيطكم علماً بأنه نظراً لعدم استلام إشعار تحويل العربون (إنستاباي) لحجز ${booking.reference_name} للفترة من (${booking.check_in} إلى ${booking.check_out})، فقد تم إلغاء طلب الحجز وإعادة إتاحة الغرفة فوراً على الموقع لنزلاء آخرين.

نتطلع لاستضافتكم في جاز كامب — رأس شيطان في أوقات قادمة!
للتواصل والاستفسار: 01061189414`;
  };

  // Filtered booking requests list
  const filteredRequests = bookingRequests.filter((r) => {
    if (requestFilter === 'all') return true;
    return r.status === requestFilter;
  });

  // SEED INITIAL DATA
  const handleSeedInitialData = async () => {
    if (!window.confirm(ta.seedConfirm)) return;
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
      showFeedback('success', ta.seedSuccess);
    } catch (err: any) {
      showFeedback('error', `${ta.errorPrefix}: ${err.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  // ROOMS CRUD
  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    try {
      const payload = {
        room_type: editingRoom.room_type,
        single_price: editingRoom.single_price ? Number(editingRoom.single_price) : null,
        double_price: editingRoom.double_price ? Number(editingRoom.double_price) : null,
        triple_price: editingRoom.triple_price ? Number(editingRoom.triple_price) : null,
        quadruple_price: editingRoom.quadruple_price ? Number(editingRoom.quadruple_price) : null,
        display_order: editingRoom.display_order ? Number(editingRoom.display_order) : 1,
        total_units: editingRoom.total_units ? Number(editingRoom.total_units) : 6,
      };

      if (editingRoom.id) {
        const { error } = await supabase.from('rooms_pricing').update(payload).eq('id', editingRoom.id);
        if (error) throw error;
        showFeedback('success', ta.roomUpdateSuccess);
      } else {
        const { error } = await supabase.from('rooms_pricing').insert([payload]);
        if (error) throw error;
        showFeedback('success', ta.roomAddSuccess);
      }

      // If photos were uploaded using a temporary draft key, link them to the real room_type
      if (editingRoom.temp_key && editingRoom.room_type) {
        await supabase
          .from('item_photos')
          .update({ item_key: payload.room_type })
          .eq('item_type', 'room')
          .eq('item_key', editingRoom.temp_key);
      }

      setEditingRoom(null);
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', `${ta.errorPrefix}: ${err.message}`);
    }
  };

  const handleDeleteRoom = async (id?: string | number) => {
    if (!id || !window.confirm(ta.roomDeleteConfirm)) return;
    try {
      const { error } = await supabase.from('rooms_pricing').delete().eq('id', id);
      if (error) throw error;
      showFeedback('success', ta.roomDeleteSuccess);
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', `${ta.errorPrefix}: ${err.message}`);
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
        showFeedback('success', ta.packageUpdateSuccess);
      } else {
        const { error } = await supabase.from('packages').insert([payload]);
        if (error) throw error;
        showFeedback('success', ta.packageAddSuccess);
      }

      if (editingPackage.temp_key && editingPackage.title) {
        await supabase
          .from('item_photos')
          .update({ item_key: payload.title })
          .eq('item_type', 'package')
          .eq('item_key', editingPackage.temp_key);
      }

      setEditingPackage(null);
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', `${ta.errorPrefix}: ${err.message}`);
    }
  };

  const handleDeletePackage = async (id?: string | number) => {
    if (!id || !window.confirm(ta.packageDeleteConfirm)) return;
    try {
      const { error } = await supabase.from('packages').delete().eq('id', id);
      if (error) throw error;
      showFeedback('success', ta.packageDeleteSuccess);
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', `${ta.errorPrefix}: ${err.message}`);
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
        showFeedback('success', ta.tripUpdateSuccess);
      } else {
        const { error } = await supabase.from('trips').insert([payload]);
        if (error) throw error;
        showFeedback('success', ta.tripAddSuccess);
      }

      if (editingTrip.temp_key && editingTrip.title) {
        await supabase
          .from('item_photos')
          .update({ item_key: payload.title })
          .eq('item_type', 'trip')
          .eq('item_key', editingTrip.temp_key);
      }

      setEditingTrip(null);
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', `${ta.errorPrefix}: ${err.message}`);
    }
  };

  const handleDeleteTrip = async (id?: string | number) => {
    if (!id || !window.confirm(ta.tripDeleteConfirm)) return;
    try {
      const { error } = await supabase.from('trips').delete().eq('id', id);
      if (error) throw error;
      showFeedback('success', ta.tripDeleteSuccess);
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', `${ta.errorPrefix}: ${err.message}`);
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
        showFeedback('success', ta.galleryUpdateSuccess);
      } else {
        const { error } = await supabase.from('gallery').insert([payload]);
        if (error) throw error;
        showFeedback('success', ta.galleryAddSuccess);
      }
      setEditingGallery(null);
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', `${ta.errorPrefix}: ${err.message}`);
    }
  };

  const handleDeleteGallery = async (id?: string | number) => {
    if (!id || !window.confirm(ta.galleryDeleteConfirm)) return;
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
      showFeedback('success', ta.galleryDeleteSuccess);
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', `${ta.errorPrefix}: ${err.message}`);
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
      showFeedback('success', ta.editInfoSuccess);
      setEditingSiteInfo(null);
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', `${ta.errorPrefix}: ${err.message}`);
    }
  };

  // SAVE SOCIAL MEDIA LINKS
  const handleSaveSocialLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSocial(true);
    try {
      const updates = [
        { key: 'social_facebook_url', value: socialFacebook.trim() },
        { key: 'social_instagram_url', value: socialInstagram.trim() },
        { key: 'social_tiktok_url', value: socialTiktok.trim() },
      ];

      const { error } = await supabase
        .from('site_info')
        .upsert(updates, { onConflict: 'key' });

      if (error) throw error;
      showFeedback('success', ta.socialLinksSuccess || (currentLang === 'ar' ? 'تم تحديث روابط التواصل الاجتماعي بنجاح!' : 'Social media links updated successfully!'));
      await fetchAllData();
    } catch (err: any) {
      showFeedback('error', `${ta.errorPrefix}: ${err.message}`);
    } finally {
      setIsSavingSocial(false);
    }
  };

  // If loading session
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F223D] text-white flex items-center justify-center p-4">
        <div className="flex items-center gap-3 font-['Cairo'] text-lg">
          <RefreshCw className="w-6 h-6 animate-spin text-[#D94E28]" />
          <span>{currentLang === 'ar' ? 'جاري التحقق من الصلاحيات...' : 'Verifying credentials...'}</span>
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
              <img src="/logo-emblem.svg" alt="Jazz Camp" className="w-full h-full object-contain" />
            </div>
            <h1 className="font-['Cairo'] font-black text-2xl text-[#0F223D]">
              {ta.loginTitle}
            </h1>
            <p className="font-['Tajawal'] text-xs sm:text-sm text-[#64748B] mt-1">
              {ta.loginSubtitle}
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
                {ta.emailLabel}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@jazzcamp.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0F223D] focus:outline-none text-sm font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                {ta.passwordLabel}
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
                  <span>{ta.loggingIn}</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>{ta.loginButton}</span>
                </>
              )}
            </button>
          </form>

          {/* Language Switch & Back to public site */}
          <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
            <button
              onClick={handleToggleLang}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#CBD5E1] bg-[#FAF8F5] text-xs font-['Cairo'] font-bold text-[#0F223D] hover:bg-[#F1F5F9] transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#D94E28]" />
              <span>{currentLang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            <button
              onClick={onClose}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-['Cairo'] font-semibold text-[#64748B] hover:text-[#0F223D] transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>{ta.backToSite}</span>
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
              <img src="/logo-emblem.svg" alt="Jazz Camp" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-['Cairo'] font-black text-lg text-[#0F223D] leading-none">
                  {ta.dashboardTitle}
                </h1>
                {pendingCount > 0 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D94E28] text-white text-[11px] font-['Cairo'] font-bold animate-pulse">
                    <Bell className="w-3 h-3" />
                    <span>{pendingCount} {ta.newCount}</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] font-['Tajawal'] text-[#64748B]">
                {ta.account}: {session.user?.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleLang}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-xs font-['Cairo'] font-bold text-[#0F223D] hover:bg-[#E2E8F0] transition-colors"
              title={currentLang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Globe className="w-3.5 h-3.5 text-[#D94E28]" />
              <span>{currentLang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-xs font-['Cairo'] font-bold text-[#0F223D] hover:bg-[#E2E8F0] transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#D94E28]" />
              <span>{ta.viewSite}</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FEE2E2] text-[#991B1B] text-xs font-['Cairo'] font-bold hover:bg-[#FCA5A5] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{ta.logout}</span>
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
            <span>{ta.tabRequests}</span>
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
            <span>{ta.tabRooms} ({rooms.length})</span>
          </button>

          {/* 3. PACKAGES */}
          <button
            onClick={() => setActiveTab('packages')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-['Cairo'] font-bold whitespace-nowrap transition-colors ${
              activeTab === 'packages' ? 'bg-[#0F223D] text-white shadow-sm' : 'text-[#475569] hover:bg-[#F1F5F9]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{ta.tabPackages} ({packages.length})</span>
          </button>

          {/* 4. TRIPS */}
          <button
            onClick={() => setActiveTab('trips')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-['Cairo'] font-bold whitespace-nowrap transition-colors ${
              activeTab === 'trips' ? 'bg-[#0F223D] text-white shadow-sm' : 'text-[#475569] hover:bg-[#F1F5F9]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{ta.tabTrips} ({trips.length})</span>
          </button>

          {/* 5. GALLERY */}
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-['Cairo'] font-bold whitespace-nowrap transition-colors ${
              activeTab === 'gallery' ? 'bg-[#0F223D] text-white shadow-sm' : 'text-[#475569] hover:bg-[#F1F5F9]'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>{ta.tabGallery} ({gallery.length})</span>
          </button>

          {/* 6. SITE INFO */}
          <button
            onClick={() => setActiveTab('site_info')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-['Cairo'] font-bold whitespace-nowrap transition-colors ${
              activeTab === 'site_info' ? 'bg-[#0F223D] text-white shadow-sm' : 'text-[#475569] hover:bg-[#F1F5F9]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{ta.tabSiteInfo}</span>
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
                  <span>{ta.requestsTitle}</span>
                  {pendingCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D94E28] text-white text-xs font-bold">
                      {pendingCount} {ta.pendingBadge}
                    </span>
                  )}
                </h2>
                <p className="font-['Tajawal'] text-xs text-[#64748B]">
                  {ta.requestsDesc}
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
                  {ta.filterPending} ({bookingRequests.filter((r) => r.status === 'pending').length})
                </button>
                <button
                  onClick={() => setRequestFilter('confirmed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-['Cairo'] font-bold transition-all ${
                    requestFilter === 'confirmed'
                      ? 'bg-white text-[#15803D] shadow-sm'
                      : 'text-[#475569] hover:text-[#0F223D]'
                  }`}
                >
                  {ta.filterConfirmed} ({bookingRequests.filter((r) => r.status === 'confirmed').length})
                </button>
                <button
                  onClick={() => setRequestFilter('cancelled')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-['Cairo'] font-bold transition-all ${
                    requestFilter === 'cancelled'
                      ? 'bg-white text-[#991B1B] shadow-sm'
                      : 'text-[#475569] hover:text-[#0F223D]'
                  }`}
                >
                  {ta.filterCancelled} ({bookingRequests.filter((r) => r.status === 'cancelled').length})
                </button>
                <button
                  onClick={() => setRequestFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-['Cairo'] font-bold transition-all ${
                    requestFilter === 'all'
                      ? 'bg-white text-[#0F223D] shadow-sm'
                      : 'text-[#475569] hover:text-[#0F223D]'
                  }`}
                >
                  {ta.filterAll} ({bookingRequests.length})
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
                  {ta.noRequests}
                </h3>
                <p className="font-['Tajawal'] text-xs text-[#64748B]">
                  {ta.noRequestsDesc}
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
                                ? new Date(req.created_at).toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-US', {
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
                              ? ta.statusPending
                              : isConfirmed
                              ? ta.statusConfirmed
                              : ta.statusCancelled}
                          </span>
                        </div>

                        {/* Booking Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-['Cairo'] mb-3">
                          <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2E8F0]">
                            <span className="text-[#64748B] block text-[10px]">{ta.requestTypeLabel}:</span>
                            <span className="font-bold text-[#0F223D] truncate block">
                              {translateRoomType(req.reference_name, currentLang)}
                            </span>
                          </div>

                          {req.occupancy && (
                            <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2E8F0]">
                              <span className="text-[#64748B] block text-[10px]">{ta.occupancyLabel}:</span>
                              <span className="font-bold text-[#D94E28]">{translateOccupancy(req.occupancy)}</span>
                            </div>
                          )}

                          <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2E8F0]">
                            <span className="text-[#64748B] block text-[10px]">{ta.guestsLabel}:</span>
                            <span className="font-bold text-[#0F223D]">{req.guests_count} {ta.guestsUnit}</span>
                          </div>

                          <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2E8F0]">
                            <span className="text-[#64748B] block text-[10px]">{ta.checkInLabel}:</span>
                            <span className="font-bold text-[#0F223D]">{req.check_in}</span>
                          </div>

                          <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2E8F0]">
                            <span className="text-[#64748B] block text-[10px]">{ta.checkOutLabel}:</span>
                            <span className="font-bold text-[#0F223D]">{req.check_out}</span>
                          </div>

                          <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2E8F0]">
                            <span className="text-[#64748B] block text-[10px]">{ta.totalPriceLabel}:</span>
                            <span className="font-black text-[#D94E28]">
                              {req.total_price ? `${req.total_price.toLocaleString()} ${t.common.currency}` : '—'}
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
                            <span>{ta.waChat}</span>
                          </a>
                        </div>

                        {req.notes && (
                          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2E8F0] text-xs font-['Tajawal'] text-[#475569] mb-3">
                            <span className="font-bold block text-[10px] text-[#64748B]">{ta.notesLabel}:</span>
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
                              <span>{ta.confirmBtn}</span>
                            </button>
                            <button
                              onClick={() => handleCancelUnpaidBooking(req)}
                              className="py-2.5 px-3.5 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] text-[#991B1B] font-['Cairo'] font-bold text-xs transition-colors flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>{ta.cancelUnpaidQuick}</span>
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
                              <span>{ta.copyInstaPayBtn}</span>
                            </button>
                            <button
                              onClick={() => handleCancelUnpaidBooking(req)}
                              className="py-2 px-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] hover:bg-[#FEE2E2] text-[#DC2626] font-['Cairo'] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                              title={ta.cancelForNonPayment}
                            >
                              <X className="w-4 h-4 text-[#DC2626]" />
                              <span>{ta.cancelForNonPayment}</span>
                            </button>
                          </div>
                        )}

                        {isCancelled && (
                          <div className="flex items-center justify-between gap-2">
                            <button
                              onClick={() => handleUpdateBookingStatus(req, 'pending')}
                              className="py-1.5 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#E2E8F0] text-[#0F223D] font-['Cairo'] font-bold text-xs transition-colors"
                            >
                              {ta.resetPending}
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(req)}
                              className="py-1.5 px-3 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] text-[#991B1B] font-['Cairo'] font-bold text-xs flex items-center gap-1 transition-colors"
                              title={ta.deleteRecord}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{ta.deleteRecord}</span>
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
                  {ta.roomsTitle}
                </h2>
                <p className="font-['Tajawal'] text-xs text-[#64748B]">
                  {ta.roomsSubtitle}
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingRoom({
                    room_type: '',
                    temp_key: `room_${Date.now()}`,
                    single_price: '',
                    double_price: '',
                    triple_price: '',
                    quadruple_price: '',
                    display_order: rooms.length + 1,
                    total_units: 6,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D94E28] text-white font-['Cairo'] font-bold text-xs hover:bg-[#C2411C] transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{ta.addNewRoom}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-['Cairo'] font-bold text-base text-[#0F223D]">
                        {translateRoomType(room.room_type, currentLang)}
                      </h3>
                      <span className="text-[10px] font-['Cairo'] font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#64748B]">
                        {ta.order}: {room.display_order}
                      </span>
                    </div>

                    <div className="bg-[#FAF8F5] p-2 rounded-lg flex items-center justify-between border border-[#E2E8F0] mb-3 text-xs font-['Cairo']">
                      <span className="text-[#64748B] text-[11px] font-['Tajawal']">{ta.totalCampRooms}</span>
                      <span className="font-bold text-[#0F223D] bg-white px-2 py-0.5 rounded border border-[#CBD5E1]">
                        {room.total_units || 6} {ta.unitsWord}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-['Cairo'] mb-4">
                      <div className="bg-[#FAF8F5] p-2 rounded-lg">
                        <span className="text-[#64748B] block text-[10px]">{ta.singlePriceLabel}</span>
                        <span className="font-bold text-[#0F223D]">{room.single_price ? `${room.single_price} ${t.common.currency}` : '—'}</span>
                      </div>
                      <div className="bg-[#FAF8F5] p-2 rounded-lg">
                        <span className="text-[#64748B] block text-[10px]">{ta.doublePriceLabel}</span>
                        <span className="font-bold text-[#D94E28]">{room.double_price ? `${room.double_price} ${t.common.currency}` : '—'}</span>
                      </div>
                      <div className="bg-[#FAF8F5] p-2 rounded-lg">
                        <span className="text-[#64748B] block text-[10px]">{ta.triplePriceLabel}</span>
                        <span className="font-bold text-[#0F223D]">{room.triple_price ? `${room.triple_price} ${t.common.currency}` : '—'}</span>
                      </div>
                      <div className="bg-[#FAF8F5] p-2 rounded-lg">
                        <span className="text-[#64748B] block text-[10px]">{ta.quadPriceLabel}</span>
                        <span className="font-bold text-[#0F223D]">{room.quadruple_price ? `${room.quadruple_price} ${t.common.currency}` : '—'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-[#F1F5F9]">
                    <button
                      onClick={() => setEditingRoom(room)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#E2E8F0] text-[#0F223D] font-['Cairo'] font-bold text-xs transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#D94E28]" />
                      <span>{ta.editPrices}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="p-2 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] text-[#991B1B] transition-colors"
                      title={ta.delete}
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
        {/* TAB 3: PACKAGES WITH FIXED DIRECT IMAGE UPLOADER */}
        {/* ======================================================== */}
        {activeTab === 'packages' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-['Cairo'] font-bold text-lg text-[#0F223D]">
                  {ta.packagesTitle}
                </h2>
                <p className="font-['Tajawal'] text-xs text-[#64748B]">
                  {ta.packagesSubtitle}
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingPackage({
                    title: '',
                    temp_key: `package_${Date.now()}`,
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
                <span>{ta.addNewPackage}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages.map((pkg) => {
                const transPkg = translatePackage(pkg, currentLang);
                return (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="h-40 bg-[#E2E8F0] relative overflow-hidden">
                      {pkg.image_url ? (
                        <img src={pkg.image_url} alt={transPkg.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-[#64748B]">
                          {ta.noImage}
                        </div>
                      )}
                      {transPkg.category && (
                        <span className="absolute top-2 end-2 bg-[#D94E28] text-white text-[10px] font-['Cairo'] font-bold px-2 py-0.5 rounded-full">
                          {transPkg.category}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-['Cairo'] font-bold text-base text-[#0F223D]">{transPkg.title}</h3>
                        <span className="font-['Cairo'] font-extrabold text-sm text-[#D94E28]">{transPkg.price}</span>
                      </div>
                      <p className="font-['Tajawal'] text-xs text-[#64748B] line-clamp-2">{transPkg.description}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => setEditingPackage(pkg)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#E2E8F0] text-[#0F223D] font-['Cairo'] font-bold text-xs transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#D94E28]" />
                      <span>{ta.edit}</span>
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-2 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] text-[#991B1B] transition-colors"
                      title={ta.delete}
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
        {/* TAB 4: TRIPS WITH FIXED DIRECT IMAGE UPLOADER */}
        {/* ======================================================== */}
        {activeTab === 'trips' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-['Cairo'] font-bold text-lg text-[#0F223D]">
                  {ta.tripsTitle}
                </h2>
                <p className="font-['Tajawal'] text-xs text-[#64748B]">
                  {ta.tripsSubtitle}
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingTrip({
                    title: '',
                    temp_key: `trip_${Date.now()}`,
                    description: '',
                    image_url: '',
                    is_active: true,
                    display_order: trips.length + 1,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F223D] text-white font-['Cairo'] font-bold text-xs hover:bg-[#1E3A5F] transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{ta.addNewTrip}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trips.map((trip) => {
                const transTrip = translateTrip(trip, currentLang);
                return (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row justify-between"
                >
                  <div className="w-full sm:w-1/3 h-36 sm:h-auto bg-[#E2E8F0]">
                    {trip.image_url ? (
                      <img src={trip.image_url} alt={transTrip.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-[#64748B]">
                        {ta.noImage}
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-['Cairo'] font-bold text-base text-[#0F223D] mb-1">{transTrip.title}</h3>
                      <p className="font-['Tajawal'] text-xs text-[#64748B] line-clamp-3">{transTrip.description}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-3 mt-3 border-t border-[#F1F5F9]">
                      <button
                        onClick={() => setEditingTrip(trip)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#E2E8F0] text-[#0F223D] font-['Cairo'] font-bold text-xs transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#0F223D]" />
                        <span>{ta.edit}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="p-1.5 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] text-[#991B1B] transition-colors"
                        title={ta.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
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
                  {ta.galleryTitle}
                </h2>
                <p className="font-['Tajawal'] text-xs text-[#64748B]">
                  {ta.gallerySubtitle}
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
                <span>{ta.uploadNewImage}</span>
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
                      {item.caption ? translateGalleryCaption(item.caption, currentLang) : ta.noCaption}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingGallery(item)}
                        className="flex-1 py-1 rounded-lg bg-[#FAF8F5] text-[#0F223D] text-[10px] font-['Cairo'] font-bold hover:bg-[#E2E8F0]"
                      >
                        {ta.edit}
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
            {/* Social Media Links Section */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-sm mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#FFF7ED] flex items-center justify-center text-[#D94E28]">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-['Cairo'] font-bold text-base text-[#0F223D]">
                    {ta.socialLinksTitle || (currentLang === 'ar' ? 'روابط وسائل التواصل الاجتماعي' : 'Social Media Links')}
                  </h3>
                  <p className="font-['Tajawal'] text-xs text-[#64748B]">
                    {ta.socialLinksSubtitle || (currentLang === 'ar' ? 'إدارة روابط فيسبوك وإنستغرام وتيك توك المعروضة في أسفل الموقع' : 'Manage Facebook, Instagram, and TikTok links displayed in the footer')}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveSocialLinks} className="space-y-4 pt-3 border-t border-[#F1F5F9]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Facebook URL */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1.5">
                      <span className="w-5 h-5 rounded-md bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center">
                        <Facebook className="w-3.5 h-3.5" />
                      </span>
                      <span>{ta.facebookUrlLabel || (currentLang === 'ar' ? 'فيسبوك (Facebook URL)' : 'Facebook URL')}</span>
                    </label>
                    <input
                      type="text"
                      value={socialFacebook}
                      onChange={(e) => setSocialFacebook(e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm font-['Tajawal'] focus:outline-none focus:ring-2 focus:ring-[#D94E28]/20 focus:border-[#D94E28] transition-all"
                    />
                    <span className="block text-[11px] font-['Tajawal'] text-[#94A3B8] mt-1">
                      {currentLang === 'ar' ? 'مفتاح: social_facebook_url' : 'Key: social_facebook_url'}
                    </span>
                  </div>

                  {/* Instagram URL */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1.5">
                      <span className="w-5 h-5 rounded-md bg-[#C13584]/10 text-[#C13584] flex items-center justify-center">
                        <Instagram className="w-3.5 h-3.5" />
                      </span>
                      <span>{ta.instagramUrlLabel || (currentLang === 'ar' ? 'إنستغرام (Instagram URL)' : 'Instagram URL')}</span>
                    </label>
                    <input
                      type="text"
                      value={socialInstagram}
                      onChange={(e) => setSocialInstagram(e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm font-['Tajawal'] focus:outline-none focus:ring-2 focus:ring-[#D94E28]/20 focus:border-[#D94E28] transition-all"
                    />
                    <span className="block text-[11px] font-['Tajawal'] text-[#94A3B8] mt-1">
                      {currentLang === 'ar' ? 'مفتاح: social_instagram_url' : 'Key: social_instagram_url'}
                    </span>
                  </div>

                  {/* TikTok URL */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1.5">
                      <span className="w-5 h-5 rounded-md bg-black/10 text-[#0F223D] flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.46V11.8a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-3.04-1.23z" />
                        </svg>
                      </span>
                      <span>{ta.tiktokUrlLabel || (currentLang === 'ar' ? 'تيك توك (TikTok URL)' : 'TikTok URL')}</span>
                    </label>
                    <input
                      type="text"
                      value={socialTiktok}
                      onChange={(e) => setSocialTiktok(e.target.value)}
                      placeholder="https://www.tiktok.com/@..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm font-['Tajawal'] focus:outline-none focus:ring-2 focus:ring-[#D94E28]/20 focus:border-[#D94E28] transition-all"
                    />
                    <span className="block text-[11px] font-['Tajawal'] text-[#94A3B8] mt-1">
                      {currentLang === 'ar' ? 'مفتاح: social_tiktok_url (فارغ = لا تظهر أيقونة)' : 'Key: social_tiktok_url (empty = no icon)'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSavingSocial}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D94E28] text-white font-['Cairo'] font-bold text-xs sm:text-sm hover:bg-[#C2411C] active:scale-[0.98] transition-all shadow-sm disabled:opacity-50"
                  >
                    {isSavingSocial ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>
                      {isSavingSocial
                        ? (ta.savingSocialLinks || (currentLang === 'ar' ? 'جاري الحفظ...' : 'Saving...'))
                        : (ta.saveSocialLinks || (currentLang === 'ar' ? 'حفظ روابط التواصل' : 'Save Social Media Links'))}
                    </span>
                  </button>
                </div>
              </form>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-['Cairo'] font-bold text-lg text-[#0F223D]">
                  {ta.siteInfoTitle}
                </h2>
                <p className="font-['Tajawal'] text-xs text-[#64748B]">
                  {ta.siteInfoSubtitle}
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
                <span>{ta.addNewInfo}</span>
              </button>
            </div>

            <div className="space-y-3">
              {siteInfoList
                .filter((info) => info.key !== 'instagram' && info.key !== 'facebook' && !info.key.startsWith('http'))
                .map((info) => (
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
                    <span>{ta.edit}</span>
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
                  {ta.instaPayModalTitle}
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
              {ta.instaPayModalDesc}
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
                <span>{copiedInstaPay ? ta.copiedToClipboard : ta.copyFullMessage}</span>
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
                <span>{ta.sendViaWhatsApp}</span>
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
                  {ta.cancellationModalTitle}
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
              {ta.cancellationModalDesc}
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
                <span>{copiedCancellation ? ta.copiedToClipboard : ta.copyFullMessage}</span>
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
                <span>{ta.sendGuestWhatsApp}</span>
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
                {editingRoom.id ? ta.editRoomTitle : ta.createRoomTitle}
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
                  {ta.roomNameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={editingRoom.room_type}
                  onChange={(e) => setEditingRoom({ ...editingRoom, room_type: e.target.value })}
                  placeholder={ta.roomNamePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-['Tajawal']"
                />
              </div>

              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  {ta.capacityLabel}
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
                  {ta.capacityHint}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                    {ta.roomSinglePrice}
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
                    {ta.roomDoublePrice}
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
                    {ta.roomTriplePrice}
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
                    {ta.roomQuadPrice}
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

              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  {ta.displayOrderLabel}
                </label>
                <input
                  type="number"
                  value={editingRoom.display_order || 1}
                  onChange={(e) => setEditingRoom({ ...editingRoom, display_order: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-sm font-mono"
                />
              </div>

              {/* Multi-Photo Uploader Section for Room */}
              <div className="pt-2">
                <MultiPhotoUploader
                  itemType="room"
                  itemKey={editingRoom.room_type || editingRoom.temp_key || (editingRoom.id ? String(editingRoom.id) : '')}
                  itemTitle={editingRoom.room_type}
                  currentPhotos={itemPhotos.filter((p) => {
                    if (p.item_type !== 'room') return false;
                    const keys = [
                      editingRoom.room_type,
                      editingRoom.temp_key,
                      editingRoom.id ? String(editingRoom.id) : undefined,
                    ].filter(Boolean);
                    return keys.includes(p.item_key);
                  })}
                  onPhotosChange={(updatedPhotos) => {
                    const currentKeys = [
                      editingRoom.room_type,
                      editingRoom.temp_key,
                      editingRoom.id ? String(editingRoom.id) : undefined,
                    ].filter(Boolean);
                    const remainingPhotos = itemPhotos.filter(
                      (p) => !(p.item_type === 'room' && currentKeys.includes(p.item_key))
                    );
                    setItemPhotos([...remainingPhotos, ...updatedPhotos]);
                    onDataUpdated();
                  }}
                  onKeyAssigned={(generatedKey) => {
                    if (!editingRoom.temp_key && !editingRoom.room_type) {
                      setEditingRoom((prev) => prev ? { ...prev, temp_key: generatedKey } : null);
                    }
                  }}
                  lang={currentLang}
                  showFeedback={showFeedback}
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#F1F5F9]">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#D94E28] text-white font-['Cairo'] font-bold text-sm hover:bg-[#C2411C] transition-colors"
                >
                  {ta.saveData}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="px-5 py-3 rounded-xl bg-[#F1F5F9] text-[#0F223D] font-['Cairo'] font-bold text-sm hover:bg-[#E2E8F0]"
                >
                  {ta.cancel}
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
                {editingPackage.id ? ta.editPackageTitle : ta.createPackageTitle}
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
                  {ta.packageTitleLabel}
                </label>
                <input
                  type="text"
                  required
                  value={editingPackage.title}
                  onChange={(e) => setEditingPackage({ ...editingPackage, title: e.target.value })}
                  placeholder={ta.packageTitlePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-['Tajawal']"
                />
              </div>

              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  {ta.packagePriceLabel}
                </label>
                <input
                  type="text"
                  required
                  value={editingPackage.price}
                  onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value })}
                  placeholder={ta.packagePricePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-['Cairo']"
                />
              </div>

              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  {ta.packageCategoryLabel}
                </label>
                <input
                  type="text"
                  value={editingPackage.category || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, category: e.target.value })}
                  placeholder={ta.packageCategoryPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-['Tajawal']"
                />
              </div>

              {/* Reliable Direct File Upload & URL */}
              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  {ta.packageImageLabel}
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
                        <span>{ta.uploading}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-[#D94E28]" />
                        <span>{ta.chooseFromDevice}</span>
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
                      {ta.imagePreview}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  {ta.packageDescLabel}
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingPackage.description}
                  onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs font-['Tajawal']"
                ></textarea>
              </div>

              {/* Multi-Photo Uploader Section for Package */}
              <div className="pt-2">
                <MultiPhotoUploader
                  itemType="package"
                  itemKey={editingPackage.title || editingPackage.temp_key || (editingPackage.id ? String(editingPackage.id) : '')}
                  itemTitle={editingPackage.title}
                  currentPhotos={itemPhotos.filter((p) => {
                    if (p.item_type !== 'package') return false;
                    const keys = [
                      editingPackage.title,
                      editingPackage.temp_key,
                      editingPackage.id ? String(editingPackage.id) : undefined,
                    ].filter(Boolean);
                    return keys.includes(p.item_key);
                  })}
                  onPhotosChange={(updatedPhotos) => {
                    const currentKeys = [
                      editingPackage.title,
                      editingPackage.temp_key,
                      editingPackage.id ? String(editingPackage.id) : undefined,
                    ].filter(Boolean);
                    const remainingPhotos = itemPhotos.filter(
                      (p) => !(p.item_type === 'package' && currentKeys.includes(p.item_key))
                    );
                    setItemPhotos([...remainingPhotos, ...updatedPhotos]);
                    if (updatedPhotos.length > 0 && !editingPackage.image_url) {
                      setEditingPackage((prev) => prev ? { ...prev, image_url: updatedPhotos[0].image_url } : null);
                    }
                    onDataUpdated();
                  }}
                  onKeyAssigned={(generatedKey) => {
                    if (!editingPackage.temp_key && !editingPackage.title) {
                      setEditingPackage((prev) => prev ? { ...prev, temp_key: generatedKey } : null);
                    }
                  }}
                  lang={currentLang}
                  showFeedback={showFeedback}
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#F1F5F9]">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#D94E28] text-white font-['Cairo'] font-bold text-sm hover:bg-[#C2411C] transition-colors"
                >
                  {ta.savePackage}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="px-5 py-3 rounded-xl bg-[#F1F5F9] text-[#0F223D] font-['Cairo'] font-bold text-sm hover:bg-[#E2E8F0]"
                >
                  {ta.cancel}
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
                {editingTrip.id ? ta.editTripTitle : ta.createTripTitle}
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
                  {ta.tripNameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={editingTrip.title}
                  onChange={(e) => setEditingTrip({ ...editingTrip, title: e.target.value })}
                  placeholder={ta.tripNamePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-['Tajawal']"
                />
              </div>

              {/* Reliable Direct File Upload & URL */}
              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  {ta.tripImageLabel}
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
                        <span>{ta.uploading}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-[#D94E28]" />
                        <span>{ta.chooseFromDevice}</span>
                      </>
                    )}
                  </button>
                </div>

                {editingTrip.image_url && (
                  <div className="h-32 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E2E8F0] relative">
                    <img src={editingTrip.image_url} alt="Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 end-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-['Cairo']">
                      {ta.imagePreview}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  {ta.tripDescLabel}
                </label>
                <textarea
                  required
                  rows={4}
                  value={editingTrip.description}
                  onChange={(e) => setEditingTrip({ ...editingTrip, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs font-['Tajawal']"
                ></textarea>
              </div>

              {/* Multi-Photo Uploader Section for Trip */}
              <div className="pt-2">
                <MultiPhotoUploader
                  itemType="trip"
                  itemKey={editingTrip.title || editingTrip.temp_key || (editingTrip.id ? String(editingTrip.id) : '')}
                  itemTitle={editingTrip.title}
                  currentPhotos={itemPhotos.filter((p) => {
                    if (p.item_type !== 'trip') return false;
                    const keys = [
                      editingTrip.title,
                      editingTrip.temp_key,
                      editingTrip.id ? String(editingTrip.id) : undefined,
                    ].filter(Boolean);
                    return keys.includes(p.item_key);
                  })}
                  onPhotosChange={(updatedPhotos) => {
                    const currentKeys = [
                      editingTrip.title,
                      editingTrip.temp_key,
                      editingTrip.id ? String(editingTrip.id) : undefined,
                    ].filter(Boolean);
                    const remainingPhotos = itemPhotos.filter(
                      (p) => !(p.item_type === 'trip' && currentKeys.includes(p.item_key))
                    );
                    setItemPhotos([...remainingPhotos, ...updatedPhotos]);
                    if (updatedPhotos.length > 0 && !editingTrip.image_url) {
                      setEditingTrip((prev) => prev ? { ...prev, image_url: updatedPhotos[0].image_url } : null);
                    }
                    onDataUpdated();
                  }}
                  onKeyAssigned={(generatedKey) => {
                    if (!editingTrip.temp_key && !editingTrip.title) {
                      setEditingTrip((prev) => prev ? { ...prev, temp_key: generatedKey } : null);
                    }
                  }}
                  lang={currentLang}
                  showFeedback={showFeedback}
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#F1F5F9]">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#0F223D] text-white font-['Cairo'] font-bold text-sm hover:bg-[#1E3A5F] transition-colors"
                >
                  {ta.saveTrip}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTrip(null)}
                  className="px-5 py-3 rounded-xl bg-[#F1F5F9] text-[#0F223D] font-['Cairo'] font-bold text-sm hover:bg-[#E2E8F0]"
                >
                  {ta.cancel}
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
                {editingGallery.id ? ta.editGalleryTitle : ta.createGalleryTitle}
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
                  {ta.galleryImageLabel}
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
                        <span>{ta.uploading}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>{ta.chooseFromDevice}</span>
                      </>
                    )}
                  </button>
                </div>

                {editingGallery.image_url && (
                  <div className="h-40 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E2E8F0] relative">
                    <img src={editingGallery.image_url} alt="Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 end-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-['Cairo']">
                      {ta.imagePreview}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  {ta.captionLabel}
                </label>
                <input
                  type="text"
                  value={editingGallery.caption || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, caption: e.target.value })}
                  placeholder={ta.captionPlaceholder}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs font-['Tajawal']"
                />
              </div>

              <div>
                <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                  {ta.displayOrder}
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
                  {ta.saveImage}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingGallery(null)}
                  className="px-5 py-3 rounded-xl bg-[#F1F5F9] text-[#0F223D] font-['Cairo'] font-bold text-sm hover:bg-[#E2E8F0]"
                >
                  {ta.cancel}
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
                {editingSiteInfo.id ? ta.editInfoTitle : ta.addNewInfo}
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
                  {ta.keyLabel}
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
                  {ta.valueLabel}
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
                  {ta.saveEdit}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSiteInfo(null)}
                  className="px-5 py-3 rounded-xl bg-[#F1F5F9] text-[#0F223D] font-['Cairo'] font-bold text-sm hover:bg-[#E2E8F0]"
                >
                  {ta.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
