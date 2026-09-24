import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';
import { RoomPricing, PackageItem, TripItem, GalleryItem, OccupancyType, Language } from './types';
import {
  DEFAULT_ROOM_PRICING,
  DEFAULT_PACKAGES,
  DEFAULT_TRIPS,
  DEFAULT_GALLERY,
  DEFAULT_SITE_INFO,
} from './lib/supabase';
import { LanguageProvider, useLanguage } from './lib/LanguageContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PricingSection } from './components/PricingSection';
import { AmenitiesSection } from './components/AmenitiesSection';
import { PackagesSection } from './components/PackagesSection';
import { TripsSection } from './components/TripsSection';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { LocationBookingSection } from './components/LocationBookingSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { OwnerDashboard } from './components/OwnerDashboard';
import { BookingModal } from './components/BookingModal';

function AppContent() {
  const { lang, setLang, toggleLang } = useLanguage();

  // Owner View Hash detection (#owner)
  const [isOwnerView, setIsOwnerView] = useState<boolean>(() => {
    return window.location.hash === '#owner';
  });

  // Dynamic Data from Supabase
  const [rooms, setRooms] = useState<RoomPricing[]>(DEFAULT_ROOM_PRICING);
  const [packages, setPackages] = useState<PackageItem[]>(DEFAULT_PACKAGES);
  const [trips, setTrips] = useState<TripItem[]>(DEFAULT_TRIPS);
  const [gallery, setGallery] = useState<GalleryItem[]>(DEFAULT_GALLERY);
  const [siteInfo, setSiteInfo] = useState<Record<string, string>>(DEFAULT_SITE_INFO);
  const [loading, setLoading] = useState(true);

  // On-Site Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingModalConfig, setBookingModalConfig] = useState<{
    type: 'room' | 'package';
    reference: string;
    occupancy: OccupancyType;
  }>({
    type: 'room',
    reference: '',
    occupancy: 'double',
  });

  // Listen for hash changes to detect manual navigation to #owner
  useEffect(() => {
    const handleHashChange = () => {
      setIsOwnerView(window.location.hash === '#owner');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch all live data dynamically from Supabase
  const loadSupabaseData = useCallback(async () => {
    try {
      // 1. Rooms Pricing
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms_pricing')
        .select('*')
        .order('display_order', { ascending: true });

      if (!roomsError && roomsData && roomsData.length > 0) {
        setRooms(roomsData);
      }

      // 2. Packages
      const { data: packagesData, error: packagesError } = await supabase
        .from('packages')
        .select('*')
        .order('display_order', { ascending: true });

      if (!packagesError && packagesData && packagesData.length > 0) {
        setPackages(packagesData);
      }

      // 3. Trips
      const { data: tripsData, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .order('display_order', { ascending: true });

      if (!tripsError && tripsData && tripsData.length > 0) {
        setTrips(tripsData);
      }

      // 4. Gallery
      const { data: galleryData, error: galleryError } = await supabase
        .from('gallery')
        .select('*')
        .order('display_order', { ascending: true });

      if (!galleryError && galleryData && galleryData.length > 0) {
        setGallery(galleryData);
      }

      // 5. Site Info
      const { data: infoData, error: infoError } = await supabase
        .from('site_info')
        .select('*');

      if (!infoError && infoData && infoData.length > 0) {
        const infoMap: Record<string, string> = { ...DEFAULT_SITE_INFO };
        infoData.forEach((row: { key: string; value: string }) => {
          if (row.key) {
            infoMap[row.key] = row.value !== null && row.value !== undefined ? row.value : '';
          }
        });
        setSiteInfo(infoMap);
      }
    } catch (err) {
      console.warn('Using default seed data while connecting to Supabase:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSupabaseData();
  }, [loadSupabaseData]);

  // Close Owner Dashboard and return to public website
  const handleCloseOwner = () => {
    window.location.hash = '';
    setIsOwnerView(false);
  };

  // Handlers to open On-Site Booking Modal with context
  const handleOpenRoomBooking = (roomType: string, occupancy: OccupancyType) => {
    setBookingModalConfig({
      type: 'room',
      reference: roomType,
      occupancy,
    });
    setIsBookingModalOpen(true);
  };

  const handleOpenPackageBooking = (packageTitle: string) => {
    setBookingModalConfig({
      type: 'package',
      reference: packageTitle,
      occupancy: 'double',
    });
    setIsBookingModalOpen(true);
  };

  const handleOpenGeneralBooking = () => {
    setBookingModalConfig({
      type: 'room',
      reference: rooms.length > 0 ? rooms[0].room_type : '',
      occupancy: 'double',
    });
    setIsBookingModalOpen(true);
  };

  // CRITICAL REQUIREMENT: If URL hash is #owner, show Hidden Owner Page exclusively
  if (isOwnerView) {
    return (
      <OwnerDashboard
        lang={lang}
        onToggleLang={toggleLang}
        onSelectLang={setLang}
        onClose={handleCloseOwner}
        onDataUpdated={loadSupabaseData}
      />
    );
  }

  // Public Visitor Website
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F223D] flex flex-col font-['Cairo','Tajawal',sans-serif]">
      {/* 1. Header with official logo, nav links, and on-site booking CTA */}
      <Header
        lang={lang}
        onToggleLang={toggleLang}
        onSelectLang={setLang}
        onOpenBooking={handleOpenGeneralBooking}
      />

      {/* 2. Hero Section */}
      <Hero
        lang={lang}
        onOpenBooking={handleOpenGeneralBooking}
      />

      {/* 3. Pricing Section (Accommodation Rates from rooms_pricing + Real Booking Modal) */}
      <PricingSection
        rooms={rooms}
        lang={lang}
        pricingNote={lang === 'ar' ? (siteInfo.pricing_note_ar || siteInfo.pricing_note) : (siteInfo.pricing_note_en || undefined)}
        onOpenBooking={handleOpenRoomBooking}
      />

      {/* 4. Amenities & Inclusions Section */}
      <AmenitiesSection lang={lang} />

      {/* 5. Packages & Special Offers (from packages table + Real Booking Modal) */}
      <PackagesSection
        packages={packages}
        lang={lang}
        onOpenBooking={handleOpenPackageBooking}
      />

      {/* 6. Outdoor Trips & Hiking Adventures (from trips table - WhatsApp inquiry only) */}
      <TripsSection
        trips={trips}
        lang={lang}
        tripsIntro={lang === 'ar' ? (siteInfo.trips_intro_ar || siteInfo.trips_intro) : (siteInfo.trips_intro_en || undefined)}
      />

      {/* 7. About the Camp & Philosophy */}
      <AboutSection
        lang={lang}
        aboutText={lang === 'ar' ? (siteInfo.about_philosophy_ar || siteInfo.about_philosophy) : (siteInfo.about_philosophy_en || undefined)}
      />

      {/* 8. Photo Gallery with Lightbox Zoom (from gallery table) */}
      <GallerySection gallery={gallery} lang={lang} />

      {/* 9. Location & Booking Section (Map, InstaPay steps, quick contact) */}
      <LocationBookingSection
        lang={lang}
        bookingStep1={lang === 'ar' ? (siteInfo.booking_step_1_ar || siteInfo.booking_step_1) : (siteInfo.booking_step_1_en || undefined)}
        bookingStep2={lang === 'ar' ? (siteInfo.booking_step_2_ar || siteInfo.booking_step_2) : (siteInfo.booking_step_2_en || undefined)}
        phone={siteInfo.phone}
        whatsapp={siteInfo.whatsapp}
        facebookUrl={siteInfo.social_facebook_url}
        instagramUrl={siteInfo.social_instagram_url}
        onOpenBooking={handleOpenGeneralBooking}
      />

      {/* 10. Footer (NO owner button or link) */}
      <Footer
        lang={lang}
        facebookUrl={siteInfo.social_facebook_url}
        instagramUrl={siteInfo.social_instagram_url}
        tiktokUrl={siteInfo.social_tiktok_url}
      />

      {/* 11. Persistent Floating WhatsApp Button (Thumb-Friendly on mobile) */}
      <FloatingWhatsApp lang={lang} />

      {/* 12. Full-featured On-Site Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        lang={lang}
        rooms={rooms}
        packages={packages}
        initialType={bookingModalConfig.type}
        initialReference={bookingModalConfig.reference}
        initialOccupancy={bookingModalConfig.occupancy}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
