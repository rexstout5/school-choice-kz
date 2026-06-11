/**
 * Reusable Astana school dataset.
 *
 * 2026 data quality audit notes:
 * - Core school identity, address, instruction language, and working phone are transcribed from egov.kz.
 * - Kazakh display names and school websites are cross-checked against the Astana education portal catalog where present.
 * - Descriptive/admissions/transport/enrichment fields are intentionally empty unless verified by an official source.
 */
const ASTANA_EGOV_SOURCE = {
  name: 'Electronic government of the Republic of Kazakhstan: contacts of secondary schools',
  url: 'https://egov.kz/cms/ru/articles/secondary_school/2Fspisok_wkol_rk'
};

const ASTANA_BILIM_CATALOG_SOURCE = {
  name: 'Astana education portal: school website catalog',
  url: 'https://astana-bilim.kz/katalog_shkol?lang=kz'
};

const schoolWebsite = (schoolNumber) => `https://${schoolNumber}.astana-bilim.kz`;

const createAuditedAstanaSchool = ({
  number,
  official_name,
  official_name_local = '',
  address,
  district,
  instruction_languages,
  phone,
  school_type,
  official_name_en = '',
  website = schoolWebsite(number),
  sources = [ASTANA_EGOV_SOURCE, ASTANA_BILIM_CATALOG_SOURCE]
}) => {
  const hasMissingRequestedFields = true;

  return {
    id: `astana-school-${number}`,
    name: official_name_en || official_name,
    official_name,
    official_name_ru: official_name,
    official_name_local,
    official_name_kk: official_name_local,
    official_name_en,
    city: 'Astana',
    district,
    type: 'public',
    school_type,
    language: instruction_languages.join(', '),
    instruction_languages,
    monthly_price: 0,
    tuition_fee: 0,
    price_status: 'verified',
    data_status: hasMissingRequestedFields ? 'partially_verified' : 'verified',
    after_school_program: '',
    school_bus: '',
    admission_test: '',
    class_size: '',
    admission_requirements: '',
    admission_information: '',
    rating: 0,
    address,
    website,
    phone,
    description: '',
    description_ru: '',
    description_kk: '',
    programs: [],
    data_source: sources.map((source) => source.url).join('; '),
    verified: true,
    partially_verified: hasMissingRequestedFields,
    unverified: false,
    verification_status: 'verified',
    contact: {
      address,
      website,
      phone
    },
    academics: {
      school_type,
      instruction_languages,
      programs: [],
      admission_test: ''
    },
    metadata: {
      school_number: number,
      ownership: 'public',
      price_status: 'verified',
      data_status: hasMissingRequestedFields ? 'partially_verified' : 'verified',
      audit_notes: 'Core identity/contact fields verified from official sources; unsupported requested fields left empty.',
      missing_verified_fields: [
        'official_name_en',
        'description_ru',
        'description_kk',
        'admission_information',
        'after_school_program',
        'school_bus',
        'class_size'
      ],
      expandable_fields: ['admissions', 'catchment_area', 'coordinates', 'fees', 'reviews', 'transportation']
    },
    sources
  };
};

