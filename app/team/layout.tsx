import Waves from "@/components/Waves";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative m-0 p-0 w-screen min-h-screen overflow-hidden">
      <Waves
        lineColor="rgba(255,255,255,0.08)"
        backgroundColor="transparent"
        className="pointer-events-none"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
