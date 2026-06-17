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
    contactsLink: 'Контакты',
    favoritesLink: 'Избранное',
    footerLabel: 'Навигация по сайту',
    heroTitle: 'Найдите школу, которая подходит вашей семье',
    heroDescription: 'Изучайте проверенные данные, фильтруйте по ключевым критериям и формируйте экспертный шорт-лист школ Астаны.',
    heroCta: 'Пройти квиз подбора',
    heroSecondaryCta: 'Смотреть каталог',
    heroNote: 'Персональный маршрут выбора: квиз → шорт-лист → сравнение.',
    astanaSchools: 'школ в каталоге',
    assistantSteps: ['Укажите район и бюджет', 'Получите подходящие варианты', 'Сравните и сохраните школы'],
    topTitle: 'Популярные школы',
    tabs: { all: 'Все', public: 'Государственные', private: 'Частные', international: 'Международные' },
    toolsTitle: 'Полезные инструменты',
    tools: [['catalog', 'Каталог школ', '/catalog'], ['map', 'Карта школ', '/map'], ['quiz', 'Подбор школы', '/quiz'], ['star', 'Рейтинг школ', '/rankings']],
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
      ['О проекте', [['О нас', '/about'], ['Добавить школу', '/contribute'], ['Контакты', '/contacts']]]
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
    contactsLink: 'Байланыс',
    favoritesLink: 'Таңдаулылар',
    footerLabel: 'Сайт навигациясы',
    heroTitle: 'Отбасыңызға сай келетін мектепті табыңыз',
    heroDescription: 'Тексерілген деректерді зерттеп, негізгі критерийлер бойынша сүзгілеп, Астана мектептерінің сараптамалық қысқа тізімін жасаңыз.',
    heroCta: 'Таңдау квизінен өту',
    heroSecondaryCta: 'Каталогты қарау',
    heroNote: 'Жеке таңдау маршруты: квиз → қысқа тізім → салыстыру.',
    astanaSchools: 'мектеп каталогта',
    assistantSteps: ['Аудан мен бюджетті көрсетіңіз', 'Сәйкес нұсқаларды алыңыз', 'Мектептерді салыстырып сақтаңыз'],
    topTitle: 'Танымал мектептер',
    tabs: { all: 'Барлығы', public: 'Мемлекеттік', private: 'Жеке', international: 'Халықаралық' },
    toolsTitle: 'Пайдалы құралдар',
    tools: [['catalog', 'Мектептер каталогы', '/catalog'], ['map', 'Мектептер картасы', '/map'], ['quiz', 'Мектеп таңдау', '/quiz'], ['star', 'Мектеп рейтингі', '/rankings']],
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
      ['Жоба туралы', [['Біз туралы', '/about'], ['Мектеп қосу', '/contribute'], ['Байланыс', '/contacts']]]
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
    contactsLink: 'Contacts',
    favoritesLink: 'Favorites',
    footerLabel: 'Site navigation',
    heroTitle: 'Find the school that fits your family',
    heroDescription: 'Explore verified data, filter by key criteria, and build an expert shortlist of Astana schools.',
    heroCta: 'Take the matching quiz',
    heroSecondaryCta: 'View catalog',
    heroNote: 'Your personal route: quiz → shortlist → comparison.',
    astanaSchools: 'schools in the catalog',
    assistantSteps: ['Set district and budget', 'Get suitable options', 'Compare and save schools'],
    topTitle: 'Popular schools',
    tabs: { all: 'All', public: 'Public', private: 'Private', international: 'International' },
    toolsTitle: 'Helpful tools',
    tools: [['catalog', 'School catalog', '/catalog'], ['map', 'School map', '/map'], ['quiz', 'School matcher', '/quiz'], ['star', 'School rankings', '/rankings']],
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
      ['About', [['About us', '/about'], ['Add a school', '/contribute'], ['Contacts', '/contacts']]]
    ]
  }
};

