import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

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
  // The html and body tags are managed by the localized layout [locale]/layout.tsx
  // This root layout serves as a passthrough for global providers and metadata.
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
