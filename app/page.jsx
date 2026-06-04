'use client';

import { useMemo, useState } from 'react';
import { schoolDistricts, schoolLanguages, schools, schoolTypes } from '../src/data/schools.js';

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'KZT',
  maximumFractionDigits: 0
});

const initialFilters = {
  type: 'all',
  language: 'all',
  district: 'all',
  maxPrice: 'all'
};

const priceOptions = [
  ['all', 'All'],
  ['0', 'Free public schools'],
  ['400000', 'Up to 400,000 KZT'],
  ['700000', 'Up to 700,000 KZT'],
  ['1000000', 'Up to 1,000,000 KZT']
];

const formatPrice = (price) => (price === 0 ? 'Free public school' : `${moneyFormatter.format(price)} / month`);
const formatPhoneLink = (phone) => phone.replace(/[^+\d]/g, '');

function FilterControl({ id, label, value, options, onChange }) {
  return (
    <label className="filter-control" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function PriceFilter({ value, onChange }) {
  return (
    <label className="filter-control" htmlFor="price">
      <span>Max monthly price</span>
      <select id="price" value={value} onChange={(event) => onChange(event.target.value)}>
        {priceOptions.map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}

function SchoolCard({ school }) {
  return (
    <article className="school-card">
      <div className="school-card__header">
        <div>
          <p className="school-card__eyebrow">
            {school.city} • {school.district}
          </p>
          <h2>{school.name}</h2>
        </div>
        <span className={`badge badge--${school.type}`}>{school.type}</span>
      </div>

      <p className="school-card__description">{school.description}</p>

      <dl className="school-card__facts">
        {[
          ['Official name', school.official_name],
          ['School type', school.school_type],
          ['Language', school.language],
          ['Verification', school.verification_status],
          ['Monthly price', formatPrice(school.monthly_price)],
          ['Address', school.address]
        ].map(([term, detail]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{detail}</dd>
          </div>
        ))}
      </dl>

      <div className="program-list" aria-label={`${school.name} programs`}>
        {school.programs.map((program) => (
          <span key={program}>{program}</span>
        ))}
      </div>

      <div className="school-card__contact">
        <a href={school.website} target="_blank" rel="noreferrer">
          Website
        </a>
        <a href={`tel:${formatPhoneLink(school.phone)}`}>{school.phone}</a>
      </div>
    </article>
  );
}

export default function Home() {
  const [filters, setFilters] = useState(initialFilters);

  const filteredSchools = useMemo(
    () =>
      schools.filter((school) => {
        const matchesType = filters.type === 'all' || school.type === filters.type;
        const matchesLanguage =
          filters.language === 'all' || school.instruction_languages.includes(filters.language);
        const matchesDistrict = filters.district === 'all' || school.district === filters.district;
        const matchesPrice = filters.maxPrice === 'all' || school.monthly_price <= Number(filters.maxPrice);

        return matchesType && matchesLanguage && matchesDistrict && matchesPrice;
      }),
    [filters]
  );

  const updateFilter = (name, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value
    }));
  };

  const resetFilters = () => setFilters(initialFilters);

  return (
    <main>
      <section className="hero">
        <div>
          <p className="hero__kicker">School Choice Kazakhstan</p>
          <h1>Explore structured Astana school options</h1>
          <p>
            Compare Astana schools by district, instruction language, school type, verification status, and signature
            programs using a reusable Kazakhstan school data model.
          </p>
        </div>
        <div className="hero__stat">
          <strong>{schools.length}</strong>
          <span>Astana schools</span>
        </div>
      </section>

      <section className="filters" aria-label="School filters">
        <FilterControl
          id="type"
          label="Type"
          value={filters.type}
          options={schoolTypes}
          onChange={(value) => updateFilter('type', value)}
        />
        <FilterControl
          id="language"
          label="Language"
          value={filters.language}
          options={schoolLanguages}
          onChange={(value) => updateFilter('language', value)}
        />
        <FilterControl
          id="district"
          label="District"
          value={filters.district}
          options={schoolDistricts}
          onChange={(value) => updateFilter('district', value)}
        />
        <PriceFilter value={filters.maxPrice} onChange={(value) => updateFilter('maxPrice', value)} />
      </section>

      <section className="results-heading" aria-live="polite">
        <h2>{filteredSchools.length} schools match your filters</h2>
        <button type="button" onClick={resetFilters}>
          Reset filters
        </button>
      </section>

      <section className="school-grid" aria-label="Filtered schools">
        {filteredSchools.map((school) => (
          <SchoolCard key={school.id} school={school} />
        ))}
      </section>
    </main>
  );
}
