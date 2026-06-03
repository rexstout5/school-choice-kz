import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { getSchoolById, schools } from "@/lib/schools";

export function generateStaticParams() {
  return schools.map((school) => ({ id: school.id }));
}

export default async function SchoolDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const school = getSchoolById(id);

  if (!school) {
    notFound();
  }

  return (
    <main>
      <section className="container-page pb-16 pt-12">
        <Link href="/catalog" className="font-bold text-blue-600 hover:text-ink">← Назад в каталог</Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="glass-card rounded-[2.5rem] p-8 md:p-12">
            <div className="flex flex-wrap gap-3">
              <span className="pill">{school.district}</span>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700">{school.type}</span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700">★ {school.rating}</span>
            </div>
            <h1 className="mt-6 text-5xl font-black tracking-[-0.05em] text-ink md:text-6xl">{school.name}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">{school.description}</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <Info label="Учеников" value={school.students.toLocaleString("ru-RU")} />
              <Info label="Стоимость" value={school.price} />
              <Info label="Языки" value={school.languages.join(", ")} />
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <section>
                <h2 className="text-2xl font-black text-ink">Сильные стороны</h2>
                <ul className="mt-5 space-y-3">
                  {school.strengths.map((item) => (
                    <li key={item} className="flex gap-3 text-slate-600"><span className="font-black text-blue-600">✓</span>{item}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h2 className="text-2xl font-black text-ink">Программы</h2>
                <ul className="mt-5 space-y-3">
                  {school.programs.map((item) => (
                    <li key={item} className="flex gap-3 text-slate-600"><span className="font-black text-teal-500">•</span>{item}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          <aside className="glass-card h-fit rounded-[2rem] p-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Адрес</p>
            <p className="mt-3 text-xl font-black text-ink">{school.address}</p>
            <div className="mt-6 rounded-3xl bg-gradient-to-br from-blue-600 to-teal-400 p-6 text-white">
              <p className="text-sm font-bold text-blue-100">Следующий шаг</p>
              <p className="mt-3 text-2xl font-black">Запланируйте визит и задайте вопросы администрации.</p>
            </div>
            <button className="mt-6 w-full rounded-full bg-ink px-5 py-4 font-black text-white transition hover:bg-blue-700">Записаться на консультацию</button>
          </aside>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-5">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-black text-ink">{value}</p>
    </div>
  );
}
