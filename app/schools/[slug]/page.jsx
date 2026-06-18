import { notFound } from 'next/navigation';
import { getLocalizedEnumLabel, getLocalizedSchoolValue, schools } from '../../../src/data/schools.js';
import FavoriteButton from '../../../src/components/FavoriteButton.jsx';
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
  const contactCards = [
    [t.fields.address, hasValue(localizedAddress) ? localizedAddress : '', null],
    [t.fields.phone, school.phone, hasValue(school.phone) ? `tel:${formatPhoneLink(school.phone)}` : null],
    [t.fields.website, school.website, hasValue(school.website) ? school.website : null],
    [t.openIn2Gis, t.openIn2Gis, twoGisUrl]
  ].filter(([, value]) => hasValue(value));

  return (
    <main>
      <nav className="school-detail__topbar" aria-label={t.languageSwitcherLabel}>
        <a className="back-link" href={`/?lang=${language}`}>
          ← {t.backToCatalog}
        </a>
        <div className="language-switcher">
          {languageOptions.map(({ code, label }) => (
            <a
              key={code}
              className={language === code ? 'language-switcher__button language-switcher__button--active' : 'language-switcher__button'}
              aria-current={language === code ? 'page' : undefined}
              href={`/schools/${slug}?lang=${code}`}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <article className="school-detail">
        <header className="school-detail__hero">
          <div className="school-detail__hero-copy">
            <p className="hero__kicker">{t.pageKicker}</p>
            <p className="school-card__eyebrow">{heroSchoolType}</p>
            <h1>{localizedName}</h1>
            {languageBadges.length > 0 ? (
              <div className="school-detail__language-badges" aria-label={t.fields.language}>
                {languageBadges.map((badge) => <span key={badge}>{badge}</span>)}
              </div>
            ) : null}
            {displayRating.rating !== null ? (
              <div className="school-detail__rating" aria-label={`${t.fields.rating}: ${formatAverageRating(displayRating.rating)}`}>
                <strong>⭐ {formatAverageRating(displayRating.rating)}</strong>
                {displayRating.reviewsCount !== null ? <span>{t.ratingBasedOnReviews(displayRating.reviewsCount)}</span> : null}
              </div>
            ) : null}
            <div className="school-detail__actions">
              <FavoriteButton schoolId={school.id} labels={t.favorite} className="favorite-button--detail" />
              <a className="button-link" href={getReportContributionUrl(slug, language)}>
                {t.reportIncorrectInfo}
              </a>
            </div>
          </div>
          <figure className={heroImage.isFallback ? 'school-detail__media school-detail__media--fallback' : 'school-detail__media'}>
            <SchoolImageWithFallback src={heroImage.src} alt={getImageAlt(heroImage, t.fallbackImageAlt, language)} schoolName={localizedName} loading="eager" decoding="async" />
            {heroImage.isFallback ? <figcaption>{t.imagePlaceholder}</figcaption> : null}
          </figure>
        </header>

        <section className="school-detail__section" aria-labelledby="gallery-title">
          <div className="school-detail__section-heading">
            <h2 id="gallery-title">{t.galleryTitle}</h2>
            <p>{t.galleryDescription}</p>
          </div>
          <div className="school-gallery">
            {schoolImages.map((image, index) => (
              <figure key={`${image.src}-${index}`} className={image.isFallback ? 'school-gallery__item school-gallery__item--fallback' : 'school-gallery__item'}>
                <SchoolImageWithFallback src={image.src} alt={getImageAlt(image, t.fallbackImageAlt, language)} schoolName={localizedName} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
                {image.caption ? <figcaption>{getLocalizedSchoolValue(image.caption, language)}</figcaption> : null}
              </figure>
            ))}
          </div>
          <dl className="image-source-list">
            <div>
              <dt>{t.imageStatus}</dt>
              <dd>{getLocalizedEnumLabel('imageStatuses', imageStatus, language)}</dd>
            </div>
            {imageSourceName ? (
              <div>
                <dt>{t.imageSource}</dt>
                <dd>
                  {imageSource?.url ? (
                    <a href={imageSource.url} target="_blank" rel="noreferrer">
                      {imageSourceName}
                    </a>
                  ) : (
                    imageSourceName
                  )}
                </dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="school-detail__section" aria-labelledby="details-title">
          <h2 id="details-title">{t.detailsTitle}</h2>
          <dl className="school-detail__quick-facts">
            {detailRows.map(([icon, term, detail]) => (
              <div key={term}>
                <dt><span aria-hidden="true">{icon}</span>{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        {benefitCards.length > 0 ? (
          <section className="school-detail__section" aria-labelledby="benefits-title">
            <h2 id="benefits-title">{t.benefitsTitle}</h2>
            <div className="school-detail__decision-grid school-detail__decision-grid--pros">
              {benefitCards.map((item) => <article key={item}>{item}</article>)}
            </div>
          </section>
        ) : null}

        {considerationCards.length > 0 ? (
          <section className="school-detail__section" aria-labelledby="parent-cons-title">
            <h2 id="parent-cons-title">{t.parentConsiderationsTitle}</h2>
            <div className="school-detail__decision-grid school-detail__decision-grid--cons">
              {considerationCards.map((item) => <article key={item}>{item}</article>)}
            </div>
          </section>
        ) : null}

        <section className="school-detail__section" aria-labelledby="description-title">
          <h2 id="description-title">{t.aboutTitle}</h2>
          <p className="school-detail__text">{localizedDescription}</p>
        </section>

        <section className="school-detail__section" aria-labelledby="programs-title">
          <h2 id="programs-title">{t.programsTitle}</h2>
          <div className="program-list">
            {localizedPrograms.map((program) => (
              <span key={program}>{program}</span>
            ))}
          </div>
        </section>

        <section className="school-detail__section" aria-labelledby="suitable-title">
          <h2 id="suitable-title">{t.suitableTitle}</h2>
          <div className="program-list">
            {insightKeys.map((key) => (
              <span key={key}>{t.insightTags[key]}</span>
            ))}
          </div>
        </section>

        <section className="school-detail__section recommendation-card" aria-labelledby="recommendation-title">
          <div className="recommendation-card__top">
            <h2 id="recommendation-title">{t.recommendationTitle}</h2>
            <div className="match-meter" aria-label={`${recommendationExplanation.score}% ${t.match}`}>
              <strong>{recommendationExplanation.score}%</strong>
              <span>{t.match}</span>
            </div>
          </div>
          <div className="recommendation-card__lists">
            <section>
              <h3>{t.whyTitle}</h3>
              <ul>{recommendationExplanation.why.map((reason) => <li key={reason}>{reason}</li>)}</ul>
            </section>
            <section>
              <h3>{t.concernsTitle}</h3>
              <ul>{recommendationExplanation.concerns.map((concern) => <li key={concern}>{concern}</li>)}</ul>
            </section>
          </div>
        </section>


        {lastDataUpdate ? (
          <section className="school-detail__section school-detail__section--data-update" aria-labelledby="data-update-title">
            <h2 id="data-update-title">{t.lastDataUpdateTitle}</h2>
            <p className="school-detail__text"><time dateTime={reviewSummary.lastUpdatedAt}>{lastDataUpdate}</time></p>
            <p className="school-detail__note">{t.reviewDataPrepared}</p>
          </section>
        ) : null}

        <section className="school-detail__section" aria-labelledby="admission-title">
          <h2 id="admission-title">{t.fields.admissionRequirements}</h2>
          <p className="school-detail__text">{localizedAdmissionRequirements}</p>
        </section>

        <SchoolReviews school={school} schoolId={school.id} labels={t.reviews} language={language} locale={language === 'kz' ? 'kk-KZ' : language === 'en' ? 'en-US' : 'ru-RU'} />

        <section className="school-detail__section" aria-labelledby="contacts-title">
          <h2 id="contacts-title">{t.contactsTitle}</h2>
          <div className="school-detail__contacts">
            {contactCards.map(([label, value, href]) => (
              <article key={label} className="school-detail__contact-card">
                <span>{label}</span>
                {href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>{value}</a> : <strong>{value}</strong>}
              </article>
            ))}
          </div>
        </section>

        <section className="school-detail__section" aria-labelledby="sources-title">
          <h2 id="sources-title">{t.sourcesTitle}</h2>
          <ul className="source-list">
            {school.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {getLocalizedSchoolValue(source.localized_name, language)}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
