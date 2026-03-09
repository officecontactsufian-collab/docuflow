
import React from 'react';
import { notFound } from 'next/navigation';

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
    <div className="min-h-screen" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
}
