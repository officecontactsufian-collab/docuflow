
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '@/locales/en.json';
import fr from '@/locales/fr.json';
import es from '@/locales/es.json';
import ar from '@/locales/ar.json';
import zh from '@/locales/zh.json';
import de from '@/locales/de.json';
import ja from '@/locales/ja.json';

type Locale = 'en' | 'fr' | 'es' | 'ar' | 'zh' | 'de' | 'ja';

const translations: Record<Locale, any> = { en, fr, es, ar, zh, de, ja };

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  isHydrated: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('docflow_locale') as Locale;
    if (saved && translations[saved]) {
      setLocale(saved);
    } else {
      const browserLang = navigator.language.split('-')[0] as Locale;
      if (translations[browserLang]) setLocale(browserLang);
    }
    setIsHydrated(true);
  }, []);

  const t = (key: string): string => {
    // CRITICAL: Force English during hydration to match SSR
    const currentLocale = isHydrated ? locale : 'en';
    const keys = key.split('.');
    let result = translations[currentLocale];
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        // Fallback to English if key missing in target locale
        let engFallback = translations['en'];
        for (const ek of keys) {
          engFallback = engFallback?.[ek];
        }
        return engFallback || key;
      }
    }
    return result as string;
  };

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('docflow_locale', locale);
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale, isHydrated]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isHydrated }}>
      <div suppressHydrationWarning>{children}</div>
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
}
