'use client';

import { useEffect, useMemo, useState } from 'react';
import { getLocalizedEnumLabel, getLocalizedSchoolValue, schools } from '../../src/data/schools.js';

const defaultLanguage = 'ru';
const languageStorageKey = 'school-choice-kz-language';
const answerScores = { yes: 10, partial: 5, no: 0 };
const languageOptions = [
  { code: 'ru', label: 'RU' },
  { code: 'kz', label: 'KZ' },
  { code: 'en', label: 'EN' }
];

const translations = {
  ru: {
    languageSwitcherLabel: 'Выберите язык интерфейса',
    backToHome: 'На главную',
    kicker: 'School readiness MVP',
    title: 'Оценка готовности ребенка к школе',
    subtitle: 'Ответьте на несколько вопросов и получите предварительную оценку готовности ребенка к обучению.',
    progress: (answered, total) => `${answered} из ${total} вопросов`,
    score: 'Итоговая оценка готовности',
    points: 'баллов из 100',
    answers: { yes: 'Да', partial: 'Частично', no: 'Нет' },
    strengthsTitle: 'Сильные стороны:',
    improvementsTitle: 'Что стоит развивать:',
    noStrengths: 'Пока нет выраженных сильных сторон — начните с коротких регулярных занятий.',
    noImprovements: 'Критичных зон развития не отмечено. Поддерживайте текущий темп подготовки.',
    recommendationsTitle: 'Рекомендуемые школы',
    recommendationIntro: {
      high: 'Можно рассмотреть гимназии, лицеи и школы с углубленным обучением.',
      medium: 'Подойдут обычные государственные школы и школы с адаптационными программами.',
      low: 'Лучше начать с подготовительных программ и школ с мягкой адаптацией.'
    },
    details: 'Подробнее',
    chooseSchool: 'Подобрать школу',
    categories: {
      high: ['Гимназии', 'Лицеи', 'Школы с углубленным обучением'],
      medium: ['Обычные государственные школы', 'Школы с адаптационными программами'],
      low: ['Подготовительные программы', 'Школы с мягкой адаптацией']
    },
    levels: {
      high: 'Высокая готовность к школе',
      good: 'Хорошая готовность к школе',
      medium: 'Есть области для развития',
      low: 'Рекомендуется дополнительная подготовка'
    },
    questions: [
      'Ребенок знает большинство букв алфавита?',
      'Может назвать свое имя и фамилию?',
      'Может считать до 10?',
      'Может сравнить больше/меньше?',
      'Может пересказать короткую историю?',
      'Может концентрироваться на задаче 15–20 минут?',
      'Самостоятельно одевается?',
      'Может следовать инструкциям взрослого?',
      'Общается со сверстниками без серьезных трудностей?',
      'Проявляет интерес к обучению?'
    ],
    skillLabels: ['Буквы и предчтение', 'Имя и фамилия', 'Счет до 10', 'Сравнение величин', 'Связная речь', 'Концентрация', 'Самостоятельность', 'Инструкции взрослого', 'Общение со сверстниками', 'Интерес к обучению']
  },
  kz: {
    languageSwitcherLabel: 'Интерфейс тілін таңдаңыз',
    backToHome: 'Басты бетке',
    kicker: 'Мектепке дайындық MVP',
    title: 'Баланың мектепке дайындығын бағалау',
    subtitle: 'Бірнеше сұраққа жауап беріп, баланың оқуға дайындығы туралы алдын ала баға алыңыз.',
    progress: (answered, total) => `${answered}/${total} сұрақ`,
    score: 'Дайындықтың қорытынды бағасы',
    points: '100 баллдан',
    answers: { yes: 'Иә', partial: 'Ішінара', no: 'Жоқ' },
    strengthsTitle: 'Күшті жақтары:',
    improvementsTitle: 'Дамытатын тұстар:',
    noStrengths: 'Әзірге айқын күшті жақтар белгіленбеді — қысқа тұрақты жаттығулардан бастаңыз.',
    noImprovements: 'Маңызды даму аймақтары белгіленбеді. Қазіргі дайындық қарқынын сақтаңыз.',
    recommendationsTitle: 'Ұсынылатын мектептер',
    recommendationIntro: {
      high: 'Гимназиялар, лицейлер және тереңдетіп оқытатын мектептерді қарастыруға болады.',
      medium: 'Қарапайым мемлекеттік мектептер және бейімдеу бағдарламалары бар мектептер сәйкес келеді.',
      low: 'Дайындық бағдарламалары мен жұмсақ бейімделуі бар мектептерден бастаған дұрыс.'
    },
    details: 'Толығырақ',
    chooseSchool: 'Мектеп таңдау',
    categories: {
      high: ['Гимназиялар', 'Лицейлер', 'Тереңдетіп оқытатын мектептер'],
      medium: ['Қарапайым мемлекеттік мектептер', 'Бейімдеу бағдарламалары бар мектептер'],
      low: ['Дайындық бағдарламалары', 'Жұмсақ бейімделуі бар мектептер']
    },
    levels: { high: 'Мектепке дайындығы жоғары', good: 'Мектепке дайындығы жақсы', medium: 'Дамытатын салалар бар', low: 'Қосымша дайындық ұсынылады' },
    questions: ['Бала әліпбидің көп әрпін біле ме?', 'Өз аты-жөнін айта ала ма?', '10-ға дейін санай ала ма?', 'Көп/азды салыстыра ала ма?', 'Қысқа әңгімені мазмұндай ала ма?', 'Тапсырмаға 15–20 минут зейін қоя ала ма?', 'Өзі киіне ала ма?', 'Ересек адамның нұсқауын орындай ала ма?', 'Құрдастарымен елеулі қиындықсыз араласа ма?', 'Оқуға қызығушылық таныта ма?'],
    skillLabels: ['Әріптер және оқуға дайындық', 'Аты-жөні', '10-ға дейін санау', 'Шамаларды салыстыру', 'Байланыстырып сөйлеу', 'Зейін', 'Дербестік', 'Ересек нұсқауы', 'Құрдастармен қарым-қатынас', 'Оқуға қызығушылық']
  },
  en: {
    languageSwitcherLabel: 'Choose interface language',
    backToHome: 'Back home',
    kicker: 'School readiness MVP',
    title: 'School Readiness Assessment',
    subtitle: 'Answer a few questions and get a preliminary view of your child’s readiness for learning.',
    progress: (answered, total) => `${answered} of ${total} questions`,
    score: 'Readiness score',
    points: 'points out of 100',
    answers: { yes: 'Yes', partial: 'Partially', no: 'No' },
    strengthsTitle: 'Strengths:',
    improvementsTitle: 'What to develop:',
    noStrengths: 'No clear strengths yet — start with short regular practice.',
    noImprovements: 'No critical development areas marked. Keep the current preparation pace.',
    recommendationsTitle: 'Recommended schools',
    recommendationIntro: { high: 'Consider gymnasiums, lyceums, and schools with advanced learning.', medium: 'Regular public schools and schools with adaptation programs may fit well.', low: 'Start with preparatory programs and schools with gentle adaptation.' },
    details: 'Details',
    chooseSchool: 'Find a school',
    categories: { high: ['Gymnasiums', 'Lyceums', 'Advanced-learning schools'], medium: ['Regular public schools', 'Schools with adaptation programs'], low: ['Preparatory programs', 'Schools with gentle adaptation'] },
    levels: { high: 'High readiness for school', good: 'Good readiness for school', medium: 'There are areas to develop', low: 'Additional preparation is recommended' },
    questions: ['Does the child know most alphabet letters?', 'Can they say their first and last name?', 'Can they count to 10?', 'Can they compare more/less?', 'Can they retell a short story?', 'Can they focus on a task for 15–20 minutes?', 'Can they dress independently?', 'Can they follow adult instructions?', 'Do they communicate with peers without major difficulty?', 'Do they show interest in learning?'],
    skillLabels: ['Letters and pre-reading', 'First and last name', 'Counting to 10', 'Comparing quantities', 'Connected speech', 'Focus', 'Independence', 'Adult instructions', 'Peer communication', 'Interest in learning']
  }
};

