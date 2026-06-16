'use client';

import { useEffect, useMemo, useState } from 'react';
import { getLocalizedEnumLabel, getLocalizedSchoolValue, schools } from '../src/data/schools.js';
import SchoolImageWithFallback from '../src/components/SchoolImageWithFallback.jsx';
import { createSchoolImagePlaceholder } from '../src/utils/schoolImages.js';
import { formatAverageRating, getSchoolReviews, getStoredReviewsBySchool } from '../src/lib/reviews.js';
import { getSchoolRatingStats, sortSchools } from '../src/lib/schoolDiscovery.js';
import { favoritesChangedEventName, getStoredFavoriteSchoolIds } from '../src/lib/favorites.js';

const languageStorageKey = 'school-choice-kz-language';
const defaultLanguage = 'ru';
const initialSort = 'highest_rated';

const languageOptions = [
  { code: 'ru', label: 'RU' },
  { code: 'kz', label: 'KZ' },
  { code: 'en', label: 'EN' }
];

const homepageTranslations = {
  ru: {
    pageTitle: 'Выбор школы в Казахстане',
    languageSwitcherLabel: 'Выберите язык интерфейса',
    catalogLink: 'Каталог',
    mapLink: 'Карта',
    quizLink: 'Подбор школы',
    rankingsLink: 'Рейтинг школ',
    addSchoolLink: 'Добавить школу',
    aboutLink: 'О проекте',
    favoritesLink: 'Избранное',
    footerLabel: 'Навигация по сайту',
    heroTitle: 'Подберите школу для ребенка в Астане',
    heroDescription: 'Сравните школы по району, языку обучения и стоимости.',
    heroCta: 'Подобрать школу',
    heroSecondaryCta: 'Смотреть каталог',
    heroStats: ['77+ школ', '5 районов', '3 языка обучения'],
    topTitle: 'Популярные школы',
    tabs: { all: 'Все', public: 'Государственные', private: 'Частные' },
    toolsTitle: 'Полезные инструменты',
    tools: [['📍', 'Карта школ', '/map'], ['⚖', 'Сравнение школ', '/compare'], ['⭐', 'Рейтинг школ', '/rankings'], ['❤️', 'Избранное', '/favorites']],
    howTitle: 'Как это работает',
    howSteps: ['Ответьте на несколько вопросов', 'Получите список подходящих школ', 'Сравните и сохраните лучшие варианты'],
    district: 'Район',
    rating: 'Рейтинг',
    tuition: 'Стоимость',
    details: 'Подробнее',
    notYetRated: 'Пока нет оценки',
    freePublicSchool: 'Бесплатно',
    priceUnknown: 'Уточняется',
    perMonth: 'в месяц'
  },
  kz: {
    pageTitle: 'Қазақстандағы мектеп таңдауы',
    languageSwitcherLabel: 'Интерфейс тілін таңдаңыз',
    catalogLink: 'Каталог',
    mapLink: 'Карта',
    quizLink: 'Мектеп таңдау',
    rankingsLink: 'Мектеп рейтингі',
    addSchoolLink: 'Мектеп қосу',
    aboutLink: 'Жоба туралы',
    favoritesLink: 'Таңдаулылар',
    footerLabel: 'Сайт навигациясы',
    heroTitle: 'Астанада балаңызға мектеп таңдаңыз',
    heroDescription: 'Мектептерді аудан, оқу тілі және құны бойынша салыстырыңыз.',
    heroCta: 'Мектеп таңдау',
    heroSecondaryCta: 'Каталогты қарау',
    heroStats: ['77+ мектеп', '5 аудан', '3 оқу тілі'],
    topTitle: 'Танымал мектептер',
    tabs: { all: 'Барлығы', public: 'Мемлекеттік', private: 'Жеке' },
    toolsTitle: 'Пайдалы құралдар',
    tools: [['📍', 'Мектептер картасы', '/map'], ['⚖', 'Мектептерді салыстыру', '/compare'], ['⭐', 'Мектеп рейтингі', '/rankings'], ['❤️', 'Таңдаулылар', '/favorites']],
    howTitle: 'Бұл қалай жұмыс істейді',
    howSteps: ['Бірнеше сұраққа жауап беріңіз', 'Сәйкес мектептер тізімін алыңыз', 'Ең жақсы нұсқаларды салыстырып сақтаңыз'],
    district: 'Аудан',
    rating: 'Рейтинг',
    tuition: 'Құны',
    details: 'Толығырақ',
    notYetRated: 'Әзірге баға жоқ',
    freePublicSchool: 'Тегін',
    priceUnknown: 'Нақтыланады',
    perMonth: 'айына'
  },
  en: {
    pageTitle: 'School Choice Kazakhstan',
    languageSwitcherLabel: 'Choose interface language',
    catalogLink: 'Catalog',
    mapLink: 'Map',
    quizLink: 'School matcher',
    rankingsLink: 'School rankings',
    addSchoolLink: 'Add school',
    aboutLink: 'About',
    favoritesLink: 'Favorites',
    footerLabel: 'Site navigation',
    heroTitle: 'Find a school for your child in Astana',
    heroDescription: 'Compare schools by district, instruction language, and tuition.',
    heroCta: 'Find a school',
    heroSecondaryCta: 'View catalog',
    heroStats: ['77+ schools', '5 districts', '3 instruction languages'],
    topTitle: 'Popular schools',
    tabs: { all: 'All', public: 'Public', private: 'Private' },
    toolsTitle: 'Helpful tools',
    tools: [['📍', 'School map', '/map'], ['⚖', 'School comparison', '/compare'], ['⭐', 'School rankings', '/rankings'], ['❤️', 'Favorites', '/favorites']],
    howTitle: 'How it works',
    howSteps: ['Answer a few questions', 'Get a list of suitable schools', 'Compare and save the best options'],
    district: 'District',
    rating: 'Rating',
    tuition: 'Tuition',
    details: 'Details',
    notYetRated: 'Not yet rated',
    freePublicSchool: 'Free',
    priceUnknown: 'To be confirmed',
    perMonth: 'month'
  }
};

