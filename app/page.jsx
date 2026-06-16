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
import { formatAverageRating, getCombinedSchoolReviews, getSchoolReviews, getStoredReviewsBySchool, sortReviewsByLatest } from '../src/lib/reviews.js';
import { getRatingSummaryKey, getSchoolRatingStats, sortOptionValues, sortSchools } from '../src/lib/schoolDiscovery.js';
import { favoritesChangedEventName, getStoredFavoriteSchoolIds } from '../src/lib/favorites.js';
import { seoFooterLinks } from '../src/data/seoPages.js';

const initialFilters = {
  type: 'all',
  language: 'all',
  district: 'all',
  maxPrice: 'all'
};

const initialSort = 'highest_rated';

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

const homepageTranslations = {
  ru: {
    heroTitle: 'Подберите школу для ребенка в Астане за 2 минуты',
    heroDescription: 'Сравните государственные, частные и международные школы по району, языку обучения и стоимости.',
    heroCta: 'Подобрать школу',
    heroSecondaryCta: 'Смотреть каталог',
    heroStats: ['77+ школ', '5 районов', '4 языка обучения'],
    quickFiltersTitle: 'Быстрый старт',
    quickFilters: [
      ['🏫', 'Государственные школы', '/catalog?type=public'],
      ['🏫', 'Частные школы', '/catalog?type=private'],
      ['🌍', 'Международные школы', '/catalog?type=international'],
      ['🇬🇧', 'Английский язык', '/catalog?language=English'],
      ['💰', 'До 200 000 ₸', '/catalog?maxPrice=up_to_200000'],
      ['🎓', 'Подготовка к НИШ', '/catalog?query=nis']
    ],
    howTitle: 'Как это работает',
    howSteps: ['Ответьте на несколько вопросов', 'Получите список подходящих школ', 'Сравните варианты и сохраните избранное'],
    topTitle: 'Лучшие школы для старта',
    tabs: { public: 'Государственные', private: 'Частные', international: 'Международные' },
    toolsTitle: 'Инструменты для выбора',
    tools: [['📍','Карта школ','/map'], ['⚖','Сравнение школ','/compare'], ['❤️','Избранное','/favorites'], ['⭐','Рейтинг школ','/rankings']],
    mapTitle: 'Школы на карте', mapDescription: 'Посмотрите расположение школ рядом с домом, работой и удобными маршрутами.', mapCta: 'Открыть карту',
    reviewsTitle: 'Отзывы родителей', reviewsEmpty: 'Отзывы родителей скоро появятся.', reviewGrade: 'класс',
    articlesTitle: 'Полезные статьи', articles: [['Как выбрать школу в Астане','/how-to-choose-school'], ['Частная или государственная школа','/private-schools-astana'], ['Сколько стоит обучение в Астане','/best-schools-astana']],
  },
  kz: {
    heroTitle: 'Астанада балаңызға мектепті 2 минутта таңдаңыз',
    heroDescription: 'Мемлекеттік, жеке және халықаралық мектептерді аудан, оқу тілі және құны бойынша салыстырыңыз.',
    heroCta: 'Мектеп таңдау', heroSecondaryCta: 'Каталогты қарау', heroStats: ['77+ мектеп', '5 аудан', '4 оқу тілі'],
    quickFiltersTitle: 'Жылдам таңдау',
    quickFilters: [['🏫','Мемлекеттік мектептер','/catalog?type=public'], ['🏫','Жеке мектептер','/catalog?type=private'], ['🌍','Халықаралық мектептер','/catalog?type=international'], ['🇬🇧','Ағылшын тілі','/catalog?language=English'], ['💰','200 000 ₸ дейін','/catalog?maxPrice=up_to_200000'], ['🎓','НИМ-ге дайындық','/catalog?query=nis']],
    howTitle: 'Бұл қалай жұмыс істейді', howSteps: ['Бірнеше сұраққа жауап беріңіз', 'Сәйкес мектептер тізімін алыңыз', 'Нұсқаларды салыстырып, таңдаулыға сақтаңыз'],
    topTitle: 'Алғаш көруге болатын үздік мектептер', tabs: { public: 'Мемлекеттік', private: 'Жеке', international: 'Халықаралық' },
    toolsTitle: 'Таңдау құралдары', tools: [['📍','Мектептер картасы','/map'], ['⚖','Мектептерді салыстыру','/compare'], ['❤️','Таңдаулылар','/favorites'], ['⭐','Мектеп рейтингі','/rankings']],
    mapTitle: 'Мектептер картада', mapDescription: 'Үйге, жұмысқа және күнделікті бағыттарға жақын мектептердің орналасуын қараңыз.', mapCta: 'Картаны ашу',
    reviewsTitle: 'Ата-аналар пікірлері', reviewsEmpty: 'Ата-аналар пікірлері жақында пайда болады.', reviewGrade: 'сынып',
    articlesTitle: 'Пайдалы мақалалар', articles: [['Астанада мектепті қалай таңдау керек','/how-to-choose-school'], ['Жеке ме, мемлекеттік мектеп пе','/private-schools-astana'], ['Астанада оқу қанша тұрады','/best-schools-astana']],
  },
  en: {
    heroTitle: 'Find a school for your child in Astana in 2 minutes',
    heroDescription: 'Compare public, private, and international schools by district, language of instruction, and tuition.',
    heroCta: 'Find a school', heroSecondaryCta: 'View catalog', heroStats: ['77+ schools', '5 districts', '4 instruction languages'],
    quickFiltersTitle: 'Quick filters',
    quickFilters: [['🏫','Public schools','/catalog?type=public'], ['🏫','Private schools','/catalog?type=private'], ['🌍','International schools','/catalog?type=international'], ['🇬🇧','English language','/catalog?language=English'], ['💰','Up to 200,000 ₸','/catalog?maxPrice=up_to_200000'], ['🎓','NIS preparation','/catalog?query=nis']],
    howTitle: 'How it works', howSteps: ['Answer a few questions', 'Get a list of suitable schools', 'Compare options and save favorites'],
    topTitle: 'Top schools to start with', tabs: { public: 'Public', private: 'Private', international: 'International' },
    toolsTitle: 'Selection tools', tools: [['📍','School map','/map'], ['⚖','School comparison','/compare'], ['❤️','Favorites','/favorites'], ['⭐','School ratings','/rankings']],
    mapTitle: 'Schools on the map', mapDescription: 'See school locations near home, work, and daily routes.', mapCta: 'Open map',
    reviewsTitle: 'Parent reviews', reviewsEmpty: 'Parent reviews will appear soon.', reviewGrade: 'grade',
    articlesTitle: 'Helpful articles', articles: [['How to choose a school in Astana','/how-to-choose-school'], ['Private or public school','/private-schools-astana'], ['How much tuition costs in Astana','/best-schools-astana']],
  }
};


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
    mapLink: 'Карта',
    rankingsLink: 'Рейтинги',
    addSchoolLink: 'Добавить школу',
    catalogLink: 'Каталог',
    footerSeoLabel: 'Полезные страницы',
    favorite: {
      add: 'Добавить в избранное',
      remove: 'В избранном'
    },
    heroKicker: 'Выбор школы в Казахстане',
    heroTitle: 'Найдите школу, которая подходит вашей семье',
    heroDescription:
      'Ответьте на короткие вопросы, сохраните понравившиеся варианты и сравните школы Астаны по самым важным для родителей критериям.',
    heroCta: 'Пройти квиз подбора',
    astanaSchools: 'школ в каталоге',
    heroSecondaryCta: 'Смотреть каталог',
    heroNote: 'Персональный маршрут выбора: квиз → шорт-лист → сравнение.',
    assistantSteps: ['Укажите район и бюджет', 'Получите подходящие варианты', 'Сравните и сохраните школы'],
    stats: {
      title: 'Каталог, созданный для решения родителей',
      description: 'Мы показываем меньше шума и больше сигналов: район, язык, стоимость, отзывы и действия для следующего шага.',
      schools: 'школы',
      districts: 'районов',
      languages: 'языка обучения',
      favorites: 'в избранном'
    },
    catalogKicker: 'Каталог школ',
    filtersAria: 'Фильтры школ',
    all: 'Все',
    type: 'Тип',
    language: 'Язык',
    district: 'Район',
    maxMonthlyPrice: 'Стоимость обучения',
    sortBy: 'Сортировка',
    sortOptions: {
      highest_rated: 'Сначала с высоким рейтингом',
      lowest_tuition: 'Сначала низкая стоимость',
      highest_tuition: 'Сначала высокая стоимость',
      most_reviewed: 'Больше всего отзывов',
      alphabetical_az: 'По алфавиту А-Я'
    },
    reviewCount: (count) => `${count} ${pluralizeRu(count, ['отзыв', 'отзыва', 'отзывов'])}`,
    ratingSummary: { excellent: 'Отлично', good: 'Хорошо', average: 'Средне' },
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
    mapLink: 'Карта',
    rankingsLink: 'Рейтингтер',
    addSchoolLink: 'Мектеп қосу',
    catalogLink: 'Каталог',
    footerSeoLabel: 'Пайдалы беттер',
    favorite: {
      add: 'Таңдаулыға қосу',
      remove: 'Таңдаулыда'
    },
    heroKicker: 'Қазақстандағы мектеп таңдауы',
    heroTitle: 'Отбасыңызға сай мектепті табыңыз',
    heroDescription:
      'Қысқа сұрақтарға жауап беріңіз, ұнаған нұсқаларды сақтаңыз және Астана мектептерін ата-аналар үшін маңызды өлшемдер бойынша салыстырыңыз.',
    heroCta: 'Таңдау квизінен өту',
    astanaSchools: 'каталогтағы мектеп',
    heroSecondaryCta: 'Каталогты қарау',
    heroNote: 'Таңдаудың жеке маршруты: квиз → қысқа тізім → салыстыру.',
    assistantSteps: ['Аудан мен бюджетті белгілеңіз', 'Сәйкес нұсқаларды алыңыз', 'Мектептерді салыстырып сақтаңыз'],
    stats: {
      title: 'Ата-ананың шешіміне арналған каталог',
      description: 'Біз артық ақпаратты азайтып, маңыздысын көрсетеміз: аудан, тіл, баға, пікірлер және келесі қадамдар.',
      schools: 'мектеп',
      districts: 'аудан',
      languages: 'оқыту тілі',
      favorites: 'таңдаулыда'
    },
    catalogKicker: 'Мектептер каталогы',
    filtersAria: 'Мектеп сүзгілері',
    all: 'Барлығы',
    type: 'Түрі',
    language: 'Тілі',
    district: 'Аудан',
    maxMonthlyPrice: 'Айлық ең жоғары баға',
    sortBy: 'Сұрыптау',
    sortOptions: {
      highest_rated: 'Рейтингі жоғары',
      lowest_tuition: 'Бағасы төмен',
      highest_tuition: 'Бағасы жоғары',
      most_reviewed: 'Пікірі көп',
      alphabetical_az: 'Әліпби бойынша A-Z'
    },
    reviewCount: (count) => `${count} пікір`,
    ratingSummary: { excellent: 'Өте жақсы', good: 'Жақсы', average: 'Орташа' },
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
    mapLink: 'Map',
    rankingsLink: 'Rankings',
    addSchoolLink: 'Add school',

    catalogLink: 'Catalog',
    footerSeoLabel: 'Helpful pages',
    howItWorks: {
      kicker: 'Start here',
      title: 'How it works',
      steps: [
        ['Take the quiz', 'Answer a few parent-focused questions about location, budget, language, and priorities.'],
        ['Review a short list', 'See the strongest public and private options first instead of scanning every school.'],
        ['Compare and decide', 'Save favorites, compare up to three schools, read reviews, and open details when ready.']
      ]
    },
    schoolTools: {
      kicker: 'School tools',
      title: 'Everything you need after the shortlist',
      description: 'Keep the full discovery workflow available without overwhelming the homepage.',
      tools: [
        ['Catalog', 'Filter every school by type, language, district, tuition, and rating.', '/catalog'],
        ['Map', 'Explore school locations around home, work, and commute routes.', '/map'],
        ['Quiz', 'Get a guided recommendation path for your family priorities.', '/quiz'],
        ['Compare', 'Compare saved schools side by side before contacting admissions.', '/compare'],
        ['Favorites', 'Return to schools you saved while researching.', '/favorites']
      ]
    },
    featuredSchools: {
      kicker: 'Featured schools',
      title: 'Start with the strongest options',
      description: 'A focused preview of the top 5 public and top 5 private schools keeps the homepage easy to scan.',
      publicTitle: 'Top 5 public schools',
      privateTitle: 'Top 5 private schools',
      browseAll: 'Browse full catalog'
    },
    favorite: {
      add: 'Add to favorites',
      remove: 'Saved to favorites'
    },
    heroKicker: 'School Choice Kazakhstan',
    heroTitle: 'Find the school that fits your family',
    heroDescription:
      'Answer a short quiz, save promising options, and compare Astana schools by the criteria parents care about most.',
    heroCta: 'Take the recommendation quiz',
    astanaSchools: 'schools in the guide',
    heroSecondaryCta: 'Browse catalog',
    heroNote: 'A guided path for parents: quiz → shortlist → comparison.',
    assistantSteps: ['Share district and budget', 'Get focused school options', 'Compare and save choices'],
    stats: {
      title: 'A catalog designed around parent decisions',
      description: 'We reduce noise and surface the signals families need: location, language, tuition, reviews, and clear next steps.',
      schools: 'schools',
      districts: 'districts',
      languages: 'instruction languages',
      favorites: 'saved favorites'
    },
    catalogKicker: 'School catalog',
    filtersAria: 'School filters',
    all: 'All',
    type: 'Type',
    language: 'Language',
    district: 'District',
    maxMonthlyPrice: 'Tuition fee',
    sortBy: 'Sort by',
    sortOptions: {
      highest_rated: 'Highest rated',
      lowest_tuition: 'Lowest tuition',
      highest_tuition: 'Highest tuition',
      most_reviewed: 'Most reviewed',
      alphabetical_az: 'Alphabetical A-Z'
    },
    reviewCount: (count) => `${count} ${count === 1 ? 'review' : 'reviews'}`,
    ratingSummary: { excellent: 'Excellent', good: 'Good', average: 'Average' },
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

