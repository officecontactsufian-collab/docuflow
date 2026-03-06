import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Shield & Unlock',
  description: 'Hardened metadata stripping and restriction removal for professional PDF assets. Secure local-first processing.',
};

export default function ProtectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
