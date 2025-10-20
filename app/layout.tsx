import type { Metadata } from 'next';
import { Geist, Geist_Mono, Silkscreen } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/shared/Navbar';

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
        className={`${geistSans.variable} ${geistMono.variable} ${silkscreen.variable} antialiased min-h-screen bg-black text-white`}
      >
        <Navbar />
        <main className="pt-0">{children}</main>
      </body>
    </html>
  );
}
