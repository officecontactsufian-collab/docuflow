import React from 'react';
import { notFound } from 'next/navigation';
import { LanguageProvider } from '@/lib/i18n-context';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';
import { StructuredData } from '@/components/structured-data';

// Support Registry
const locales = ['en', 'fr', 'es', 'ar', 'zh', 'de', 'ja', 'pt', 'ru', 'it'];

// Import translations for metadata (Server-side compatible)
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';
import fr from '@/locales/fr.json';
import es from '@/locales/es.json';
import de from '@/locales/de.json';
import it from '@/locales/it.json';
import ja from '@/locales/ja.json';
import pt from '@/locales/pt.json';
import ru from '@/locales/ru.json';
import zh from '@/locales/zh.json';

const translationRegistry: Record<string, any> = { en, ar, fr, es, de, it, ja, pt, ru, zh };

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

/**
 * Industrial SEO Metadata Engine
 * Dynamically generates metadata based on locale and active route segment.
 */
export async function generateMetadata(
  { params }: LocaleLayoutProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://docflow.pro';
  
  const t = translationRegistry[locale] || translationRegistry['en'];
  const seo = t?.seo || translationRegistry['en']?.seo || {};

  const languages: Record<string, string> = {};
  locales.forEach((l) => {
    languages[l] = `${baseUrl}/${l}`;
  });

  const defaultTitle = seo?.default?.title || "DOCFLOW Professional - Industrial Document Intelligence";
  const defaultDesc = seo?.default?.desc || "High-performance, local-first document intelligence workspace.";
  const defaultKeywords = seo?.default?.keywords || "PDF tools, Document Intelligence, Merge PDF";

  return {
    title: {
      default: defaultTitle,
      template: `%s | DOCFLOW`
    },
    description: defaultDesc,
    keywords: defaultKeywords,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: languages,
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: `${baseUrl}/${locale}`,
      siteName: 'DOCFLOW Professional',
      title: defaultTitle,
      description: defaultDesc,
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <LanguageProvider initialLocale={locale as any}>
      <StructuredData locale={locale} />
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center bg-muted/30">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest text-accent/40 italic">Initializing Protocol Stream...</p>
          </div>
        </div>
      }>
        {children}
      </Suspense>
    </LanguageProvider>
  );
}
