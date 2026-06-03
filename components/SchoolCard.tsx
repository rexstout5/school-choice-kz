import Link from "next/link";
import type { School } from "@/lib/schools";

export function SchoolCard({ school }: { school: School }) {
  return (
    <article className="glass-card group flex h-full flex-col overflow-hidden rounded-[2rem] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/15">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="pill">{school.district}</p>
          <h3 className="mt-4 text-2xl font-black tracking-tight text-ink">{school.name}</h3>
        </div>
        <div className="rounded-2xl bg-amber-50 px-3 py-2 text-sm font-black text-amber-600">★ {school.rating}</div>
      </div>
      <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">{school.shortDescription}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{school.type}</span>
        {school.languages.map((language) => (
          <span key={language} className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
            {language}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Стоимость</p>
          <p className="mt-1 font-black text-ink">{school.price}</p>
        </div>
        <Link href={`/schools/${school.id}`} className="rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white transition group-hover:bg-ink">
          Подробнее
        </Link>
      </div>
    </article>
  );
}
