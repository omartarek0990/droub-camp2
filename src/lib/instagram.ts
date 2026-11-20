import { Language, OccupancyType } from '../types';

export const BOOKING_INSTAGRAM_URL = 'https://www.instagram.com/everyday.travelc/';
export const BOOKING_INSTAGRAM_HANDLE = '@everyday.travelc';

export async function copyMessageToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback to textarea copy below
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function buildBookingModalMessage(params: {
  lang: Language;
  requestType: 'room' | 'package';
  referenceName: string;
  occupancy?: OccupancyType | null;
  checkIn: string;
  checkOut: string;
  totalPrice?: number | null;
  guestName: string;
  guestPhone: string;
  notes?: string | null;
}): string {
  const {
    lang,
    requestType,
    referenceName,
    occupancy,
    checkIn,
    checkOut,
    totalPrice,
    guestName,
    guestPhone,
    notes,
  } = params;

  const occupancyLabels: Record<OccupancyType, { ar: string; en: string }> = {
    single: { ar: 'فردي', en: 'Single' },
    double: { ar: 'مزدوج', en: 'Double' },
    triple: { ar: 'ثلاثي', en: 'Triple' },
    quadruple: { ar: 'رباعي', en: 'Quadruple' },
  };

  if (lang === 'ar') {
    return [
      'مرحباً نويبع كامب 🌊، أرغب في تأكيد طلب حجز جديد:',
      `• الإقامة / الباقة: ${referenceName}`,
      requestType === 'room' && occupancy
        ? `• نوع الإشغال: ${occupancyLabels[occupancy]?.ar || occupancy}`
        : null,
      `• تاريخ الوصول: ${checkIn}`,
      `• تاريخ المغادرة: ${checkOut}`,
      totalPrice ? `• الإجمالي التقديري: ${totalPrice.toLocaleString()} ج.م` : null,
      `• الاسم: ${guestName}`,
      `• رقم الهاتف: ${guestPhone}`,
      notes ? `• ملاحظات: ${notes}` : null,
      'أرجو التأكيد وإفادتي بتفاصيل الحجز. شكراً!',
    ]
      .filter(Boolean)
      .join('\n');
  }

  return [
    'Hello Nuweiba Camp 🌊, I would like to confirm a new booking request:',
    `• Selection: ${referenceName}`,
    requestType === 'room' && occupancy
      ? `• Occupancy: ${occupancyLabels[occupancy]?.en || occupancy}`
      : null,
    `• Check-in: ${checkIn}`,
    `• Check-out: ${checkOut}`,
    totalPrice ? `• Estimated Total: ${totalPrice.toLocaleString()} EGP` : null,
    `• Name: ${guestName}`,
    `• Phone: ${guestPhone}`,
    notes ? `• Special Requests: ${notes}` : null,
    'Please confirm availability and details. Thank you!',
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildTripInquiryMessage(tripTitle: string, lang: Language = 'ar'): string {
  if (lang === 'en') {
    return `Hello Nuweiba Camp! ⛰️\nI would like to ask about the outdoor adventure:\n• Trip: ${tripTitle}\nPlease share the current price according to our group size and available schedule.`;
  }
  return `مرحباً نويبع كامب ⛰️\nأود الاستفسار عن رحلة:\n• المغامرة: ${tripTitle}\nبرجاء إفادتي بالسعر والمواعيد المتاحة حسب عدد الأفراد.`;
}

export function buildTransferInquiryMessage(lang: Language = 'ar'): string {
  if (lang === 'en') {
    return 'Hello Nuweiba Camp 🚐, I would like to inquire about transfer bus schedules and rates to the camp.';
  }
  return 'مرحباً نويبع كامب 🚐، أود الاستفسار عن مواعيد وأسعار انتقالات الكامب.';
}

export function buildGeneralStayInquiryMessage(lang: Language = 'ar'): string {
  if (lang === 'en') {
    return 'Hello Nuweiba Camp 🌊, I would like to inquire about booking a stay at Ras Shitan.';
  }
  return 'مرحباً نويبع كامب 🌊، أود الاستفسار عن حجز إقامة في رأس شيطان.';
}
