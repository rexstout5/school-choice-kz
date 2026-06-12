'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getLocalizedEnumLabel,
  getLocalizedSchoolValue,
  schoolDistricts,
  schoolLanguages,
  schools
} from '../../src/data/schools.js';
import { doesSchoolMatchCatalogFilters } from '../../src/lib/schoolFilters.js';
import { doesSchoolMatchPriceFilter } from '../../src/lib/priceFilters.js';

const defaultLanguage = 'ru';
const languageStorageKey = 'school-choice-kz-language';
const quizStorageKey = 'school-choice-kz-quiz-answers';
const comparisonStorageKey = 'school-choice-kz-comparison';
const maxComparedSchools = 3;

const initialAnswers = {
  childAge: '6',
  district: 'any',
  schoolType: 'any',
  budget: 'any',
  instructionLanguage: 'any',
  afterSchoolProgram: 'not_important',
  schoolBus: 'not_important',
  admissionTest: 'not_important'
};

const languageOptions = [
  { code: 'ru', label: 'RU' },
  { code: 'kz', label: 'KZ' },
  { code: 'en', label: 'EN' }
];

const childAgeOptions = ['5', '6', '7'];
const schoolTypeOptions = ['public', 'private', 'international', 'any'];
const budgetOptions = ['free', 'up_to_200000', 'range_200000_400000', 'range_400000_800000', 'range_800000_plus', 'any'];
const preferenceOptions = ['yes', 'no', 'not_important'];

