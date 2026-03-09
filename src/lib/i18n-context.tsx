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

type Locale = 'en' | 'fr' | 'es' | 'ar' | 'zh' | 'de' | 'ja' | 'pt' | 'ru' | 'it';

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
  
  // Robust initialization using the URL segment to avoid hydration mismatch
  const activeLocale = (params?.locale as Locale) || initialLocale || 'en';
  const [locale, setLocaleState] = useState<Locale>(activeLocale);

  // Synchronize HTML attributes with the active locale to support RTL/LTR
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale]);

  // Handle locale shifts from navigation events
  useEffect(() => {
    if (params?.locale && params.locale !== locale) {
      setLocaleState(params.locale as Locale);
    }
  }, [params?.locale, locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('docflow_locale', newLocale);
    }
    
    const pathSegments = pathname.split('/');
    const localesList = ['en', 'fr', 'es', 'ar', 'zh', 'de', 'ja', 'pt', 'ru', 'it'];
    
    // Redirect if currently in a localized tunnel
    if (pathSegments[1] && localesList.includes(pathSegments[1])) {
      pathSegments[1] = newLocale;
      router.push(pathSegments.join('/'));
    } else {
      router.push(`/${newLocale}${pathname === '/' ? '' : pathname}`);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let result = translations[locale] || translations['en'];
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        // Industrial Fallback: Recover from English registry
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
