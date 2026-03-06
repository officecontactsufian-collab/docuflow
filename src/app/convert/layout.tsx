import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Transformation Engine',
  description: 'Reconstruct documents between Word, Excel, JPG, and PPT formats with archival-grade fidelity.',
};

export default function ConvertLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
