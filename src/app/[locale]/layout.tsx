import React from 'react';
import { notFound } from 'next/navigation';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { LanguageProvider } from '@/lib/i18n-context';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';

const locales = ['en', 'fr', 'es', 'ar', 'zh', 'de', 'ja', 'pt', 'ru', 'it'];

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(
  { params }: LocaleLayoutProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://docflow.pro';

  // Hreflang alternates for SEO
  const languages: Record<string, string> = {};
  locales.forEach((l) => {
    languages[l] = `${baseUrl}/${l}`;
  });

  return {
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: languages,
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
