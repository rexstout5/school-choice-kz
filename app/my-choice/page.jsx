'use client';

import { useEffect, useMemo, useState } from 'react';
import FavoriteButton from '../../src/components/FavoriteButton.jsx';
import { getLocalizedEnumLabel, getLocalizedSchoolValue, schools } from '../../src/data/schools.js';
import { favoritesChangedEventName, getStoredFavoriteSchoolIds } from '../../src/lib/favorites.js';

const defaultLanguage = 'ru';
const languageStorageKey = 'school-choice-kz-language';
const readinessStorageKey = 'school-choice-kz-readiness-results';
const comparisonStorageKey = 'school-choice-kz-comparison';
const maxComparedSchools = 3;

const languageOptions = [
  { code: 'ru', label: 'RU' },
  { code: 'kz', label: 'KZ' },
  { code: 'en', label: 'EN' }
];

const translations = {
  ru: {
    languageSwitcherLabel: 'Выберите язык интерфейса',
    backToCatalog: 'Назад к каталогу',
    pageKicker: 'Мой выбор',
    pageTitle: 'Ваш личный помощник по выбору школы',
    pageDescription: 'Собрали в одном месте сохранённые школы, готовность ребёнка и последнее сравнение — чтобы решение было спокойным и осознанным.',
    savedCount: (count) => `${count} ${count === 1 ? 'школа сохранена' : count > 1 && count < 5 ? 'школы сохранены' : 'школ сохранено'}`,
    savedSchoolsTitle: 'Сохранённые школы', readinessTitle: 'Готовность ребёнка к школе', comparisonTitle: 'История сравнения',
    emptyFavorites: 'Вы пока не добавили школы в избранное.', emptyReadiness: 'Пройдите короткую оценку готовности — я сохраню последний результат здесь.', emptyComparison: 'Сравнение школ ещё не выполнялось.',
    viewReport: 'Посмотреть отчёт', compareAgain: 'Открыть сравнение', startReadiness: 'Проверить готовность', details: 'Подробнее', district: 'Район', schoolType: 'Тип школы', language: 'Язык', tuitionFee: 'Стоимость обучения', freePublicSchool: 'Бесплатная государственная школа', priceUnknown: 'Стоимость уточняется', perMonth: 'в месяц', completedAt: 'Дата завершения', readinessPercent: 'Индекс готовности', readinessLevel: 'Уровень готовности', comparisonSchools: 'Школы в последнем сравнении', favorite: { add: 'Добавить в избранное', remove: 'В избранном' }
  },
  kz: { languageSwitcherLabel: 'Интерфейс тілін таңдаңыз', backToCatalog: 'Каталогқа оралу', pageKicker: 'Менің таңдауым', pageTitle: 'Мектеп таңдаудағы жеке көмекшіңіз', pageDescription: 'Сақталған мектептер, дайындық нәтижесі және соңғы салыстыру бір жерде.', savedCount: (count) => `${count} мектеп сақталды`, savedSchoolsTitle: 'Сақталған мектептер', readinessTitle: 'Баланың мектепке дайындығы', comparisonTitle: 'Салыстыру тарихы', emptyFavorites: 'Сіз әлі таңдаулыға мектеп қоспадыңыз.', emptyReadiness: 'Қысқа дайындық бағалауынан өтіңіз — соңғы нәтиже осында сақталады.', emptyComparison: 'Мектептерді салыстыру әлі орындалмады.', viewReport: 'Есепті көру', compareAgain: 'Салыстыруды ашу', startReadiness: 'Дайындықты тексеру', details: 'Толығырақ', district: 'Аудан', schoolType: 'Мектеп түрі', language: 'Тілі', tuitionFee: 'Оқу ақысы', freePublicSchool: 'Тегін мемлекеттік мектеп', priceUnknown: 'Құны нақтыланады', perMonth: 'айына', completedAt: 'Аяқталған күні', readinessPercent: 'Дайындық индексі', readinessLevel: 'Дайындық деңгейі', comparisonSchools: 'Соңғы салыстырудағы мектептер', favorite: { add: 'Таңдаулыға қосу', remove: 'Таңдаулыда' } },
  en: { languageSwitcherLabel: 'Choose interface language', backToCatalog: 'Back to catalog', pageKicker: 'My choice', pageTitle: 'Your personal school-choice assistant', pageDescription: 'Saved schools, readiness result, and latest comparison are gathered in one calm decision space.', savedCount: (count) => `${count} saved ${count === 1 ? 'school' : 'schools'}`, savedSchoolsTitle: 'Saved schools', readinessTitle: 'School readiness', comparisonTitle: 'Comparison history', emptyFavorites: 'You have not added schools to favorites yet.', emptyReadiness: 'Complete a short readiness check — I will save the latest result here.', emptyComparison: 'No school comparison has been completed yet.', viewReport: 'View report', compareAgain: 'Open comparison', startReadiness: 'Check readiness', details: 'Details', district: 'District', schoolType: 'School type', language: 'Language', tuitionFee: 'Tuition fee', freePublicSchool: 'Free public school', priceUnknown: 'Tuition to be confirmed', perMonth: 'month', completedAt: 'Completion date', readinessPercent: 'Readiness index', readinessLevel: 'Readiness level', comparisonSchools: 'Schools in the latest comparison', favorite: { add: 'Add to favorites', remove: 'Saved to favorites' } }
};

