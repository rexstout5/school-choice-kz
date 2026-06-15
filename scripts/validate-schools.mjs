import {
  cityValues,
  dataStatuses,
  getLocalizedEnumLabel,
  getLocalizedSchoolValue,
  instructionLanguageValues,
  priceStatuses,
  schoolTypeValues,
  schools,
  verificationStatuses,
  yesNoUnknownStatuses
} from '../src/data/schools.js';
import { doesSchoolMatchCatalogFilters } from '../src/lib/schoolFilters.js';
import { doesSchoolMatchBudgetFilter, doesSchoolMatchPriceFilter, normalizePriceFilterValue } from '../src/lib/priceFilters.js';

const requiredFields = [
  'id',
  'name',
  'official_name',
  'city',
  'district',
  'type',
  'school_type',
  'language',
  'languages',
  'instruction_languages',
  'monthly_price',
  'tuition_fee',
  'price_status',
  'data_status',
  'after_school_program',
  'school_bus',
  'admission_test',
  'class_size',
  'admission_requirements',
  'rating',
  'address',
  'website',
  'phone',
  'description',
  'programs',
  'verification_status',
  'source',
  'contact',
  'academics',
  'metadata',
  'audit',
  'sources'
];

const errors = [];
const ids = new Set();
const localizedObjectFields = ['name', 'school_type', 'languages', 'description', 'address', 'admission_requirements', 'class_size'];
const auditedLocalizedFields = [
  'name',
  'school_type',
  'languages',
  'address',
  'class_size',
  'admission_requirements',
  'programs'
];
const nonLocalizedContentPattern = /[A-Za-z]{2,}/;
const languages = ['ru', 'kk', 'en'];

const isLocalizedObject = (value) =>
  value &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  languages.every((language) => typeof value[language] === 'string' && value[language].length > 0);

const isLocalizedProgramObject = (value) =>
  value &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  languages.every((language) => Array.isArray(value[language]) && value[language].length > 0);

const toArray = (value) => (Array.isArray(value) ? value : [value]);


const privateOrInternationalSchools = schools.filter((school) => ['private', 'international'].includes(school.type));
const paidSchools = schools.filter((school) => typeof school.tuition_fee === 'number' && school.tuition_fee > 0);
const paidFilterResults = schools.filter((school) => doesSchoolMatchPriceFilter(school, 'paid_only'));
const midRangeFilterResults = schools.filter((school) => doesSchoolMatchPriceFilter(school, 'range_400000_800000'));

const tuitionFilterFixtures = [
  { id: 'fixture-free', tuition_fee: 0, price_status: 'verified' },
  { id: 'fixture-low-paid', tuition_fee: 150000, price_status: 'verified' },
  { id: 'fixture-200000-boundary', tuition_fee: 200000, price_status: 'verified' },
  { id: 'fixture-400000-boundary', tuition_fee: 400000, price_status: 'estimated' },
  { id: 'fixture-800000-boundary', tuition_fee: 800000, price_status: 'estimated' },
  { id: 'fixture-above-800000', tuition_fee: 900000, price_status: 'estimated' },
  { id: 'fixture-unknown-null', tuition_fee: null, price_status: 'unknown' },
  { id: 'fixture-unknown-status', tuition_fee: 250000, price_status: 'unknown' }
];

const expectedTuitionFilterMatches = {
  free: ['fixture-free'],
  paid_only: [
    'fixture-low-paid',
    'fixture-200000-boundary',
    'fixture-400000-boundary',
    'fixture-800000-boundary',
    'fixture-above-800000',
    'fixture-unknown-status'
  ],
  up_to_200000: ['fixture-low-paid', 'fixture-200000-boundary'],
  range_200000_400000: ['fixture-200000-boundary', 'fixture-400000-boundary', 'fixture-unknown-status'],
  range_400000_800000: ['fixture-400000-boundary', 'fixture-800000-boundary'],
  range_800000_plus: ['fixture-800000-boundary', 'fixture-above-800000'],
  unknown_price: ['fixture-unknown-null', 'fixture-unknown-status']
};

Object.entries(expectedTuitionFilterMatches).forEach(([filterValue, expectedIds]) => {
  const actualIds = tuitionFilterFixtures
    .filter((school) => doesSchoolMatchPriceFilter(school, filterValue))
    .map((school) => school.id);

  if (actualIds.join(',') !== expectedIds.join(',')) {
    errors.push(
      `${filterValue} tuition filter expected [${expectedIds.join(', ')}], received [${actualIds.join(', ')}]`
    );
  }
});

