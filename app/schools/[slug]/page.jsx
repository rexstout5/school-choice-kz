import { notFound } from 'next/navigation';
import { getLocalizedEnumLabel, getLocalizedSchoolValue, schools } from '../../../src/data/schools.js';
import FavoriteButton from '../../../src/components/FavoriteButton.jsx';
import CompareButton from '../../../src/components/CompareButton.jsx';
import SchoolReviews from '../../../src/components/SchoolReviews.jsx';
import { getBrandTitle } from '../../../src/data/brand.js';
import { formatAverageRating } from '../../../src/lib/reviews.js';
import { getRatingSummaryKey, getSchoolInsightKeys, getSchoolRatingStats } from '../../../src/lib/schoolDiscovery.js';
import SchoolImageWithFallback from '../../../src/components/SchoolImageWithFallback.jsx';
import { createSchoolImagePlaceholder, isUsableImageUrl, normalizeImageRecord } from '../../../src/utils/schoolImages.js';

const defaultLanguage = 'ru';

const translations = {
  ru: {
    languageSwitcherLabel: 'Выберите язык интерфейса',
    backToCatalog: 'Назад к каталогу',
    pageKicker: 'Профиль школы',
    imagePlaceholder: 'Фото школы скоро появится',
    galleryTitle: 'Фотогалерея',
    galleryDescription: 'Фотографии школы и учебной среды.',
    imageSource: 'Источник изображения',
    imageStatus: 'Статус изображения',
    fallbackImageAlt: 'Иллюстрация здания школы',
    detailsTitle: 'Коротко о школе',
    benefitsTitle: 'Преимущества',
    aboutTitle: 'О школе',
    studentsCount: 'Количество учеников',
    unknownStudentsCount: 'Уточняется',
    programsTitle: 'Программы',
    suitableTitle: 'Кому подойдет эта школа?',
    recommendationTitle: 'Объяснение рекомендации',
    match: 'совпадение',
    whyTitle: 'Почему подходит',
    concernsTitle: 'Возможные вопросы',
    parentHighlightsTitle: 'Что отмечают родители',
    parentConsiderationsTitle: 'Что стоит учитывать',
    lastDataUpdateTitle: 'Последнее обновление данных',
    ratingBasedOnReviews: (count) => `На основе ${count} ${count === 1 ? 'отзыва' : count > 1 && count < 5 ? 'отзывов' : 'отзывов'}`,
    reviewDataPrepared: 'Схема готова для будущей интеграции отзывов; live-скрейпинг 2GIS не используется.',
    ratingSummary: { excellent: 'Отлично', good: 'Хорошо', average: 'Средне' },
    reviewCount: (count) => `${count} ${count === 1 ? 'отзыв' : count > 1 && count < 5 ? 'отзыва' : 'отзывов'}`,
    insightTags: {
      strongAcademics: 'Сильная академическая база', stemFocused: 'STEM-фокус', englishFocused: 'Фокус на английском', affordable: 'Доступная стоимость', internationalCurriculum: 'Международная программа', closeToHome: 'Вариант рядом с домом', strongExtracurricular: 'Сильные внеурочные активности'
    },
    contactsTitle: 'Контакты',
    openIn2Gis: 'Открыть в 2GIS',
    missingValue: 'Не указано',
    sourcesTitle: 'Источники данных',
    reportIncorrectInfo: 'Сообщить об ошибке',
    favorite: {
      add: 'Добавить в избранное',
      remove: 'В избранном'
    },
    fields: {
      schoolName: 'Название школы',
      district: 'Район',
      schoolType: 'Тип школы',
      schoolFormat: 'Формат школы',
      language: 'Язык обучения',
      tuitionFee: 'Стоимость обучения',
      priceStatus: 'Статус цены',
      dataStatus: 'Статус данных',
      afterSchoolProgram: 'Продленка',
      schoolBus: 'Школьный автобус',
      admissionRequirements: 'Требования к поступлению',
      classSize: 'Размер класса',
      address: 'Адрес',
      phone: 'Телефон',
      website: 'Сайт',
      email: 'Email',
      description: 'Описание',
      rating: 'Рейтинг',
      reviews: 'Отзывы'
    },
    freePublicSchool: 'Бесплатная государственная школа',
    priceUnknown: 'Стоимость уточняется',
    perMonth: 'в месяц',
    passport: {
      openSourceRating: 'Оценка по открытым источникам', quickSummary: 'Кратко от BilimChoice', quickFacts: 'Основные характеристики', educationProfile: 'Образовательный профиль', parentHighlights: 'Что чаще всего отмечают родители', reviewSummaryNote: 'Саммари подготовлено на основе анализа общедоступных отзывов. Формулировки являются обобщением и не содержат дословных цитат.', considerations: 'Что стоит учитывать', bestFor: 'Кому может подойти эта школа', mayNotFit: 'Когда стоит рассмотреть другие варианты', admission: 'Что может понадобиться при поступлении', contactsAndSources: 'Контакты и источники', sourcesAndFreshness: 'Источники и актуальность', lastVerified: 'Последняя проверка данных', trustNote: 'Данные основаны на официальной информации школы и общедоступных источниках. BilimChoice не является представителем школы.', grades: 'Классы', direction: 'Направленность', officialWebsite: 'Официальный сайт', instagram: 'Instagram', addToCompare: 'Добавить к сравнению', removeFromCompare: 'В сравнении'
    },
    reviews: {
      kicker: 'Отзывы родителей',
      title: 'Отзывы о школе',
      description: 'Отзывы временно сохраняются только в localStorage этого браузера.',
      averageRating: 'Средняя оценка',
      notYetRated: 'Нет оценки',
      reviewCount: { one: 'отзыв', few: 'отзыва', many: 'отзывов' },
      categorySummaryTitle: 'Средние оценки по категориям',
      categoryRatings: 'Оценки по категориям',
      categories: { academics: 'Академика', teachers: 'Учителя', safety: 'Безопасность', parentCommunication: 'Связь с родителями', extracurricular: 'Внеурочные занятия' },
      parentName: 'Имя родителя',
      rating: 'Оценка',
      ratingOption: '{rating} из 5',
      childGrade: 'Класс ребенка',
      childGradePlaceholder: 'Например: 3 класс',
      reviewText: 'Текст отзыва',
      reviewTextPlaceholder: 'Поделитесь опытом обучения, коммуникации и атмосферы.',
      submit: 'Сохранить отзыв',
      success: 'Спасибо — отзыв сохранен в этом браузере.',
      error: 'Не удалось сохранить отзыв в этом браузере.',
      latestTitle: 'Последние отзывы',
      empty: 'Пока нет отзывов. Будьте первым родителем, который поделится опытом.',
      reviewRating: '{rating}/5',
      gradeLabel: 'Класс ребенка: {grade}',
      submittedAt: 'добавлен {date}'
    }
  },
  kz: {
    languageSwitcherLabel: 'Интерфейс тілін таңдаңыз',
    backToCatalog: 'Каталогқа оралу',
    pageKicker: 'Мектеп профилі',
    imagePlaceholder: 'Мектеп фотосы жақында қосылады',
    galleryTitle: 'Фотогалерея',
    galleryDescription: 'Мектеп пен оқу ортасының фотолары.',
    imageSource: 'Сурет дереккөзі',
    imageStatus: 'Сурет мәртебесі',
    fallbackImageAlt: 'Мектеп ғимаратының иллюстрациясы',
    detailsTitle: 'Мектеп туралы қысқаша',
    benefitsTitle: 'Артықшылықтар',
    aboutTitle: 'Мектеп туралы',
    studentsCount: 'Оқушылар саны',
    unknownStudentsCount: 'Нақтыланады',
    programsTitle: 'Бағдарламалар',
    suitableTitle: 'Бұл мектеп кімге қолайлы?',
    recommendationTitle: 'Ұсыныс түсіндірмесі',
    match: 'сәйкестік',
    whyTitle: 'Неге сәйкес келеді',
    concernsTitle: 'Мүмкін сұрақтар',
    parentHighlightsTitle: 'Ата-аналар нені атап өтеді',
    parentConsiderationsTitle: 'Нені ескеру керек',
    lastDataUpdateTitle: 'Деректердің соңғы жаңартылуы',
    ratingBasedOnReviews: (count) => `${count} пікір негізінде`,
    reviewDataPrepared: 'Схема болашақ пікір интеграциясына дайын; 2GIS live-скрейпингі қолданылмайды.',
    ratingSummary: { excellent: 'Өте жақсы', good: 'Жақсы', average: 'Орташа' },
    reviewCount: (count) => `${count} пікір`,
    insightTags: {
      strongAcademics: 'Күшті академиялық база', stemFocused: 'STEM бағыты', englishFocused: 'Ағылшынға фокус', affordable: 'Қолжетімді', internationalCurriculum: 'Халықаралық бағдарлама', closeToHome: 'Үйге жақын нұсқа', strongExtracurricular: 'Күшті қосымша іс-шаралар'
    },
    contactsTitle: 'Байланыс',
    openIn2Gis: '2GIS-та ашу',
    missingValue: 'Көрсетілмеген',
    sourcesTitle: 'Дерек көздері',
    reportIncorrectInfo: 'Қате ақпарат туралы хабарлау',
    favorite: {
      add: 'Таңдаулыға қосу',
      remove: 'Таңдаулыда'
    },
    fields: {
      schoolName: 'Мектеп атауы',
      district: 'Аудан',
      schoolType: 'Мектеп түрі',
      schoolFormat: 'Мектеп форматы',
      language: 'Оқыту тілі',
      tuitionFee: 'Оқу ақысы',
      priceStatus: 'Баға мәртебесі',
      dataStatus: 'Дерек мәртебесі',
      afterSchoolProgram: 'Сабақтан кейінгі бағдарлама',
      schoolBus: 'Мектеп автобусы',
      admissionRequirements: 'Қабылдау талаптары',
      classSize: 'Сынып көлемі',
      address: 'Мекенжай',
      phone: 'Телефон',
      website: 'Сайт',
      email: 'Email',
      description: 'Сипаттама',
      rating: 'Рейтинг',
      reviews: 'Пікірлер'
    },
    freePublicSchool: 'Тегін мемлекеттік мектеп',
    priceUnknown: 'Құны нақтыланады',
    perMonth: 'айына',
    passport: {
      openSourceRating: 'Ашық дереккөздердегі баға', quickSummary: 'BilimChoice қысқаша пікірі', quickFacts: 'Негізгі сипаттамалар', educationProfile: 'Білім беру профилі', parentHighlights: 'Ата-аналар жиі атап өтетін жайттар', reviewSummaryNote: 'Саммари жалпыға қолжетімді пікірлерді талдау негізінде дайындалды. Мәтіндер жалпыланған және дословты дәйексөздер жоқ.', considerations: 'Нені ескеру керек', bestFor: 'Бұл мектеп кімге қолайлы болуы мүмкін', mayNotFit: 'Қай кезде басқа нұсқаларды қарастырған жөн', admission: 'Қабылдау кезінде не қажет болуы мүмкін', contactsAndSources: 'Байланыс және дереккөздер', sourcesAndFreshness: 'Дереккөздер және өзектілік', lastVerified: 'Деректер соңғы рет тексерілді', trustNote: 'Деректер мектептің ресми ақпаратына және жалпыға қолжетімді дереккөздерге негізделген. BilimChoice мектеп өкілі емес.', grades: 'Сыныптар', direction: 'Бағыты', officialWebsite: 'Ресми сайт', instagram: 'Instagram', addToCompare: 'Салыстыруға қосу', removeFromCompare: 'Салыстыруда'
    },
    reviews: {
      kicker: 'Ата-аналар пікірі',
      title: 'Мектеп туралы пікірлер',
      description: 'Пікірлер әзірге тек осы браузердің localStorage қоймасында сақталады.',
      averageRating: 'Орташа баға',
      notYetRated: 'Баға жоқ',
      reviewCount: { one: 'пікір', many: 'пікір' },
      categorySummaryTitle: 'Санаттар бойынша орташа бағалар',
      categoryRatings: 'Санаттар бойынша бағалар',
      categories: { academics: 'Академиялық деңгей', teachers: 'Мұғалімдер', safety: 'Қауіпсіздік', parentCommunication: 'Ата-анамен байланыс', extracurricular: 'Қосымша іс-шаралар' },
      parentName: 'Ата-ананың аты',
      rating: 'Баға',
      ratingOption: '{rating}/5',
      childGrade: 'Баланың сыныбы',
      childGradePlaceholder: 'Мысалы: 3-сынып',
      reviewText: 'Пікір мәтіні',
      reviewTextPlaceholder: 'Оқу, байланыс және мектеп атмосферасы туралы тәжірибеңізбен бөлісіңіз.',
      submit: 'Пікірді сақтау',
      success: 'Рақмет — пікір осы браузерде сақталды.',
      error: 'Бұл браузерде пікірді сақтау мүмкін болмады.',
      latestTitle: 'Соңғы пікірлер',
      empty: 'Әзірге пікір жоқ. Тәжірибеңізбен бөліскен алғашқы ата-ана болыңыз.',
      reviewRating: '{rating}/5',
      gradeLabel: 'Баланың сыныбы: {grade}',
      submittedAt: '{date} қосылды'
    }
  },
  en: {
    languageSwitcherLabel: 'Choose interface language',
    backToCatalog: 'Back to catalog',
    pageKicker: 'School profile',
    imagePlaceholder: 'School photo coming soon',
    galleryTitle: 'Photo gallery',
    galleryDescription: 'Photos of the school and learning environment.',
    imageSource: 'Image source',
    imageStatus: 'Image status',
    fallbackImageAlt: 'Illustration of a school building',
    detailsTitle: 'Quick facts',
    benefitsTitle: 'Advantages',
    aboutTitle: 'About school',
    studentsCount: 'Number of students',
    unknownStudentsCount: 'To be confirmed',
    programsTitle: 'Programs',
    suitableTitle: 'Who is this school suitable for?',
    recommendationTitle: 'Recommendation explanation',
    match: 'match',
    whyTitle: 'Why it matches',
    concernsTitle: 'Possible concerns',
    parentHighlightsTitle: 'What parents highlight',
    parentConsiderationsTitle: 'What to consider',
    lastDataUpdateTitle: 'Latest data update',
    ratingBasedOnReviews: (count) => `Based on ${count} ${count === 1 ? 'review' : 'reviews'}`,
    reviewDataPrepared: 'Schema is ready for future review integrations; live 2GIS scraping is not used.',
    ratingSummary: { excellent: 'Excellent', good: 'Good', average: 'Average' },
    reviewCount: (count) => `${count} ${count === 1 ? 'review' : 'reviews'}`,
    insightTags: {
      strongAcademics: 'Strong academics', stemFocused: 'STEM focused', englishFocused: 'English focused', affordable: 'Affordable', internationalCurriculum: 'International curriculum', closeToHome: 'Close-to-home option', strongExtracurricular: 'Strong extracurricular activities'
    },
    contactsTitle: 'Contacts',
    openIn2Gis: 'Open in 2GIS',
    missingValue: 'Not specified',
    sourcesTitle: 'Data sources',
    reportIncorrectInfo: 'Report incorrect information',
    favorite: {
      add: 'Add to favorites',
      remove: 'Saved to favorites'
    },
    fields: {
      schoolName: 'School name',
      district: 'District',
      schoolType: 'School type',
      schoolFormat: 'School format',
      language: 'Instruction language',
      tuitionFee: 'Tuition fee',
      priceStatus: 'Price status',
      dataStatus: 'Data status',
      afterSchoolProgram: 'After-school program',
      schoolBus: 'School bus',
      admissionRequirements: 'Admission requirements',
      classSize: 'Class size',
      address: 'Address',
      phone: 'Phone',
      website: 'Website',
      email: 'Email',
      description: 'Description',
      rating: 'Rating',
      reviews: 'Reviews'
    },
    freePublicSchool: 'Free public school',
    priceUnknown: 'Tuition to be confirmed',
    perMonth: 'month',
    passport: {
      openSourceRating: 'Score from open sources', quickSummary: 'BilimChoice summary', quickFacts: 'Key facts', educationProfile: 'Educational profile', parentHighlights: 'What parents most often highlight', reviewSummaryNote: 'This summary is based on analysis of publicly available reviews. Wording is generalized and does not include verbatim quotes.', considerations: 'What to consider', bestFor: 'Who this school may fit', mayNotFit: 'When to consider other options', admission: 'What may be needed for admission', contactsAndSources: 'Contacts and sources', sourcesAndFreshness: 'Sources and freshness', lastVerified: 'Last data check', trustNote: 'Data is based on official school information and publicly available sources. BilimChoice is not a representative of the school.', grades: 'Grades', direction: 'Focus areas', officialWebsite: 'Official website', instagram: 'Instagram', addToCompare: 'Add to comparison', removeFromCompare: 'In comparison'
    },
    reviews: {
      kicker: 'Parent reviews',
      title: 'School reviews',
      description: 'Reviews are saved in this browser localStorage for now.',
      averageRating: 'Average rating',
      notYetRated: 'No rating yet',
      reviewCount: { one: 'review', many: 'reviews' },
      categorySummaryTitle: 'Average ratings by category',
      categoryRatings: 'Category ratings',
      categories: { academics: 'Academics', teachers: 'Teachers', safety: 'Safety', parentCommunication: 'Communication with parents', extracurricular: 'Extracurricular activities' },
      parentName: 'Parent name',
      rating: 'Rating',
      ratingOption: '{rating} of 5',
      childGrade: 'Child grade',
      childGradePlaceholder: 'Example: Grade 3',
      reviewText: 'Review text',
      reviewTextPlaceholder: 'Share your experience with learning, communication, and atmosphere.',
      submit: 'Save review',
      success: 'Thank you — your review was saved in this browser.',
      error: 'This browser could not save the review.',
      latestTitle: 'Latest reviews',
      empty: 'No reviews yet. Be the first parent to share your experience.',
      reviewRating: '{rating}/5',
      gradeLabel: 'Child grade: {grade}',
      submittedAt: 'added {date}'
    }
  }
};

