import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Merge PDF',
  description: 'Combine multiple PDF documents into a single professional asset. Secure, local-first merging with visual sequence control.',
};

export default function MergeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
