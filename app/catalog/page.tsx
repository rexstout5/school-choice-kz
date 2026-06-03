import { Footer } from "@/components/Footer";
import { SchoolCard } from "@/components/SchoolCard";
import { districts, languages, priceRanges, schools, schoolTypes } from "@/lib/schools";

export default function CatalogPage() {
  return (
    <main>
      <section className="container-page pb-10 pt-12">
        <div className="max-w-3xl">
          <span className="pill">Каталог школ</span>
          <h1 className="mt-5 text-5xl font-black tracking-[-0.04em] text-ink md:text-6xl">Сравните школы по важным для семьи критериям</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Используйте поиск и фильтры, чтобы быстро найти подходящие варианты по району, типу школы, языку обучения и бюджету.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-8 pb-20 lg:grid-cols-[320px_1fr]">
        <aside className="glass-card h-fit rounded-[2rem] p-6 lg:sticky lg:top-28">
          <label className="text-sm font-black uppercase tracking-[0.18em] text-slate-500" htmlFor="search">Поиск</label>
          <input
            id="search"
            type="search"
            placeholder="Название школы или адрес"
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />

          <div className="mt-6 space-y-5">
            <FilterSelect label="Район" options={districts} />
            <FilterSelect label="Тип школы" options={schoolTypes} />
            <FilterSelect label="Язык обучения" options={languages} />
            <FilterSelect label="Ценовой диапазон" options={priceRanges} />
          </div>

          <button className="mt-7 w-full rounded-full bg-blue-600 px-5 py-4 font-black text-white transition hover:bg-ink">
            Показать школы
          </button>
        </aside>

        <div>
          <div className="mb-6 flex flex-col justify-between gap-4 rounded-[1.5rem] border border-blue-100 bg-white/70 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-bold text-slate-500">Найдено</p>
              <p className="text-2xl font-black text-ink">{schools.length} школы в Астане</p>
            </div>
            <select className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 outline-none">
              <option>Сначала с высоким рейтингом</option>
              <option>Сначала бесплатные</option>
              <option>Сначала частные</option>
            </select>
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            {schools.map((school) => <SchoolCard key={school.id} school={school} />)}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-ink">{label}</span>
      <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}
