import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-blue-100 bg-white/70">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-xl font-black text-ink">School Choice KZ</p>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
            Помогаем родителям сравнивать школы по понятным критериям: программа, стоимость, язык обучения, район и атмосфера.
          </p>
        </div>
        <div>
          <p className="font-bold text-ink">Разделы</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
            <Link href="/catalog" className="hover:text-blue-600">Каталог школ</Link>
            <Link href="/about" className="hover:text-blue-600">О проекте</Link>
          </div>
        </div>
        <div>
          <p className="font-bold text-ink">Контакты</p>
          <p className="mt-4 text-sm text-slate-600">hello@schoolchoice.kz</p>
          <p className="mt-2 text-sm text-slate-600">Астана, Казахстан</p>
        </div>
      </div>
    </footer>
  );
}
