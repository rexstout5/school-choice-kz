import Link from "next/link";
import { Footer } from "@/components/Footer";
import { SchoolCard } from "@/components/SchoolCard";
import { schools } from "@/lib/schools";

const features = [
  { title: "Понятное сравнение", text: "Смотрите район, стоимость, языки обучения, программы и сильные стороны школы в одном месте." },
  { title: "Фокус на ребенка", text: "Выбирайте среду под характер, темп обучения, интересы и потребности вашей семьи." },
  { title: "Экономия времени", text: "Фильтры и карточки помогают быстро составить короткий список школ для посещения." },
];

const stats = [
  { value: "120+", label: "школ в базе" },
  { value: "4", label: "ключевых фильтра" },
  { value: "15 мин", label: "на первичный подбор" },
  { value: "98%", label: "критериев родителей учтено" },
];

export default function Home() {
  return (
    <main>
      <section className="container-page grid items-center gap-12 pb-16 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-20">
        <div>
          <span className="pill">Навигатор по школам Казахстана</span>
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight tracking-[-0.05em] text-ink md:text-7xl">
            Найдите школу, где вашему ребенку будет интересно учиться.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            School Choice KZ помогает родителям выбирать школу осознанно: сравнивайте условия, языки обучения, стоимость и образовательные подходы без десятков открытых вкладок.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link href="/catalog" className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-base font-black text-white shadow-xl shadow-blue-500/25 transition hover:-translate-y-1 hover:bg-ink">
              Искать школы
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center rounded-full border border-blue-100 bg-white px-8 py-4 text-base font-black text-ink transition hover:-translate-y-1 hover:border-blue-300">
              Как это работает
            </Link>
          </div>
        </div>
        <div className="glass-card relative overflow-hidden rounded-[2.5rem] p-6">
          <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-teal-200 blur-3xl" />
          <div className="rounded-[2rem] bg-gradient-to-br from-blue-600 to-teal-400 p-6 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-100">Рекомендация дня</p>
            <h2 className="mt-16 text-3xl font-black">{schools[0].name}</h2>
            <p className="mt-4 text-blue-50">{schools[0].shortDescription}</p>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {schools.slice(1, 3).map((school) => (
              <div key={school.id} className="rounded-3xl bg-white p-5">
                <p className="text-sm font-bold text-blue-600">{school.district}</p>
                <p className="mt-2 font-black text-ink">{school.name}</p>
                <p className="mt-3 text-sm text-slate-500">★ {school.rating} · {school.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="glass-card rounded-[2rem] p-7">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white">✓</div>
              <h2 className="text-2xl font-black text-ink">{feature.title}</h2>
              <p className="mt-4 leading-7 text-slate-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-14">
        <div className="rounded-[2.5rem] bg-ink p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-black tracking-tight text-teal-300">{stat.value}</p>
                <p className="mt-2 text-sm font-semibold text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="pill">Популярные школы</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-ink">С чего начать поиск</h2>
          </div>
          <Link href="/catalog" className="hidden font-black text-blue-600 hover:text-ink md:block">Весь каталог →</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {schools.slice(0, 3).map((school) => <SchoolCard key={school.id} school={school} />)}
        </div>
      </section>
      <Footer />
    </main>
  );
}