const languageOptions = [
  { code: 'ru', label: 'RU' },
  { code: 'kz', label: 'KZ' },
  { code: 'en', label: 'EN' }
];

const getLanguage = (lang) => (lang && translations[lang] ? lang : defaultLanguage);
const getSchoolSlug = (school) => school.slug ?? school.id;
const formatPhoneLink = (phone) => phone.replace(/[^+\d]/g, '');
const hasValue = (value) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== null && value !== undefined && String(value).trim() !== '';
};
const getSchoolEmail = (school) => school.email ?? school.contact?.email ?? '';
const getStudentCount = (school) => school.students_count ?? school.student_count ?? school.studentsCount ?? school.metadata?.students_count ?? school.metadata?.student_count ?? '';
const languageBadgeLabels = { ru: 'RU', kk: 'KZ', kz: 'KZ', en: 'EN' };
const getInstructionLanguageBadges = (school) => {
  const languages = Array.isArray(school.instruction_languages) ? school.instruction_languages : String(school.language_of_instruction ?? school.language ?? '').split(/[,/]/);
  return [...new Set(languages.map((item) => String(item).trim().toLowerCase()).map((item) => languageBadgeLabels[item] ?? '').filter(Boolean))];
};

const heroSchoolTypeLabels = {
  public: { ru: 'Государственная', kz: 'Мемлекеттік', en: 'Public' },
  specialized: { ru: 'Государственная', kz: 'Мемлекеттік', en: 'Public' },
  private: { ru: 'Частная', kz: 'Жеке', en: 'Private' },
  international: { ru: 'Международная', kz: 'Халықаралық', en: 'International' }
};
const getHeroSchoolType = (school, language) => heroSchoolTypeLabels[school.type]?.[language] ?? getLocalizedEnumLabel('schoolTypes', school.type, language);

