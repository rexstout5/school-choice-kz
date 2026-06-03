import Link from "next/link";
import { Footer } from "@/components/Footer";

const values = [
  "Прозрачные критерии вместо случайных рекомендаций",
  "Уважение к разным образовательным траекториям",
  "Практичные вопросы для визита в школу",
  "Современный интерфейс для быстрого семейного решения",
];

export default function AboutPage() {
  return (
    <main>
      <section className="container-page grid gap-10 pb-16 pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <span className="pill">О проекте</span>
          <h1 className="mt-5 text-5xl font-black tracking-[-0.05em] text-ink md:text-6xl">Мы делаем выбор школы спокойнее и понятнее</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            School Choice KZ — это прототип цифрового сервиса для родителей, которые хотят сравнить школы не только по рейтингу, но и по ежедневному опыту ребенка: языку, среде, программам, нагрузке и бюджету.
          </p>
          <Link href="/catalog" className="mt-8 inline-flex rounded-full bg-blue-600 px-8 py-4 font-black text-white shadow-xl shadow-blue-500/25 transition hover:-translate-y-1 hover:bg-ink">
            Перейти в каталог
          </Link>
        </div>
        <div className="glass-card rounded-[2.5rem] p-8 md:p-10">
          <h2 className="text-3xl font-black text-ink">Наш подход</h2>
          <div className="mt-7 space-y-4">
            {values.map((value, index) => (
              <div key={value} className="flex gap-4 rounded-3xl bg-white p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 font-black text-blue-600">{index + 1}</span>
                <p className="font-semibold leading-7 text-slate-700">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="rounded-[2.5rem] bg-ink p-8 text-white md:p-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-200">Для родителей</p>
              <h2 className="mt-4 text-3xl font-black">Быстрый короткий список</h2>
              <p className="mt-4 leading-7 text-blue-100">Соберите 3–5 школ для посещения и заранее поймите, какие вопросы задать.</p>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-200">Для школ</p>
              <h2 className="mt-4 text-3xl font-black">Понятная презентация</h2>
              <p className="mt-4 leading-7 text-blue-100">Покажите сильные стороны, программы, стоимость и особенности среды в удобном формате.</p>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-200">Для города</p>
              <h2 className="mt-4 text-3xl font-black">Данные о запросах семей</h2>
              <p className="mt-4 leading-7 text-blue-100">Аналитика помогает видеть, какие образовательные опции востребованы в районах.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
