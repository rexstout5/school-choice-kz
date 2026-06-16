'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getLocalizedEnumLabel,
  getLocalizedSchoolValue,
  schoolDistricts,
  schoolLanguages,
  schools,
  schoolTypes
} from '../src/data/schools.js';
import { doesSchoolMatchCatalogFilters } from '../src/lib/schoolFilters.js';
import { priceOptionValues } from '../src/lib/priceFilters.js';
import FavoriteButton from '../src/components/FavoriteButton.jsx';
import SchoolImageWithFallback from '../src/components/SchoolImageWithFallback.jsx';
import { createSchoolImagePlaceholder } from '../src/utils/schoolImages.js';
import { formatAverageRating, getAverageRating, getSchoolReviews, getStoredReviewsBySchool } from '../src/lib/reviews.js';

const initialFilters = {
  type: 'all',
  language: 'all',
  district: 'all',
  maxPrice: 'all'
};

const initialFeedback = {
  childAge: '',
  district: '',
  importantInformation: '',
  missingInformation: ''
};

const feedbackStorageKey = 'school-choice-kz-feedback';
const languageStorageKey = 'school-choice-kz-language';
const comparisonStorageKey = 'school-choice-kz-comparison';
const maxComparedSchools = 3;
const defaultLanguage = 'ru';


const getSchoolCardImage = (school, schoolName) => school.main_image_url || school.main_image?.src || createSchoolImagePlaceholder(schoolName, 'card');

const languageOptions = [
  { code: 'ru', label: 'RU' },
  { code: 'kz', label: 'KZ' },
  { code: 'en', label: 'EN' }
];

