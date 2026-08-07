import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SIH 2026 Registration',
  description:
    'Register your team for the Smart India Hackathon through CSI MJCET. Open to MJCET students with a college email ID.',
  robots: { index: false, follow: false }
};

export default function SihLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="mt-24">{children}</div>;
}
