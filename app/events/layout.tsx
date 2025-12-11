import { StripedPattern } from "@/components/magicui/striped-pattern";

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
