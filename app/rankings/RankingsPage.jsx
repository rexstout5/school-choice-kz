'use client';

import { useEffect, useMemo, useState } from 'react';
import { getLocalizedEnumLabel, getLocalizedSchoolValue, schoolDistricts, schoolLanguages, schools } from '../../src/data/schools.js';
import { doesSchoolMatchCatalogFilters } from '../../src/lib/schoolFilters.js';
import { priceOptionValues } from '../../src/lib/priceFilters.js';
import { formatAverageRating, getStoredReviewsBySchool } from '../../src/lib/reviews.js';
import { doesSchoolMatchRankingCategory, rankSchools } from '../../src/lib/rankings.js';
import { brand } from '../../src/data/brand.js';

const languageStorageKey = 'school-choice-kz-language';
const defaultLanguage = 'ru';

const languageOptions = [
  { code: 'ru', label: 'RU' },
  { code: 'kz', label: 'KZ' },
  { code: 'en', label: 'EN' }
];

const initialFilters = { language: 'all', district: 'all', maxPrice: 'all' };

const translations = {
  ru: {
    home: 'Главная', rankings: 'Рейтинги', all: 'Все', language: 'Язык', district: 'Район', tuition: 'Стоимость', reset: 'Сбросить', details: 'Подробнее',
    title: 'Топ школ Астаны', privateTitle: 'Топ частных школ', publicTitle: 'Топ государственных школ', stemTitle: 'Топ STEM-школ', englishTitle: 'Топ школ с английским языком',
    description: 'Рейтинг учитывает оценку, количество отзывов, полноту профиля школы, программы и качество данных.',
    factors: ['рейтинг', 'отзывы', 'полнота профиля', 'программы', 'качество данных'],
    position: 'Место', rating: 'Рейтинг', reviews: 'Отзывы', districtLabel: 'Район', tuitionFee: 'Стоимость обучения', score: 'Индекс', noResults: 'Школы не найдены — измените фильтры.', free: 'Бесплатно', unknown: 'Уточняется', perMonth: 'в месяц',
    priceOptions: { all: 'Все', free: 'Только бесплатные', paid_only: 'Только платные', up_to_200000: 'Платные до 200 000 ₸', range_200000_400000: 'Платные 200 000–400 000 ₸', range_400000_800000: 'Платные 400 000–800 000 ₸', range_800000_plus: 'Платные от 800 000 ₸', unknown_price: 'Стоимость неизвестна' }
  },
  kz: {
    home: 'Басты бет', rankings: 'Рейтингтер', all: 'Барлығы', language: 'Тілі', district: 'Аудан', tuition: 'Оқу ақысы', reset: 'Тазалау', details: 'Толығырақ',
    title: 'Астанадағы үздік мектептер', privateTitle: 'Үздік жеке мектептер', publicTitle: 'Үздік мемлекеттік мектептер', stemTitle: 'Үздік STEM мектептері', englishTitle: 'Ағылшын тіліндегі үздік мектептер',
    description: 'Рейтинг бағаны, пікір санын, мектеп профилінің толықтығын, бағдарламаларды және дерек сапасын ескереді.',
    factors: ['рейтинг', 'пікірлер', 'профиль толықтығы', 'бағдарламалар', 'дерек сапасы'],
    position: 'Орын', rating: 'Рейтинг', reviews: 'Пікірлер', districtLabel: 'Аудан', tuitionFee: 'Оқу ақысы', score: 'Индекс', noResults: 'Мектептер табылмады — сүзгілерді өзгертіңіз.', free: 'Тегін', unknown: 'Нақтыланады', perMonth: 'айына',
    priceOptions: { all: 'Барлығы', free: 'Тек тегін', paid_only: 'Тек ақылы', up_to_200000: 'Ақылы 200 000 ₸ дейін', range_200000_400000: 'Ақылы 200 000–400 000 ₸', range_400000_800000: 'Ақылы 400 000–800 000 ₸', range_800000_plus: 'Ақылы 800 000 ₸ бастап', unknown_price: 'Бағасы белгісіз' }
  },
  en: {
    home: 'Home', rankings: 'Rankings', all: 'All', language: 'Language', district: 'District', tuition: 'Tuition', reset: 'Reset', details: 'Details',
    title: 'Top schools in Astana', privateTitle: 'Top private schools', publicTitle: 'Top public schools', stemTitle: 'Top STEM schools', englishTitle: 'Top English schools',
    description: 'Rankings account for rating, review volume, school profile completeness, programs, and data quality.',
    factors: ['rating', 'reviews', 'profile completeness', 'programs', 'data quality'],
    position: 'Position', rating: 'Rating', reviews: 'Reviews', districtLabel: 'District', tuitionFee: 'Tuition fee', score: 'Index', noResults: 'No schools found — adjust filters.', free: 'Free', unknown: 'To be confirmed', perMonth: 'month',
    priceOptions: { all: 'All', free: 'Free only', paid_only: 'Paid only', up_to_200000: 'Paid up to 200,000 KZT', range_200000_400000: 'Paid 200,000–400,000 KZT', range_400000_800000: 'Paid 400,000–800,000 KZT', range_800000_plus: 'Paid 800,000+ KZT', unknown_price: 'Unknown price' }
  }
};

const categoryTitleKey = { all: 'title', 'private-schools': 'privateTitle', 'public-schools': 'publicTitle', 'stem-schools': 'stemTitle', 'english-schools': 'englishTitle' };

