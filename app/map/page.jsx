'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getLocalizedEnumLabel,
  getLocalizedSchoolValue,
  schoolDistricts,
  schoolLanguages,
  schools,
  schoolTypes
} from '../../src/data/schools.js';
import { doesSchoolMatchCatalogFilters } from '../../src/lib/schoolFilters.js';
import { priceOptionValues } from '../../src/lib/priceFilters.js';
import { formatAverageRating } from '../../src/lib/reviews.js';

const defaultLanguage = 'ru';
const languageStorageKey = 'school-choice-kz-language';

const initialFilters = {
  type: 'all',
  language: 'all',
  district: 'all',
  maxPrice: 'all',
  minRating: 'all'
};

const translations = {
  ru: {
    pageTitle: 'Карта школ Астаны', catalogLink: 'Каталог', mapLink: 'Карта', languageSwitcherLabel: 'Выберите язык интерфейса',
    heroTitle: 'Интерактивная карта школ Астаны', heroDescription: 'Фильтруйте школы по тем же параметрам, что и в каталоге, и открывайте карточки на карте.',
    filtersAria: 'Фильтры карты школ', all: 'Все', type: 'Тип', language: 'Язык', district: 'Район', maxMonthlyPrice: 'Стоимость обучения', rating: 'Рейтинг',
    ratingOptions: { all: 'Любой рейтинг', '4.5': 'От 4.5', '4': 'От 4.0', '3.5': 'От 3.5' },
    priceOptions: { all: 'Все', free: 'Только бесплатные', paid_only: 'Только платные', up_to_200000: 'Платные до 200 000 ₸', range_200000_400000: 'Платные 200 000–400 000 ₸', range_400000_800000: 'Платные 400 000–800 000 ₸', range_800000_plus: 'Платные от 800 000 ₸', unknown_price: 'Стоимость неизвестна' },
    shown: (m, t) => `${m} из ${t} школ показаны на карте`, resetFilters: 'Сбросить фильтры', tuitionFee: 'Стоимость', freePublicSchool: 'Бесплатная государственная школа', priceUnknown: 'Стоимость уточняется', perMonth: 'в месяц', details: 'Подробнее', notYetRated: 'Пока нет оценки', withoutCoordinates: 'Schools without coordinates'
  },
  kz: {
    pageTitle: 'Астана мектептерінің картасы', catalogLink: 'Каталог', mapLink: 'Карта', languageSwitcherLabel: 'Интерфейс тілін таңдаңыз',
    heroTitle: 'Астана мектептерінің интерактивті картасы', heroDescription: 'Каталогтағыдай сүзгілермен мектептерді таңдаңыз және картадан карточкаларын ашыңыз.',
    filtersAria: 'Мектеп картасының сүзгілері', all: 'Барлығы', type: 'Түрі', language: 'Тілі', district: 'Аудан', maxMonthlyPrice: 'Оқу ақысы', rating: 'Рейтинг',
    ratingOptions: { all: 'Кез келген рейтинг', '4.5': '4.5-тен жоғары', '4': '4.0-ден жоғары', '3.5': '3.5-тен жоғары' },
    priceOptions: { all: 'Барлығы', free: 'Тек тегін', paid_only: 'Тек ақылы', up_to_200000: 'Ақылы 200 000 ₸ дейін', range_200000_400000: 'Ақылы 200 000–400 000 ₸', range_400000_800000: 'Ақылы 400 000–800 000 ₸', range_800000_plus: 'Ақылы 800 000 ₸ бастап', unknown_price: 'Бағасы белгісіз' },
    shown: (m, t) => `${m}/${t} мектеп картада көрсетілді`, resetFilters: 'Сүзгілерді тазалау', tuitionFee: 'Оқу ақысы', freePublicSchool: 'Тегін мемлекеттік мектеп', priceUnknown: 'Құны нақтыланады', perMonth: 'айына', details: 'Толығырақ', notYetRated: 'Әзірге баға жоқ', withoutCoordinates: 'Schools without coordinates'
  },
  en: {
    pageTitle: 'Astana school map', catalogLink: 'Catalog', mapLink: 'Map', languageSwitcherLabel: 'Choose interface language',
    heroTitle: 'Interactive map of Astana schools', heroDescription: 'Use the same catalog filters to explore schools and open school cards directly from the map.',
    filtersAria: 'School map filters', all: 'All', type: 'Type', language: 'Language', district: 'District', maxMonthlyPrice: 'Tuition fee', rating: 'Rating',
    ratingOptions: { all: 'Any rating', '4.5': '4.5+', '4': '4.0+', '3.5': '3.5+' },
    priceOptions: { all: 'All', free: 'Free only', paid_only: 'Paid only', up_to_200000: 'Paid up to 200,000 KZT', range_200000_400000: 'Paid 200,000–400,000 KZT', range_400000_800000: 'Paid 400,000–800,000 KZT', range_800000_plus: 'Paid 800,000+ KZT', unknown_price: 'Unknown price' },
    shown: (m, t) => `${m} of ${t} schools shown on the map`, resetFilters: 'Reset filters', tuitionFee: 'Tuition', freePublicSchool: 'Free public school', priceUnknown: 'Tuition to be confirmed', perMonth: 'month', details: 'Details', notYetRated: 'Not yet rated', withoutCoordinates: 'Schools without coordinates'
  }
};

