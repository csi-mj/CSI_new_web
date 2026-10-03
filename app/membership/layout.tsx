import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Membership',
  description:
    'Become a member of CSI MJCET — join the Computer Society of India student chapter at MJCET, Hyderabad, and be part of a community of future tech leaders.',
  alternates: { canonical: '/membership' }
};

export default function MembershipLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
