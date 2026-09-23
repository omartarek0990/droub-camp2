import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, Globe } from 'lucide-react';
import { Logo } from './Logo';
import { Language } from '../types';
import { translations } from '../lib/translations';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  activeSection?: string;
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  activeSection = 'home',
  onOpenBooking,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: t.nav.home },
    { href: '#accommodation', label: t.nav.accommodation },
    { href: '#amenities', label: t.nav.amenities },
    { href: '#trips', label: t.nav.trips },
    { href: '#packages', label: t.nav.packages },
    { href: '#about', label: t.nav.about },
    { href: '#gallery', label: t.nav.gallery },
    { href: '#location', label: t.nav.location },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 transition-all duration-300 w-full ${
        isScrolled
          ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border-b border-[#E2E8F0]'
          : 'bg-[#FAF8F5] border-b border-[#E8E2D8]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 md:h-20">
          {/* Logo */}
          <a
            id="header-logo-link"
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center focus:outline-none"
            aria-label="Droub Camp Home"
          >
            <Logo size="md" variant="navy" lang={lang} />
          </a>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav-menu" className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-2 text-sm font-bold font-['Cairo'] text-[#0F223D] hover:text-[#D94E28] rounded-xl hover:bg-[#F1F5F9] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle */}
            <button
              id="lang-toggle-btn"
              onClick={onToggleLang}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#CBD5E1] bg-white text-xs font-bold font-['Cairo'] text-[#0F223D] hover:bg-[#F1F5F9] transition-colors focus:outline-none shadow-xs"
              title={t.nav.langToggleTitle}
              aria-label="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#0F223D]" />
              <span>{t.nav.langToggle}</span>
            </button>

            {/* Prominent On-Site Book Now Button */}
            <button
              id="header-book-now-btn"
              onClick={onOpenBooking}
              className="inline-flex items-center justify-center gap-2 bg-[#D94E28] hover:bg-[#C2411C] active:scale-95 text-white font-['Cairo'] font-bold text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-200"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.common.bookNow}</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#0F223D] hover:bg-[#E2E8F0] focus:outline-none transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer-menu"
          className="lg:hidden bg-[#FAF8F5] border-b border-[#E2E8F0] shadow-lg animate-fadeIn px-4 pt-3 pb-6 transition-all"
        >
          <div className="flex flex-col gap-1 divide-y divide-[#E2E8F0]">
            <div className="py-2 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-3 rounded-xl text-base font-bold font-['Cairo'] text-[#0F223D] hover:bg-white hover:text-[#D94E28] active:bg-[#E2E8F0] transition-colors flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-[#94A3B8] font-normal rtl:rotate-180">→</span>
                </a>
              ))}
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button
                id="drawer-book-cta-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full flex items-center justify-center gap-2.5 bg-[#D94E28] hover:bg-[#C2411C] active:scale-[0.98] text-white font-['Cairo'] font-black text-base py-3.5 px-4 rounded-xl shadow-md transition-all"
              >
                <Calendar className="w-5 h-5" />
                <span>{t.common.bookNow}</span>
              </button>

              <div className="flex items-center justify-between px-2 pt-1 text-xs text-[#64748B] font-['Tajawal']">
                <span>📍 {t.common.addressShort}</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onToggleLang();
                  }}
                  className="text-[#0F223D] font-bold underline"
                >
                  {lang === 'ar' ? 'English Version' : 'النسخة العربية'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