const languageOptions = [{ code: 'ru', label: 'RU' }, { code: 'kz', label: 'KZ' }, { code: 'en', label: 'EN' }];
const ratingOptions = ['all', '4.5', '4', '3.5'];

const getLanguageFromUrl = () => typeof window === 'undefined' ? defaultLanguage : new URLSearchParams(window.location.search).get('lang');
const isSupportedLanguage = (language) => ['ru', 'kz', 'en'].includes(language);
const formatPrice = (school, t) => school.tuition_fee === 0 ? t.freePublicSchool : typeof school.tuition_fee === 'number' ? `${school.tuition_fee.toLocaleString('ru-RU')} ₸ / ${t.perMonth}` : t.priceUnknown;

function FilterControl({ id, label, value, options, optionLabels, allLabel, onChange }) {
  return <label className="filter-control" htmlFor={id}><span>{label}</span><select id={id} value={value} onChange={(event) => onChange(event.target.value)}><option value="all">{allLabel}</option>{options.map((option) => <option key={option} value={option}>{optionLabels?.[option] ?? option}</option>)}</select></label>;
}

function LanguageSwitcher({ currentLanguage, onLanguageChange, t }) {
  return <div className="language-switcher" aria-label={t.languageSwitcherLabel}>{languageOptions.map((language) => <button key={language.code} type="button" className={currentLanguage === language.code ? 'language-switcher__button language-switcher__button--active' : 'language-switcher__button'} onClick={() => onLanguageChange(language.code)}>{language.label}</button>)}</div>;
}

