import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'About CSI MJCET — the Computer Society of India student chapter at Muffakham Jah College of Engineering & Technology, empowering students since 2014.',
  alternates: { canonical: '/about' }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="mt-24">{children}</div>;
}
