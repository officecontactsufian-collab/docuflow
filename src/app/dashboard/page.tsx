
"use client"

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LegacyDashboardPage() {
  const router = useRouter();

  React.useEffect(() => {
    // Redundant route security redirection
    router.replace('/');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
