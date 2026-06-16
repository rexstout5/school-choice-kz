export const seoFooterLinks = [
  { href: '/best-schools-astana', label: { ru: 'Лучшие школы Астаны', kk: 'Астананың үздік мектептері', en: 'Best schools in Astana' } },
  { href: '/private-schools-astana', label: { ru: 'Частные школы Астаны', kk: 'Астанадағы жеке мектептер', en: 'Private schools in Astana' } },
  { href: '/public-schools-astana', label: { ru: 'Государственные школы Астаны', kk: 'Астанадағы мемлекеттік мектептер', en: 'Public schools in Astana' } },
  { href: '/how-to-choose-school', label: { ru: 'Как выбрать школу', kk: 'Мектепті қалай таңдау керек', en: 'How to choose a school' } },
  { href: '/school-readiness', label: { ru: 'Готовность к школе', kk: 'Мектепке дайындық', en: 'School readiness' } }
];

const sharedCta = {
  ru: 'Пройти короткий квиз',
  kk: 'Қысқа квизден өту',
  en: 'Take the short quiz'
};

export const seoPages = {
  'best-schools-astana': {
    slug: 'best-schools-astana',
    schemaType: 'CollectionPage',
    featuredTypes: ['public', 'private', 'international', 'specialized'],
    h1: { ru: 'Лучшие школы Астаны: как сравнить варианты', kk: 'Астананың үздік мектептері: нұсқаларды салыстыру', en: 'Best schools in Astana: how to compare options' },
    intro: {
      ru: 'Лучшей школой для семьи становится та, где совпадают район, язык обучения, нагрузка, бюджет, безопасность и ожидания ребенка. BilimChoice помогает быстро перейти от общего списка к понятному шорт-листу.',
      kk: 'Отбасы үшін ең жақсы мектеп — аудан, оқу тілі, жүктеме, бюджет, қауіпсіздік және баланың қажеттілігі сәйкес келетін орын. BilimChoice жалпы тізімнен нақты қысқа тізім жасауға көмектеседі.',
      en: 'The best school for a family is the one where location, language, workload, budget, safety, and the child’s needs fit together. BilimChoice helps turn a broad list into a clear shortlist.'
    },
    sections: [
      { title: { ru: 'Что считать «лучшей» школой', kk: '«Үздік» мектепті қалай түсіну керек', en: 'What “best” should mean' }, body: { ru: 'Смотрите не только на популярность. Проверьте язык обучения, формат школы, отзывы, дорогу до дома, наличие продленки и прозрачность данных о стоимости.', kk: 'Тек танымалдыққа қарамаңыз. Оқу тілін, мектеп форматын, пікірлерді, үйге дейінгі жолды, ұзартылған күнді және баға деректерінің анықтығын тексеріңіз.', en: 'Look beyond popularity. Check instruction language, school format, reviews, commute, after-school options, and how transparent the fee data is.' } },
      { title: { ru: 'Как использовать каталог', kk: 'Каталогты қалай пайдалану керек', en: 'How to use the catalog' }, body: { ru: 'Отфильтруйте школы по району, типу и цене, затем откройте профили для контактов, программ, отзывов и источников данных.', kk: 'Мектептерді аудан, түр және баға бойынша сүзгіден өткізіп, байланыс, бағдарламалар, пікірлер және дереккөздер үшін профильдерді ашыңыз.', en: 'Filter by district, type, and price, then open profiles for contacts, programs, reviews, and data sources.' } }
    ],
    cta: sharedCta
  },
  'private-schools-astana': {
    slug: 'private-schools-astana',
    schemaType: 'CollectionPage',
    featuredTypes: ['private', 'international'],
    h1: { ru: 'Частные школы Астаны: стоимость, программы и выбор', kk: 'Астанадағы жеке мектептер: баға, бағдарлама және таңдау', en: 'Private schools in Astana: fees, programs, and choice' },
    intro: { ru: 'Частные школы Астаны часто выбирают за малые классы, полный день, языковую среду и дополнительные программы. Перед поступлением важно уточнить стоимость, вступительные требования и условия договора.', kk: 'Астанадағы жеке мектептер көбіне шағын сынып, толық күн, тілдік орта және қосымша бағдарламалар үшін таңдалады. Қабылдау алдында бағаны, талаптарды және келісімшарт шарттарын нақтылау маңызды.', en: 'Astana private schools are often chosen for smaller classes, full-day schedules, language environment, and additional programs. Confirm fees, admissions requirements, and contract terms before applying.' },
    sections: [
      { title: { ru: 'На что смотреть в частной школе', kk: 'Жеке мектепте нені тексеру керек', en: 'What to check in a private school' }, body: { ru: 'Сравните ежемесячную оплату, питание, кружки, транспорт, размер класса, квалификацию учителей и регулярность коммуникации с родителями.', kk: 'Айлық төлемді, тамақты, үйірмелерді, көлікті, сынып көлемін, мұғалім біліктілігін және ата-анамен байланыс жиілігін салыстырыңыз.', en: 'Compare monthly fees, meals, clubs, transport, class size, teacher qualifications, and parent communication rhythm.' } },
      { title: { ru: 'Вопросы перед визитом', kk: 'Баруға дейінгі сұрақтар', en: 'Questions before a visit' }, body: { ru: 'Попросите расписание, пример договора, правила возврата оплаты, список обязательных платежей и информацию о переходе между классами.', kk: 'Кестені, келісімшарт үлгісін, төлемді қайтару ережесін, міндетті төлемдер тізімін және сыныптан сыныпқа өту ақпаратын сұраңыз.', en: 'Ask for the timetable, sample contract, refund rules, required fees, and grade-to-grade progression details.' } }
    ], cta: sharedCta
  },
  'public-schools-astana': {
    slug: 'public-schools-astana', schemaType: 'CollectionPage', featuredTypes: ['public', 'specialized'],
    h1: { ru: 'Государственные школы Астаны: как ориентироваться родителям', kk: 'Астанадағы мемлекеттік мектептер: ата-аналарға бағдар', en: 'Public schools in Astana: a parent guide' },
    intro: { ru: 'Государственные школы обычно выбирают по месту проживания, языку обучения и профилю. В каталоге можно сравнить районы, контакты, программы и наличие проверенных источников.', kk: 'Мемлекеттік мектептер әдетте тұрғылықты жер, оқу тілі және бағыт бойынша таңдалады. Каталогта аудандарды, байланыстарды, бағдарламаларды және тексерілген дереккөздерді салыстыруға болады.', en: 'Public schools are usually chosen by residence area, instruction language, and academic profile. The catalog helps compare districts, contacts, programs, and verified sources.' },
    sections: [
      { title: { ru: 'Район и дорога', kk: 'Аудан және жол', en: 'District and commute' }, body: { ru: 'Оцените ежедневный маршрут, сменность, безопасность дороги и возможность самостоятельно добираться до школы.', kk: 'Күнделікті бағытты, ауысымды, жол қауіпсіздігін және баланың мектепке өздігінен бару мүмкіндігін бағалаңыз.', en: 'Assess the daily route, school shifts, road safety, and whether the child can commute independently.' } },
      { title: { ru: 'Документы и зачисление', kk: 'Құжаттар және қабылдау', en: 'Documents and enrollment' }, body: { ru: 'Уточните актуальные правила приема, закрепление по адресу и сроки подачи документов непосредственно в школе или официальных сервисах.', kk: 'Қабылдау ережелерін, мекенжай бойынша бекітілуді және құжат тапсыру мерзімдерін мектептен немесе ресми сервистерден нақтылаңыз.', en: 'Confirm current admissions rules, address assignment, and document deadlines directly with the school or official services.' } }
    ], cta: sharedCta
  },
  'how-to-choose-school': {
    slug: 'how-to-choose-school', schemaType: 'HowTo', featuredTypes: ['public', 'private'],
    h1: { ru: 'Как выбрать школу: пошаговый гид для семьи', kk: 'Мектепті қалай таңдау керек: отбасыға арналған қадамдар', en: 'How to choose a school: a step-by-step family guide' },
    intro: { ru: 'Выбор школы проще, если разделить решение на критерии: потребности ребенка, логистика, язык, программа, бюджет, атмосфера и обратная связь от родителей.', kk: 'Мектеп таңдау критерийлерге бөлінсе жеңілдейді: баланың қажеттілігі, логистика, тіл, бағдарлама, бюджет, орта және ата-аналар пікірі.', en: 'Choosing a school is easier when the decision is split into criteria: child needs, logistics, language, program, budget, atmosphere, and parent feedback.' },
    sections: [
      { title: { ru: '1. Определите обязательные критерии', kk: '1. Міндетті критерийлерді белгілеңіз', en: '1. Define must-have criteria' }, body: { ru: 'Запишите район, язык обучения, бюджет, смену, медицинские или образовательные особенности и максимальное время в дороге.', kk: 'Ауданды, оқу тілін, бюджетті, ауысымды, медициналық немесе оқу ерекшеліктерін және жолға кететін ең ұзақ уақытты жазыңыз.', en: 'Write down district, instruction language, budget, school shift, medical or learning needs, and maximum commute time.' } },
      { title: { ru: '2. Сравните короткий список', kk: '2. Қысқа тізімді салыстырыңыз', en: '2. Compare a shortlist' }, body: { ru: 'Оставьте 3–5 школ, откройте профили, проверьте отзывы и подготовьте одинаковые вопросы для каждой администрации.', kk: '3–5 мектеп қалдырып, профильдерді ашыңыз, пікірлерді тексеріңіз және әр әкімшілікке бірдей сұрақтар дайындаңыз.', en: 'Keep 3–5 schools, open their profiles, check reviews, and prepare the same questions for each administration.' } }
    ], cta: sharedCta
  },
  'school-readiness': {
    slug: 'school-readiness', schemaType: 'FAQPage', featuredTypes: ['public', 'private'],
    h1: { ru: 'Готовность к школе: мягкий чек-лист для родителей', kk: 'Мектепке дайындық: ата-аналарға жұмсақ чек-лист', en: 'School readiness: a gentle parent checklist' },
    intro: { ru: 'Готовность к школе — это не только чтение и счет. Важны сон, самостоятельность, речь, внимание, умение просить помощь и спокойная адаптация к новому режиму.', kk: 'Мектепке дайындық тек оқу мен санау емес. Ұйқы, дербестік, сөйлеу, зейін, көмек сұрай білу және жаңа тәртіпке жайлы бейімделу маңызды.', en: 'School readiness is not only reading and counting. Sleep, independence, speech, attention, asking for help, and calm adaptation to routine matter too.' },
    sections: [
      { title: { ru: 'Бытовая самостоятельность', kk: 'Тұрмыстық дербестік', en: 'Everyday independence' }, body: { ru: 'Ребенку полезно уметь переодеваться, собирать рюкзак, следить за вещами и сообщать взрослому о дискомфорте.', kk: 'Бала киініп-шешінуді, сөмке жинауды, заттарын қадағалауды және жайсыздықты ересекке айтуды білсе пайдалы.', en: 'It helps if the child can change clothes, pack a bag, look after belongings, and tell an adult about discomfort.' } },
      { title: { ru: 'Социальная адаптация', kk: 'Әлеуметтік бейімделу', en: 'Social adjustment' }, body: { ru: 'Потренируйте приветствие, просьбу о помощи, ожидание очереди, спокойное завершение игры и разговор о чувствах после сложного дня.', kk: 'Сәлемдесу, көмек сұрау, кезек күту, ойынды тыныш аяқтау және қиын күннен кейін сезім туралы сөйлесуді жаттықтырыңыз.', en: 'Practice greetings, asking for help, waiting turns, ending play calmly, and talking about feelings after a hard day.' } }
    ], cta: sharedCta
  }
};
