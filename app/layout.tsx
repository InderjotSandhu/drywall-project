import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({ subsets: ['latin'], weight: ['400','600','700'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Drywall Services in Toronto GTA | New Canadian Drywall',
  description: 'Expert drywall installation, steel-stud framing, acoustic partitions & Level 5 finishing for residential and commercial projects across the GTA. Licensed & insured. Free estimates.',
  openGraph: {
    title: 'New Canadian Drywall — Professional Drywall Services in the GTA',
    description: 'Premium drywall installation, steel-stud framing, acoustic partitions & Level 5 finishing for residential and commercial projects. Licensed & insured.',
    url: 'https://www.newcanadiandrywall.ca',
    siteName: 'New Canadian Drywall',
    locale: 'en_CA',
    type: 'website',
    images: [{ url: 'https://www.newcanadiandrywall.ca/images/Photos%20Ancaster/IMG_8378.jpeg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Canadian Drywall — Professional Drywall Services in the GTA',
    description: 'Premium drywall installation, steel-stud framing, acoustic partitions & Level 5 finishing. Licensed & insured.',
    images: ['https://www.newcanadiandrywall.ca/images/Photos%20Ancaster/IMG_8378.jpeg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'New Canadian Drywall',
  image: 'https://www.newcanadiandrywall.ca/images/Photos%20Ancaster/IMG_8378.jpeg',
  telephone: '+1 (416) 452-2181',
  email: 'info@newcanadiandrywall.ca',
  areaServed: 'Greater Toronto Area',
  url: 'https://www.newcanadiandrywall.ca',
  priceRange: '$$',
  openingHours: 'Mo-Fr 07:00-18:00',
  serviceType: [
    'Drywall Installation',
    'Steel-Stud Framing',
    'Acoustic Partitions',
    'Fire-Rated Systems',
    'Skim-Coat Finishing',
    'Taping and Sanding',
  ],
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Ontario',
    addressCountry: 'CA',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ colorScheme: 'dark' }}>
      <body className={poppins.className} id="app-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
