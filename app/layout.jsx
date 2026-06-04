import './globals.css';

export const metadata = {
  title: 'School Choice Kazakhstan',
  description: 'Compare Astana public and private schools by district, language, price, rating, and programs.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
