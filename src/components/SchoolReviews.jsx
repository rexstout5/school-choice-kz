'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  formatAverageRating,
  getAverageRating,
  getAverageCategoryRatings,
  getReviewCategoryRating,
  getSchoolReviews,
  getSchoolSeedReviews,
  getStoredReviewsBySchool,
  normalizeReviewRating,
  reviewCategoryKeys,
  saveStoredReviewsBySchool,
  sortReviewsByLatest
} from '../lib/reviews.js';
import { getLocalizedSchoolValue } from '../data/schools.js';

const initialReview = {
  parentName: '',
  rating: '5',
  childGrade: '',
  text: '',
  categoryRatings: Object.fromEntries(reviewCategoryKeys.map((key) => [key, '5']))
};

const formatTemplate = (template, values) =>
  Object.entries(values).reduce((formattedValue, [key, value]) => formattedValue.replaceAll(`{${key}}`, String(value)), template);

const getReviewCountLabel = (count, label) => {
  if (typeof label === 'string') {
    return formatTemplate(label, { count });
  }

  if (label?.few && count > 1 && count < 5) {
    return `${count} ${label.few}`;
  }

  return `${count} ${count === 1 ? label?.one : label?.many}`;
};

const formatSubmittedAt = (submittedAt, locale) => {
  const submittedDate = new Date(submittedAt);

  if (Number.isNaN(submittedDate.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(submittedDate);
};

const getReviewText = (review, language) => getLocalizedSchoolValue(review.text, language) || review.text;

export default function SchoolReviews({ school, schoolId, labels, locale, language }) {
  const [review, setReview] = useState(initialReview);
  const [storedReviews, setStoredReviews] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    setStoredReviews(sortReviewsByLatest(getSchoolReviews(getStoredReviewsBySchool(), schoolId)));
  }, [schoolId]);

  const reviews = useMemo(() => sortReviewsByLatest([...storedReviews, ...getSchoolSeedReviews(school)]), [school, storedReviews]);
  const averageRating = useMemo(() => getAverageRating(reviews), [reviews]);
  const categoryRatings = useMemo(() => getAverageCategoryRatings(reviews), [reviews]);
  const latestReviews = useMemo(() => sortReviewsByLatest(reviews).slice(0, 5), [reviews]);

  const updateReview = (name, value) => {
    setReview((currentReview) => ({
      ...currentReview,
      [name]: value
    }));
  };

  const updateCategoryRating = (name, value) => {
    setReview((currentReview) => ({
      ...currentReview,
      categoryRatings: {
        ...currentReview.categoryRatings,
        [name]: value
      }
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextReview = {
      id: `${schoolId}-${Date.now()}`,
      parentName: review.parentName.trim(),
      rating: normalizeReviewRating(review.rating),
      childGrade: review.childGrade.trim(),
      categoryRatings: Object.fromEntries(reviewCategoryKeys.map((key) => [key, normalizeReviewRating(review.categoryRatings[key])])),
      text: review.text.trim(),
      submittedAt: new Date().toISOString()
    };

    try {
      const reviewsBySchool = getStoredReviewsBySchool();
      const nextSchoolReviews = sortReviewsByLatest([nextReview, ...getSchoolReviews(reviewsBySchool, schoolId)]);
      saveStoredReviewsBySchool({
        ...reviewsBySchool,
        [schoolId]: nextSchoolReviews
      });
      setStoredReviews(nextSchoolReviews);
      setReview(initialReview);
      setStatusMessage(labels.success);
    } catch {
      setStatusMessage(labels.error);
    }
  };

  return (
    <section className="school-detail__section reviews" aria-labelledby="reviews-title">
      <div className="reviews__header">
        <div>
          <p className="feedback__kicker">{labels.kicker}</p>
          <h2 id="reviews-title">{labels.title}</h2>
          <p className="school-detail__text">{labels.description}</p>
        </div>
        <div className="reviews__summary" aria-live="polite">
          <strong>{averageRating === null ? labels.notYetRated : formatAverageRating(averageRating)}</strong>
          <span>{labels.averageRating}</span>
          <small>{getReviewCountLabel(reviews.length, labels.reviewCount)}</small>
        </div>
      </div>

      <div className="reviews__category-summary" aria-label={labels.categorySummaryTitle}>
        <h3>{labels.categorySummaryTitle}</h3>
        <dl className="reviews__category-list">
          {reviewCategoryKeys.map((key) => (
            <div key={key}>
              <dt>{labels.categories[key]}</dt>
              <dd>{categoryRatings[key] === null ? labels.notYetRated : `⭐ ${formatAverageRating(categoryRatings[key])}`}</dd>
            </div>
          ))}
        </dl>
      </div>

      <form className="feedback-form reviews__form" onSubmit={handleSubmit}>
        <label htmlFor="parent-name">
          <span>{labels.parentName}</span>
          <input id="parent-name" name="parentName" value={review.parentName} onChange={(event) => updateReview('parentName', event.target.value)} required />
        </label>

        <label htmlFor="review-rating">
          <span>{labels.rating}</span>
          <select id="review-rating" name="rating" value={review.rating} onChange={(event) => updateReview('rating', event.target.value)} required>
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>{formatTemplate(labels.ratingOption, { rating })}</option>
            ))}
          </select>
        </label>

        <label htmlFor="child-grade">
          <span>{labels.childGrade}</span>
          <input id="child-grade" name="childGrade" value={review.childGrade} onChange={(event) => updateReview('childGrade', event.target.value)} placeholder={labels.childGradePlaceholder} required />
        </label>

        <fieldset className="reviews__category-fieldset">
          <legend>{labels.categoryRatings}</legend>
          {reviewCategoryKeys.map((key) => (
            <label key={key} htmlFor={`review-${key}`}>
              <span>{labels.categories[key]}</span>
              <select id={`review-${key}`} value={review.categoryRatings[key]} onChange={(event) => updateCategoryRating(key, event.target.value)} required>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>{formatTemplate(labels.ratingOption, { rating })}</option>
                ))}
              </select>
            </label>
          ))}
        </fieldset>

        <label htmlFor="review-text">
          <span>{labels.reviewText}</span>
          <textarea id="review-text" name="text" rows="4" value={review.text} onChange={(event) => updateReview('text', event.target.value)} placeholder={labels.reviewTextPlaceholder} required />
        </label>

        <div className="feedback-form__footer">
          <button type="submit">{labels.submit}</button>
          <p role="status" aria-live="polite">{statusMessage}</p>
        </div>
      </form>

      <div className="reviews__latest" aria-live="polite">
        <h3>{labels.latestTitle}</h3>
        {latestReviews.length > 0 ? (
          <ul className="reviews__list">
            {latestReviews.map((item) => (
              <li key={item.id} className="reviews__item">
                <div className="reviews__item-header">
                  <strong>{item.parentName}</strong>
                  <span>{formatTemplate(labels.reviewRating, { rating: item.rating })}</span>
                </div>
                <p>{getReviewText(item, language)}</p>
                <dl className="reviews__item-categories">
                  {reviewCategoryKeys.map((key) => (
                    <div key={key}>
                      <dt>{labels.categories[key]}</dt>
                      <dd>{getReviewCategoryRating(item, key)}/5</dd>
                    </div>
                  ))}
                </dl>
                <small>
                  {formatTemplate(labels.gradeLabel, { grade: item.childGrade })}
                  {formatSubmittedAt(item.submittedAt, locale) ? ` · ${formatTemplate(labels.submittedAt, { date: formatSubmittedAt(item.submittedAt, locale) })}` : ''}
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <p className="school-detail__text">{labels.empty}</p>
        )}
      </div>
    </section>
  );
}
