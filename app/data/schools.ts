export type School = {
  slug: string;
  name: string;
  city: string;
  district: string;
  type: "Государственная" | "Частная" | "Международная";
  grades: string;
  language: string;
  curriculum: string[];
  rating: number;
  price: string;
  classSize: number;
  features: string[];
  description: string;
  address: string;
  phone: string;
};

export const schools: School[] = [
  {
    slug: "almaty-lyceum-innovations",
    name: "Алматинский лицей инноваций",
    city: "Алматы",
    district: "Бостандыкский район",
    type: "Частная",
    grades: "1–11 классы",
    language: "Казахский, русский, английский",
    curriculum: ["STEM", "IELTS", "Робототехника"],
    rating: 4.9,
    price: "от 240 000 ₸/мес",
    classSize: 16,
    features: ["Подготовка к НИШ", "Проектное обучение", "Психолог в школе"],
    description:
      "Современный лицей с сильной математикой, инженерными кружками и индивидуальными образовательными треками.",
    address: "ул. Тимирязева, 42, Алматы",
    phone: "+7 727 000 11 22"
  },
  {
    slug: "astana-bilim-gymnasium",
    name: "Гимназия Bilim Astana",
    city: "Астана",
    district: "Есиль район",
    type: "Государственная",
    grades: "5–11 классы",
    language: "Казахский, русский",
    curriculum: ["Олимпиадная подготовка", "Гуманитарный профиль"],
    rating: 4.7,
    price: "бесплатно",
    classSize: 24,
    features: ["Сильные учителя", "Дебатный клуб", "Профориентация"],
    description:
      "Городская гимназия с углубленным изучением языков и регулярной подготовкой к предметным олимпиадам.",
    address: "пр. Кабанбай Батыра, 19, Астана",
    phone: "+7 7172 000 33 44"
  },
  {
    slug: "shymkent-global-school",
    name: "Shymkent Global School",
    city: "Шымкент",
    district: "Аль-Фарабийский район",
    type: "Международная",
    grades: "0–12 классы",
    language: "Английский, казахский",
    curriculum: ["Cambridge", "STEM", "Искусство"],
    rating: 4.8,
    price: "от 310 000 ₸/мес",
    classSize: 14,
    features: ["Международные экзамены", "Кампус", "Спорткомплекс"],
    description:
      "Международная школа полного дня с англоязычной средой, творческими студиями и спортивной программой.",
    address: "ул. Байдибек би, 88, Шымкент",
    phone: "+7 7252 000 55 66"
  },
  {
    slug: "karaganda-tech-school",
    name: "Karaganda Tech School",
    city: "Караганда",
    district: "Казыбекбийский район",
    type: "Частная",
    grades: "7–11 классы",
    language: "Русский, английский",
    curriculum: ["IT", "Физика", "Стартапы"],
    rating: 4.6,
    price: "от 180 000 ₸/мес",
    classSize: 18,
    features: ["Лаборатории", "Хакатоны", "Менторы из IT"],
    description:
      "Профильная школа для подростков, которые хотят развиваться в программировании, инженерии и предпринимательстве.",
    address: "ул. Ермекова, 17, Караганда",
    phone: "+7 7212 000 77 88"
  },
  {
    slug: "aktobe-daryn-primary",
    name: "Начальная школа Daryn",
    city: "Актобе",
    district: "район Алматы",
    type: "Государственная",
    grades: "1–4 классы",
    language: "Казахский",
    curriculum: ["Начальная школа", "Творчество", "Шахматы"],
    rating: 4.5,
    price: "бесплатно",
    classSize: 22,
    features: ["Группа продленного дня", "Безопасный двор", "Логопед"],
    description:
      "Комфортная начальная школа с вниманием к адаптации первоклассников и базовым навыкам самостоятельного обучения.",
    address: "ул. Маресьева, 5, Актобе",
    phone: "+7 7132 000 99 00"
  },
  {
    slug: "almaty-creative-academy",
    name: "Creative Academy Almaty",
    city: "Алматы",
    district: "Медеуский район",
    type: "Частная",
    grades: "1–9 классы",
    language: "Русский, английский",
    curriculum: ["Искусство", "Музыка", "Проектное обучение"],
    rating: 4.4,
    price: "от 210 000 ₸/мес",
    classSize: 15,
    features: ["Портфолио ученика", "Театр", "Индивидуальный темп"],
    description:
      "Академия для семей, которым важны академическая база, творческая среда и мягкая адаптация ребенка.",
    address: "пр. Достык, 101, Алматы",
    phone: "+7 727 000 12 34"
  }
];

export const cities = Array.from(new Set(schools.map((school) => school.city))).sort();
export const types = Array.from(new Set(schools.map((school) => school.type))).sort();