const getTwoGisUrl = (school, address, name) => {
  const coordinates = school.contact?.coordinates ?? school.metadata?.coordinates ?? school.coordinates;

  if (Array.isArray(coordinates) && coordinates.length >= 2) {
    const [longitude, latitude] = coordinates;

    if (longitude && latitude) {
      return `https://2gis.kz/astana/geo/${longitude},${latitude}`;
    }
  }

  const query = encodeURIComponent([name, address, 'Астана'].filter(hasValue).join(' '));

  return `https://2gis.kz/astana/search/${query}`;
};

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


const getImageAlt = (image, fallback, language) => getLocalizedSchoolValue(image?.alt, language) || fallback;
const createFallbackImage = (schoolName, t) => ({
  src: createSchoolImagePlaceholder(schoolName),
  alt: t.fallbackImageAlt,
  isFallback: true
});
const getSchoolImages = (school, schoolName, t) => {
  const mainImageUrl = isUsableImageUrl(school.main_image_url) ? school.main_image_url.trim() : '';
  const normalizedMainImage = mainImageUrl
    ? { ...(normalizeImageRecord(school.main_image) ?? {}), src: mainImageUrl }
    : normalizeImageRecord(school.main_image);
  const galleryImages = Array.isArray(school.gallery_images) ? school.gallery_images : [];
  const photos = [normalizedMainImage, ...galleryImages.map(normalizeImageRecord)].filter(Boolean);

  return photos.length > 0 ? photos : [createFallbackImage(schoolName, t)];
};

