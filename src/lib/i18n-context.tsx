'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '@/locales/en.json';
import fr from '@/locales/fr.json';
import es from '@/locales/es.json';
import ar from '@/locales/ar.json';
import zh from '@/locales/zh.json';
import de from '@/locales/de.json';
import ja from '@/locales/ja.json';
import pt from '@/locales/pt.json';
import ru from '@/locales/ru.json';
import it from '@/locales/it.json';

type Locale = 'en' | 'fr' | 'es' | 'ar' | 'zh' | 'de' | 'ja' | 'pt' | 'ru' | 'it';

const translations: Record<Locale, any> = { en, fr, es, ar, zh, de, ja, pt, ru, it };

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
    const pathSegments = window.location.pathname.split('/');
    const currentLocale = pathSegments[1] as Locale;
    
    if (translations[currentLocale]) {
      setLocale(currentLocale);
    } else {
      const saved = localStorage.getItem('docflow_locale') as Locale;
      if (saved && translations[saved]) setLocale(saved);
    }
    
    setIsHydrated(true);
  }, []);

  const t = (key: string): string => {
    const keys = key.split('.');
    let result = translations[locale] || translations['en'];
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        let engFallback = translations['en'];
        for (const ek of keys) {
          engFallback = engFallback?.[ek];
        }
        return (typeof engFallback === 'string') ? engFallback : key;
      }
    }
    return typeof result === 'string' ? result : key;
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
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
}
