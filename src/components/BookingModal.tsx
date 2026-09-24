import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { RoomPricing, PackageItem, OccupancyType, Language, BookingRequest } from '../types';
import { WHATSAPP_PHONE_INTERNATIONAL } from '../lib/whatsapp';
import { translations, translateRoomType, translatePackage } from '../lib/translations';
import {
  Calendar as CalendarIcon,
  X,
  CheckCircle,
  AlertCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  Bed,
  Package,
  Clock,
  Phone,
  User,
  FileText,
  CreditCard,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  rooms: RoomPricing[];
  packages: PackageItem[];
  initialType?: 'room' | 'package';
  initialReference?: string;
  initialOccupancy?: OccupancyType;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  lang,
  rooms,
  packages,
  initialType = 'room',
  initialReference = '',
  initialOccupancy = 'double',
}) => {
  const t = translations[lang];
  const tm = t.modal;

  const [requestType, setRequestType] = useState<'room' | 'package'>(initialType);
  const [referenceName, setReferenceName] = useState<string>(initialReference);
  const [occupancy, setOccupancy] = useState<OccupancyType>(initialOccupancy);

  // Dates (YYYY-MM-DD)
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');

  // Calendar month view (year, month: 0-11)
  const today = new Date();
  const [viewYear, setViewYear] = useState<number>(today.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(today.getMonth());

  // Guest details
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [notes, setNotes] = useState('');

  // Confirmed bookings fetched for this reference to block dates
  const [confirmedRanges, setConfirmedRanges] = useState<{ check_in: string; check_out: string }[]>([]);
  const [loadingConfirmed, setLoadingConfirmed] = useState(false);

  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSubmittedBooking, setLastSubmittedBooking] = useState<BookingRequest | null>(null);

  // Sync initial props whenever modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setRequestType(initialType);
      const defaultRef =
        initialReference ||
        (initialType === 'room' && rooms.length > 0
          ? rooms[0].room_type
          : packages.length > 0
          ? packages[0].title
          : '');
      setReferenceName(defaultRef);
      setOccupancy(initialOccupancy);
      setIsSuccess(false);
      setSubmitError(null);
    }
  }, [isOpen, initialType, initialReference, initialOccupancy, rooms, packages]);

  // Fetch confirmed dates from booking_requests whenever referenceName changes
  useEffect(() => {
    if (!isOpen || !referenceName) return;

    let isMounted = true;
    const fetchConfirmedBookings = async () => {
      setLoadingConfirmed(true);
      try {
        const { data, error } = await supabase
          .from('booking_requests')
          .select('check_in, check_out')
          .eq('status', 'confirmed')
          .eq('reference_name', referenceName);

        if (!error && data && isMounted) {
          setConfirmedRanges(data);
        }
      } catch (err) {
        console.warn('Could not fetch confirmed bookings:', err);
      } finally {
        if (isMounted) setLoadingConfirmed(false);
      }
    };

    fetchConfirmedBookings();
    return () => {
      isMounted = false;
    };
  }, [isOpen, referenceName]);

  // Selected room details & pricing
  const selectedRoom = useMemo(() => {
    if (requestType !== 'room') return null;
    return rooms.find((r) => r.room_type === referenceName) || rooms[0] || null;
  }, [requestType, rooms, referenceName]);

  // Selected package details
  const selectedPackage = useMemo(() => {
    if (requestType !== 'package') return null;
    return packages.find((p) => p.title === referenceName) || packages[0] || null;
  }, [requestType, packages, referenceName]);

  // Price per night for room
  const roomPricePerNight = useMemo(() => {
    if (!selectedRoom) return 0;
    let price: any = null;
    if (occupancy === 'single') price = selectedRoom.single_price;
    else if (occupancy === 'double') price = selectedRoom.double_price;
    else if (occupancy === 'triple') price = selectedRoom.triple_price;
    else if (occupancy === 'quadruple') price = selectedRoom.quadruple_price;
    return Number(price) || Number(selectedRoom.double_price) || 0;
  }, [selectedRoom, occupancy]);

  // Nights count calculation
  const nightsCount = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    const nights = Math.round(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  }, [checkIn, checkOut]);

  // Total price calculation
  const calculatedTotalPrice = useMemo(() => {
    if (requestType === 'room') {
      return nightsCount * roomPricePerNight;
    }
    // Package price
    if (!selectedPackage) return 0;
    const numericMatch = String(selectedPackage.price).match(/[\d,.]+/);
    const basePrice = numericMatch ? Number(numericMatch[0].replace(/,/g, '')) : 0;
    return basePrice * (guestsCount || 1);
  }, [requestType, nightsCount, roomPricePerNight, selectedPackage, guestsCount]);

  // Check if a specific date string (YYYY-MM-DD) is in the past
  const isPastDate = (dateStr: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    return dateStr < todayStr;
  };

  // Total available units for this room type or package (default 6 for rooms)
  const totalUnits = useMemo(() => {
    if (requestType === 'room' && selectedRoom) {
      return Number(selectedRoom.total_units) || 6;
    }
    return 10;
  }, [requestType, selectedRoom]);

  // Count how many confirmed bookings exist on a given date for this room/package
  const getBookedCountOnDate = (dateStr: string) => {
    let count = 0;
    for (const range of confirmedRanges) {
      if (dateStr >= range.check_in && dateStr < range.check_out) {
        count++;
      }
    }
    return count;
  };

  // Calculate remaining units for a date
  const getRemainingUnitsOnDate = (dateStr: string) => {
    const booked = getBookedCountOnDate(dateStr);
    return Math.max(0, totalUnits - booked);
  };

  // Check if a specific date is FULLY booked (all units taken)
  const isDateBooked = (dateStr: string) => {
    return getBookedCountOnDate(dateStr) >= totalUnits;
  };

  // Check if a range has any fully booked days in between
  const hasBookedDaysBetween = (startStr: string, endStr: string) => {
    const current = new Date(startStr);
    const end = new Date(endStr);
    while (current < end) {
      const dateStr = current.toISOString().split('T')[0];
      if (isDateBooked(dateStr)) return true;
      current.setDate(current.getDate() + 1);
    }
    return false;
  };

  // Handle clicking a day in the calendar widget
  const handleDateClick = (dateStr: string) => {
    if (isPastDate(dateStr) || isDateBooked(dateStr)) return;

    if (!checkIn || (checkIn && checkOut)) {
      // Start a new selection
      setCheckIn(dateStr);
      setCheckOut('');
    } else {
      // Second click is checkOut
      if (dateStr <= checkIn) {
        // Clicked before or same day -> reset check-in to this date
        setCheckIn(dateStr);
        setCheckOut('');
      } else {
        // Validate no confirmed overlap in between
        if (hasBookedDaysBetween(checkIn, dateStr)) {
          setSubmitError(tm.errOverlap);
          return;
        }
        setCheckOut(dateStr);
        setSubmitError(null);
      }
    }
  };

  // Month navigation
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Calendar days grid computation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Empty lead slots
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dateStr: '', dayNum: 0, isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(viewMonth + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateStr = `${viewYear}-${monthStr}-${dayStr}`;
      days.push({ dateStr, dayNum: day, isCurrentMonth: true });
    }

    return days;
  }, [viewYear, viewMonth]);

  const monthNames = {
    ar: [
      'يناير',
      'فبراير',
      'مارس',
      'أبريل',
      'مايو',
      'يونيو',
      'يوليو',
      'أغسطس',
      'سبتمبر',
      'أكتوبر',
      'نوفمبر',
      'ديسمبر',
    ],
    en: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  }[lang];

  // Submit Booking Request
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!checkIn || !checkOut) {
      setSubmitError(tm.errSelectDates);
      return;
    }

    if (!guestName.trim() || !guestPhone.trim()) {
      setSubmitError(tm.errProvideContact);
      return;
    }

    setSubmitting(true);

    try {
      const payload: BookingRequest = {
        request_type: requestType,
        reference_name: referenceName,
        occupancy: requestType === 'room' ? occupancy : null,
        check_in: checkIn,
        check_out: checkOut,
        guest_name: guestName.trim(),
        guest_phone: guestPhone.trim(),
        guests_count: Number(guestsCount) || 1,
        total_price: calculatedTotalPrice || null,
        status: 'pending',
        notes: notes.trim() || null,
      };

      const { error } = await supabase.from('booking_requests').insert([payload]).select();

      if (error) {
        console.error('Supabase booking error:', error);
        throw error;
      }

      setLastSubmittedBooking(payload);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Booking submission failed:', err);
      setSubmitError(
        lang === 'ar'
          ? `حدث خطأ أثناء إرسال طلب الحجز: ${err.message || 'يرجى المحاولة مجدداً'}`
          : `Failed to submit booking request: ${err.message || 'Please try again'}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const occupancyDisplayMap: Record<OccupancyType, { ar: string; en: string }> = {
    single: { ar: 'فردي', en: 'Single' },
    double: { ar: 'مزدوج', en: 'Double' },
    triple: { ar: 'ثلاثي', en: 'Triple' },
    quadruple: { ar: 'رباعي', en: 'Quadruple' },
  };

  const getTranslatedReference = (type: 'room' | 'package', ref: string) => {
    if (type === 'room') {
      return translateRoomType(ref, lang);
    }
    const pkg = packages.find((p) => p.title === ref);
    return pkg ? translatePackage(pkg, lang).title : ref;
  };

  const whatsappMessageText = lang === 'ar'
    ? `مرحباً جاز كامب، قمت بتقديم طلب حجز عبر الموقع:\n- الإقامة: ${lastSubmittedBooking?.reference_name}\n- الوصول: ${lastSubmittedBooking?.check_in}\n- المغادرة: ${lastSubmittedBooking?.check_out}\n- الاسم: ${lastSubmittedBooking?.guest_name}\n- الهاتف: ${lastSubmittedBooking?.guest_phone}\nأرجو المتابعة والتأكيد.`
    : `Hello Jazz Camp, I submitted a booking request through the website:\n- Selection: ${lastSubmittedBooking?.reference_name}\n- Check-in: ${lastSubmittedBooking?.check_in}\n- Check-out: ${lastSubmittedBooking?.check_out}\n- Name: ${lastSubmittedBooking?.guest_name}\n- Phone: ${lastSubmittedBooking?.guest_phone}\nPlease confirm.`;

  return (
    <div
      id="booking-modal-overlay"
      className="fixed inset-0 z-50 bg-[#0F223D]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
    >
      <div className="bg-[#FAF8F5] rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-[#E2E8F0] shadow-2xl flex flex-col my-auto text-[#0F223D]">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0F223D] text-white flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-[#D94E28]" />
            </div>
            <div>
              <h2 className="font-['Cairo'] font-black text-lg sm:text-xl text-[#0F223D] leading-tight">
                {tm.title}
              </h2>
              <p className="font-['Tajawal'] text-xs text-[#64748B]">
                {tm.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#F1F5F9] text-[#64748B] hover:text-[#0F223D] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex-1">
          {/* SUCCESS SCREEN */}
          {isSuccess ? (
            <div className="text-center py-6 sm:py-8 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#15803D] border border-[#A7F3D0] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <h3 className="font-['Cairo'] font-black text-2xl text-[#0F223D] mb-1">
                  {tm.successTitle}
                </h3>
                <p className="font-['Tajawal'] text-sm sm:text-base text-[#475569] max-w-lg mx-auto leading-relaxed">
                  {tm.successDesc}
                </p>
              </div>

              {/* Booking Summary Box */}
              {lastSubmittedBooking && (
                <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] max-w-md mx-auto text-start space-y-2.5 font-['Cairo'] text-xs sm:text-sm">
                  <div className="flex justify-between border-b border-[#F1F5F9] pb-2">
                    <span className="text-[#64748B]">{tm.selectionLabel}:</span>
                    <span className="font-bold text-[#0F223D]">
                      {getTranslatedReference(lastSubmittedBooking.request_type, lastSubmittedBooking.reference_name)}
                    </span>
                  </div>
                  {lastSubmittedBooking.occupancy && (
                    <div className="flex justify-between border-b border-[#F1F5F9] pb-2">
                      <span className="text-[#64748B]">{tm.occupancyLabel}:</span>
                      <span className="font-bold text-[#D94E28]">
                        {occupancyDisplayMap[lastSubmittedBooking.occupancy][lang]}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-[#F1F5F9] pb-2">
                    <span className="text-[#64748B]">{tm.checkInDate}:</span>
                    <span className="font-bold">{lastSubmittedBooking.check_in}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#F1F5F9] pb-2">
                    <span className="text-[#64748B]">{tm.checkOutDate}:</span>
                    <span className="font-bold">{lastSubmittedBooking.check_out}</span>
                  </div>
                  {lastSubmittedBooking.total_price && (
                    <div className="flex justify-between pt-1">
                      <span className="text-[#64748B] font-bold">{tm.totalPriceEstimated}:</span>
                      <span className="font-black text-base text-[#D94E28]">
                        {lastSubmittedBooking.total_price.toLocaleString()} {t.common.currency}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* InstaPay Info Pill */}
              <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-2xl p-4 max-w-md mx-auto flex items-start gap-3 text-start">
                <CreditCard className="w-5 h-5 text-[#D94E28] flex-shrink-0 mt-0.5" />
                <div className="font-['Tajawal'] text-xs text-[#9A3412]">
                  <strong className="font-['Cairo'] block mb-0.5">
                    {tm.depositNoticeTitle}
                  </strong>
                  {tm.depositNoticeDesc}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <a
                  href={`https://wa.me/${WHATSAPP_PHONE_INTERNATIONAL}?text=${encodeURIComponent(whatsappMessageText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-['Cairo'] font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{tm.followUpWhatsApp}</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#0F223D] font-['Cairo'] font-bold text-sm transition-colors"
                >
                  {tm.closeModal}
                </button>
              </div>
            </div>
          ) : (
            /* BOOKING FLOW FORM */
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              {/* Type Switcher: Room vs Package */}
              <div className="flex p-1 bg-[#E2E8F0] rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setRequestType('room');
                    if (rooms.length > 0) setReferenceName(rooms[0].room_type);
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-['Cairo'] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    requestType === 'room'
                      ? 'bg-[#0F223D] text-white shadow-sm'
                      : 'text-[#475569] hover:text-[#0F223D]'
                  }`}
                >
                  <Bed className="w-4 h-4 text-[#D94E28]" />
                  <span>{tm.tabRoom}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRequestType('package');
                    if (packages.length > 0) setReferenceName(packages[0].title);
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-['Cairo'] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    requestType === 'package'
                      ? 'bg-[#0F223D] text-white shadow-sm'
                      : 'text-[#475569] hover:text-[#0F223D]'
                  }`}
                >
                  <Package className="w-4 h-4 text-[#D94E28]" />
                  <span>{tm.tabPackage}</span>
                </button>
              </div>

              {/* 1. Selection & Occupancy */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] space-y-4">
                <div>
                  <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1.5">
                    {requestType === 'room' ? tm.selectRoomType : tm.selectPackageType}
                  </label>
                  <select
                    value={referenceName}
                    onChange={(e) => setReferenceName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm font-['Cairo'] font-semibold text-[#0F223D] focus:outline-none focus:ring-2 focus:ring-[#0F223D]"
                  >
                    {requestType === 'room'
                      ? rooms.map((r) => (
                          <option key={r.room_type} value={r.room_type}>
                            {translateRoomType(r.room_type, lang)}
                          </option>
                        ))
                      : packages.map((p) => (
                          <option key={p.title} value={p.title}>
                            {translatePackage(p, lang).title} — {p.price}
                          </option>
                        ))}
                  </select>
                </div>

                {/* If Room: Occupancy Selectors */}
                {requestType === 'room' && (
                  <div>
                    <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-2">
                      {tm.occupancyTypeHint}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { key: 'single', label: lang === 'ar' ? 'فردي' : 'Single', price: selectedRoom?.single_price },
                        { key: 'double', label: lang === 'ar' ? 'مزدوج' : 'Double', price: selectedRoom?.double_price },
                        { key: 'triple', label: lang === 'ar' ? 'ثلاثي' : 'Triple', price: selectedRoom?.triple_price },
                        { key: 'quadruple', label: lang === 'ar' ? 'رباعي' : 'Quad', price: selectedRoom?.quadruple_price },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setOccupancy(item.key as OccupancyType)}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            occupancy === item.key
                              ? 'border-[#0F223D] bg-[#0F223D] text-white shadow-sm'
                              : 'border-[#E2E8F0] bg-[#FAF8F5] text-[#0F223D] hover:border-[#CBD5E1]'
                          }`}
                        >
                          <span className="block text-xs font-['Cairo'] font-bold">
                            {item.label}
                          </span>
                          <span
                            className={`block text-[11px] font-['Cairo'] mt-0.5 ${
                              occupancy === item.key ? 'text-[#F97316]' : 'text-[#64748B]'
                            }`}
                          >
                            {item.price ? `${item.price} ${t.common.currency}` : '—'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Interactive Real-Time Calendar Widget */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-[#D94E28]" />
                    <h3 className="font-['Cairo'] font-bold text-sm sm:text-base text-[#0F223D]">
                      {tm.selectDatesTitle}
                    </h3>
                  </div>
                  {loadingConfirmed && (
                    <span className="text-[11px] font-['Tajawal'] text-[#64748B] flex items-center gap-1 animate-pulse">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{tm.checkingAvailability}</span>
                    </span>
                  )}
                </div>

                {/* Date Selection Display Badges */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E2E8F0]">
                    <span className="block text-[10px] font-['Cairo'] font-bold text-[#64748B]">
                      {tm.checkInDate}
                    </span>
                    <span className="font-['Cairo'] font-black text-sm text-[#0F223D]">
                      {checkIn || tm.clickToPickDay}
                    </span>
                  </div>
                  <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E2E8F0]">
                    <span className="block text-[10px] font-['Cairo'] font-bold text-[#64748B]">
                      {tm.checkOutDate}
                    </span>
                    <span className="font-['Cairo'] font-black text-sm text-[#0F223D]">
                      {checkOut || tm.clickToPickDay}
                    </span>
                  </div>
                </div>

                {/* Capacity & Multi-Room Inventory Notice */}
                {requestType === 'room' && (
                  <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-2.5 flex items-center justify-between text-xs font-['Cairo']">
                    <div className="flex items-center gap-1.5 text-[#0369A1] font-bold">
                      <Bed className="w-4 h-4 text-[#0284C7]" />
                      <span>
                        {tm.capacityNotice.replace('{count}', String(totalUnits))}
                      </span>
                    </div>
                    <span className="text-[10px] font-['Tajawal'] text-[#0369A1]/80 hidden sm:inline">
                      {tm.capacityHint}
                    </span>
                  </div>
                )}

                {/* Calendar Month Navigation */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#0F223D] transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                  </button>
                  <span className="font-['Cairo'] font-black text-sm text-[#0F223D]">
                    {monthNames[viewMonth]} {viewYear}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#0F223D] transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                  </button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 text-center font-['Cairo'] font-bold text-[10px] text-[#64748B]">
                  {lang === 'ar' ? (
                    <>
                      <span>أحد</span>
                      <span>إثن</span>
                      <span>ثلا</span>
                      <span>أرب</span>
                      <span>خمي</span>
                      <span>جمع</span>
                      <span>سبت</span>
                    </>
                  ) : (
                    <>
                      <span>Su</span>
                      <span>Mo</span>
                      <span>Tu</span>
                      <span>We</span>
                      <span>Th</span>
                      <span>Fr</span>
                      <span>Sa</span>
                    </>
                  )}
                </div>

                {/* Day cells grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((cell, idx) => {
                    if (!cell.isCurrentMonth) {
                      return <div key={idx} className="h-9"></div>;
                    }

                    const past = isPastDate(cell.dateStr);
                    const booked = isDateBooked(cell.dateStr);
                    const bookedCount = getBookedCountOnDate(cell.dateStr);
                    const remainingUnits = getRemainingUnitsOnDate(cell.dateStr);
                    const isSelectedStart = checkIn === cell.dateStr;
                    const isSelectedEnd = checkOut === cell.dateStr;
                    const isInRange = checkIn && checkOut && cell.dateStr > checkIn && cell.dateStr < checkOut;

                    let btnClass = 'bg-[#FAF8F5] text-[#0F223D] hover:bg-[#E2E8F0]';
                    let isDisabled = past || booked;

                    if (past) {
                      btnClass = 'bg-transparent text-[#CBD5E1] cursor-not-allowed';
                    } else if (booked) {
                      btnClass =
                        'bg-[#FEE2E2] text-[#991B1B] line-through cursor-not-allowed opacity-80 border border-[#FCA5A5]';
                    } else if (isSelectedStart || isSelectedEnd) {
                      btnClass = 'bg-[#0F223D] text-white font-black shadow-md ring-2 ring-[#D94E28]';
                    } else if (isInRange) {
                      btnClass = 'bg-[#E0F2FE] text-[#0369A1] font-bold';
                    } else if (bookedCount > 0) {
                      // Partially booked day but still has available rooms!
                      btnClass = 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] hover:bg-[#FEF3C7]';
                    }

                    const tooltipText = booked
                      ? tm.fullyBookedDetail.replace(/{count}/g, String(totalUnits))
                      : bookedCount > 0
                      ? tm.unitsRemaining.replace('{count}', String(remainingUnits)).replace('{total}', String(totalUnits))
                      : cell.dateStr;

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleDateClick(cell.dateStr)}
                        className={`h-9 w-full rounded-lg text-xs font-['Cairo'] flex flex-col items-center justify-center transition-all ${btnClass} relative`}
                        title={tooltipText}
                      >
                        <span className="leading-none">{cell.dayNum}</span>
                        {!past && !booked && bookedCount > 0 && (
                          <span className="text-[8px] text-[#D97706] font-bold leading-none mt-0.5">
                            {tm.unitsLeft.replace('{count}', String(remainingUnits))}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Calendar Legend */}
                <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] font-['Tajawal'] text-[#64748B]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#0F223D]"></span>
                    <span>{tm.legendSelected}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#FEE2E2] border border-[#FCA5A5]"></span>
                    <span>{tm.legendFull.replace('{total}', String(totalUnits))}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#FFFBEB] border border-[#FDE68A]"></span>
                    <span>{tm.legendPartial}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#FAF8F5] border border-[#E2E8F0]"></span>
                    <span>{tm.legendAvailable}</span>
                  </div>
                </div>
              </div>

              {/* 3. Automatic Total Price Calculation Banner */}
              <div className="bg-[#0F223D] text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                <div>
                  <span className="text-[11px] font-['Tajawal'] text-[#94A3B8] block">
                    {requestType === 'room'
                      ? tm.nightsBreakdown
                          .replace('{nights}', String(nightsCount))
                          .replace('{price}', String(roomPricePerNight))
                      : tm.packageBreakdown.replace('{guests}', String(guestsCount))}
                  </span>
                  <div className="font-['Cairo'] font-black text-2xl text-white">
                    {calculatedTotalPrice > 0
                      ? `${calculatedTotalPrice.toLocaleString()} ${t.common.currency}`
                      : tm.pickDatesToCalc}
                  </div>
                </div>

                <div className="text-[11px] font-['Tajawal'] text-[#CBD5E1] bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  {tm.includesMeals}
                </div>
              </div>

              {/* 4. Guest Details Form */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] space-y-4">
                <h3 className="font-['Cairo'] font-bold text-sm sm:text-base text-[#0F223D] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#D94E28]" />
                  <span>{tm.guestInfoTitle}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                      {tm.fullName}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder={tm.fullNamePlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm font-['Tajawal'] focus:outline-none focus:ring-2 focus:ring-[#0F223D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                      {tm.phoneWhatsApp}
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="010XXXXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#0F223D] dir-ltr text-start"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                      {tm.guestsCount}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0F223D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-['Cairo'] font-bold text-[#0F223D] mb-1">
                      {tm.specialRequests}
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={tm.specialRequestsPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm font-['Tajawal'] focus:outline-none focus:ring-2 focus:ring-[#0F223D]"
                    />
                  </div>
                </div>
              </div>

              {/* Error feedback */}
              {submitError && (
                <div className="p-3.5 rounded-xl bg-[#FEE2E2] text-[#991B1B] text-xs font-['Cairo'] flex items-center gap-2 border border-[#FCA5A5]">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-2xl bg-[#D94E28] hover:bg-[#C2411C] active:scale-[0.99] text-white font-['Cairo'] font-black text-base shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? (
                    <span>{tm.submitting}</span>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>{tm.submitBooking}</span>
                    </>
                  )}
                </button>
                <p className="font-['Tajawal'] text-center text-xs text-[#64748B] mt-2">
                  {tm.bookingGuaranteeNote}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

