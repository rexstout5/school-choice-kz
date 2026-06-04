'use client';

import { useEffect, useMemo, useState } from 'react';
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

const initialFeedback = {
  childAge: '',
  district: '',
  importantInformation: '',
  missingInformation: ''
};

const feedbackStorageKey = 'school-choice-kz-feedback';

const priceOptions = [
  ['all', 'All'],
  ['0', 'Free public schools'],
  ['400000', 'Up to 400,000 KZT'],
  ['700000', 'Up to 700,000 KZT'],
  ['1000000', 'Up to 1,000,000 KZT']
];

const formatPrice = (price) => (price === 0 ? 'Free public school' : `${moneyFormatter.format(price)} / month`);
const formatBoolean = (value) => (value ? 'Yes' : 'No');
const formatRating = (rating) => (rating > 0 ? `${rating.toFixed(1)} / 5` : 'Not yet rated');
const formatPhoneLink = (phone) => phone.replace(/[^+\d]/g, '');

const getStoredFeedback = () => {
  try {
    const storedFeedback = window.localStorage.getItem(feedbackStorageKey);
    const parsedFeedback = storedFeedback ? JSON.parse(storedFeedback) : [];
    return Array.isArray(parsedFeedback) ? parsedFeedback : [];
  } catch {
    return [];
  }
};

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
          ['Tuition fee', formatPrice(school.tuition_fee)],
          ['After-school program', formatBoolean(school.after_school_program)],
          ['School bus', formatBoolean(school.school_bus)],
          ['Class size', school.class_size],
          ['Admission requirements', school.admission_requirements],
          ['Rating', formatRating(school.rating)],
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

function FeedbackForm() {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [responseCount, setResponseCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    setResponseCount(getStoredFeedback().length);
  }, []);

  const updateFeedback = (name, value) => {
    setFeedback((currentFeedback) => ({
      ...currentFeedback,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedFeedback = {
      childAge: feedback.childAge.trim(),
      district: feedback.district,
      importantInformation: feedback.importantInformation.trim(),
      missingInformation: feedback.missingInformation.trim()
    };

    const nextResponses = [
      ...getStoredFeedback(),
      {
        ...trimmedFeedback,
        submittedAt: new Date().toISOString()
      }
    ];

    try {
      window.localStorage.setItem(feedbackStorageKey, JSON.stringify(nextResponses));
      setResponseCount(nextResponses.length);
      setFeedback(initialFeedback);
      setStatusMessage('Thank you — your feedback has been saved in this browser.');
    } catch {
      setStatusMessage('Sorry, this browser could not save feedback locally.');
    }
  };

  return (
    <section className="feedback" aria-labelledby="feedback-title">
      <div className="feedback__intro">
        <p className="feedback__kicker">Help improve this website</p>
        <h2 id="feedback-title">Tell us what families need next</h2>
        <p>
          Your answers are stored locally in this browser for now, so the team can test the feedback flow before adding a
          database.
        </p>
        <p className="feedback__count">{responseCount} locally saved responses</p>
      </div>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <label htmlFor="child-age">
          <span>Child age</span>
          <input
            id="child-age"
            name="childAge"
            type="number"
            min="0"
            max="18"
            inputMode="numeric"
            value={feedback.childAge}
            onChange={(event) => updateFeedback('childAge', event.target.value)}
            placeholder="Example: 7"
            required
          />
        </label>

        <label htmlFor="feedback-district">
          <span>District</span>
          <select
            id="feedback-district"
            name="district"
            value={feedback.district}
            onChange={(event) => updateFeedback('district', event.target.value)}
            required
          >
            <option value="">Select a district</option>
            {schoolDistricts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="important-information">
          <span>What information about schools is most important to you?</span>
          <textarea
            id="important-information"
            name="importantInformation"
            value={feedback.importantInformation}
            onChange={(event) => updateFeedback('importantInformation', event.target.value)}
            placeholder="Example: admissions, teacher experience, transport, fees..."
            rows="4"
            required
          />
        </label>

        <label htmlFor="missing-information">
          <span>What is missing on this website?</span>
          <textarea
            id="missing-information"
            name="missingInformation"
            value={feedback.missingInformation}
            onChange={(event) => updateFeedback('missingInformation', event.target.value)}
            placeholder="Tell us what would make school choice easier."
            rows="4"
            required
          />
        </label>

        <div className="feedback-form__footer">
          <button type="submit">Save feedback locally</button>
          <p role="status" aria-live="polite">
            {statusMessage}
          </p>
        </div>
      </form>
    </section>
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

      <FeedbackForm />
    </main>
  );
}
