import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "School Choice KZ — выбор школы в Казахстане",
  description: "Каталог школ Казахстана с поиском, фильтрами и подробными карточками."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <header className="site-header">
          <Link className="logo" href="/" aria-label="School Choice KZ">
            School<span>Choice</span>KZ
          </Link>
          <nav aria-label="Главная навигация">
            <Link href="/schools">Каталог школ</Link>
            <a href="/#how-it-works">Как выбрать</a>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <p>© 2026 School Choice KZ. Помогаем семьям сравнивать школы осознанно.</p>
        </footer>
      </body>
    </html>
  );
}
