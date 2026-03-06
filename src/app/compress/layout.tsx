import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compress PDF',
  description: 'Optimize PDF file size for web delivery. Rebuilds internal object streams for maximum efficiency without loss of structural integrity.',
};

export default function CompressLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
