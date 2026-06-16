'use client';

import { useEffect, useMemo, useState } from 'react';
import { getLocalizedEnumLabel, getLocalizedSchoolValue, schools } from '../../src/data/schools.js';
import { formatAverageRating } from '../../src/lib/reviews.js';
import { getRatingSummaryKey, getSchoolRatingStats } from '../../src/lib/schoolDiscovery.js';

const defaultLanguage = 'ru';
const languageStorageKey = 'school-choice-kz-language';
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
    pageKicker: 'Сравнение школ',
    pageTitle: 'Сравните выбранные школы',
    pageDescription: 'Таблица показывает ключевые параметры школ, которые вы добавили к сравнению в каталоге.',
    selectedCount: (count) => `${count} из ${maxComparedSchools} выбрано`,
    emptyTitle: 'Вы пока не выбрали школы',
    emptyDescription: 'Вернитесь в каталог и отметьте до трех школ кнопкой «Сравнить».',
    remove: 'Удалить',
    fields: {
      schoolName: 'Название школы',
      district: 'Район',
      schoolType: 'Тип школы',
      language: 'Язык обучения',
      tuitionFee: 'Стоимость обучения',
      afterSchoolProgram: 'Продленка',
      schoolBus: 'Школьный автобус',
      admissionRequirements: 'Требования к поступлению',
      classSize: 'Размер класса',
      dataStatus: 'Статус данных',
      rating: 'Рейтинг',
      reviews: 'Отзывы'
    },
    freePublicSchool: 'Бесплатная государственная школа',
    priceUnknown: 'Стоимость уточняется',
    perMonth: 'в месяц',
    notYetRated: 'Пока нет оценки',
    reviewCount: (count) => `${count} ${count === 1 ? 'отзыв' : count > 1 && count < 5 ? 'отзыва' : 'отзывов'}`,
    ratingSummary: { excellent: 'Отлично', good: 'Хорошо', average: 'Средне' }
  },
  kz: {
    languageSwitcherLabel: 'Интерфейс тілін таңдаңыз',
    backToCatalog: 'Каталогқа оралу',
    pageKicker: 'Мектептерді салыстыру',
    pageTitle: 'Таңдалған мектептерді салыстырыңыз',
    pageDescription: 'Кесте каталогта салыстыруға қосқан мектептердің негізгі параметрлерін көрсетеді.',
    selectedCount: (count) => `${count}/${maxComparedSchools} таңдалды`,
    emptyTitle: 'Әзірге мектеп таңдалмады',
    emptyDescription: 'Каталогқа оралып, «Салыстыру» түймесімен үш мектепке дейін таңдаңыз.',
    remove: 'Жою',
    fields: {
      schoolName: 'Мектеп атауы',
      district: 'Аудан',
      schoolType: 'Мектеп түрі',
      language: 'Оқыту тілі',
      tuitionFee: 'Оқу ақысы',
      afterSchoolProgram: 'Сабақтан кейінгі бағдарлама',
      schoolBus: 'Мектеп автобусы',
      admissionRequirements: 'Қабылдау талаптары',
      classSize: 'Сынып көлемі',
      dataStatus: 'Дерек мәртебесі',
      rating: 'Рейтинг',
      reviews: 'Пікірлер'
    },
    freePublicSchool: 'Тегін мемлекеттік мектеп',
    priceUnknown: 'Құны нақтыланады',
    perMonth: 'айына',
    notYetRated: 'Әзірге баға жоқ',
    reviewCount: (count) => `${count} пікір`,
    ratingSummary: { excellent: 'Өте жақсы', good: 'Жақсы', average: 'Орташа' }
  },
  en: {
    languageSwitcherLabel: 'Choose interface language',
    backToCatalog: 'Back to catalog',
    pageKicker: 'School comparison',
    pageTitle: 'Compare selected schools',
    pageDescription: 'The table shows key details for the schools you added to comparison from the catalog.',
    selectedCount: (count) => `${count} of ${maxComparedSchools} selected`,
    emptyTitle: 'No schools selected yet',
    emptyDescription: 'Return to the catalog and choose up to three schools with the “Compare” control.',
    remove: 'Remove',
    fields: {
      schoolName: 'School name',
      district: 'District',
      schoolType: 'School type',
      language: 'Instruction language',
      tuitionFee: 'Tuition fee',
      afterSchoolProgram: 'After-school program',
      schoolBus: 'School bus',
      admissionRequirements: 'Admission requirements',
      classSize: 'Class size',
      dataStatus: 'Data status',
      rating: 'Rating',
      reviews: 'Reviews'
    },
    freePublicSchool: 'Free public school',
    priceUnknown: 'Tuition to be confirmed',
    perMonth: 'month',
    notYetRated: 'Not yet rated',
    reviewCount: (count) => `${count} ${count === 1 ? 'review' : 'reviews'}`,
    ratingSummary: { excellent: 'Excellent', good: 'Good', average: 'Average' }
  }
};

const getLanguage = (language) => (language && translations[language] ? language : defaultLanguage);

const getMoneyFormatter = (language) =>
  new Intl.NumberFormat(language === 'en' ? 'en-US' : language === 'kz' ? 'kk-KZ' : 'ru-RU', {
    style: 'currency',
    currency: 'KZT',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0
  });

const formatPrice = (price, formatter, t) => {
  if (price === null || price === undefined) {
    return t.priceUnknown;
  }

  return price === 0 ? t.freePublicSchool : `${formatter.format(price)} / ${t.perMonth}`;
};

const normalizeComparedSchoolIds = (schoolIds) =>
  schoolIds
    .filter((schoolId, index) => schools.some((school) => school.id === schoolId) && schoolIds.indexOf(schoolId) === index)
    .slice(0, maxComparedSchools);

