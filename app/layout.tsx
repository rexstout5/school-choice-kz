import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";


export const metadata: Metadata = {
  title: "School Choice KZ — выбор школы для ребенка",
  description: "Современный каталог школ Казахстана для родителей: фильтры, сравнение и полезная информация.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
