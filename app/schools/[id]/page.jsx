import { notFound } from 'next/navigation';
import { schools } from '../../../src/data/schools.js';

const defaultLanguage = 'ru';

const translations = {
  ru: {
    backToSchools: 'Назад к школам',
    pageKicker: 'Профиль школы',
    cityDistrict: (school) => `${school.city} • ${school.district}`,
    typeOptions: {
      public: 'Государственная',
      private: 'Частная'
    },
    detailsTitle: 'Ключевые сведения',
    programsTitle: 'Программы',
    contactsTitle: 'Контакты',
    sourcesTitle: 'Источники данных',
    fields: {
      officialName: 'Официальное название',
      localName: 'Локальное название',
      schoolType: 'Тип школы',
      language: 'Язык обучения',
      tuitionFee: 'Стоимость обучения',
      priceStatus: 'Статус цены',
      dataStatus: 'Статус данных',
      afterSchoolProgram: 'Продленка',
      schoolBus: 'Школьный автобус',
      admissionTest: 'Вступительный тест',
      classSize: 'Размер класса',
      admissionRequirements: 'Требования к поступлению',
      rating: 'Рейтинг',
      address: 'Адрес',
      phone: 'Телефон',
      website: 'Сайт'
    },
    priceStatuses: {
      verified: 'Подтверждена',
      estimated: 'Оценочная',
      unknown: 'Неизвестна'
    },
    dataStatuses: {
      verified: 'Проверены',
      partially_verified: 'Частично проверены',
      needs_review: 'Нужна проверка'
    },
    statusValues: {
      yes: 'Да',
      no: 'Нет',
      unknown: 'Неизвестно'
    },
    freePublicSchool: 'Бесплатная государственная школа',
    perMonth: 'в месяц',
    notYetRated: 'Пока нет оценки'
  },
  kz: {
    backToSchools: 'Мектептерге оралу',
    pageKicker: 'Мектеп профилі',
    cityDistrict: (school) => `${school.city} • ${school.district}`,
    typeOptions: {
      public: 'Мемлекеттік',
      private: 'Жеке'
    },
    detailsTitle: 'Негізгі мәліметтер',
    programsTitle: 'Бағдарламалар',
    contactsTitle: 'Байланыс',
    sourcesTitle: 'Дерек көздері',
    fields: {
      officialName: 'Ресми атауы',
      localName: 'Жергілікті атауы',
      schoolType: 'Мектеп түрі',
      language: 'Оқыту тілі',
      tuitionFee: 'Оқу ақысы',
      priceStatus: 'Баға мәртебесі',
      dataStatus: 'Дерек мәртебесі',
      afterSchoolProgram: 'Сабақтан кейінгі бағдарлама',
      schoolBus: 'Мектеп автобусы',
      admissionTest: 'Қабылдау тесті',
      classSize: 'Сынып көлемі',
      admissionRequirements: 'Қабылдау талаптары',
      rating: 'Рейтинг',
      address: 'Мекенжай',
      phone: 'Телефон',
      website: 'Сайт'
    },
    priceStatuses: {
      verified: 'Расталған',
      estimated: 'Шамамен',
      unknown: 'Белгісіз'
    },
    dataStatuses: {
      verified: 'Тексерілген',
      partially_verified: 'Ішінара тексерілген',
      needs_review: 'Тексеру қажет'
    },
    statusValues: {
      yes: 'Иә',
      no: 'Жоқ',
      unknown: 'Белгісіз'
    },
    freePublicSchool: 'Тегін мемлекеттік мектеп',
    perMonth: 'айына',
    notYetRated: 'Әзірге баға жоқ'
  },
  en: {
    backToSchools: 'Back to schools',
    pageKicker: 'School profile',
    cityDistrict: (school) => `${school.city} • ${school.district}`,
    typeOptions: {
      public: 'Public',
      private: 'Private'
    },
    detailsTitle: 'Key details',
    programsTitle: 'Programs',
    contactsTitle: 'Contacts',
    sourcesTitle: 'Data sources',
    fields: {
      officialName: 'Official name',
      localName: 'Local name',
      schoolType: 'School type',
      language: 'Instruction language',
      tuitionFee: 'Tuition fee',
      priceStatus: 'Price status',
      dataStatus: 'Data status',
      afterSchoolProgram: 'After-school program',
      schoolBus: 'School bus',
      admissionTest: 'Admission test',
      classSize: 'Class size',
      admissionRequirements: 'Admission requirements',
      rating: 'Rating',
      address: 'Address',
      phone: 'Phone',
      website: 'Website'
    },
    priceStatuses: {
      verified: 'Verified',
      estimated: 'Estimated',
      unknown: 'Unknown'
    },
    dataStatuses: {
      verified: 'Verified',
      partially_verified: 'Partially verified',
      needs_review: 'Needs review'
    },
    statusValues: {
      yes: 'Yes',
      no: 'No',
      unknown: 'Unknown'
    },
    freePublicSchool: 'Free public school',
    perMonth: 'month',
    notYetRated: 'Not yet rated'
  }
};

