export type School = {
  id: string;
  name: string;
  district: string;
  type: "Государственная" | "Частная";
  languages: string[];
  price: string;
  priceValue: number;
  rating: number;
  students: number;
  address: string;
  shortDescription: string;
  description: string;
  strengths: string[];
  programs: string[];
};

export const schools: School[] = [
  {
    id: "bilim-astana",
    name: "Bilim Astana School",
    district: "Есиль",
    type: "Частная",
    languages: ["Русский", "Английский"],
    price: "от 210 000 ₸/мес",
    priceValue: 210000,
    rating: 4.9,
    students: 640,
    address: "пр. Кабанбай Батыра, 48",
    shortDescription: "Современная школа полного дня с сильным STEM-блоком и тьюторским сопровождением.",
    description:
      "Bilim Astana School помогает детям выстраивать индивидуальную образовательную траекторию: углубленная математика, проектное обучение, английский каждый день и безопасная среда для социализации.",
    strengths: ["STEM-лаборатории", "Школа полного дня", "Малые классы до 18 учеников", "Психолог и тьютор"],
    programs: ["Начальная школа", "Средняя школа", "Подготовка к олимпиадам", "IT-клуб"],
  },
  {
    id: "smart-steppe",
    name: "Smart Steppe Lyceum",
    district: "Алматы",
    type: "Государственная",
    languages: ["Русский", "Казахский"],
    price: "бесплатно",
    priceValue: 0,
    rating: 4.7,
    students: 1180,
    address: "ул. Жумабаева, 12",
    shortDescription: "Лицей с профильными классами, олимпиадными секциями и развитой системой дополнительного образования.",
    description:
      "Smart Steppe Lyceum сочетает академическую строгость и поддержку интересов ребенка: профильные классы, научные проекты, спортивные секции и родительские встречи каждый месяц.",
    strengths: ["Профильные классы", "Олимпиадная подготовка", "Спортивные секции", "Активное родительское сообщество"],
    programs: ["Математический профиль", "Естественные науки", "Робототехника", "Дебатный клуб"],
  },
  {
    id: "future-kids",
    name: "Future Kids Academy",
    district: "Сарыарка",
    type: "Частная",
    languages: ["Русский", "Английский", "Казахский"],
    price: "от 165 000 ₸/мес",
    priceValue: 165000,
    rating: 4.8,
    students: 420,
    address: "ул. Бейбитшилик, 31",
    shortDescription: "Билингвальная академия с проектным подходом, творческими мастерскими и гибким расписанием.",
    description:
      "Future Kids Academy делает акцент на самостоятельности, коммуникации и креативности. Ученики защищают проекты, изучают языки в живой практике и участвуют в городских инициативах.",
    strengths: ["Билингвальная среда", "Проектное обучение", "Творческие студии", "Гибкий продленный день"],
    programs: ["Primary Years", "Английский интенсив", "Медиа-мастерская", "Soft skills"],
  },
  {
    id: "qala-mektep",
    name: "Qala Mektep №17",
    district: "Байконур",
    type: "Государственная",
    languages: ["Казахский", "Русский"],
    price: "бесплатно",
    priceValue: 0,
    rating: 4.6,
    students: 980,
    address: "ул. Абая, 74",
    shortDescription: "Городская школа с обновленными кабинетами, инклюзивной поддержкой и сильной начальной ступенью.",
    description:
      "Qala Mektep №17 подходит семьям, которым важны стабильная программа, близость к дому и открытость администрации. В школе работают кружки, ресурсный кабинет и программа адаптации первоклассников.",
    strengths: ["Сильная начальная школа", "Инклюзивная поддержка", "Кружки после уроков", "Удобная транспортная доступность"],
    programs: ["Начальная школа", "Инклюзивный ресурс", "Хор и театр", "Шахматы"],
  },
];

export const districts = ["Все районы", "Есиль", "Алматы", "Сарыарка", "Байконур"];
export const schoolTypes = ["Любой тип", "Государственная", "Частная"];
export const languages = ["Любой язык", "Русский", "Казахский", "Английский"];
export const priceRanges = ["Любая цена", "Бесплатно", "до 180 000 ₸", "180 000–250 000 ₸"];

export function getSchoolById(id: string) {
  return schools.find((school) => school.id === id);
}