export default function MapPage() {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [filters, setFilters] = useState(initialFilters);
  const t = translations[currentLanguage];

  useEffect(() => {
    const urlLanguage = getLanguageFromUrl();
    const storedLanguage = window.localStorage.getItem(languageStorageKey);
    setCurrentLanguage(isSupportedLanguage(urlLanguage) ? urlLanguage : isSupportedLanguage(storedLanguage) ? storedLanguage : defaultLanguage);
  }, []);

  const filteredSchools = useMemo(() => schools.filter((school) => doesSchoolMatchCatalogFilters(school, filters) && (filters.minRating === 'all' || school.rating >= Number(filters.minRating))), [filters]);
  const schoolsWithCoordinates = filteredSchools.filter((school) => typeof school.latitude === 'number' && typeof school.longitude === 'number' && school.coordinates_status !== 'missing');
  const schoolsWithoutCoordinates = filteredSchools.filter((school) => !schoolsWithCoordinates.includes(school));

  useEffect(() => {
    if (!document.querySelector('link[data-leaflet]')) {
      const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; link.dataset.leaflet = 'true'; document.head.appendChild(link);
    }
    if (!document.querySelector('script[data-leaflet]')) {
      const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.dataset.leaflet = 'true'; document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let retryTimer;

    const renderMap = () => {
      if (cancelled) return;

      if (!window.L) {
        retryTimer = window.setTimeout(renderMap, 100);
        return;
      }

      const element = document.getElementById('astana-school-map');
      if (!element) return;
      if (element._leaflet_id) element._leaflet_map.remove();
      const map = window.L.map(element).setView([51.128, 71.43], 11);
      element._leaflet_map = map;
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
      schoolsWithCoordinates.forEach((school) => {
        const name = getLocalizedSchoolValue(school.name, currentLanguage);
        window.L.marker([school.latitude, school.longitude]).addTo(map).bindPopup(`<strong>${name}</strong><br>${getLocalizedEnumLabel('districts', school.district, currentLanguage)}<br>${t.tuitionFee}: ${formatPrice(school, t)}<br>${t.rating}: ${school.rating ? formatAverageRating(school.rating) : t.notYetRated}<br><a class="button-link map-popup__details" href="/schools/${school.id}?lang=${currentLanguage}">${t.details}</a>`);
      });
      if (schoolsWithCoordinates.length > 0) map.fitBounds(schoolsWithCoordinates.map((school) => [school.latitude, school.longitude]), { padding: [32, 32], maxZoom: 13 });
    };

    renderMap();

    return () => {
      cancelled = true;
      window.clearTimeout(retryTimer);
    };
  }, [schoolsWithCoordinates, currentLanguage, t]);

  const updateLanguage = (language) => { setCurrentLanguage(language); window.localStorage.setItem(languageStorageKey, language); window.history.replaceState(null, '', `/map?lang=${language}`); };
  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const optionLabels = (dictionaryName, values) => Object.fromEntries(values.map((value) => [value, getLocalizedEnumLabel(dictionaryName, value, currentLanguage)]));

  return <main>
    <header className="site-header"><a className="site-header__brand" href={`/?lang=${currentLanguage}`}>{t.pageTitle}</a><div className="site-header__actions"><a className="site-header__link" href={`/?lang=${currentLanguage}`}>{t.catalogLink}</a><a className="site-header__link" href={`/map?lang=${currentLanguage}`}>{t.mapLink}</a><LanguageSwitcher currentLanguage={currentLanguage} onLanguageChange={updateLanguage} t={t} /></div></header>
    <section className="hero"><div><p className="hero__kicker">{t.mapLink}</p><h1>{t.heroTitle}</h1><p>{t.heroDescription}</p></div><div className="hero__stat"><strong>{schoolsWithCoordinates.length}</strong><span>{t.mapLink}</span></div></section>
    <section className="filters filters--map" aria-label={t.filtersAria}><FilterControl id="type" label={t.type} value={filters.type} options={schoolTypes} allLabel={t.all} optionLabels={optionLabels('schoolTypes', schoolTypes)} onChange={(value) => updateFilter('type', value)} /><FilterControl id="language" label={t.language} value={filters.language} options={schoolLanguages} allLabel={t.all} optionLabels={optionLabels('instructionLanguages', schoolLanguages)} onChange={(value) => updateFilter('language', value)} /><FilterControl id="district" label={t.district} value={filters.district} options={schoolDistricts} allLabel={t.all} optionLabels={optionLabels('districts', schoolDistricts)} onChange={(value) => updateFilter('district', value)} /><FilterControl id="maxPrice" label={t.maxMonthlyPrice} value={filters.maxPrice} options={priceOptionValues.filter((value) => value !== 'all')} allLabel={t.all} optionLabels={t.priceOptions} onChange={(value) => updateFilter('maxPrice', value)} /><FilterControl id="rating" label={t.rating} value={filters.minRating} options={ratingOptions.filter((value) => value !== 'all')} allLabel={t.ratingOptions.all} optionLabels={t.ratingOptions} onChange={(value) => updateFilter('minRating', value)} /></section>
    <section className="results-heading"><h2>{t.shown(schoolsWithCoordinates.length, filteredSchools.length)}</h2><button type="button" onClick={() => setFilters(initialFilters)}>{t.resetFilters}</button></section>
    <section className="map-layout"><div id="astana-school-map" className="school-map" aria-label={t.pageTitle} /><aside className="without-coordinates"><h2>{t.withoutCoordinates}</h2>{schoolsWithoutCoordinates.length > 0 ? <ul>{schoolsWithoutCoordinates.map((school) => <li key={school.id}><a href={`/schools/${school.id}?lang=${currentLanguage}`}>{getLocalizedSchoolValue(school.name, currentLanguage)}</a><span>{getLocalizedEnumLabel('districts', school.district, currentLanguage)}</span></li>)}</ul> : <p>{t.shown(0, 0)}</p>}</aside></section>
  </main>;
}