const getSchoolCardImage = (school, schoolName) => school.main_image_url || school.main_image?.src || createSchoolImagePlaceholder(schoolName, 'card');

function withLanguage(href, language) {
  return `${href}${href.includes('?') ? '&' : '?'}lang=${language}`;
}

function LanguageSwitcher({ currentLanguage, onLanguageChange, t }) {
  return (
    <div className="language-switcher" aria-label={t.languageSwitcherLabel}>
      {languageOptions.map(({ code, label }) => (
        <button key={code} type="button" className={currentLanguage === code ? 'language-switcher__button language-switcher__button--active' : 'language-switcher__button'} aria-pressed={currentLanguage === code} onClick={() => onLanguageChange(code)}>
          {label}
        </button>
      ))}
    </div>
  );
}

function HomeSchoolCard({ school, moneyFormatter, t, currentLanguage, ratingStats }) {
  const localizedName = getLocalizedSchoolValue(school.name, currentLanguage);
  const localizedDistrict = getLocalizedEnumLabel('districts', school.district, currentLanguage);
  const cardImage = getSchoolCardImage(school, localizedName);
  const tuition = school.tuition_fee === null || school.tuition_fee === undefined
    ? t.priceUnknown
    : school.tuition_fee === 0
      ? t.freePublicSchool
      : `${moneyFormatter.format(school.tuition_fee)} / ${t.perMonth}`;
  const rating = ratingStats.averageRating === null ? t.notYetRated : `⭐ ${formatAverageRating(ratingStats.averageRating)} / 5`;

  return (
    <article className="top-school-card">
      <div className="top-school-card__image">
        <SchoolImageWithFallback src={cardImage} alt={localizedName} schoolName={localizedName} loading="lazy" decoding="async" size="card" />
      </div>
      <div className="top-school-card__body">
        <h3>{localizedName}</h3>
        <dl>
          <div><dt>{t.district}</dt><dd>{localizedDistrict}</dd></div>
          <div><dt>{t.rating}</dt><dd>{rating}</dd></div>
          <div><dt>{t.tuition}</dt><dd>{tuition}</dd></div>
        </dl>
        <a className="button-link" href={withLanguage(`/schools/${school.slug ?? school.id}`, currentLanguage)}>{t.details}</a>
      </div>
    </article>
  );
}