const translations = {
  ru: {
    languageSwitcherLabel: 'Выберите язык интерфейса',
    backToCatalog: 'Назад к каталогу',
    pageKicker: 'Подбор школы',
    pageTitle: 'Ответьте на 8 вопросов и получите рейтинг школ',
    pageDescription:
      'Квиз использует текущую базу школ и ту же логику фильтрации стоимости, что и каталог. Ответы сохраняются только в вашем браузере.',
    formTitle: 'Ваши критерии',
    submit: 'Показать рекомендации',
    update: 'Обновить рекомендации',
    saved: 'Ответы сохранены локально.',
    ageNote: 'Возраст сохраняется для консультации, но в базе школ нет отдельного поля приема по возрасту.',
    labels: {
      childAge: 'Возраст ребенка',
      district: 'Предпочтительный район',
      schoolType: 'Тип школы',
      budget: 'Бюджет',
      instructionLanguage: 'Язык обучения',
      afterSchoolProgram: 'Нужна продленка',
      schoolBus: 'Нужен школьный автобус',
      admissionTest: 'Готовы к вступительному тесту'
    },
    any: 'Любой',
    preference: {
      yes: 'Да',
      no: 'Нет',
      not_important: 'Не важно'
    },
    budgets: {
      free: 'Только бесплатные',
      up_to_200000: 'До 200 000 ₸',
      range_200000_400000: '200 000–400 000 ₸',
      range_400000_800000: '400 000–800 000 ₸',
      range_800000_plus: '800 000+ ₸',
      any: 'Любой'
    },
    resultsTitle: (count) => `${count} рекомендаций по совпадению`,
    noResultsTitle: 'Рекомендации не найдены',
    noResultsDescription: 'Попробуйте выбрать более гибкий бюджет, тип школы или район.',
    match: 'совпадение',
    whyTitle: 'Почему подходит',
    concernsTitle: 'Возможные вопросы',
    details: 'Открыть школу',
    compare: 'Сравнить',
    compared: 'В сравнении',
    compareLimit: 'Можно выбрать до 3 школ',
    priceUnknown: 'Стоимость уточняется',
    freePublicSchool: 'Бесплатная государственная школа',
    perMonth: 'в месяц',
    unavailableAge: 'Проверьте у школы прием и наличие мест для возраста',
    reasons: {
      district: (value) => `Район совпадает: ${value}`,
      schoolType: (value) => `Тип школы совпадает: ${value}`,
      budget: (value) => `Стоимость соответствует бюджету: ${value}`,
      language: (value) => `Есть выбранный язык обучения: ${value}`,
      afterSchoolProgram: 'Продленка соответствует вашему ответу',
      schoolBus: 'Школьный автобус соответствует вашему ответу',
      admissionTest: 'Условия вступительного теста соответствуют вашему ответу',
      flexibleType: 'Тип школы не ограничен',
      flexibleBudget: 'Бюджет не ограничен',
      flexibleDistrict: 'Район не ограничен',
      flexibleLanguage: 'Язык обучения не ограничен',
      partialMatch: 'Школа включена в рейтинг для сравнения компромиссов'
    },
    concerns: {
      district: (value) => `Другой район: ${value}`,
      schoolType: (value) => `Другой тип школы: ${value}`,
      budget: (value) => `Стоимость не попадает в выбранный бюджет: ${value}`,
      language: (value) => `Нет выбранного языка; доступно: ${value}`,
      afterSchoolProgram: (value) => `Продленка: ${value}`,
      schoolBus: (value) => `Школьный автобус: ${value}`,
      admissionTest: 'Возможен вступительный тест',
      noAdmissionTest: 'В базе не указан вступительный тест',
      noMajorConcerns: 'Существенных расхождений по выбранным критериям нет'
    }
  },
  kz: {
    languageSwitcherLabel: 'Интерфейс тілін таңдаңыз',
    backToCatalog: 'Каталогқа оралу',
    pageKicker: 'Мектеп таңдау',
    pageTitle: '8 сұраққа жауап беріп, мектеп рейтингін алыңыз',
    pageDescription:
      'Квиз ағымдағы мектеп базасын және каталогтағы баға сүзгілеу логикасын пайдаланады. Жауаптар тек браузеріңізде сақталады.',
    formTitle: 'Критерийлеріңіз',
    submit: 'Ұсыныстарды көрсету',
    update: 'Ұсыныстарды жаңарту',
    saved: 'Жауаптар жергілікті сақталды.',
    ageNote: 'Жас консультация үшін сақталады, бірақ мектеп базасында жас бойынша қабылдау өрісі жоқ.',
    labels: {
      childAge: 'Баланың жасы',
      district: 'Қалаған аудан',
      schoolType: 'Мектеп түрі',
      budget: 'Бюджет',
      instructionLanguage: 'Оқыту тілі',
      afterSchoolProgram: 'Сабақтан кейінгі бағдарлама керек пе',
      schoolBus: 'Мектеп автобусы керек пе',
      admissionTest: 'Қабылдау тестіне дайынсыз ба'
    },
    any: 'Кез келген',
    preference: {
      yes: 'Иә',
      no: 'Жоқ',
      not_important: 'Маңызды емес'
    },
    budgets: {
      free: 'Тек тегін',
      up_to_200000: '200 000 ₸ дейін',
      range_200000_400000: '200 000–400 000 ₸',
      range_400000_800000: '400 000–800 000 ₸',
      range_800000_plus: '800 000+ ₸',
      any: 'Кез келген'
    },
    resultsTitle: (count) => `${count} сәйкестік бойынша ұсыныс`,
    noResultsTitle: 'Ұсыныстар табылмады',
    noResultsDescription: 'Бюджетті, мектеп түрін немесе ауданды икемдірек таңдаңыз.',
    match: 'сәйкестік',
    whyTitle: 'Неге сәйкес келеді',
    concernsTitle: 'Мүмкін сұрақтар',
    details: 'Мектепті ашу',
    compare: 'Салыстыру',
    compared: 'Салыстыруда',
    compareLimit: '3 мектепке дейін таңдауға болады',
    priceUnknown: 'Құны нақтыланады',
    freePublicSchool: 'Тегін мемлекеттік мектеп',
    perMonth: 'айына',
    unavailableAge: 'Мектептен осы жасқа қабылдау мен бос орындарды нақтылаңыз',
    reasons: {
      district: (value) => `Аудан сәйкес: ${value}`,
      schoolType: (value) => `Мектеп түрі сәйкес: ${value}`,
      budget: (value) => `Құны бюджетке сәйкес: ${value}`,
      language: (value) => `Таңдалған оқыту тілі бар: ${value}`,
      afterSchoolProgram: 'Сабақтан кейінгі бағдарлама жауабыңызға сәйкес',
      schoolBus: 'Мектеп автобусы жауабыңызға сәйкес',
      admissionTest: 'Қабылдау тесті шарты жауабыңызға сәйкес',
      flexibleType: 'Мектеп түрі шектелмеген',
      flexibleBudget: 'Бюджет шектелмеген',
      flexibleDistrict: 'Аудан шектелмеген',
      flexibleLanguage: 'Оқыту тілі шектелмеген',
      partialMatch: 'Мектеп ымыралы нұсқаларды салыстыру үшін рейтингке қосылды'
    },
    concerns: {
      district: (value) => `Басқа аудан: ${value}`,
      schoolType: (value) => `Басқа мектеп түрі: ${value}`,
      budget: (value) => `Құны таңдалған бюджетке кірмейді: ${value}`,
      language: (value) => `Таңдалған тіл жоқ; бар тілдер: ${value}`,
      afterSchoolProgram: (value) => `Сабақтан кейінгі бағдарлама: ${value}`,
      schoolBus: (value) => `Мектеп автобусы: ${value}`,
      admissionTest: 'Қабылдау тесті болуы мүмкін',
      noAdmissionTest: 'Базада қабылдау тесті көрсетілмеген',
      noMajorConcerns: 'Таңдалған критерийлер бойынша маңызды айырмашылық жоқ'
    }
  },
  en: {
    languageSwitcherLabel: 'Choose interface language',
    backToCatalog: 'Back to catalog',
    pageKicker: 'School recommendation',
    pageTitle: 'Answer 8 questions and get ranked school matches',
    pageDescription:
      'The quiz uses the current school database and the same tuition filter logic as the catalog. Answers are stored only in your browser.',
    formTitle: 'Your criteria',
    submit: 'Show recommendations',
    update: 'Update recommendations',
    saved: 'Answers saved locally.',
    ageNote: 'Age is saved for consultation, but the school database has no separate admissions-by-age field.',
    labels: {
      childAge: 'Child age',
      district: 'Preferred district',
      schoolType: 'School type',
      budget: 'Budget',
      instructionLanguage: 'Language of instruction',
      afterSchoolProgram: 'Need after-school program',
      schoolBus: 'Need school bus',
      admissionTest: 'Admission test acceptable'
    },
    any: 'Any',
    preference: {
      yes: 'Yes',
      no: 'No',
      not_important: 'Not important'
    },
    budgets: {
      free: 'Free only',
      up_to_200000: 'Up to 200,000 ₸',
      range_200000_400000: '200,000–400,000 ₸',
      range_400000_800000: '400,000–800,000 ₸',
      range_800000_plus: '800,000+ ₸',
      any: 'Any'
    },
    resultsTitle: (count) => `${count} recommendations ranked by match`,
    noResultsTitle: 'No recommendations found',
    noResultsDescription: 'Try a more flexible budget, school type, or district.',
    match: 'match',
    whyTitle: 'Why it matches',
    concernsTitle: 'Possible concerns',
    details: 'Open school',
    compare: 'Compare',
    compared: 'In comparison',
    compareLimit: 'Select up to 3 schools',
    priceUnknown: 'Tuition to be confirmed',
    freePublicSchool: 'Free public school',
    perMonth: 'month',
    unavailableAge: 'Confirm admissions and seats for this age with the school',
    reasons: {
      district: (value) => `District matches: ${value}`,
      schoolType: (value) => `School type matches: ${value}`,
      budget: (value) => `Tuition matches budget: ${value}`,
      language: (value) => `Selected instruction language is available: ${value}`,
      afterSchoolProgram: 'After-school program matches your answer',
      schoolBus: 'School bus matches your answer',
      admissionTest: 'Admission test conditions match your answer',
      flexibleType: 'School type is flexible',
      flexibleBudget: 'Budget is flexible',
      flexibleDistrict: 'District is flexible',
      flexibleLanguage: 'Instruction language is flexible',
      partialMatch: 'Included in the ranking so you can compare trade-offs'
    },
    concerns: {
      district: (value) => `Different district: ${value}`,
      schoolType: (value) => `Different school type: ${value}`,
      budget: (value) => `Tuition does not fit the selected budget: ${value}`,
      language: (value) => `Selected language is not listed; available: ${value}`,
      afterSchoolProgram: (value) => `After-school program: ${value}`,
      schoolBus: (value) => `School bus: ${value}`,
      admissionTest: 'Admission test may be required',
      noAdmissionTest: 'Admission test is not listed in the database',
      noMajorConcerns: 'No major differences for your selected criteria'
    }
  }
};

