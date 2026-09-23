import React from 'react';
import { Logo } from './Logo';
import { Language } from '../types';
import { translations } from '../lib/translations';
import { WHATSAPP_PHONE_DISPLAY } from '../lib/whatsapp';
import { MapPin, Phone, MessageCircle, Instagram, Facebook, Heart } from 'lucide-react';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="main-footer" className="bg-[#0A1628] text-white border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <Logo variant="light" size="md" lang={lang} />
            <p className="font-['Tajawal'] text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              {t.footer.desc}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/droub.camp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#C13584] flex items-center justify-center text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/droub.camp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#1877F2] flex items-center justify-center text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/201061189414`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#25D366] flex items-center justify-center text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-['Cairo'] font-bold text-base text-white mb-4 border-b border-white/10 pb-2">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 font-['Cairo'] text-xs sm:text-sm text-[#CBD5E1]">
              <li>
                <a
                  href="#accommodation"
                  onClick={(e) => handleNavClick(e, '#accommodation')}
                  className="hover:text-[#D94E28] transition-colors"
                >
                  {t.nav.accommodation}
                </a>
              </li>
              <li>
                <a
                  href="#amenities"
                  onClick={(e) => handleNavClick(e, '#amenities')}
                  className="hover:text-[#D94E28] transition-colors"
                >
                  {t.nav.amenities}
                </a>
              </li>
              <li>
                <a
                  href="#packages"
                  onClick={(e) => handleNavClick(e, '#packages')}
                  className="hover:text-[#D94E28] transition-colors"
                >
                  {t.nav.packages}
                </a>
              </li>
              <li>
                <a
                  href="#trips"
                  onClick={(e) => handleNavClick(e, '#trips')}
                  className="hover:text-[#D94E28] transition-colors"
                >
                  {t.nav.trips}
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  onClick={(e) => handleNavClick(e, '#gallery')}
                  className="hover:text-[#D94E28] transition-colors"
                >
                  {t.nav.gallery}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Adventures & Highlights */}
          <div>
            <h4 className="font-['Cairo'] font-bold text-base text-white mb-4 border-b border-white/10 pb-2">
              {t.footer.adventuresTitle}
            </h4>
            <ul className="space-y-2.5 font-['Tajawal'] text-xs sm:text-sm text-[#CBD5E1]">
              {t.footer.adventuresItems.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div>
            <h4 className="font-['Cairo'] font-bold text-base text-white mb-4 border-b border-white/10 pb-2">
              {t.footer.contactTitle}
            </h4>
            <div className="space-y-3 font-['Tajawal'] text-xs sm:text-sm text-[#CBD5E1]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D94E28] flex-shrink-0 mt-0.5" />
                <span>{t.location.mapAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D94E28] flex-shrink-0" />
                <a href={`tel:${WHATSAPP_PHONE_DISPLAY}`} className="hover:text-white transition-colors dir-ltr">
                  {WHATSAPP_PHONE_DISPLAY}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                <a
                  href={`https://wa.me/201061189414`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors dir-ltr"
                >
                  01061189414 ({lang === 'ar' ? 'واتساب' : 'WhatsApp'})
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-['Cairo'] text-[#94A3B8]">
          <p>{t.footer.rightsReserved}</p>
          <div className="flex items-center gap-1 text-[#D94E28]">
            <span>{t.footer.craftedWithSinaiSpirit}</span>
            <Heart className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};

