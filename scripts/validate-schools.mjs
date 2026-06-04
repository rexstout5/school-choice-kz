import { schools } from '../src/data/schools.js';

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

  if (!Array.isArray(school.sources) || school.sources.length === 0) {
    errors.push(`${school.id} must include at least one source`);
  }

  if (!Array.isArray(school.programs) || school.programs.length === 0) {
    errors.push(`${school.id} must include at least one program`);
  }
});

if (schools.length < 20) {
  errors.push(`Expected at least 20 schools, found ${schools.length}`);
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${schools.length} structured Astana schools.`);
