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

const selectedComparisonIds = new Set();

const schoolPrograms = [...new Set(schools.flatMap((school) => school.programs))].sort();

const quizPreferences = {
  type: 'all',
  language: 'all',
  district: 'all',
  maxPrice: 'all',
  program: 'all'
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

function createPreferenceSelect({ id, label, value, options, allLabel, onChange }) {
  const wrapper = document.createElement('label');
  wrapper.className = 'quiz-control';
  wrapper.htmlFor = id;

  const labelText = document.createElement('span');
  labelText.textContent = label;

  const select = document.createElement('select');
  select.id = id;
  select.value = value;
  select.append(createOption('all', allLabel));
  options.forEach((option) => {
    if (Array.isArray(option)) {
      select.append(createOption(option[0], option[1]));
    } else if (typeof option === 'object') {
      select.append(createOption(option.value, option.label));
    } else {
      select.append(createOption(option));
    }
  });
  select.addEventListener('change', (event) => onChange(event.target.value));

  wrapper.append(labelText, select);
  return wrapper;
}

function getPricePreferenceOptions() {
  return [
    ['0', 'Free public schools'],
    ['400000', 'Up to 400,000 KZT'],
    ['700000', 'Up to 700,000 KZT'],
    ['1000000', 'Up to 1,000,000 KZT']
  ];
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

function getSelectedSchools() {
  return schools.filter((school) => selectedComparisonIds.has(school.id));
}

function toggleComparedSchool(schoolId) {
  if (selectedComparisonIds.has(schoolId)) {
    selectedComparisonIds.delete(schoolId);
  } else {
    selectedComparisonIds.add(schoolId);
  }

  render();
}

function createComparisonPanel() {
  const selectedSchools = getSelectedSchools();
  const panel = document.createElement('section');
  panel.className = 'comparison-panel';
  panel.setAttribute('aria-live', 'polite');

  const header = document.createElement('div');
  header.className = 'comparison-panel__header';

  const titleBlock = document.createElement('div');
  const kicker = document.createElement('p');
  kicker.className = 'section-kicker';
  kicker.textContent = 'Comparison board';
  const title = document.createElement('h2');
  title.textContent = selectedSchools.length
    ? `${selectedSchools.length} schools selected`
    : 'Select schools to compare side by side';
  const helper = document.createElement('p');
  helper.textContent = 'Use the compare toggle on any school card to review tuition, rating, location, language, and programs in one table.';
  titleBlock.append(kicker, title, helper);

  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.textContent = 'Clear comparison';
  clearButton.disabled = selectedSchools.length === 0;
  clearButton.addEventListener('click', () => {
    selectedComparisonIds.clear();
    render();
  });

  header.append(titleBlock, clearButton);
  panel.append(header);

  if (selectedSchools.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'comparison-panel__empty';
    empty.textContent = 'No schools selected yet. Add two or more schools for the most useful comparison.';
    panel.append(empty);
    return panel;
  }

  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'comparison-table-wrapper';
  const table = document.createElement('table');
  table.className = 'comparison-table';

  const head = document.createElement('thead');
  const headRow = document.createElement('tr');
  ['School', ...selectedSchools.map((school) => school.name)].forEach((heading) => {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = heading;
    headRow.append(th);
  });
  head.append(headRow);

  const body = document.createElement('tbody');
  [
    ['Type', (school) => school.type],
    ['District', (school) => school.district],
    ['Language', (school) => school.language],
    ['Monthly price', (school) => formatPrice(school.monthly_price)],
    ['Rating', (school) => `${school.rating.toFixed(1)} / 5`],
    ['Programs', (school) => school.programs.join(', ')]
  ].forEach(([label, getValue]) => {
    const row = document.createElement('tr');
    const th = document.createElement('th');
    th.scope = 'row';
    th.textContent = label;
    row.append(th);

    selectedSchools.forEach((school) => {
      const td = document.createElement('td');
      td.textContent = getValue(school);
      row.append(td);
    });

    body.append(row);
  });

  table.append(head, body);
  tableWrapper.append(table);
  panel.append(tableWrapper);
  return panel;
}

function scoreSchoolRecommendation(school) {
  let score = school.rating;
  const reasons = [];

  if (quizPreferences.type !== 'all' && school.type === quizPreferences.type) {
    score += 2;
    reasons.push(`matches your ${school.type} school preference`);
  }

  if (quizPreferences.language !== 'all' && school.language === quizPreferences.language) {
    score += 2.5;
    reasons.push(`offers ${school.language}-medium instruction`);
  }

  if (quizPreferences.district !== 'all' && school.district === quizPreferences.district) {
    score += 2;
    reasons.push(`is located in ${school.district}`);
  }

  if (quizPreferences.maxPrice !== 'all' && school.monthly_price <= Number(quizPreferences.maxPrice)) {
    score += 2;
    reasons.push(`fits the ${formatPrice(Number(quizPreferences.maxPrice))} budget`);
  }

  if (quizPreferences.program !== 'all' && school.programs.includes(quizPreferences.program)) {
    score += 2.5;
    reasons.push(`includes ${quizPreferences.program}`);
  }

  return {
    school,
    score,
    reasons: reasons.length ? reasons : ['strong overall rating and broad program fit']
  };
}

function getRecommendedSchools() {
  return schools
    .map(scoreSchoolRecommendation)
    .sort((first, second) => second.score - first.score || second.school.rating - first.school.rating)
    .slice(0, 3);
}

function createRecommendationQuiz() {
  const section = document.createElement('section');
  section.className = 'recommendation-quiz';
  section.setAttribute('aria-labelledby', 'recommendation-title');

  const intro = document.createElement('div');
  intro.className = 'recommendation-quiz__intro';
  const kicker = document.createElement('p');
  kicker.className = 'section-kicker';
  kicker.textContent = 'Recommendation quiz';
  const title = document.createElement('h2');
  title.id = 'recommendation-title';
  title.textContent = 'Find a short list that fits your family';
  const copy = document.createElement('p');
  copy.textContent = 'Answer a few preference questions and the quiz will rank schools by instruction language, district, budget, type, programs, and rating.';
  intro.append(kicker, title, copy);

  const controls = document.createElement('div');
  controls.className = 'quiz-controls';
  controls.append(
    createPreferenceSelect({
      id: 'quiz-type',
      label: 'Preferred type',
      value: quizPreferences.type,
      options: schoolTypes,
      allLabel: 'Any type',
      onChange: (value) => {
        quizPreferences.type = value;
        render();
      }
    }),
    createPreferenceSelect({
      id: 'quiz-language',
      label: 'Instruction language',
      value: quizPreferences.language,
      options: schoolLanguages,
      allLabel: 'Any language',
      onChange: (value) => {
        quizPreferences.language = value;
        render();
      }
    }),
    createPreferenceSelect({
      id: 'quiz-district',
      label: 'Preferred district',
      value: quizPreferences.district,
      options: schoolDistricts,
      allLabel: 'Any district',
      onChange: (value) => {
        quizPreferences.district = value;
        render();
      }
    }),
    createPreferenceSelect({
      id: 'quiz-price',
      label: 'Monthly budget',
      value: quizPreferences.maxPrice,
      options: getPricePreferenceOptions(),
      allLabel: 'Any budget',
      onChange: (value) => {
        quizPreferences.maxPrice = value;
        render();
      }
    }),
    createPreferenceSelect({
      id: 'quiz-program',
      label: 'Program priority',
      value: quizPreferences.program,
      options: schoolPrograms,
      allLabel: 'Any program',
      onChange: (value) => {
        quizPreferences.program = value;
        render();
      }
    })
  );

  const recommendations = document.createElement('div');
  recommendations.className = 'recommendation-results';
  getRecommendedSchools().forEach(({ school, reasons }, index) => {
    const card = document.createElement('article');
    card.className = 'recommendation-card';

    const rank = document.createElement('span');
    rank.className = 'recommendation-card__rank';
    rank.textContent = `#${index + 1}`;

    const schoolName = document.createElement('h3');
    schoolName.textContent = school.name;

    const meta = document.createElement('p');
    meta.textContent = `${school.district} • ${school.language} • ${formatPrice(school.monthly_price)}`;

    const reasonList = document.createElement('ul');
    reasons.slice(0, 3).forEach((reason) => {
      const item = document.createElement('li');
      item.textContent = reason;
      reasonList.append(item);
    });

    card.append(rank, schoolName, meta, reasonList);
    recommendations.append(card);
  });

  const resetButton = document.createElement('button');
  resetButton.type = 'button';
  resetButton.className = 'quiz-reset';
  resetButton.textContent = 'Reset quiz';
  resetButton.addEventListener('click', () => {
    quizPreferences.type = 'all';
    quizPreferences.language = 'all';
    quizPreferences.district = 'all';
    quizPreferences.maxPrice = 'all';
    quizPreferences.program = 'all';
    render();
  });

  section.append(intro, controls, recommendations, resetButton);
  return section;
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

  const compareButton = document.createElement('button');
  compareButton.type = 'button';
  compareButton.className = 'compare-button';
  compareButton.setAttribute('aria-pressed', selectedComparisonIds.has(school.id).toString());
  compareButton.textContent = selectedComparisonIds.has(school.id) ? 'Remove from comparison' : 'Compare school';
  compareButton.addEventListener('click', () => toggleComparedSchool(school.id));

  card.append(header, description, facts, programList, contact, compareButton);
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

  main.append(hero, filterSection, createComparisonPanel(), createRecommendationQuiz(), resultsHeading, schoolGrid);
  root.append(main);
}

render();
