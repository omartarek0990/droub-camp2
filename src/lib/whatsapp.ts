export const WHATSAPP_PHONE_DISPLAY = '01061189414';
export const WHATSAPP_PHONE_INTERNATIONAL = '+201061189414';

export function getWhatsAppUrl(message: string, phone: string = WHATSAPP_PHONE_INTERNATIONAL): string {
  // Normalize phone number to pure digits
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('01')) {
    cleanPhone = '2' + cleanPhone; // Convert 010... to 2010...
  } else if (!cleanPhone.startsWith('20') && cleanPhone.startsWith('1')) {
    cleanPhone = '20' + cleanPhone;
  }
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

export function openWhatsApp(message: string, phone: string = WHATSAPP_PHONE_INTERNATIONAL): void {
  const url = getWhatsAppUrl(message, phone);
  if (typeof window !== 'undefined') {
    window.location.href = url;
  }
}

export function buildRoomBookingMessage(
  roomType: string,
  occupancy?: string,
  price?: string | number | null,
  lang: 'ar' | 'en' = 'ar'
): string {
  if (lang === 'en') {
    return `Hello Jazz Camp! 🌊\nI would like to inquire about booking:\n• Room: ${roomType}\n${occupancy ? `• Occupancy: ${occupancy}\n` : ''}${price ? `• Rate: ${price} EGP per room/night\n` : ''}Please let me know available dates and details. Thank you!`;
  }
  return `مرحباً جاز كامب 🌊\nأود الاستفسار عن حجز:\n• نوع الإقامة: ${roomType}\n${occupancy ? `• الإشغال: ${occupancy}\n` : ''}${price ? `• السعر: ${price} ج.م للغرفة / الليلة\n` : ''}برجاء إفادتي بالمواعيد المتاحة وتفاصيل الحجز. شكراً لكم!`;
}

export function buildPackageBookingMessage(
  packageTitle: string,
  packagePrice?: string | number,
  lang: 'ar' | 'en' = 'ar'
): string {
  if (lang === 'en') {
    return `Hello Jazz Camp! 🏕️\nI am interested in booking the special package:\n• Package: ${packageTitle}\n${packagePrice ? `• Price: ${packagePrice}\n` : ''}Could you please share availability and confirmation details?`;
  }
  return `مرحباً جاز كامب 🏕️\nأرغب في الاستفسار وحجز الباقة الخاصة:\n• الباقة: ${packageTitle}\n${packagePrice ? `• السعر: ${packagePrice}\n` : ''}برجاء إرسال التواريخ المتاحة وخطوات التأكيد.`;
}

export function buildTripInquiryMessage(
  tripTitle: string,
  lang: 'ar' | 'en' = 'ar'
): string {
  if (lang === 'en') {
    return `Hello Jazz Camp! ⛰️\nI would like to ask about the outdoor adventure:\n• Trip: ${tripTitle}\nPlease share the current price according to our group size and available schedule.`;
  }
  return `مرحباً جاز كامب ⛰️\nأود الاستفسار عن رحلة:\n• المغامرة: ${tripTitle}\nبرجاء إفادتي بالسعر والمواعيد المتاحة حسب عدد الأفراد.`;
}

export function buildCustomBookingFormMessage(data: {
  name: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  roomType: string;
  notes?: string;
  lang?: 'ar' | 'en';
}): string {
  const isEn = data.lang === 'en';
  if (isEn) {
    return `Hello Jazz Camp! 🌊\nNew Booking Request:\n• Name: ${data.name}\n• Check-in: ${data.checkIn}\n• Check-out: ${data.checkOut}\n• Guests: ${data.guests}\n• Accommodation/Package: ${data.roomType}\n${data.notes ? `• Special Notes: ${data.notes}\n` : ''}Looking forward to confirming with you!`;
  }
  return `مرحباً إدارة جاز كامب 🌊\nطلب حجز جديد:\n• الاسم: ${data.name}\n• تاريخ الوصول: ${data.checkIn}\n• تاريخ المغادرة: ${data.checkOut}\n• عدد الأفراد: ${data.guests}\n• نوع الغرفة / الباقة: ${data.roomType}\n${data.notes ? `• ملاحظات إضافية: ${data.notes}\n` : ''}في انتظار تأكيد التوافر وطريقة الدفع عبر إنستاباي. شكراً جزيلاً!`;
}
