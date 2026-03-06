import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Split PDF',
  description: 'Extract specific pages or ranges from your PDF documents. High-fidelity page segmentation with visual mapping.',
};

export default function SplitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
