'use client';

import { useMemo, useState } from 'react';
import readinessConfig from '../../src/data/schoolReadinessQuestions.json';

const answerOptions = [
  { value: 0, label: '0 — никогда' },
  { value: 1, label: '1 — редко' },
  { value: 2, label: '2 — иногда' },
  { value: 3, label: '3 — часто' },
  { value: 4, label: '4 — всегда' }
];
const maxAnswerScore = 4;
const ageOptions = ['5', '6', '7'];
const domainById = Object.fromEntries(readinessConfig.domains.map((domain) => [domain.id, domain]));

function getInterpretation(percent) {
  if (percent < 50) return { key: 'needs', title: 'Высокая потребность в подготовке', text: 'Лучше двигаться маленькими регулярными шагами и укреплять базовые навыки через игру.' };
  if (percent <= 70) return { key: 'partial', title: 'Частичная готовность', text: 'У ребенка уже есть опора, но отдельные зоны требуют спокойной ежедневной практики.' };
  if (percent <= 85) return { key: 'good', title: 'Хороший уровень готовности', text: 'Большинство навыков сформированы, продолжайте поддерживать устойчивость и самостоятельность.' };
  return { key: 'high', title: 'Высокая готовность к обучению', text: 'Ребенок уверенно демонстрирует навыки, которые помогают мягко войти в школьный режим.' };
}

function calculateDomainScores(questions, answers) {
  return readinessConfig.domains.map((domain) => {
    const domainQuestions = questions.filter((question) => question.domainId === domain.id);
    const score = domainQuestions.reduce((sum, question) => sum + (answers[question.id] ?? 0), 0);
    const maxScore = domainQuestions.length * maxAnswerScore;
    return { ...domain, score, maxScore, percent: maxScore ? Math.round((score / maxScore) * 100) : 0 };
  });
}

