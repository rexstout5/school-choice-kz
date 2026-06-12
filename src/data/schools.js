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

const formatPhone = (phone) => `+7 (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 9)}-${phone.slice(9)}`;
const schoolWebsite = (schoolNumber) => `https://${schoolNumber}.astana-bilim.kz`;

const fallbackLanguageOrder = ['ru', 'en', 'kk'];

const instructionLanguageTranslations = {
  Kazakh: { ru: 'Казахский', kk: 'Қазақ тілі', en: 'Kazakh' },
  Russian: { ru: 'Русский', kk: 'Орыс тілі', en: 'Russian' },
  English: { ru: 'Английский', kk: 'Ағылшын тілі', en: 'English' }
};

const schoolOwnershipTypeTranslations = {
  public: { ru: 'Государственная', kk: 'Мемлекеттік', en: 'Public' },
  private: { ru: 'Частная', kk: 'Жеке', en: 'Private' },
  international: { ru: 'Международная', kk: 'Халықаралық', en: 'International' },
  specialized: { ru: 'Специализированная', kk: 'Мамандандырылған', en: 'Specialized' }
};

const verificationStatusTranslations = {
  verified: { ru: 'Проверено', kk: 'Тексерілген', en: 'Verified' },
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
  audit = AUDIT_RESULT
}) => {
  const localizedName = localizeName(name);
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

  return ({
  id,
  name: localizedName,
  official_name,
  official_name_local,
  city: 'Astana',
  district,
  type: resolvedType,
  school_type: localizedSchoolType,
  language,
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
  rating,
  address: localizedAddress,
  website: resolvedWebsite,
  phone: resolvedPhone,
  description: localizedDescription,
  programs: localizedPrograms,
  verification_status,
  contact: {
    address: localizedAddress,
    website: resolvedWebsite,
    phone: resolvedPhone
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
const localizedPrograms = (en) => ({
  ru: ['Международная учебная программа', 'Языковое развитие', 'Внеурочные занятия'],
  kk: ['Халықаралық оқу бағдарламасы', 'Тілдерді дамыту', 'Сыныптан тыс іс-шаралар'],
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

const createAstanaPrivateSchool = ({ id, name, official_name, district, address, phone, instruction_languages, school_type, type, tuition_fee, price_status, data_status = 'needs_review', website, programs, description }) =>
  createAstanaPublicSchool({
    id,
    number: 0,
    name,
    official_name,
    official_name_local: getLocalizedSchoolValue(name, 'ru'),
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
    after_school_program: 'yes',
    school_bus: 'unknown',
    admission_test: 'yes',
    class_size: privateClassSize,
    admission_requirements: privateAdmissionRequirements,
    website,
    sources: privateSources,
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
    admission_test: 'yes'
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
    admission_test: 'yes'
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
    name: localizedSchool({ ru: 'Хейлибери Астана', kk: 'Хейлибери Астана', en: 'Haileybury Astana' }),
    official_name: 'Haileybury Astana',
    district: 'yesil',
    address: localizedSchool({ ru: 'пр. Кабанбай батыра, 4, Астана', kk: 'Қабанбай батыр даңғ., 4, Астана', en: 'Kabanbay Batyr Ave, 4, Astana' }),
    phone: '87172559855',
    instruction_languages: ['English'],
    school_type: englishInternationalType,
    type: 'international',
    tuition_fee: 693600,
    price_status: 'verified',
    website: 'https://www.haileybury.kz/en/astana',
    programs: localizedPrograms(['British curriculum', 'International Baccalaureate', 'English-medium instruction']),
    description: localizedPrivateDescription('Хейлибери Астана', 'Хейлибери Астана', 'Haileybury Astana', { ru: 'британской программой', kk: 'британдық бағдарламаны', en: 'a British curriculum' })
  }),
  createAstanaPrivateSchool({
    id: 'spectrum-international-school-astana',
    name: localizedSchool({ ru: 'Спектрум интернешнл скул', kk: 'Спектрум интернешнл скул', en: 'Spectrum International School' }),
    official_name: 'Spectrum International School',
    district: 'almaty',
    address: localizedSchool({ ru: 'пр. Рахымжана Кошкарбаева, 11, Астана', kk: 'Рақымжан Қошқарбаев даңғ., 11, Астана', en: 'Rakhymzhan Koshkarbayev Ave, 11, Astana' }),
    phone: '87079263646',
    instruction_languages: ['English'],
    school_type: englishInternationalType,
    type: 'international',
    tuition_fee: 616000,
    price_status: 'verified',
    website: 'https://spectrum.edu.kz/',
    programs: localizedPrograms(['Cambridge curriculum', 'English-medium instruction', 'International exams']),
    description: localizedPrivateDescription('Спектрум интернешнл скул', 'Спектрум интернешнл скул', 'Spectrum International School', { ru: 'британской программой', kk: 'британдық бағдарламаны', en: 'a British curriculum' })
  }),
  createAstanaPrivateSchool({
    id: 'miras-international-school-astana',
    name: localizedSchool({ ru: 'Мирас интернешнл скул Астана', kk: 'Мирас интернешнл скул Астана', en: 'Miras International School Astana' }),
    official_name: 'Miras International School Astana',
    district: 'yesil',
    address: localizedSchool({ ru: 'ул. Керей и Жанибек хандар, 30, Астана', kk: 'Керей және Жәнібек хандар көш., 30, Астана', en: 'Kerey and Zhanibek Khans St, 30, Astana' }),
    phone: '87172515627',
    instruction_languages: ['English', 'Russian'],
    school_type: englishInternationalType,
    type: 'international',
    tuition_fee: 466710,
    price_status: 'verified',
    website: 'https://miras-astana.kz/',
    programs: localizedPrograms(['IB curriculum', 'Cambridge pathway', 'Bilingual learning']),
    description: localizedPrivateDescription('Мирас интернешнл скул Астана', 'Мирас интернешнл скул Астана', 'Miras International School Astana', { ru: 'международной программой', kk: 'халықаралық бағдарламаны', en: 'international programmes' })
  }),
  createAstanaPrivateSchool({
    id: 'qsi-international-school-astana',
    name: localizedSchool({ ru: 'Кью эс ай интернешнл скул Астана', kk: 'Кью эс ай интернешнл скул Астана', en: 'QSI International School of Astana' }),
    official_name: 'QSI International School of Astana',
    district: 'saryarka',
    address: localizedSchool({ ru: 'ул. Баян-Сулу, 15, Астана', kk: 'Баян-Сұлу көш., 15, Астана', en: 'Bayan-Sulu St, 15, Astana' }),
    phone: '87172774382',
    instruction_languages: ['English'],
    school_type: englishInternationalType,
    type: 'international',
    tuition_fee: null,
    price_status: 'unknown',
    website: 'https://astana.qsi.org/',
    programs: localizedPrograms(['American curriculum', 'English-medium instruction', 'College preparation']),
    description: localizedPrivateDescription('Кью эс ай интернешнл скул Астана', 'Кью эс ай интернешнл скул Астана', 'QSI International School of Astana', { ru: 'американской программой', kk: 'америкалық бағдарламаны', en: 'an American curriculum' })
  }),
  createAstanaPrivateSchool({
    id: 'ecole-francaise-charles-de-gaulle-miras',
    name: localizedSchool({ ru: 'Французская школа Шарль де Голль Мирас', kk: 'Шарль де Голль Мирас француз мектебі', en: 'Ecole Française Internationale Charles de Gaulle-Miras' }),
    official_name: 'Ecole Française Internationale Charles de Gaulle-Miras',
    district: 'yesil',
    address: localizedSchool({ ru: 'территория школы Мирас, Астана', kk: 'Мирас мектебінің аумағы, Астана', en: 'Miras school campus, Astana' }),
    phone: '87172515627',
    instruction_languages: ['English'],
    school_type: englishInternationalType,
    type: 'international',
    tuition_fee: 433989,
    price_status: 'estimated',
    website: 'https://eficdg-miras.com/',
    programs: localizedPrograms(['French curriculum', 'International pathway', 'Language development']),
    description: localizedPrivateDescription('Французская школа Шарль де Голль Мирас', 'Шарль де Голль Мирас француз мектебі', 'Ecole Française Internationale Charles de Gaulle-Miras', { ru: 'французской программой', kk: 'француз бағдарламасын', en: 'a French curriculum' })
  }),
  createAstanaPrivateSchool({
    id: 'kazakhstan-international-school-astana',
    name: localizedSchool({ ru: 'Казахстан интернешнл скул Астана', kk: 'Қазақстан интернешнл скул Астана', en: 'Kazakhstan International School Astana' }),
    official_name: 'Kazakhstan International School Astana',
    district: 'yesil',
    address: localizedSchool({ ru: 'Астана, район Есиль', kk: 'Астана, Есіл ауданы', en: 'Yesil district, Astana' }),
    phone: '87000000001',
    instruction_languages: ['English'],
    school_type: englishInternationalType,
    type: 'international',
    tuition_fee: 492051,
    price_status: 'estimated',
    website: 'https://kisastana.com/',
    programs: localizedPrograms(['International curriculum', 'English-medium instruction', 'Primary years programme']),
    description: localizedPrivateDescription('Казахстан интернешнл скул Астана', 'Қазақстан интернешнл скул Астана', 'Kazakhstan International School Astana', { ru: 'международной программой', kk: 'халықаралық бағдарламаны', en: 'an international curriculum' })
  }),
  createAstanaPrivateSchool({
    id: 'international-steppe-school-astana',
    name: localizedSchool({ ru: 'Интернешнл степ скул Астана', kk: 'Интернешнл степ скул Астана', en: 'International Steppe School of Astana' }),
    official_name: 'International Steppe School of Astana',
    district: 'nura',
    address: localizedSchool({ ru: 'Астана, район Нура', kk: 'Астана, Нұра ауданы', en: 'Nura district, Astana' }),
    phone: '87000000002',
    instruction_languages: ['English'],
    school_type: englishInternationalType,
    type: 'international',
    tuition_fee: 420000,
    price_status: 'estimated',
    website: 'https://iss.edu.kz/',
    programs: localizedPrograms(['IB curriculum', 'English-medium instruction', 'Global citizenship']),
    description: localizedPrivateDescription('Интернешнл степ скул Астана', 'Интернешнл степ скул Астана', 'International Steppe School of Astana', { ru: 'международной программой', kk: 'халықаралық бағдарламаны', en: 'an IB curriculum' })
  }),
  createAstanaPrivateSchool({
    id: 'canadian-international-school-astana',
    name: localizedSchool({ ru: 'Канадиан интернешнл скул Астана', kk: 'Канадиан интернешнл скул Астана', en: 'Canadian International School Astana' }),
    official_name: 'Canadian International School Astana',
    district: 'yesil',
    address: localizedSchool({ ru: 'Астана, район Есиль', kk: 'Астана, Есіл ауданы', en: 'Yesil district, Astana' }),
    phone: '87000000003',
    instruction_languages: ['English'],
    school_type: englishInternationalType,
    type: 'international',
    tuition_fee: 606400,
    price_status: 'estimated',
    website: 'https://cis-astana.kz/',
    programs: localizedPrograms(['Canadian curriculum', 'English-medium instruction', 'University preparation']),
    description: localizedPrivateDescription('Канадиан интернешнл скул Астана', 'Канадиан интернешнл скул Астана', 'Canadian International School Astana', { ru: 'канадской программой', kk: 'канадалық бағдарламаны', en: 'a Canadian curriculum' })
  }),
  createAstanaPrivateSchool({
    id: 'nurorda-school-lyceum-astana',
    name: localizedSchool({ ru: 'Нурорда школа-лицей', kk: 'Нұрорда мектеп-лицейі', en: 'Nurorda School-Lyceum' }),
    official_name: 'Nurorda School-Lyceum',
    district: 'yesil',
    address: localizedSchool({ ru: 'Астана, район Есиль', kk: 'Астана, Есіл ауданы', en: 'Yesil district, Astana' }),
    phone: '87000000004',
    instruction_languages: ['Kazakh', 'Russian', 'English'],
    school_type: privateSchoolType,
    type: 'private',
    tuition_fee: null,
    price_status: 'unknown',
    website: 'https://nurorda.edu.kz/',
    programs: localizedPrograms(['National curriculum', 'Trilingual learning', 'Olympiad preparation']),
    description: localizedPrivateDescription('Нурорда школа-лицей', 'Нұрорда мектеп-лицейі', 'Nurorda School-Lyceum', { ru: 'трехъязычной программой', kk: 'үш тілді бағдарламаны', en: 'trilingual learning' })
  }),
  createAstanaPrivateSchool({
    id: 'quantum-stem-school-astana',
    name: localizedSchool({ ru: 'Квантум стем скул', kk: 'Квантум стем скул', en: 'Quantum STEM School' }),
    official_name: 'Quantum STEM School',
    district: 'yesil',
    address: localizedSchool({ ru: 'Астана, район Есиль', kk: 'Астана, Есіл ауданы', en: 'Yesil district, Astana' }),
    phone: '87000000005',
    instruction_languages: ['Kazakh', 'Russian', 'English'],
    school_type: privateStemType,
    type: 'specialized',
    tuition_fee: 350000,
    price_status: 'estimated',
    website: 'https://quantum.edu.kz/',
    programs: localizedPrograms(['STEM programme', 'Project-based learning', 'Academic competitions']),
    description: localizedPrivateDescription('Квантум стем скул', 'Квантум стем скул', 'Quantum STEM School', { ru: 'естественно-математическим профилем', kk: 'жаратылыстану-математика бағытын', en: 'a STEM profile' })
  }),
  createAstanaPrivateSchool({
    id: 'astana-garden-school',
    name: localizedSchool({ ru: 'Астана гарден скул', kk: 'Астана гарден скул', en: 'Astana Garden School' }),
    official_name: 'Astana Garden School',
    district: 'yesil',
    address: localizedSchool({ ru: 'Астана, район Есиль', kk: 'Астана, Есіл ауданы', en: 'Yesil district, Astana' }),
    phone: '87000000006',
    instruction_languages: ['Kazakh', 'Russian', 'English'],
    school_type: privateSchoolType,
    type: 'private',
    tuition_fee: 280000,
    price_status: 'estimated',
    website: 'https://astanagardenschool.kz/',
    programs: localizedPrograms(['National curriculum', 'Language development', 'Student clubs']),
    description: localizedPrivateDescription('Астана гарден скул', 'Астана гарден скул', 'Astana Garden School', { ru: 'частной школьной программой', kk: 'жеке мектеп бағдарламасын', en: 'a private school programme' })
  }),
  createAstanaPrivateSchool({
    id: 'tamos-space-school-astana',
    name: localizedSchool({ ru: 'Тамос спейс скул', kk: 'Тамос спейс скул', en: 'Tamos Space School' }),
    official_name: 'Tamos Space School',
    district: 'almaty',
    address: localizedSchool({ ru: 'Астана, район Алматы', kk: 'Астана, Алматы ауданы', en: 'Almaty district, Astana' }),
    phone: '87000000007',
    instruction_languages: ['Kazakh', 'Russian', 'English'],
    school_type: privateSchoolType,
    type: 'private',
    tuition_fee: null,
    price_status: 'unknown',
    website: 'https://tamos-space.kz/',
    programs: localizedPrograms(['Primary programme', 'Language development', 'Creative arts']),
    description: localizedPrivateDescription('Тамос спейс скул', 'Тамос спейс скул', 'Tamos Space School', { ru: 'частной школьной программой', kk: 'жеке мектеп бағдарламасын', en: 'a private school programme' })
  })

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
export const yesNoUnknownStatuses = Object.keys(localizedEnumLabels.yesNoUnknown);
