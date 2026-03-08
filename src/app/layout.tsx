import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { LanguageProvider } from '@/lib/i18n-context';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  metadataBase: new URL('https://docflow.pro'),
  title: {
    default: 'DOCFLOW Professional - Industrial Document Intelligence',
    template: '%s | DOCFLOW Professional'
  },
  description: 'High-performance, local-first document intelligence workspace. Securely merge, split, compress, and sign PDF documents with zero-retention architecture.',
  keywords: ['PDF tools', 'Document Intelligence', 'Merge PDF', 'Split PDF', 'Digital Signature', 'Local-first PDF', 'Secure Document Processing', 'PDF Metadata Strip'],
  authors: [{ name: 'DOCFLOW Protocols' }],
  creator: 'DOCFLOW Professional',
  publisher: 'DOCFLOW Professional',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://docflow.pro',
    siteName: 'DOCFLOW Professional',
    title: 'DOCFLOW Professional - Industrial Document Intelligence',
    description: 'The industrial benchmark for local-first document manipulation. Secure, private, and instant.',
    images: [
      {
        url: 'https://picsum.photos/seed/docflow-og/1200/630',
        width: 1200,
        height: 630,
        alt: 'DOCFLOW Professional Interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DOCFLOW Professional - Secure Document Intelligence',
    description: 'High-fidelity document tools with zero cloud retention.',
    images: ['https://picsum.photos/seed/docflow-og/1200/630'],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Dancing+Script:wght@400;700&family=Pacifico&family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background selection:bg-primary/20">
        <FirebaseClientProvider>
          <LanguageProvider>
            <Suspense fallback={
              <div className="flex min-h-screen items-center justify-center bg-muted/30">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }>
              {children}
            </Suspense>
            <Toaster />
          </LanguageProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
