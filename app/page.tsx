import Link from "next/link";
import { SchoolCard } from "./components/SchoolCard";
import { schools } from "./data/schools";

const featuredSchools = schools.slice(0, 3);

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Платформа для родителей Казахстана</p>
          <h1>Выберите школу, которая подходит вашему ребенку</h1>
          <p className="hero-text">
            Сравнивайте школы по городу, профилю, стоимости, языку обучения и сильным сторонам — без десятков открытых вкладок.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/schools">
              Перейти в каталог
            </Link>
            <a className="secondary-button" href="#how-it-works">
              Как это работает
            </a>
          </div>
        </div>
        <div className="hero-card" aria-label="Краткая статистика каталога">
          <strong>6</strong>
          <span>проверенных школ в демо-каталоге</span>
          <div className="hero-metrics">
            <p>
              <b>5</b> городов
            </p>
            <p>
              <b>3</b> типа школ
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <p className="eyebrow">Как выбрать</p>
        <h2>Сфокусируйтесь на критериях, которые важны семье</h2>
        <div className="steps-grid">
          <article>
            <span>01</span>
            <h3>Определите приоритеты</h3>
            <p>Выберите город, язык обучения, профиль и комфортный размер класса.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Сравните варианты</h3>
            <p>Откройте карточки школ и проверьте программы, стоимость и особенности.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Запланируйте визит</h3>
            <p>Свяжитесь со школой, задайте вопросы и посетите кампус до подачи документов.</p>
          </article>
        </div>
      </section>

      <section className="section accent-section">
        <div>
          <p className="eyebrow">Популярные школы</p>
          <h2>Начните с рекомендованных карточек</h2>
        </div>
        <Link href="/schools">Смотреть все →</Link>
      </section>
      <div className="school-grid section-grid-offset">
        {featuredSchools.map((school) => (
          <SchoolCard key={school.slug} school={school} />
        ))}
      </div>
    </main>
  );
}