const getSchoolImageMetadata = (school) => ({
  imageSource: school.image_source && typeof school.image_source === 'object' && !Array.isArray(school.image_source) ? school.image_source : '',
  imageStatus: typeof school.image_status === 'string' && school.image_status.trim().length > 0 ? school.image_status : 'missing'
});

const getReportContributionUrl = (slug, language) => `/contribute?lang=${language}&tab=correction&school=${encodeURIComponent(slug)}`;

const getReviewIntegrationSummary = (school) => school.reviewSummary && typeof school.reviewSummary === 'object' ? school.reviewSummary : {};
const getLocalizedList = (items, language) => Array.isArray(items) ? items.map((item) => getLocalizedSchoolValue(item, language) || (typeof item === 'string' ? item : '')).filter(hasValue) : [];
const getSchoolDisplayRating = (school, ratingStats) => {
  const summary = getReviewIntegrationSummary(school);
  const rating = Number.isFinite(Number(summary.rating)) ? Number(summary.rating) : Number.isFinite(Number(school.rating)) ? Number(school.rating) : ratingStats.averageRating;
  const reviewsCount = Number.isFinite(Number(summary.reviewsCount)) ? Number(summary.reviewsCount) : Number.isFinite(Number(school.reviewsCount)) ? Number(school.reviewsCount) : ratingStats.reviewCount;

  return {
    rating: Number.isFinite(Number(rating)) && Number(rating) > 0 ? Number(rating) : null,
    reviewsCount: Number.isFinite(Number(reviewsCount)) && Number(reviewsCount) > 0 ? Number(reviewsCount) : null
  };
};
const formatDataUpdateDate = (date, language) => {
  if (!hasValue(date)) return '';
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '';
  return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : language === 'kz' ? 'kk-KZ' : 'ru-RU', { month: 'long', year: 'numeric' }).format(parsedDate);
};