const getLanguage = (lang) => (lang && translations[lang] ? lang : defaultLanguage);
const getSchoolSlug = (school) => school.slug ?? school.id;

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

const getStoredQuizAnswers = () => {
  try {
    const storedAnswers = window.localStorage.getItem(quizStorageKey);
    const parsedAnswers = storedAnswers ? JSON.parse(storedAnswers) : null;
    return parsedAnswers && typeof parsedAnswers === 'object' ? { ...initialAnswers, ...parsedAnswers } : initialAnswers;
  } catch {
    return initialAnswers;
  }
};

const getMoneyFormatter = (language) =>
  new Intl.NumberFormat(language === 'en' ? 'en-US' : language === 'kz' ? 'kk-KZ' : 'ru-RU', {
    style: 'currency',
    currency: 'KZT',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0
  });

const formatPrice = (school, formatter, t) => {
  if (school.tuition_fee === null || school.tuition_fee === undefined) {
    return t.priceUnknown;
  }

  return school.tuition_fee === 0 ? t.freePublicSchool : `${formatter.format(school.tuition_fee)} / ${t.perMonth}`;
};

const getLocalizedYesNo = (value, language) => getLocalizedEnumLabel('yesNoUnknown', value, language);

const scoreSchool = ({ school, answers, language, moneyFormatter, t }) => {
  let score = 0;
  const maxScore = 100;
  const why = [];
  const concerns = [];
  const localizedDistrict = getLocalizedEnumLabel('districts', school.district, language);
  const localizedType = getLocalizedEnumLabel('schoolTypes', school.type, language);
  const localizedLanguages = getLocalizedSchoolValue(school.languages, language);
  const localizedPrice = formatPrice(school, moneyFormatter, t);
  const matchesCoreCatalogFilters = doesSchoolMatchCatalogFilters(school, {
    type: answers.schoolType === 'any' ? 'all' : answers.schoolType,
    language: answers.instructionLanguage === 'any' ? 'all' : answers.instructionLanguage,
    district: answers.district === 'any' ? 'all' : answers.district,
    maxPrice: answers.budget === 'any' ? 'all' : answers.budget
  });

  if (answers.district === 'any') {
    score += 12;
    why.push(t.reasons.flexibleDistrict);
  } else if (school.district === answers.district) {
    score += 18;
    why.push(t.reasons.district(localizedDistrict));
  } else {
    concerns.push(t.concerns.district(localizedDistrict));
  }

  if (answers.schoolType === 'any') {
    score += 14;
    why.push(t.reasons.flexibleType);
  } else if (school.type === answers.schoolType) {
    score += 18;
    why.push(t.reasons.schoolType(localizedType));
  } else {
    concerns.push(t.concerns.schoolType(localizedType));
  }

  if (answers.budget === 'any') {
    score += 14;
    why.push(t.reasons.flexibleBudget);
  } else if (doesSchoolMatchPriceFilter(school, answers.budget)) {
    score += 20;
    why.push(t.reasons.budget(localizedPrice));
  } else {
    concerns.push(t.concerns.budget(localizedPrice));
  }

  if (answers.instructionLanguage === 'any') {
    score += 12;
    why.push(t.reasons.flexibleLanguage);
  } else if (school.instruction_languages.includes(answers.instructionLanguage)) {
    score += 16;
    why.push(t.reasons.language(getLocalizedEnumLabel('instructionLanguages', answers.instructionLanguage, language)));
  } else {
    concerns.push(t.concerns.language(localizedLanguages));
  }

  if (answers.afterSchoolProgram === 'not_important') {
    score += 8;
  } else if (school.after_school_program === answers.afterSchoolProgram) {
    score += 10;
    why.push(t.reasons.afterSchoolProgram);
  } else {
    concerns.push(t.concerns.afterSchoolProgram(getLocalizedYesNo(school.after_school_program, language)));
  }

  if (answers.schoolBus === 'not_important') {
    score += 7;
  } else if (school.school_bus === answers.schoolBus) {
    score += 9;
    why.push(t.reasons.schoolBus);
  } else {
    concerns.push(t.concerns.schoolBus(getLocalizedYesNo(school.school_bus, language)));
  }

  if (answers.admissionTest === 'not_important') {
    score += 7;
  } else if (answers.admissionTest === 'yes' || school.admission_test === 'no') {
    score += 9;
    why.push(t.reasons.admissionTest);
  } else if (school.admission_test === 'yes') {
    concerns.push(t.concerns.admissionTest);
  } else {
    concerns.push(t.concerns.noAdmissionTest);
  }

  concerns.push(`${t.unavailableAge}: ${answers.childAge}`);

  return {
    school,
    score: Math.min(maxScore, Math.round(matchesCoreCatalogFilters ? score : score * 0.82)),
    why: (why.length > 0 ? why : [t.reasons.partialMatch]).slice(0, 5),
    concerns: concerns.length > 1 ? concerns.slice(0, 5) : [t.concerns.noMajorConcerns, ...concerns]
  };
};

