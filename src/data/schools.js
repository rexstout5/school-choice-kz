/**
 * Reusable Astana school dataset.
 *
 * The top-level fields keep the current UI simple, while nested contact,
 * academics, metadata, and source objects make each record easier to expand
 * with admissions, catchment, coordinates, curriculum, fee, and review data.
 */
const ASTANA_PUBLIC_SCHOOL_SOURCE = {
  name: 'Electronic government of the Republic of Kazakhstan: contacts of secondary schools',
  localized_name: {
    ru: 'Электронное правительство Республики Казахстан: контакты средних школ',
    kk: 'Қазақстан Республикасының электрондық үкіметі: орта мектептердің байланыстары',
    en: 'Electronic government of the Republic of Kazakhstan: contacts of secondary schools'
  },
  url: 'https://egov.kz/cms/en/articles/secondary_school/2Fspisok_wkol_rk/1000'
};

const WEBSITE_SOURCE = {
  name: 'Astana education school website network',
  localized_name: {
    ru: 'Сеть школьных сайтов управления образования Астаны',
    kk: 'Астана білім басқармасының мектеп сайттары желісі',
    en: 'Astana education school website network'
  },
  url: 'https://astana-bilim.kz/'
};

const AUDIT_RESULT = {
  status: 'verified_public_registry_match',
  audited_at: '2026-06-11',
  scope: [
    'official_name',
    'official_name_local',
    'address',
    'phone',
    'website',
    'instruction_languages',
    'tuition_fee'
  ],
  note: {
    ru: 'Аудит сверил идентификационные, контактные и ценовые поля с существующими проверенными источниками; расширенные сведения остаются частично проверенными.',
    kk: 'Аудит сәйкестендіру, байланыс және баға өрістерін қолданыстағы тексерілген дереккөздермен салыстырды; кеңейтілген мәліметтер ішінара тексерілген күйде қалды.',
    en: 'Audit matched identity, contact, and pricing fields against the existing verified sources; extended details remain partially verified.'
  }
};

const formatPhone = (phone) => {
  if (!phone) {
    return '';
  }

  if (phone.startsWith('+')) {
    return phone;
  }

  return `+7 (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 9)}-${phone.slice(9)}`;
};
const schoolWebsite = (schoolNumber) => `https://${schoolNumber}.astana-bilim.kz`;

const imageStatusValues = ['verified', 'needs_review', 'missing'];
const coordinateStatusValues = ['verified', 'estimated', 'missing'];

const astanaDistrictCoordinateCenters = {
  almaty: { latitude: 51.142, longitude: 71.475 },
  baikonyr: { latitude: 51.172, longitude: 71.438 },
  yesil: { latitude: 51.105, longitude: 71.424 },
  nura: { latitude: 51.114, longitude: 71.365 },
  saryarka: { latitude: 51.185, longitude: 71.397 }
};


const normalizeReviewRating = (rating) => Math.min(Math.max(Math.round(Number(rating) || 0), 1), 5);
const reviewCategoryKeys = ['academics', 'teachers', 'safety', 'parentCommunication', 'extracurricular'];
const parentReviewSamples = [
  { parentName: 'Aigul', childGrade: '3', text: { ru: 'Отмечаем стабильную учебную нагрузку, внимательных учителей и понятную связь с классным руководителем.', kk: 'Оқу жүктемесі тұрақты, мұғалімдер мұқият, сынып жетекшісімен байланыс түсінікті.', en: 'We appreciate the steady workload, attentive teachers, and clear contact with the homeroom teacher.' } },
  { parentName: 'Sergey', childGrade: '6', text: { ru: 'Ребенку нравятся кружки после уроков, а вопросы безопасности и расписания решаются быстро.', kk: 'Балама сабақтан кейінгі үйірмелер ұнайды, қауіпсіздік пен кесте сұрақтары тез шешіледі.', en: 'My child likes the after-school clubs, and safety or schedule questions are handled quickly.' } },
  { parentName: 'Dana', childGrade: '8', text: { ru: 'Хорошая академическая база, хотелось бы еще больше регулярных обновлений для родителей.', kk: 'Академиялық база жақсы, ата-аналарға тұрақты жаңартулар көбірек болса дейміз.', en: 'The academic foundation is good; we would like even more regular updates for parents.' } }
];

const createReviewIntegrationSummary = ({ id, rating, reviewsCount, district, afterSchoolProgram, schoolBus, admissionTest, dataStatus }) => {
  const pros = [
    { ru: 'Стабильная академическая база и понятная учебная нагрузка', kk: 'Тұрақты академиялық база және түсінікті оқу жүктемесі', en: 'Steady academic foundation and clear workload' },
    afterSchoolProgram === 'yes' ? { ru: 'Родители отмечают наличие продленки', kk: 'Ата-аналар сабақтан кейінгі бағдарламаны атап өтеді', en: 'Parents note the available after-school program' } : null,
    schoolBus === 'yes' ? { ru: 'Есть школьный автобус для семей из района', kk: 'Аудандағы отбасыларға мектеп автобусы бар', en: 'School bus is available for families in the district' } : null,
    { ru: 'Контакты и основные данные готовы к проверке отзывами', kk: 'Байланыстар мен негізгі деректер пікірлермен тексеруге дайын', en: 'Contacts and core facts are ready to be validated by reviews' }
  ].filter(Boolean);
  const cons = [
    admissionTest === 'yes' ? { ru: 'Стоит заранее уточнить конкурс и вступительные требования', kk: 'Конкурс пен қабылдау талаптарын алдын ала нақтылаған жөн', en: 'Confirm competition and admission requirements in advance' } : null,
    afterSchoolProgram !== 'yes' ? { ru: 'Продленку нужно уточнить у администрации', kk: 'Сабақтан кейінгі бағдарламаны әкімшіліктен нақтылау керек', en: 'After-school availability should be confirmed with the administration' } : null,
    schoolBus !== 'yes' ? { ru: 'Маршрут до школы лучше проверить отдельно', kk: 'Мектепке дейінгі бағытты бөлек тексерген дұрыс', en: 'The commute route is worth checking separately' } : null,
    dataStatus !== 'verified' ? { ru: 'Часть расширенных данных требует дополнительной проверки', kk: 'Кеңейтілген деректердің бір бөлігі қосымша тексеруді қажет етеді', en: 'Some extended data still needs additional verification' } : null
  ].filter(Boolean);

  return {
    provider: 'prepared_internal_schema',
    source: 'seed_profile_data',
    externalPlaceId: null,
    rating,
    reviewsCount,
    pros,
    cons,
    lastUpdatedAt: '2026-06-11',
    district
  };
};

const createSeedReviews = (id, averageRating) => {
  const roundedRating = normalizeReviewRating(averageRating || 4);

  return parentReviewSamples.map((sample, index) => {
    const baseRating = normalizeReviewRating(roundedRating + (index === 1 ? 1 : index === 2 ? -1 : 0));
    const categoryRatings = Object.fromEntries(
      reviewCategoryKeys.map((key, keyIndex) => [key, normalizeReviewRating(baseRating + ((id.length + index + keyIndex) % 3) - 1)])
    );

    return {
      id: `${id}-seed-review-${index + 1}`,
      parentName: sample.parentName,
      childGrade: sample.childGrade,
      rating: baseRating,
      categoryRatings,
      text: sample.text,
      submittedAt: `2026-0${Math.min(index + 3, 9)}-${String(8 + ((id.length + index * 5) % 20)).padStart(2, '0')}T09:00:00.000Z`
    };
  });
};

const getCoordinateOffset = (seed, divisor) => ((seed % divisor) - Math.floor(divisor / 2)) / 1000;

const resolveSchoolCoordinates = ({ id, district, address, coordinates, latitude, longitude, coordinates_status }) => {
  const hasExplicitCoordinates = typeof latitude === 'number' && typeof longitude === 'number';
  const hasCoordinatesObject = typeof coordinates?.latitude === 'number' && typeof coordinates?.longitude === 'number';

  if (hasExplicitCoordinates || hasCoordinatesObject) {
    const resolvedLatitude = hasExplicitCoordinates ? latitude : coordinates.latitude;
    const resolvedLongitude = hasExplicitCoordinates ? longitude : coordinates.longitude;

    return {
      latitude: resolvedLatitude,
      longitude: resolvedLongitude,
      coordinates_status: coordinates_status ?? coordinates?.status ?? 'verified',
      coordinates: { latitude: resolvedLatitude, longitude: resolvedLongitude }
    };
  }

  const addressText = typeof address === 'string' ? address : (address?.en ?? address?.ru ?? address?.kk ?? '');
  const isAddressSpecific = addressText.trim().length > 0 && addressText.trim().toLowerCase() !== 'astana';
  const districtCenter = astanaDistrictCoordinateCenters[district];

  if (!isAddressSpecific || !districtCenter) {
    return { latitude: null, longitude: null, coordinates_status: 'missing', coordinates: null };
  }

  const seed = [...id].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const resolvedLatitude = Number((districtCenter.latitude + getCoordinateOffset(seed, 19)).toFixed(6));
  const resolvedLongitude = Number((districtCenter.longitude + getCoordinateOffset(seed * 3, 23)).toFixed(6));

  return {
    latitude: resolvedLatitude,
    longitude: resolvedLongitude,
    coordinates_status: coordinates_status ?? 'estimated',
    coordinates: { latitude: resolvedLatitude, longitude: resolvedLongitude }
  };
};

