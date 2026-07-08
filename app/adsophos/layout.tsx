import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Adsophos',
  description:
    'Adsophos — the annual flagship event by CSI MJCET, the Computer Society of India student chapter at MJCET, Hyderabad.',
  alternates: { canonical: '/adsophos' }
};

export default function AdsophosLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
