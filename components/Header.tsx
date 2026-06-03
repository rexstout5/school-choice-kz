import Link from "next/link";

const navItems = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог школ" },
  { href: "/about", label: "О проекте" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="School Choice KZ">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-teal-400 text-lg font-black text-white shadow-lg shadow-blue-500/25">
            S
          </span>
          <span>
            <span className="block text-lg font-black tracking-tight text-ink">School Choice</span>
            <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">Kazakhstan</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-blue-600">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/catalog" className="hidden rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-blue-700 sm:inline-flex">
          Найти школу
        </Link>
      </div>
    </header>
  );
}