export const schools = [
  createAuditedAstanaSchool({
    number: 1,
    official_name: 'КГУ «Школа-лицей № 1»',
    official_name_local: '№1 мектеп-лицей',
    official_name_en: 'School-Lyceum No. 1',
    district: 'Сарыарка',
    address: 'район Сарыарка,улица Желтоксан,9',
    phone: '+7 (717) 256-16-94',
    instruction_languages: ['Russian'],
    school_type: 'Public school-lyceum'
  }),
  createAuditedAstanaSchool({
    number: 2,
    official_name: 'ГКП на ПХВ "Школа-гимназия № 2 имени Гафу Кайырбекова"',
    official_name_local: '№2 мектеп-гимназия',
    official_name_en: 'School-Gymnasium No. 2',
    district: 'Сарыарка',
    address: 'район Сарыарка,улица Сәкен Сейфуллин,19',
    phone: '+7 (717) 250-16-31',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-gymnasium'
  }),
  createAuditedAstanaSchool({
    number: 3,
    official_name: 'ГКП на ПХВ «Школа-гимназия № 3»',
    official_name_local: '№3 мектеп-гимназия',
    official_name_en: 'School-Gymnasium No. 3',
    district: 'Сарыарка',
    address: 'район Сарыарка,Проспект Республика,35',
    phone: '+7 (717) 250-17-00',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-gymnasium'
  }),
  createAuditedAstanaSchool({
    number: 4,
    official_name: 'ГКП на ПХВ «Школа-гимназия № 4 имени Жамбыла Жабаева» акимата города Астаны',
    official_name_local: '№4 мектеп-гимназия',
    official_name_en: 'School-Gymnasium No. 4',
    district: 'Байконыр',
    address: 'район Байконыр,улица Шакена Айманова,3',
    phone: '+7 (717) 250-16-54',
    instruction_languages: ['Kazakh'],
    school_type: 'Public school-gymnasium'
  }),
  createAuditedAstanaSchool({
    number: 5,
    official_name: 'КГУ "Гимназия №5"',
    official_name_local: '№5 мектеп-гимназия',
    official_name_en: 'School-Gymnasium No. 5',
    district: 'Байконыр',
    address: 'район Байконыр,улица Жанибека Тархана,16',
    phone: '+7 (717) 250-17-42',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public gymnasium'
  }),
  createAuditedAstanaSchool({
    number: 6,
    official_name: 'ГКП на ПХВ «Гимназия № 6»',
    official_name_local: '№6 мектеп-гимназия',
    official_name_en: 'School-Gymnasium No. 6',
    district: 'Сарыарка',
    address: 'город Астана,район Сарыарка,Проспект Бөгенбай Батыр,47/1',
    phone: '+7 (717) 243-17-42',
    instruction_languages: ['Russian'],
    school_type: 'Public gymnasium'
  }),
  createAuditedAstanaSchool({
    number: 7,
    official_name: 'ГКП на ПХВ «Школа-гимназия №7 имени Гали Орманова»',
    official_name_local: '№7 мектеп-гимназия',
    official_name_en: 'School-Gymnasium No. 7',
    district: 'Сарыарка',
    address: 'город Астана,район Сарыарка,Проспект Бөгенбай Батыр,57',
    phone: '+7 (717) 250-17-82',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-gymnasium'
  }),
  createAuditedAstanaSchool({
    number: 8,
    official_name: 'ГКП на ПХВ «Школа-лицей № 8» акимата города Астаны',
    official_name_local: '№8 орта мектеп',
    official_name_en: 'School-Lyceum No. 8',
    district: 'Байконыр',
    address: 'город Астана,район Байконыр,улица Сәкен Сейфуллин,50',
    phone: '+7 (717) 250-10-23',
    instruction_languages: ['Kazakh'],
    school_type: 'Public school-lyceum'
  }),
  createAuditedAstanaSchool({
    number: 9,
    official_name: 'КГУ "Специализированная школа № 9 "Зерде"',
    official_name_local: '№9 "Зерде" дарынды балалар мектеп',
    official_name_en: 'Specialized School No. 9',
    district: 'Сарыарка',
    address: 'район Сарыарка,Проспект Сарыарқа,20',
    phone: '+7 (717) 250-18-01',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Specialized public school'
  }),
  createAuditedAstanaSchool({
    number: 10,
    official_name: 'КГУ «Школа-гимназия № 10 имени Жумабека Ташенева»',
    official_name_local: '№10 мектеп-гимназия',
    official_name_en: 'School-Gymnasium No. 10',
    district: 'Байконыр',
    address: 'район Байконыр,улица Мәлік Ғабдуллин,7',
    phone: '+7 (717) 250-17-90',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-gymnasium'
  }),
  createAuditedAstanaSchool({
    number: 11,
    official_name: 'Коммунальное государственное учреждение «Школа-Лицей» № 11 Акимата города Нур-Султан имени Узбекали Жанибекова',
    official_name_local: '',
    official_name_en: 'School-Lyceum No. 11',
    district: 'Сарыарка',
    address: 'район Сарыарка,Проспект Абай,6',
    phone: '+7 (717) 233-47-14',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-lyceum'
  }),
  createAuditedAstanaSchool({
    number: 12,
    official_name: 'КГУ «Комплекс «Детский сад – начальная школа № 12»',
    official_name_local: '№ 12 балабақша – бастауыш мектеп',
    official_name_en: 'Secondary School No. 12',
    district: 'Байконыр',
    address: 'район Байконыр,Жилой массив Өндіріс улица Қамысты,7',
    phone: '+7 (717) 253-15-21',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public kindergarten-primary school complex'
  }),
  createAuditedAstanaSchool({
    number: 13,
    official_name: 'ГКП на ПХВ «Средняя школа № 13» акимата города Астаны',
    official_name_local: '№13 орта мектеп',
    official_name_en: 'Secondary School No. 13',
    district: 'Алматы',
    address: 'район Алматы,Жилой массив Промышленный улица Шалкөде,5',
    phone: '+7 (717) 252-71-68',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public secondary school'
  }),
  createAuditedAstanaSchool({
    number: 14,
    official_name: 'КГУ «Школа-гимназия № 14»',
    official_name_local: '№14 мектеп-гимназия',
    official_name_en: 'School-Gymnasium No. 14',
    district: 'Сарыарка',
    address: 'район Сарыарка,улица Мәскеу,23',
    phone: '+7 (717) 250-14-80',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-gymnasium'
  }),
  createAuditedAstanaSchool({
    number: 15,
    official_name: 'ГКП на ПХВ «Школа-лицей № 15»',
    official_name_local: '№15 мектеп- лицей',
    official_name_en: 'School-Lyceum No. 15',
    district: 'Сарыарка',
    address: 'Проспект Сарыарқа,48/1',
    phone: '+7 (717) 250-14-98',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-lyceum'
  }),
  createAuditedAstanaSchool({
    number: 16,
    official_name: 'КГУ "Средняя школа № 16 имени Т. Айбергенова"',
    official_name_local: '№16 орта мектеп',
    official_name_en: 'Secondary School No. 16',
    district: 'Байконыр',
    address: 'район Байконыр,улица Кенесары,81',
    phone: '+7 (717) 250-16-62',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public secondary school'
  }),
  createAuditedAstanaSchool({
    number: 17,
    official_name: 'ГКП на ПХВ «Школа-гимназия № 17 им. Акана Курманова»',
    official_name_local: '№17 мектеп-гимназия',
    official_name_en: 'School-Gymnasium No. 17',
    district: 'Есиль',
    address: 'район Есиль,Проспект Қабанбай Батыр,9/1',
    phone: '+7 (717) 250-17-26',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-gymnasium'
  }),
  createAuditedAstanaSchool({
    number: 18,
    official_name: 'ГКП на ПХВ «Средняя школа №18» акимата города Астаны',
    official_name_local: '№18 орта мектеп',
    official_name_en: 'Secondary School No. 18',
    district: 'Сарыарка',
    address: 'район Сарыарка,Проспект Бөгенбай Батыр,17',
    phone: '+7 (717) 250-15-75',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public secondary school'
  }),
  createAuditedAstanaSchool({
    number: 19,
    official_name: 'КГУ «Средняя школа № 19»',
    official_name_local: '№19 орта мектеп',
    official_name_en: 'Secondary School No. 19',
    district: 'Сарыарка',
    address: 'район Сарыарка,улица Тамшалы,32',
    phone: '+7 (717) 249-23-28',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public secondary school'
  }),
  createAuditedAstanaSchool({
    number: 20,
    official_name: 'КГУ «Средняя школа № 20»',
    official_name_local: '№20 орта мектеп',
    official_name_en: 'Secondary School No. 20',
    district: 'Сарыарка',
    address: 'район Сарыарка,улица Карталинская,62',
    phone: '+7 (717) 227-80-09',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public secondary school'
  }),
  createAuditedAstanaSchool({
    number: 21,
    official_name: 'КГУ «Средняя школа № 21»',
    official_name_local: '№21 орта мектеп',
    official_name_en: 'Secondary School No. 21',
    district: 'Байконыр',
    address: 'район Байконыр,улица Кошке Кеменгерулы,4',
    phone: '+7 (717) 250-15-81',
    instruction_languages: ['Russian'],
    school_type: 'Public secondary school'
  }),
  createAuditedAstanaSchool({
    number: 22,
    official_name: 'ГКП на ПХВ «Школа-гимназия № 22»',
    official_name_local: '№22 мектеп-гимназия',
    official_name_en: 'School-Gymnasium No. 22',
    district: 'Алматы',
    address: 'район Алматы,улица Жанайдара Жирентаева,16',
    phone: '+7 (717) 250-17-51',
    instruction_languages: ['Russian'],
    school_type: 'Public school-gymnasium'
  }),
  createAuditedAstanaSchool({
    number: 23,
    official_name: 'КГУ «Средняя школа № 23»',
    official_name_local: '№23 орта мектеп',
    official_name_en: 'Secondary School No. 23',
    district: 'Байконыр',
    address: 'район Байконыр,Жилой массив Өндіріс улица Тайбурыл,17',
    phone: '+7 (717) 250-15-92',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public secondary school'
  }),
  createAuditedAstanaSchool({
    number: 24,
    official_name: 'ГКП на ПХВ "Средняя школа №24"',
    official_name_local: '№24 орта мектеп',
    official_name_en: 'Secondary School No. 24',
    district: 'Есиль',
    address: 'район Есиль,Жилой массив Пригородный улица Арнасай,127',
    phone: '+7 (717) 228-63-66',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public secondary school'
  }),
  createAuditedAstanaSchool({
    number: 25,
    official_name: 'КГУ «Средняя школа № 25»',
    official_name_local: '№25 орта мектеп',
    official_name_en: 'Secondary School No. 25',
    district: 'Сарыарка',
    address: 'район Сарыарка,улица Ыбырай Алтынсарин,9',
    phone: '+7 (717) 250-66-87',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public secondary school'
  }),
  createAuditedAstanaSchool({
    number: 26,
    official_name: 'ГКП на ПХВ «Школа- гимназия № 26»',
    official_name_local: '№26 балабақша – бастауыш мектеп',
    official_name_en: 'School-Gymnasium No. 26',
    district: 'Сарыарка',
    address: 'район Сарыарка,улица Конституция,24',
    phone: '+7 (717) 227-33-35',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-gymnasium'
  }),
  createAuditedAstanaSchool({
    number: 27,
    official_name: 'ГКП на ПХВ "Школа-лицей № 27"',
    official_name_local: '№27 мектеп-лицей',
    official_name_en: 'School-Lyceum No. 27',
    district: 'Байконыр',
    address: 'район Байконыр,Микрорайон Жастар улица Таха Хусейна,5/1',
    phone: '+7 (717) 250-17-52',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-lyceum'
  }),
  createAuditedAstanaSchool({
    number: 28,
    official_name: 'ГКП на ПХВ "Школа-лицей №28"',
    official_name_local: '№28 орта мектеп',
    official_name_en: 'School-Lyceum No. 28',
    district: 'Алматы',
    address: 'район Алматы,улица АЛЕКСЕЙ ПЕТРОВ,8',
    phone: '+7 (717) 250-15-05',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-lyceum'
  }),
  createAuditedAstanaSchool({
    number: 29,
    official_name: 'КГУ «Средняя школа № 29»',
    official_name_local: '№29 орта мектеп',
    official_name_en: 'Secondary School No. 29',
    district: 'Алматы',
    address: 'район Алматы,Жилой массив Железнодорожный улица Горького,22',
    phone: '+7 (717) 294-74-43',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public secondary school'
  }),
  createAuditedAstanaSchool({
    number: 30,
    official_name: 'КГУ "Школа-гимназия № 30"',
    official_name_local: '№30 мектеп-гимназия',
    official_name_en: 'School-Gymnasium No. 30',
    district: 'Алматы',
    address: 'район Алматы,улица АЛЕКСЕЙ ПЕТРОВ,11',
    phone: '+7 (717) 250-17-18',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-gymnasium'
  }),
  createAuditedAstanaSchool({
    number: 31,
    official_name: 'ГКП на ПХВ "Школа-гимназия №31" акимата города Астаны',
    official_name_local: '№31 мектеп-гимназия',
    official_name_en: 'School-Gymnasium No. 31',
    district: 'Байконыр',
    address: 'район Байконыр,улица Кенесары,49',
    phone: '+7 (717) 250-17-05',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-gymnasium'
  }),
  createAuditedAstanaSchool({
    number: 32,
    official_name: 'КГУ "Школа-гимназия № 32"',
    official_name_local: '№32 мектеп-гимназия',
    official_name_en: 'School-Gymnasium No. 32',
    district: 'Алматы',
    address: 'район Алматы,Проспект Абылай хана,21/3',
    phone: '+7 (717) 250-17-77',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-gymnasium'
  }),
  createAuditedAstanaSchool({
    number: 33,
    official_name: 'КГУ «Комплекс «Детский сад – начальная школа № 33 им. Н.Абдирова»',
    official_name_local: 'Н.Әбдіров атындағы №33 "Балабақша - бастауыш мектеп"кешені',
    official_name_en: 'Secondary School No. 33',
    district: 'Байконыр',
    address: 'район Байконыр,улица Жаһанша Досмұхамедұлы,2',
    phone: '+7 (717) 253-21-66',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public kindergarten-primary school complex'
  }),
  createAuditedAstanaSchool({
    number: 34,
    official_name: 'КГУ «Средняя школа № 34»',
    official_name_local: '№34 орта мектеп',
    official_name_en: 'Secondary School No. 34',
    district: 'Байконыр',
    address: 'район Байконыр,Жилой массив Өндіріс улица Тайбурыл,23',
    phone: '+7 (717) 250-15-93',
    instruction_languages: ['Kazakh'],
    school_type: 'Public secondary school'
  }),
  createAuditedAstanaSchool({
    number: 35,
    official_name: 'ГКП на ПХВ «Школа-лицей № 35 имени Назира Торекулова» акимата города Астаны',
    official_name_local: '№35 мектеп-лицей',
    official_name_en: 'School-Lyceum No. 35',
    district: 'Сарыарка',
    address: 'район Сарыарка,Проспект Абай,9/1',
    phone: '+7 (717) 250-17-36',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-lyceum'
  }),
  createAuditedAstanaSchool({
    number: 36,
    official_name: 'КГУ "Средняя школа № 36"',
    official_name_local: '№36 орта мектеп',
    official_name_en: 'Secondary School No. 36',
    district: 'Сарыарка',
    address: 'район Сарыарка,улица Карасай Батыра,7',
    phone: '+7 (717) 250-15-16',
    instruction_languages: ['Russian'],
    school_type: 'Public secondary school'
  }),
  createAuditedAstanaSchool({
    number: 37,
    official_name: 'ГКП на ПХВ «Школа-лицей № 37 им. Сырбая Мауленова»',
    official_name_local: '№37 орта мектеп',
    official_name_en: 'School-Lyceum No. 37',
    district: 'Алматы',
    address: 'район Алматы,Микрорайон Аль-Фараби улица Күйші Дина,44/3',
    phone: '+7 (717) 250-16-85',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public school-lyceum'
  }),
  createAuditedAstanaSchool({
    number: 38,
    official_name: 'ГКП на ПХВ «Школа-лицей № 38» акимата города Астаны',
    official_name_local: '№38 мектеп- лицей',
    official_name_en: 'School-Lyceum No. 38',
    district: 'Алматы',
    address: 'район Алматы,Микрорайон Аль-Фараби улица Габита Мусрепова,8/2',
    phone: '+7 (717) 250-17-13',
    instruction_languages: ['Kazakh'],
    school_type: 'Public school-lyceum'
  }),
  createAuditedAstanaSchool({
    number: 39,
    official_name: 'КГУ "Вечерняя (сменная) школа № 39"',
    official_name_local: '№ 39 кешкі мектеп',
    official_name_en: 'Evening School No. 39',
    district: 'Сарыарка',
    address: 'район Сарыарка,улица ӘЛИЯ МОЛДАҒҰЛОВА,22',
    phone: '+7 (717) 250-15-14',
    instruction_languages: ['Kazakh', 'Russian'],
    school_type: 'Public evening school'
  }),
  createAuditedAstanaSchool({
    number: 40,
    official_name: 'КГУ «Школа-лицей № 40 им. Алькея Маргулана»',
    official_name_local: '№40 орта мектеп',
    official_name_en: 'School-Lyceum No. 40',
    district: 'Сарыарка',
    address: 'район Сарыарка,Жилой массив Көктал улица Дулата Бабатайулы,26',
    phone: '+7 (717) 250-16-69',
    instruction_languages: ['Kazakh'],
    school_type: 'Public school-lyceum'
  })
];

export const schoolTypes = [...new Set(schools.map((school) => school.type))].sort();
export const schoolLanguages = [...new Set(schools.flatMap((school) => school.instruction_languages))].sort();
export const schoolDistricts = [...new Set(schools.map((school) => school.district))].sort();
export const verificationStatuses = ['verified', 'partially_verified', 'unverified'];
export const priceStatuses = ['verified', 'estimated', 'unknown'];
export const dataStatuses = ['verified', 'partially_verified', 'needs_review'];
export const yesNoUnknownStatuses = ['yes', 'no', 'unknown', ''];
