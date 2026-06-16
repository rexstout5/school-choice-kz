'use client';

import { useEffect, useMemo, useState } from 'react';
import { getLocalizedEnumLabel, getLocalizedSchoolValue, schools, schoolTypes } from '../../src/data/schools.js';
import { saveSubmission, submissionTypes } from '../../src/lib/submissions.js';

const defaultLanguage = 'ru';
const languageStorageKey = 'school-choice-kz-language';

const languageOptions = [
  { code: 'ru', label: 'RU' },
  { code: 'kz', label: 'KZ' },
  { code: 'en', label: 'EN' }
];

const initialAddSchool = { schoolName: '', address: '', phone: '', website: '', schoolType: '', tuitionFee: '', comment: '', parentContact: '' };
const initialCorrection = { school: '', incorrectInformation: '', correctInformation: '', parentContact: '' };

const translations = {
  ru: {
    pageTitle: 'Вклад родителей', back: '← Назад к каталогу', kicker: 'Помогите улучшить каталог', title: 'Добавьте школу или исправьте информацию', description: 'Заявки пока сохраняются только в localStorage этого браузера.', addSchool: 'Add school', reportIncorrect: 'Report incorrect information', saved: 'Спасибо — заявка сохранена локально.', error: 'Не удалось сохранить заявку.', submitAdd: 'Add school', submitReport: 'Report incorrect information', selectSchool: 'Выберите школу', selectType: 'Выберите тип школы', fields: { schoolName: 'Название школы', address: 'Адрес', phone: 'Телефон', website: 'Сайт', schoolType: 'Тип школы', tuitionFee: 'Стоимость обучения', comment: 'Комментарий', parentContact: 'Контакт родителя', school: 'Школа', incorrectInformation: 'Что неверно', correctInformation: 'Правильная информация' }
  },
  kz: {
    pageTitle: 'Ата-аналар үлесі', back: '← Каталогқа оралу', kicker: 'Каталогты жақсартуға көмектесіңіз', title: 'Мектеп қосыңыз немесе ақпаратты түзетіңіз', description: 'Өтінімдер әзірге тек осы браузердің localStorage қоймасында сақталады.', addSchool: 'Add school', reportIncorrect: 'Report incorrect information', saved: 'Рақмет — өтінім жергілікті сақталды.', error: 'Өтінімді сақтау мүмкін болмады.', submitAdd: 'Add school', submitReport: 'Report incorrect information', selectSchool: 'Мектепті таңдаңыз', selectType: 'Мектеп түрін таңдаңыз', fields: { schoolName: 'Мектеп атауы', address: 'Мекенжай', phone: 'Телефон', website: 'Сайт', schoolType: 'Мектеп түрі', tuitionFee: 'Оқу ақысы', comment: 'Комментарий', parentContact: 'Ата-ананың байланысы', school: 'Мектеп', incorrectInformation: 'Қандай ақпарат қате', correctInformation: 'Дұрыс ақпарат' }
  },
  en: {
    pageTitle: 'Parent contributions', back: '← Back to catalog', kicker: 'Help improve the catalog', title: 'Add a school or correct information', description: 'Submissions are stored only in this browser localStorage for now.', addSchool: 'Add school', reportIncorrect: 'Report incorrect information', saved: 'Thank you — your submission was saved locally.', error: 'Could not save your submission.', submitAdd: 'Add school', submitReport: 'Report incorrect information', selectSchool: 'Select a school', selectType: 'Select school type', fields: { schoolName: 'School name', address: 'Address', phone: 'Phone', website: 'Website', schoolType: 'School type', tuitionFee: 'Tuition fee', comment: 'Comment', parentContact: 'Parent contact', school: 'School', incorrectInformation: 'What is incorrect', correctInformation: 'Correct information' }
  }
};

const getLanguage = (lang) => (lang && translations[lang] ? lang : defaultLanguage);
const getSchoolSlug = (school) => school.slug ?? school.id;

function TextField({ id, label, value, onChange, required = true, type = 'text' }) {
  return <label className="contribution-field" htmlFor={id}><span>{label}</span><input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} /></label>;
}