export default function SchoolReadinessPage() {
  const [selectedAge, setSelectedAge] = useState('6');
  const [goesToKindergarten, setGoesToKindergarten] = useState('');
  const [goesToPreparation, setGoesToPreparation] = useState('');
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({});

  const questions = readinessConfig.ages[selectedAge];
  const domainScores = useMemo(() => calculateDomainScores(questions, answers), [questions, answers]);
  const totalScore = domainScores.reduce((sum, domain) => sum + domain.score, 0);
  const maxScore = questions.length * maxAnswerScore;
  const overallPercent = Math.round((totalScore / maxScore) * 100);
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === questions.length;
  const interpretation = getInterpretation(overallPercent);
  const weakDomains = domainScores.filter((domain) => domain.percent < 70);
  const strongDomains = domainScores.filter((domain) => domain.percent >= 75);
  const recommendations = (weakDomains.length ? weakDomains : domainScores.slice().sort((a, b) => a.percent - b.percent).slice(0, 2))
    .flatMap((domain) => domain.recommendations.map((text) => ({ domain: domain.title, text })));

  function resetForAge(age) {
    setSelectedAge(age);
    setAnswers({});
    setStarted(false);
  }

  function restart() {
    setAnswers({});
    setStarted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main>
      <nav className="school-detail__topbar" aria-label="Навигация">
        <a className="back-link" href="/">← На главную</a>
      </nav>

      <section className="readiness-hero readiness-hero--assessment">
        <div>
          <p className="hero__kicker">Рекомендательный инструмент для родителей</p>
          <h1>Готовность к школе</h1>
          <p>Интерактивный тест помогает мягко оценить готовность ребенка 5, 6 или 7 лет к школьному старту по пяти доменам развития.</p>
        </div>
        <div className="readiness-progress" aria-label={`${answeredCount} из ${questions.length} отвечено`}>
          <strong>{started ? `${Math.round((answeredCount / questions.length) * 100)}%` : questions.length}</strong>
          <span>{started ? `${answeredCount} из ${questions.length} отвечено` : `вопросов для ${selectedAge} лет`}</span>
        </div>
      </section>

      <section className="readiness-card readiness-start-card" aria-labelledby="start-title">
        <div>
          <p className="hero__kicker">Первый экран</p>
          <h2 id="start-title">Расскажите немного о ребенке</h2>
          <p>После выбора возраста будет показан соответствующий набор: 5 лет — 20 вопросов, 6 лет — 25 вопросов, 7 лет — 30 вопросов.</p>
        </div>
        <div className="readiness-form-grid">
          <label><span>Возраст ребенка</span><select value={selectedAge} onChange={(event) => resetForAge(event.target.value)}>{ageOptions.map((age) => <option key={age} value={age}>{age} лет</option>)}</select></label>
          <label><span>Посещает детский сад</span><select value={goesToKindergarten} onChange={(event) => setGoesToKindergarten(event.target.value)}><option value="">Выберите</option><option>Да</option><option>Нет</option><option>Иногда</option></select></label>
          <label><span>Посещает подготовку к школе</span><select value={goesToPreparation} onChange={(event) => setGoesToPreparation(event.target.value)}><option value="">Выберите</option><option>Да</option><option>Нет</option><option>Планируем начать</option></select></label>
        </div>
        <button className="hero__cta readiness-start-button" type="button" onClick={() => setStarted(true)} disabled={!goesToKindergarten || !goesToPreparation}>Начать тест</button>
      </section>

      {started && <section className="readiness-card readiness-card--questions" aria-labelledby="questions-title">
        <div className="readiness-section-heading"><h2 id="questions-title">Вопросы для возраста {selectedAge} лет</h2><p>{questions.length} вопросов распределены по 5 доменам. Выберите один вариант ответа для каждого пункта.</p></div>
        <div className="readiness-progress-bar"><span style={{ width: `${Math.round((answeredCount / questions.length) * 100)}%` }} /></div>
        <div className="readiness-question-list">
          {questions.map((question, index) => <fieldset className="readiness-question readiness-question--compact" key={question.id}>
            <legend><span>{index + 1}</span>{question.text}<em>{domainById[question.domainId].title}</em></legend>
            <div className="readiness-options readiness-options--scale">{answerOptions.map((option) => <label key={option.value} className={answers[question.id] === option.value ? 'readiness-option readiness-option--selected' : 'readiness-option'}><input type="radio" name={question.id} checked={answers[question.id] === option.value} onChange={() => setAnswers((current) => ({ ...current, [question.id]: option.value }))} />{option.label}</label>)}</div>
          </fieldset>)}
        </div>
      </section>}

      {started && isComplete && <section className="readiness-results readiness-results--assessment" aria-live="polite">
        <div className={`readiness-score readiness-score--${interpretation.key}`}><span>Общая готовность</span><strong>{overallPercent}%</strong><p>{interpretation.title}</p></div>
        <div className="readiness-insights readiness-insights--assessment"><p className="hero__kicker">Аккуратный отчет</p><h2>{interpretation.title}</h2><p>{interpretation.text}</p><div className="readiness-domain-list">{domainScores.map((domain) => <div className="readiness-domain-score" key={domain.id}><div><strong>{domain.title}</strong><span>{domain.percent}%</span></div><div className="readiness-domain-bar"><span style={{ width: `${domain.percent}%` }} /></div></div>)}</div></div>
      </section>}

      {started && isComplete && <section className="readiness-card readiness-support-grid">
        <div><h2>Сильные стороны</h2><ul>{(strongDomains.length ? strongDomains : domainScores.slice().sort((a, b) => b.percent - a.percent).slice(0, 2)).map((domain) => <li key={domain.id}>✓ {domain.title}: {domain.percent}%</li>)}</ul></div>
        <div><h2>Зоны роста</h2><ul>{(weakDomains.length ? weakDomains : domainScores.slice().sort((a, b) => a.percent - b.percent).slice(0, 2)).map((domain) => <li key={domain.id}>↗ {domain.title}: {domain.percent}%</li>)}</ul></div>
        <div><h2>Персональные рекомендации</h2><ul>{recommendations.map((item) => <li key={`${item.domain}-${item.text}`}>🏠 <strong>{item.domain}:</strong> {item.text}</li>)}</ul></div>
        <button className="readiness-nav-button readiness-retake" type="button" onClick={restart}>Пройти заново</button>
      </section>}

      <section className="readiness-card readiness-disclaimer"><strong>Важно:</strong> Результаты носят информационный характер и не являются психологическим, педагогическим или медицинским заключением. Для профессиональной оценки рекомендуется обратиться к профильному специалисту.</section>

      <section className="readiness-card readiness-drawing-analysis" aria-labelledby="drawing-analysis-title">
        <div className="readiness-drawing-analysis__content"><p className="hero__kicker">Будущая функция</p><h2 id="drawing-analysis-title">ИИ-анализ рисунков и раскрасок</h2><p>Скоро можно будет загрузить рисунок или раскраску ребенка, чтобы получить мягкие рекомендации по развитию мелкой моторики, внимания и аккуратности.</p></div>
        <div className="readiness-drawing-analysis__action"><button className="hero__cta readiness-upload-button" type="button" disabled>Загрузить рисунок</button><p>Функция не ставит диагнозы и не заменяет консультацию специалиста.</p></div>
      </section>
    </main>
  );
}
