import type { Metadata } from 'next';
import { Geist, Geist_Mono, Silkscreen, Orbitron, Inter, Space_Grotesk,Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/shared/Navbar';
import { CursorWrapper } from '@/components/shared/CursorWrapper';
import Footer from '@/components/shared/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

const poppins = Poppins({
  weight: ['400', '700'],
  variable: '--font-poppins',
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
  metadataBase: new URL('https://csi-mjcet.in'),
  title: {
    default: 'Computer Society of India | MJCET',
    template: '%s | CSI MJCET'
  },
  description:
    'CSI MJCET is the Computer Society of India student chapter at Muffakham Jah College of Engineering & Technology, Hyderabad. Empowering students through hackathons, workshops, and tech events since 2014.',
  keywords: ['CSI MJCET', 'Computer Society of India', 'MJCET', 'Hack Revolution', 'Hyderabad', 'student chapter'],
  openGraph: {
    title: 'Computer Society of India | MJCET',
    description:
      'Official CSI student chapter at MJCET, Hyderabad — hackathons, workshops, and a community of future tech leaders.',
    url: 'https://csi-mjcet.in',
    siteName: 'CSI MJCET',
    images: ['/logos/csi_logo.png'],
    locale: 'en_IN',
    type: 'website'
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  verification: {
    google: 'pdD89cAr0bl-Gj_8qS9y57KoK5ZN0o-suyC7CX4fbfY'
  }
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Computer Society of India, MJCET Student Chapter',
  alternateName: 'CSI MJCET',
  url: 'https://csi-mjcet.in',
  logo: 'https://csi-mjcet.in/logos/csi_logo.png',
  email: 'csi@mjcollege.ac.in',
  foundingDate: '2014',
  parentOrganization: {
    '@type': 'Organization',
    name: 'Computer Society of India',
    url: 'https://www.csi-india.org'
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Muffakham Jah College of Engineering & Technology, Mount Pleasant, Road No. 3, Banjara Hills',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    postalCode: '500034',
    addressCountry: 'IN'
  },
  sameAs: [
    'https://www.instagram.com/csi_mjcet',
    'https://www.linkedin.com/company/csi-mjcet',
    'https://github.com/orgs/csi-mj',
    'https://medium.com/@csi_mjcet'
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${silkscreen.variable} ${orbitron.variable} ${inter.variable} ${spaceGrotesk.variable} ${poppins.variable} min-h-screen bg-black text-white antialiased m-0 p-0`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* <ReduxProvider> */}
          <CursorWrapper />
          <Navbar />
          <main className="m-0 p-0 w-screen overflow-x-hidden" style={{ margin: 0, padding: 0 }}>{children}</main>
          <Footer />
        {/* </ReduxProvider> */}
      </body>
    </html>
  );
}
