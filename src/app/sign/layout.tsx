import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Signature',
  description: 'Apply professional digital signatures to your PDF documents. Identity synthesis with "wet ink" and script synthesis engines.',
};

export default function SignLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
