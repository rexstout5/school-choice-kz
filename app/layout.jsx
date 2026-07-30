import './globals.css';
import { brand } from '../src/data/brand.js';
import PrivacyControls from '../src/components/PrivacyControls.jsx';

export const metadata = {
  title: { default: brand.name, template: brand.titleTemplate },
  description: brand.description.ru,
  alternates: { canonical: '/' },
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
    <html lang="ru">
      <body>{children}<PrivacyControls /></body>
    </html>
  );
}
