import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'DOCFLOW Professional - Advanced PDF Solutions',
  description: 'The ultimate professional document management platform with high-fidelity conversion, manipulation, and security tools.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Dancing+Script:wght@400;700&family=Pacifico&family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background selection:bg-primary/20">
        <FirebaseClientProvider>
          <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-muted/30">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            {children}
          </Suspense>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
