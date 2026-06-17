'use client';

import { useEffect, useState } from 'react';
import { brand } from '../../src/data/brand.js';

const languageStorageKey = 'school-choice-kz-language';
const contactMessagesStorageKey = 'bilimchoice-contact-messages';
const defaultLanguage = 'ru';
const languageOptions = [
  { code: 'ru', label: 'RU' },
  { code: 'kz', label: 'KZ' },
  { code: 'en', label: 'EN' }
];

const translations = {
  ru: {
    navLabel: 'Навигация по сайту', catalogLink: 'Каталог школ', readinessLink: 'Готовность к школе', aboutLink: 'О проекте', contactsLink: 'Контакты', languageSwitcherLabel: 'Выберите язык интерфейса',
    title: 'Контакты', subtitle: 'Свяжитесь с командой BilimChoice по вопросам сотрудничества, обновления данных или обратной связи.',
    name: 'Имя', email: 'Email', phone: 'Телефон', topic: 'Тема обращения', message: 'Сообщение', button: 'Отправить сообщение',
    success: 'Спасибо! Сообщение сохранено. Мы свяжемся с вами после подключения обработки заявок.', info: 'Пока форма работает в тестовом режиме. Данные сохраняются локально в браузере.',
    topics: ['Обновить данные школы', 'Добавить школу', 'Сотрудничество', 'Вопрос по сайту', 'Другое'], footerDescription: 'Экспертный каталог школ Астаны для осознанного выбора семьи.',
    footerColumns: [
      ['Навигация', [['Каталог школ', '/catalog'], ['Готовность к школе', '/school-readiness'], ['Избранное', '/favorites']]],
      ['Для родителей', [['Как выбрать школу', '/how-to-choose-school'], ['Вопросы и ответы', '/school-readiness'], ['Полезные статьи', '/how-to-choose-school']]],
      ['О проекте', [['О нас', '/about'], ['Добавить школу', '/contribute'], ['Контакты', '/contacts']]]
    ]
  },
  kz: {
    navLabel: 'Сайт навигациясы', catalogLink: 'Мектептер каталогы', readinessLink: 'Мектепке дайындық', aboutLink: 'Жоба туралы', contactsLink: 'Байланыс', languageSwitcherLabel: 'Интерфейс тілін таңдаңыз',
    title: 'Байланыс', subtitle: 'Ынтымақтастық, деректерді жаңарту немесе кері байланыс бойынша BilimChoice командасына хабарласыңыз.',
    name: 'Аты-жөні', email: 'Email', phone: 'Телефон', topic: 'Өтініш тақырыбы', message: 'Хабарлама', button: 'Хабарлама жіберу',
    success: 'Рақмет! Хабарлама сақталды. Өтініштерді өңдеу қосылғаннан кейін сізбен хабарласамыз.', info: 'Әзірге форма тест режимінде жұмыс істейді. Деректер браузерде локалды сақталады.',
    topics: ['Мектеп деректерін жаңарту', 'Мектеп қосу', 'Ынтымақтастық', 'Сайт бойынша сұрақ', 'Басқа'], footerDescription: 'Отбасы саналы таңдау жасайтын Астана мектептерінің сараптамалық каталогы.',
    footerColumns: [
      ['Навигация', [['Мектептер каталогы', '/catalog'], ['Мектепке дайындық', '/school-readiness'], ['Таңдаулылар', '/favorites']]],
      ['Ата-аналарға', [['Мектепті қалай таңдау керек', '/how-to-choose-school'], ['Сұрақтар мен жауаптар', '/school-readiness'], ['Пайдалы мақалалар', '/how-to-choose-school']]],
      ['Жоба туралы', [['Біз туралы', '/about'], ['Мектеп қосу', '/contribute'], ['Байланыс', '/contacts']]]
    ]
  },
  en: {
    navLabel: 'Site navigation', catalogLink: 'Catalog', readinessLink: 'School readiness', aboutLink: 'About', contactsLink: 'Contacts', languageSwitcherLabel: 'Choose interface language',
    title: 'Contacts', subtitle: 'Contact the BilimChoice team about partnerships, data updates, or feedback.',
    name: 'Name', email: 'Email', phone: 'Phone', topic: 'Topic', message: 'Message', button: 'Send message',
    success: 'Thank you! The message has been saved. We will contact you after request processing is connected.', info: 'For now, the form works in test mode. Data is stored locally in your browser.',
    topics: ['Update school data', 'Add a school', 'Partnership', 'Website question', 'Other'], footerDescription: 'An expert Astana school catalog for informed family decisions.',
    footerColumns: [
      ['Navigation', [['School catalog', '/catalog'], ['School readiness', '/school-readiness'], ['Favorites', '/favorites']]],
      ['For parents', [['How to choose a school', '/how-to-choose-school'], ['Questions and answers', '/school-readiness'], ['Helpful articles', '/how-to-choose-school']]],
      ['About', [['About us', '/about'], ['Add a school', '/contribute'], ['Contacts', '/contacts']]]
    ]
  }
};

function withLanguage(href, language) { return `${href}${href.includes('?') ? '&' : '?'}lang=${language}`; }