const getLanguage = (language) => (language && translations[language] ? language : defaultLanguage);
const getMoneyFormatter = (language) => new Intl.NumberFormat(language === 'en' ? 'en-US' : language === 'kz' ? 'kk-KZ' : 'ru-RU', { style: 'currency', currency: 'KZT', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 });
const formatPrice = (price, formatter, t) => price === null || price === undefined ? t.priceUnknown : price === 0 ? t.freePublicSchool : `${formatter.format(price)} / ${t.perMonth}`;
const normalizeComparedSchoolIds = (schoolIds) => schoolIds.filter((schoolId, index) => schools.some((school) => school.id === schoolId) && schoolIds.indexOf(schoolId) === index).slice(0, maxComparedSchools);
const parseDate = (value) => value ? new Date(value) : null;
const formatDate = (value, language) => { const date = parseDate(value); return date && !Number.isNaN(date.getTime()) ? new Intl.DateTimeFormat(language === 'en' ? 'en-US' : language === 'kz' ? 'kk-KZ' : 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date) : '—'; };
function getLatestReadinessResult() { try { const parsed = JSON.parse(window.localStorage.getItem(readinessStorageKey) || '[]'); const results = Array.isArray(parsed) ? parsed : [parsed]; return results.filter(Boolean).sort((a, b) => (parseDate(b.completedAt)?.getTime() ?? 0) - (parseDate(a.completedAt)?.getTime() ?? 0))[0] ?? null; } catch { return null; } }
function getStoredComparedSchoolIds() { try { const parsed = JSON.parse(window.localStorage.getItem(comparisonStorageKey) || '[]'); return normalizeComparedSchoolIds(Array.isArray(parsed) ? parsed : parsed.schoolIds ?? []); } catch { return []; } }
function LanguageSwitcher({ currentLanguage, onLanguageChange, t }) { return <div className="language-switcher" aria-label={t.languageSwitcherLabel}>{languageOptions.map(({ code, label }) => <button key={code} type="button" className={currentLanguage === code ? 'language-switcher__button language-switcher__button--active' : 'language-switcher__button'} aria-pressed={currentLanguage === code} onClick={() => onLanguageChange(code)}>{label}</button>)}</div>; }

