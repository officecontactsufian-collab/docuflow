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
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLocale }: { children: ReactNode, initialLocale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Sync state if initialLocale changes (e.g. on navigation)
  useEffect(() => {
    if (initialLocale && initialLocale !== locale) {
      setLocaleState(initialLocale);
    }
  }, [initialLocale, locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('docflow_locale', newLocale);
    }
    
    // Redirect if currently in a localized path to maintain URL consistency
    const pathSegments = pathname.split('/');
    if (pathSegments[1] && translations[pathSegments[1] as Locale]) {
      pathSegments[1] = newLocale;
      router.push(pathSegments.join('/'));
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let result = translations[locale] || translations['en'];
    
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
