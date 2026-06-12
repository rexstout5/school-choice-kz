import { notFound } from 'next/navigation';
import { getLocalizedEnumLabel, getLocalizedSchoolValue, schools } from '../../../src/data/schools.js';

const defaultLanguage = 'ru';

const translations = {
  ru: {
    backToSchools: 'Назад к школам',
    pageKicker: 'Профиль школы',
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
    freePublicSchool: 'Бесплатная государственная школа',
    priceUnknown: 'Стоимость уточняется',
    perMonth: 'в месяц',
    notYetRated: 'Пока нет оценки'
  },
  kz: {
    backToSchools: 'Мектептерге оралу',
    pageKicker: 'Мектеп профилі',
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
    freePublicSchool: 'Тегін мемлекеттік мектеп',
    priceUnknown: 'Құны нақтыланады',
    perMonth: 'айына',
    notYetRated: 'Әзірге баға жоқ'
  },
  en: {
    backToSchools: 'Back to schools',
    pageKicker: 'School profile',
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
    freePublicSchool: 'Free public school',
    priceUnknown: 'Tuition to be confirmed',
    perMonth: 'month',
    notYetRated: 'Not yet rated'
  }
};

const getLanguage = (lang) => (lang && translations[lang] ? lang : defaultLanguage);
const formatPhoneLink = (phone) => phone.replace(/[^+\d]/g, '');

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
const formatRating = (rating, t) => (rating > 0 ? `${rating.toFixed(1)} / 5` : t.notYetRated);
const formatCityDistrict = (school, language) =>
  `${getLocalizedEnumLabel('cities', school.city, language)} • ${getLocalizedEnumLabel('districts', school.district, language)}`;

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
    title: `${getLocalizedSchoolValue(school.name, defaultLanguage)} | School Choice Kazakhstan`,
    description: getLocalizedSchoolValue(school.description, defaultLanguage)
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
  const localizedName = getLocalizedSchoolValue(school.name, language);
  const localizedDescription = getLocalizedSchoolValue(school.description, language);
  const localizedPrograms = getLocalizedSchoolValue(school.programs, language);
  const localizedAdmissionRequirements = getLocalizedSchoolValue(school.admission_requirements, language);
  const localizedSchoolType = getLocalizedSchoolValue(school.school_type, language);
  const localizedLanguages = getLocalizedSchoolValue(school.languages, language);
  const localizedClassSize = getLocalizedSchoolValue(school.class_size, language);
  const localizedAddress = getLocalizedSchoolValue(school.address, language);
  const localizedOfficialName = language === 'en' ? school.official_name : localizedName;
  const localizedLocalName = language === 'en' ? school.official_name_local : localizedName;
  const details = [
    [t.fields.officialName, localizedOfficialName],
    [t.fields.localName, localizedLocalName],
    [t.fields.schoolType, localizedSchoolType],
    [t.fields.language, localizedLanguages],
    [t.fields.tuitionFee, formatPrice(school.tuition_fee, moneyFormatter, t)],
    [t.fields.priceStatus, getLocalizedEnumLabel('priceStatuses', school.price_status, language)],
    [t.fields.dataStatus, getLocalizedEnumLabel('dataStatuses', school.data_status, language)],
    [t.fields.afterSchoolProgram, getLocalizedEnumLabel('yesNoUnknown', school.after_school_program, language)],
    [t.fields.schoolBus, getLocalizedEnumLabel('yesNoUnknown', school.school_bus, language)],
    [t.fields.admissionTest, getLocalizedEnumLabel('yesNoUnknown', school.admission_test, language)],
    [t.fields.classSize, localizedClassSize],
    [t.fields.admissionRequirements, localizedAdmissionRequirements],
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
            <p className="school-card__eyebrow">{formatCityDistrict(school, language)}</p>
            <h1>{localizedName}</h1>
            <p>{localizedDescription}</p>
          </div>
          <span className={`badge badge--${school.type}`}>{getLocalizedEnumLabel('schoolTypes', school.type, language)}</span>
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
            {localizedPrograms.map((program) => (
              <span key={program}>{program}</span>
            ))}
          </div>
        </section>

        <section className="school-detail__section" aria-labelledby="contacts-title">
          <h2 id="contacts-title">{t.contactsTitle}</h2>
          <dl className="school-card__facts school-detail__facts">
            <div>
              <dt>{t.fields.address}</dt>
              <dd>{localizedAddress}</dd>
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
