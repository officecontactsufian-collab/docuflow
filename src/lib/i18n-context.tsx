
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
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
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // params.locale is available during SSR for client components within localized route segments
  const urlLocale = params?.locale as string;
  
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isHydrated, setIsHydrated] = useState(false);

  // Determine the locale to use for rendering synchronously.
  // This ensures that the server-rendered HTML matches the initial client-side render.
  const activeLocale: Locale = useMemo(() => {
    if (urlLocale && translations[urlLocale as Locale]) {
      return urlLocale as Locale;
    }
    return locale;
  }, [urlLocale, locale]);

  useEffect(() => {
    // On the client, if we are not in a localized route, try to restore from localStorage
    if (!urlLocale) {
      const saved = localStorage.getItem('docflow_locale') as Locale;
      if (saved && translations[saved]) {
        setLocaleState(saved);
      }
    }
    setIsHydrated(true);
  }, [urlLocale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('docflow_locale', newLocale);
    
    // Redirect if currently in a localized path to maintain URL consistency
    if (urlLocale && translations[urlLocale as Locale]) {
      const pathSegments = pathname.split('/');
      // Format: /locale/subpath...
      if (pathSegments[1] === urlLocale) {
        pathSegments[1] = newLocale;
        router.push(pathSegments.join('/'));
      }
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let result = translations[activeLocale] || translations['en'];
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        // Fallback to English if the translation key is missing
        let engFallback = translations['en'];
        for (const ek of keys) {
          engFallback = engFallback?.[ek];
        }
        return (typeof engFallback === 'string') ? engFallback : key;
      }
    }
    return typeof result === 'string' ? result : key;
  };

  // Synchronize document metadata attributes on the client
  useEffect(() => {
    if (isHydrated) {
      document.documentElement.lang = activeLocale;
      document.documentElement.dir = activeLocale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [activeLocale, isHydrated]);

  return (
    <LanguageContext.Provider value={{ locale: activeLocale, setLocale, t, isHydrated }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
}
