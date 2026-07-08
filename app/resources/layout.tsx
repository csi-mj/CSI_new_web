import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'Learning resources curated by CSI MJCET — roadmaps, tools, and study material from the Computer Society of India student chapter at MJCET, Hyderabad.',
  alternates: { canonical: '/resources' }
};

export default function ResourcesLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