function LanguageSwitcher({ currentLanguage }) {
  return (
    <div className="language-switcher" aria-label={translations[currentLanguage].languageSwitcherLabel}>
      {languageOptions.map(({ code, label }) => (
        <a
          key={code}
          className={currentLanguage === code ? 'language-switcher__button language-switcher__button--active' : 'language-switcher__button'}
          aria-current={currentLanguage === code ? 'page' : undefined}
          href={`/quiz?lang=${code}`}
        >
          {label}
        </a>
      ))}
    </div>
  );
}

function SelectField({ id, label, value, onChange, children }) {
  return (
    <label className="quiz-field" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  );
}

function RecommendationCard({ recommendation, language, moneyFormatter, t, isCompared, isCompareDisabled, onCompare }) {
  const { school, score, why, concerns } = recommendation;
  const localizedName = getLocalizedSchoolValue(school.name, language);
  const localizedDistrict = getLocalizedEnumLabel('districts', school.district, language);

  return (
    <article className="recommendation-card">
      <div className="recommendation-card__top">
        <div>
          <p className="school-card__eyebrow">{localizedDistrict}</p>
          <h2>{localizedName}</h2>
          <p>{formatPrice(school, moneyFormatter, t)}</p>
        </div>
        <div className="match-meter" aria-label={`${score}% ${t.match}`}>
          <strong>{score}%</strong>
          <span>{t.match}</span>
        </div>
      </div>

      <div className="recommendation-card__lists">
        <section>
          <h3>{t.whyTitle}</h3>
          <ul>
            {why.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3>{t.concernsTitle}</h3>
          <ul>
            {concerns.map((concern) => (
              <li key={concern}>{concern}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="recommendation-card__actions">
        <a className="button-link" href={`/schools/${getSchoolSlug(school)}?lang=${language}`}>{t.details}</a>
        <button type="button" className="button-secondary" disabled={isCompareDisabled} onClick={() => onCompare(school.id)}>
          {isCompared ? t.compared : t.compare}
        </button>
        {isCompareDisabled ? <small>{t.compareLimit}</small> : null}
      </div>
    </article>
  );
}

export default function QuizPage() {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [answers, setAnswers] = useState(initialAnswers);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [comparedSchoolIds, setComparedSchoolIds] = useState([]);

  useEffect(() => {
    try {
      const urlLanguage = new URLSearchParams(window.location.search).get('lang');
      const storedLanguage = window.localStorage.getItem(languageStorageKey);
      const nextLanguage = translations[urlLanguage] ? urlLanguage : storedLanguage;

      setCurrentLanguage(getLanguage(nextLanguage));
      setAnswers(getStoredQuizAnswers());
      setComparedSchoolIds(getStoredComparedSchoolIds());
    } catch {
      setCurrentLanguage(defaultLanguage);
      setAnswers(initialAnswers);
    }
  }, []);

  const t = translations[currentLanguage];
  const moneyFormatter = useMemo(() => getMoneyFormatter(currentLanguage), [currentLanguage]);
  const recommendations = useMemo(
    () =>
      schools
        .map((school) => scoreSchool({ school, answers, language: currentLanguage, moneyFormatter, t }))
        .sort((first, second) => second.score - first.score || getLocalizedSchoolValue(first.school.name, currentLanguage).localeCompare(getLocalizedSchoolValue(second.school.name, currentLanguage)))
        .slice(0, 12),
    [answers, currentLanguage, moneyFormatter, t]
  );

  const updateAnswer = (name, value) => {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      window.localStorage.setItem(quizStorageKey, JSON.stringify(answers));
      setStatusMessage(t.saved);
    } catch {
      setStatusMessage('');
    }

    setHasSubmitted(true);
  };

  const toggleComparedSchool = (schoolId) => {
    setComparedSchoolIds((currentComparedSchoolIds) => {
      const nextComparedSchoolIds = currentComparedSchoolIds.includes(schoolId)
        ? currentComparedSchoolIds.filter((currentSchoolId) => currentSchoolId !== schoolId)
        : currentComparedSchoolIds.length >= maxComparedSchools
          ? currentComparedSchoolIds
          : [...currentComparedSchoolIds, schoolId];
      saveComparedSchoolIds(nextComparedSchoolIds);
      return normalizeComparedSchoolIds(nextComparedSchoolIds);
    });
  };

  return (
    <main>
      <nav className="school-detail__topbar" aria-label={t.languageSwitcherLabel}>
        <a className="back-link" href={`/?lang=${currentLanguage}`}>
          ← {t.backToCatalog}
        </a>
        <LanguageSwitcher currentLanguage={currentLanguage} />
      </nav>

      <section className="quiz-hero">
        <p className="hero__kicker">{t.pageKicker}</p>
        <h1>{t.pageTitle}</h1>
        <p>{t.pageDescription}</p>
      </section>

      <form className="quiz-form" onSubmit={handleSubmit}>
        <div className="quiz-form__header">
          <h2>{t.formTitle}</h2>
          <p>{t.ageNote}</p>
        </div>

        <div className="quiz-form__grid">
          <SelectField id="child-age" label={t.labels.childAge} value={answers.childAge} onChange={(value) => updateAnswer('childAge', value)}>
            {childAgeOptions.map((age) => <option key={age} value={age}>{age}</option>)}
          </SelectField>

          <SelectField id="district" label={t.labels.district} value={answers.district} onChange={(value) => updateAnswer('district', value)}>
            <option value="any">{t.any}</option>
            {schoolDistricts.map((district) => (
              <option key={district} value={district}>{getLocalizedEnumLabel('districts', district, currentLanguage)}</option>
            ))}
          </SelectField>

          <SelectField id="school-type" label={t.labels.schoolType} value={answers.schoolType} onChange={(value) => updateAnswer('schoolType', value)}>
            {schoolTypeOptions.map((schoolType) => (
              <option key={schoolType} value={schoolType}>{schoolType === 'any' ? t.any : getLocalizedEnumLabel('schoolTypes', schoolType, currentLanguage)}</option>
            ))}
          </SelectField>

          <SelectField id="budget" label={t.labels.budget} value={answers.budget} onChange={(value) => updateAnswer('budget', value)}>
            {budgetOptions.map((budget) => <option key={budget} value={budget}>{t.budgets[budget]}</option>)}
          </SelectField>

          <SelectField id="instruction-language" label={t.labels.instructionLanguage} value={answers.instructionLanguage} onChange={(value) => updateAnswer('instructionLanguage', value)}>
            <option value="any">{t.any}</option>
            {schoolLanguages.map((language) => (
              <option key={language} value={language}>{getLocalizedEnumLabel('instructionLanguages', language, currentLanguage)}</option>
            ))}
          </SelectField>

          <SelectField id="after-school" label={t.labels.afterSchoolProgram} value={answers.afterSchoolProgram} onChange={(value) => updateAnswer('afterSchoolProgram', value)}>
            {preferenceOptions.map((option) => <option key={option} value={option}>{t.preference[option]}</option>)}
          </SelectField>

          <SelectField id="school-bus" label={t.labels.schoolBus} value={answers.schoolBus} onChange={(value) => updateAnswer('schoolBus', value)}>
            {preferenceOptions.map((option) => <option key={option} value={option}>{t.preference[option]}</option>)}
          </SelectField>

          <SelectField id="admission-test" label={t.labels.admissionTest} value={answers.admissionTest} onChange={(value) => updateAnswer('admissionTest', value)}>
            {preferenceOptions.map((option) => <option key={option} value={option}>{t.preference[option]}</option>)}
          </SelectField>
        </div>

        <div className="quiz-form__footer">
          <button type="submit">{hasSubmitted ? t.update : t.submit}</button>
          <p role="status" aria-live="polite">{statusMessage}</p>
        </div>
      </form>

      {hasSubmitted ? (
        <section className="quiz-results" aria-live="polite">
          {recommendations.length > 0 ? (
            <>
              <h2>{t.resultsTitle(recommendations.length)}</h2>
              <div className="recommendation-grid">
                {recommendations.map((recommendation) => {
                  const isCompared = comparedSchoolIds.includes(recommendation.school.id);
                  const isCompareDisabled = comparedSchoolIds.length >= maxComparedSchools && !isCompared;

                  return (
                    <RecommendationCard
                      key={recommendation.school.id}
                      recommendation={recommendation}
                      language={currentLanguage}
                      moneyFormatter={moneyFormatter}
                      t={t}
                      isCompared={isCompared}
                      isCompareDisabled={isCompareDisabled}
                      onCompare={toggleComparedSchool}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h2>{t.noResultsTitle}</h2>
              <p>{t.noResultsDescription}</p>
            </div>
          )}
        </section>
      ) : null}
    </main>
  );
}