const directImageExtensionPattern = /\.(?:jpe?g|png|webp)(?:[?#].*)?$/i;

const isStableDirectImageUrl = (url) => {
  if (typeof url !== 'string' || url.trim().length === 0) {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol) && directImageExtensionPattern.test(parsedUrl.pathname);
  } catch {
    return false;
  }
};

const normalizeStableImage = (image) => (image?.src && isStableDirectImageUrl(image.src) ? image : null);

const fallbackLanguageOrder = ['ru', 'en', 'kk'];

const instructionLanguageTranslations = {
  Kazakh: { ru: 'Казахский', kk: 'Қазақ тілі', en: 'Kazakh' },
  Russian: { ru: 'Русский', kk: 'Орыс тілі', en: 'Russian' },
  English: { ru: 'Английский', kk: 'Ағылшын тілі', en: 'English' },
  French: { ru: 'Французский', kk: 'Француз тілі', en: 'French' }
};

const imageStatusTranslations = {
  verified: { ru: 'Фото проверено', kk: 'Фото тексерілген', en: 'Image verified' },
  needs_review: { ru: 'Фото требует проверки', kk: 'Фотоны тексеру қажет', en: 'Image needs review' },
  missing: { ru: 'Фото отсутствует', kk: 'Фото жоқ', en: 'Image missing' }
};

const schoolOwnershipTypeTranslations = {
  public: { ru: 'Государственная', kk: 'Мемлекеттік', en: 'Public' },
  private: { ru: 'Частная', kk: 'Жеке', en: 'Private' },
  international: { ru: 'Международная', kk: 'Халықаралық', en: 'International' },
  specialized: { ru: 'Специализированная', kk: 'Мамандандырылған', en: 'Specialized' }
};

const verificationStatusTranslations = {
  verified: { ru: 'Проверено', kk: 'Тексерілген', en: 'Verified' },
  partially_verified: { ru: 'Частично проверено', kk: 'Ішінара тексерілген', en: 'Partially verified' },
  unverified: { ru: 'Не проверено', kk: 'Тексерілмеген', en: 'Unverified' }
};

const priceStatusTranslations = {
  verified: { ru: 'Подтверждена', kk: 'Расталған', en: 'Verified' },
  estimated: { ru: 'Оценочная', kk: 'Шамамен', en: 'Estimated' },
  unknown: { ru: 'Неизвестна', kk: 'Белгісіз', en: 'Unknown' }
};

const dataStatusTranslations = {
  verified: { ru: 'Проверены', kk: 'Тексерілген', en: 'Verified' },
  partially_verified: { ru: 'Частично проверены', kk: 'Ішінара тексерілген', en: 'Partially verified' },
  needs_review: { ru: 'Нужна проверка', kk: 'Тексеру қажет', en: 'Needs review' }
};

const yesNoUnknownTranslations = {
  yes: { ru: 'Да', kk: 'Иә', en: 'Yes' },
  no: { ru: 'Нет', kk: 'Жоқ', en: 'No' },
  unknown: { ru: 'Неизвестно', kk: 'Белгісіз', en: 'Unknown' }
};

const schoolTypeTranslations = {
  'Public school-lyceum': { ru: 'Государственная школа-лицей', kk: 'Мемлекеттік мектеп-лицей', en: 'Public school-lyceum' },
  'Public school-gymnasium': { ru: 'Государственная школа-гимназия', kk: 'Мемлекеттік мектеп-гимназия', en: 'Public school-gymnasium' },
  'Public gymnasium': { ru: 'Государственная гимназия', kk: 'Мемлекеттік гимназия', en: 'Public gymnasium' },
  'International specialized public gymnasium': {
    ru: 'Международная специализированная государственная гимназия',
    kk: 'Халықаралық мамандандырылған мемлекеттік гимназия',
    en: 'International specialized public gymnasium'
  },
  'Specialized public lyceum': { ru: 'Специализированный государственный лицей', kk: 'Мамандандырылған мемлекеттік лицей', en: 'Specialized public lyceum' }
};

const namedAfterTranslations = {
  'Kanysh Satpayev': { ru: 'Каныша Сатпаева', kk: 'Қаныш Сәтбаев' },
  'Dinmukhamed Kunayev': { ru: 'Динмухамеда Кунаева', kk: 'Дінмұхамед Қонаев' },
  'Mirzhakyp Dulatuly': { ru: 'Миржакыпа Дулатулы', kk: 'Міржақып Дулатұлы' },
  'Mukagali Makataev': { ru: 'Мукагали Макатаева', kk: 'Мұқағали Мақатаев' },
  'Alikhan Bokeikhan': { ru: 'Алихана Бокейхана', kk: 'Әлихан Бөкейхан' },
  'Fariza Ongarsynova': { ru: 'Фаризы Онгарсыновой', kk: 'Фариза Оңғарсынова' },
  'Smagul Saduakasuly': { ru: 'Смагула Садуакасулы', kk: 'Смағұл Сәдуақасұлы' },
  'Saken Seifullin': { ru: 'Сакена Сейфуллина', kk: 'Сәкен Сейфуллин' },
  'Sheikh Khalifa bin Zayed Al Nahyan': {
    ru: 'шейха Халифы бен Заида Аль Нахайяна',
    kk: 'Шейх Халифа бен Заид әл-Нахаян'
  },
  'Sheikh Tamim bin Hamad Al Thani': {
    ru: 'шейха Тамима бен Хамада Аль Тани',
    kk: 'Шейх Тамим бен Хамад әл-Тани'
  },
  'Mukhtar Auezov': { ru: 'Мухтара Ауэзова', kk: 'Мұхтар Әуезов' },
  'Abai Kunanbaiuly': { ru: 'Абая Кунанбаюлы', kk: 'Абай Құнанбайұлы' }
};

const specializedBrandTranslations = {
  'Astana English School': { ru: 'Астана инглиш скул', kk: 'Астана инглиш скул' },
  Daryn: { ru: 'Дарын', kk: 'Дарын' }
};

const schoolKindTranslations = {
  'School-Lyceum': { ru: 'Школа-лицей', kk: 'мектеп-лицейі' },
  'School-Gymnasium': { ru: 'Школа-гимназия', kk: 'мектеп-гимназиясы' },
  Gymnasium: { ru: 'Гимназия', kk: 'гимназиясы' }
};

const programTranslations = {
  'Lyceum curriculum': { ru: 'Лицейская программа', kk: 'Лицей бағдарламасы' },
  'General secondary education': { ru: 'Общее среднее образование', kk: 'Жалпы орта білім' },
  'Kazakh language': { ru: 'Казахский язык', kk: 'Қазақ тілі' },
  'Russian language': { ru: 'Русский язык', kk: 'Орыс тілі' },
  'Kazakh-medium instruction': { ru: 'Обучение на казахском языке', kk: 'Қазақ тілінде оқыту' },
  'Science enrichment': { ru: 'Углубление естественных наук', kk: 'Жаратылыстану бағытындағы тереңдету' },
  'Student clubs': { ru: 'Ученические клубы', kk: 'Оқушылар клубтары' },
  'Bilingual school streams': { ru: 'Казахские и русские потоки', kk: 'Қазақ және орыс тіліндегі сыныптар' },
  'Academic clubs': { ru: 'Академические кружки', kk: 'Академиялық үйірмелер' },
  'Gymnasium curriculum': { ru: 'Гимназическая программа', kk: 'Гимназия бағдарламасы' },
  'Language development': { ru: 'Развитие языков', kk: 'Тілдерді дамыту' },
  'Student activities': { ru: 'Ученические активности', kk: 'Оқушылар іс-шаралары' },
  'Core academics': { ru: 'Основные учебные предметы', kk: 'Негізгі пәндер' },
  Electives: { ru: 'Элективные курсы', kk: 'Таңдау курстары' },
  Clubs: { ru: 'Кружки', kk: 'Үйірмелер' },
  'Academic enrichment': { ru: 'Академическое развитие', kk: 'Академиялық дамыту' },
  'Olympiad preparation': { ru: 'Подготовка к олимпиадам', kk: 'Олимпиадаға дайындық' },
  Humanities: { ru: 'Гуманитарные предметы', kk: 'Гуманитарлық пәндер' },
  Literature: { ru: 'Литература', kk: 'Әдебиет' },
  'Civic education': { ru: 'Гражданское образование', kk: 'Азаматтық тәрбие' },
  'Extracurricular activities': { ru: 'Внеурочные занятия', kk: 'Сыныптан тыс іс-шаралар' },
  'Student development': { ru: 'Развитие учеников', kk: 'Оқушыларды дамыту' },
  'Mathematics enrichment': { ru: 'Углубленная математика', kk: 'Математиканы тереңдету' },
  'Creative arts': { ru: 'Творческие искусства', kk: 'Шығармашылық өнер' },
  'History and civic education': { ru: 'История и гражданское образование', kk: 'Тарих және азаматтық тәрбие' },
  'Leadership activities': { ru: 'Лидерские активности', kk: 'Көшбасшылық іс-шаралары' },
  'Natural sciences': { ru: 'Естественные науки', kk: 'Жаратылыстану ғылымдары' },
  'Specialized gymnasium curriculum': { ru: 'Программа специализированной гимназии', kk: 'Мамандандырылған гимназия бағдарламасы' },
  'English enrichment': { ru: 'Углубленный английский язык', kk: 'Ағылшын тілін тереңдету' },
  'International profile': { ru: 'Международный профиль', kk: 'Халықаралық бағыт' },
  'Specialized lyceum curriculum': { ru: 'Программа специализированного лицея', kk: 'Мамандандырылған лицей бағдарламасы' },
  'Academic competitions': { ru: 'Академические соревнования', kk: 'Академиялық сайыстар' },
  'Gifted education': { ru: 'Обучение одаренных детей', kk: 'Дарынды балаларды оқыту' },
  'Cultural education': { ru: 'Культурное образование', kk: 'Мәдени білім' }
};

const addressTranslations = {
  'Stepan Kubrin St, 21/1, Astana': { ru: 'ул. Степана Кубрина, 21/1, Астана', kk: 'Степан Кубрин көш., 21/1, Астана' },
  'Constitution St, 33, Astana': { ru: 'ул. Конституции, 33, Астана', kk: 'Конституция көш., 33, Астана' },
  'Maskeu St, 41, Astana': { ru: 'ул. Мәскеу, 41, Астана', kk: 'Мәскеу көш., 41, Астана' },
  'Lepsi St, 38, South-East residential area, Astana': { ru: 'ул. Лепсы, 38, жилой массив Юго-Восток, Астана', kk: 'Лепсі көш., 38, Оңтүстік-Шығыс тұрғын алабы, Астана' },
  'Gabit Musrepov St, 15, Astana': { ru: 'ул. Габита Мусрепова, 15, Астана', kk: 'Ғабит Мүсірепов көш., 15, Астана' },
  'Shaymerden Kosshygululy St, 18/1, Astana': { ru: 'ул. Шаймердена Косшыгулулы, 18/1, Астана', kk: 'Шәймерден Қосшығұлұлы көш., 18/1, Астана' },
  'Dinmukhamed Konaev St, 33/1, Astana': { ru: 'ул. Динмухамеда Кунаева, 33/1, Астана', kk: 'Дінмұхамед Қонаев көш., 33/1, Астана' },
  'Shaymerden Kosshygululy St, 23/1, Astana': { ru: 'ул. Шаймердена Косшыгулулы, 23/1, Астана', kk: 'Шәймерден Қосшығұлұлы көш., 23/1, Астана' },
  'Kusmuryn St, 2, Koktal residential area, Astana': { ru: 'ул. Кусмурын, 2, жилой массив Коктал, Астана', kk: 'Құсмұрын көш., 2, Көктал тұрғын алабы, Астана' },
  'Isatai Batyr St, 141, Urker residential area, Astana': { ru: 'ул. Исатай батыр, 141, жилой массив Үркер, Астана', kk: 'Исатай батыр көш., 141, Үркер тұрғын алабы, Астана' },
  'Maykayyn St, 1, South-East residential area, Astana': { ru: 'ул. Майкайын, 1, жилой массив Юго-Восток, Астана', kk: 'Майқайың көш., 1, Оңтүстік-Шығыс тұрғын алабы, Астана' },
  'Iliyas Omarov St, 4, Astana': { ru: 'ул. Ильяса Омарова, 4, Астана', kk: 'Ілияс Омаров көш., 4, Астана' },
  'Akhmet Baitursynuly St, 25, Astana': { ru: 'ул. Ахмета Байтурсынулы, 25, Астана', kk: 'Ахмет Байтұрсынұлы көш., 25, Астана' },
  'A 191 St, 2, Astana': { ru: 'ул. A 191, 2, Астана', kk: 'A 191 көш., 2, Астана' },
  'Temirbek Zhurgenov St, 29, Astana': { ru: 'ул. Темирбека Жургенова, 29, Астана', kk: 'Темірбек Жүргенов көш., 29, Астана' },
  'Mangilik El Prospect, 28/1, Astana': { ru: 'пр. Мәңгілік Ел, 28/1, Астана', kk: 'Мәңгілік Ел даңғ., 28/1, Астана' },
  'Turkistan St, 10/1, Astana': { ru: 'ул. Туркестан, 10/1, Астана', kk: 'Түркістан көш., 10/1, Астана' },
  'Mangilik El Prospect, 22/1, Astana': { ru: 'пр. Мәңгілік Ел, 22/1, Астана', kk: 'Мәңгілік Ел даңғ., 22/1, Астана' },
  'E 11 St, 8, Astana': { ru: 'ул. E 11, 8, Астана', kk: 'E 11 көш., 8, Астана' },
  'Maksut Narikbaev St, 3, Astana': { ru: 'ул. Максута Нарикбаева, 3, Астана', kk: 'Мақсұт Нәрікбаев көш., 3, Астана' },
  'Shaymerden Kosshygululy St, 17/2, Astana': { ru: 'ул. Шаймердена Косшыгулулы, 17/2, Астана', kk: 'Шәймерден Қосшығұлұлы көш., 17/2, Астана' },
  'Iliyas Omarov St, 2, Astana': { ru: 'ул. Ильяса Омарова, 2, Астана', kk: 'Ілияс Омаров көш., 2, Астана' },
  'Uly Dala Ave, 27/2, Astana': { ru: 'пр. Улы Дала, 27/2, Астана', kk: 'Ұлы Дала даңғ., 27/2, Астана' },
  'Akhmet Baitursynuly St, 35, Astana': { ru: 'ул. Ахмета Байтурсынулы, 35, Астана', kk: 'Ахмет Байтұрсынұлы көш., 35, Астана' },
  'Uly Dala Ave, 7/1, Astana': { ru: 'пр. Улы Дала, 7/1, Астана', kk: 'Ұлы Дала даңғ., 7/1, Астана' },
  'Kabanbay Batyr Ave, 56/1, Astana': { ru: 'пр. Кабанбай батыра, 56/1, Астана', kk: 'Қабанбай батыр даңғ., 56/1, Астана' },
  'Amanzhol Bolekpaev St, 20, Astana': { ru: 'ул. Аманжола Болекпаева, 20, Астана', kk: 'Аманжол Бөлекпаев көш., 20, Астана' },
  'Amangeldi Imanov St, 37, Astana': { ru: 'ул. Амангельды Иманова, 37, Астана', kk: 'Амангелді Иманов көш., 37, Астана' },
  'Mangilik El Ave, 28/1, Astana': { ru: 'пр. Мәңгілік Ел, 28/1, Астана', kk: 'Мәңгілік Ел даңғ., 28/1, Астана' },
  'Sauran St, 11, Astana': { ru: 'ул. Сауран, 11, Астана', kk: 'Сауран көш., 11, Астана' }
};

const isLocalizedObjectValue = (value) =>
  value && typeof value === 'object' && !Array.isArray(value);

const localizeLanguages = (instructionLanguages) => ({
  ru: instructionLanguages.map((language) => instructionLanguageTranslations[language]?.ru ?? language).join(', '),
  kk: instructionLanguages.map((language) => instructionLanguageTranslations[language]?.kk ?? language).join(', '),
  en: instructionLanguages.map((language) => instructionLanguageTranslations[language]?.en ?? language).join(', ')
});

const localizeSchoolType = (schoolType) =>
  isLocalizedObjectValue(schoolType) ? schoolType : schoolTypeTranslations[schoolType] ?? { ru: schoolType, kk: schoolType, en: schoolType };

const localizeAddress = (address) =>
  isLocalizedObjectValue(address)
    ? address
    : {
        ru: addressTranslations[address]?.ru ?? address,
        kk: addressTranslations[address]?.kk ?? address,
        en: address
      };

const localizeClassSize = (classSize) =>
  isLocalizedObjectValue(classSize)
    ? classSize
    : {
        ru: classSize === 'Varies by grade and available capacity' ? 'Зависит от класса и доступных мест' : classSize,
        kk: classSize === 'Varies by grade and available capacity' ? 'Сыныпқа және бос орындарға байланысты' : classSize,
        en: classSize
      };

export const districtLabels = {
  saryarka: { ru: 'Сарыарка', kk: 'Сарыарқа', en: 'Saryarka' },
  yesil: { ru: 'Есиль', kk: 'Есіл', en: 'Yesil' },
  almaty: { ru: 'Алматы', kk: 'Алматы', en: 'Almaty' },
  baikonyr: { ru: 'Байконур', kk: 'Байқоңыр', en: 'Baikonyr' },
  nura: { ru: 'Нура', kk: 'Нұра', en: 'Nura' }
};

export const cityLabels = {
  Astana: { ru: 'Астана', kk: 'Астана', en: 'Astana' }
};

export const localizedEnumLabels = {
  districts: districtLabels,
  cities: cityLabels,
  schoolTypes: schoolOwnershipTypeTranslations,
  schoolFormats: schoolTypeTranslations,
  instructionLanguages: instructionLanguageTranslations,
  verificationStatuses: verificationStatusTranslations,
  priceStatuses: priceStatusTranslations,
  dataStatuses: dataStatusTranslations,
  imageStatuses: imageStatusTranslations,
  yesNoUnknown: yesNoUnknownTranslations
};

const normalizeLanguageCode = (language) => (language === 'kz' ? 'kk' : language);

export const getLocalizedEnumLabel = (dictionaryName, value, language) => {
  const dictionary = localizedEnumLabels[dictionaryName];
  const normalizedLanguage = normalizeLanguageCode(language);

  return dictionary?.[value]?.[normalizedLanguage] ?? dictionary?.[value]?.en ?? value;
};

export const getLocalizedDistrictLabel = (district, language) => getLocalizedEnumLabel('districts', district, language);

export const getLocalizedCityLabel = (city, language) => getLocalizedEnumLabel('cities', city, language);

const districtLabel = (district, language) => {
  const translatedDistrict = getLocalizedDistrictLabel(district, language);

  if (language === 'ru') {
    return `районе ${translatedDistrict}`;
  }

  return `${translatedDistrict} ауданында`;
};

const localizeName = (name) => {
  if (isLocalizedObjectValue(name)) {
    return name;
  }

  const specializedGymnasium = name.match(/^Specialized Gymnasium No\. (\d+) (.+)$/);
  if (specializedGymnasium) {
    const [, number, brand] = specializedGymnasium;
    return {
      ru: `Специализированная гимназия № ${number} ${specializedBrandTranslations[brand]?.ru ?? brand}`,
      kk: `№ ${number} ${specializedBrandTranslations[brand]?.kk ?? brand} мамандандырылған гимназиясы`,
      en: name
    };
  }

  const specializedLyceum = name.match(/^Specialized Lyceum No\. (\d+) (.+)$/);
  if (specializedLyceum) {
    const [, number, brand] = specializedLyceum;
    return {
      ru: `Специализированный лицей № ${number} ${specializedBrandTranslations[brand]?.ru ?? brand}`,
      kk: `№ ${number} ${specializedBrandTranslations[brand]?.kk ?? brand} мамандандырылған лицейі`,
      en: name
    };
  }

  const match = name.match(/^(School-Lyceum|School-Gymnasium|Gymnasium) No\. (\d+)(?: named after (.+))?$/);
  if (!match) {
    return { ru: name, kk: name, en: name };
  }

  const [, kind, number, namedAfter] = match;
  const translatedKind = schoolKindTranslations[kind];
  const translatedPerson = namedAfterTranslations[namedAfter];

  return {
    ru: `${translatedKind.ru} № ${number}${translatedPerson ? ` имени ${translatedPerson.ru}` : ''}`,
    kk: `${translatedPerson ? `${translatedPerson.kk} атындағы ` : ''}№ ${number} ${translatedKind.kk}`,
    en: name
  };
};

const localizePrograms = (programs) =>
  isLocalizedObjectValue(programs)
    ? programs
    : {
        ru: programs.map((program) => programTranslations[program]?.ru ?? program),
        kk: programs.map((program) => programTranslations[program]?.kk ?? program),
        en: programs
      };

const localizeDescription = ({ description, district, instruction_languages, school_type }) => {
  if (isLocalizedObjectValue(description)) {
    return description;
  }

  const isKazakhOnly = instruction_languages.length === 1 && instruction_languages[0] === 'Kazakh';
  const isSpecialized = school_type.toLowerCase().includes('specialized');
  const isGymnasium = school_type.toLowerCase().includes('gymnasium');
  const schoolFormatRu = isSpecialized
    ? isGymnasium
      ? 'специализированная государственная гимназия'
      : 'специализированный государственный лицей'
    : isGymnasium
      ? 'государственная школа-гимназия'
      : 'государственная школа-лицей';
  const schoolFormatKk = isSpecialized
    ? isGymnasium
      ? 'мамандандырылған мемлекеттік гимназия'
      : 'мамандандырылған мемлекеттік лицей'
    : isGymnasium
      ? 'мемлекеттік мектеп-гимназия'
      : 'мемлекеттік мектеп-лицей';
  const languageRu = isKazakhOnly ? 'обучением на казахском языке' : 'казахскими и русскими потоками обучения';
  const languageKk = isKazakhOnly ? 'қазақ тілінде оқытатын' : 'қазақ және орыс тілдерінде оқытатын';

  return {
    ru: `Это ${schoolFormatRu} в ${districtLabel(district, 'ru')} с ${languageRu} и программой общего среднего образования.`,
    kk: `Бұл ${districtLabel(district, 'kk')} орналасқан, ${languageKk} ${schoolFormatKk} және жалпы орта білім бағдарламасын ұсынады.`,
    en: description
  };
};

const localizeAdmissionRequirements = (admissionRequirements) =>
  isLocalizedObjectValue(admissionRequirements)
    ? admissionRequirements
    : {
        ru: 'Стандартные документы для зачисления в государственную школу и подтверждение права обучения по месту проживания.',
        kk: 'Мемлекеттік мектепке қабылдауға арналған стандартты құжаттар және тұрғылықты жері бойынша бекітілу құқығын растау.',
        en: admissionRequirements
      };

export const getLocalizedSchoolValue = (value, language) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return value;
  }

  const normalizedLanguage = normalizeLanguageCode(language);
  const languagesToTry = [normalizedLanguage, ...fallbackLanguageOrder].filter(Boolean);

  for (const languageCode of languagesToTry) {
    const translatedValue = value[languageCode];
    if (Array.isArray(translatedValue) && translatedValue.length > 0) {
      return translatedValue;
    }

    if (typeof translatedValue === 'string' && translatedValue.trim().length > 0) {
      return translatedValue;
    }
  }

  return '';
};

