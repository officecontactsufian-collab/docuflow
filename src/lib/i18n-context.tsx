
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
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

export type Locale = 'en' | 'fr' | 'es' | 'ar' | 'zh' | 'de' | 'ja' | 'pt' | 'ru' | 'it';

const translations: Record<Locale, any> = { en, fr, es, ar, zh, de, ja, pt, ru, it };

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLocale }: { children: ReactNode, initialLocale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  
  // Robust initialization: Priority 1: URL Param, Priority 2: LocalStorage, Priority 3: English
  const getInitialLocale = (): Locale => {
    if (params?.locale) return params.locale as Locale;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('docflow_locale');
      if (saved && Object.keys(translations).includes(saved)) return saved as Locale;
    }
    return initialLocale || 'en';
  };

  const [locale, setLocaleState] = useState<Locale>(getInitialLocale());

  // Update HTML lang and direction attributes (Support RTL for Arabic)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale]);

  // Sync state if URL param changes
  useEffect(() => {
    if (params?.locale && params.locale !== locale) {
      setLocaleState(params.locale as Locale);
    }
  }, [params?.locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('docflow_locale', newLocale);
    }
    
    // Industrial Route Substitution
    const pathSegments = pathname.split('/');
    if (pathSegments.length > 1) {
      // Find where the locale was and swap it
      const localesList = Object.keys(translations);
      const localeIdx = pathSegments.findIndex(seg => localesList.includes(seg));
      if (localeIdx !== -1) {
        pathSegments[localeIdx] = newLocale;
        router.push(pathSegments.join('/'));
      } else {
        // Fallback for root path
        router.push(`/${newLocale}`);
      }
    }
  };

  // High-fidelity nested translation lookup
  const t = (key: string): string => {
    const keys = key.split('.');
    let result = translations[locale] || translations['en'];
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        // Absolute Fallback to English
        let engFallback = translations['en'];
        for (const ek of keys) {
          engFallback = engFallback?.[ek];
        }
        return (typeof engFallback === 'string') ? engFallback : key;
      }
    }
    return typeof result === 'string' ? result : key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
}