const getSchoolCardImage = (school) => getSchoolCoverImage(school);

function withLanguage(href, language) {
  return `${href}${href.includes('?') ? '&' : '?'}lang=${language}`;
}


function ToolIcon({ name }) {
  const common = { width: '32', height: '32', viewBox: '0 0 32 32', fill: 'none', 'aria-hidden': 'true' };
  if (name === 'catalog') {
    return <svg {...common}><path d="M8 6h11a5 5 0 0 1 5 5v15H11a5 5 0 0 0-5-5V8a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M11 11h8M11 16h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
  }
  if (name === 'map') {
    return <svg {...common}><path d="M12 5 4 8v19l8-3 8 3 8-3V5l-8 3-8-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M12 5v19M20 8v19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
  }
  if (name === 'quiz') {
    return <svg {...common}><path d="M8 8h16M8 16h16M8 24h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="m22 22 2 2 4-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  }
  if (name === 'star') {
    return <svg {...common}><path d="m16 4 3.5 7.1 7.8 1.1-5.6 5.5 1.3 7.7-7-3.7-7 3.7 1.3-7.7-5.6-5.5 7.8-1.1L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>;
  }
  return <svg {...common}><path d="M16 26s-10-5.8-10-14a5.5 5.5 0 0 1 10-3.1A5.5 5.5 0 0 1 26 12c0 8.2-10 14-10 14Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>;
}

function SocialIcon({ name }) {
  const common = { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' };
  if (name === 'Instagram') {
    return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.8"/><path d="M16.8 7.2h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>;
  }
  if (name === 'Telegram') {
    return <svg {...common}><path d="M20 5 4 11.7l5.8 2.1M20 5l-3 14-7.2-5.2M20 5 9.8 13.8M9.8 13.8 9.5 19l3-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  }
  return <svg {...common}><path d="M6.4 18.1A8 8 0 1 1 9 19.5L5 20.5l1.4-2.4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9.4 8.8c.2 3 2.4 5.1 5.5 5.8l1-1.6-1.8-1-1 1c-1.2-.5-2-1.3-2.5-2.5l1-1-.9-1.8-1.3 1.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function SocialLinks() {
  return (
    <div className="social-links">
      <a href="#" aria-label="Instagram"><SocialIcon name="Instagram" /></a>
      <a href="#" aria-label="Telegram"><SocialIcon name="Telegram" /></a>
      <a href="#" aria-label="WhatsApp"><SocialIcon name="WhatsApp" /></a>
    </div>
  );
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
        <p className="top-school-card__district">{localizedDistrict}</p>
        <div className="top-school-card__meta">
          <span className="top-school-card__rating" aria-label={`${t.rating}: ${rating}`}>⭐ {rating}</span>
          <span className="top-school-card__tuition">{tuition}</span>
        </div>
      </div>
    </article>
  );
}

function HeroVisual({ t }) {
  return (
    <div className="hero__assistant" aria-label={t.heroNote}>
      <div className="hero__stat">
        <strong>{schools.length}</strong>
        <span>{t.astanaSchools}</span>
      </div>
      <ol>
        {t.assistantSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
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
    private: sortSchools(schools.filter((school) => school.type === 'private'), initialSort, currentLanguage, reviewsBySchool).slice(0, 5),
    international: sortSchools(schools.filter((school) => school.type === 'international'), initialSort, currentLanguage, reviewsBySchool).slice(0, 5)
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
          <a className="site-header__link" href={withLanguage('/about', currentLanguage)}>{t.aboutLink}</a>
          <a className="site-header__link" href={withLanguage('/contacts', currentLanguage)}>{t.contactsLink}</a>
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
          <p className="hero__note">{t.heroNote}</p>
        </div>
        <HeroVisual t={t} />
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


      <footer className="site-footer site-footer--simple" id="footer">
        <div className="site-footer__brand"><strong>{brand.name}</strong><p>{t.footerDescription}</p><SocialLinks /></div>
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