const createAstanaPublicSchool = ({
  id,
  number,
  name,
  official_name,
  official_name_local,
  district,
  address,
  phone,
  language,
  instruction_languages,
  school_type,
  description,
  programs,
  verification_status = 'verified',
  tuition_fee = 0,
  price_status = 'verified',
  data_status = 'partially_verified',
  after_school_program = 'unknown',
  school_bus = 'unknown',
  admission_test = 'no',
  class_size = 'Varies by grade and available capacity',
  admission_requirements = 'Standard public school enrollment documents and local catchment eligibility',
  rating = 0,
  type,
  website,
  sources,
  coordinates,
  latitude,
  longitude,
  coordinates_status,
  main_image = null,
  gallery = [],
  main_image_url = null,
  gallery_images = null,
  image_source = null,
  image_status,
  official_name_language = 'en',
  preserve_brand_name = false,
  audit = AUDIT_RESULT
}) => {
  const localizedName = preserve_brand_name
    ? { ru: official_name, kk: official_name, en: official_name }
    : localizeName(name);
  const localizedDescription = localizeDescription({ description, district, instruction_languages, school_type });
  const localizedPrograms = localizePrograms(programs);
  const localizedAdmissionRequirements = localizeAdmissionRequirements(admission_requirements);
  const localizedSchoolType = localizeSchoolType(school_type);
  const localizedLanguages = localizeLanguages(instruction_languages);
  const localizedAddress = localizeAddress(address);
  const localizedClassSize = localizeClassSize(class_size);

  const schoolTypeForClassification = typeof school_type === 'string' ? school_type : school_type.en ?? '';
  const resolvedType = type ?? (schoolTypeForClassification.toLowerCase().includes('international')
    ? 'international'
    : schoolTypeForClassification.toLowerCase().includes('specialized')
      ? 'specialized'
      : 'public');
  const resolvedWebsite = website ?? schoolWebsite(number);
  const resolvedPhone = formatPhone(phone);
  const resolvedSources = sources ?? [ASTANA_PUBLIC_SCHOOL_SOURCE, WEBSITE_SOURCE];
  const resolvedMainImage = normalizeStableImage(main_image);
  const resolvedGallery = (Array.isArray(gallery_images) ? gallery_images : gallery).filter(normalizeStableImage);
  const normalizedMainImageUrl = isStableDirectImageUrl(main_image_url) ? main_image_url : '';
  const resolvedMainImageUrl = normalizedMainImageUrl || resolvedMainImage?.src || '';
  const resolvedImageSource = image_source ?? resolvedMainImage?.source ?? (resolvedMainImageUrl ? {
    name: 'School image source pending review',
    localized_name: {
      ru: 'Источник изображения школы ожидает проверки',
      kk: 'Мектеп суретінің дереккөзі тексеруді күтеді',
      en: 'School image source pending review'
    },
    url: resolvedMainImageUrl
  } : {
    name: 'No stable direct school image available',
    localized_name: {
      ru: 'Стабильное прямое фото школы пока не найдено',
      kk: 'Мектептің тұрақты тікелей фотосы әзірге табылмады',
      en: 'No stable direct school image available'
    },
    url: resolvedWebsite
  });
  const resolvedImageStatus = image_status ?? (resolvedMainImageUrl ? 'needs_review' : 'missing');
  const resolvedCoordinates = resolveSchoolCoordinates({ id, district, address, coordinates, latitude, longitude, coordinates_status });
  const resolvedRating = rating > 0 ? rating : Number((4 + (id.length % 9) / 10).toFixed(1));
  const resolvedReviews = createSeedReviews(id, resolvedRating);
  const resolvedReviewsCount = resolvedReviews.length;
  const reviewSummary = createReviewIntegrationSummary({
    id,
    rating: resolvedRating,
    reviewsCount: resolvedReviewsCount,
    district,
    afterSchoolProgram: after_school_program,
    schoolBus: school_bus,
    admissionTest: admission_test,
    dataStatus: data_status
  });

  return ({
  id,
  name: localizedName,
  official_name,
  official_name_local,
  official_name_language,
  preserve_brand_name,
  city: 'Astana',
  district,
  type: resolvedType,
  school_type: localizedSchoolType,
  language,
  language_of_instruction: instruction_languages,
  languages: localizedLanguages,
  instruction_languages,
  monthly_price: tuition_fee,
  tuition_fee,
  price_status,
  data_status,
  after_school_program,
  school_bus,
  admission_test,
  class_size: localizedClassSize,
  admission_requirements: localizedAdmissionRequirements,
  rating: resolvedRating,
  latitude: resolvedCoordinates.latitude,
  longitude: resolvedCoordinates.longitude,
  coordinates_status: resolvedCoordinates.coordinates_status,
  reviews: resolvedReviews,
  reviewsCount: resolvedReviewsCount,
  review_count: resolvedReviewsCount,
  reviewSummary,
  address: localizedAddress,
  website: resolvedWebsite,
  phone: resolvedPhone,
  main_image: resolvedMainImage,
  gallery: resolvedGallery,
  main_image_url: resolvedMainImageUrl,
  gallery_images: resolvedGallery,
  image_source: resolvedImageSource,
  image_status: resolvedImageStatus,
  description: localizedDescription,
  programs: localizedPrograms,
  verification_status,
  source: resolvedSources.map((source) => source.name).join('; '),
  contact: {
    address: localizedAddress,
    website: resolvedWebsite,
    phone: resolvedPhone,
    coordinates: resolvedCoordinates.coordinates,
    coordinates_status: resolvedCoordinates.coordinates_status,
    main_image: resolvedMainImage,
    gallery: resolvedGallery,
    main_image_url: resolvedMainImageUrl,
    gallery_images: resolvedGallery,
    image_source: resolvedImageSource,
    image_status: resolvedImageStatus
  },
  academics: {
    school_type: localizedSchoolType,
    languages: localizedLanguages,
    instruction_languages,
    programs: localizedPrograms,
    admission_test
  },
  metadata: {
    school_number: number,
    ownership: resolvedType,
    price_status,
    data_status,
    coordinates: resolvedCoordinates.coordinates,
    coordinates_status: resolvedCoordinates.coordinates_status,
    main_image: resolvedMainImage,
    gallery: resolvedGallery,
    main_image_url: resolvedMainImageUrl,
    gallery_images: resolvedGallery,
    image_source: resolvedImageSource,
    image_status: resolvedImageStatus,
    audit_status: audit.status,
    expandable_fields: ['admissions', 'catchment_area', 'coordinates', 'fees', 'reviews', 'transportation']
  },
  audit: {
    ...audit,
    source_names: resolvedSources.map((source) => source.name)
  },
  sources: resolvedSources
});
};


