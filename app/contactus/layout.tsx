import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with CSI MJCET — contact the coordinators of the Computer Society of India student chapter at MJCET, Hyderabad.',
  alternates: { canonical: '/contactus' }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="mt-24">{children}</div>;
}
