import Link from "next/link";
import { notFound } from "next/navigation";
import { schools } from "../../data/schools";

type SchoolPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return schools.map((school) => ({ slug: school.slug }));
}

export async function generateMetadata({ params }: SchoolPageProps) {
  const { slug } = await params;
  const school = schools.find((item) => item.slug === slug);

  return {
    title: school ? `${school.name} — School Choice KZ` : "Школа не найдена"
  };
}

export default async function SchoolPage({ params }: SchoolPageProps) {
  const { slug } = await params;
  const school = schools.find((item) => item.slug === slug);

  if (!school) {
    notFound();
  }

  return (
    <main>
      <section className="detail-hero">
        <Link className="back-link" href="/schools">
          ← Назад в каталог
        </Link>
        <div className="detail-heading">
          <div>
            <p className="eyebrow">{school.type}</p>
            <h1>{school.name}</h1>
            <p>
              {school.city} · {school.district}
            </p>
          </div>
          <div className="score-card">
            <span>Рейтинг</span>
            <strong>★ {school.rating}</strong>
          </div>
        </div>
      </section>

      <section className="detail-layout">
        <article className="detail-main">
          <h2>О школе</h2>
          <p>{school.description}</p>
          <h2>Программы и сильные стороны</h2>
          <div className="tags large-tags">
            {school.curriculum.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <ul className="feature-list">
            {school.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </article>

        <aside className="detail-sidebar" aria-label="Ключевая информация">
          <h2>Ключевые факты</h2>
          <dl>
            <div>
              <dt>Классы</dt>
              <dd>{school.grades}</dd>
            </div>
            <div>
              <dt>Язык обучения</dt>
              <dd>{school.language}</dd>
            </div>
            <div>
              <dt>Стоимость</dt>
              <dd>{school.price}</dd>
            </div>
            <div>
              <dt>Размер класса</dt>
              <dd>до {school.classSize} учеников</dd>
            </div>
            <div>
              <dt>Адрес</dt>
              <dd>{school.address}</dd>
            </div>
            <div>
              <dt>Телефон</dt>
              <dd>{school.phone}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  );
}
