/**
 * Reusable Astana school dataset.
 *
 * The top-level fields keep the current UI simple, while nested contact,
 * academics, metadata, and source objects make each record easier to expand
 * with admissions, catchment, coordinates, curriculum, fee, and review data.
 */
const ASTANA_PUBLIC_SCHOOL_SOURCE = {
  name: 'Electronic government of the Republic of Kazakhstan: contacts of secondary schools',
  url: 'https://egov.kz/cms/en/articles/secondary_school/2Fspisok_wkol_rk/1000'
};

const WEBSITE_SOURCE = {
  name: 'Astana education school website network',
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

const localizeLanguages = (instructionLanguages) => ({
  ru: instructionLanguages.map((language) => instructionLanguageTranslations[language]?.ru ?? language).join(', '),
  kk: instructionLanguages.map((language) => instructionLanguageTranslations[language]?.kk ?? language).join(', '),
  en: instructionLanguages.map((language) => instructionLanguageTranslations[language]?.en ?? language).join(', ')
});

const localizeSchoolType = (schoolType) => schoolTypeTranslations[schoolType] ?? { ru: schoolType, kk: schoolType, en: schoolType };

const localizeAddress = (address) => ({
  ru: addressTranslations[address]?.ru ?? address,
  kk: addressTranslations[address]?.kk ?? address,
  en: address
});

const localizeClassSize = (classSize) => ({
  ru: classSize === 'Varies by grade and available capacity' ? 'Зависит от класса и доступных мест' : classSize,
  kk: classSize === 'Varies by grade and available capacity' ? 'Сыныпқа және бос орындарға байланысты' : classSize,
  en: classSize
});

const districtTranslations = {
  Almaty: { ru: 'Алматинском', kk: 'Алматы' },
  Baikonyr: { ru: 'Байконырском', kk: 'Байқоңыр' },
  Saryarka: { ru: 'Сарыаркинском', kk: 'Сарыарқа' },
  Yesil: { ru: 'Есильском', kk: 'Есіл' }
};

const districtLabel = (district, language) => {
  const translatedDistrict = districtTranslations[district]?.[language] ?? district;
  const suffix = language === 'ru' ? 'районе' : 'ауданында';
  return `${translatedDistrict} ${suffix}`;
};

const localizeName = (name) => {
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

const localizePrograms = (programs) => ({
  ru: programs.map((program) => programTranslations[program]?.ru ?? program),
  kk: programs.map((program) => programTranslations[program]?.kk ?? program),
  en: programs
});

const localizeDescription = ({ description, district, instruction_languages, school_type }) => {
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

const localizeAdmissionRequirements = (admissionRequirements) => ({
  ru: 'Стандартные документы для зачисления в государственную школу и подтверждение права обучения по месту проживания.',
  kk: 'Мемлекеттік мектепке қабылдауға арналған стандартты құжаттар және тұрғылықты жері бойынша бекітілу құқығын растау.',
  en: admissionRequirements
});

export const getLocalizedSchoolValue = (value, language) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return value;
  }

  const normalizedLanguage = language === 'kz' ? 'kk' : language;
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
  rating = 0
}) => {
  const localizedName = localizeName(name);
  const localizedDescription = localizeDescription({ description, district, instruction_languages, school_type });
  const localizedPrograms = localizePrograms(programs);
  const localizedAdmissionRequirements = localizeAdmissionRequirements(admission_requirements);
  const localizedSchoolType = localizeSchoolType(school_type);
  const localizedLanguages = localizeLanguages(instruction_languages);
  const localizedAddress = localizeAddress(address);
  const localizedClassSize = localizeClassSize(class_size);

  return ({
  id,
  name: localizedName,
  official_name,
  official_name_local,
  city: 'Astana',
  district,
  type: 'public',
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
  website: schoolWebsite(number),
  phone: formatPhone(phone),
  description: localizedDescription,
  programs: localizedPrograms,
  verification_status,
  contact: {
    address: localizedAddress,
    website: schoolWebsite(number),
    phone: formatPhone(phone)
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
    ownership: 'public',
    price_status,
    data_status,
    audit_status: AUDIT_RESULT.status,
    expandable_fields: ['admissions', 'catchment_area', 'coordinates', 'fees', 'reviews', 'transportation']
  },
  audit: {
    ...AUDIT_RESULT,
    source_names: [ASTANA_PUBLIC_SCHOOL_SOURCE.name, WEBSITE_SOURCE.name]
  },
  sources: [ASTANA_PUBLIC_SCHOOL_SOURCE, WEBSITE_SOURCE]
});
};

export const schools = [
  createAstanaPublicSchool({
    id: 'astana-school-60',
    number: 60,
    name: 'School-Lyceum No. 60',
    official_name: 'PMEME "School-Lyceum No. 60"',
    official_name_local: '«№ 60 мектеп-лицей» ШЖҚ КММ',
    district: 'Saryarka',
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
    district: 'Saryarka',
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
    district: 'Saryarka',
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
    district: 'Almaty',
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
    district: 'Almaty',
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
    district: 'Saryarka',
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
    district: 'Yesil',
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
    district: 'Saryarka',
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
    district: 'Saryarka',
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
    district: 'Yesil',
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
    district: 'Almaty',
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
    district: 'Yesil',
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
    district: 'Almaty',
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
    district: 'Almaty',
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
    district: 'Almaty',
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
    district: 'Yesil',
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
    district: 'Yesil',
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
    district: 'Yesil',
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
    district: 'Yesil',
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
    district: 'Yesil',
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
    district: 'Saryarka',
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
    district: 'Yesil',
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
    district: 'Yesil',
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
    district: 'Almaty',
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
    district: 'Yesil',
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
    district: 'Yesil',
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
    district: 'Almaty',
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
    district: 'Baikonyr',
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
    district: 'Yesil',
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
    district: 'Yesil',
    address: 'Sauran St, 11, Astana',
    phone: '87172918331',
    language: 'Kazakh, Russian',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-lyceum',
    description: 'A public school-lyceum on Sauran Street with Kazakh and Russian instruction.',
    programs: ['Lyceum curriculum', 'General secondary education', 'Bilingual school streams', 'Student clubs']
  })
];

export const schoolTypes = [...new Set(schools.map((school) => school.type))].sort();
export const schoolLanguages = [...new Set(schools.flatMap((school) => school.instruction_languages))].sort();
export const schoolDistricts = [...new Set(schools.map((school) => school.district))].sort();
export const verificationStatuses = ['verified', 'unverified'];
export const priceStatuses = ['verified', 'estimated', 'unknown'];
export const dataStatuses = ['verified', 'partially_verified', 'needs_review'];
export const yesNoUnknownStatuses = ['yes', 'no', 'unknown'];
