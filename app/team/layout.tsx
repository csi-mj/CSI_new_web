import type { Metadata } from 'next';
import Waves from "@/components/Waves";

export const metadata: Metadata = {
  title: 'Team',
  description:
    'Meet the team behind CSI MJCET — the Governing Body, Core Team, and Executive Committee of the Computer Society of India student chapter at MJCET, Hyderabad.',
  alternates: { canonical: '/team' }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative m-0 p-0 w-screen min-h-screen overflow-hidden">
      <Waves
        lineColor="rgba(255,255,255,0.09)"
        backgroundColor="transparent"
        // className="pointer-events-none"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
