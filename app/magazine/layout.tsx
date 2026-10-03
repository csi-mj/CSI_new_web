import type { Metadata } from 'next';
import { StripedPattern } from "@/components/magicui/striped-pattern";

export const metadata: Metadata = {
  title: 'Magazine',
  description:
    'Read the CSI MJCET magazine — articles, insights, and stories from the Computer Society of India student chapter at MJCET, Hyderabad.',
  alternates: { canonical: '/magazine' }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative mt-24">
      <div className="fixed inset-0 opacity-60 pointer-events-none" aria-hidden>
        <StripedPattern className="text-gray-600/60" />
      </div>
      <div className="relative z-10">
        {children}
      </div>

    </div>
  );
}
