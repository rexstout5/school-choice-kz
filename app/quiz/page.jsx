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
import { doesSchoolMatchBudgetFilter, normalizePriceFilterValue } from '../../src/lib/priceFilters.js';

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
  admissionTest: 'not_important',
  knowsLetters: 'partial',
  countsTo10: 'partial',
  followsInstructions: 'partial',
  concentrates15Minutes: 'partial',
  retellsStory: 'partial'
};

const languageOptions = [
  { code: 'ru', label: 'RU' },
  { code: 'kz', label: 'KZ' },
  { code: 'en', label: 'EN' }
];

const childAgeOptions = ['5', '6', '7'];
const schoolTypeOptions = ['public', 'private', 'international', 'any'];
const budgetOptions = ['free', 'paid_only', 'up_to_200000', 'range_200000_400000', 'range_400000_800000', 'range_800000_plus', 'unknown_price', 'any'];
const preferenceOptions = ['yes', 'no', 'not_important'];
const readinessAnswerScores = { yes: 20, partial: 10, no: 0 };
const readinessQuestionKeys = ['knowsLetters', 'countsTo10', 'followsInstructions', 'concentrates15Minutes', 'retellsStory'];

const translations = {
  ru: {
    languageSwitcherLabel: 'Выберите язык интерфейса',
    backToCatalog: 'Назад к каталогу',
    pageKicker: 'Оценка ребенка и подбор школы',
    pageTitle: 'Оценка ребенка и подбор школы',
    pageDescription:
      'Ответьте на вопросы о готовности ребенка и критериях школы, чтобы получить единый результат: оценку готовности и персональные рекомендации.',
    readinessFormTitle: 'Оценка готовности ребенка',
    formTitle: 'Критерии школы',
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
      admissionTest: 'Готовы к вступительному тесту',
      knowsLetters: 'Ребенок знает буквы',
      countsTo10: 'Ребенок считает до 10',
      followsInstructions: 'Ребенок следует инструкциям',
      concentrates15Minutes: 'Концентрируется 15+ минут',
      retellsStory: 'Может пересказать историю'
    },
    any: 'Любой',
    preference: {
      yes: 'Да',
      no: 'Нет',
      not_important: 'Не важно',
      partial: 'Частично'
    },
    budgets: {
      free: 'Только бесплатные',
      paid_only: 'Только платные',
      up_to_200000: 'До 200 000 ₸',
      range_200000_400000: '200 000–400 000 ₸',
      range_400000_800000: '400 000–800 000 ₸',
      range_800000_plus: '800 000+ ₸',
      unknown_price: 'Стоимость неизвестна',
      any: 'Любой'
    },
    resultsTitle: (count) => `${count} рекомендаций по совпадению`,
    noResultsTitle: 'Рекомендации не найдены',
    noResultsDescription: 'Попробуйте выбрать более гибкий бюджет, тип школы или район.',
    match: 'совпадение',
    whyTitle: 'Почему подходит',
    concernsTitle: 'Возможные вопросы',
    details: 'Подробнее',
    compare: 'Сравнить',
    compared: 'В сравнении',
    compareLimit: 'Можно выбрать до 3 школ',
    priceUnknown: 'Стоимость уточняется',
    freePublicSchool: 'Бесплатная государственная школа',
    perMonth: 'в месяц',
    unavailableAge: 'Проверьте у школы прием и наличие мест для возраста',
    readinessScoreTitle: 'Готовность ребенка',
    strengthsTitle: 'Сильные стороны',
    improvementsTitle: 'Зоны роста',
    noStrengths: 'Сильные стороны проявятся по мере подготовки.',
    noImprovements: 'Критичных зон развития не отмечено.',
    readinessReason: (value) => `✓ Готовность ребенка учтена в подборе: ${value}%`,
    reasons: {
      district: (value) => `✓ Район совпадает: ${value}`,
      schoolType: (value) => `✓ Тип школы совпадает: ${value}`,
      budget: (value) => `✓ Стоимость соответствует бюджету: ${value}`,
      language: (value) => `✓ Есть выбранный язык обучения: ${value}`,
      afterSchoolProgram: '✓ Есть подходящая продленка',
      schoolBus: '✓ Школьный автобус соответствует вашему ответу',
      admissionTest: '✓ Условия поступления соответствуют вашему ответу',
      flexibleType: '✓ Тип школы не ограничен',
      flexibleBudget: '✓ Бюджет не ограничен',
      flexibleDistrict: '✓ Район не ограничен',
      flexibleLanguage: '✓ Язык обучения не ограничен',
      partialMatch: 'Школа включена в рейтинг для сравнения компромиссов',
      gentleReadiness: '✓ Мягкая адаптация подходит к текущей готовности',
      advancedReadiness: '✓ Формат подходит для высокой готовности'
    },
    concerns: {
      district: (value) => `⚠ Другой район: ${value}`,
      schoolType: (value) => `⚠ Другой тип школы: ${value}`,
      budget: (value) => `⚠ Стоимость не попадает в выбранный бюджет: ${value}`,
      language: (value) => `⚠ Нет выбранного языка; доступно: ${value}`,
      afterSchoolProgram: (value) => `⚠ Продленка: ${value}`,
      schoolBus: (value) => `⚠ Школьный автобус: ${value}`,
      admissionTest: '⚠ Возможен конкурсный вступительный тест',
      noAdmissionTest: '⚠ В базе не указан вступительный тест',
      classSize: (value) => `⚠ Проверьте наполняемость классов: ${value}`,
      noMajorConcerns: 'Существенных расхождений по выбранным критериям нет'
    }
  },
  kz: {
    languageSwitcherLabel: 'Интерфейс тілін таңдаңыз',
    backToCatalog: 'Каталогқа оралу',
    pageKicker: 'Баланы бағалау және мектеп таңдау',
    pageTitle: 'Баланы бағалау және мектеп таңдау',
    pageDescription:
      'Баланың дайындығы мен мектеп критерийлері туралы сұрақтарға жауап беріп, дайындық бағасын және жеке ұсыныстарды алыңыз.',
    readinessFormTitle: 'Баланың дайындығын бағалау',
    formTitle: 'Мектеп критерийлері',
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
      admissionTest: 'Қабылдау тестіне дайынсыз ба',
      knowsLetters: 'Бала әріптерді біледі',
      countsTo10: 'Бала 10-ға дейін санайды',
      followsInstructions: 'Бала нұсқауларды орындайды',
      concentrates15Minutes: '15+ минут зейін қояды',
      retellsStory: 'Әңгімені мазмұндай алады'
    },
    any: 'Кез келген',
    preference: {
      yes: 'Иә',
      no: 'Жоқ',
      not_important: 'Маңызды емес',
      partial: 'Ішінара'
    },
    budgets: {
      free: 'Тек тегін',
      paid_only: 'Тек ақылы',
      up_to_200000: '200 000 ₸ дейін',
      range_200000_400000: '200 000–400 000 ₸',
      range_400000_800000: '400 000–800 000 ₸',
      range_800000_plus: '800 000+ ₸',
      unknown_price: 'Бағасы белгісіз',
      any: 'Кез келген'
    },
    resultsTitle: (count) => `${count} сәйкестік бойынша ұсыныс`,
    noResultsTitle: 'Ұсыныстар табылмады',
    noResultsDescription: 'Бюджетті, мектеп түрін немесе ауданды икемдірек таңдаңыз.',
    match: 'сәйкестік',
    whyTitle: 'Неге сәйкес келеді',
    concernsTitle: 'Мүмкін сұрақтар',
    details: 'Толығырақ',
    compare: 'Салыстыру',
    compared: 'Салыстыруда',
    compareLimit: '3 мектепке дейін таңдауға болады',
    priceUnknown: 'Құны нақтыланады',
    freePublicSchool: 'Тегін мемлекеттік мектеп',
    perMonth: 'айына',
    unavailableAge: 'Мектептен осы жасқа қабылдау мен бос орындарды нақтылаңыз',
    readinessScoreTitle: 'Баланың дайындығы',
    strengthsTitle: 'Күшті жақтары',
    improvementsTitle: 'Дамытатын тұстар',
    noStrengths: 'Күшті жақтары дайындық барысында айқындалады.',
    noImprovements: 'Маңызды даму аймақтары белгіленбеді.',
    readinessReason: (value) => `✓ Баланың дайындығы таңдауда ескерілді: ${value}%`,
    reasons: {
      district: (value) => `✓ Аудан сәйкес: ${value}`,
      schoolType: (value) => `✓ Мектеп түрі сәйкес: ${value}`,
      budget: (value) => `✓ Құны бюджетке сәйкес: ${value}`,
      language: (value) => `✓ Таңдалған оқыту тілі бар: ${value}`,
      afterSchoolProgram: '✓ Сабақтан кейінгі бағдарлама бар',
      schoolBus: '✓ Мектеп автобусы жауабыңызға сәйкес',
      admissionTest: '✓ Қабылдау шарттары жауабыңызға сәйкес',
      flexibleType: '✓ Мектеп түрі шектелмеген',
      flexibleBudget: '✓ Бюджет шектелмеген',
      flexibleDistrict: '✓ Аудан шектелмеген',
      flexibleLanguage: '✓ Оқыту тілі шектелмеген',
      partialMatch: 'Мектеп ымыралы нұсқаларды салыстыру үшін рейтингке қосылды',
      gentleReadiness: '✓ Жұмсақ бейімделу қазіргі дайындыққа сәйкес',
      advancedReadiness: '✓ Формат жоғары дайындыққа сәйкес'
    },
    concerns: {
      district: (value) => `⚠ Басқа аудан: ${value}`,
      schoolType: (value) => `⚠ Басқа мектеп түрі: ${value}`,
      budget: (value) => `⚠ Құны таңдалған бюджетке кірмейді: ${value}`,
      language: (value) => `⚠ Таңдалған тіл жоқ; бар тілдер: ${value}`,
      afterSchoolProgram: (value) => `⚠ Сабақтан кейінгі бағдарлама: ${value}`,
      schoolBus: (value) => `⚠ Мектеп автобусы: ${value}`,
      admissionTest: '⚠ Конкурстық қабылдау тесті болуы мүмкін',
      noAdmissionTest: '⚠ Базада қабылдау тесті көрсетілмеген',
      classSize: (value) => `⚠ Сынып көлемін нақтылаңыз: ${value}`,
      noMajorConcerns: 'Таңдалған критерийлер бойынша маңызды айырмашылық жоқ'
    }
  },
  en: {
    languageSwitcherLabel: 'Choose interface language',
    backToCatalog: 'Back to catalog',
    pageKicker: 'Child Assessment & School Matching',
    pageTitle: 'Child Assessment & School Matching',
    pageDescription:
      'Answer readiness and school-preference questions to get one result: readiness insights followed by personalized school matches.',
    readinessFormTitle: 'Child readiness assessment',
    formTitle: 'School criteria',
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
      admissionTest: 'Admission test acceptable',
      knowsLetters: 'Child knows letters',
      countsTo10: 'Child can count to 10',
      followsInstructions: 'Child follows instructions',
      concentrates15Minutes: 'Concentrates for 15+ minutes',
      retellsStory: 'Can retell a story'
    },
    any: 'Any',
    preference: {
      yes: 'Yes',
      no: 'No',
      not_important: 'Not important',
      partial: 'Partially'
    },
    budgets: {
      free: 'Free only',
      paid_only: 'Paid only',
      up_to_200000: 'Up to 200,000 ₸',
      range_200000_400000: '200,000–400,000 ₸',
      range_400000_800000: '400,000–800,000 ₸',
      range_800000_plus: '800,000+ ₸',
      unknown_price: 'Unknown price',
      any: 'Any'
    },
    resultsTitle: (count) => `${count} recommendations ranked by match`,
    noResultsTitle: 'No recommendations found',
    noResultsDescription: 'Try a more flexible budget, school type, or district.',
    match: 'match',
    whyTitle: 'Why it matches',
    concernsTitle: 'Possible concerns',
    details: 'Details',
    compare: 'Compare',
    compared: 'In comparison',
    compareLimit: 'Select up to 3 schools',
    priceUnknown: 'Tuition to be confirmed',
    freePublicSchool: 'Free public school',
    perMonth: 'month',
    unavailableAge: 'Confirm admissions and seats for this age with the school',
    readinessScoreTitle: 'Child readiness',
    strengthsTitle: 'Strengths',
    improvementsTitle: 'Areas to improve',
    noStrengths: 'Strengths will become clearer with preparation.',
    noImprovements: 'No critical development areas marked.',
    readinessReason: (value) => `✓ Child readiness included in matching: ${value}%`,
    reasons: {
      district: (value) => `✓ District matches: ${value}`,
      schoolType: (value) => `✓ School type matches: ${value}`,
      budget: (value) => `✓ Tuition matches budget: ${value}`,
      language: (value) => `✓ Offers selected instruction language: ${value}`,
      afterSchoolProgram: '✓ Has after-school program',
      schoolBus: '✓ School bus matches your answer',
      admissionTest: '✓ Admission requirements match your answer',
      flexibleType: '✓ School type is flexible',
      flexibleBudget: '✓ Budget is flexible',
      flexibleDistrict: '✓ District is flexible',
      flexibleLanguage: '✓ Instruction language is flexible',
      partialMatch: 'Included in the ranking so you can compare trade-offs',
      gentleReadiness: '✓ Gentle adaptation fits current readiness',
      advancedReadiness: '✓ Format fits high readiness'
    },
    concerns: {
      district: (value) => `⚠ Different district: ${value}`,
      schoolType: (value) => `⚠ Different school type: ${value}`,
      budget: (value) => `⚠ Tuition does not fit the selected budget: ${value}`,
      language: (value) => `⚠ Selected language is not listed; available: ${value}`,
      afterSchoolProgram: (value) => `⚠ After-school program: ${value}`,
      schoolBus: (value) => `⚠ School bus: ${value}`,
      admissionTest: '⚠ Competitive admission process may be required',
      noAdmissionTest: '⚠ Admission test is not listed in the database',
      classSize: (value) => `⚠ Confirm class size: ${value}`,
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

const getReadinessScore = (answers) =>
  readinessQuestionKeys.reduce((sum, key) => sum + (readinessAnswerScores[answers[key]] ?? 0), 0);

const getReadinessInsights = (answers, t) => {
  const strengths = readinessQuestionKeys.filter((key) => answers[key] === 'yes').map((key) => t.labels[key]);
  const improvements = readinessQuestionKeys.filter((key) => answers[key] === 'partial' || answers[key] === 'no').map((key) => t.labels[key]);
  return {
    score: getReadinessScore(answers),
    strengths: strengths.length > 0 ? strengths : [t.noStrengths],
    improvements: improvements.length > 0 ? improvements : [t.noImprovements]
  };
};

const scoreSchool = ({ school, answers, language, moneyFormatter, t, readinessScore }) => {
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
    maxPrice: normalizePriceFilterValue(answers.budget)
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
  } else if (doesSchoolMatchBudgetFilter(school, answers.budget)) {
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

  if (readinessScore >= 80) {
    score += school.admission_test === 'yes' || school.type === 'specialized' ? 6 : 3;
    why.push(t.reasons.advancedReadiness);
  } else if (readinessScore < 60) {
    const hasGentleStart = school.after_school_program === 'yes' || school.admission_test !== 'yes';
    score += hasGentleStart ? 6 : 2;
    why.push(t.reasons.gentleReadiness);
  } else {
    score += 4;
  }

  why.push(t.readinessReason(readinessScore));

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

  const localizedClassSize = getLocalizedSchoolValue(school.class_size, language);
  if (/25|26|27|28|29|30|large|varies|capacity|мест|орын/i.test(localizedClassSize)) {
    concerns.push(t.concerns.classSize(localizedClassSize));
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
  const readiness = useMemo(() => getReadinessInsights(answers, t), [answers, t]);
  const recommendations = useMemo(
    () =>
      schools
        .filter((school) => doesSchoolMatchBudgetFilter(school, answers.budget))
        .map((school) => scoreSchool({ school, answers, language: currentLanguage, moneyFormatter, t, readinessScore: readiness.score }))
        .sort((first, second) => second.score - first.score || getLocalizedSchoolValue(first.school.name, currentLanguage).localeCompare(getLocalizedSchoolValue(second.school.name, currentLanguage)))
        .slice(0, 12),
    [answers, currentLanguage, moneyFormatter, t, readiness.score]
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
          <h2>{t.readinessFormTitle}</h2>
          <p>{t.pageDescription}</p>
        </div>

        <div className="readiness-options readiness-options--quiz">
          {readinessQuestionKeys.map((key) => (
            <fieldset className="readiness-question readiness-question--compact" key={key}>
              <legend>{t.labels[key]}</legend>
              <div className="readiness-options">
                {['yes', 'partial', 'no'].map((option) => (
                  <label key={option} className={answers[key] === option ? 'readiness-option readiness-option--selected' : 'readiness-option'}>
                    <input type="radio" name={key} value={option} checked={answers[key] === option} onChange={() => updateAnswer(key, option)} />
                    {t.preference[option]}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

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
          <div className="readiness-results readiness-results--quiz">
            <div className="readiness-score">
              <span>{t.readinessScoreTitle}</span>
              <strong>{readiness.score}%</strong>
            </div>
            <div className="readiness-insights">
              <section>
                <h3>{t.strengthsTitle}</h3>
                <ul>{readiness.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>
              <section>
                <h3>{t.improvementsTitle}</h3>
                <ul>{readiness.improvements.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>
            </div>
          </div>
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
