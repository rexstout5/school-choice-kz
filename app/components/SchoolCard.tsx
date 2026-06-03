import Link from "next/link";
import type { School } from "../data/schools";

type SchoolCardProps = {
  school: School;
};

export function SchoolCard({ school }: SchoolCardProps) {
  return (
    <article className="school-card">
      <div className="card-topline">
        <span className="pill">{school.type}</span>
        <span className="rating">★ {school.rating}</span>
      </div>
      <h3>{school.name}</h3>
      <p className="muted">
        {school.city} · {school.district}
      </p>
      <p>{school.description}</p>
      <div className="tags">
        {school.curriculum.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <dl className="card-facts">
        <div>
          <dt>Классы</dt>
          <dd>{school.grades}</dd>
        </div>
        <div>
          <dt>Стоимость</dt>
          <dd>{school.price}</dd>
        </div>
        <div>
          <dt>В классе</dt>
          <dd>до {school.classSize} учеников</dd>
        </div>
      </dl>
      <Link className="card-link" href={`/schools/${school.slug}`}>
        Смотреть карточку
      </Link>
    </article>
  );
}
