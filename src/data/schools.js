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

const formatPhone = (phone) => `+7 (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 9)}-${phone.slice(9)}`;
const schoolWebsite = (schoolNumber) => `https://${schoolNumber}.astana-bilim.kz`;

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
  verification_status = 'verified'
}) => ({
  id,
  name,
  official_name,
  official_name_local,
  city: 'Astana',
  district,
  type: 'public',
  school_type,
  language,
  instruction_languages,
  monthly_price: 0,
  rating: 0,
  address,
  website: schoolWebsite(number),
  phone: formatPhone(phone),
  description,
  programs,
  verification_status,
  contact: {
    address,
    website: schoolWebsite(number),
    phone: formatPhone(phone)
  },
  academics: {
    school_type,
    instruction_languages,
    programs
  },
  metadata: {
    school_number: number,
    ownership: 'public',
    expandable_fields: ['admissions', 'catchment_area', 'coordinates', 'fees', 'reviews']
  },
  sources: [ASTANA_PUBLIC_SCHOOL_SOURCE, WEBSITE_SOURCE]
});

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
  })
];

export const schoolTypes = [...new Set(schools.map((school) => school.type))].sort();
export const schoolLanguages = [...new Set(schools.flatMap((school) => school.instruction_languages))].sort();
export const schoolDistricts = [...new Set(schools.map((school) => school.district))].sort();
export const verificationStatuses = ['verified', 'unverified'];
