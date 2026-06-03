import { schoolDistricts, schoolLanguages, schools, schoolTypes } from './data/schools.js';

const root = document.getElementById('root');
const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'KZT',
  maximumFractionDigits: 0
});

const filters = {
  type: 'all',
  language: 'all',
  district: 'all',
  maxPrice: 'all'
};

const formatPrice = (price) => (price === 0 ? 'Free public school' : `${moneyFormatter.format(price)} / month`);
const formatPhoneLink = (phone) => phone.replace(/[^+\d]/g, '');

function createOption(value, label = value) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = label;
  return option;
}

function createFilter({ id, label, value, options, onChange }) {
  const wrapper = document.createElement('label');
  wrapper.className = 'filter-control';
  wrapper.htmlFor = id;

  const labelText = document.createElement('span');
  labelText.textContent = label;

  const select = document.createElement('select');
  select.id = id;
  select.value = value;
  select.append(createOption('all', 'All'));
  options.forEach((option) => select.append(createOption(option)));
  select.addEventListener('change', (event) => onChange(event.target.value));

  wrapper.append(labelText, select);
  return wrapper;
}

function createPriceFilter() {
  const wrapper = document.createElement('label');
  wrapper.className = 'filter-control';
  wrapper.htmlFor = 'price';

  const labelText = document.createElement('span');
  labelText.textContent = 'Max monthly price';

  const select = document.createElement('select');
  select.id = 'price';
  select.value = filters.maxPrice;
  [
    ['all', 'All'],
    ['0', 'Free public schools'],
    ['400000', 'Up to 400,000 KZT'],
    ['700000', 'Up to 700,000 KZT'],
    ['1000000', 'Up to 1,000,000 KZT']
  ].forEach(([value, label]) => select.append(createOption(value, label)));
  select.addEventListener('change', (event) => {
    filters.maxPrice = event.target.value;
    render();
  });

  wrapper.append(labelText, select);
  return wrapper;
}

function getFilteredSchools() {
  return schools.filter((school) => {
    const matchesType = filters.type === 'all' || school.type === filters.type;
    const matchesLanguage = filters.language === 'all' || school.language === filters.language;
    const matchesDistrict = filters.district === 'all' || school.district === filters.district;
    const matchesPrice = filters.maxPrice === 'all' || school.monthly_price <= Number(filters.maxPrice);

    return matchesType && matchesLanguage && matchesDistrict && matchesPrice;
  });
}

function createSchoolCard(school) {
  const card = document.createElement('article');
  card.className = 'school-card';

  const header = document.createElement('div');
  header.className = 'school-card__header';

  const titleBlock = document.createElement('div');
  const eyebrow = document.createElement('p');
  eyebrow.className = 'school-card__eyebrow';
  eyebrow.textContent = `${school.city} • ${school.district}`;

  const title = document.createElement('h2');
  title.textContent = school.name;
  titleBlock.append(eyebrow, title);

  const badge = document.createElement('span');
  badge.className = `badge badge--${school.type}`;
  badge.textContent = school.type;
  header.append(titleBlock, badge);

  const description = document.createElement('p');
  description.className = 'school-card__description';
  description.textContent = school.description;

  const facts = document.createElement('dl');
  facts.className = 'school-card__facts';
  [
    ['Language', school.language],
    ['Monthly price', formatPrice(school.monthly_price)],
    ['Rating', `${school.rating.toFixed(1)} / 5`],
    ['Address', school.address]
  ].forEach(([term, detail]) => {
    const fact = document.createElement('div');
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = term;
    dd.textContent = detail;
    fact.append(dt, dd);
    facts.append(fact);
  });

  const programList = document.createElement('div');
  programList.className = 'program-list';
  programList.setAttribute('aria-label', `${school.name} programs`);
  school.programs.forEach((program) => {
    const item = document.createElement('span');
    item.textContent = program;
    programList.append(item);
  });

  const contact = document.createElement('div');
  contact.className = 'school-card__contact';
  const website = document.createElement('a');
  website.href = school.website;
  website.target = '_blank';
  website.rel = 'noreferrer';
  website.textContent = 'Website';
  const phone = document.createElement('a');
  phone.href = `tel:${formatPhoneLink(school.phone)}`;
  phone.textContent = school.phone;
  contact.append(website, phone);

  card.append(header, description, facts, programList, contact);
  return card;
}

function render() {
  const filteredSchools = getFilteredSchools();
  root.replaceChildren();

  const main = document.createElement('main');
  const hero = document.createElement('section');
  hero.className = 'hero';
  hero.innerHTML = `
    <div>
      <p class="hero__kicker">School Choice Kazakhstan</p>
      <h1>Explore structured Astana school options</h1>
      <p>Compare public and private schools by district, instruction language, monthly price, rating, and signature programs using a reusable Kazakhstan school data model.</p>
    </div>
    <div class="hero__stat"><strong>${schools.length}</strong><span>Astana schools</span></div>
  `;

  const filterSection = document.createElement('section');
  filterSection.className = 'filters';
  filterSection.setAttribute('aria-label', 'School filters');
  filterSection.append(
    createFilter({
      id: 'type',
      label: 'Type',
      value: filters.type,
      options: schoolTypes,
      onChange: (value) => {
        filters.type = value;
        render();
      }
    }),
    createFilter({
      id: 'language',
      label: 'Language',
      value: filters.language,
      options: schoolLanguages,
      onChange: (value) => {
        filters.language = value;
        render();
      }
    }),
    createFilter({
      id: 'district',
      label: 'District',
      value: filters.district,
      options: schoolDistricts,
      onChange: (value) => {
        filters.district = value;
        render();
      }
    }),
    createPriceFilter()
  );

  const resultsHeading = document.createElement('section');
  resultsHeading.className = 'results-heading';
  resultsHeading.setAttribute('aria-live', 'polite');
  const resultsTitle = document.createElement('h2');
  resultsTitle.textContent = `${filteredSchools.length} matching schools`;
  const resetButton = document.createElement('button');
  resetButton.type = 'button';
  resetButton.textContent = 'Reset filters';
  resetButton.addEventListener('click', () => {
    filters.type = 'all';
    filters.language = 'all';
    filters.district = 'all';
    filters.maxPrice = 'all';
    render();
  });
  resultsHeading.append(resultsTitle, resetButton);

  const schoolGrid = document.createElement('section');
  schoolGrid.className = 'school-grid';
  filteredSchools.forEach((school) => schoolGrid.append(createSchoolCard(school)));

  main.append(hero, filterSection, resultsHeading, schoolGrid);
  root.append(main);
}

render();
