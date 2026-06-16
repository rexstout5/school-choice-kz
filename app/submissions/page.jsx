'use client';

import { useEffect, useState } from 'react';
import { getLocalizedSchoolValue, schools } from '../../src/data/schools.js';
import { getStoredSubmissions, submissionTypes } from '../../src/lib/submissions.js';

const defaultLanguage = 'ru';
const languageStorageKey = 'school-choice-kz-language';
const translations = {
  ru: { title: 'Отправленные заявки', back: '← Назад к каталогу', description: 'Debug-view: данные читаются из localStorage этого браузера.', newSchools: 'Новые школы', corrections: 'Исправления', empty: 'Пока нет заявок.', submittedAt: 'Дата', parentContact: 'Контакт родителя' },
  kz: { title: 'Жіберілген өтінімдер', back: '← Каталогқа оралу', description: 'Debug-view: деректер осы браузердің localStorage қоймасынан оқылады.', newSchools: 'Жаңа мектептер', corrections: 'Түзетулер', empty: 'Әзірге өтінім жоқ.', submittedAt: 'Күні', parentContact: 'Ата-ананың байланысы' },
  en: { title: 'Submitted contributions', back: '← Back to catalog', description: 'Debug view: data is read from this browser localStorage.', newSchools: 'New schools', corrections: 'Corrections', empty: 'No submissions yet.', submittedAt: 'Submitted', parentContact: 'Parent contact' }
};
const getLanguage = (lang) => (lang && translations[lang] ? lang : defaultLanguage);
const getSchoolSlug = (school) => school.slug ?? school.id;
const getSchoolName = (slug, language) => getLocalizedSchoolValue(schools.find((school) => getSchoolSlug(school) === slug)?.name, language) || slug;

function SubmissionCard({ submission, language, t }) {
  const entries = Object.entries(submission.data || {}).filter(([, value]) => String(value || '').trim().length > 0);
  return <article className="submission-card"><h3>{submission.type === submissionTypes.correction ? getSchoolName(submission.data?.school, language) : submission.data?.schoolName}</h3><dl>{entries.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{key === 'school' ? getSchoolName(value, language) : value}</dd></div>)}<div><dt>{t.submittedAt}</dt><dd>{new Date(submission.submittedAt).toLocaleString(language === 'kz' ? 'kk-KZ' : language === 'en' ? 'en-US' : 'ru-RU')}</dd></div></dl></article>;
}

export default function SubmissionsPage() {
  const [language, setLanguage] = useState(defaultLanguage);
  const [submissions, setSubmissions] = useState([]);
  useEffect(() => { const params = new URLSearchParams(window.location.search); setLanguage(getLanguage(params.get('lang') || window.localStorage.getItem(languageStorageKey))); setSubmissions(getStoredSubmissions()); }, []);
  const t = translations[language];
  const newSchools = submissions.filter((submission) => submission.type === submissionTypes.addSchool);
  const corrections = submissions.filter((submission) => submission.type === submissionTypes.correction);

  return <main><nav className="school-detail__topbar" aria-label={t.title}><a className="back-link" href={`/?lang=${language}`}>{t.back}</a></nav><section className="contribution-page"><h1>{t.title}</h1><p>{t.description}</p><section className="submissions-section"><h2>{t.newSchools}</h2>{newSchools.length ? newSchools.map((submission) => <SubmissionCard key={submission.id} submission={submission} language={language} t={t} />) : <p className="empty-state__text">{t.empty}</p>}</section><section className="submissions-section"><h2>{t.corrections}</h2>{corrections.length ? corrections.map((submission) => <SubmissionCard key={submission.id} submission={submission} language={language} t={t} />) : <p className="empty-state__text">{t.empty}</p>}</section></section></main>;
}
