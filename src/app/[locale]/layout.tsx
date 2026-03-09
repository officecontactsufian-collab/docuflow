import React from 'react';
import { notFound } from 'next/navigation';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { LanguageProvider } from '@/lib/i18n-context';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export async function generateStaticParams() {
  return [
    { locale: 'en' }, { locale: 'fr' }, { locale: 'es' },
    { locale: 'ar' }, { locale: 'zh' }, { locale: 'de' },
    { locale: 'ja' }, { locale: 'pt' }, { locale: 'ru' },
    { locale: 'it' }
  ];
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const locales = ['en', 'fr', 'es', 'ar', 'zh', 'de', 'ja', 'pt', 'ru', 'it'];

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