const getDefaultBenefitCards = (school, language, localizedPrograms) => {
  const programText = Array.isArray(localizedPrograms) ? localizedPrograms.join(' ').toLowerCase() : '';
  const hasEnglish = Array.isArray(school.instruction_languages) && school.instruction_languages.includes('en');
  const hasInternational = school.type === 'international' || /international|ib|cambridge|международ|халықаралық/i.test(programText);
  const hasStem = /stem|steam|робот|инженер|математ|science|technology/i.test(programText);
  const cards = {
    ru: [
      'Сильный педагогический состав',
      (hasEnglish || hasInternational) ? 'Углубленное изучение языков' : null,
      (hasStem || hasInternational || school.type === 'private') ? 'Современная инфраструктура' : null,
      school.admission_test === 'yes' || school.type === 'specialized' || hasInternational ? 'Хорошая подготовка к поступлению' : null
    ],
    kz: [
      'Күшті педагогикалық құрам',
      (hasEnglish || hasInternational) ? 'Тілдерді тереңдетіп оқу' : null,
      (hasStem || hasInternational || school.type === 'private') ? 'Заманауи инфрақұрылым' : null,
      school.admission_test === 'yes' || school.type === 'specialized' || hasInternational ? 'Оқуға түсуге жақсы дайындық' : null
    ],
    en: [
      'Strong teaching team',
      (hasEnglish || hasInternational) ? 'Advanced language learning' : null,
      (hasStem || hasInternational || school.type === 'private') ? 'Modern infrastructure' : null,
      school.admission_test === 'yes' || school.type === 'specialized' || hasInternational ? 'Good admissions preparation' : null
    ]
  };
  return cards[language].filter(Boolean);
};

const hasLargeClassSize = (classSize) => /25|26|27|28|29|30|large|varies|capacity|мест|орын/i.test(String(classSize));

