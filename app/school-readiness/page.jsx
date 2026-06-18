'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import readinessConfig from '../../src/data/schoolReadinessQuestions.json';

const answerOptions = [
  { value: 4, label: 'Да, уверенно' },
  { value: 3, label: 'Скорее да' },
  { value: 2, label: 'Иногда получается' },
  { value: 1, label: 'Пока с трудом' },
  { value: 0, label: 'Пока не получается' }
];
const maxAnswerScore = 4;
const readinessStorageKey = 'school-choice-kz-readiness-results';
const ageOptions = ['5', '6', '7'];
const domainById = Object.fromEntries(readinessConfig.domains.map((domain) => [domain.id, domain]));
const domainDisplayNames = {
  cognitive: 'Познавательное развитие',
  speech: 'Речь',
  attention: 'Моторика',
  independence: 'Самостоятельность',
  social: 'Социальная готовность'
};

function getInterpretation(percent) {
  if (percent < 60) {
    return {
      key: 'needs',
      icon: '🟠',
      title: 'Нужна мягкая подготовка',
      text: 'Ребёнку важно укрепить базовые навыки до школьного старта: лучше двигаться маленькими регулярными шагами через игру и спокойную поддержку взрослого.'
    };
  }
  if (percent < 80) {
    return {
      key: 'partial',
      icon: '🟡',
      title: 'Формирующаяся готовность',
      text: 'Ребёнок уже имеет хорошую опору для старта, но отдельные зоны требуют регулярной практики без давления и сравнения с другими детьми.'
    };
  }
  return {
    key: 'high',
    icon: '🟢',
    title: 'Высокая готовность',
    text: 'Ребёнок демонстрирует большинство навыков, необходимых для успешного старта в школе.'
  };
}

const ageRecommendations = {
  5: 'В 5 лет главный фокус — интерес к обучению, речь, игра по правилам и самостоятельность в быту. Не спешите с академической нагрузкой: лучше укреплять навыки через чтение, конструкторы, прогулки и короткие игровые задания.',
  6: 'В 6 лет полезно постепенно вводить школьный ритм: задания по 10–15 минут, подготовку рабочего места, самостоятельный сбор вещей и обсуждение эмоций перед новыми ситуациями.',
  7: 'В 7 лет важно поддержать уверенность ребёнка перед школой: закрепляйте режим дня, тренируйте доведение задания до конца и заранее обсуждайте, как попросить учителя о помощи.'
};

const strengthTemplates = {
  cognitive: 'Хорошо развиты любознательность, сравнение, счёт и умение замечать закономерности.',
  speech: 'Ребёнку легче понимать инструкции, выражать мысли и участвовать в диалоге со взрослым.',
  attention: 'Есть база для аккуратной работы руками, зрительного контроля и выполнения заданий по образцу.',
  independence: 'Ребёнок показывает самостоятельность в бытовых действиях и готовность брать небольшую ответственность.',
  social: 'Ребёнку проще включаться в группу, принимать правила и договариваться со взрослыми или сверстниками.'
};

function calculateDomainScores(questions, answers) {
  return readinessConfig.domains.map((domain) => {
    const domainQuestions = questions.filter((question) => question.domainId === domain.id);
    const score = domainQuestions.reduce((sum, question) => sum + (answers[question.id] ?? 0), 0);
    const maxScore = domainQuestions.length * maxAnswerScore;
    return { ...domain, title: domainDisplayNames[domain.id] ?? domain.title, score, maxScore, percent: maxScore ? Math.round((score / maxScore) * 100) : 0 };
  });
}