const expectedRecommendationBudgetMatches = {
  any: tuitionFilterFixtures.map((school) => school.id),
  free: ['fixture-free'],
  paid_only: [
    'fixture-low-paid',
    'fixture-200000-boundary',
    'fixture-400000-boundary',
    'fixture-800000-boundary',
    'fixture-above-800000',
    'fixture-unknown-status'
  ],
  up_to_200000: ['fixture-low-paid', 'fixture-200000-boundary'],
  range_200000_400000: ['fixture-200000-boundary', 'fixture-400000-boundary', 'fixture-unknown-status'],
  range_400000_800000: ['fixture-400000-boundary', 'fixture-800000-boundary'],
  range_800000_plus: ['fixture-800000-boundary', 'fixture-above-800000'],
  unknown_price: ['fixture-unknown-null', 'fixture-unknown-status']
};

Object.entries(expectedRecommendationBudgetMatches).forEach(([filterValue, expectedIds]) => {
  const actualIds = tuitionFilterFixtures
    .filter((school) => doesSchoolMatchBudgetFilter(school, filterValue))
    .map((school) => school.id);

  if (actualIds.join(',') !== expectedIds.join(',')) {
    errors.push(
      `${filterValue} recommendation budget expected [${expectedIds.join(', ')}], received [${actualIds.join(', ')}]`
    );
  }
});

Object.keys(expectedRecommendationBudgetMatches).forEach((filterValue) => {
  tuitionFilterFixtures.forEach((school) => {
    const catalogBudgetMatch = doesSchoolMatchCatalogFilters(school, {
      type: 'all',
      language: 'all',
      district: 'all',
      maxPrice: normalizePriceFilterValue(filterValue)
    });
    const recommendationBudgetMatch = doesSchoolMatchBudgetFilter(school, filterValue);

    if (catalogBudgetMatch !== recommendationBudgetMatch) {
      errors.push(`${filterValue} budget must match catalog price logic for ${school.id}`);
    }
  });
});

if (paidSchools.length < 10) {
  errors.push(`Expected at least 10 paid schools, found ${paidSchools.length}`);
}

if (paidFilterResults.length === 0 || paidFilterResults.some((school) => !(typeof school.tuition_fee === 'number' && school.tuition_fee > 0))) {
  errors.push('Paid-only filter must return only schools with tuition_fee > 0');
}

if (schools.some((school) => school.tuition_fee === 0 && doesSchoolMatchPriceFilter(school, 'up_to_200000'))) {
  errors.push('up_to_200000 filter must not return free schools with tuition_fee === 0');
}

if (midRangeFilterResults.length === 0 || midRangeFilterResults.some((school) => !(typeof school.tuition_fee === 'number' && school.tuition_fee >= 400000 && school.tuition_fee <= 800000))) {
  errors.push('range_400000_800000 filter must return only schools with tuition_fee between 400000 and 800000 inclusive');
}

if (schools.some((school) => school.tuition_fee === null && doesSchoolMatchPriceFilter(school, 'range_400000_800000'))) {
  errors.push('Unknown tuition_fee values must not appear in numeric price ranges');
}

privateOrInternationalSchools.forEach((school) => {
  if (!isLocalizedObject(school.school_type)) {
    errors.push(`${school.id} private/international record must include a localized school_type`);
  }

  if (!(typeof school.tuition_fee === 'number' || school.tuition_fee === null)) {
    errors.push(`${school.id} tuition_fee must be a numeric monthly KZT value or null`);
  }

  if (typeof school.tuition_fee === 'number' && !Number.isFinite(school.tuition_fee)) {
    errors.push(`${school.id} tuition_fee must be finite`);
  }

  if (!priceStatuses.includes(school.price_status)) {
    errors.push(`${school.id} private/international record must include a valid price_status`);
  }
});

