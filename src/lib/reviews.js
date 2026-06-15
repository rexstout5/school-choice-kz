export const reviewsStorageKey = 'school-choice-kz-parent-reviews';

export const normalizeReviewRating = (rating) => {
  const numericRating = Number(rating);

  if (!Number.isFinite(numericRating)) {
    return 0;
  }

  return Math.min(Math.max(Math.round(numericRating), 1), 5);
};

export const getSchoolReviews = (reviewsBySchool, schoolId) => {
  const schoolReviews = reviewsBySchool?.[schoolId];
  return Array.isArray(schoolReviews) ? schoolReviews : [];
};

export const getAverageRating = (reviews) => {
  if (!reviews.length) {
    return null;
  }

  const totalRating = reviews.reduce((sum, review) => sum + normalizeReviewRating(review.rating), 0);
  return totalRating / reviews.length;
};

export const formatAverageRating = (averageRating) => (averageRating === null ? '' : averageRating.toFixed(1));

export const sortReviewsByLatest = (reviews) =>
  [...reviews].sort((firstReview, secondReview) => new Date(secondReview.submittedAt).getTime() - new Date(firstReview.submittedAt).getTime());

export const getStoredReviewsBySchool = () => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const storedReviews = window.localStorage.getItem(reviewsStorageKey);
    const parsedReviews = storedReviews ? JSON.parse(storedReviews) : {};
    return parsedReviews && typeof parsedReviews === 'object' && !Array.isArray(parsedReviews) ? parsedReviews : {};
  } catch {
    return {};
  }
};

export const saveStoredReviewsBySchool = (reviewsBySchool) => {
  window.localStorage.setItem(reviewsStorageKey, JSON.stringify(reviewsBySchool));
};