function LanguageSwitcher({ currentLanguage, onLanguageChange, t }) {
  return <div className="language-switcher" aria-label={t.languageSwitcherLabel}>{languageOptions.map(({ code, label }) => <button key={code} type="button" className={currentLanguage === code ? 'language-switcher__button language-switcher__button--active' : 'language-switcher__button'} aria-pressed={currentLanguage === code} onClick={() => onLanguageChange(code)}>{label}</button>)}</div>;
}

function SocialIcon({ name }) {
  const common = { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' };
  if (name === 'Instagram') return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.8"/><path d="M16.8 7.2h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>;
  if (name === 'Telegram') return <svg {...common}><path d="M20 5 4 11.7l5.8 2.1M20 5l-3 14-7.2-5.2M20 5 9.8 13.8M9.8 13.8 9.5 19l3-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  return <svg {...common}><path d="M6.4 18.1A8 8 0 1 1 9 19.5L5 20.5l1.4-2.4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9.4 8.8c.2 3 2.4 5.1 5.5 5.8l1-1.6-1.8-1-1 1c-1.2-.5-2-1.3-2.5-2.5l1-1-.9-1.8-1.3 1.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function SocialLinks() { return <div className="social-links"><a href="#" aria-label="Instagram"><SocialIcon name="Instagram" /></a><a href="#" aria-label="Telegram"><SocialIcon name="Telegram" /></a><a href="#" aria-label="WhatsApp"><SocialIcon name="WhatsApp" /></a></div>; }

export default function ContactsPage() {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [form, setForm] = useState({ name: '', email: '', phone: '', topic: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const t = translations[currentLanguage];

  useEffect(() => {
    try {
      const urlLanguage = new URLSearchParams(window.location.search).get('lang');
      const storedLanguage = window.localStorage.getItem(languageStorageKey);
      const nextLanguage = translations[urlLanguage] ? urlLanguage : storedLanguage;
      if (nextLanguage && translations[nextLanguage]) setCurrentLanguage(nextLanguage);
    } catch { setCurrentLanguage(defaultLanguage); }
  }, []);

  useEffect(() => { setForm((prev) => ({ ...prev, topic: translations[currentLanguage].topics[0] })); }, [currentLanguage]);

  const updateLanguage = (language) => { setCurrentLanguage(language); try { window.localStorage.setItem(languageStorageKey, language); } catch {} };
  const updateField = (field) => (event) => { setForm((prev) => ({ ...prev, [field]: event.target.value })); setSubmitted(false); };
  const submitForm = (event) => {
    event.preventDefault();
    const payload = { ...form, language: currentLanguage, submittedAt: new Date().toISOString() };
    try {
      const stored = JSON.parse(window.localStorage.getItem(contactMessagesStorageKey) || '[]');
      window.localStorage.setItem(contactMessagesStorageKey, JSON.stringify([payload, ...stored]));
    } catch {
      window.localStorage.setItem(contactMessagesStorageKey, JSON.stringify([payload]));
    }
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', topic: t.topics[0], message: '' });
  };

  return <main>
    <header className="site-header">
      <a className="site-header__brand" href={withLanguage('/', currentLanguage)} aria-label={brand.name}>{brand.name}</a>
      <nav className="site-header__nav" aria-label={t.navLabel}>
        <a className="site-header__link" href={withLanguage('/catalog', currentLanguage)}>{t.catalogLink}</a><a className="site-header__link" href={withLanguage('/school-readiness', currentLanguage)}>{t.readinessLink}</a><a className="site-header__link" href={withLanguage('/about', currentLanguage)}>{t.aboutLink}</a><a className="site-header__link" href={withLanguage('/contacts', currentLanguage)}>{t.contactsLink}</a>
      </nav>
      <div className="site-header__actions"><LanguageSwitcher currentLanguage={currentLanguage} onLanguageChange={updateLanguage} t={t} /></div>
    </header>
    <section className="contacts-page" aria-labelledby="contacts-title">
      <div className="contacts-page__intro"><p className="contacts-page__kicker">BilimChoice</p><h1 id="contacts-title">{t.title}</h1><p>{t.subtitle}</p><div className="contacts-info-card">{t.info}</div><SocialLinks /></div>
      <form className="contact-form" onSubmit={submitForm}>
        <label><span>{t.name}</span><input value={form.name} onChange={updateField('name')} required /></label>
        <label><span>{t.email}</span><input type="email" value={form.email} onChange={updateField('email')} required /></label>
        <label><span>{t.phone}</span><input type="tel" value={form.phone} onChange={updateField('phone')} /></label>
        <label><span>{t.topic}</span><select value={form.topic} onChange={updateField('topic')}>{t.topics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}</select></label>
        <label className="contact-form__message"><span>{t.message}</span><textarea value={form.message} onChange={updateField('message')} rows="6" required /></label>
        {submitted && <p className="contact-form__success" role="status">{t.success}</p>}
        <button type="submit">{t.button}</button>
      </form>
    </section>
    <footer className="site-footer site-footer--simple" id="footer"><div className="site-footer__brand"><strong>{brand.name}</strong><p>{t.footerDescription}</p><SocialLinks /></div>{t.footerColumns.map(([title, links]) => <nav className="footer-links" key={title} aria-label={title}><h3>{title}</h3>{links.map(([label, href]) => <a key={label} href={withLanguage(href, currentLanguage)}>{label}</a>)}</nav>)}</footer>
  </main>;
}