export default function SchoolReadinessPage() {
  const [selectedAge, setSelectedAge] = useState('6');
  const [goesToKindergarten, setGoesToKindergarten] = useState('');
  const [goesToPreparation, setGoesToPreparation] = useState('');
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedValue, setSelectedValue] = useState(null);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [completedDomain, setCompletedDomain] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const advanceTimer = useRef(null);

  const questions = readinessConfig.ages[selectedAge];
  const currentQuestion = questions[currentIndex];
  const currentDomain = currentQuestion ? domainById[currentQuestion.domainId] : null;
  const currentDomainTitle = currentDomain ? (domainDisplayNames[currentDomain.id] ?? currentDomain.title) : '';
  const domainScores = useMemo(() => calculateDomainScores(questions, answers), [questions, answers]);
  const totalScore = domainScores.reduce((sum, domain) => sum + domain.score, 0);
  const maxScore = questions.length * maxAnswerScore;
  const overallPercent = Math.round((totalScore / maxScore) * 100);
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === questions.length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);
  const interpretation = getInterpretation(overallPercent);
  const sortedDomainsByStrength = domainScores.slice().sort((a, b) => b.percent - a.percent);
  const sortedDomainsByNeed = domainScores.slice().sort((a, b) => a.percent - b.percent);
  const strengths = sortedDomainsByStrength.slice(0, 5).filter((domain, index) => domain.percent >= 70 || index < 3);
  const focusDomains = sortedDomainsByNeed.slice(0, 5).filter((domain, index) => domain.percent < 80 || index < 3);
  const recommendations = focusDomains.flatMap((domain) => domain.recommendations.slice(0, 1).map((text) => ({ domain: domain.title, text })));
  const ageRecommendation = ageRecommendations[selectedAge];

  useEffect(() => {
    if (!started || !isComplete || !showResults) return;

    const result = {
      percent: overallPercent,
      level: interpretation.title,
      completedAt: new Date().toISOString(),
      selectedAge,
      domainScores: domainScores.map(({ id, title, percent }) => ({ id, title, percent }))
    };

    try {
      const storedResults = JSON.parse(window.localStorage.getItem(readinessStorageKey) || '[]');
      const results = Array.isArray(storedResults) ? storedResults : [storedResults].filter(Boolean);
      window.localStorage.setItem(readinessStorageKey, JSON.stringify([result, ...results].slice(0, 5)));
    } catch {
      // The report remains visible for the current session if localStorage is unavailable.
    }
  }, [domainScores, interpretation.title, isComplete, overallPercent, selectedAge, showResults, started]);

  function clearAdvanceTimer() {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }

  function resetAssessment(age = selectedAge) {
    clearAdvanceTimer();
    setSelectedAge(age);
    setAnswers({});
    setStarted(false);
    setCurrentIndex(0);
    setSelectedValue(null);
    setIsAdvancing(false);
    setCompletedDomain(null);
    setShowResults(false);
  }

  function startAssessment() {
    setAnswers({});
    setCurrentIndex(0);
    setSelectedValue(null);
    setIsAdvancing(false);
    setCompletedDomain(null);
    setShowResults(false);
    setStarted(true);
  }

  function continueAfterDomain() {
    setCompletedDomain(null);
    setSelectedValue(null);
    setIsAdvancing(false);
    if (isComplete) {
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentIndex((index) => Math.min(index + 1, questions.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleAnswer(value) {
    if (!currentQuestion || isAdvancing || completedDomain) return;
    clearAdvanceTimer();
    setSelectedValue(value);
    setIsAdvancing(true);
    setAnswers((current) => ({ ...current, [currentQuestion.id]: value }));

    advanceTimer.current = setTimeout(() => {
      const nextQuestion = questions[currentIndex + 1];
      const finishedDomain = !nextQuestion || nextQuestion.domainId !== currentQuestion.domainId;
      if (finishedDomain) {
        setCompletedDomain(domainDisplayNames[currentQuestion.domainId] ?? domainById[currentQuestion.domainId].title);
        setIsAdvancing(false);
        if (nextQuestion) {
          advanceTimer.current = setTimeout(continueAfterDomain, 900);
        } else {
          advanceTimer.current = setTimeout(() => {
            setCompletedDomain(null);
            setShowResults(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 900);
        }
        return;
      }
      setSelectedValue(null);
      setIsAdvancing(false);
      if (nextQuestion) setCurrentIndex((index) => index + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 450);
  }

  function goBack() {
    clearAdvanceTimer();
    if (showResults) {
      setShowResults(false);
      setCompletedDomain(domainDisplayNames[questions[questions.length - 1].domainId] ?? domainById[questions[questions.length - 1].domainId].title);
      return;
    }
    if (completedDomain) {
      setCompletedDomain(null);
      setSelectedValue(answers[currentQuestion.id] ?? null);
      return;
    }
    if (currentIndex === 0) {
      setStarted(false);
      return;
    }
    const previousQuestion = questions[currentIndex - 1];
    setCurrentIndex((index) => index - 1);
    setSelectedValue(answers[previousQuestion.id] ?? null);
    setIsAdvancing(false);
  }

  function restart() {
    resetAssessment();
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
          <p>Пошаговый маршрут помогает мягко оценить готовность ребенка 5, 6 или 7 лет к школьному старту по пяти доменам развития.</p>
        </div>
        <div className="readiness-progress" aria-label={`${answeredCount} из ${questions.length} отвечено`}>
          <strong>{started ? `${progressPercent}%` : questions.length}</strong>
          <span>{started ? `${answeredCount} из ${questions.length} отвечено` : `вопросов для ${selectedAge} лет`}</span>
        </div>
      </section>

      {!started && <section className="readiness-card readiness-start-card" aria-labelledby="start-title">
        <div>
          <p className="hero__kicker">Первый экран</p>
          <h2 id="start-title">Расскажите немного о ребенке</h2>
          <p>После выбора возраста начнется guided-flow: один вопрос на экране, крупные карточки ответов и паузы между разделами.</p>
        </div>
        <div className="readiness-form-grid">
          <label><span>Возраст ребенка</span><select value={selectedAge} onChange={(event) => resetAssessment(event.target.value)}>{ageOptions.map((age) => <option key={age} value={age}>{age} лет</option>)}</select></label>
          <label><span>Посещает детский сад</span><select value={goesToKindergarten} onChange={(event) => setGoesToKindergarten(event.target.value)}><option value="">Выберите</option><option>Да</option><option>Нет</option><option>Иногда</option></select></label>
          <label><span>Посещает подготовку к школе</span><select value={goesToPreparation} onChange={(event) => setGoesToPreparation(event.target.value)}><option value="">Выберите</option><option>Да</option><option>Нет</option><option>Планируем начать</option></select></label>
        </div>
        <button className="hero__cta readiness-start-button" type="button" onClick={startAssessment} disabled={!goesToKindergarten || !goesToPreparation}>Начать тест</button>
      </section>}

      {started && completedDomain && !showResults && <section className="readiness-card readiness-domain-complete" aria-live="polite">
        <span>Раздел завершён</span>
        <h2>{completedDomain}</h2>
        <p>Отлично, двигаемся дальше. Следующий раздел откроется автоматически.</p>
        <div className="readiness-progress-bar"><span style={{ width: `${progressPercent}%` }} /></div>
      </section>}

      {started && !isComplete && !completedDomain && !showResults && currentQuestion && <section className={`readiness-card readiness-card--single-question ${isAdvancing ? 'readiness-card--advancing' : ''}`} aria-labelledby="question-title">
        <div className="readiness-question-meta">
          <strong>{currentDomainTitle}</strong>
          <span>Вопрос {currentIndex + 1} из {questions.length}</span>
        </div>
        <div className="readiness-progress-bar" aria-hidden="true"><span style={{ width: `${progressPercent}%` }} /></div>
        <fieldset className="readiness-question readiness-question--featured">
          <legend id="question-title">{currentQuestion.text}</legend>
          <div className="readiness-options readiness-options--cards">{answerOptions.map((option) => {
            const isSelected = selectedValue === option.value || answers[currentQuestion.id] === option.value;
            return <button key={option.value} type="button" className={isSelected ? 'readiness-answer-card readiness-answer-card--selected' : 'readiness-answer-card'} onClick={() => handleAnswer(option.value)} disabled={isAdvancing} aria-pressed={isSelected}>{option.label}</button>;
          })}</div>
        </fieldset>
        <div className="readiness-navigation">
          <button className="readiness-nav-button" type="button" onClick={goBack}>← Назад</button>
        </div>
      </section>}

      {started && isComplete && showResults && <section className="readiness-results readiness-results--assessment" aria-live="polite">
        <div className={`readiness-score readiness-score--${interpretation.key}`}><span>Общий индекс готовности</span><strong>{overallPercent}%</strong><p>{interpretation.icon} {interpretation.title}</p></div>
        <div className="readiness-insights readiness-insights--assessment"><p className="hero__kicker">Итоговый отчёт</p><h2>Профиль развития ребёнка</h2><p>{interpretation.text}</p><div className="readiness-domain-list">{domainScores.map((domain) => <div className="readiness-domain-score" key={domain.id}><div><strong>{domain.title}</strong><span>{domain.percent}%</span></div><div className="readiness-domain-bar" aria-label={`${domain.title}: ${domain.percent}%`}><span style={{ width: `${domain.percent}%` }} /></div></div>)}</div></div>
      </section>}

      {started && isComplete && showResults && <section className="readiness-card readiness-support-grid">
        <div><h2>Сильные стороны</h2><ul>{strengths.map((domain) => <li key={domain.id}>✓ <strong>{domain.title}</strong><span>{strengthTemplates[domain.id]}</span></li>)}</ul></div>
        <div><h2>На что обратить внимание</h2><ul>{recommendations.slice(0, 5).map((item) => <li key={`${item.domain}-${item.text}`}>↗ <strong>{item.domain}:</strong><span>{item.text}</span></li>)}</ul></div>
        <div><h2>Рекомендация для {selectedAge} лет</h2><p>{ageRecommendation}</p><ul><li>🏠 Выберите 1–2 зоны и занимайтесь 10–15 минут в день.</li><li>💬 Хвалите за усилие, а не только за правильный ответ.</li><li>🧩 Используйте игру, чтение, бытовые поручения и спокойное обсуждение успехов.</li></ul></div>
        <div className="readiness-report-actions"><button className="hero__cta readiness-pdf-button" type="button" disabled>Скачать PDF отчёт</button><span>PDF-экспорт в разработке — сейчас это визуальный макет профессионального отчёта.</span></div>
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
