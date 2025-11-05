import type { Metadata } from 'next';
import { Geist, Geist_Mono, Silkscreen, Orbitron, Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/shared/Navbar';
import { CursorWrapper } from '@/components/shared/CursorWrapper';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

const silkscreen = Silkscreen({
  weight: ['400', '700'],
  variable: '--font-silkscreen',
  subsets: ['latin']
});

const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin']
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin']
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'CSI',
  description: 'CSI'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${silkscreen.variable} ${orbitron.variable} ${inter.variable} ${spaceGrotesk.variable} min-h-screen bg-black text-white antialiased`}
        style={{ margin: 0, padding: 0 }}
      >
        {/* <ReduxProvider> */}
          <CursorWrapper />
          <Navbar />
          <main className="m-0 p-0 w-screen overflow-x-hidden" style={{ margin: 0, padding: 0 }}>{children}</main>
        {/* </ReduxProvider> */}
      </body>
    </html>
  );
}
