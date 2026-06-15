'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  formatAverageRating,
  getAverageRating,
  getSchoolReviews,
  getStoredReviewsBySchool,
  normalizeReviewRating,
  saveStoredReviewsBySchool,
  sortReviewsByLatest
} from '../lib/reviews.js';

const initialReview = {
  parentName: '',
  rating: '5',
  childGrade: '',
  text: ''
};

export default function SchoolReviews({ schoolId, labels }) {
  const [review, setReview] = useState(initialReview);
  const [reviews, setReviews] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    setReviews(sortReviewsByLatest(getSchoolReviews(getStoredReviewsBySchool(), schoolId)));
  }, [schoolId]);

  const averageRating = useMemo(() => getAverageRating(reviews), [reviews]);
  const latestReviews = useMemo(() => sortReviewsByLatest(reviews).slice(0, 5), [reviews]);

  const updateReview = (name, value) => {
    setReview((currentReview) => ({
      ...currentReview,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextReview = {
      id: `${schoolId}-${Date.now()}`,
      parentName: review.parentName.trim(),
      rating: normalizeReviewRating(review.rating),
      childGrade: review.childGrade.trim(),
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
      setReviews(nextSchoolReviews);
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
          <small>{labels.reviewCount(reviews.length)}</small>
        </div>
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
              <option key={rating} value={rating}>{labels.ratingOption(rating)}</option>
            ))}
          </select>
        </label>

        <label htmlFor="child-grade">
          <span>{labels.childGrade}</span>
          <input id="child-grade" name="childGrade" value={review.childGrade} onChange={(event) => updateReview('childGrade', event.target.value)} placeholder={labels.childGradePlaceholder} required />
        </label>

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
                  <span>{labels.reviewRating(item.rating)}</span>
                </div>
                <p>{item.text}</p>
                <small>{labels.gradeLabel(item.childGrade)}</small>
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