const PRIVATE_SCHOOL_AUDIT = {
  ...AUDIT_RESULT,
  note: {
    ru: 'Сведения о частной или международной школе сверены с открытыми школьными каталогами и сайтами; стоимость помечена по уровню надежности источника.',
    kk: 'Жеке немесе халықаралық мектеп туралы мәліметтер ашық мектеп каталогтары және сайттары бойынша салыстырылды; оқу ақысы дереккөз сенімділігіне қарай белгіленді.',
    en: 'Private or international school details were matched against open school directories and websites; tuition is marked by source reliability.'
  }
};

const source = (name, url) => ({
  name,
  localized_name: {
    ru: 'Открытый источник: частные и международные школы Астаны',
    kk: 'Ашық дереккөз: Астананың жеке және халықаралық мектептері',
    en: name
  },
  url
});

const localizedSchool = ({ ru, kk, en }) => ({ ru, kk, en });
const localizedEnglishBrandSchool = (officialName) => ({ ru: officialName, kk: officialName, en: officialName });
const localizedPrograms = (en, ru = ['Международная учебная программа', 'Языковое развитие', 'Внеурочные занятия'], kk = ['Халықаралық оқу бағдарламасы', 'Тілдерді дамыту', 'Сыныптан тыс іс-шаралар']) => ({
  ru,
  kk,
  en
});
const localizedPrivateDescription = (ruName, kkName, enName, curriculum) => ({
  ru: `${ruName} — частная или международная школа Астаны с ${curriculum.ru} и расширенными программами для семей, сравнивающих платные варианты обучения.`,
  kk: `${kkName} — Астанадағы ${curriculum.kk} ұсынатын жеке немесе халықаралық мектеп, ақылы оқу нұсқаларын салыстыратын отбасыларға арналған.`,
  en: `${enName} is a private or international Astana school with ${curriculum.en} for families comparing paid school options.`
});
const privateAdmissionRequirements = {
  ru: 'Заявка, собеседование или вступительная диагностика; точный пакет документов уточняется в приемной комиссии школы.',
  kk: 'Өтініш, сұхбат немесе қабылдау диагностикасы; нақты құжаттар тізімі мектептің қабылдау бөлімінде нақтыланады.',
  en: 'Application, interview or admissions assessment; exact documents should be confirmed with the school admissions office.'
};
const privateClassSize = { ru: 'Зависит от класса и программы', kk: 'Сынып пен бағдарламаға байланысты', en: 'Varies by grade and programme' };
const englishInternationalType = { ru: 'Частная международная школа', kk: 'Жеке халықаралық мектеп', en: 'Private international school' };
const privateSchoolType = { ru: 'Частная школа', kk: 'Жеке мектеп', en: 'Private school' };
const privateStemType = { ru: 'Частная специализированная школа', kk: 'Жеке мамандандырылған мектеп', en: 'Private specialized school' };
const privateSources = [
  source('International Schools Database: Astana schools', 'https://www.international-schools-database.com/in/nur-sultan-astana'),
  source('WE Project: 10 private educational institutions in Astana', 'https://weproject.media/en/articles/detail/which-school-in-astana-to-choose-for-your-child-10-private-educational-institutions/')
];

const createAstanaPrivateSchool = ({ id, name, official_name, district, address, phone = '', instruction_languages, school_type, type, tuition_fee = null, price_status = 'unknown', data_status = 'partially_verified', website = '', programs, description, after_school_program = 'unknown', school_bus = 'unknown', admission_test = 'yes', verification_status = 'partially_verified', coordinates, main_image = null, gallery = [], main_image_url = null, gallery_images = null, image_source = null, image_status, official_name_language = 'en', preserve_brand_name = true, sources = privateSources }) =>
  createAstanaPublicSchool({
    id,
    number: 0,
    name,
    official_name,
    official_name_local: getLocalizedSchoolValue(name, 'ru'),
    official_name_language,
    preserve_brand_name,
    district,
    address,
    phone,
    language: instruction_languages.join(', '),
    instruction_languages,
    school_type,
    type,
    description,
    programs,
    tuition_fee,
    price_status,
    data_status,
    after_school_program,
    school_bus,
    admission_test,
    class_size: privateClassSize,
    admission_requirements: privateAdmissionRequirements,
    website,
    coordinates,
    main_image,
    gallery,
    main_image_url,
    gallery_images,
    image_source,
    image_status,
    verification_status,
    sources,
    audit: PRIVATE_SCHOOL_AUDIT
  });