export default function ContributePage() {
  const [language, setLanguage] = useState(defaultLanguage);
  const [activeTab, setActiveTab] = useState(submissionTypes.addSchool);
  const [addSchool, setAddSchool] = useState(initialAddSchool);
  const [correction, setCorrection] = useState(initialCorrection);
  const [statusMessage, setStatusMessage] = useState('');
  const t = translations[language];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextLanguage = getLanguage(params.get('lang') || window.localStorage.getItem(languageStorageKey));
    setLanguage(nextLanguage);
    if (params.get('tab') === submissionTypes.correction) setActiveTab(submissionTypes.correction);
    if (params.get('school')) setCorrection((current) => ({ ...current, school: params.get('school') }));
  }, []);

  const schoolOptions = useMemo(() => schools.map((school) => ({ slug: getSchoolSlug(school), name: getLocalizedSchoolValue(school.name, language) })), [language]);
  const updateLanguage = (nextLanguage) => { setLanguage(nextLanguage); try { window.localStorage.setItem(languageStorageKey, nextLanguage); } catch {} };
  const handleSave = (event, type) => { event.preventDefault(); try { saveSubmission({ type, language, data: type === submissionTypes.addSchool ? addSchool : correction }); setStatusMessage(t.saved); setAddSchool(initialAddSchool); setCorrection(initialCorrection); } catch { setStatusMessage(t.error); } };

  return <main>
    <nav className="school-detail__topbar" aria-label={t.pageTitle}>
      <a className="back-link" href={`/?lang=${language}`}>{t.back}</a>
      <div className="language-switcher">{languageOptions.map(({ code, label }) => <button key={code} type="button" className={language === code ? 'language-switcher__button language-switcher__button--active' : 'language-switcher__button'} onClick={() => updateLanguage(code)}>{label}</button>)}</div>
    </nav>
    <section className="contribution-page">
      <p className="hero__kicker">{t.kicker}</p><h1>{t.title}</h1><p>{t.description}</p>
      <div className="contribution-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={activeTab === submissionTypes.addSchool} className={activeTab === submissionTypes.addSchool ? 'contribution-tabs__tab contribution-tabs__tab--active' : 'contribution-tabs__tab'} onClick={() => setActiveTab(submissionTypes.addSchool)}>{t.addSchool}</button>
        <button type="button" role="tab" aria-selected={activeTab === submissionTypes.correction} className={activeTab === submissionTypes.correction ? 'contribution-tabs__tab contribution-tabs__tab--active' : 'contribution-tabs__tab'} onClick={() => setActiveTab(submissionTypes.correction)}>{t.reportIncorrect}</button>
      </div>
      {activeTab === submissionTypes.addSchool ? <form className="contribution-form" onSubmit={(event) => handleSave(event, submissionTypes.addSchool)}>
        <TextField id="school-name" label={t.fields.schoolName} value={addSchool.schoolName} onChange={(value) => setAddSchool({ ...addSchool, schoolName: value })} />
        <TextField id="school-address" label={t.fields.address} value={addSchool.address} onChange={(value) => setAddSchool({ ...addSchool, address: value })} />
        <TextField id="school-phone" label={t.fields.phone} value={addSchool.phone} onChange={(value) => setAddSchool({ ...addSchool, phone: value })} type="tel" />
        <TextField id="school-website" label={t.fields.website} value={addSchool.website} onChange={(value) => setAddSchool({ ...addSchool, website: value })} type="url" required={false} />
        <label className="contribution-field" htmlFor="school-type"><span>{t.fields.schoolType}</span><select id="school-type" value={addSchool.schoolType} onChange={(event) => setAddSchool({ ...addSchool, schoolType: event.target.value })} required><option value="">{t.selectType}</option>{schoolTypes.map((type) => <option key={type} value={type}>{getLocalizedEnumLabel('schoolTypes', type, language)}</option>)}</select></label>
        <TextField id="tuition-fee" label={t.fields.tuitionFee} value={addSchool.tuitionFee} onChange={(value) => setAddSchool({ ...addSchool, tuitionFee: value })} />
        <label className="contribution-field" htmlFor="comment"><span>{t.fields.comment}</span><textarea id="comment" rows="4" value={addSchool.comment} onChange={(event) => setAddSchool({ ...addSchool, comment: event.target.value })} /></label>
        <TextField id="parent-contact" label={t.fields.parentContact} value={addSchool.parentContact} onChange={(value) => setAddSchool({ ...addSchool, parentContact: value })} />
        <button type="submit">{t.submitAdd}</button>
      </form> : <form className="contribution-form" onSubmit={(event) => handleSave(event, submissionTypes.correction)}>
        <label className="contribution-field" htmlFor="correction-school"><span>{t.fields.school}</span><select id="correction-school" value={correction.school} onChange={(event) => setCorrection({ ...correction, school: event.target.value })} required><option value="">{t.selectSchool}</option>{schoolOptions.map((school) => <option key={school.slug} value={school.slug}>{school.name}</option>)}</select></label>
        <label className="contribution-field" htmlFor="incorrect-information"><span>{t.fields.incorrectInformation}</span><textarea id="incorrect-information" rows="4" value={correction.incorrectInformation} onChange={(event) => setCorrection({ ...correction, incorrectInformation: event.target.value })} required /></label>
        <label className="contribution-field" htmlFor="correct-information"><span>{t.fields.correctInformation}</span><textarea id="correct-information" rows="4" value={correction.correctInformation} onChange={(event) => setCorrection({ ...correction, correctInformation: event.target.value })} required /></label>
        <TextField id="correction-parent-contact" label={t.fields.parentContact} value={correction.parentContact} onChange={(value) => setCorrection({ ...correction, parentContact: value })} />
        <button type="submit">{t.submitReport}</button>
      </form>}
      <p role="status" aria-live="polite" className="contribution-status">{statusMessage}</p>
    </section>
  </main>;
}