function Filter({ id, label, value, onChange, options, optionLabels, allLabel }) {
  return <label className="filter-control" htmlFor={id}><span>{label}</span><select id={id} value={value} onChange={(event) => onChange(event.target.value)}><option value="all">{allLabel}</option>{options.map((option) => <option key={option} value={option}>{optionLabels?.[option] ?? option}</option>)}</select></label>;
}

export default function RankingsPage({ category = 'all' }) {
  const [language, setLanguage] = useState(defaultLanguage);
  const [filters, setFilters] = useState(initialFilters);
  const [reviewsBySchool, setReviewsBySchool] = useState({});

  useEffect(() => {
    setReviewsBySchool(getStoredReviewsBySchool());
    const params = new URLSearchParams(window.location.search);
    const nextLanguage = params.get('lang') || window.localStorage.getItem(languageStorageKey);
    if (translations[nextLanguage]) setLanguage(nextLanguage);
  }, []);

  const t = translations[language];
  const moneyFormatter = useMemo(() => new Intl.NumberFormat(language === 'en' ? 'en-US' : language === 'kz' ? 'kk-KZ' : 'ru-RU', { style: 'currency', currency: 'KZT', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 }), [language]);
  const rankedSchools = useMemo(() => rankSchools(schools.filter((school) => doesSchoolMatchRankingCategory(school, category) && doesSchoolMatchCatalogFilters(school, { type: 'all', ...filters })), reviewsBySchool), [category, filters, reviewsBySchool]);
  const updateFilter = (name, value) => setFilters((current) => ({ ...current, [name]: value }));
  const updateLanguage = (nextLanguage) => { setLanguage(nextLanguage); window.localStorage.setItem(languageStorageKey, nextLanguage); };
  const formatTuition = (fee) => fee === 0 ? t.free : fee === null || fee === undefined ? t.unknown : `${moneyFormatter.format(fee)} / ${t.perMonth}`;

  return <main>
    <header className="site-header">
      <a className="site-header__brand" href={`/?lang=${language}`}>{brand.name}</a>
      <div className="site-header__actions">
        <a className="site-header__link" href={`/?lang=${language}`}>{t.home}</a>
        {languageOptions.map(({ code, label }) => <button key={code} type="button" className={language === code ? 'language-switcher__button language-switcher__button--active' : 'language-switcher__button'} onClick={() => updateLanguage(code)}>{label}</button>)}
      </div>
    </header>

    <section className="rankings-hero">
      <p className="hero__kicker">{t.rankings}</p>
      <h1>{t[categoryTitleKey[category]]}</h1>
      <p>{t.description}</p>
      <div className="ranking-factors">{t.factors.map((factor) => <span key={factor}>{factor}</span>)}</div>
    </section>

    <section className="filters" aria-label={t.rankings}>
      <Filter id="ranking-language" label={t.language} value={filters.language} onChange={(value) => updateFilter('language', value)} options={schoolLanguages} optionLabels={Object.fromEntries(schoolLanguages.map((item) => [item, getLocalizedEnumLabel('instructionLanguages', item, language)]))} allLabel={t.all} />
      <Filter id="ranking-district" label={t.district} value={filters.district} onChange={(value) => updateFilter('district', value)} options={schoolDistricts} optionLabels={Object.fromEntries(schoolDistricts.map((item) => [item, getLocalizedEnumLabel('districts', item, language)]))} allLabel={t.all} />
      <label className="filter-control" htmlFor="ranking-price"><span>{t.tuition}</span><select id="ranking-price" value={filters.maxPrice} onChange={(event) => updateFilter('maxPrice', event.target.value)}>{priceOptionValues.map((option) => <option key={option} value={option}>{t.priceOptions[option]}</option>)}</select></label>
      <button type="button" onClick={() => setFilters(initialFilters)}>{t.reset}</button>
    </section>

    <section className="ranking-list">
      {rankedSchools.length === 0 ? <p className="empty-state">{t.noResults}</p> : rankedSchools.map(({ school, ranking, position }) => {
        const name = getLocalizedSchoolValue(school.name, language);
        return <article className="ranking-card" key={school.id}>
          <div className="ranking-card__position"><span>{t.position}</span><strong>#{position}</strong></div>
          <div className="ranking-card__main"><p className="school-card__eyebrow">{getLocalizedEnumLabel('schoolTypes', school.type, language)}</p><h2>{name}</h2><p>{getLocalizedSchoolValue(school.programs, language).slice(0, 3).join(' · ')}</p></div>
          <dl className="ranking-card__metrics">
            <div><dt>{t.rating}</dt><dd>{ranking.rating === null ? '—' : `${formatAverageRating(ranking.rating)} / 5`}</dd></div>
            <div><dt>{t.reviews}</dt><dd>{ranking.reviewCount}</dd></div>
            <div><dt>{t.districtLabel}</dt><dd>{getLocalizedEnumLabel('districts', school.district, language)}</dd></div>
            <div><dt>{t.tuitionFee}</dt><dd>{formatTuition(school.tuition_fee)}</dd></div>
            <div><dt>{t.score}</dt><dd>{Math.round(ranking.score * 100)}</dd></div>
          </dl>
          <a className="button-link" href={`/schools/${school.slug ?? school.id}?lang=${language}`}>{t.details}</a>
        </article>;
      })}
    </section>
  </main>;
}