function StatsSection({ t, favoriteCount }) {
  const stats = [
    { value: schools.length, label: t.stats.schools },
    { value: schoolDistricts.length, label: t.stats.districts },
    { value: schoolLanguages.length, label: t.stats.languages },
    { value: favoriteCount, label: t.stats.favorites }
  ];

  return (
    <section className="stats-panel" aria-labelledby="stats-title">
      <div>
        <p className="section-kicker">{t.catalogKicker}</p>
        <h2 id="stats-title">{t.stats.title}</h2>
        <p>{t.stats.description}</p>
      </div>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stats-card" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}


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


function SortControl({ value, onChange, t }) {
  return (
    <label className="filter-control" htmlFor="sort">
      <span>{t.sortBy}</span>
      <select id="sort" value={value} onChange={(event) => onChange(event.target.value)}>
        {sortOptionValues.map((optionValue) => (
          <option key={optionValue} value={optionValue}>{t.sortOptions[optionValue]}</option>
        ))}
      </select>
    </label>
  );
}

function SchoolCard({ school, moneyFormatter, t, currentLanguage, ratingStats, isCompared, isCompareDisabled, onCompareToggle }) {
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

      <div className="school-card__snapshot">
        <span>{localizedLanguages}</span>
        <span>{formatPrice(school.tuition_fee)}</span>
      </div>

      <dl className="school-card__facts school-card__facts--compact">
        {[
          [t.schoolCard.rating, ratingStats.averageRating === null ? t.notYetRated : `⭐ ${formatAverageRating(ratingStats.averageRating)} / 5 · ${t.ratingSummary[getRatingSummaryKey(ratingStats.averageRating)]}`],
          [t.schoolCard.schoolType, localizedSchoolType],
          ['📝', t.reviewCount(ratingStats.reviewCount)]
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

function HomeSchoolCard({ school, moneyFormatter, t, currentLanguage, ratingStats }) {
  const localizedName = getLocalizedSchoolValue(school.name, currentLanguage);
  const localizedDistrict = getLocalizedEnumLabel('districts', school.district, currentLanguage);
  const localizedLanguages = getLocalizedSchoolValue(school.languages, currentLanguage);
  const cardImage = getSchoolCardImage(school, localizedName);
  const tuition = school.tuition_fee === null || school.tuition_fee === undefined
    ? t.priceUnknown
    : school.tuition_fee === 0
      ? t.freePublicSchool
      : `${moneyFormatter.format(school.tuition_fee)} / ${t.perMonth}`;
  const rating = ratingStats.averageRating === null ? t.notYetRated : `⭐ ${formatAverageRating(ratingStats.averageRating)} / 5`;

  return (
    <article className="top-school-card">
      <div className="top-school-card__image">
        <SchoolImageWithFallback src={cardImage} alt={localizedName} schoolName={localizedName} loading="lazy" decoding="async" size="card" />
      </div>
      <div className="top-school-card__body">
        <h3>{localizedName}</h3>
        <dl>
          <div><dt>{t.district}</dt><dd>{localizedDistrict}</dd></div>
          <div><dt>{t.language}</dt><dd>{localizedLanguages}</dd></div>
          <div><dt>{t.schoolCard.tuitionFee}</dt><dd>{tuition}</dd></div>
          <div><dt>{t.schoolCard.rating}</dt><dd>{rating}</dd></div>
        </dl>
        <a className="button-link" href={`/schools/${school.slug ?? school.id}?lang=${currentLanguage}`}>{t.schoolCard.details}</a>
      </div>
    </article>
  );
}

function TopSchoolsTabs({ groups, moneyFormatter, t, homeT, currentLanguage, reviewsBySchool }) {
  const [activeTab, setActiveTab] = useState('public');

  return (
    <section className="top-schools" aria-labelledby="top-schools-title">
      <div className="section-heading section-heading--split">
        <h2 id="top-schools-title">{homeT.topTitle}</h2>
        <div className="tabs" role="tablist" aria-label={homeT.topTitle}>
          {Object.keys(groups).map((type) => (
            <button key={type} type="button" role="tab" aria-selected={activeTab === type} className={activeTab === type ? 'tab tab--active' : 'tab'} onClick={() => setActiveTab(type)}>
              {homeT.tabs[type]}
            </button>
          ))}
        </div>
      </div>
      <div className="top-school-grid">
        {groups[activeTab].map((school) => (
          <HomeSchoolCard key={school.id} school={school} moneyFormatter={moneyFormatter} t={t} currentLanguage={currentLanguage} ratingStats={getSchoolRatingStats(school, getSchoolReviews(reviewsBySchool, school.id))} />
        ))}
      </div>
    </section>
  );
}

function ReviewsPreview({ homeT, currentLanguage, reviewsBySchool }) {
  const latestReviews = sortReviewsByLatest(
    schools.flatMap((school) => getCombinedSchoolReviews(school, reviewsBySchool).map((review) => ({ ...review, school })))
  ).slice(0, 3);

  return (
    <section className="reviews-preview" aria-labelledby="reviews-preview-title">
      <div className="section-heading"><h2 id="reviews-preview-title">{homeT.reviewsTitle}</h2></div>
      {latestReviews.length ? (
        <div className="review-grid">
          {latestReviews.map((review) => (
            <article className="review-card" key={`${review.school.id}-${review.id}`}>
              <strong>{review.parentName} · ⭐ {review.rating}/5</strong>
              <p>{getLocalizedSchoolValue(review.text, currentLanguage)}</p>
              <span>{getLocalizedSchoolValue(review.school.name, currentLanguage)} · {review.reviewGrade ?? review.childGrade} {homeT.reviewGrade}</span>
            </article>
          ))}
        </div>
      ) : <p className="empty-note">{homeT.reviewsEmpty}</p>}
    </section>
  );
}

export default function Home() {
  const [filters, setFilters] = useState(initialFilters);
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [currentPage, setCurrentPage] = useState(1);
  const [comparedSchoolIds, setComparedSchoolIds] = useState([]);
  const [reviewsBySchool, setReviewsBySchool] = useState({});
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [sortBy, setSortBy] = useState(initialSort);

  useEffect(() => {
    setComparedSchoolIds(getStoredComparedSchoolIds());
    setReviewsBySchool(getStoredReviewsBySchool());
    const syncFavoriteCount = () => setFavoriteCount(getStoredFavoriteSchoolIds().length);
    syncFavoriteCount();
    window.addEventListener('storage', syncFavoriteCount);
    window.addEventListener(favoritesChangedEventName, syncFavoriteCount);
    return () => {
      window.removeEventListener('storage', syncFavoriteCount);
      window.removeEventListener(favoritesChangedEventName, syncFavoriteCount);
    };
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

  const t = { ...translations.en, ...translations[currentLanguage], catalogLink: translations[currentLanguage].catalogLink ?? translations.en.catalogLink };
  const homeT = homepageTranslations[currentLanguage];
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
    () => sortSchools(schools.filter((school) => doesSchoolMatchCatalogFilters(school, filters)), sortBy, currentLanguage, reviewsBySchool),
    [filters, sortBy, currentLanguage, reviewsBySchool]
  );

  const totalPages = Math.max(1, Math.ceil(filteredSchools.length / schoolsPerPage));
  const visibleSchools = filteredSchools.slice((currentPage - 1) * schoolsPerPage, currentPage * schoolsPerPage);
  const topSchoolGroups = useMemo(() => ({
    public: sortSchools(schools.filter((school) => school.type === 'public'), initialSort, currentLanguage, reviewsBySchool).slice(0, 5),
    private: sortSchools(schools.filter((school) => school.type === 'private'), initialSort, currentLanguage, reviewsBySchool).slice(0, 5),
    international: sortSchools(schools.filter((school) => school.type === 'international'), initialSort, currentLanguage, reviewsBySchool).slice(0, 5)
  }), [currentLanguage, reviewsBySchool]);
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
          <a className="site-header__link" href={`/catalog?lang=${currentLanguage}`}>{t.catalogLink}</a>
          <a className="site-header__link" href={`/map?lang=${currentLanguage}`}>{t.mapLink}</a>
          <a className="site-header__link" href={`/rankings?lang=${currentLanguage}`}>{t.rankingsLink}</a>
          <a className="site-header__link" href={`/contribute?lang=${currentLanguage}`}>{t.addSchoolLink}</a>
          <a className="site-header__link" href={`/favorites?lang=${currentLanguage}`}>♡ {t.favoritesLink} ({favoriteCount})</a>
          <LanguageSwitcher currentLanguage={currentLanguage} onLanguageChange={updateLanguage} t={t} />
        </div>
      </header>

      <section className="hero hero--landing" id="top">
        <div className="hero__copy">
          <h1>{homeT.heroTitle}</h1>
          <p>{homeT.heroDescription}</p>
          <div className="hero__actions">
            <a className="hero__cta" href={`/quiz?lang=${currentLanguage}`}>{homeT.heroCta}</a>
            <a className="hero__cta hero__cta--secondary" href={`/catalog?lang=${currentLanguage}`}>{homeT.heroSecondaryCta}</a>
          </div>
        </div>
        <div className="hero-stat-grid" aria-label={homeT.heroStats.join(', ')}>
          {homeT.heroStats.map((stat) => (
            <strong key={stat}>{stat}</strong>
          ))}
        </div>
      </section>

      <section className="quick-filters" aria-labelledby="quick-filters-title">
        <div className="section-heading"><h2 id="quick-filters-title">{homeT.quickFiltersTitle}</h2></div>
        <div className="quick-filter-grid">
          {homeT.quickFilters.map(([icon, title, href]) => (
            <a className="quick-filter-card" key={title} href={`${href}${href.includes('?') ? '&' : '?'}lang=${currentLanguage}`}>
              <span>{icon}</span>
              <strong>{title}</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="how-it-works how-it-works--timeline" aria-labelledby="how-it-works-title">
        <div className="section-heading"><h2 id="how-it-works-title">{homeT.howTitle}</h2></div>
        <div className="timeline">
          {homeT.howSteps.map((step, index) => (
            <article className="timeline-card" key={step}>
              <span className="timeline-card__icon">{['❓', '📋', '❤️'][index]}</span>
              <span className="timeline-card__number">{index + 1}</span>
              <h3>{step}</h3>
            </article>
          ))}
        </div>
      </section>

      <TopSchoolsTabs groups={topSchoolGroups} moneyFormatter={moneyFormatter} t={t} homeT={homeT} currentLanguage={currentLanguage} reviewsBySchool={reviewsBySchool} />
      <ComparisonBar
        selectedSchools={selectedSchools}
        currentLanguage={currentLanguage}
        onRemove={removeComparedSchool}
        onClear={() => updateComparedSchoolIds([])}
        t={t}
      />

      <section className="tool-section" aria-labelledby="tools-title">
        <div className="section-heading"><h2 id="tools-title">{homeT.toolsTitle}</h2></div>
        <div className="tool-card-grid">
          {homeT.tools.map(([icon, title, href]) => (
            <a className="tool-card tool-card--large" key={title} href={`${href}?lang=${currentLanguage}`}><span>{icon}</span><strong>{title}</strong></a>
          ))}
        </div>
      </section>

      <section className="map-preview" aria-labelledby="map-preview-title">
        <div>
          <h2 id="map-preview-title">{homeT.mapTitle}</h2>
          <p>{homeT.mapDescription}</p>
        </div>
        <a className="button-link" href={`/map?lang=${currentLanguage}`}>{homeT.mapCta}</a>
      </section>

      <ReviewsPreview homeT={homeT} currentLanguage={currentLanguage} reviewsBySchool={reviewsBySchool} />

      <section className="articles" aria-labelledby="articles-title">
        <div className="section-heading"><h2 id="articles-title">{homeT.articlesTitle}</h2></div>
        <div className="article-grid">
          {homeT.articles.map(([title, href]) => (
            <a className="article-card" key={title} href={`${href}?lang=${currentLanguage}`}>{title}</a>
          ))}
        </div>
      </section>

      <FeedbackForm t={t} currentLanguage={currentLanguage} />

      <footer className="site-footer">
        <p>{t.footer}</p>
        <nav className="footer-links" aria-label={t.footerSeoLabel}>
          <a href={`/contribute?lang=${currentLanguage}`}>{t.addSchoolLink}</a>
          <a href={`/rankings?lang=${currentLanguage}`}>{t.rankingsLink}</a>
          {seoFooterLinks.map((link) => (
            <a key={link.href} href={`${link.href}?lang=${currentLanguage}`}>{link.label[currentLanguage]}</a>
          ))}
        </nav>
      </footer>
    </main>
  );
}
