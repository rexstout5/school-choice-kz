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
    title: `${brand.name} помогает семьям выбирать школы Астаны`,
    description: 'Мы собираем данные о школах, форматах обучения, рейтингах и отзывах в одном понятном каталоге, чтобы родителям было проще сравнить варианты.',
    points: ['структурированный каталог школ', 'карта и быстрые фильтры', 'подбор школы и рейтинги']
  },
  kz: {
    pageTitle: 'Жоба туралы',
    back: '← Басты бетке',
    kicker: 'Жоба туралы',
    title: `${brand.name} отбасыларға Астана мектептерін таңдауға көмектеседі`,
    description: 'Ата-аналар нұсқаларды оңай салыстыруы үшін мектептер, оқу форматтары, рейтингтер және пікірлер туралы деректерді бір каталогқа жинаймыз.',
    points: ['құрылымдалған мектеп каталогы', 'карта және жылдам сүзгілер', 'мектеп таңдау және рейтингтер']
  },
  en: {
    pageTitle: 'About',
    back: '← Back home',
    kicker: 'About',
    title: `${brand.name} helps families choose schools in Astana`,
    description: 'We bring school data, learning formats, ratings, and reviews into one clear catalog so parents can compare options faster.',
    points: ['structured school catalog', 'map and quick filters', 'school matcher and rankings']
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
      <section className="contribution-page">
        <p className="hero__kicker">{t.kicker}</p>
        <h1>{t.title}</h1>
        <p>{t.description}</p>
        <div className="stats-grid" aria-label={t.pageTitle}>
          {t.points.map((point) => (
            <article className="stats-card" key={point}><span>{point}</span></article>
          ))}
        </div>
      </section>
    </main>
  );
}