function PopularSchools({ groups, moneyFormatter, t, currentLanguage, reviewsBySchool }) {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <section className="top-schools" aria-labelledby="top-schools-title">
      <div className="section-heading section-heading--split">
        <h2 id="top-schools-title">{t.topTitle}</h2>
        <div className="tabs" role="tablist" aria-label={t.topTitle}>
          {Object.keys(groups).map((type) => (
            <button key={type} type="button" role="tab" aria-selected={activeTab === type} className={activeTab === type ? 'tab tab--active' : 'tab'} onClick={() => setActiveTab(type)}>
              {t.tabs[type]}
            </button>
          ))}
        </div>
      </div>
      <div className="top-school-grid">
        {groups[activeTab].map((school) => (
          <HomeSchoolCard key={school.id} school={school} moneyFormatter={moneyFormatter} t={t} currentLanguage={currentLanguage} ratingStats={getSchoolRatingStats(school, getSchoolReviews(reviewsBySchool, school.id))} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [reviewsBySchool, setReviewsBySchool] = useState({});
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    setReviewsBySchool(getStoredReviewsBySchool());
    const syncFavoriteCount = () => setFavoriteCount(getStoredFavoriteSchoolIds().length);
    syncFavoriteCount();
    window.addEventListener('storage', syncFavoriteCount);
    window.addEventListener(favoritesChangedEventName, syncFavoriteCount);
    return () => {
      window.removeEventListener('storage', syncFavoriteCount);
      window.removeEventListener(favoritesChangedEventName, syncFavoriteCount);
    };
  }, []);

  useEffect(() => {
    try {
      const urlLanguage = new URLSearchParams(window.location.search).get('lang');
      const storedLanguage = window.localStorage.getItem(languageStorageKey);
      const nextLanguage = homepageTranslations[urlLanguage] ? urlLanguage : storedLanguage;

      if (nextLanguage && homepageTranslations[nextLanguage]) {
        setCurrentLanguage(nextLanguage);
      }
    } catch {
      setCurrentLanguage(defaultLanguage);
    }
  }, []);

  const t = homepageTranslations[currentLanguage];
  const moneyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(currentLanguage === 'en' ? 'en-US' : currentLanguage === 'kz' ? 'kk-KZ' : 'ru-RU', {
        style: 'currency',
        currency: 'KZT',
        currencyDisplay: 'narrowSymbol',
        maximumFractionDigits: 0
      }),
    [currentLanguage]
  );

  const popularSchoolGroups = useMemo(() => ({
    all: sortSchools(schools, initialSort, currentLanguage, reviewsBySchool).slice(0, 5),
    public: sortSchools(schools.filter((school) => school.type === 'public'), initialSort, currentLanguage, reviewsBySchool).slice(0, 5),
    private: sortSchools(schools.filter((school) => school.type === 'private'), initialSort, currentLanguage, reviewsBySchool).slice(0, 5)
  }), [currentLanguage, reviewsBySchool]);

  const updateLanguage = (language) => {
    setCurrentLanguage(language);

    try {
      window.localStorage.setItem(languageStorageKey, language);
    } catch {
      // Language still changes for the current session if localStorage is unavailable.
    }
  };

  const footerLinks = [
    [t.catalogLink, '/catalog'],
    [t.mapLink, '/map'],
    [t.quizLink, '/quiz'],
    [t.rankingsLink, '/rankings'],
    [t.addSchoolLink, '/contribute'],
    [t.aboutLink, '#top']
  ];

  return (
    <main>
      <header className="site-header">
        <a className="site-header__brand" href="#top" aria-label={t.pageTitle}>{t.pageTitle}</a>
        <div className="site-header__actions">
          <a className="site-header__link" href={withLanguage('/catalog', currentLanguage)}>{t.catalogLink}</a>
          <a className="site-header__link" href={withLanguage('/map', currentLanguage)}>{t.mapLink}</a>
          <a className="site-header__link" href={withLanguage('/rankings', currentLanguage)}>{t.rankingsLink}</a>
          <a className="site-header__link" href={withLanguage('/contribute', currentLanguage)}>{t.addSchoolLink}</a>
          <a className="site-header__link" href={withLanguage('/favorites', currentLanguage)}>♡ {t.favoritesLink} ({favoriteCount})</a>
          <LanguageSwitcher currentLanguage={currentLanguage} onLanguageChange={updateLanguage} t={t} />
        </div>
      </header>

      <section className="hero hero--landing" id="top">
        <div className="hero__copy">
          <h1>{t.heroTitle}</h1>
          <p>{t.heroDescription}</p>
          <div className="hero__actions">
            <a className="hero__cta" href={withLanguage('/quiz', currentLanguage)}>{t.heroCta}</a>
            <a className="hero__cta hero__cta--secondary" href={withLanguage('/catalog', currentLanguage)}>{t.heroSecondaryCta}</a>
          </div>
        </div>
        <div className="hero-stat-grid" aria-label={t.heroStats.join(', ')}>
          {t.heroStats.map((stat) => <strong key={stat}>{stat}</strong>)}
        </div>
      </section>

      <PopularSchools groups={popularSchoolGroups} moneyFormatter={moneyFormatter} t={t} currentLanguage={currentLanguage} reviewsBySchool={reviewsBySchool} />

      <section className="tool-section" aria-labelledby="tools-title">
        <div className="section-heading"><h2 id="tools-title">{t.toolsTitle}</h2></div>
        <div className="tool-card-grid">
          {t.tools.map(([icon, title, href]) => (
            <a className="tool-card tool-card--large" key={title} href={withLanguage(href, currentLanguage)}><span>{icon}</span><strong>{title}</strong></a>
          ))}
        </div>
      </section>

      <section className="how-it-works how-it-works--timeline" aria-labelledby="how-it-works-title">
        <div className="section-heading"><h2 id="how-it-works-title">{t.howTitle}</h2></div>
        <div className="timeline">
          {t.howSteps.map((step, index) => (
            <article className="timeline-card" key={step}>
              <span className="timeline-card__number">{index + 1}</span>
              <h3>{step}</h3>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer site-footer--simple">
        <nav className="footer-links" aria-label={t.footerLabel}>
          {footerLinks.map(([label, href]) => (
            <a key={label} href={href.startsWith('#') ? href : withLanguage(href, currentLanguage)}>{label}</a>
          ))}
        </nav>
      </footer>
    </main>
  );
}
