'use client';

import { useEffect, useMemo, useState } from 'react';
import { getLocalizedEnumLabel, getLocalizedSchoolValue, schools } from '../src/data/schools.js';
import SchoolImageWithFallback from '../src/components/SchoolImageWithFallback.jsx';
import { getSchoolCoverImage, getSchoolPlaceholderImage } from '../src/utils/schoolImages.js';
import { formatAverageRating, getSchoolReviews, getStoredReviewsBySchool } from '../src/lib/reviews.js';
import { getSchoolRatingStats, sortSchools } from '../src/lib/schoolDiscovery.js';
import { favoritesChangedEventName, getStoredFavoriteSchoolIds } from '../src/lib/favorites.js';
import { brand } from '../src/data/brand.js';

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
    pageTitle: brand.name,
    languageSwitcherLabel: 'Выберите язык интерфейса',
    catalogLink: 'Каталог школ',
    mapLink: 'Карта',
    quizLink: 'Подбор школы',
    rankingsLink: 'Рейтинг школ',
    addSchoolLink: 'Добавить школу',
    aboutLink: 'О проекте',
    favoritesLink: 'Избранное',
    footerLabel: 'Навигация по сайту',
    heroTitle: 'Подберите школу для ребенка в Астане',
    heroDescription: 'Используйте структурированные данные, рейтинги и фильтры, чтобы экспертно сравнить школы Астаны.',
    heroCta: 'Начать подбор',
    heroSecondaryCta: 'Смотреть каталог',
    heroStats: ['77+ школ', '5 районов', '3 языка обучения'],
    topTitle: 'Популярные школы',
    tabs: { all: 'Все', public: 'Государственные', private: 'Частные' },
    toolsTitle: 'Полезные инструменты',
    tools: [['map', 'Карта школ', '/map'], ['compare', 'Сравнение школ', '/compare'], ['star', 'Рейтинг школ', '/rankings'], ['heart', 'Избранное', '/favorites']],
    howTitle: 'Как это работает',
    howSteps: ['Ответьте на несколько вопросов', 'Получите список подходящих школ', 'Сравните и сохраните лучшие варианты'],
    district: 'Район',
    rating: 'Рейтинг',
    tuition: 'Стоимость',
    details: 'Подробнее',
    notYetRated: 'Пока нет оценки',
    freePublicSchool: 'Бесплатно',
    priceUnknown: 'Уточняется',
    perMonth: 'в месяц',
    language: 'Язык',
    footerDescription: 'Экспертный каталог школ Астаны для осознанного выбора семьи.',
    footerColumns: [
      ['Навигация', [['Каталог школ', '/catalog'], ['Карта школ', '/map'], ['Подбор школы', '/quiz'], ['Рейтинг школ', '/rankings']]],
      ['Для родителей', [['Как выбрать школу', '/how-to-choose-school'], ['Вопросы и ответы', '/school-readiness'], ['Полезные статьи', '/how-to-choose-school']]],
      ['О проекте', [['О нас', '#top'], ['Добавить школу', '/contribute'], ['Контакты', '/contribute']]]
    ]
  },
  kz: {
    pageTitle: brand.name,
    languageSwitcherLabel: 'Интерфейс тілін таңдаңыз',
    catalogLink: 'Мектептер каталогы',
    mapLink: 'Карта',
    quizLink: 'Мектеп таңдау',
    rankingsLink: 'Мектеп рейтингі',
    addSchoolLink: 'Мектеп қосу',
    aboutLink: 'Жоба туралы',
    favoritesLink: 'Таңдаулылар',
    footerLabel: 'Сайт навигациясы',
    heroTitle: 'Астанада балаңызға мектеп таңдаңыз',
    heroDescription: 'Астана мектептерін құрылымдалған дерек, рейтинг және сүзгілер арқылы сараптамалық салыстырыңыз.',
    heroCta: 'Таңдауды бастау',
    heroSecondaryCta: 'Каталогты қарау',
    heroStats: ['77+ мектеп', '5 аудан', '3 оқу тілі'],
    topTitle: 'Танымал мектептер',
    tabs: { all: 'Барлығы', public: 'Мемлекеттік', private: 'Жеке' },
    toolsTitle: 'Пайдалы құралдар',
    tools: [['map', 'Мектептер картасы', '/map'], ['compare', 'Мектептерді салыстыру', '/compare'], ['star', 'Мектеп рейтингі', '/rankings'], ['heart', 'Таңдаулылар', '/favorites']],
    howTitle: 'Бұл қалай жұмыс істейді',
    howSteps: ['Бірнеше сұраққа жауап беріңіз', 'Сәйкес мектептер тізімін алыңыз', 'Ең жақсы нұсқаларды салыстырып сақтаңыз'],
    district: 'Аудан',
    rating: 'Рейтинг',
    tuition: 'Құны',
    details: 'Толығырақ',
    notYetRated: 'Әзірге баға жоқ',
    freePublicSchool: 'Тегін',
    priceUnknown: 'Нақтыланады',
    perMonth: 'айына',
    language: 'Тіл',
    footerDescription: 'Отбасы саналы таңдау жасайтын Астана мектептерінің сараптамалық каталогы.',
    footerColumns: [
      ['Навигация', [['Мектептер каталогы', '/catalog'], ['Мектептер картасы', '/map'], ['Мектеп таңдау', '/quiz'], ['Мектеп рейтингі', '/rankings']]],
      ['Ата-аналарға', [['Мектепті қалай таңдау керек', '/how-to-choose-school'], ['Сұрақтар мен жауаптар', '/school-readiness'], ['Пайдалы мақалалар', '/how-to-choose-school']]],
      ['Жоба туралы', [['Біз туралы', '#top'], ['Мектеп қосу', '/contribute'], ['Байланыс', '/contribute']]]
    ]
  },
  en: {
    pageTitle: brand.name,
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
    heroDescription: 'Use structured data, ratings, and filters to compare Astana schools with expert context.',
    heroCta: 'Start matching',
    heroSecondaryCta: 'View catalog',
    heroStats: ['77+ schools', '5 districts', '3 instruction languages'],
    topTitle: 'Popular schools',
    tabs: { all: 'All', public: 'Public', private: 'Private' },
    toolsTitle: 'Helpful tools',
    tools: [['map', 'School map', '/map'], ['compare', 'School comparison', '/compare'], ['star', 'School rankings', '/rankings'], ['heart', 'Favorites', '/favorites']],
    howTitle: 'How it works',
    howSteps: ['Answer a few questions', 'Get a list of suitable schools', 'Compare and save the best options'],
    district: 'District',
    rating: 'Rating',
    tuition: 'Tuition',
    details: 'Details',
    notYetRated: 'Not yet rated',
    freePublicSchool: 'Free',
    priceUnknown: 'To be confirmed',
    perMonth: 'month',
    language: 'Language',
    footerDescription: 'An expert Astana school catalog for informed family decisions.',
    footerColumns: [
      ['Navigation', [['School catalog', '/catalog'], ['School map', '/map'], ['School matcher', '/quiz'], ['School rankings', '/rankings']]],
      ['For parents', [['How to choose a school', '/how-to-choose-school'], ['Questions and answers', '/school-readiness'], ['Helpful articles', '/how-to-choose-school']]],
      ['About', [['About us', '#top'], ['Add a school', '/contribute'], ['Contacts', '/contribute']]]
    ]
  }
};

