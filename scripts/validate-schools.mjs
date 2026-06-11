import { dataStatuses, getLocalizedSchoolValue, priceStatuses, schools, yesNoUnknownStatuses } from '../src/data/schools.js';

const requiredFields = [
  'id',
  'name',
  'official_name',
  'city',
  'district',
  'type',
  'school_type',
  'language',
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
  'contact',
  'academics',
  'metadata',
  'sources'
];

const errors = [];
const ids = new Set();
const localizedObjectFields = ['name', 'description', 'admission_requirements'];
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

  if (school.city !== 'Astana') {
    errors.push(`${school.id} is not in Astana`);
  }

  if (!['public', 'private'].includes(school.type)) {
    errors.push(`${school.id} has invalid type ${school.type}`);
  }

  if (!['verified', 'unverified'].includes(school.verification_status)) {
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

  if (typeof school.class_size !== 'string' || school.class_size.length === 0) {
    errors.push(`${school.id} must include a class_size description`);
  }

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

  if (typeof school.rating !== 'number' || school.rating < 0 || school.rating > 5) {
    errors.push(`${school.id} rating must be a number from 0 to 5`);
  }

  if (!Array.isArray(school.instruction_languages) || school.instruction_languages.length === 0) {
    errors.push(`${school.id} must include at least one instruction language`);
  }

  const invalidLanguages = school.instruction_languages.filter(
    (language) => !['Kazakh', 'Russian', 'English'].includes(language)
  );

  if (invalidLanguages.length > 0) {
    errors.push(`${school.id} has invalid instruction languages ${invalidLanguages.join(', ')}`);
  }

  if (school.language !== school.instruction_languages.join(', ')) {
    errors.push(`${school.id} language display does not match instruction_languages`);
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

  if (!Array.isArray(school.sources) || school.sources.length === 0) {
    errors.push(`${school.id} must include at least one source`);
  }

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
