
import React from 'react';
import { notFound } from 'next/navigation';
import { FirebaseClientProvider } from '@/firebase/client-provider';
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
  
  // Use a fallback for the base translations
  const t = translationRegistry[locale] || translationRegistry['en'];
  const seo = t.seo || translationRegistry['en'].seo;

  // Hreflang alternates for global indexing
  const languages: Record<string, string> = {};
  locales.forEach((l) => {
    languages[l] = `${baseUrl}/${l}`;
  });

  const defaultTitle = seo.default.title;
  const defaultDesc = seo.default.desc;

  return {
    title: {
      default: defaultTitle,
      template: `%s | DOCFLOW`
    },
    description: defaultDesc,
    keywords: seo.default.keywords,
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
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'DOCFLOW Professional',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDesc,
      images: [`${baseUrl}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <FirebaseClientProvider>
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
    </FirebaseClientProvider>
  );
}