const getSchoolRecommendationExplanation = (school, language, formatter, t) => {
  const localizedDistrict = getLocalizedEnumLabel('districts', school.district, language);
  const localizedType = getLocalizedEnumLabel('schoolTypes', school.type, language);
  const localizedLanguages = getLocalizedSchoolValue(school.languages, language);
  const localizedPrice = formatPrice(school.tuition_fee, formatter, t);
  const localizedClassSize = getLocalizedSchoolValue(school.class_size, language);
  const localizedAdmission = getLocalizedSchoolValue(school.admission_requirements, language);
  const whyLabels = {
    ru: [
      `✓ Район: ${localizedDistrict}`,
      `✓ Тип школы: ${localizedType}`,
      `✓ Бюджет: ${localizedPrice}`,
      `✓ Языки обучения: ${localizedLanguages}`,
      school.after_school_program === 'yes' ? '✓ Есть продленка' : null,
      school.school_bus === 'yes' ? '✓ Есть школьный автобус' : null,
      school.admission_test === 'no' ? '✓ Поступление без отдельного теста' : `✓ Требования к поступлению описаны: ${localizedAdmission}`
    ],
    kz: [
      `✓ Аудан: ${localizedDistrict}`,
      `✓ Мектеп түрі: ${localizedType}`,
      `✓ Бюджет: ${localizedPrice}`,
      `✓ Оқыту тілдері: ${localizedLanguages}`,
      school.after_school_program === 'yes' ? '✓ Сабақтан кейінгі бағдарлама бар' : null,
      school.school_bus === 'yes' ? '✓ Мектеп автобусы бар' : null,
      school.admission_test === 'no' ? '✓ Жеке тестсіз қабылдау' : `✓ Қабылдау талаптары сипатталған: ${localizedAdmission}`
    ],
    en: [
      `✓ District: ${localizedDistrict}`,
      `✓ School type: ${localizedType}`,
      `✓ Budget: ${localizedPrice}`,
      `✓ Instruction languages: ${localizedLanguages}`,
      school.after_school_program === 'yes' ? '✓ Has after-school program' : null,
      school.school_bus === 'yes' ? '✓ Has school bus' : null,
      school.admission_test === 'no' ? '✓ Admission without a separate test' : `✓ Admission requirements are listed: ${localizedAdmission}`
    ]
  };
  const concernLabels = {
    ru: [
      school.admission_test === 'yes' ? '⚠ Возможен конкурсный процесс поступления' : null,
      school.after_school_program !== 'yes' ? `⚠ Продленка: ${getLocalizedEnumLabel('yesNoUnknown', school.after_school_program, language)}` : null,
      school.school_bus !== 'yes' ? `⚠ Школьный автобус: ${getLocalizedEnumLabel('yesNoUnknown', school.school_bus, language)}` : null,
      hasLargeClassSize(localizedClassSize) ? `⚠ Проверьте наполняемость классов: ${localizedClassSize}` : null
    ],
    kz: [
      school.admission_test === 'yes' ? '⚠ Конкурстық қабылдау процесі болуы мүмкін' : null,
      school.after_school_program !== 'yes' ? `⚠ Сабақтан кейінгі бағдарлама: ${getLocalizedEnumLabel('yesNoUnknown', school.after_school_program, language)}` : null,
      school.school_bus !== 'yes' ? `⚠ Мектеп автобусы: ${getLocalizedEnumLabel('yesNoUnknown', school.school_bus, language)}` : null,
      hasLargeClassSize(localizedClassSize) ? `⚠ Сынып көлемін нақтылаңыз: ${localizedClassSize}` : null
    ],
    en: [
      school.admission_test === 'yes' ? '⚠ Competitive admission process may be required' : null,
      school.after_school_program !== 'yes' ? `⚠ After-school program: ${getLocalizedEnumLabel('yesNoUnknown', school.after_school_program, language)}` : null,
      school.school_bus !== 'yes' ? `⚠ School bus: ${getLocalizedEnumLabel('yesNoUnknown', school.school_bus, language)}` : null,
      hasLargeClassSize(localizedClassSize) ? `⚠ Confirm class size: ${localizedClassSize}` : null
    ]
  };
  const why = whyLabels[language].filter(Boolean).slice(0, 7);
  const concerns = concernLabels[language].filter(Boolean);
  return { score: Math.max(72, Math.min(98, 100 - concerns.length * 6)), why, concerns: concerns.length > 0 ? concerns : [language === 'en' ? 'No major concerns listed in the database' : language === 'kz' ? 'Базада маңызды ескерту көрсетілмеген' : 'В базе нет существенных предупреждений'] };
};

