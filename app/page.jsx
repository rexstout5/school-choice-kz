'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
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
    recommendationLink: 'Подобрать школу',
    readinessLink: 'Готовность к школе',
    addSchoolLink: 'Добавить школу',
    aboutLink: 'О проекте',
    contactsLink: 'Контакты',
    favoritesLink: 'Мой выбор',
    footerLabel: 'Навигация по сайту',
    heroEyebrow: 'ВЫБОР ШКОЛЫ В АСТАНЕ',
    heroTitle: 'Школа, которая подходит вашему ребёнку',
    heroDescription: 'Сравнивайте школы, изучайте проверенные данные и получайте персональные рекомендации для вашей семьи.',
    heroCta: 'Подобрать школу',
    heroSecondaryCta: 'Смотреть каталог',
    heroNote: '77 школ · 5 районов · данные регулярно обновляются',
    astanaSchools: 'школ в каталоге',
    assistantSteps: ['Найдите подходящие школы', 'Сравните важные критерии', 'Сохраните варианты для семьи'],
    topTitle: 'Школы, с которых стоит начать',
    topSubtitle: 'Несколько популярных вариантов. Полный список доступен в каталоге.',
    tabs: { public: 'Государственные', private: 'Частные' },
    emptyCategory: 'Пока нет школ в этой категории.',
    catalogButton: 'Смотреть все школы →',
    district: 'Район',
    rating: 'Рейтинг',
    tuition: 'Стоимость',
    details: 'Подробнее',
    notYetRated: 'Пока нет оценки',
    freePublicSchool: 'Бесплатно',
    priceUnknown: 'Уточняется',
    perMonth: 'в месяц',
    language: 'Язык',
    toolOneTitle: 'Персональная рекомендация',
    toolOneText: 'Ответьте на вопросы о семье и ребёнке и получите объяснимый шорт-лист школ.',
    toolOneCta: 'Подобрать школу',
    toolTwoTitle: 'Готовность к школе',
    toolTwoText: 'Оцените навыки ребёнка и получите рекомендации для подготовки к школьному старту.',
    toolTwoCta: 'Пройти оценку',
    finalCtaTitle: 'Начните с того, что важно вашей семье',
    finalCtaText: 'Каталог, сравнение и персональная рекомендация помогут сузить выбор и подготовиться к знакомству со школами.',
    finalCtaButton: 'Начать подбор',
    trustItems: ['Проверенные профили школ', 'Сравнение без лишних шагов', 'Сохранение избранного'],
    footerDescription: 'Экспертный каталог школ Астаны для осознанного выбора семьи.',
    footerColumns: [
      ['Навигация', [['Каталог школ', '/catalog'], ['Подобрать школу', '/recommendation'], ['Готовность к школе', '/school-readiness'], ['Мой выбор', '/my-choice']]],
      ['Для родителей', [['Как выбрать школу', '/how-to-choose-school']]],
      ['О проекте', [['О нас', '/about'], ['Добавить школу', '/contribute'], ['Контакты', '/contacts']]]
    ]
  },
  kz: {
    pageTitle: brand.name,
    languageSwitcherLabel: 'Интерфейс тілін таңдаңыз',
    catalogLink: 'Мектептер каталогы',
    recommendationLink: 'Мектеп таңдау',
    readinessLink: 'Мектепке дайындық',
    addSchoolLink: 'Мектеп қосу',
    aboutLink: 'Жоба туралы',
    contactsLink: 'Байланыс',
    favoritesLink: 'Таңдаулылар',
    footerLabel: 'Сайт навигациясы',
    heroEyebrow: 'АСТАНАДАҒЫ МЕКТЕП ТАҢДАУ',
    heroTitle: 'Балаңызға сай келетін мектеп',
    heroDescription: 'Мектептер каталогын зерттеп, маңызды критерийлерді салыстырып, баланың мектепке дайындығын тексеріңіз.',
    heroCta: 'Каталогты қарау',
    heroSecondaryCta: 'Дайындықты тексеру',
    heroNote: '77 мектеп · 5 аудан · деректер тұрақты жаңартылады',
    astanaSchools: 'мектеп каталогта',
    assistantSteps: ['Сәйкес мектептерді табыңыз', 'Маңызды критерийлерді салыстырыңыз', 'Отбасыңызға арналған нұсқаларды сақтаңыз'],
    topTitle: 'Танымал мектептер',
    topSubtitle: 'Бірнеше тексерілген нұсқадан бастап, толық тізім үшін каталогқа өтіңіз.',
    tabs: { public: 'Мемлекеттік', private: 'Жеке' },
    emptyCategory: 'Бұл санатта әзірге мектеп жоқ.',
    catalogButton: 'Барлық 77 мектепті көру →',
    district: 'Аудан',
    rating: 'Рейтинг',
    tuition: 'Құны',
    details: 'Толығырақ',
    notYetRated: 'Әзірге баға жоқ',
    freePublicSchool: 'Тегін',
    priceUnknown: 'Нақтыланады',
    perMonth: 'айына',
    language: 'Тіл',
    toolOneTitle: 'Персональная рекомендация',
    toolOneText: 'Ответьте на вопросы о семье и ребёнке и получите объяснимый шорт-лист школ.',
    toolOneCta: 'Подобрать школу',
    toolTwoTitle: 'Готовность к школе',
    toolTwoText: 'Оцените навыки ребёнка и получите рекомендации для подготовки к школьному старту.',
    toolTwoCta: 'Пройти оценку',
    finalCtaTitle: 'Начните с того, что важно вашей семье',
    finalCtaText: 'Каталог, сравнение и персональная рекомендация помогут сузить выбор и подготовиться к знакомству со школами.',
    finalCtaButton: 'Начать подбор',
    trustItems: ['Проверенные профили школ', 'Сравнение без лишних шагов', 'Сохранение избранного'],
    footerDescription: 'Отбасы саналы таңдау жасайтын Астана мектептерінің сараптамалық каталогы.',
    footerColumns: [
      ['Навигация', [['Мектептер каталогы', '/catalog'], ['Мектеп таңдау', '/recommendation'], ['Мектепке дайындық', '/school-readiness'], ['Таңдаулылар', '/my-choice']]],
      ['Ата-аналарға', [['Мектепті қалай таңдау керек', '/how-to-choose-school']]],
      ['Жоба туралы', [['Біз туралы', '/about'], ['Мектеп қосу', '/contribute'], ['Байланыс', '/contacts']]]
    ]
  },
  en: {
    pageTitle: brand.name,
    languageSwitcherLabel: 'Choose interface language',
    catalogLink: 'Catalog',
    recommendationLink: 'Find a School Match',
    readinessLink: 'School readiness',
    addSchoolLink: 'Add school',
    aboutLink: 'About',
    contactsLink: 'Contacts',
    favoritesLink: 'Favorites',
    footerLabel: 'Site navigation',
    heroEyebrow: 'SCHOOL CHOICE IN ASTANA',
    heroTitle: 'A school that fits your child',
    heroDescription: 'Explore the school catalog, compare key criteria, and check school readiness in one focused flow.',
    heroCta: 'View catalog',
    heroSecondaryCta: 'Check readiness',
    heroNote: '77 schools · 5 districts · data updated regularly',
    astanaSchools: 'schools in the catalog',
    assistantSteps: ['Find suitable schools', 'Compare important criteria', 'Save family options'],
    topTitle: 'Popular schools',
    topSubtitle: 'Start with a few trusted options, then open the catalog for the full list.',
    tabs: { public: 'Public', private: 'Private' },
    emptyCategory: 'There are no schools in this category yet.',
    catalogButton: 'View all 77 schools →',
    district: 'District',
    rating: 'Rating',
    tuition: 'Tuition',
    details: 'Details',
    notYetRated: 'Not yet rated',
    freePublicSchool: 'Free',
    priceUnknown: 'To be confirmed',
    perMonth: 'month',
    language: 'Language',
    toolOneTitle: 'Персональная рекомендация',
    toolOneText: 'Ответьте на вопросы о семье и ребёнке и получите объяснимый шорт-лист школ.',
    toolOneCta: 'Подобрать школу',
    toolTwoTitle: 'Готовность к школе',
    toolTwoText: 'Оцените навыки ребёнка и получите рекомендации для подготовки к школьному старту.',
    toolTwoCta: 'Пройти оценку',
    finalCtaTitle: 'Начните с того, что важно вашей семье',
    finalCtaText: 'Каталог, сравнение и персональная рекомендация помогут сузить выбор и подготовиться к знакомству со школами.',
    finalCtaButton: 'Начать подбор',
    trustItems: ['Проверенные профили школ', 'Сравнение без лишних шагов', 'Сохранение избранного'],
    footerDescription: 'An expert Astana school catalog for informed family decisions.',
    footerColumns: [
      ['Navigation', [['School catalog', '/catalog'], ['Find a School Match', '/recommendation'], ['School readiness', '/school-readiness'], ['Favorites', '/my-choice']]],
      ['For parents', [['How to choose a school', '/how-to-choose-school']]],
      ['About', [['About us', '/about'], ['Add a school', '/contribute'], ['Contacts', '/contacts']]]
    ]
  }
};

