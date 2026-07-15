import './globals.css';
import { Manrope } from 'next/font/google';
import { brand } from '../src/data/brand.js';

const manrope = Manrope({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '600', '700'], display: 'swap' });

export const metadata = {
  title: { default: brand.name, template: brand.titleTemplate },
  description: brand.description.ru,
  metadataBase: new URL(brand.url),
  openGraph: {
    title: brand.name,
    description: brand.description.ru,
    url: brand.url,
    siteName: brand.name,
    locale: brand.locale,
    type: 'website'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={manrope.className}>
      <body>{children}</body>
    </html>
  );
}