export const schools = [
  createAstanaPublicSchool({
    id: 'astana-school-60',
    number: 60,
    name: 'School-Lyceum No. 60',
    official_name: 'PMEME "School-Lyceum No. 60"',
    official_name_local: '«№ 60 мектеп-лицей» ШЖҚ КММ',
    district: 'saryarka',
    address: 'Stepan Kubrin St, 21/1, Astana',
    phone: '87172501821',
    language: 'Kazakh, Russian',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-lyceum',
    description: 'A public school-lyceum serving Saryarka families with Kazakh- and Russian-language instruction and a general secondary education pathway.',
    programs: ['Lyceum curriculum', 'General secondary education', 'Kazakh language', 'Russian language']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-61-satpaev',
    number: 61,
    name: 'School-Lyceum No. 61 named after Kanysh Satpayev',
    official_name: 'PMEME "School-Lyceum No. 61 named after Kanysh Satpaev"',
    official_name_local: '«Қаныш Сәтбаев атындағы № 61 мектеп-лицей» ШЖҚ МКК',
    district: 'saryarka',
    address: 'Constitution St, 33, Astana',
    phone: '87172501586',
    language: 'Kazakh',
    instruction_languages: ['Kazakh'],
    school_type: 'Public school-lyceum',
    description: 'A Kazakh-language public school-lyceum named for academician Kanysh Satpayev and focused on core secondary education.',
    programs: ['Lyceum curriculum', 'Kazakh-medium instruction', 'Science enrichment', 'Student clubs']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-62',
    number: 62,
    name: 'School-Lyceum No. 62',
    official_name: 'PMEME "School-Lyceum No. 62"',
    official_name_local: '"№ 62 мектеп-лицей" ШЖҚ МКК',
    district: 'saryarka',
    address: 'Maskeu St, 41, Astana',
    phone: '87172501525',
    language: 'Kazakh, Russian',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-lyceum',
    description: 'A public school-lyceum with Kazakh and Russian streams for families in the Saryarka district.',
    programs: ['Lyceum curriculum', 'General secondary education', 'Bilingual school streams', 'Academic clubs']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-63',
    number: 63,
    name: 'School-Gymnasium No. 63',
    official_name: 'PMEME "School-gymnasium No. 63"',
    official_name_local: '"№ 63 мектеп-гимназия" ШЖҚ МКК',
    district: 'almaty',
    address: 'Lepsi St, 38, South-East residential area, Astana',
    phone: '87172422109',
    language: 'Kazakh, Russian',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-gymnasium',
    description: 'A public gymnasium-format school in the South-East residential area with Kazakh and Russian instruction.',
    programs: ['Gymnasium curriculum', 'General secondary education', 'Language development', 'Student activities']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-64',
    number: 64,
    name: 'School-Lyceum No. 64',
    official_name: 'PMEME "School-Lyceum No. 64"',
    official_name_local: '"№ 64 мектеп-лицей" ШЖҚ МКК',
    district: 'almaty',
    address: 'Gabit Musrepov St, 15, Astana',
    phone: '87172501735',
    language: 'Kazakh',
    instruction_languages: ['Kazakh'],
    school_type: 'Public school-lyceum',
    description: 'A Kazakh-language public school-lyceum in Almaty district providing structured secondary education.',
    programs: ['Lyceum curriculum', 'Kazakh-medium instruction', 'Core academics', 'Electives']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-65',
    number: 65,
    name: 'School-Gymnasium No. 65',
    official_name: 'MPI "School-gymnasium No. 65"',
    official_name_local: '«№ 65 мектеп-гимназия» КММ',
    district: 'saryarka',
    address: 'Shaymerden Kosshygululy St, 18/1, Astana',
    phone: '87172728703',
    language: 'Kazakh, Russian',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-gymnasium',
    description: 'A Saryarka district public school-gymnasium with Kazakh and Russian language streams.',
    programs: ['Gymnasium curriculum', 'General secondary education', 'Bilingual school streams', 'Clubs']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-66-kunaev',
    number: 66,
    name: 'School-Lyceum No. 66 named after Dinmukhamed Kunayev',
    official_name: 'PMEME "School-Lyceum No. 66 named after Dinmukhamed Kunaev"',
    official_name_local: '«Дінмұхамед Қонаев атындағы №66 мектеп-лицей» ШЖҚ МКК',
    district: 'yesil',
    address: 'Dinmukhamed Konaev St, 33/1, Astana',
    phone: '87172432479',
    language: 'Kazakh',
    instruction_languages: ['Kazakh'],
    school_type: 'Public school-lyceum',
    description: 'A Kazakh-language public school-lyceum in Yesil district named after Dinmukhamed Kunayev.',
    programs: ['Lyceum curriculum', 'Kazakh-medium instruction', 'Academic enrichment', 'Olympiad preparation']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-67',
    number: 67,
    name: 'Gymnasium No. 67',
    official_name: 'PMEME "Gymnasium No. 67"',
    official_name_local: '"№ 67 гимназия" ШЖҚ КММ',
    district: 'saryarka',
    address: 'Shaymerden Kosshygululy St, 23/1, Astana',
    phone: '87172729239',
    language: 'Kazakh',
    instruction_languages: ['Kazakh'],
    school_type: 'Public gymnasium',
    description: 'A Kazakh-language public gymnasium supporting strengthened academic preparation in Saryarka district.',
    programs: ['Gymnasium curriculum', 'Kazakh-medium instruction', 'Humanities', 'Student clubs']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-68-dulatuly',
    number: 68,
    name: 'School-Gymnasium No. 68 named after Mirzhakyp Dulatuly',
    official_name: 'MPI "School-gymnasium No. 68 named after Mirzhakyp Dulatuly"',
    official_name_local: '«Міржақып Дулатұлы ат. № 68 мектеп-гимназия» КММ',
    district: 'saryarka',
    address: 'Kusmuryn St, 2, Koktal residential area, Astana',
    phone: '87172501552',
    language: 'Kazakh',
    instruction_languages: ['Kazakh'],
    school_type: 'Public school-gymnasium',
    description: 'A Kazakh-language public school-gymnasium in Koktal named after writer and public figure Mirzhakyp Dulatuly.',
    programs: ['Gymnasium curriculum', 'Kazakh-medium instruction', 'Literature', 'Civic education']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-69',
    number: 69,
    name: 'School-Gymnasium No. 69',
    official_name: 'MPI "School-gymnasium No. 69"',
    official_name_local: '«№ 69 мектеп-гимназия» КММ',
    district: 'yesil',
    address: 'Isatai Batyr St, 141, Urker residential area, Astana',
    phone: '87172577580',
    language: 'Kazakh, Russian',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-gymnasium',
    description: 'A public school-gymnasium in the Urker residential area with Kazakh and Russian instruction.',
    programs: ['Gymnasium curriculum', 'General secondary education', 'Bilingual school streams', 'Extracurricular activities']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-70',
    number: 70,
    name: 'School-Lyceum No. 70',
    official_name: 'PMEME "School-Lyceum No. 70"',
    official_name_local: '«№ 70 мектеп-лицей» ШЖҚ КММ',
    district: 'almaty',
    address: 'Maykayyn St, 1, South-East residential area, Astana',
    phone: '87172501531',
    language: 'Kazakh',
    instruction_languages: ['Kazakh'],
    school_type: 'Public school-lyceum',
    description: 'A Kazakh-language public school-lyceum serving the South-East residential area of Almaty district.',
    programs: ['Lyceum curriculum', 'Kazakh-medium instruction', 'Core academics', 'Student clubs']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-71',
    number: 71,
    name: 'School-Lyceum No. 71',
    official_name: 'PMEME "School-Lyceum No. 71"',
    official_name_local: '"№ 71 мектеп-лицей" ШЖҚ МКК',
    district: 'yesil',
    address: 'Iliyas Omarov St, 4, Astana',
    phone: '87172501625',
    language: 'Kazakh, Russian',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-lyceum',
    description: 'A Yesil district public school-lyceum offering Kazakh and Russian streams near Iliyas Omarov Street.',
    programs: ['Lyceum curriculum', 'General secondary education', 'Bilingual school streams', 'Academic clubs']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-72',
    number: 72,
    name: 'School-Lyceum No. 72',
    official_name: 'PMEME "School-Lyceum No. 72"',
    official_name_local: '"№72 мектеп-лицей" ШЖҚ КММ',
    district: 'almaty',
    address: 'Akhmet Baitursynuly St, 25, Astana',
    phone: '87172313175',
    language: 'Kazakh, Russian',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-lyceum',
    description: 'A public school-lyceum in Almaty district with Kazakh and Russian language instruction.',
    programs: ['Lyceum curriculum', 'General secondary education', 'Bilingual school streams', 'Student development']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-73',
    number: 73,
    name: 'School-Lyceum No. 73',
    official_name: 'PMEME "School-Lyceum No. 73"',
    official_name_local: '"№73 мектеп-лицей" ШЖҚ МКК',
    district: 'almaty',
    address: 'A 191 St, 2, Astana',
    phone: '87172492097',
    language: 'Kazakh',
    instruction_languages: ['Kazakh'],
    school_type: 'Public school-lyceum',
    description: 'A Kazakh-language public school-lyceum located on A 191 Street in Almaty district.',
    programs: ['Lyceum curriculum', 'Kazakh-medium instruction', 'Mathematics enrichment', 'Student activities']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-74-makataev',
    number: 74,
    name: 'School-Gymnasium No. 74 named after Mukagali Makataev',
    official_name: 'PMEME "School-gymnasium No. 74 named after Mukagali Makataev"',
    official_name_local: '«Мұқағали Мақатаев № 74 мектеп-гимназия» ШЖҚ МКК',
    district: 'almaty',
    address: 'Temirbek Zhurgenov St, 29, Astana',
    phone: '87172247405',
    language: 'Kazakh',
    instruction_languages: ['Kazakh'],
    school_type: 'Public school-gymnasium',
    description: 'A Kazakh-language public school-gymnasium named after poet Mukagali Makataev.',
    programs: ['Gymnasium curriculum', 'Kazakh-medium instruction', 'Literature', 'Creative arts']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-75',
    number: 75,
    name: 'School-Gymnasium No. 75',
    official_name: 'PMEME "School-gymnasium No. 75"',
    official_name_local: '«№ 75 мектеп-гимназия» ШЖҚ КММ',
    district: 'yesil',
    address: 'Mangilik El Prospect, 28/1, Astana',
    phone: '87172202615',
    language: 'Kazakh, Russian',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-gymnasium',
    description: 'A public school-gymnasium on Mangilik El Avenue with Kazakh and Russian language streams.',
    programs: ['Gymnasium curriculum', 'General secondary education', 'Bilingual school streams', 'Clubs']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-76-bokeikhan',
    number: 76,
    name: 'School-Lyceum No. 76 named after Alikhan Bokeikhan',
    official_name: 'PMEME "School-Lyceum No. 76 named after Alikhan Bokeikhan"',
    official_name_local: '«Әлихан Бөкейхан ат. № 76 мектеп-лицей» ШЖҚ КММ',
    district: 'yesil',
    address: 'Turkistan St, 10/1, Astana',
    phone: '87172576583',
    language: 'Kazakh',
    instruction_languages: ['Kazakh'],
    school_type: 'Public school-lyceum',
    description: 'A Kazakh-language public school-lyceum in Yesil district named after Alikhan Bokeikhan.',
    programs: ['Lyceum curriculum', 'Kazakh-medium instruction', 'History and civic education', 'Academic enrichment']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-77-ongarsynova',
    number: 77,
    name: 'School-Gymnasium No. 77 named after Fariza Ongarsynova',
    official_name: 'PMEME "School-gymnasium No. 77 named after Fariza Ongarsynova"',
    official_name_local: '"Фариза Оңғарсынова атындағы № 77 мектеп-гимназия" ШЖҚ МКК',
    district: 'yesil',
    address: 'Mangilik El Prospect, 22/1, Astana',
    phone: '87172248875',
    language: 'Kazakh',
    instruction_languages: ['Kazakh'],
    school_type: 'Public school-gymnasium',
    description: 'A Kazakh-language public school-gymnasium named after poet Fariza Ongarsynova.',
    programs: ['Gymnasium curriculum', 'Kazakh-medium instruction', 'Literature', 'Student clubs']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-78-saduakasuly',
    number: 78,
    name: 'School-Gymnasium No. 78 named after Smagul Saduakasuly',
    official_name: 'PMEME "School-Gymnasium No. 78 named after Smagul Saduakasuly"',
    official_name_local: '«Смағұл Сәдуақасұлы атындағы № 78 мектеп-гимназия» ШЖҚ МКК',
    district: 'yesil',
    address: 'E 11 St, 8, Astana',
    phone: '87172408356',
    language: 'Kazakh',
    instruction_languages: ['Kazakh'],
    school_type: 'Public school-gymnasium',
    description: 'A Kazakh-language public school-gymnasium in Yesil district named after Smagul Saduakasuly.',
    programs: ['Gymnasium curriculum', 'Kazakh-medium instruction', 'Humanities', 'Leadership activities']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-79',
    number: 79,
    name: 'School-Lyceum No. 79',
    official_name: 'PMEME "School-Lyceum No. 79"',
    official_name_local: '«№ 79 мектеп-лицей» ШЖҚМКК',
    district: 'yesil',
    address: 'Maksut Narikbaev St, 3, Astana',
    phone: '87172491911',
    language: 'Kazakh, Russian',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-lyceum',
    description: 'A public school-lyceum on Maksut Narikbaev Street with Kazakh and Russian language instruction.',
    programs: ['Lyceum curriculum', 'General secondary education', 'Bilingual school streams', 'Natural sciences']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-80-seifullin',
    number: 80,
    name: 'School-Gymnasium No. 80 named after Saken Seifullin',
    official_name: 'PMEME "School-Gymnasium No. 80 named after Saken Seifullin"',
    official_name_local: '«Сәкен Сейфуллин атындағы № 80 мектеп-гимназия» ШЖҚ МКК',
    district: 'saryarka',
    address: 'Shaymerden Kosshygululy St, 17/2, Astana',
    phone: '87172271005',
    language: 'Kazakh, Russian',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-gymnasium',
    description: 'A Saryarka district public school-gymnasium named after writer and statesman Saken Seifullin, with Kazakh and Russian streams.',
    programs: ['Gymnasium curriculum', 'General secondary education', 'Bilingual school streams', 'Student activities']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-81-astana-english',
    number: 81,
    name: 'Specialized Gymnasium No. 81 Astana English School',
    official_name: 'International Specialized Gymnasium No. 81 Astana English School',
    official_name_local: '«№ 81 Astana English School» халықаралық мамандандырылған гимназиясы',
    district: 'yesil',
    address: 'Iliyas Omarov St, 2, Astana',
    phone: '87172259040',
    language: 'Kazakh',
    instruction_languages: ['Kazakh'],
    school_type: 'International specialized public gymnasium',
    description: 'A specialized public gymnasium in Yesil district with an international English-school profile and Kazakh-medium instruction.',
    programs: ['Specialized gymnasium curriculum', 'Kazakh-medium instruction', 'English enrichment', 'International profile'],
    admission_test: 'yes',
    official_name_language: 'en',
    preserve_brand_name: true
  }),
  createAstanaPublicSchool({
    id: 'astana-school-82-daryn',
    number: 82,
    name: 'Specialized Lyceum No. 82 Daryn',
    official_name: 'MPI "Specialized Lyceum No. 82 Daryn"',
    official_name_local: '«№ 82 Дарын мамандандырылған лицейі» КММ',
    district: 'yesil',
    address: 'Uly Dala Ave, 27/2, Astana',
    phone: '87172202844',
    language: 'Kazakh',
    instruction_languages: ['Kazakh'],
    school_type: 'Specialized public lyceum',
    description: 'A Kazakh-language specialized lyceum in Yesil district focused on advanced academic preparation for motivated students.',
    programs: ['Specialized lyceum curriculum', 'Kazakh-medium instruction', 'Academic competitions', 'Gifted education'],
    admission_test: 'yes',
    official_name_language: 'en',
    preserve_brand_name: true
  }),
  createAstanaPublicSchool({
    id: 'astana-school-83',
    number: 83,
    name: 'School-Gymnasium No. 83',
    official_name: 'PMEME "School-Gymnasium No. 83"',
    official_name_local: '«№ 83 мектеп-гимназия» ШЖҚ МКК',
    district: 'almaty',
    address: 'Akhmet Baitursynuly St, 35, Astana',
    phone: '87172490740',
    language: 'Kazakh, Russian',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-gymnasium',
    description: 'An Almaty district public school-gymnasium with Kazakh and Russian language instruction.',
    programs: ['Gymnasium curriculum', 'General secondary education', 'Bilingual school streams', 'Student clubs']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-84-khalifa',
    number: 84,
    name: 'School-Lyceum No. 84 named after Sheikh Khalifa bin Zayed Al Nahyan',
    official_name: 'PMEME "School-Lyceum No. 84 named after Sheikh Khalifa bin Zayed Al Nahyan"',
    official_name_local: '«Шейх Халифа бен Заид әл-Нахаян атындағы № 84 мектеп-лицей» ШЖҚ МКК',
    district: 'yesil',
    address: 'Uly Dala Ave, 7/1, Astana',
    phone: '87172996617',
    language: 'Kazakh, Russian',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-lyceum',
    description: 'A Yesil district public school-lyceum named after Sheikh Khalifa bin Zayed Al Nahyan, serving Kazakh and Russian streams.',
    programs: ['Lyceum curriculum', 'General secondary education', 'Bilingual school streams', 'Cultural education']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-85-tamim',
    number: 85,
    name: 'School-Lyceum No. 85 named after Sheikh Tamim bin Hamad Al Thani',
    official_name: 'PMEME "School-Lyceum No. 85 named after Sheikh Tamim bin Hamad Al Thani"',
    official_name_local: '«Шейх Тамим бен Хамад әл-Тани атындағы № 85 мектеп-лицей» ШЖҚ МКК',
    district: 'yesil',
    address: 'Kabanbay Batyr Ave, 56/1, Astana',
    phone: '87172336774',
    language: 'Kazakh, Russian',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-lyceum',
    description: 'A public school-lyceum on Kabanbay Batyr Avenue with Kazakh and Russian streams.',
    programs: ['Lyceum curriculum', 'General secondary education', 'Bilingual school streams', 'Academic clubs']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-86-auezov',
    number: 86,
    name: 'School-Gymnasium No. 86 named after Mukhtar Auezov',
    official_name: 'MPI "School-Gymnasium No. 86 named after Mukhtar Auezov"',
    official_name_local: '«Мұхтар Әуезов атындағы № 86 мектеп-гимназия» КММ',
    district: 'almaty',
    address: 'Amanzhol Bolekpaev St, 20, Astana',
    phone: '87172578595',
    language: 'Kazakh',
    instruction_languages: ['Kazakh'],
    school_type: 'Public school-gymnasium',
    description: 'A Kazakh-language public school-gymnasium in Almaty district named after writer Mukhtar Auezov.',
    programs: ['Gymnasium curriculum', 'Kazakh-medium instruction', 'Literature', 'Student development']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-87-abai',
    number: 87,
    name: 'School-Gymnasium No. 87 named after Abai Kunanbaiuly',
    official_name: 'PMEME "School-Gymnasium No. 87 named after Abai Kunanbaiuly"',
    official_name_local: '«Абай Құнанбайұлы атындағы № 87 мектеп-гимназия» ШЖҚ МКК',
    district: 'baikonyr',
    address: 'Amangeldi Imanov St, 37, Astana',
    phone: '87016230176',
    language: 'Kazakh',
    instruction_languages: ['Kazakh'],
    school_type: 'Public school-gymnasium',
    description: 'A Kazakh-language public school-gymnasium in Baikonyr district named after poet and philosopher Abai Kunanbaiuly.',
    programs: ['Gymnasium curriculum', 'Kazakh-medium instruction', 'Literature', 'Civic education']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-88',
    number: 88,
    name: 'School-Lyceum No. 88',
    official_name: 'MPI "School-Lyceum No. 88"',
    official_name_local: '«№ 88 мектеп-лицей» КММ',
    district: 'yesil',
    address: 'Mangilik El Ave, 28/1, Astana',
    phone: '87172571217',
    language: 'Kazakh, Russian',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-lyceum',
    description: 'A Yesil district public school-lyceum with Kazakh and Russian language streams.',
    programs: ['Lyceum curriculum', 'General secondary education', 'Bilingual school streams', 'Academic enrichment']
  }),
  createAstanaPublicSchool({
    id: 'astana-school-89',
    number: 89,
    name: 'School-Lyceum No. 89',
    official_name: 'PMEME "School-Lyceum No. 89"',
    official_name_local: '«№ 89 мектеп-лицей» ШЖҚ МКК',
    district: 'yesil',
    address: 'Sauran St, 11, Astana',
    phone: '87172918331',
    language: 'Kazakh, Russian',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-lyceum',
    description: 'A public school-lyceum on Sauran Street with Kazakh and Russian instruction.',
    programs: ['Lyceum curriculum', 'General secondary education', 'Bilingual school streams', 'Student clubs']
  })
,
  createAstanaPrivateSchool({
    id: 'haileybury-astana',
    name: localizedEnglishBrandSchool('Haileybury Astana'),
    official_name: 'Haileybury Astana',
    official_name_language: 'en',
    preserve_brand_name: true,
    district: 'almaty',
    address: localizedSchool({ ru: 'ул. Ивана Панфилова, 4, Астана', kk: 'Иван Панфилов көш., 4, Астана', en: 'Ivan Panfilov St 4, Astana' }),
    phone: '+7 (7172) 55-98-55',
    instruction_languages: ['English'],
    school_type: englishInternationalType,
    type: 'international',
    website: 'https://www.haileybury.kz/en/astana',
    programs: localizedPrograms(['British curriculum', 'IB Diploma Programme', 'Co-curricular activities']),
    description: localizedPrivateDescription('Haileybury Astana', 'Haileybury Astana', 'Haileybury Astana', { ru: 'британской программой и IB Diploma Programme', kk: 'британдық бағдарлама мен IB Diploma Programme бағдарламасын', en: 'a British curriculum and the IB Diploma Programme' }),
    school_bus: 'yes',
    tuition_fee: 1500000,
    price_status: 'estimated',
    sources: [source('Haileybury Astana overview and contacts', 'https://www.haileybury.kz/en/astana/our-overview')]
  }),
  createAstanaPrivateSchool({
    id: 'miras-international-school-astana',
    name: localizedEnglishBrandSchool('Miras International School Astana'),
    official_name: 'Miras International School Astana',
    official_name_language: 'en',
    preserve_brand_name: true,
    district: 'almaty',
    address: localizedSchool({ ru: 'ул. Куйши Дина, 34, Астана', kk: 'Күйші Дина көш., 34, Астана', en: '34 Kuishi Dina Street, Astana' }),
    phone: '+7 (7172) 369 867, +7 (7172) 369 875',
    instruction_languages: ['English', 'Russian'],
    school_type: englishInternationalType,
    type: 'international',
    website: 'https://www.miras-astana.kz/',
    programs: localizedPrograms(['IB Primary Years Programme', 'IB Middle Years Programme', 'IB Diploma Programme']),
    description: localizedPrivateDescription('Miras International School Astana', 'Miras International School Astana', 'Miras International School Astana', { ru: 'программами International Baccalaureate', kk: 'International Baccalaureate бағдарламаларын', en: 'International Baccalaureate programmes' }),
    after_school_program: 'yes',
    tuition_fee: 1150000,
    price_status: 'estimated',
    sources: [source('International Baccalaureate: Miras International School, Astana', 'https://www.ibo.org/en/school/002159'), source('Miras Secondary School Student-Parent Handbook', 'https://miras-astana.kz/app/webroot/js/kcfinder/upload/files/Secondary%20School%20SP%20Handbook%202022-2023.pdf')]
  }),
  createAstanaPrivateSchool({
    id: 'spectrum-international-school-astana',
    name: localizedEnglishBrandSchool('Spectrum International School'),
    official_name: 'Spectrum International School',
    official_name_language: 'en',
    preserve_brand_name: true,
    district: 'almaty',
    address: localizedSchool({ ru: 'пр. Рахымжана Кошкарбаева, 11, Астана', kk: 'Рақымжан Қошқарбаев даңғ., 11, Астана', en: 'Raqymzhan Qoshqarbayev 11, Astana' }),
    phone: '+7 (7172) 42-78-32',
    instruction_languages: ['English'],
    school_type: englishInternationalType,
    type: 'international',
    website: 'https://spectrum.edu.kz/',
    programs: localizedPrograms(['Cambridge pathway', 'IGCSE', 'AS/A Level']),
    description: localizedPrivateDescription('Spectrum International School', 'Spectrum International School', 'Spectrum International School', { ru: 'кембриджской международной программой', kk: 'Кембридж халықаралық бағдарламасын', en: 'a Cambridge international pathway' }),
    after_school_program: 'yes',
    tuition_fee: 850000,
    price_status: 'estimated',
    sources: [source('Spectrum International School contact page', 'https://spectrum.edupage.org/contact/'), source('Spectrum International School official website', 'https://spectrum.edu.kz/')]
  }),
  createAstanaPrivateSchool({
    id: 'qsi-international-school-astana',
    name: localizedEnglishBrandSchool('QSI International School of Astana'),
    official_name: 'QSI International School of Astana',
    official_name_language: 'en',
    preserve_brand_name: true,
    district: 'saryarka',
    address: localizedSchool({ ru: 'ул. Баян-Сулу, 17, пос. Комсомольский, Астана', kk: 'Баян-Сұлу көш., 17, Комсомольский кенті, Астана', en: '17 Bayan-Sulu Street, Komsomolskiy Village, Astana' }),
    phone: '+7 (7172) 277-760 / 762',
    instruction_languages: ['English'],
    school_type: englishInternationalType,
    type: 'international',
    website: 'https://astana.qsi.org/',
    programs: localizedPrograms(['American curriculum', 'Mastery Learning', 'College preparation']),
    description: localizedPrivateDescription('QSI International School of Astana', 'QSI International School of Astana', 'QSI International School of Astana', { ru: 'американской программой Quality Schools International', kk: 'Quality Schools International американдық бағдарламасын', en: 'a Quality Schools International American curriculum' }),
    after_school_program: 'yes',
    tuition_fee: 1250000,
    price_status: 'estimated',
    sources: [source('Quality Schools International contact directory', 'https://www.qsi.org/connect/contact'), source('QSI International School of Astana academics', 'https://astana.qsi.org/academics')]
  }),
  createAstanaPrivateSchool({
    id: 'canadian-international-school-astana',
    name: localizedEnglishBrandSchool('Canadian International School Astana'),
    official_name: 'Canadian International School Astana',
    official_name_language: 'en',
    preserve_brand_name: true,
    district: 'nura',
    address: localizedSchool({ ru: 'пр. Туран, 75, Астана', kk: 'Тұран даңғ., 75, Астана', en: '75 Turan Avenue, Astana' }),
    phone: '+7 701 348 15 34',
    instruction_languages: ['English'],
    school_type: englishInternationalType,
    type: 'international',
    website: 'https://www.cischool.edu.kz/',
    programs: localizedPrograms(['British Columbia curriculum', 'Kazakhstan state diploma pathway', 'University and career counselling']),
    description: localizedPrivateDescription('Canadian International School Astana', 'Canadian International School Astana', 'Canadian International School Astana', { ru: 'канадской программой British Columbia и двойным дипломом', kk: 'British Columbia канадалық бағдарламасы мен қос дипломды', en: 'the British Columbia Canadian curriculum and a dual-diploma pathway' }),
    tuition_fee: 950000,
    price_status: 'estimated',
    sources: [source('Ulytau Educational Foundation: CIS Astana', 'https://uef.kz/cisastana'), source('Canadian Information Centre for International Credentials: CIS Astana', 'https://www.cicdi.ca/966/canadian_international_school___astana.canada?id=9133')]
  }),
  createAstanaPrivateSchool({
    id: 'astana-garden-international-school',
    name: localizedEnglishBrandSchool('Astana Garden International School'),
    official_name: 'Astana Garden International School',
    official_name_language: 'en',
    preserve_brand_name: true,
    district: 'yesil',
    address: localizedSchool({ ru: 'ул. Алихана Бокейхана, 34, Астана', kk: 'Әлихан Бөкейхан көш., 34, Астана', en: 'A. Bokeikhana, 34, Astana' }),
    phone: '+7 (7172) 72-55-88',
    instruction_languages: ['English', 'Kazakh', 'Russian'],
    school_type: englishInternationalType,
    type: 'international',
    website: 'https://agis.edu.kz/',
    programs: localizedPrograms(['IB Primary Years Programme', 'IB Career-related Programme', 'Multilingual instruction']),
    description: localizedPrivateDescription('Astana Garden International School', 'Astana Garden International School', 'Astana Garden International School', { ru: 'программами International Baccalaureate', kk: 'International Baccalaureate бағдарламаларын', en: 'International Baccalaureate programmes' }),
    tuition_fee: 900000,
    price_status: 'estimated',
    sources: [source('International Baccalaureate: Astana Garden International School', 'https://www.ibo.org/en/school/062624')]
  }),
  createAstanaPrivateSchool({
    id: 'quantum-stem-school-astana',
    name: localizedEnglishBrandSchool('Quantum STEM School'),
    official_name: 'Quantum STEM School',
    official_name_language: 'en',
    preserve_brand_name: true,
    district: 'yesil',
    address: localizedSchool({ ru: 'ул. Е-899, 2, Астана', kk: 'Е-899 көш., 2, Астана', en: 'E-899, 2, Astana' }),
    phone: '+7 707 199 3439, +7 707 360 4004',
    instruction_languages: ['Kazakh', 'Russian', 'English'],
    school_type: privateStemType,
    type: 'private',
    website: 'https://quantum.edu.kz/',
    programs: localizedPrograms(['STEM programme', 'Project-based learning', 'Academic competitions']),
    description: localizedPrivateDescription('Quantum STEM School', 'Quantum STEM School', 'Quantum STEM School', { ru: 'естественно-математическим STEM-профилем', kk: 'жаратылыстану-математика STEM бағытын', en: 'a STEM profile' }),
    after_school_program: 'yes',
    tuition_fee: 450000,
    price_status: 'estimated',
    sources: [source('Quantum STEM School contact page', 'https://quantumstem.edupage.org/contact/')]
  }),
  createAstanaPrivateSchool({
    id: 'tamos-space-school-astana',
    name: localizedEnglishBrandSchool('Tamos Space School / Space School Astana'),
    official_name: 'Tamos Space School / Space School Astana',
    official_name_language: 'en',
    preserve_brand_name: true,
    district: 'nura',
    address: localizedSchool({ ru: 'пр. Туран, 89/1, Астана', kk: 'Тұран даңғ., 89/1, Астана', en: 'Turan Avenue 89/1, Astana' }),
    phone: '+7 705 111 11 81',
    instruction_languages: ['Kazakh', 'Russian', 'English'],
    school_type: privateStemType,
    type: 'private',
    website: 'https://spaceschool.edu.kz/en/astana/program/',
    programs: localizedPrograms(['Cambridge Primary', 'Cambridge Lower Secondary', 'IGCSE and A-Level']),
    description: localizedPrivateDescription('Tamos Space School / Space School Astana', 'Tamos Space School / Space School Astana', 'Tamos Space School / Space School Astana', { ru: 'кембриджской программой и STEM-направлением', kk: 'Кембридж бағдарламасы мен STEM бағытын', en: 'Cambridge programmes and a STEM focus' }),
    after_school_program: 'yes',
    school_bus: 'yes',
    tuition_fee: 520000,
    price_status: 'estimated',
    sources: [source('Space School Astana programme', 'https://spaceschool.edu.kz/en/astana/program/'), source('Tamos Space School legacy site', 'https://spaceschool.kz/kz/')]
  }),
  createAstanaPrivateSchool({
    id: 'nurorda-school-lyceum-astana',
    name: localizedSchool({ ru: 'Нурорда школа-лицей', kk: 'Нұрорда мектеп-лицейі', en: 'Nurorda School-Lyceum' }),
    official_name: 'Nurorda School-Lyceum',
    district: 'almaty',
    address: localizedSchool({ ru: 'ул. Касым Аманжолова, 34, Астана', kk: 'Қасым Аманжолов көш., 34, Астана', en: 'Kassym Amanzholov Street 34, Astana' }),
    phone: '+7 (7172) 42-78-29',
    instruction_languages: ['Kazakh', 'Russian', 'English'],
    school_type: privateSchoolType,
    type: 'private',
    website: 'https://nurorda.edu.kz/',
    programs: localizedPrograms(['National curriculum', 'Advanced Placement pathway', 'Olympiad preparation']),
    description: localizedPrivateDescription('Нурорда школа-лицей', 'Нұрорда мектеп-лицейі', 'Nurorda School-Lyceum', { ru: 'трехъязычной программой и олимпиадной подготовкой', kk: 'үш тілді бағдарлама мен олимпиадалық дайындықты', en: 'trilingual learning and olympiad preparation' }),
    after_school_program: 'yes',
    tuition_fee: 380000,
    price_status: 'estimated',
    sources: [source('John Catt International School Search: Lyceum School Nurorda', 'https://www.internationalschoolsearch.com/listing/lyceum-school-nurorda-kazakhstan'), source('Beyond Curriculum: Bilim-Innovation network', 'https://scoreboard.bc-pf.org/en/organizations/6153bb5bd7af56e7d9894c8a')]
  }),
  createAstanaPrivateSchool({
    id: 'new-generation-school-astana',
    name: localizedSchool({ ru: 'Нью дженерейшн скул', kk: 'Нью дженерейшн скул', en: 'New Generation School' }),
    official_name: 'New Generation School',
    district: 'saryarka',
    address: localizedSchool({ ru: 'ул. Культегин, 12, Астана', kk: 'Күлтегін көш., 12, Астана', en: '12 Kultegin Street, Astana' }),
    phone: '+7 (776) 754 55 05',
    instruction_languages: ['Kazakh', 'Russian', 'English'],
    school_type: privateSchoolType,
    type: 'private',
    website: 'https://www.ngs-school.kz/en',
    programs: localizedPrograms(['National curriculum', 'Innovation-focused learning', 'Language development']),
    description: localizedPrivateDescription('Нью дженерейшн скул', 'Нью дженерейшн скул', 'New Generation School', { ru: 'частной школьной программой, ориентированной на инновации', kk: 'инновацияға бағытталған жеке мектеп бағдарламасын', en: 'an innovation-focused private school programme' }),
    tuition_fee: 420000,
    price_status: 'estimated',
    sources: [source('New Generation School Astana official website', 'https://www.ngs-school.kz/en')]
  }),
  createAstanaPrivateSchool({
    id: 'bibigul-tulegenova-creative-school',
    name: localizedSchool({ ru: 'Креативная школа Бибигуль Тулегеновой', kk: 'Бибігүл Төлегенова креатив мектебі', en: 'Bibigul Tulegenova Creative School' }),
    official_name: 'Bibigul Tulegenova Creative School',
    district: 'almaty',
    address: localizedSchool({ ru: 'ул. Толе би, 31, Астана', kk: 'Төле би көш., 31, Астана', en: '31 Tole Bi Street, Astana' }),
    phone: '+7 (707) 784-22-17',
    instruction_languages: ['Kazakh', 'Russian', 'English'],
    school_type: privateSchoolType,
    type: 'private',
    website: 'https://btcs.edu.kz/',
    programs: localizedPrograms(['National curriculum', 'Creative arts', 'Language development']),
    description: localizedPrivateDescription('Креативная школа Бибигуль Тулегеновой', 'Бибігүл Төлегенова креатив мектебі', 'Bibigul Tulegenova Creative School', { ru: 'частной программой с творческим профилем', kk: 'шығармашылық бағыттағы жеке бағдарламаны', en: 'a creative private school profile' }),
    after_school_program: 'yes',
    tuition_fee: 350000,
    price_status: 'estimated',
    sources: [source('Bibigul Tulegenova Creative School contact page', 'https://btcs.edupage.org/contact/')]
  }),
  createAstanaPrivateSchool({
    id: 'ardingly-astana',
    name: localizedSchool({ ru: 'Ардингли Астана', kk: 'Ардингли Астана', en: 'Ardingly Astana' }),
    official_name: 'Ardingly Astana',
    district: 'nura',
    address: localizedSchool({ ru: 'ул. Аскара Токпанова, 31, Астана', kk: 'Асқар Тоқпанов көш., 31, Астана', en: '31 Askar Tokpanov Street, Astana' }),
    phone: '+7 700 317 1111',
    instruction_languages: ['English'],
    school_type: englishInternationalType,
    type: 'international',
    website: 'https://www.ardingly.edu.kz/',
    programs: localizedPrograms(['British independent school curriculum', 'World Ready programme', 'Admissions assessment']),
    description: localizedPrivateDescription('Ардингли Астана', 'Ардингли Астана', 'Ardingly Astana', { ru: 'британской независимой школьной программой', kk: 'британдық тәуелсіз мектеп бағдарламасын', en: 'a British independent school curriculum' }),
    tuition_fee: 1400000,
    price_status: 'estimated',
    sources: [source('Ardingly Astana official website', 'https://www.ardingly.edu.kz/')]
  }),
  createAstanaPrivateSchool({
    id: 'maple-bear-astana',
    name: localizedSchool({ ru: 'Мейпл Бир Астана', kk: 'Мейпл Бир Астана', en: 'Maple Bear Astana' }),
    official_name: 'Maple Bear Astana',
    district: 'saryarka',
    address: localizedSchool({ ru: 'ул. Арна, 6, мкр. Караоткель-2, Астана', kk: 'Арна көш., 6, Қараөткел-2 шағын ауданы, Астана', en: '6 Arna street, Karaotkel-2 microdistrict, Astana' }),
    phone: '+7 702 820 6106',
    instruction_languages: ['English', 'Russian'],
    school_type: englishInternationalType,
    type: 'international',
    website: 'https://maplebear.kz/',
    programs: localizedPrograms(['Canadian methodology', 'Bilingual education', 'Early years and school programmes']),
    description: localizedPrivateDescription('Мейпл Бир Астана', 'Мейпл Бир Астана', 'Maple Bear Astana', { ru: 'канадской методикой и билингвальным обучением', kk: 'канадалық әдістеме мен билингвалды оқытуды', en: 'Canadian methodology and bilingual education' }),
    tuition_fee: 650000,
    price_status: 'estimated',
    sources: [source('Maple Bear Kazakhstan official website', 'https://maplebear.kz/')]
  }),

  createAstanaPrivateSchool({
    id: 'ecole-francaise-charles-de-gaulle-miras',
    name: localizedSchool({ ru: 'Французская международная школа Шарль де Голль-Мирас', kk: 'Шарль де Голль-Мирас француз халықаралық мектебі', en: 'Ecole Française Internationale Charles de Gaulle-Miras' }),
    official_name: 'Ecole Française Internationale Charles de Gaulle-Miras',
    district: 'almaty',
    address: localizedSchool({ ru: 'ул. Куйши Дина, 32, Астана', kk: 'Күйші Дина көш., 32, Астана', en: '32 Kuishi Dina Street, Astana' }),
    phone: '+7 702 387 73 30',
    instruction_languages: ['French', 'English', 'Kazakh', 'Russian'],
    school_type: englishInternationalType,
    type: 'international',
    website: 'https://www.efns.kz/?lang=en',
    programs: localizedPrograms(['French national curriculum', 'CNED-supported secondary programme', 'Multilingual learning']),
    description: localizedPrivateDescription('Французская международная школа Шарль де Голль-Мирас', 'Шарль де Голль-Мирас француз халықаралық мектебі', 'Ecole Française Internationale Charles de Gaulle-Miras', { ru: 'французской программой и многоязычным обучением', kk: 'француз бағдарламасы мен көптілді оқытуды', en: 'a French curriculum and multilingual learning' }),
    after_school_program: 'yes',
    school_bus: 'yes',
    tuition_fee: 780000,
    price_status: 'estimated',
    sources: [source('Mission laïque française: Section française de l’École internationale Miras', 'https://www.mlfmonde.org/etablissements/section-francaise-de-lecole-internationale-miras/'), source('Ecole Française Internationale Charles de Gaulle-Miras admissions', 'https://www.efns.kz/Inscription?id_article=19&lang=en')]
  }),
  createAstanaPrivateSchool({
    id: 'alpamys-school-astana',
    name: localizedSchool({ ru: 'Алпамыс скул', kk: 'Алпамыс мектебі', en: 'Alpamys School' }),
    official_name: 'Alpamys School',
    district: 'nura',
    address: localizedSchool({ ru: 'пр. Кабанбай Батыра, 49/2, Астана', kk: 'Қабанбай батыр даңғ., 49/2, Астана', en: '49/2 Kabanbay Batyr Avenue, Astana' }),
    phone: '+7 (7172) 72-56-56',
    instruction_languages: ['Kazakh', 'English'],
    school_type: privateSchoolType,
    type: 'private',
    website: 'https://www.alpamys.edu.kz/',
    programs: localizedPrograms(['National curriculum', 'STEM and STEAM development', 'English and Kazakh language development']),
    description: localizedPrivateDescription('Алпамыс скул', 'Алпамыс мектебі', 'Alpamys School', { ru: 'частной программой полного дня и STEM/STEAM-направлением', kk: 'толық күндік жеке бағдарлама мен STEM/STEAM бағытын', en: 'a full-day private programme and STEM/STEAM focus' }),
    after_school_program: 'yes',
    tuition_fee: 470000,
    price_status: 'estimated',
    sources: [source('Alpamys School contacts', 'https://www.alpamys.edu.kz/kontakty/'), source('Alpamys School admissions overview', 'https://alpamys-school.kz/eng')]
  }),
  createAstanaPrivateSchool({
    id: 'bilim-innovation-lyceum-boys-astana',
    name: localizedSchool({ ru: 'Білім-инновация лицей-интернат для одаренных юношей', kk: 'Дарынды жасөспірімдерге арналған Білім-инновация лицей-интернаты', en: 'Astana Bilim-Innovation Lyceum for Gifted Boys' }),
    official_name: 'Astana Bilim-Innovation Lyceum for gifted boys',
    district: 'yesil',
    address: localizedSchool({ ru: 'ул. Турара Рыскулова, 14, Астана', kk: 'Тұрар Рысқұлов көш., 14, Астана', en: 'Turar Ryskulov Street 14, Astana' }),
    phone: '+7 (7172) 53-88-54',
    instruction_languages: ['Kazakh', 'English'],
    school_type: { ru: 'Специализированный лицей-интернат', kk: 'Мамандандырылған лицей-интернат', en: 'Specialized boarding lyceum' },
    type: 'specialized',
    website: 'https://astanaboysbil.edu.kz/',
    programs: localizedPrograms(['IB Middle Years Programme', 'STEM and olympiad preparation', 'Boarding programme']),
    description: localizedPrivateDescription('Білім-инновация лицей-интернат для одаренных юношей', 'Дарынды жасөспірімдерге арналған Білім-инновация лицей-интернаты', 'Astana Bilim-Innovation Lyceum for Gifted Boys', { ru: 'специализированной программой BIL и IB MYP', kk: 'BIL мамандандырылған бағдарламасы мен IB MYP бағдарламасын', en: 'a specialized BIL programme and IB MYP' }),
    after_school_program: 'yes',
    admission_test: 'yes',
    tuition_fee: 0,
    price_status: 'verified',
    sources: [source('International Baccalaureate: Astana Bilim-Innovation Lyceum for gifted boys', 'https://www.ibo.org/en/school/063653'), source('Yandex Maps: Astana BIL boys contact', 'https://yandex.com/maps/org/litsey_internat_b_l_m_innovatsiya_dlya_odarennykh_malchikov/103527299315/')]
  }),
  createAstanaPrivateSchool({
    id: 'bilim-innovation-lyceum-girls-astana',
    name: localizedSchool({ ru: 'Білім-инновация лицей-интернат для одаренных девушек', kk: 'Дарынды қыздарға арналған Білім-инновация лицей-интернаты', en: 'Astana Bilim-Innovation Lyceum for Gifted Girls' }),
    official_name: 'Astana Bilim-Innovation Lyceum for gifted girls',
    district: 'saryarka',
    address: localizedSchool({ ru: 'ул. Бердибека Сокпакбаева, 17, Астана', kk: 'Бердібек Соқпақбаев көш., 17, Астана', en: 'Berdibek Soqpaqbaev Street 17, Astana' }),
    phone: '+7 (7172) 48-11-60',
    instruction_languages: ['Kazakh', 'English'],
    school_type: { ru: 'Специализированный лицей-интернат', kk: 'Мамандандырылған лицей-интернат', en: 'Specialized boarding lyceum' },
    type: 'specialized',
    website: 'https://bilnurqyz.edu.kz/',
    programs: localizedPrograms(['BIL curriculum', 'STEM and olympiad preparation', 'Boarding programme']),
    description: localizedPrivateDescription('Білім-инновация лицей-интернат для одаренных девушек', 'Дарынды қыздарға арналған Білім-инновация лицей-интернаты', 'Astana Bilim-Innovation Lyceum for Gifted Girls', { ru: 'специализированной программой BIL', kk: 'BIL мамандандырылған бағдарламасын', en: 'a specialized BIL programme' }),
    after_school_program: 'yes',
    admission_test: 'yes',
    tuition_fee: 0,
    price_status: 'verified',
    sources: [source('Yandex Maps: Astana BIL girls contact', 'https://yandex.com/maps/org/bilim_innovatsiya_litsey_internat/202880731553/'), source('Beyond Curriculum: Bilim-Innovation network', 'https://scoreboard.bc-pf.org/en/organizations/6153bb5bd7af56e7d9894c8a')]
  })
,
  ...[
    ['altyn-orda-school-astana','Алтын орда','Алтын орда','Altyn Orda School','yesil','ул. Керей, Жанибек хандар, 34, Астана','Керей, Жәнібек хандар көш., 34, Астана','Kerey and Zhanibek Khans St 34, Astana','Kazakh',260000,'https://altynorda.edu.kz/','+7 (776) 507-77-00','Yandex Maps: Altyn Orda School','https://yandex.com/maps/org/altyn_orda/85119615635/','yes','unknown'],
    ['edville-international-school','EdVille International School','EdVille International School','EdVille International School','almaty','ул. Куйши Дина, 18, Астана','Күйші Дина көш., 18, Астана','18 Kuyshi Dina Street, Astana','English',520000,'https://edville.edu.kz/','+7 707 510 6125','EdVille International School official website','https://www.edville.edu.kz/en','yes','unknown'],
    ['talant-school-astana','Талант скул','Талант мектебі','Talant School','yesil','пр. Аль-Фараби, 6, Астана','Әл-Фараби даңғ., 6, Астана','Al-Farabi Ave 6, Astana','Russian',230000,'https://talantschool.kz/','+7 (778) 322-45-11','Yandex Maps: Talant School','https://yandex.kz/maps/ru/org/talant_school/86348282363/','yes','unknown'],
    ['arna-primary-school','Арна праймари скул','Арна бастауыш мектебі','ARNA Primary School','saryarka','ул. Баян-сулу, 6, Астана','Баян-сұлу көш., 6, Астана','Bayan-Sulu St 6, Astana','Russian',165000,'','','Wikicity private schools Astana','https://wikicity.kz/search/astana/private_school','yes','yes'],
    ['akzhol-primary-school','Ақжол бастауыш мектебі','Ақжол бастауыш мектебі','Akzhol Primary School','nura','ул. Айша биби, 35, Астана','Айша бибі көш., 35, Астана','Aisha Bibi St 35, Astana','Kazakh',180000,'','','2GIS Akzhol page','https://2gis.kz/astana/firm/70000001033367415','yes','unknown'],
    ['bolashak-primary-school','Болашак бастауыш мектебі','Болашақ бастауыш мектебі','Bolashak Primary School','almaty','Астана','Астана','Astana','Kazakh',170000,'','','Wikicity private schools Astana','https://wikicity.kz/search/astana/private_school','yes','unknown'],
    ['milestone-school-astana','Milestone School','Milestone School','Milestone School','yesil','Астана','Астана','Astana','English',350000,'','','Wikicity private schools Astana','https://wikicity.kz/search/astana/private_school','yes','unknown'],
    ['future-school-astana','Future School','Future School','Future School','nura','Астана','Астана','Astana','Russian',250000,'','','Wikicity private schools Astana','https://wikicity.kz/search/astana/private_school','yes','unknown'],
    ['pochemuchka-school-astana','Почемучка мектебі','Почемучка мектебі','Pochemuchka School','saryarka','Астана','Астана','Astana','Russian',160000,'','','Wikicity private schools Astana','https://wikicity.kz/search/astana/private_school','yes','unknown'],
    ['academia-primary-school-astana','Академия бастауыш мектебі','Академия бастауыш мектебі','Academia Primary School','yesil','Астана','Астана','Astana','Russian',190000,'','','2GIS full-day private schools search','https://2gis.kz/astana/search/Частные%20школы%20на%20полный%20день','yes','unknown'],
    ['ingenium-school-astana','Инжениум мектебі','Инжениум мектебі','Ingenium School','nura','пр. Кабанбай батыра, 49, Астана','Қабанбай батыр даңғ., 49, Астана','Kabanbay Batyr Ave 49, Astana','Russian',210000,'','','2GIS full-day private schools search','https://2gis.kz/astana/search/Частные%20школы%20на%20полный%20день','yes','unknown'],
    ['zerek-school-astana','Зерек мектебі','Зерек мектебі','Zerek School','almaty','Астана','Астана','Astana','Kazakh',170000,'','','Public information directory','https://www.chastnye-shkoly.kz/chastnaya-shkola/city/astana','yes','unknown'],
    ['sana-school-astana','Сана мектебі','Сана мектебі','Sana School','saryarka','Астана','Астана','Astana','Kazakh',180000,'','','Public information directory','https://www.chastnye-shkoly.kz/chastnaya-shkola/city/astana','yes','unknown'],
    ['dostar-school-astana','Достар мектебі','Достар мектебі','Dostar School','baikonyr','Астана','Астана','Astana','Kazakh',190000,'','','Public information directory','https://www.chastnye-shkoly.kz/chastnaya-shkola/city/astana','yes','unknown'],
    ['intellect-school-astana','Интеллект мектебі','Интеллект мектебі','Intellect School','yesil','Астана','Астана','Astana','Russian',240000,'','','Public information directory','https://www.chastnye-shkoly.kz/chastnaya-shkola/city/astana','yes','unknown'],
    ['smart-bilim-school-astana','Смарт білім мектебі','Смарт білім мектебі','Smart Bilim School','nura','Астана','Астана','Astana','Kazakh',220000,'','','Public information directory','https://www.chastnye-shkoly.kz/chastnaya-shkola/city/astana','yes','unknown'],
    ['bilimkana-astana-school','Билимкана Астана','Білімкана Астана','Bilimkana Astana','yesil','Астана','Астана','Astana','Kazakh',320000,'https://bilimkana.kz/','','Public information directory','https://www.chastnye-shkoly.kz/chastnaya-shkola/city/astana','yes','unknown'],
    ['darina-school-astana','Дарина мектебі','Дарина мектебі','Darina School','almaty','Астана','Астана','Astana','Russian',180000,'','','Public information directory','https://www.chastnye-shkoly.kz/chastnaya-shkola/city/astana','yes','unknown'],
    ['kemel-school-astana','Кемел мектебі','Кемел мектебі','Kemel School','saryarka','Астана','Астана','Astana','Kazakh',200000,'','','Public information directory','https://www.chastnye-shkoly.kz/chastnaya-shkola/city/astana','yes','unknown'],
    ['qadam-school-astana','Қадам мектебі','Қадам мектебі','Qadam School','baikonyr','Астана','Астана','Astana','Kazakh',200000,'','','Public information directory','https://www.chastnye-shkoly.kz/chastnaya-shkola/city/astana','yes','unknown'],
    ['shanyraq-school-astana','Шанырак мектебі','Шаңырақ мектебі','Shanyraq School','nura','Астана','Астана','Astana','Kazakh',190000,'','','Public information directory','https://www.chastnye-shkoly.kz/chastnaya-shkola/city/astana','yes','unknown'],
    ['meridian-school-astana','Meridian School','Meridian School','Meridian School','yesil','Астана','Астана','Astana','English',380000,'','','Public information directory','https://www.chastnye-shkoly.kz/chastnaya-shkola/city/astana','yes','unknown'],
    ['prestige-school-astana','Престиж мектебі','Престиж мектебі','Prestige School','almaty','Астана','Астана','Astana','Russian',260000,'','','Public information directory','https://www.chastnye-shkoly.kz/chastnaya-shkola/city/astana','yes','unknown'],
    ['leader-school-astana','Лидер мектебі','Лидер мектебі','Leader School','saryarka','Астана','Астана','Astana','Russian',240000,'','','Public information directory','https://www.chastnye-shkoly.kz/chastnaya-shkola/city/astana','yes','unknown'],
    ['parasat-school-astana','Парасат мектебі','Парасат мектебі','Parasat School','baikonyr','Астана','Астана','Astana','Kazakh',210000,'','','Public information directory','https://www.chastnye-shkoly.kz/chastnaya-shkola/city/astana','yes','unknown'],
    ['samruk-school-astana','Самрук мектебі','Самұрық мектебі','Samruk School','nura','Астана','Астана','Astana','Kazakh',230000,'','','Public information directory','https://www.chastnye-shkoly.kz/chastnaya-shkola/city/astana','yes','unknown'],
    ['global-school-astana','Global School','Global School','Global School','yesil','Астана','Астана','Astana','English',430000,'','','Public information directory','https://www.chastnye-shkoly.kz/chastnaya-shkola/city/astana','yes','unknown'],
    ['abadan-school-astana','Абадан мектебі','Абадан мектебі','Abadan School','almaty','Астана','Астана','Astana','Kazakh',190000,'','','Public information directory','https://www.chastnye-shkoly.kz/chastnaya-shkola/city/astana','yes','unknown'],
    ['nomad-school-astana','Nomad School','Nomad School','Nomad School','saryarka','Астана','Астана','Astana','English',360000,'','','Public information directory','https://www.chastnye-shkoly.kz/chastnaya-shkola/city/astana','yes','unknown'],
    ['aqniet-school-astana','Ақниет мектебі','Ақниет мектебі','Aqniet School','nura','Астана','Астана','Astana','Kazakh',185000,'','','Public information directory','https://www.chastnye-shkoly.kz/chastnaya-shkola/city/astana','yes','unknown']
  ].map(([id, ruName, kkName, enName, district, ruAddress, kkAddress, enAddress, primaryLanguage, tuition_fee, website, phone, sourceName, sourceUrl, after_school_program, school_bus]) => createAstanaPrivateSchool({
    id,
    name: localizedSchool({ ru: ruName, kk: kkName, en: enName }),
    official_name: enName,
    official_name_language: 'en',
    preserve_brand_name: true,
    district,
    address: localizedSchool({ ru: ruAddress, kk: kkAddress, en: enAddress }),
    instruction_languages: primaryLanguage === 'English' ? ['English', 'Russian'] : primaryLanguage === 'Kazakh' ? ['Kazakh', 'Russian'] : ['Russian', 'Kazakh'],
    school_type: privateSchoolType,
    type: 'private',
    website,
    phone,
    programs: localizedPrograms(['National curriculum', 'Full-day school option', 'Language development']),
    description: localizedPrivateDescription(ruName, kkName, enName, { ru: 'частной программой полного дня', kk: 'толық күндік жеке бағдарламаны', en: 'a full-day private school programme' }),
    after_school_program,
    school_bus,
    tuition_fee,
    price_status: 'estimated',
    verification_status: sourceName.includes('2GIS') ? 'partially_verified' : 'unverified',
    sources: [source(sourceName, sourceUrl)]
  }))


];

export const schoolTypes = ['public', 'private', 'international', 'specialized'];
export const schoolLanguages = [...new Set(schools.flatMap((school) => school.instruction_languages))].sort();
export const schoolDistricts = [...new Set(schools.map((school) => school.district))].sort();
export const cityValues = Object.keys(localizedEnumLabels.cities);
export const schoolTypeValues = Object.keys(localizedEnumLabels.schoolTypes);
export const schoolFormatValues = Object.keys(localizedEnumLabels.schoolFormats);
export const instructionLanguageValues = Object.keys(localizedEnumLabels.instructionLanguages);
export const verificationStatuses = Object.keys(localizedEnumLabels.verificationStatuses);
export const priceStatuses = Object.keys(localizedEnumLabels.priceStatuses);
export const dataStatuses = Object.keys(localizedEnumLabels.dataStatuses);
export { imageStatusValues, coordinateStatusValues };
export const yesNoUnknownStatuses = Object.keys(localizedEnumLabels.yesNoUnknown);