const getSchoolCardImage = (school) => getSchoolCoverImage(school);

function withLanguage(href, language) {
  return `${href}${href.includes('?') ? '&' : '?'}lang=${language}`;
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
        <SchoolImageWithFallback src={cardImage} alt={localizedName} schoolName={localizedName} loading="lazy" decoding="async" size="card" fallbackSrc={fallbackImage} />
      </div>
      <div className="top-school-card__body">
        <h3>{localizedName}</h3>
        <p className="top-school-card__district">{getLocalizedEnumLabel('types', school.type, currentLanguage)} · {localizedDistrict}</p>
        <dl className="top-school-card__facts">
          <div><dt>{t.language}</dt><dd>{Array.isArray(school.languages) ? school.languages.join(', ') : getLocalizedSchoolValue(school.languages, currentLanguage) || '—'}</dd></div>
          <div><dt>{t.tuition}</dt><dd>{tuition}</dd></div>
          <div><dt>{t.rating}</dt><dd>{rating}</dd></div>
        </dl>
        <a className="button-link button-link--quiet" href={withLanguage(`/schools/${school.slug}`, currentLanguage)}>{t.details}</a>
      </div>
    </article>
  );
}

function HeroMedia({ poster = '/images/hero/astana-hero.jpg', videoSrc }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canUseVideo, setCanUseVideo] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 901px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setCanUseVideo(Boolean(videoSrc && desktop && !reduced));
  }, [videoSrc]);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <figure className="hero-media" aria-label="BilimChoice school selection preview">
      {canUseVideo ? (
        <video ref={videoRef} className="hero-media__asset" poster={poster} muted playsInline loop autoPlay onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}>
          <source src={videoSrc} type={videoSrc.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
        </video>
      ) : (
        <Image className="hero-media__asset" src={poster} alt="Современные школы Астаны" width={760} height={620} priority />
      )}
      {canUseVideo ? <button className="hero-media__control" type="button" onClick={toggleVideo} aria-label={isPlaying ? 'Поставить видео на паузу' : 'Воспроизвести видео'}>{isPlaying ? 'Pause' : 'Play'}</button> : null}
    </figure>
  );
}


