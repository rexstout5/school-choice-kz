import { schools } from '../src/data/schools.js';

const requiredFields = [
  'id',
  'name',
  'city',
  'district',
  'type',
  'language',
  'monthly_price',
  'rating',
  'address',
  'website',
  'phone',
  'description',
  'programs'
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

  if (!['Kazakh', 'Russian', 'English'].includes(school.language)) {
    errors.push(`${school.id} has invalid language ${school.language}`);
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