function getLanguage(value) {
  return translations[value] ? value : defaultLanguage;
}

function getLevel(score, t) {
  if (score >= 90) return { key: 'high', label: t.levels.high, recommendationKey: 'high' };
  if (score >= 70) return { key: 'good', label: t.levels.good, recommendationKey: 'high' };
  if (score >= 50) return { key: 'medium', label: t.levels.medium, recommendationKey: 'medium' };
  return { key: 'low', label: t.levels.low, recommendationKey: 'low' };
}

function getSchoolSlug(school) {
  return school.slug ?? school.id;
}

function getRecommendationSchools(levelKey) {
  const ranked = schools
    .map((school) => {
      const typeText = `${getLocalizedSchoolValue(school.school_type, 'en')} ${getLocalizedSchoolValue(school.name, 'en')}`.toLowerCase();
      const isAdvanced = ['gymnasium', 'lyceum', 'specialized', 'bil', 'stem'].some((token) => typeText.includes(token)) || school.type === 'specialized';
      const isPublic = school.type === 'public';
      const isGentle = school.after_school_program === 'yes' || school.school_bus === 'yes' || school.admission_test !== 'yes';
      let score = 0;

      if (levelKey === 'high') score = (isAdvanced ? 40 : 0) + (school.type === 'specialized' ? 20 : 0) + (school.admission_test === 'yes' ? 8 : 0);
      if (levelKey === 'medium') score = (isPublic ? 35 : 0) + (isGentle ? 12 : 0) + (!isAdvanced ? 8 : 0);
      if (levelKey === 'low') score = (isGentle ? 35 : 0) + (school.admission_test !== 'yes' ? 15 : 0) + (!isAdvanced ? 8 : 0);

      return { school, score };
    })
    .sort((first, second) => second.score - first.score || getLocalizedSchoolValue(first.school.name, 'ru').localeCompare(getLocalizedSchoolValue(second.school.name, 'ru')));

  return ranked.slice(0, 6).map(({ school }) => school);
}