function PopularSchools({ groups, moneyFormatter, t, currentLanguage, reviewsBySchool }) {
  const [activeTab, setActiveTab] = useState('public');
  const activeSchools = groups[activeTab] ?? [];

  return (
    <section className="top-schools" aria-labelledby="top-schools-title">
      <div className="section-heading section-heading--split">
        <div>
          <h2 id="top-schools-title">{t.topTitle}</h2>
          <p>{t.topSubtitle}</p>
        </div>
        <div className="tabs" role="tablist" aria-label={t.topTitle}>
          {Object.keys(groups).map((type) => (
            <button key={type} type="button" role="tab" aria-selected={activeTab === type} className={activeTab === type ? 'tab tab--active' : 'tab'} onClick={() => setActiveTab(type)}>
              {t.tabs[type]}
            </button>
          ))}
        </div>
      </div>
      {activeSchools.length > 0 ? (
        <>
          <div className="top-school-grid">
            {activeSchools.map((school, index) => (
              <HomeSchoolCard key={school.id} rank={index + 1} school={school} moneyFormatter={moneyFormatter} t={t} currentLanguage={currentLanguage} ratingStats={getSchoolRatingStats(school, getSchoolReviews(reviewsBySchool, school.id))} />
            ))}
          </div>
          <div className="top-schools__cta">
            <a className="hero__cta hero__cta--secondary" href={withLanguage('/catalog', currentLanguage)}>{t.catalogButton}</a>
          </div>
        </>
      ) : (
        <div className="empty-note top-schools__empty" role="status">
          <p>{t.emptyCategory}</p>
          <a className="hero__cta hero__cta--secondary" href={withLanguage('/catalog', currentLanguage)}>{t.catalogButton}</a>
        </div>
      )}
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

  const popularSchoolGroups = useMemo(() => {
    const isInternationalSchool = (school) => {
      const localizedSchoolType = typeof school.school_type === 'string' ? school.school_type : Object.values(school.school_type ?? {}).join(' ');
      return school.type === 'international' || localizedSchoolType.toLowerCase().includes('international');
    };
    const isPublicSchool = (school) => (school.type === 'public' || school.type === 'specialized') && !isInternationalSchool(school);
    const isPrivateSchool = (school) => school.type === 'private';

    return {
      public: sortSchools(schools.filter(isPublicSchool), initialSort, currentLanguage, reviewsBySchool).slice(0, 3),
      private: sortSchools(schools.filter(isPrivateSchool), initialSort, currentLanguage, reviewsBySchool).slice(0, 3)
    };
  }, [currentLanguage, reviewsBySchool]);

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
          <a className="site-header__link" href={withLanguage('/recommendation', currentLanguage)}>{t.recommendationLink}</a>
          <a className="site-header__link" href={withLanguage('/school-readiness', currentLanguage)}>{t.readinessLink}</a>
          <a className="site-header__link" href={withLanguage('/about', currentLanguage)}>{t.aboutLink}</a>
        </nav>
        <div className="site-header__actions">
          <a className="site-header__link site-header__link--favorite" href={withLanguage('/my-choice', currentLanguage)}>♡ {t.favoritesLink} ({favoriteCount})</a>
          <LanguageSwitcher currentLanguage={currentLanguage} onLanguageChange={updateLanguage} t={t} />
        </div>
      </header>

      <section className="hero hero--landing" id="top">
        <div className="hero__copy">
          <p className="hero__kicker">{t.heroEyebrow}</p>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroDescription}</p>
          <div className="hero__actions">
            <a className="hero__cta" href={withLanguage('/recommendation', currentLanguage)}>{t.heroCta}</a>
            <a className="hero__cta hero__cta--secondary" href={withLanguage('/catalog', currentLanguage)}>{t.heroSecondaryCta}</a>
          </div>
          <p className="hero__note">{t.heroNote}</p>
        </div>
        <HeroMedia />
      </section>


      <section className="trust-strip" aria-label="BilimChoice trust signals">
        {t.trustItems.map((item) => <span key={item}>{item}</span>)}
      </section>

      <PopularSchools groups={popularSchoolGroups} moneyFormatter={moneyFormatter} t={t} currentLanguage={currentLanguage} reviewsBySchool={reviewsBySchool} />

      <section className="tool-section" aria-labelledby="tool-section-title">
        <div className="tool-card-grid tool-card-grid--two">
          <article className="tool-card--large tool-card--sage">
            <h2 id="tool-section-title">{t.toolOneTitle}</h2>
            <p>{t.toolOneText}</p>
            <a className="button-link" href={withLanguage('/recommendation', currentLanguage)}>{t.toolOneCta}</a>
          </article>
          <article className="tool-card--large tool-card--sand">
            <h2>{t.toolTwoTitle}</h2>
            <p>{t.toolTwoText}</p>
            <a className="button-link button-link--quiet" href={withLanguage('/school-readiness', currentLanguage)}>{t.toolTwoCta}</a>
          </article>
        </div>
      </section>

      <section className="final-cta" aria-labelledby="final-cta-title">
        <h2 id="final-cta-title">{t.finalCtaTitle}</h2>
        <p>{t.finalCtaText}</p>
        <a className="hero__cta" href={withLanguage('/recommendation', currentLanguage)}>{t.finalCtaButton}</a>
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
