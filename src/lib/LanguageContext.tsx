import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('jazz_camp_lang') || localStorage.getItem('droub_camp_lang');
      if (saved === 'ar' || saved === 'en') return saved as Language;
    } catch {}
    return 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('jazz_camp_lang', newLang);
      localStorage.setItem('droub_camp_lang', newLang);
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    } catch {}
  };

  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  useEffect(() => {
    try {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('jazz_camp_lang', lang);
      localStorage.setItem('droub_camp_lang', lang);
    } catch {}
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    const fallbackLang: Language =
      typeof window !== 'undefined' &&
      (localStorage.getItem('jazz_camp_lang') || localStorage.getItem('droub_camp_lang')) === 'ar'
        ? 'ar'
        : 'en';
    return {
      lang: fallbackLang,
      setLang: () => {},
      toggleLang: () => {},
    };
  }
  return context;
};