export default function MyChoicePage() {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [favoriteSchoolIds, setFavoriteSchoolIds] = useState([]);
  const [readinessResult, setReadinessResult] = useState(null);
  const [comparedSchoolIds, setComparedSchoolIds] = useState([]);
  useEffect(() => { const syncPersonalChoice = () => { setFavoriteSchoolIds(getStoredFavoriteSchoolIds()); setReadinessResult(getLatestReadinessResult()); setComparedSchoolIds(getStoredComparedSchoolIds()); }; try { setCurrentLanguage(getLanguage(new URLSearchParams(window.location.search).get('lang') || window.localStorage.getItem(languageStorageKey))); } catch { setCurrentLanguage(defaultLanguage); } syncPersonalChoice(); window.addEventListener('storage', syncPersonalChoice); window.addEventListener(favoritesChangedEventName, syncPersonalChoice); return () => { window.removeEventListener('storage', syncPersonalChoice); window.removeEventListener(favoritesChangedEventName, syncPersonalChoice); }; }, []);
  const t = translations[currentLanguage];
  const moneyFormatter = useMemo(() => getMoneyFormatter(currentLanguage), [currentLanguage]);
  const favoriteSchools = favoriteSchoolIds.map((schoolId) => schools.find((school) => school.id === schoolId)).filter(Boolean);
  const comparedSchools = comparedSchoolIds.map((schoolId) => schools.find((school) => school.id === schoolId)).filter(Boolean);
  const updateLanguage = (language) => { setCurrentLanguage(language); try { window.localStorage.setItem(languageStorageKey, language); window.history.replaceState(null, '', `/my-choice?lang=${language}`); } catch {} };
  return <main><nav className="school-detail__topbar" aria-label={t.languageSwitcherLabel}><a className="back-link" href={`/?lang=${currentLanguage}`}>← {t.backToCatalog}</a><LanguageSwitcher currentLanguage={currentLanguage} onLanguageChange={updateLanguage} t={t} /></nav><section className="my-choice-hero" aria-labelledby="my-choice-title"><p className="hero__kicker">{t.pageKicker}</p><h1 id="my-choice-title">{t.pageTitle}</h1><p>{t.pageDescription}</p><strong>{t.savedCount(favoriteSchools.length)}</strong></section><section className="my-choice-grid" aria-label={t.pageKicker}><article className="my-choice-panel my-choice-panel--wide"><div className="my-choice-panel__heading"><span>♡</span><div><p className="hero__kicker">1</p><h2>{t.savedSchoolsTitle}</h2></div></div>{favoriteSchools.length > 0 ? <div className="my-choice-school-list">{favoriteSchools.map((school) => <div className="my-choice-school-card" key={school.id}><div><p>{getLocalizedEnumLabel('districts', school.district, currentLanguage)}</p><h3>{getLocalizedSchoolValue(school.name, currentLanguage)}</h3><span>{getLocalizedSchoolValue(school.school_type, currentLanguage)} · {formatPrice(school.tuition_fee, moneyFormatter, t)}</span></div><FavoriteButton schoolId={school.id} labels={t.favorite} /><a className="button-link" href={`/schools/${school.slug ?? school.id}?lang=${currentLanguage}`}>{t.details}</a></div>)}</div> : <div className="my-choice-empty"><p>{t.emptyFavorites}</p><a className="button-link" href={`/catalog?lang=${currentLanguage}`}>{t.backToCatalog}</a></div>}</article><article className="my-choice-panel"><div className="my-choice-panel__heading"><span>✓</span><div><p className="hero__kicker">2</p><h2>{t.readinessTitle}</h2></div></div>{readinessResult ? <div className="my-choice-readiness"><div className="my-choice-score"><strong>{readinessResult.percent}%</strong><span>{readinessResult.level}</span></div><dl><div><dt>{t.readinessPercent}</dt><dd>{readinessResult.percent}%</dd></div><div><dt>{t.readinessLevel}</dt><dd>{readinessResult.level}</dd></div><div><dt>{t.completedAt}</dt><dd>{formatDate(readinessResult.completedAt, currentLanguage)}</dd></div></dl><a className="hero__cta" href={`/school-readiness?lang=${currentLanguage}`}>{t.viewReport}</a></div> : <div className="my-choice-empty"><p>{t.emptyReadiness}</p><a className="button-link" href={`/school-readiness?lang=${currentLanguage}`}>{t.startReadiness}</a></div>}</article><article className="my-choice-panel"><div className="my-choice-panel__heading"><span>⇄</span><div><p className="hero__kicker">3</p><h2>{t.comparisonTitle}</h2></div></div>{comparedSchools.length > 0 ? <div className="my-choice-comparison"><p>{t.comparisonSchools}</p><ul>{comparedSchools.map((school) => <li key={school.id}>{getLocalizedSchoolValue(school.name, currentLanguage)}</li>)}</ul><a className="hero__cta hero__cta--secondary" href={`/compare?lang=${currentLanguage}`}>{t.compareAgain}</a></div> : <div className="my-choice-empty"><p>{t.emptyComparison}</p><a className="button-link" href={`/catalog?lang=${currentLanguage}`}>{t.backToCatalog}</a></div>}</article></section></main>;
}
