import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scan to PDF',
  description: 'Direct hardware-to-document capture. Convert camera streams or images into professional high-fidelity PDF containers.',
};

export default function ScanToPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
