'use client';

import { useEffect, useState } from 'react';
import { brand } from '../../src/data/brand.js';

const defaultLanguage = 'ru';
const languageStorageKey = 'school-choice-kz-language';
const languageOptions = [
  { code: 'ru', label: 'RU' },
  { code: 'kz', label: 'KZ' },
  { code: 'en', label: 'EN' }
];

const translations = {
  ru: {
    pageTitle: 'О проекте',
    back: '← На главную',
    kicker: 'О проекте',
    heroTitle: 'BilimChoice помогает семьям выбирать школы Астаны',
    heroDescription: 'Мы собираем информацию о школах в одном месте, чтобы родителям было проще сравнивать варианты и принимать решения.',
    featuresTitle: 'Что можно делать на BilimChoice',
    features: [
      { icon: '📚', title: 'Каталог школ', text: 'Сравнивайте школы по языку обучения, району, стоимости и другим критериям.' },
      { icon: '⭐', title: 'Избранное', text: 'Сохраняйте интересные варианты и возвращайтесь к ним позже.' },
      { icon: '🎓', title: 'Готовность к школе', text: 'Оцените готовность ребёнка к школьному старту по возрастным критериям.' }
    ],
    approachTitle: 'Наш подход',
    approachText: 'Мы стремимся уменьшить количество случайных решений и помочь родителям выбирать школы на основе структурированных данных.',
    dataTitle: 'Откуда данные',
    dataText: 'Данные собираются из открытых источников и регулярно актуализируются вручную. Если вы нашли неточность, пожалуйста, сообщите нам через форму обратной связи.'
  },
  kz: {
    pageTitle: 'Жоба туралы',
    back: '← Басты бетке',
    kicker: 'Жоба туралы',
    heroTitle: 'BilimChoice отбасыларға Астана мектептерін таңдауға көмектеседі',
    heroDescription: 'Ата-аналарға нұсқаларды салыстыру және шешім қабылдау оңай болуы үшін мектептер туралы ақпаратты бір жерге жинаймыз.',
    featuresTitle: 'BilimChoice-та не істеуге болады',
    features: [
      { icon: '📚', title: 'Мектептер каталогы', text: 'Мектептерді оқу тілі, аудан, оқу ақысы және басқа критерийлер бойынша салыстырыңыз.' },
      { icon: '⭐', title: 'Таңдаулылар', text: 'Қызықты нұсқаларды сақтап, кейін қайта оралыңыз.' },
      { icon: '🎓', title: 'Мектепке дайындық', text: 'Баланың мектеп бастауға дайындығын жас ерекшеліктері бойынша бағалаңыз.' }
    ],
    approachTitle: 'Біздің тәсіл',
    approachText: 'Біз кездейсоқ шешімдердің санын азайтып, ата-аналарға мектептерді құрылымдалған деректер негізінде таңдауға көмектесуге тырысамыз.',
    dataTitle: 'Деректер қайдан алынады',
    dataText: 'Деректер ашық дереккөздерден жиналып, қолмен тұрақты түрде жаңартылады. Егер қате тапсаңыз, кері байланыс формасы арқылы хабарлаңыз.'
  },
  en: {
    pageTitle: 'About',
    back: '← Back home',
    kicker: 'About',
    heroTitle: 'BilimChoice helps families choose schools in Astana',
    heroDescription: 'We collect school information in one place so parents can compare options more easily and make decisions.',
    featuresTitle: 'What you can do on BilimChoice',
    features: [
      { icon: '📚', title: 'School catalog', text: 'Compare schools by language of instruction, district, tuition, and other criteria.' },
      { icon: '⭐', title: 'Favorites', text: 'Save interesting options and return to them later.' },
      { icon: '🎓', title: 'School readiness', text: 'Assess a child’s readiness for the school start using age-based criteria.' }
    ],
    approachTitle: 'Our approach',
    approachText: 'We aim to reduce random decisions and help parents choose schools based on structured data.',
    dataTitle: 'Data sources',
    dataText: 'Data is collected from open sources and regularly updated manually. If you find an inaccuracy, please let us know through the feedback form.'
  }
};

const getLanguage = (lang) => (lang && translations[lang] ? lang : defaultLanguage);

export default function AboutPage() {
  const [language, setLanguage] = useState(defaultLanguage);
  const t = translations[language];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setLanguage(getLanguage(params.get('lang') || window.localStorage.getItem(languageStorageKey)));
  }, []);

  const updateLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    try {
      window.localStorage.setItem(languageStorageKey, nextLanguage);
    } catch {}
  };

  return (
    <main>
      <nav className="school-detail__topbar" aria-label={t.pageTitle}>
        <a className="back-link" href={`/?lang=${language}`}>{t.back}</a>
        <div className="language-switcher" aria-label={t.pageTitle}>
          {languageOptions.map(({ code, label }) => (
            <button key={code} type="button" className={language === code ? 'language-switcher__button language-switcher__button--active' : 'language-switcher__button'} onClick={() => updateLanguage(code)}>
              {label}
            </button>
          ))}
        </div>
      </nav>

      <section className="about-page" aria-labelledby="about-title">
        <section className="about-hero">
          <p className="hero__kicker">{t.kicker}</p>
          <h1 id="about-title">{t.heroTitle}</h1>
          <p>{t.heroDescription}</p>
        </section>

        <section className="about-section" aria-labelledby="about-features-title">
          <div className="about-section__heading">
            <p className="section-kicker">{brand.name}</p>
            <h2 id="about-features-title">{t.featuresTitle}</h2>
          </div>
          <div className="about-feature-grid">
            {t.features.map((feature) => (
              <article className="about-feature-card" key={feature.title}>
                <span className="about-feature-card__icon" aria-hidden="true">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-info-grid" aria-label={t.pageTitle}>
          <article className="about-info-card">
            <h2>{t.approachTitle}</h2>
            <p>{t.approachText}</p>
          </article>
          <article className="about-info-card about-info-card--accent">
            <h2>{t.dataTitle}</h2>
            <p>{t.dataText}</p>
          </article>
        </section>
      </section>
    </main>
  );
}
