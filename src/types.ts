export interface RoomPricing {
  id?: string | number;
  room_type: string;
  single_price: number | string | null;
  double_price: number | string | null;
  triple_price: number | string | null;
  quadruple_price: number | string | null;
  display_order?: number;
  description_ar?: string;
  description_en?: string;
}

export interface PackageItem {
  id?: string | number;
  title: string;
  description: string;
  price: number | string;
  image_url: string;
  category?: string;
  is_active?: boolean;
  display_order?: number;
}

export interface TripItem {
  id?: string | number;
  title: string;
  description: string;
  image_url: string;
  is_active?: boolean;
  display_order?: number;
}

export interface GalleryItem {
  id?: string | number;
  image_url: string;
  caption?: string;
  display_order?: number;
}

export interface SiteInfo {
  id?: string | number;
  key: string;
  value: string;
}

export type OccupancyType = 'single' | 'double' | 'triple' | 'quadruple';

export interface BookingRequest {
  id?: string;
  request_type: 'room' | 'package';
  reference_name: string;
  occupancy?: OccupancyType | null;
  check_in: string; // YYYY-MM-DD
  check_out: string; // YYYY-MM-DD
  guest_name: string;
  guest_phone: string;
  guests_count: number;
  total_price?: number | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string | null;
  created_at?: string;
}

export type Language = 'ar' | 'en';