schools.forEach((school, index) => {
  requiredFields.forEach((field) => {
    if (!(field in school)) {
      errors.push(`School at index ${index} is missing ${field}`);
    }
  });

  if (ids.has(school.id)) {
    errors.push(`Duplicate school id: ${school.id}`);
  }
  ids.add(school.id);

  if (!cityValues.includes(school.city)) {
    errors.push(`${school.id} has invalid city ${school.city}`);
  }

  if (!schoolTypeValues.includes(school.type)) {
    errors.push(`${school.id} has invalid type ${school.type}`);
  }

  if (!verificationStatuses.includes(school.verification_status)) {
    errors.push(`${school.id} has invalid verification status ${school.verification_status}`);
  }

  if (school.monthly_price !== school.tuition_fee) {
    errors.push(`${school.id} monthly_price must match tuition_fee`);
  }

  if (!priceStatuses.includes(school.price_status)) {
    errors.push(`${school.id} has invalid price_status ${school.price_status}`);
  }

  if (!dataStatuses.includes(school.data_status)) {
    errors.push(`${school.id} has invalid data_status ${school.data_status}`);
  }

  ['after_school_program', 'school_bus', 'admission_test'].forEach((field) => {
    if (!yesNoUnknownStatuses.includes(school[field])) {
      errors.push(`${school.id} has invalid ${field} ${school[field]}`);
    }
  });


  localizedObjectFields.forEach((field) => {
    if (!isLocalizedObject(school[field])) {
      errors.push(`${school.id} must include localized ${field} values for ru, kk, and en`);
    }
  });

  if (!isLocalizedProgramObject(school.programs)) {
    errors.push(`${school.id} must include localized program arrays for ru, kk, and en`);
  }

  ['ru', 'kz', 'en', 'fr'].forEach((language) => {
    if (typeof getLocalizedSchoolValue(school.name, language) !== 'string' || getLocalizedSchoolValue(school.name, language).length === 0) {
      errors.push(`${school.id} cannot resolve localized name for ${language}`);
    }
  });

  auditedLocalizedFields.forEach((field) => {
    ['ru', 'kk'].forEach((language) => {
      const localizedValue = getLocalizedSchoolValue(school[field], language);
      toArray(localizedValue).forEach((value) => {
        if (typeof value === 'string' && nonLocalizedContentPattern.test(value)) {
          errors.push(`${school.id} has non-localized ${language} ${field} value: ${value}`);
        }
      });
    });
  });

  ['ru', 'kk'].forEach((language) => {
    [
      ['district', getLocalizedEnumLabel('districts', school.district, language)],
      ['ownership type', getLocalizedEnumLabel('schoolTypes', school.type, language)],
      ...school.instruction_languages.map((instructionLanguage) => [
        'instruction language',
        getLocalizedEnumLabel('instructionLanguages', instructionLanguage, language)
      ])
    ].forEach(([field, value]) => {
      if (nonLocalizedContentPattern.test(value)) {
        errors.push(`${school.id} has non-localized ${language} ${field} value: ${value}`);
      }
    });
  });

  if (typeof school.rating !== 'number' || school.rating < 0 || school.rating > 5) {
    errors.push(`${school.id} rating must be a number from 0 to 5`);
  }

  if (!Array.isArray(school.instruction_languages) || school.instruction_languages.length === 0) {
    errors.push(`${school.id} must include at least one instruction language`);
  }

  const invalidLanguages = school.instruction_languages.filter(
    (language) => !instructionLanguageValues.includes(language)
  );

  if (invalidLanguages.length > 0) {
    errors.push(`${school.id} has invalid instruction languages ${invalidLanguages.join(', ')}`);
  }

  if (school.language !== school.instruction_languages.join(', ')) {
    errors.push(`${school.id} language display does not match instruction_languages`);
  }

  if (getLocalizedSchoolValue(school.languages, 'en') !== school.language) {
    errors.push(`${school.id} English languages display does not match instruction_languages`);
  }

  if (!school.contact || school.contact.address !== school.address || school.contact.phone !== school.phone) {
    errors.push(`${school.id} contact details must mirror top-level address and phone`);
  }

  if (school.academics?.admission_test !== school.admission_test) {
    errors.push(`${school.id} academics.admission_test must mirror top-level admission_test`);
  }

  if (school.metadata?.price_status !== school.price_status || school.metadata?.data_status !== school.data_status) {
    errors.push(`${school.id} metadata statuses must mirror top-level statuses`);
  }

  if (school.metadata?.audit_status !== school.audit?.status) {
    errors.push(`${school.id} metadata audit_status must mirror audit status`);
  }

  if (
    !school.audit ||
    school.audit.status !== 'verified_public_registry_match' ||
    typeof school.audit.audited_at !== 'string' ||
    !isLocalizedObject(school.audit.note) ||
    !Array.isArray(school.audit.scope) ||
    school.audit.scope.length === 0 ||
    !Array.isArray(school.audit.source_names) ||
    school.audit.source_names.length === 0
  ) {
    errors.push(`${school.id} must include merged audit results with localized notes and source names`);
  }

  if (typeof school.source !== 'string' || school.source.length === 0) {
    errors.push(`${school.id} must include a source field`);
  }

  if (!Array.isArray(school.sources) || school.sources.length === 0) {
    errors.push(`${school.id} must include at least one source`);
  }

  school.sources.forEach((source) => {
    if (!isLocalizedObject(source.localized_name)) {
      errors.push(`${school.id} source ${source.url} must include localized source names for ru, kk, and en`);
    }
  });

  if (!Array.isArray(getLocalizedSchoolValue(school.programs, 'en')) || getLocalizedSchoolValue(school.programs, 'en').length === 0) {
    errors.push(`${school.id} must include at least one English program`);
  }
});

if (schools.length < 30) {
  errors.push(`Expected at least 30 schools, found ${schools.length}`);
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${schools.length} structured Astana schools.`);