const getLanguage = (lang) => (lang && translations[lang] ? lang : defaultLanguage);
const getTranslatedOption = (translationMap, option) => translationMap[option] ?? option;
const formatPhoneLink = (phone) => phone.replace(/[^+\d]/g, '');

const getMoneyFormatter = (language) =>
  new Intl.NumberFormat(language === 'en' ? 'en-US' : language === 'kz' ? 'kk-KZ' : 'ru-RU', {
    style: 'currency',
    currency: 'KZT',
    maximumFractionDigits: 0
  });

const formatPrice = (price, formatter, t) => (price === 0 ? t.freePublicSchool : `${formatter.format(price)} / ${t.perMonth}`);
const formatRating = (rating, t) => (rating > 0 ? `${rating.toFixed(1)} / 5` : t.notYetRated);

export function generateStaticParams() {
  return schools.map((school) => ({ id: school.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const school = schools.find((item) => item.id === id);

  if (!school) {
    return {
      title: 'School not found | School Choice Kazakhstan'
    };
  }

  return {
    title: `${school.name} | School Choice Kazakhstan`,
    description: school.description
  };
}

export default async function SchoolDetailPage({ params, searchParams }) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const language = getLanguage(resolvedSearchParams?.lang);
  const t = translations[language];
  const school = schools.find((item) => item.id === id);

  if (!school) {
    notFound();
  }

  const moneyFormatter = getMoneyFormatter(language);
  const details = [
    [t.fields.officialName, school.official_name],
    [t.fields.localName, school.official_name_local],
    [t.fields.schoolType, school.school_type],
    [t.fields.language, school.language],
    [t.fields.tuitionFee, formatPrice(school.tuition_fee, moneyFormatter, t)],
    [t.fields.priceStatus, getTranslatedOption(t.priceStatuses, school.price_status)],
    [t.fields.dataStatus, getTranslatedOption(t.dataStatuses, school.data_status)],
    [t.fields.afterSchoolProgram, getTranslatedOption(t.statusValues, school.after_school_program)],
    [t.fields.schoolBus, getTranslatedOption(t.statusValues, school.school_bus)],
    [t.fields.admissionTest, getTranslatedOption(t.statusValues, school.admission_test)],
    [t.fields.classSize, school.class_size],
    [t.fields.admissionRequirements, school.admission_requirements],
    [t.fields.rating, formatRating(school.rating, t)]
  ];

  return (
    <main>
      <a className="back-link" href={`/?lang=${language}`}>
        ← {t.backToSchools}
      </a>

      <article className="school-detail">
        <header className="school-detail__hero">
          <div>
            <p className="hero__kicker">{t.pageKicker}</p>
            <p className="school-card__eyebrow">{t.cityDistrict(school)}</p>
            <h1>{school.name}</h1>
            <p>{school.description}</p>
          </div>
          <span className={`badge badge--${school.type}`}>{getTranslatedOption(t.typeOptions, school.type)}</span>
        </header>

        <section className="school-detail__section" aria-labelledby="details-title">
          <h2 id="details-title">{t.detailsTitle}</h2>
          <dl className="school-card__facts school-detail__facts">
            {details.map(([term, detail]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="school-detail__section" aria-labelledby="programs-title">
          <h2 id="programs-title">{t.programsTitle}</h2>
          <div className="program-list">
            {school.programs.map((program) => (
              <span key={program}>{program}</span>
            ))}
          </div>
        </section>

        <section className="school-detail__section" aria-labelledby="contacts-title">
          <h2 id="contacts-title">{t.contactsTitle}</h2>
          <dl className="school-card__facts school-detail__facts">
            <div>
              <dt>{t.fields.address}</dt>
              <dd>{school.address}</dd>
            </div>
            <div>
              <dt>{t.fields.phone}</dt>
              <dd>
                <a href={`tel:${formatPhoneLink(school.phone)}`}>{school.phone}</a>
              </dd>
            </div>
            <div>
              <dt>{t.fields.website}</dt>
              <dd>
                <a href={school.website} target="_blank" rel="noreferrer">
                  {school.website}
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <section className="school-detail__section" aria-labelledby="sources-title">
          <h2 id="sources-title">{t.sourcesTitle}</h2>
          <ul className="source-list">
            {school.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