const translations = {
  ru: {
    pageTitle: 'Выбор школы в Казахстане',
    languageSwitcherLabel: 'Выберите язык интерфейса',
    favoritesLink: 'Избранное',
    favorite: {
      add: 'Добавить в избранное',
      remove: 'В избранном'
    },
    heroKicker: 'Выбор школы в Казахстане',
    heroTitle: 'Изучите школы Астаны в удобном формате',
    heroDescription:
      'Сравнивайте школы Астаны по району, языку обучения, типу школы, статусу проверки и ключевым программам на основе единой модели данных.',
    heroCta: 'Подобрать школу',
    astanaSchools: 'школ Астаны',
    filtersAria: 'Фильтры школ',
    all: 'Все',
    type: 'Тип',
    language: 'Язык',
    district: 'Район',
    maxMonthlyPrice: 'Стоимость обучения',
    priceOptions: {
      all: 'Все',
      free: 'Только бесплатные',
      paid_only: 'Только платные',
      up_to_200000: 'Платные до 200 000 ₸',
      range_200000_400000: 'Платные 200 000–400 000 ₸',
      range_400000_800000: 'Платные 400 000–800 000 ₸',
      range_800000_plus: 'Платные от 800 000 ₸',
      unknown_price: 'Стоимость неизвестна'
    },
    schoolsMatch: (count) => `${count} ${pluralizeRu(count, ['школа подходит', 'школы подходят', 'школ подходят'])} под фильтры`,
    resetFilters: 'Сбросить фильтры',
    filteredSchoolsAria: 'Отфильтрованные школы',
    paginationAria: 'Навигация по страницам школ',
    previousPage: 'Назад',
    nextPage: 'Вперед',
    pageLabel: (page) => `Страница ${page}`,
    pageStatus: (current, total) => `Страница ${current} из ${total}`,
    noResultsTitle: 'Школы не найдены',
    noResultsDescription: 'Попробуйте изменить район, язык обучения, тип школы или ограничение по цене.',
    schoolCard: {
      officialName: 'Официальное название',
      schoolType: 'Тип школы',
      language: 'Язык',
      verification: 'Проверка',
      tuitionFee: 'Стоимость обучения',
      priceStatus: 'Статус цены',
      dataStatus: 'Статус данных',
      admissionTest: 'Вступительный тест',
      afterSchoolProgram: 'Продленка',
      schoolBus: 'Школьный автобус',
      classSize: 'Размер класса',
      admissionRequirements: 'Требования к поступлению',
      rating: 'Рейтинг',
      address: 'Адрес',
      programsAria: (name) => `Программы школы ${name}`,
      website: 'Сайт',
      details: 'Подробнее'
    },
    notYetRated: 'Пока нет оценки',
    freePublicSchool: 'Бесплатная государственная школа',
    priceUnknown: 'Стоимость уточняется',
    perMonth: 'в месяц',
    compare: {
      select: 'Сравнить',
      selected: 'Выбрано для сравнения',
      limitReached: 'Можно выбрать до 3 школ',
      barTitle: 'Сравнение школ',
      barSummary: (count) => `${count} из ${maxComparedSchools} выбрано`,
      remove: 'Удалить',
      compareSchools: 'Сравнить школы',
      clear: 'Очистить'
    },
    feedback: {
      kicker: 'Помогите улучшить сайт',
      title: 'Расскажите, что нужно семьям дальше',
      description:
        'Ваши ответы пока сохраняются локально в этом браузере, чтобы команда могла протестировать форму обратной связи перед добавлением базы данных.',
      savedResponses: (count) => `${count} ${pluralizeRu(count, ['локально сохраненный ответ', 'локально сохраненных ответа', 'локально сохраненных ответов'])}`,
      childAge: 'Возраст ребенка',
      childAgePlaceholder: 'Например: 7',
      district: 'Район',
      selectDistrict: 'Выберите район',
      importantInformation: 'Какая информация о школах для вас наиболее важна?',
      importantInformationPlaceholder: 'Например: поступление, опыт учителей, транспорт, оплата...',
      missingInformation: 'Чего не хватает на этом сайте?',
      missingInformationPlaceholder: 'Расскажите, что упростит выбор школы.',
      submit: 'Сохранить отзыв локально',
      success: 'Спасибо — ваш отзыв сохранен в этом браузере.',
      error: 'К сожалению, браузер не смог сохранить отзыв локально.'
    },
    footer: 'Проект помогает семьям сравнивать школы Астаны. Данные можно расширять новыми городами, отзывами и деталями поступления.'
  },
  kz: {
    pageTitle: 'Қазақстандағы мектеп таңдауы',
    languageSwitcherLabel: 'Интерфейс тілін таңдаңыз',
    favoritesLink: 'Таңдаулылар',
    favorite: {
      add: 'Таңдаулыға қосу',
      remove: 'Таңдаулыда'
    },
    heroKicker: 'Қазақстандағы мектеп таңдауы',
    heroTitle: 'Астана мектептерін ыңғайлы форматта зерттеңіз',
    heroDescription:
      'Астана мектептерін аудан, оқыту тілі, мектеп түрі, тексеру мәртебесі және негізгі бағдарламалар бойынша бірыңғай деректер моделі арқылы салыстырыңыз.',
    heroCta: 'Мектеп таңдау',
    astanaSchools: 'Астана мектебі',
    filtersAria: 'Мектеп сүзгілері',
    all: 'Барлығы',
    type: 'Түрі',
    language: 'Тілі',
    district: 'Аудан',
    maxMonthlyPrice: 'Айлық ең жоғары баға',
    priceOptions: {
      all: 'Барлығы',
      free: 'Тек тегін',
      paid_only: 'Тек ақылы',
      up_to_200000: 'Ақылы 200 000 ₸ дейін',
      range_200000_400000: 'Ақылы 200 000–400 000 ₸',
      range_400000_800000: 'Ақылы 400 000–800 000 ₸',
      range_800000_plus: 'Ақылы 800 000 ₸ бастап',
      unknown_price: 'Бағасы белгісіз'
    },
    schoolsMatch: (count) => `${count} мектеп сүзгілерге сәйкес келеді`,
    resetFilters: 'Сүзгілерді тазалау',
    filteredSchoolsAria: 'Сүзілген мектептер',
    paginationAria: 'Мектеп беттері бойынша навигация',
    previousPage: 'Алдыңғы',
    nextPage: 'Келесі',
    pageLabel: (page) => `${page}-бет`,
    pageStatus: (current, total) => `${current}/${total} бет`,
    noResultsTitle: 'Мектептер табылмады',
    noResultsDescription: 'Ауданды, оқыту тілін, мектеп түрін немесе баға шектеуін өзгертіп көріңіз.',
    schoolCard: {
      officialName: 'Ресми атауы',
      schoolType: 'Мектеп түрі',
      language: 'Тілі',
      verification: 'Тексеру',
      tuitionFee: 'Оқу ақысы',
      priceStatus: 'Баға мәртебесі',
      dataStatus: 'Дерек мәртебесі',
      admissionTest: 'Қабылдау тесті',
      afterSchoolProgram: 'Сабақтан кейінгі бағдарлама',
      schoolBus: 'Мектеп автобусы',
      classSize: 'Сынып көлемі',
      admissionRequirements: 'Қабылдау талаптары',
      rating: 'Рейтинг',
      address: 'Мекенжай',
      programsAria: (name) => `${name} бағдарламалары`,
      website: 'Сайт',
      details: 'Толығырақ'
    },
    notYetRated: 'Әзірге баға жоқ',
    freePublicSchool: 'Тегін мемлекеттік мектеп',
    priceUnknown: 'Құны нақтыланады',
    perMonth: 'айына',
    compare: {
      select: 'Салыстыру',
      selected: 'Салыстыруға таңдалды',
      limitReached: '3 мектепке дейін таңдауға болады',
      barTitle: 'Мектептерді салыстыру',
      barSummary: (count) => `${count}/${maxComparedSchools} таңдалды`,
      remove: 'Жою',
      compareSchools: 'Мектептерді салыстыру',
      clear: 'Тазалау'
    },
    feedback: {
      kicker: 'Сайтты жақсартуға көмектесіңіз',
      title: 'Отбасыларға тағы не қажет екенін айтыңыз',
      description:
        'Жауаптарыңыз әзірше осы браузерде жергілікті сақталады, осылайша команда дерекқор қоспас бұрын кері байланыс формасын тексере алады.',
      savedResponses: (count) => `${count} жергілікті сақталған жауап`,
      childAge: 'Баланың жасы',
      childAgePlaceholder: 'Мысалы: 7',
      district: 'Аудан',
      selectDistrict: 'Ауданды таңдаңыз',
      importantInformation: 'Мектептер туралы қандай ақпарат сіз үшін ең маңызды?',
      importantInformationPlaceholder: 'Мысалы: қабылдау, мұғалімдер тәжірибесі, көлік, төлемдер...',
      missingInformation: 'Бұл сайтта не жетіспейді?',
      missingInformationPlaceholder: 'Мектеп таңдауды не жеңілдететінін айтыңыз.',
      submit: 'Пікірді жергілікті сақтау',
      success: 'Рақмет — пікіріңіз осы браузерде сақталды.',
      error: 'Кешіріңіз, браузер пікірді жергілікті сақтай алмады.'
    },
    footer: 'Бұл жоба отбасыларға Астана мектептерін салыстыруға көмектеседі. Деректерді жаңа қалалармен, пікірлермен және қабылдау мәліметтерімен кеңейтуге болады.'
  },
  en: {
    pageTitle: 'School Choice Kazakhstan',
    languageSwitcherLabel: 'Choose interface language',
    favoritesLink: 'Favorites',
    favorite: {
      add: 'Add to favorites',
      remove: 'Saved to favorites'
    },
    heroKicker: 'School Choice Kazakhstan',
    heroTitle: 'Explore structured Astana school options',
    heroDescription:
      'Compare Astana schools by district, instruction language, school type, verification status, and signature programs using a reusable Kazakhstan school data model.',
    heroCta: 'Find a school',
    astanaSchools: 'Astana schools',
    filtersAria: 'School filters',
    all: 'All',
    type: 'Type',
    language: 'Language',
    district: 'District',
    maxMonthlyPrice: 'Tuition fee',
    priceOptions: {
      all: 'All',
      free: 'Free only',
      paid_only: 'Paid only',
      up_to_200000: 'Paid up to 200,000 KZT',
      range_200000_400000: 'Paid 200,000–400,000 KZT',
      range_400000_800000: 'Paid 400,000–800,000 KZT',
      range_800000_plus: 'Paid 800,000+ KZT',
      unknown_price: 'Unknown price'
    },
    schoolsMatch: (count) => `${count} ${count === 1 ? 'school matches' : 'schools match'} your filters`,
    resetFilters: 'Reset filters',
    filteredSchoolsAria: 'Filtered schools',
    paginationAria: 'School pages navigation',
    previousPage: 'Previous',
    nextPage: 'Next',
    pageLabel: (page) => `Page ${page}`,
    pageStatus: (current, total) => `Page ${current} of ${total}`,
    noResultsTitle: 'No schools found',
    noResultsDescription: 'Try changing the district, instruction language, school type, or price limit.',
    schoolCard: {
      officialName: 'Official name',
      schoolType: 'School type',
      language: 'Language',
      verification: 'Verification',
      tuitionFee: 'Tuition fee',
      priceStatus: 'Price status',
      dataStatus: 'Data status',
      admissionTest: 'Admission test',
      afterSchoolProgram: 'After-school program',
      schoolBus: 'School bus',
      classSize: 'Class size',
      admissionRequirements: 'Admission requirements',
      rating: 'Rating',
      address: 'Address',
      programsAria: (name) => `${name} programs`,
      website: 'Website',
      details: 'Details'
    },
    notYetRated: 'Not yet rated',
    freePublicSchool: 'Free public school',
    priceUnknown: 'Tuition to be confirmed',
    perMonth: 'month',
    compare: {
      select: 'Compare',
      selected: 'Selected for comparison',
      limitReached: 'Select up to 3 schools',
      barTitle: 'School comparison',
      barSummary: (count) => `${count} of ${maxComparedSchools} selected`,
      remove: 'Remove',
      compareSchools: 'Compare schools',
      clear: 'Clear'
    },
    feedback: {
      kicker: 'Help improve this website',
      title: 'Tell us what families need next',
      description:
        'Your answers are stored locally in this browser for now, so the team can test the feedback flow before adding a database.',
      savedResponses: (count) => `${count} locally saved ${count === 1 ? 'response' : 'responses'}`,
      childAge: 'Child age',
      childAgePlaceholder: 'Example: 7',
      district: 'District',
      selectDistrict: 'Select a district',
      importantInformation: 'What information about schools is most important to you?',
      importantInformationPlaceholder: 'Example: admissions, teacher experience, transport, fees...',
      missingInformation: 'What is missing on this website?',
      missingInformationPlaceholder: 'Tell us what would make school choice easier.',
      submit: 'Save feedback locally',
      success: 'Thank you — your feedback has been saved in this browser.',
      error: 'Sorry, this browser could not save feedback locally.'
    },
    footer: 'This project helps families compare Astana schools. The data can expand with new cities, reviews, and admissions details.'
  }
};

