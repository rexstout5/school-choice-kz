import './globals.css';

export const metadata = {
  title: 'School Choice Kazakhstan',
  description: 'Сравните государственные и частные школы Астаны по району, языку, цене, рейтингу и программам.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