const getSchoolCardImage = (school) => getSchoolCoverImage(school);
const heroImagePath = '/images/hero/astana-hero.jpg';

function withLanguage(href, language) {
  return `${href}${href.includes('?') ? '&' : '?'}lang=${language}`;
}


function ToolIcon({ name }) {
  const common = { width: '32', height: '32', viewBox: '0 0 32 32', fill: 'none', 'aria-hidden': 'true' };
  if (name === 'map') {
    return <svg {...common}><path d="M12 5 4 8v19l8-3 8 3 8-3V5l-8 3-8-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M12 5v19M20 8v19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
  }
  if (name === 'compare') {
    return <svg {...common}><path d="M8 7v18M24 7v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M12 11h12l-4-4M20 25H8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  }
  if (name === 'star') {
    return <svg {...common}><path d="m16 4 3.5 7.1 7.8 1.1-5.6 5.5 1.3 7.7-7-3.7-7 3.7 1.3-7.7-5.6-5.5 7.8-1.1L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>;
  }
  return <svg {...common}><path d="M16 26s-10-5.8-10-14a5.5 5.5 0 0 1 10-3.1A5.5 5.5 0 0 1 26 12c0 8.2-10 14-10 14Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>;
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

function HomeSchoolCard({ school, moneyFormatter, t, currentLanguage, ratingStats, rank }) {
  const localizedName = getLocalizedSchoolValue(school.name, currentLanguage);
  const localizedDistrict = getLocalizedEnumLabel('districts', school.district, currentLanguage);
  const cardImage = getSchoolCardImage(school);
  const fallbackImage = getSchoolPlaceholderImage(school);
  const tuition = school.tuition_fee === null || school.tuition_fee === undefined
    ? t.priceUnknown
    : school.tuition_fee === 0
      ? t.freePublicSchool
      : `${moneyFormatter.format(school.tuition_fee)} / ${t.perMonth}`;
  const rating = ratingStats.averageRating === null ? t.notYetRated : `${formatAverageRating(ratingStats.averageRating)} / 5`;
  return (
    <article className="top-school-card">
      <div className="top-school-card__image">
        <span className="top-school-card__rank">#{rank}</span>
        <SchoolImageWithFallback src={cardImage} alt={localizedName} schoolName={localizedName} loading="lazy" decoding="async" size="card" fallbackSrc={fallbackImage} />
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

function HeroVisual() {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="hero__visual" aria-hidden="true">
      {!imageFailed && (
        <img
          src={heroImagePath}
          alt=""
          loading="eager"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      )}
    </div>
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
        {groups[activeTab].map((school, index) => (
          <HomeSchoolCard key={school.id} rank={index + 1} school={school} moneyFormatter={moneyFormatter} t={t} currentLanguage={currentLanguage} ratingStats={getSchoolRatingStats(school, getSchoolReviews(reviewsBySchool, school.id))} />
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

  return (
    <main>
      <header className="site-header">
        <a className="site-header__brand" href="#top" aria-label={t.pageTitle}>{brand.name}</a>
        <nav className="site-header__nav" aria-label={t.footerLabel}>
          <a className="site-header__link" href={withLanguage('/catalog', currentLanguage)}>{t.catalogLink}</a>
          <a className="site-header__link" href={withLanguage('/map', currentLanguage)}>{t.mapLink}</a>
          <a className="site-header__link" href={withLanguage('/quiz', currentLanguage)}>{t.quizLink}</a>
          <a className="site-header__link" href={withLanguage('/rankings', currentLanguage)}>{t.rankingsLink}</a>
          <a className="site-header__link" href="#footer">{t.aboutLink}</a>
        </nav>
        <div className="site-header__actions">
          <a className="site-header__link site-header__link--favorite" href={withLanguage('/favorites', currentLanguage)}>♡ {t.favoritesLink} ({favoriteCount})</a>
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
        <HeroVisual />
        <div className="hero-stat-grid" aria-label={t.heroStats.join(', ')}>
          {t.heroStats.map((stat) => <strong key={stat}>{stat}</strong>)}
        </div>
      </section>

      <PopularSchools groups={popularSchoolGroups} moneyFormatter={moneyFormatter} t={t} currentLanguage={currentLanguage} reviewsBySchool={reviewsBySchool} />

      <section className="tool-section" aria-labelledby="tools-title">
        <div className="section-heading"><h2 id="tools-title">{t.toolsTitle}</h2></div>
        <div className="tool-card-grid">
          {t.tools.map(([icon, title, href]) => (
            <a className="tool-card tool-card--large" key={title} href={withLanguage(href, currentLanguage)}><span><ToolIcon name={icon} /></span><strong>{title}</strong><em>→</em></a>
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

      <footer className="site-footer site-footer--simple" id="footer">
        <div className="site-footer__brand"><strong>{brand.name}</strong><p>{t.footerDescription}</p></div>
        {t.footerColumns.map(([title, links]) => (
          <nav className="footer-links" key={title} aria-label={title}>
            <h3>{title}</h3>
            {links.map(([label, href]) => (
              <a key={label} href={href.startsWith('#') ? href : withLanguage(href, currentLanguage)}>{label}</a>
            ))}
          </nav>
        ))}
      </footer>
    </main>
  );
}