const getStoredComparedSchoolIds = () => {
  try {
    const storedComparison = window.localStorage.getItem(comparisonStorageKey);
    const parsedComparison = storedComparison ? JSON.parse(storedComparison) : [];
    return Array.isArray(parsedComparison) ? normalizeComparedSchoolIds(parsedComparison) : [];
  } catch {
    return [];
  }
};

const saveComparedSchoolIds = (schoolIds) => {
  try {
    window.localStorage.setItem(comparisonStorageKey, JSON.stringify(normalizeComparedSchoolIds(schoolIds)));
  } catch {
    // Comparison still works for the current session if localStorage is unavailable.
  }
};

function LanguageSwitcher({ currentLanguage, onLanguageChange, t }) {
  return (
    <div className="language-switcher" aria-label={t.languageSwitcherLabel}>
      {languageOptions.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          className={currentLanguage === code ? 'language-switcher__button language-switcher__button--active' : 'language-switcher__button'}
          aria-pressed={currentLanguage === code}
          onClick={() => onLanguageChange(code)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function ComparePage() {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [comparedSchoolIds, setComparedSchoolIds] = useState([]);

  useEffect(() => {
    try {
      const urlLanguage = new URLSearchParams(window.location.search).get('lang');
      const storedLanguage = window.localStorage.getItem(languageStorageKey);
      const nextLanguage = getLanguage(urlLanguage || storedLanguage);

      setCurrentLanguage(nextLanguage);
      setComparedSchoolIds(getStoredComparedSchoolIds());
    } catch {
      setCurrentLanguage(defaultLanguage);
      setComparedSchoolIds([]);
    }
  }, []);

  const t = translations[currentLanguage];
  const moneyFormatter = useMemo(() => getMoneyFormatter(currentLanguage), [currentLanguage]);
  const selectedSchools = comparedSchoolIds
    .map((schoolId) => schools.find((school) => school.id === schoolId))
    .filter(Boolean);

  const comparisonRows = [
    [t.fields.schoolName, (school) => getLocalizedSchoolValue(school.name, currentLanguage)],
    [t.fields.district, (school) => getLocalizedEnumLabel('districts', school.district, currentLanguage)],
    [t.fields.schoolType, (school) => getLocalizedSchoolValue(school.school_type, currentLanguage)],
    [t.fields.language, (school) => getLocalizedSchoolValue(school.languages, currentLanguage)],
    [t.fields.tuitionFee, (school) => formatPrice(school.tuition_fee, moneyFormatter, t)],
    [t.fields.rating, (school) => { const stats = getSchoolRatingStats(school); return stats.averageRating === null ? t.notYetRated : `⭐ ${formatAverageRating(stats.averageRating)} / 5 · ${t.ratingSummary[getRatingSummaryKey(stats.averageRating)]}`; }],
    [t.fields.reviews, (school) => `📝 ${t.reviewCount(getSchoolRatingStats(school).reviewCount)}`],
    [t.fields.afterSchoolProgram, (school) => getLocalizedEnumLabel('yesNoUnknown', school.after_school_program, currentLanguage)],
    [t.fields.schoolBus, (school) => getLocalizedEnumLabel('yesNoUnknown', school.school_bus, currentLanguage)],
    [t.fields.admissionRequirements, (school) => getLocalizedSchoolValue(school.admission_requirements, currentLanguage)],
    [t.fields.classSize, (school) => getLocalizedSchoolValue(school.class_size, currentLanguage)],
    [t.fields.dataStatus, (school) => getLocalizedEnumLabel('dataStatuses', school.data_status, currentLanguage)]
  ];

  const updateLanguage = (language) => {
    setCurrentLanguage(language);

    try {
      window.localStorage.setItem(languageStorageKey, language);
      window.history.replaceState(null, '', `/compare?lang=${language}`);
    } catch {
      // Language still changes for the current session if localStorage is unavailable.
    }
  };

  const removeComparedSchool = (schoolId) => {
    setComparedSchoolIds((currentComparedSchoolIds) => {
      const nextComparedSchoolIds = currentComparedSchoolIds.filter((currentSchoolId) => currentSchoolId !== schoolId);
      saveComparedSchoolIds(nextComparedSchoolIds);
      return nextComparedSchoolIds;
    });
  };

  return (
    <main>
      <nav className="school-detail__topbar" aria-label={t.languageSwitcherLabel}>
        <a className="back-link" href={`/?lang=${currentLanguage}`}>
          ← {t.backToCatalog}
        </a>
        <LanguageSwitcher currentLanguage={currentLanguage} onLanguageChange={updateLanguage} t={t} />
      </nav>

      <section className="compare-hero" aria-labelledby="compare-title">
        <p className="hero__kicker">{t.pageKicker}</p>
        <h1 id="compare-title">{t.pageTitle}</h1>
        <p>{t.pageDescription}</p>
        <strong>{t.selectedCount(selectedSchools.length)}</strong>
      </section>

      {selectedSchools.length > 0 ? (
        <section className="compare-table-card" aria-label={t.pageKicker}>
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">{t.pageKicker}</th>
                  {selectedSchools.map((school) => (
                    <th scope="col" key={school.id}>
                      <span>{getLocalizedSchoolValue(school.name, currentLanguage)}</span>
                      <button type="button" className="button-secondary" onClick={() => removeComparedSchool(school.id)}>
                        {t.remove}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([label, getValue]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    {selectedSchools.map((school) => (
                      <td key={school.id}>{getValue(school)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="empty-state" aria-live="polite">
          <h2>{t.emptyTitle}</h2>
          <p>{t.emptyDescription}</p>
          <a className="button-link" href={`/?lang=${currentLanguage}`}>
            {t.backToCatalog}
          </a>
        </section>
      )}
    </main>
  );
}
