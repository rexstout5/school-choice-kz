import { notFound } from 'next/navigation';
import { getLocalizedEnumLabel, getLocalizedSchoolValue, schools } from '../../../src/data/schools.js';
import FavoriteButton from '../../../src/components/FavoriteButton.jsx';
import SchoolReviews from '../../../src/components/SchoolReviews.jsx';
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
    detailsTitle: 'Ключевые сведения',
    programsTitle: 'Программы',
    suitableTitle: 'Кому подойдет эта школа?',
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
    detailsTitle: 'Негізгі мәліметтер',
    programsTitle: 'Бағдарламалар',
    suitableTitle: 'Бұл мектеп кімге қолайлы?',
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
    detailsTitle: 'Key details',
    programsTitle: 'Programs',
    suitableTitle: 'Who is this school suitable for?',
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

const getReportMailto = (schoolName, slug, language) => {
  const subject = encodeURIComponent(`School Choice KZ: incorrect information for ${schoolName}`);
  const body = encodeURIComponent(`School: ${schoolName}\nURL: /schools/${slug}?lang=${language}\n\nPlease describe the incorrect information:\n`);

  return `mailto:info@school-choice.kz?subject=${subject}&body=${body}`;
};

export function generateStaticParams() {
  return schools.map((school) => ({ slug: getSchoolSlug(school) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const school = schools.find((item) => getSchoolSlug(item) === slug);

  if (!school) {
    return {
      title: 'School not found | School Choice Kazakhstan'
    };
  }

  return {
    title: `${getLocalizedSchoolValue(school.name, defaultLanguage)} | School Choice Kazakhstan`,
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
  const schoolImages = getSchoolImages(school, localizedName, t);
  const heroImage = schoolImages[0];
  const { imageSource, imageStatus } = getSchoolImageMetadata(school);
  const imageSourceName = getLocalizedSchoolValue(imageSource?.localized_name, language) || imageSource?.name;
  const ratingStats = getSchoolRatingStats(school);
  const insightKeys = getSchoolInsightKeys(school);
  const detailRows = [
    [t.fields.schoolName, localizedName],
    [t.fields.district, localizedDistrict],
    [t.fields.schoolType, localizedSchoolType],
    [t.fields.schoolFormat, localizedSchoolFormat],
    [t.fields.language, localizedLanguages],
    [t.fields.tuitionFee, formatPrice(school.tuition_fee, moneyFormatter, t)],
    [t.fields.rating, ratingStats.averageRating === null ? t.reviews.notYetRated : `⭐ ${formatAverageRating(ratingStats.averageRating)} / 5 · ${t.ratingSummary[getRatingSummaryKey(ratingStats.averageRating)]}`],
    [t.fields.reviews, `📝 ${t.reviewCount(ratingStats.reviewCount)}`],
    [t.fields.priceStatus, getLocalizedEnumLabel('priceStatuses', school.price_status, language)],
    [t.fields.dataStatus, getLocalizedEnumLabel('dataStatuses', school.data_status, language)],
    [t.fields.afterSchoolProgram, getLocalizedEnumLabel('yesNoUnknown', school.after_school_program, language)],
    [t.fields.schoolBus, getLocalizedEnumLabel('yesNoUnknown', school.school_bus, language)],
    [t.fields.classSize, localizedClassSize]
  ];

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
            <p className="school-card__eyebrow">{localizedDistrict}</p>
            <h1>{localizedName}</h1>
            <p>{localizedDescription}</p>
            <div className="school-detail__actions">
              <FavoriteButton schoolId={school.id} labels={t.favorite} className="favorite-button--detail" />
              <a className="button-link" href={getReportMailto(localizedName, slug, language)}>
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
          <dl className="school-card__facts school-detail__facts">
            {detailRows.map(([term, detail]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="school-detail__section" aria-labelledby="description-title">
          <h2 id="description-title">{t.fields.description}</h2>
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

        <section className="school-detail__section" aria-labelledby="admission-title">
          <h2 id="admission-title">{t.fields.admissionRequirements}</h2>
          <p className="school-detail__text">{localizedAdmissionRequirements}</p>
        </section>

        <SchoolReviews schoolId={school.id} labels={t.reviews} locale={language === 'kz' ? 'kk-KZ' : language === 'en' ? 'en-US' : 'ru-RU'} />

        <section className="school-detail__section" aria-labelledby="contacts-title">
          <h2 id="contacts-title">{t.contactsTitle}</h2>
          <dl className="school-card__facts school-detail__facts">
            <div>
              <dt>{t.fields.address}</dt>
              <dd>{hasValue(localizedAddress) ? localizedAddress : t.missingValue}</dd>
            </div>
            <div>
              <dt>{t.fields.phone}</dt>
              <dd>
                {hasValue(school.phone) ? <a href={`tel:${formatPhoneLink(school.phone)}`}>{school.phone}</a> : t.missingValue}
              </dd>
            </div>
            <div>
              <dt>{t.fields.email}</dt>
              <dd>{hasValue(schoolEmail) ? <a href={`mailto:${schoolEmail}`}>{schoolEmail}</a> : t.missingValue}</dd>
            </div>
            <div>
              <dt>{t.fields.website}</dt>
              <dd>
                {hasValue(school.website) ? (
                  <a href={school.website} target="_blank" rel="noreferrer">
                    {school.website}
                  </a>
                ) : (
                  t.missingValue
                )}
              </dd>
            </div>
          </dl>
          <div className="school-detail__contact-actions">
            <a className="button-link" href={twoGisUrl} target="_blank" rel="noreferrer">
              {t.openIn2Gis}
            </a>
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