function LanguageSwitcher({ currentLanguage }) {
  return <div className="language-switcher" aria-label={translations[currentLanguage].languageSwitcherLabel}>{languageOptions.map(({ code, label }) => <a key={code} className={currentLanguage === code ? 'language-switcher__button language-switcher__button--active' : 'language-switcher__button'} href={`/school-readiness?lang=${code}`} aria-current={currentLanguage === code ? 'page' : undefined}>{label}</a>)}</div>;
}

export default function SchoolReadinessPage() {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [answers, setAnswers] = useState({});
  const t = translations[currentLanguage];
  const totalQuestions = t.questions.length;
  const answeredCount = Object.keys(answers).length;
  const score = useMemo(() => Object.values(answers).reduce((sum, answer) => sum + answerScores[answer], 0), [answers]);
  const level = getLevel(score, t);
  const strengths = t.skillLabels.filter((_, index) => answers[index] === 'yes');
  const improvements = t.skillLabels.filter((_, index) => answers[index] === 'partial' || answers[index] === 'no');
  const recommendationSchools = useMemo(() => getRecommendationSchools(level.recommendationKey), [level.recommendationKey]);

  useEffect(() => {
    try {
      const urlLanguage = new URLSearchParams(window.location.search).get('lang');
      const storedLanguage = window.localStorage.getItem(languageStorageKey);
      setCurrentLanguage(getLanguage(urlLanguage || storedLanguage));
    } catch {
      setCurrentLanguage(defaultLanguage);
    }
  }, []);

  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <main>
      <nav className="school-detail__topbar" aria-label={t.languageSwitcherLabel}>
        <a className="back-link" href={`/?lang=${currentLanguage}`}>← {t.backToHome}</a>
        <LanguageSwitcher currentLanguage={currentLanguage} />
      </nav>

      <section className="readiness-hero">
        <div>
          <p className="hero__kicker">{t.kicker}</p>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        <div className="readiness-progress" aria-label={t.progress(answeredCount, totalQuestions)}>
          <strong>{progressPercent}%</strong>
          <span>{t.progress(answeredCount, totalQuestions)}</span>
        </div>
      </section>

      <section className="readiness-card readiness-card--questions">
        <div className="readiness-progress-bar"><span style={{ width: `${progressPercent}%` }} /></div>
        {t.questions.map((question, index) => (
          <fieldset className="readiness-question" key={question}>
            <legend><span>{index + 1}</span>{question}</legend>
            <div className="readiness-options">
              {Object.entries(t.answers).map(([value, label]) => (
                <label key={value} className={answers[index] === value ? 'readiness-option readiness-option--selected' : 'readiness-option'}>
                  <input type="radio" name={`question-${index}`} value={value} checked={answers[index] === value} onChange={() => setAnswers((current) => ({ ...current, [index]: value }))} />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </section>

      <section className="readiness-results" aria-live="polite">
        <div className={`readiness-score readiness-score--${level.key}`}>
          <span>{t.score}</span>
          <strong>{score}</strong>
          <p>{t.points}</p>
          <h2>{level.label}</h2>
        </div>
        <div className="readiness-insights">
          <section><h3>{t.strengthsTitle}</h3><ul>{(strengths.length ? strengths : [t.noStrengths]).map((item) => <li key={item}>✓ {item}</li>)}</ul></section>
          <section><h3>{t.improvementsTitle}</h3><ul>{(improvements.length ? improvements : [t.noImprovements]).map((item) => <li key={item}>⚠ {item}</li>)}</ul></section>
        </div>
      </section>

      <section className="readiness-card">
        <div className="readiness-section-heading">
          <h2>{t.recommendationsTitle}</h2>
          <p>{t.recommendationIntro[level.recommendationKey]}</p>
        </div>
        <div className="readiness-category-list">{t.categories[level.recommendationKey].map((category) => <span key={category}>✓ {category}</span>)}</div>
        <div className="readiness-school-grid">
          {recommendationSchools.map((school) => (
            <article className="readiness-school" key={school.id}>
              <p>{getLocalizedEnumLabel('schoolTypes', school.type, currentLanguage)} · {getLocalizedEnumLabel('districts', school.district, currentLanguage)}</p>
              <h3>{getLocalizedSchoolValue(school.name, currentLanguage)}</h3>
              <a href={`/schools/${getSchoolSlug(school)}?lang=${currentLanguage}`}>{t.details}</a>
            </article>
          ))}
        </div>
        <a className="hero__cta readiness-cta" href={`/quiz?lang=${currentLanguage}`}>{t.chooseSchool}</a>
      </section>
    </main>
  );
}