function pluralizeRu(count, forms) {
  const absoluteCount = Math.abs(count) % 100;
  const lastDigit = absoluteCount % 10;

  if (absoluteCount > 10 && absoluteCount < 20) {
    return forms[2];
  }

  if (lastDigit > 1 && lastDigit < 5) {
    return forms[1];
  }

  if (lastDigit === 1) {
    return forms[0];
  }

  return forms[2];
}

const getStoredFeedback = () => {
  try {
    const storedFeedback = window.localStorage.getItem(feedbackStorageKey);
    const parsedFeedback = storedFeedback ? JSON.parse(storedFeedback) : [];
    return Array.isArray(parsedFeedback) ? parsedFeedback : [];
  } catch {
    return [];
  }
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

const schoolsPerPage = 20;

const getEnumOptionLabels = (dictionaryName, options, language) =>
  Object.fromEntries(options.map((option) => [option, getLocalizedEnumLabel(dictionaryName, option, language)]));

const formatPhoneLink = (phone) => phone.replace(/[^+\d]/g, '');

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

function FilterControl({ id, label, value, options, allLabel, optionLabels = {}, onChange }) {
  return (
    <label className="filter-control" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabels[option] ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}

function PriceFilter({ value, onChange, t }) {
  return (
    <label className="filter-control" htmlFor="price">
      <span>{t.maxMonthlyPrice}</span>
      <select id="price" value={value} onChange={(event) => onChange(event.target.value)}>
        {priceOptionValues.map((optionValue) => (
          <option key={optionValue} value={optionValue}>
            {t.priceOptions[optionValue]}
          </option>
        ))}
      </select>
    </label>
  );
}

function SchoolCard({ school, moneyFormatter, t, currentLanguage, averageRating, isCompared, isCompareDisabled, onCompareToggle }) {
  const localizedName = getLocalizedSchoolValue(school.name, currentLanguage);
  const localizedSchoolType = getLocalizedSchoolValue(school.school_type, currentLanguage);
  const localizedLanguages = getLocalizedSchoolValue(school.languages, currentLanguage);
  const localizedDistrict = getLocalizedEnumLabel('districts', school.district, currentLanguage);
  const cardImage = getSchoolCardImage(school, localizedName);
  const hasSchoolImage = Boolean(school.main_image_url || school.main_image?.src);
  const formatPrice = (price) => {
    if (price === null || price === undefined) {
      return t.priceUnknown;
    }

    return price === 0 ? t.freePublicSchool : `${moneyFormatter.format(price)} / ${t.perMonth}`;
  };

  return (
    <article className="school-card school-card--compact">
      <div className={hasSchoolImage ? 'school-card__image' : 'school-card__image school-card__image--placeholder'}>
        <SchoolImageWithFallback src={cardImage} alt={localizedName} schoolName={localizedName} loading="lazy" decoding="async" size="card" />
      </div>
      <div className="school-card__header">
        <div>
          <p className="school-card__eyebrow">{localizedDistrict}</p>
          <h2>{localizedName}</h2>
        </div>
        <div className="school-card__header-actions">
          <FavoriteButton schoolId={school.id} labels={t.favorite} />
          <span className={`badge badge--${school.type}`}>{getLocalizedEnumLabel('schoolTypes', school.type, currentLanguage)}</span>
        </div>
      </div>

      <dl className="school-card__facts school-card__facts--compact">
        {[
          [t.district, localizedDistrict],
          [t.schoolCard.schoolType, localizedSchoolType],
          [t.schoolCard.language, localizedLanguages],
          [t.schoolCard.tuitionFee, formatPrice(school.tuition_fee)],
          [t.schoolCard.rating, averageRating === null ? t.notYetRated : `${formatAverageRating(averageRating)} / 5`],
          [t.schoolCard.dataStatus, getLocalizedEnumLabel('dataStatuses', school.data_status, currentLanguage)]
        ].map(([term, detail]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{detail}</dd>
          </div>
        ))}
      </dl>

      <div className="school-card__compare">
        <label className={isCompareDisabled ? 'compare-toggle compare-toggle--disabled' : 'compare-toggle'}>
          <input
            type="checkbox"
            checked={isCompared}
            disabled={isCompareDisabled}
            onChange={() => onCompareToggle(school.id)}
          />
          <span>{isCompared ? t.compare.selected : t.compare.select}</span>
        </label>
        {isCompareDisabled ? <small>{t.compare.limitReached}</small> : null}
      </div>

      <div className="school-card__contact school-card__contact--details-only">
        <a className="button-link" href={`/schools/${school.slug ?? school.id}?lang=${currentLanguage}`}>{t.schoolCard.details}</a>
      </div>
    </article>
  );
}


function ComparisonBar({ selectedSchools, currentLanguage, onRemove, onClear, t }) {
  if (selectedSchools.length === 0) {
    return null;
  }

  return (
    <aside className="comparison-bar" aria-label={t.compare.barTitle}>
      <div className="comparison-bar__summary">
        <strong>{t.compare.barTitle}</strong>
        <span>{t.compare.barSummary(selectedSchools.length)}</span>
      </div>
      <div className="comparison-bar__schools">
        {selectedSchools.map((school) => (
          <span className="comparison-chip" key={school.id}>
            {getLocalizedSchoolValue(school.name, currentLanguage)}
            <button type="button" onClick={() => onRemove(school.id)} aria-label={`${t.compare.remove}: ${getLocalizedSchoolValue(school.name, currentLanguage)}`}>
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="comparison-bar__actions">
        <a className="button-link" href={`/compare?lang=${currentLanguage}`}>{t.compare.compareSchools}</a>
        <button type="button" className="button-secondary" onClick={onClear}>{t.compare.clear}</button>
      </div>
    </aside>
  );
}


function Pagination({ currentPage, totalPages, onPageChange, t }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label={t.paginationAria}>
      <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        {t.previousPage}
      </button>

      <div className="pagination__pages">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={pageNumber === currentPage ? 'pagination__page pagination__page--active' : 'pagination__page'}
            aria-current={pageNumber === currentPage ? 'page' : undefined}
            aria-label={t.pageLabel(pageNumber)}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <button type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        {t.nextPage}
      </button>
      <span className="pagination__status">{t.pageStatus(currentPage, totalPages)}</span>
    </nav>
  );
}

function FeedbackForm({ t, currentLanguage }) {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [responseCount, setResponseCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    setResponseCount(getStoredFeedback().length);
  }, []);

  const updateFeedback = (name, value) => {
    setFeedback((currentFeedback) => ({
      ...currentFeedback,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedFeedback = {
      childAge: feedback.childAge.trim(),
      district: feedback.district,
      importantInformation: feedback.importantInformation.trim(),
      missingInformation: feedback.missingInformation.trim()
    };

    const nextResponses = [
      ...getStoredFeedback(),
      {
        ...trimmedFeedback,
        submittedAt: new Date().toISOString()
      }
    ];

    try {
      window.localStorage.setItem(feedbackStorageKey, JSON.stringify(nextResponses));
      setResponseCount(nextResponses.length);
      setFeedback(initialFeedback);
      setStatusMessage(t.feedback.success);
    } catch {
      setStatusMessage(t.feedback.error);
    }
  };

  return (
    <section className="feedback" aria-labelledby="feedback-title">
      <div className="feedback__intro">
        <p className="feedback__kicker">{t.feedback.kicker}</p>
        <h2 id="feedback-title">{t.feedback.title}</h2>
        <p>{t.feedback.description}</p>
        <p className="feedback__count">{t.feedback.savedResponses(responseCount)}</p>
      </div>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <label htmlFor="child-age">
          <span>{t.feedback.childAge}</span>
          <input
            id="child-age"
            name="childAge"
            type="number"
            min="0"
            max="18"
            inputMode="numeric"
            value={feedback.childAge}
            onChange={(event) => updateFeedback('childAge', event.target.value)}
            placeholder={t.feedback.childAgePlaceholder}
            required
          />
        </label>

        <label htmlFor="feedback-district">
          <span>{t.feedback.district}</span>
          <select
            id="feedback-district"
            name="district"
            value={feedback.district}
            onChange={(event) => updateFeedback('district', event.target.value)}
            required
          >
            <option value="">{t.feedback.selectDistrict}</option>
            {schoolDistricts.map((district) => (
              <option key={district} value={district}>
                {getLocalizedEnumLabel('districts', district, currentLanguage)}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="important-information">
          <span>{t.feedback.importantInformation}</span>
          <textarea
            id="important-information"
            name="importantInformation"
            value={feedback.importantInformation}
            onChange={(event) => updateFeedback('importantInformation', event.target.value)}
            placeholder={t.feedback.importantInformationPlaceholder}
            rows="4"
            required
          />
        </label>

        <label htmlFor="missing-information">
          <span>{t.feedback.missingInformation}</span>
          <textarea
            id="missing-information"
            name="missingInformation"
            value={feedback.missingInformation}
            onChange={(event) => updateFeedback('missingInformation', event.target.value)}
            placeholder={t.feedback.missingInformationPlaceholder}
            rows="4"
            required
          />
        </label>

        <div className="feedback-form__footer">
          <button type="submit">{t.feedback.submit}</button>
          <p role="status" aria-live="polite">
            {statusMessage}
          </p>
        </div>
      </form>
    </section>
  );
}

export default function Home() {
  const [filters, setFilters] = useState(initialFilters);
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [currentPage, setCurrentPage] = useState(1);
  const [comparedSchoolIds, setComparedSchoolIds] = useState([]);
  const [reviewsBySchool, setReviewsBySchool] = useState({});

  useEffect(() => {
    setComparedSchoolIds(getStoredComparedSchoolIds());
    setReviewsBySchool(getStoredReviewsBySchool());
  }, []);

  useEffect(() => {
    try {
      const urlLanguage = new URLSearchParams(window.location.search).get('lang');
      const storedLanguage = window.localStorage.getItem(languageStorageKey);
      const nextLanguage = translations[urlLanguage] ? urlLanguage : storedLanguage;

      if (nextLanguage && translations[nextLanguage]) {
        setCurrentLanguage(nextLanguage);
      }
    } catch {
      setCurrentLanguage(defaultLanguage);
    }
  }, []);

  const t = translations[currentLanguage];
  const districtOptionLabels = useMemo(() => getEnumOptionLabels('districts', schoolDistricts, currentLanguage), [currentLanguage]);

  const moneyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(currentLanguage === 'en' ? 'en-US' : currentLanguage === 'kz' ? 'kk-KZ' : 'ru-RU', {
        style: 'currency',
        currency: 'KZT',
        currencyDisplay: 'narrowSymbol',
        maximumFractionDigits: 0
      }),
    [currentLanguage]
  );

  const filteredSchools = useMemo(
    () => schools.filter((school) => doesSchoolMatchCatalogFilters(school, filters)),
    [filters]
  );

  const totalPages = Math.max(1, Math.ceil(filteredSchools.length / schoolsPerPage));
  const visibleSchools = filteredSchools.slice((currentPage - 1) * schoolsPerPage, currentPage * schoolsPerPage);
  const selectedSchools = comparedSchoolIds
    .map((schoolId) => schools.find((school) => school.id === schoolId))
    .filter(Boolean);

  const updateFilter = (name, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const updateLanguage = (language) => {
    setCurrentLanguage(language);

    try {
      window.localStorage.setItem(languageStorageKey, language);
    } catch {
      // Language still changes for the current session if localStorage is unavailable.
    }
  };


  const updateComparedSchoolIds = (updater) => {
    setComparedSchoolIds((currentComparedSchoolIds) => {
      const nextComparedSchoolIds = normalizeComparedSchoolIds(
        typeof updater === 'function' ? updater(currentComparedSchoolIds) : updater
      );
      saveComparedSchoolIds(nextComparedSchoolIds);
      return nextComparedSchoolIds;
    });
  };

  const toggleComparedSchool = (schoolId) => {
    updateComparedSchoolIds((currentComparedSchoolIds) => {
      if (currentComparedSchoolIds.includes(schoolId)) {
        return currentComparedSchoolIds.filter((currentSchoolId) => currentSchoolId !== schoolId);
      }

      if (currentComparedSchoolIds.length >= maxComparedSchools) {
        return currentComparedSchoolIds;
      }

      return [...currentComparedSchoolIds, schoolId];
    });
  };

  const removeComparedSchool = (schoolId) => {
    updateComparedSchoolIds((currentComparedSchoolIds) => currentComparedSchoolIds.filter((currentSchoolId) => currentSchoolId !== schoolId));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const updatePage = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <main>
      <header className="site-header">
        <a className="site-header__brand" href="#top" aria-label={t.pageTitle}>
          {t.pageTitle}
        </a>
        <div className="site-header__actions">
          <a className="site-header__link" href={`/favorites?lang=${currentLanguage}`}>♡ {t.favoritesLink}</a>
          <LanguageSwitcher currentLanguage={currentLanguage} onLanguageChange={updateLanguage} t={t} />
        </div>
      </header>

      <section className="hero" id="top">
        <div>
          <p className="hero__kicker">{t.heroKicker}</p>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroDescription}</p>
          <a className="hero__cta" href={`/quiz?lang=${currentLanguage}`}>{t.heroCta}</a>
        </div>
        <div className="hero__stat">
          <strong>{schools.length}</strong>
          <span>{t.astanaSchools}</span>
        </div>
      </section>

      <section className="filters" aria-label={t.filtersAria}>
        <FilterControl
          id="type"
          label={t.type}
          value={filters.type}
          options={schoolTypes}
          allLabel={t.all}
          optionLabels={getEnumOptionLabels('schoolTypes', schoolTypes, currentLanguage)}
          onChange={(value) => updateFilter('type', value)}
        />
        <FilterControl
          id="language"
          label={t.language}
          value={filters.language}
          options={schoolLanguages}
          allLabel={t.all}
          optionLabels={getEnumOptionLabels('instructionLanguages', schoolLanguages, currentLanguage)}
          onChange={(value) => updateFilter('language', value)}
        />
        <FilterControl
          id="district"
          label={t.district}
          value={filters.district}
          options={schoolDistricts}
          allLabel={t.all}
          optionLabels={districtOptionLabels}
          onChange={(value) => updateFilter('district', value)}
        />
        <PriceFilter value={filters.maxPrice} onChange={(value) => updateFilter('maxPrice', value)} t={t} />
      </section>

      <section className="results-heading" aria-live="polite">
        <h2>{t.schoolsMatch(filteredSchools.length)}</h2>
        <button type="button" onClick={resetFilters}>
          {t.resetFilters}
        </button>
      </section>

      {filteredSchools.length > 0 ? (
        <>
          <section className="school-grid" aria-label={t.filteredSchoolsAria}>
            {visibleSchools.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                moneyFormatter={moneyFormatter}
                t={t}
                currentLanguage={currentLanguage}
                averageRating={getAverageRating(getSchoolReviews(reviewsBySchool, school.id))}
                isCompared={comparedSchoolIds.includes(school.id)}
                isCompareDisabled={comparedSchoolIds.length >= maxComparedSchools && !comparedSchoolIds.includes(school.id)}
                onCompareToggle={toggleComparedSchool}
              />
            ))}
          </section>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={updatePage} t={t} />
        </>
      ) : (
        <section className="empty-state" aria-live="polite">
          <h2>{t.noResultsTitle}</h2>
          <p>{t.noResultsDescription}</p>
          <button type="button" onClick={resetFilters}>
            {t.resetFilters}
          </button>
        </section>
      )}

      <ComparisonBar
        selectedSchools={selectedSchools}
        currentLanguage={currentLanguage}
        onRemove={removeComparedSchool}
        onClear={() => updateComparedSchoolIds([])}
        t={t}
      />

      <FeedbackForm t={t} currentLanguage={currentLanguage} />

      <footer className="site-footer">
        <p>{t.footer}</p>
      </footer>
    </main>
  );
}