export function generateStaticParams() {
  return schools.map((school) => ({ slug: getSchoolSlug(school) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const school = schools.find((item) => getSchoolSlug(item) === slug);

  if (!school) {
    return {
      title: getBrandTitle('School not found')
    };
  }

  return {
    title: getBrandTitle(getLocalizedSchoolValue(school.name, defaultLanguage)),
    description: getLocalizedSchoolValue(school.description, defaultLanguage)
  };
}

const getProfileList = (profile, key, language) => getLocalizedList(profile?.[key], language);
const getProfileText = (profile, key, language) => getLocalizedSchoolValue(profile?.[key], language);
const normalizeUrl = (url) => (hasValue(url) ? String(url).trim() : '');

function SchoolHero({ school, name, type, district, languages, rating, twoGisUrl, t }) {
  return <header className="school-passport__hero"><div><p className="hero__kicker">{t.pageKicker}</p><h1>{name}</h1><div className="school-passport__meta">{[type, district, languages].filter(hasValue).map((item) => <span key={item}>{item}</span>)}</div>{rating.rating !== null ? <div className="school-detail__rating"><span>{t.passport.openSourceRating}</span><strong>⭐ {formatAverageRating(rating.rating)}</strong>{rating.reviewsCount !== null ? <span>{t.ratingBasedOnReviews(rating.reviewsCount)}</span> : null}</div> : null}</div><div className="school-detail__actions"><FavoriteButton schoolId={school.id} labels={t.favorite} className="favorite-button--detail" /><CompareButton schoolId={school.id} labels={{ add: t.passport.addToCompare, remove: t.passport.removeFromCompare }} />{normalizeUrl(twoGisUrl) ? <a className="button-link" href={twoGisUrl} target="_blank" rel="noopener noreferrer">{t.openIn2Gis}</a> : null}</div></header>;
}

function SchoolSummary({ summary, t }) {
  return hasValue(summary) ? <section className="school-detail__section school-passport__summary" aria-labelledby="summary-title"><h2 id="summary-title">{t.passport.quickSummary}</h2><p>{summary}</p></section> : null;
}

function SchoolQuickFacts({ facts, t }) {
  const visibleFacts = facts.filter((fact) => hasValue(fact.value));
  return visibleFacts.length ? <section className="school-detail__section" aria-labelledby="facts-title"><h2 id="facts-title">{t.passport.quickFacts}</h2><dl className="school-detail__quick-facts">{visibleFacts.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{Array.isArray(value) ? value.join(', ') : value}</dd></div>)}</dl></section> : null;
}

function SchoolProfileTags({ tags, t }) {
  return tags.length ? <section className="school-detail__section" aria-labelledby="profile-tags-title"><h2 id="profile-tags-title">{t.passport.educationProfile}</h2><div className="program-list">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div></section> : null;
}

function ParentReviewSummary({ title, items, note, variant = 'positive' }) {
  return items.length ? <section className="school-detail__section" aria-labelledby={`${variant}-title`}><h2 id={`${variant}-title`}>{title}</h2><div className={`school-detail__decision-grid school-detail__decision-grid--${variant === 'warning' ? 'cons' : 'pros'}`}>{items.map((item) => <article key={item}>{item}</article>)}</div>{note ? <p className="school-detail__note">{note}</p> : null}</section> : null;
}

function SchoolFitSection({ title, items, variant = 'soft' }) {
  return items.length ? <section className={`school-detail__section school-fit school-fit--${variant}`} aria-labelledby={`${variant}-fit-title`}><h2 id={`${variant}-fit-title`}>{title}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section> : null;
}

function AdmissionRequirements({ items, t }) {
  return items.length ? <SchoolFitSection title={t.passport.admission} items={items} variant="admission" /> : null;
}

function SchoolSources({ contactCards, sources, lastVerifiedAt, t, language }) {
  const verified = formatDataUpdateDate(lastVerifiedAt, language) || lastVerifiedAt;
  if (!contactCards.length && !sources.length && !verified) return null;
  return <section className="school-detail__section" aria-labelledby="sources-title"><h2 id="sources-title">{t.passport.contactsAndSources}</h2>{contactCards.length ? <div className="school-detail__contacts">{contactCards.map(([label, value, href]) => <article key={label} className="school-detail__contact-card"><span>{label}</span>{href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>{value}</a> : <strong>{value}</strong>}</article>)}</div> : null}{sources.length || verified ? <div className="school-sources"><h3>{t.passport.sourcesAndFreshness}</h3>{sources.length ? <ul>{sources.map((source) => <li key={`${source.name}-${source.url ?? ''}`}>{source.url ? <a href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a> : <span>{source.name}</span>}{hasValue(source.rating) ? ` — ${t.fields.rating.toLowerCase()} ${source.rating}` : ''}{hasValue(source.reviewsCount) ? `, ${t.reviewCount(source.reviewsCount)}` : ''}</li>)}</ul> : null}{verified ? <p><strong>{t.passport.lastVerified}:</strong> <time dateTime={lastVerifiedAt}>{verified}</time></p> : null}<p className="school-detail__note">{t.passport.trustNote}</p></div> : null}</section>;
}

export default async function SchoolDetailPage({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const language = getLanguage(resolvedSearchParams?.lang);
  const t = translations[language];
  const school = schools.find((item) => getSchoolSlug(item) === slug);

  if (!school) {
    notFound();
  }

  const moneyFormatter = getMoneyFormatter(language);
  const localizedName = getLocalizedSchoolValue(school.name, language);
  const localizedDescription = getLocalizedSchoolValue(school.description, language);
  const localizedPrograms = getLocalizedSchoolValue(school.programs, language);
  const localizedAdmissionRequirements = getLocalizedSchoolValue(school.admission_requirements, language);
  const localizedSchoolFormat = getLocalizedSchoolValue(school.school_type, language);
  const localizedLanguages = getLocalizedSchoolValue(school.languages, language);
  const localizedClassSize = getLocalizedSchoolValue(school.class_size, language);
  const localizedAddress = getLocalizedSchoolValue(school.address, language);
  const schoolEmail = getSchoolEmail(school);
  const twoGisUrl = getTwoGisUrl(school, localizedAddress, localizedName);
  const localizedDistrict = getLocalizedEnumLabel('districts', school.district, language);
  const localizedSchoolType = getLocalizedEnumLabel('schoolTypes', school.type, language);
  const heroSchoolType = getHeroSchoolType(school, language);
  const schoolImages = getSchoolImages(school, localizedName, t);
  const heroImage = schoolImages[0];
  const { imageSource, imageStatus } = getSchoolImageMetadata(school);
  const imageSourceName = getLocalizedSchoolValue(imageSource?.localized_name, language) || imageSource?.name;
  const ratingStats = getSchoolRatingStats(school);
  const displayRating = getSchoolDisplayRating(school, ratingStats);
  const reviewSummary = getReviewIntegrationSummary(school);
  const parentPros = getLocalizedList(reviewSummary.pros, language);
  const parentCons = getLocalizedList(reviewSummary.cons, language);
  const lastDataUpdate = formatDataUpdateDate(reviewSummary.lastUpdatedAt ?? school.updatedAt ?? school.metadata?.updatedAt, language);
  const insightKeys = getSchoolInsightKeys(school);
  const recommendationExplanation = getSchoolRecommendationExplanation(school, language, moneyFormatter, t);
  const studentCount = getStudentCount(school);
  const languageBadges = getInstructionLanguageBadges(school);
  const tuitionFee = formatPrice(school.tuition_fee, moneyFormatter, t);
  const detailRows = [
    ['📍', t.fields.district, localizedDistrict],
    ['🎓', t.fields.language, localizedLanguages],
    ['💰', t.fields.tuitionFee, tuitionFee],
    ['👨‍🎓', t.studentsCount, studentCount],
    ['🏫', t.fields.schoolType, localizedSchoolType]
  ].filter(([, , detail]) => hasValue(detail));
  const benefitCards = [...new Set([...parentPros, ...getDefaultBenefitCards(school, language, localizedPrograms)])].filter(hasValue);
  const considerationCards = parentCons.filter(hasValue);
  const profile = school.profile ?? {};
  const summary = getProfileText(profile, 'summary', language);
  const profileTags = [...new Set([...getLocalizedList(school.direction, language), ...getProfileList(profile, 'schoolProfileTags', language)])].filter(hasValue);
  const parentHighlights = getProfileList(profile, 'parentHighlights', language);
  const considerations = getProfileList(profile, 'considerations', language);
  const bestFor = getProfileList(profile, 'bestFor', language);
  const mayNotFit = getProfileList(profile, 'mayNotFit', language);
  const admissionItems = getProfileList(profile, 'admissionRequirements', language);
  const grades = getLocalizedSchoolValue(school.grades, language);
  const tuition = getLocalizedSchoolValue(school.tuition, language) || tuitionFee;
  const officialWebsite = normalizeUrl(school.officialWebsite ?? school.website);
  const instagramUrl = normalizeUrl(school.instagramUrl);
  const schoolTwoGisUrl = normalizeUrl(school.twoGisUrl) || twoGisUrl;
  const quickFacts = [
    { label: t.fields.schoolType, value: localizedSchoolType },
    { label: t.fields.district, value: localizedDistrict },
    { label: t.fields.language, value: localizedLanguages },
    { label: t.passport.grades, value: grades },
    { label: t.fields.tuitionFee, value: tuition },
    { label: t.passport.direction, value: profileTags }
  ];
  const profileSources = Array.isArray(profile.reviewSources) ? profile.reviewSources.filter((source) => source?.name) : [];
  const sourceItems = profileSources.length > 0 ? profileSources : (Array.isArray(school.sources) ? school.sources.map((source) => ({ name: getLocalizedSchoolValue(source.localized_name, language) || source.name, url: source.url })) : []);
  const contactCards = [
    [t.fields.address, hasValue(localizedAddress) ? localizedAddress : '', null],
    [t.fields.phone, school.phone, hasValue(school.phone) ? `tel:${formatPhoneLink(school.phone)}` : null],
    [t.passport.officialWebsite, officialWebsite, officialWebsite],
    [t.passport.instagram, instagramUrl, instagramUrl],
    [t.openIn2Gis, t.openIn2Gis, schoolTwoGisUrl]
  ].filter(([, value]) => hasValue(value));

  return (
    <main>
      <nav className="school-detail__topbar" aria-label={t.languageSwitcherLabel}>
        <a className="back-link" href={`/?lang=${language}`}>← {t.backToCatalog}</a>
        <div className="language-switcher">
          {languageOptions.map(({ code, label }) => (
            <a key={code} className={language === code ? 'language-switcher__button language-switcher__button--active' : 'language-switcher__button'} aria-current={language === code ? 'page' : undefined} href={`/schools/${slug}?lang=${code}`}>{label}</a>
          ))}
        </div>
      </nav>
      <article className="school-detail school-passport">
        <SchoolHero school={school} name={localizedName} type={heroSchoolType} district={localizedDistrict} languages={localizedLanguages} rating={displayRating} twoGisUrl={schoolTwoGisUrl} t={t} />
        <SchoolSummary summary={summary} t={t} />
        <SchoolQuickFacts facts={quickFacts} t={t} />
        <SchoolProfileTags tags={profileTags} t={t} />
        <ParentReviewSummary title={t.passport.parentHighlights} items={parentHighlights} note={t.passport.reviewSummaryNote} />
        <ParentReviewSummary title={t.passport.considerations} items={considerations} variant="warning" />
        <SchoolFitSection title={t.passport.bestFor} items={bestFor} variant="best" />
        <SchoolFitSection title={t.passport.mayNotFit} items={mayNotFit} variant="soft" />
        <AdmissionRequirements items={admissionItems} t={t} />
        <SchoolSources contactCards={contactCards} sources={sourceItems} lastVerifiedAt={profile.lastVerifiedAt ?? reviewSummary.lastUpdatedAt ?? school.updatedAt ?? school.metadata?.updatedAt} t={t} language={language} />
      </article>
    </main>
  );
}
