'use client';

import { useEffect, useMemo, useState } from 'react';

const defaultLanguage = 'ru';
const languageStorageKey = 'school-choice-kz-language';
const answerScores = { always: 4, often: 3, sometimes: 2, rarely: 1, never: 0 };
const maxAnswerScore = 4;
const languageOptions = [
  { code: 'ru', label: 'RU' },
  { code: 'kz', label: 'KZ' },
  { code: 'en', label: 'EN' }
];

const domainIds = ['speech', 'math', 'attention', 'motor', 'social', 'emotional'];

const translations = {
  ru: {
    languageSwitcherLabel: 'Выберите язык интерфейса',
    backToHome: 'На главную',
    kicker: 'Готовность к школе',
    title: 'Готовность к школе',
    subtitle: 'Самостоятельная оценка для родителей: 30 вопросов по ключевым образовательным и developmental-навыкам без привязки к подбору школы.',
    progress: (current, total) => `Вопрос ${current} из ${total}`,
    answered: (answered, total) => `${answered} из ${total} отвечено`,
    domainLabel: 'Раздел',
    resultsEyebrow: 'Результаты оценки',
    overallReadiness: 'Общая готовность',
    readinessCategory: 'Категория готовности',
    domainScores: 'Баллы по доменам',
    strengthsTitle: 'Сильные стороны',
    supportTitle: 'Зоны, где нужна поддержка',
    retake: 'Пройти заново',
    previous: 'Назад',
    next: 'Следующий вопрос',
    finish: 'Показать результат',
    incomplete: 'Ответьте на все вопросы, чтобы увидеть итоговую оценку.',
    scale: { always: 'Всегда', often: 'Часто', sometimes: 'Иногда', rarely: 'Редко', never: 'Никогда' },
    categories: { high: 'Высокая готовность', good: 'Хорошая готовность', developing: 'Формируется готовность', support: 'Нужна дополнительная поддержка' },
    descriptions: {
      high: 'Ребенок стабильно демонстрирует навыки, которые помогают мягко войти в школьный режим.',
      good: 'База сформирована, а отдельные навыки можно укреплять через ежедневную практику.',
      developing: 'Есть заметные сильные стороны, но несколько областей требуют регулярной поддержки.',
      support: 'Рекомендуется спокойная подготовка, наблюдение динамики и консультация специалиста при необходимости.'
    },
    noStrengths: 'Сильные стороны проявятся после заполнения всех ответов.',
    noSupport: 'Выраженных зон поддержки не отмечено. Поддерживайте текущий темп подготовки.',
    domains: {
      speech: { title: 'Речевое развитие', strength: 'Речь и понимание инструкций хорошо поддерживают обучение.', support: 'Развивайте словарь, пересказ и умение отвечать полными фразами.' },
      math: { title: 'Математическая готовность', strength: 'Математические представления помогают ребенку уверенно решать базовые задачи.', support: 'Тренируйте счет, сравнение, формы и простые закономерности в игре.' },
      attention: { title: 'Внимание и память', strength: 'Ребенок удерживает внимание и запоминает инструкции для учебных заданий.', support: 'Используйте короткие задания на память, последовательность и концентрацию.' },
      motor: { title: 'Мелкая моторика', strength: 'Рука готовится к письму через точные движения и самостоятельность.', support: 'Добавьте рисование, штриховку, лепку, ножницы и застежки.' },
      social: { title: 'Социальная готовность', strength: 'Ребенок умеет взаимодействовать с детьми и взрослыми в группе.', support: 'Отрабатывайте очередность, просьбы о помощи и спокойное следование правилам.' },
      emotional: { title: 'Эмоциональная зрелость', strength: 'Эмоциональная устойчивость помогает ребенку адаптироваться к школе.', support: 'Поддержите самостоятельность, принятие ошибок и способы успокоиться.' }
    },
    questions: {
      speech: ['Ребенок говорит понятными полными предложениями.', 'Может пересказать короткую историю или событие.', 'Понимает и выполняет инструкции из 2–3 шагов.', 'Задает вопросы и умеет объяснить, что ему нужно.', 'Правильно использует базовые слова о времени, месте и количестве.'],
      math: ['Считает предметы до 10 и соотносит число с количеством.', 'Сравнивает больше/меньше/поровну на конкретных предметах.', 'Узнает основные геометрические формы.', 'Понимает простые закономерности и продолжает ряд.', 'Ориентируется в понятиях первый/последний/между/рядом.'],
      attention: ['Может заниматься одним заданием 10–15 минут.', 'Запоминает короткие стихи, песни или правила игры.', 'Возвращается к заданию после небольшой подсказки.', 'Замечает детали на картинке и находит отличия.', 'Следует распорядку и помнит последовательность привычных действий.'],
      motor: ['Уверенно держит карандаш или фломастер.', 'Рисует линии, круги и простые элементы по образцу.', 'Пользуется ножницами под присмотром взрослого.', 'Самостоятельно застегивает пуговицы, молнии или липучки.', 'Аккуратно раскрашивает, лепит или собирает мелкие детали.'],
      social: ['Легко вступает в игру со сверстниками.', 'Умеет ждать очереди и делиться материалами.', 'Обращается к взрослому за помощью, когда это нужно.', 'Соблюдает простые правила группы или занятия.', 'Может спокойно работать рядом с другими детьми.'],
      emotional: ['Спокойно расстается с родителем на короткое время.', 'Пробует снова, если задание не получилось с первого раза.', 'Может назвать свои эмоции или показать, что чувствует.', 'Принимает небольшие изменения в планах без сильного стресса.', 'Старается завершить начатое задание даже при трудностях.']
    }
  },
  kz: {
    languageSwitcherLabel: 'Интерфейс тілін таңдаңыз', backToHome: 'Басты бетке', kicker: 'Мектепке дайындық', title: 'Мектепке дайындық', subtitle: 'Ата-аналарға арналған жеке бағалау: мектеп таңдаумен байланыстырылмаған 30 сұрақ.', progress: (current, total) => `${current}/${total} сұрақ`, answered: (answered, total) => `${answered}/${total} жауап`, domainLabel: 'Бөлім', resultsEyebrow: 'Бағалау нәтижесі', overallReadiness: 'Жалпы дайындық', readinessCategory: 'Дайындық санаты', domainScores: 'Домендер бойынша балл', strengthsTitle: 'Күшті жақтары', supportTitle: 'Қолдау қажет аймақтар', retake: 'Қайта өту', previous: 'Артқа', next: 'Келесі сұрақ', finish: 'Нәтижені көрсету', incomplete: 'Қорытынды баға үшін барлық сұраққа жауап беріңіз.', scale: { always: 'Әрқашан', often: 'Жиі', sometimes: 'Кейде', rarely: 'Сирек', never: 'Ешқашан' }, categories: { high: 'Дайындығы жоғары', good: 'Дайындығы жақсы', developing: 'Дайындық қалыптасуда', support: 'Қосымша қолдау қажет' }, descriptions: { high: 'Бала мектеп тәртібіне жұмсақ кіруге көмектесетін дағдыларды тұрақты көрсетеді.', good: 'Негіз қалыптасқан, кей дағдыларды күнделікті тәжірибемен нығайтуға болады.', developing: 'Күшті жақтары бар, бірақ бірнеше сала тұрақты қолдауды қажет етеді.', support: 'Сабырлы дайындық, динамиканы бақылау және қажет болса маман кеңесі ұсынылады.' }, noStrengths: 'Күшті жақтар барлық жауаптан кейін көрінеді.', noSupport: 'Айқын қолдау аймақтары байқалмады. Қазіргі дайындық қарқынын сақтаңыз.',
    domains: { speech: { title: 'Тілдік даму', strength: 'Сөйлеу және нұсқауды түсіну оқуға жақсы көмектеседі.', support: 'Сөздік қорды, мазмұндауды және толық жауап беруді дамытыңыз.' }, math: { title: 'Математикалық дайындық', strength: 'Математикалық түсініктер базалық тапсырмаларға сенімділік береді.', support: 'Санау, салыстыру, пішіндер және заңдылықтарды ойын арқылы жаттықтырыңыз.' }, attention: { title: 'Зейін және есте сақтау', strength: 'Бала оқу тапсырмаларында зейінін ұстап, нұсқауды есте сақтайды.', support: 'Қысқа есте сақтау, реттілік және зейін тапсырмаларын қолданыңыз.' }, motor: { title: 'Ұсақ моторика', strength: 'Дәл қимылдар жазуға дайындықты қолдайды.', support: 'Сурет салу, штрихтау, мүсіндеу, қайшы және түймелеуді қосыңыз.' }, social: { title: 'Әлеуметтік дайындық', strength: 'Бала топта балалармен және ересектермен әрекеттесе алады.', support: 'Кезек күту, көмек сұрау және ережелерді сақтау дағдыларын пысықтаңыз.' }, emotional: { title: 'Эмоциялық жетілу', strength: 'Эмоциялық тұрақтылық мектепке бейімделуге көмектеседі.', support: 'Дербестікті, қатені қабылдауды және тынышталу тәсілдерін қолдаңыз.' } },
    questions: { speech: ['Бала түсінікті толық сөйлемдермен сөйлейді.', 'Қысқа оқиғаны немесе жағдайды мазмұндай алады.', '2–3 қадамнан тұратын нұсқауды түсініп орындайды.', 'Сұрақ қойып, өзіне не керек екенін түсіндіре алады.', 'Уақыт, орын және сан туралы негізгі сөздерді дұрыс қолданады.'], math: ['10-ға дейін заттарды санап, санды мөлшермен сәйкестендіреді.', 'Заттар арқылы көп/аз/тең ұғымдарын салыстырады.', 'Негізгі геометриялық пішіндерді таниды.', 'Қарапайым заңдылықты түсініп, қатарды жалғастырады.', 'Бірінші/соңғы/арасында/жанында ұғымдарын түсінеді.'], attention: ['Бір тапсырмамен 10–15 минут айналыса алады.', 'Қысқа тақпақ, ән немесе ойын ережесін есте сақтайды.', 'Шағын ескертуден кейін тапсырмаға қайта оралады.', 'Суреттегі бөлшектерді байқап, айырмашылық табады.', 'Күн тәртібін және үйреншікті әрекеттер ретін есте сақтайды.'], motor: ['Қарындашты немесе фломастерді сенімді ұстайды.', 'Үлгі бойынша сызық, шеңбер және қарапайым элементтер салады.', 'Ересек бақылауымен қайшы қолданады.', 'Түйме, сырма немесе жабысқақты өзі тағады.', 'Ұқыпты бояйды, мүсіндейді немесе ұсақ бөлшектер құрастырады.'], social: ['Құрдастарымен ойынға оңай қосылады.', 'Кезек күтіп, материалдармен бөлісе алады.', 'Қажет кезде ересектен көмек сұрайды.', 'Топтың немесе сабақтың қарапайым ережелерін сақтайды.', 'Басқа балалардың жанында тыныш жұмыс істей алады.'], emotional: ['Ата-анасынан қысқа уақытқа сабырлы ажырайды.', 'Тапсырма бірден шықпаса, қайта байқап көреді.', 'Өз эмоциясын атай алады немесе сезімін көрсете алады.', 'Жоспардағы шағын өзгерісті қатты күйзеліссіз қабылдайды.', 'Қиын болса да бастаған тапсырмасын аяқтауға тырысады.'] }
  },
  en: {
    languageSwitcherLabel: 'Choose interface language', backToHome: 'Back home', kicker: 'School readiness', title: 'School Readiness Assessment', subtitle: 'A standalone parent-focused assessment: 30 questions across educational and developmental domains, not connected to school matching.', progress: (current, total) => `Question ${current} of ${total}`, answered: (answered, total) => `${answered} of ${total} answered`, domainLabel: 'Domain', resultsEyebrow: 'Assessment results', overallReadiness: 'Overall readiness', readinessCategory: 'Readiness category', domainScores: 'Domain scores', strengthsTitle: 'Strengths', supportTitle: 'Areas needing support', retake: 'Start again', previous: 'Back', next: 'Next question', finish: 'Show results', incomplete: 'Answer every question to see the final readiness score.', scale: { always: 'Always', often: 'Often', sometimes: 'Sometimes', rarely: 'Rarely', never: 'Never' }, categories: { high: 'High readiness', good: 'Good readiness', developing: 'Readiness is developing', support: 'Additional support recommended' }, descriptions: { high: 'Your child consistently shows skills that support a smooth transition into school routines.', good: 'The foundation is in place, with a few skills to strengthen through everyday practice.', developing: 'There are visible strengths, while several areas need regular support.', support: 'Calm preparation, monitoring progress, and specialist guidance if needed are recommended.' }, noStrengths: 'Strengths will appear after all answers are completed.', noSupport: 'No clear support areas are highlighted. Keep the current preparation rhythm.',
    domains: { speech: { title: 'Speech development', strength: 'Speech and instruction comprehension are supporting learning well.', support: 'Build vocabulary, retelling, and answering in complete phrases.' }, math: { title: 'Mathematical readiness', strength: 'Early math concepts support confident basic problem solving.', support: 'Practice counting, comparison, shapes, and patterns through play.' }, attention: { title: 'Attention and memory', strength: 'Your child can hold attention and remember instructions for learning tasks.', support: 'Use short memory, sequencing, and focus activities.' }, motor: { title: 'Fine motor skills', strength: 'Precise hand movements are preparing the child for writing.', support: 'Add drawing, tracing, modeling clay, scissors, and fasteners.' }, social: { title: 'Social readiness', strength: 'Your child can interact with children and adults in a group.', support: 'Practice turn-taking, asking for help, and calmly following rules.' }, emotional: { title: 'Emotional maturity', strength: 'Emotional stability supports adaptation to school.', support: 'Support independence, accepting mistakes, and calming strategies.' } },
    questions: { speech: ['The child speaks in clear complete sentences.', 'Can retell a short story or event.', 'Understands and follows 2–3 step instructions.', 'Asks questions and can explain what they need.', 'Uses basic words about time, place, and quantity correctly.'], math: ['Counts objects to 10 and matches number to quantity.', 'Compares more/less/equal with concrete objects.', 'Recognizes basic geometric shapes.', 'Understands simple patterns and continues a sequence.', 'Understands first/last/between/next to.'], attention: ['Can work on one task for 10–15 minutes.', 'Remembers short poems, songs, or game rules.', 'Returns to a task after a small prompt.', 'Notices details in pictures and finds differences.', 'Follows routines and remembers familiar action sequences.'], motor: ['Holds a pencil or marker confidently.', 'Draws lines, circles, and simple elements from a model.', 'Uses scissors with adult supervision.', 'Fastens buttons, zippers, or Velcro independently.', 'Colors, models, or assembles small pieces carefully.'], social: ['Joins peer play easily.', 'Can wait for a turn and share materials.', 'Asks an adult for help when needed.', 'Follows simple group or lesson rules.', 'Can work calmly near other children.'], emotional: ['Separates from a parent calmly for a short time.', 'Tries again when a task does not work the first time.', 'Can name emotions or show how they feel.', 'Accepts small plan changes without strong stress.', 'Tries to finish a task even when it is difficult.'] }
  }
};

