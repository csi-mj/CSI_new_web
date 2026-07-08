import type { Metadata } from 'next';
import { StripedPattern } from "@/components/magicui/striped-pattern";

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Hackathons, workshops, and tech events by CSI MJCET — including Hack Revolution, the flagship hackathon of the Computer Society of India chapter at MJCET, Hyderabad.',
  alternates: { canonical: '/events' }
};

export default function EventsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="relative mt-24">
            <div className="fixed inset-0 opacity-60 pointer-events-none" aria-hidden>
                <StripedPattern className="text-gray-600/60" />
            </div>
            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    );
}
