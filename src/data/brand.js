export const brand = {
  name: 'BilimChoice',
  legalName: 'BilimChoice.kz',
  domain: 'BilimChoice.kz',
  url: 'https://bilimchoice.kz',
  locale: 'ru_KZ',
  defaultCity: 'Астана',
  tagline: {
    ru: 'Экспертный каталог школ Астаны для осознанного выбора семьи.',
    kz: 'Отбасы саналы таңдау жасайтын Астана мектептерінің сараптамалық каталогы.',
    kk: 'Отбасы саналы таңдау жасайтын Астана мектептерінің сараптамалық каталогы.',
    en: 'An expert Astana school catalog for informed family decisions.'
  },
  description: {
    ru: 'Сравните школы Астаны по району, языку обучения, стоимости, рейтингу, программам и проверенным данным.',
    kz: 'Астана мектептерін аудан, оқу тілі, құны, рейтингі, бағдарламалары және тексерілген деректері бойынша салыстырыңыз.',
    kk: 'Астана мектептерін аудан, оқу тілі, құны, рейтингі, бағдарламалары және тексерілген деректері бойынша салыстырыңыз.',
    en: 'Compare Astana schools by district, instruction language, tuition, ratings, programs, and verified data.'
  },
  titleTemplate: '%s | BilimChoice'
};

export const getBrandTitle = (title) => `${title} | ${brand.name}`;
