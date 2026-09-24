import React, { useState } from 'react';
import { Logo } from './Logo';
import { Language } from '../types';
import { translations } from '../lib/translations';
import { Menu, X, Calendar, Globe } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  onSelectLang?: (lang: Language) => void;
  activeSection?: string;
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  onSelectLang,
  activeSection = 'hero',
  onOpenBooking,
}) => {
  const t = translations[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSwitchLanguage = (newLang: Language) => {
    if (onSelectLang) {
      onSelectLang(newLang);
    } else if (lang !== newLang) {
      onToggleLang();
    }
  };

  const navLinks = [
    { href: '#accommodation', label: t.nav.accommodation },
    { href: '#amenities', label: t.nav.amenities },
    { href: '#packages', label: t.nav.packages },
    { href: '#trips', label: t.nav.trips },
    { href: '#gallery', label: t.nav.gallery },
    { href: '#about', label: t.nav.about },
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
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D8] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 md:h-20">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <a
              href="#"
              className="flex items-center gap-2 group focus:outline-none"
              aria-label="Jazz Camp Home"
            >
              <Logo size="md" variant="navy" lang={lang} showSubtext={false} />
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`font-['Cairo'] text-sm font-semibold transition-colors duration-200 py-1 border-b-2 ${
                  activeSection === link.href.substring(1)
                    ? 'text-[#D94E28] border-[#D94E28]'
                    : 'text-[#0F223D] border-transparent hover:text-[#D94E28]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Segmented Language Switcher (EN | عربي) */}
            <div
              id="lang-toggle-segmented"
              className="inline-flex items-center p-1 rounded-full border border-[#CBD5E1] bg-white shadow-xs"
              role="group"
              aria-label="Language selection"
            >
              <button
                type="button"
                onClick={() => handleSwitchLanguage('en')}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold font-['Cairo'] transition-all duration-200 focus:outline-none ${
                  lang === 'en'
                    ? 'bg-[#0F223D] text-white shadow-xs scale-102'
                    : 'text-[#64748B] hover:text-[#0F223D]'
                }`}
                title="Switch to English"
                aria-pressed={lang === 'en'}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleSwitchLanguage('ar')}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold font-['Cairo'] transition-all duration-200 focus:outline-none ${
                  lang === 'ar'
                    ? 'bg-[#D94E28] text-white shadow-xs scale-102'
                    : 'text-[#64748B] hover:text-[#0F223D]'
                }`}
                title="التحويل إلى اللغة العربية"
                aria-pressed={lang === 'ar'}
              >
                عربي
              </button>
            </div>

            {/* Prominent On-Site Book Now Button */}
            <button
              id="header-book-now-btn"
              onClick={onOpenBooking}
              className="inline-flex items-center justify-center gap-2 bg-[#D94E28] hover:bg-[#C2411C] active:scale-95 text-white font-['Cairo'] font-bold text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-200"
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
        <div className="lg:hidden bg-white border-b border-[#E2E8F0] shadow-xl animate-fadeIn">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`block px-4 py-2.5 rounded-xl font-['Cairo'] text-sm font-semibold transition-colors ${
                  activeSection === link.href.substring(1)
                    ? 'bg-[#FFF1ED] text-[#D94E28]'
                    : 'text-[#0F223D] hover:bg-[#F8FAFC]'
                }`}
              >
                {link.label}
              </a>
            ))}

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

              <div className="flex items-center justify-between px-2 pt-2 border-t border-[#E2E8F0]">
                <span className="text-xs text-[#64748B] font-['Cairo'] font-semibold">
                  {lang === 'ar' ? 'اللغة / Language' : 'Language / اللغة'}
                </span>
                <div className="inline-flex items-center p-1 rounded-full border border-[#CBD5E1] bg-white shadow-xs">
                  <button
                    type="button"
                    onClick={() => {
                      handleSwitchLanguage('en');
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold font-['Cairo'] transition-all ${
                      lang === 'en' ? 'bg-[#0F223D] text-white shadow-xs' : 'text-[#64748B]'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleSwitchLanguage('ar');
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold font-['Cairo'] transition-all ${
                      lang === 'ar' ? 'bg-[#D94E28] text-white shadow-xs' : 'text-[#64748B]'
                    }`}
                  >
                    عربي
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