function getLanguage(value) { return translations[value] ? value : defaultLanguage; }
function getCategory(score, t) { if (score >= 85) return { key: 'high', label: t.categories.high }; if (score >= 70) return { key: 'good', label: t.categories.good }; if (score >= 50) return { key: 'developing', label: t.categories.developing }; return { key: 'support', label: t.categories.support }; }
function buildQuestions(t) { return domainIds.flatMap((domainId) => t.questions[domainId].map((text, questionIndex) => ({ id: `${domainId}-${questionIndex}`, domainId, text }))); }
function LanguageSwitcher({ currentLanguage }) { return <div className="language-switcher" aria-label={translations[currentLanguage].languageSwitcherLabel}>{languageOptions.map(({ code, label }) => <a key={code} className={currentLanguage === code ? 'language-switcher__button language-switcher__button--active' : 'language-switcher__button'} href={`/school-readiness?lang=${code}`} aria-current={currentLanguage === code ? 'page' : undefined}>{label}</a>)}</div>; }

export default function SchoolReadinessPage() {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = translations[currentLanguage];
  const questions = useMemo(() => buildQuestions(t), [t]);
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);
  const isComplete = answeredCount === totalQuestions;
  const domainScores = domainIds.map((domainId) => {
    const domainQuestions = questions.filter((question) => question.domainId === domainId);
    const raw = domainQuestions.reduce((sum, question) => sum + (answerScores[answers[question.id]] ?? 0), 0);
    return { id: domainId, title: t.domains[domainId].title, score: Math.round((raw / (domainQuestions.length * maxAnswerScore)) * 100) };
  });
  const overallScore = Math.round(domainScores.reduce((sum, domain) => sum + domain.score, 0) / domainScores.length);
  const category = getCategory(overallScore, t);
  const strengths = domainScores.filter((domain) => domain.score >= 75).map((domain) => t.domains[domain.id].strength);
  const supportAreas = domainScores.filter((domain) => domain.score < 65).map((domain) => t.domains[domain.id].support);

  useEffect(() => { try { const urlLanguage = new URLSearchParams(window.location.search).get('lang'); const storedLanguage = window.localStorage.getItem(languageStorageKey); setCurrentLanguage(getLanguage(urlLanguage || storedLanguage)); } catch { setCurrentLanguage(defaultLanguage); } }, []);

  function answerQuestion(value) { setAnswers((current) => ({ ...current, [currentQuestion.id]: value })); }
  function restart() { setAnswers({}); setCurrentIndex(0); }

  return (
    <main>
      <nav className="school-detail__topbar" aria-label={t.languageSwitcherLabel}>
        <a className="back-link" href={`/?lang=${currentLanguage}`}>← {t.backToHome}</a>
        <LanguageSwitcher currentLanguage={currentLanguage} />
      </nav>

      <section className="readiness-hero readiness-hero--assessment">
        <div>
          <p className="hero__kicker">{t.kicker}</p>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        <div className="readiness-progress" aria-label={t.answered(answeredCount, totalQuestions)}><strong>{progressPercent}%</strong><span>{t.answered(answeredCount, totalQuestions)}</span></div>
      </section>

      <section className="readiness-card readiness-card--single-question">
        <div className="readiness-progress-bar"><span style={{ width: `${progressPercent}%` }} /></div>
        <div className="readiness-question-meta"><span>{t.progress(currentIndex + 1, totalQuestions)}</span><span>{t.domainLabel}: {t.domains[currentQuestion.domainId].title}</span></div>
        <fieldset className="readiness-question readiness-question--featured">
          <legend><span>{currentIndex + 1}</span>{currentQuestion.text}</legend>
          <div className="readiness-options readiness-options--scale">
            {Object.entries(t.scale).map(([value, label]) => <label key={value} className={answers[currentQuestion.id] === value ? 'readiness-option readiness-option--selected' : 'readiness-option'}><input type="radio" name={currentQuestion.id} value={value} checked={answers[currentQuestion.id] === value} onChange={() => answerQuestion(value)} />{label}</label>)}
          </div>
        </fieldset>
        <div className="readiness-navigation">
          <button className="readiness-nav-button" type="button" onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))} disabled={currentIndex === 0}>{t.previous}</button>
          <button className="hero__cta readiness-next" type="button" onClick={() => setCurrentIndex((index) => Math.min(totalQuestions - 1, index + 1))} disabled={currentIndex === totalQuestions - 1}>{currentIndex === totalQuestions - 1 ? t.finish : t.next}</button>
        </div>
      </section>

      <section className="readiness-results readiness-results--assessment" aria-live="polite">
        <div className={`readiness-score readiness-score--${category.key}`}><span>{t.overallReadiness}</span><strong>{overallScore}</strong><p>/ 100</p><h2>{category.label}</h2></div>
        <div className="readiness-insights readiness-insights--assessment"><p className="hero__kicker">{t.resultsEyebrow}</p><h2>{t.readinessCategory}</h2><p>{isComplete ? t.descriptions[category.key] : t.incomplete}</p><div className="readiness-domain-list" aria-label={t.domainScores}>{domainScores.map((domain) => <div className="readiness-domain-score" key={domain.id}><div><strong>{domain.title}</strong><span>{domain.score}%</span></div><div className="readiness-domain-bar"><span style={{ width: `${domain.score}%` }} /></div></div>)}</div></div>
      </section>

      <section className="readiness-card readiness-support-grid">
        <div><h2>{t.strengthsTitle}</h2><ul>{(strengths.length ? strengths : [t.noStrengths]).map((item) => <li key={item}>✓ {item}</li>)}</ul></div>
        <div><h2>{t.supportTitle}</h2><ul>{(supportAreas.length ? supportAreas : [t.noSupport]).map((item) => <li key={item}>↗ {item}</li>)}</ul></div>
        <button className="readiness-nav-button readiness-retake" type="button" onClick={restart}>{t.retake}</button>
      </section>
    </main>
  );
}
