export const reviewsStorageKey = 'school-choice-kz-parent-reviews';

export const reviewCategoryKeys = ['academics', 'teachers', 'safety', 'parentCommunication', 'extracurricular'];

export const normalizeReviewRating = (rating) => {
  const numericRating = Number(rating);

  if (!Number.isFinite(numericRating)) {
    return 0;
  }

  return Math.min(Math.max(Math.round(numericRating), 1), 5);
};

export const getSchoolSeedReviews = (school) => (Array.isArray(school?.reviews) ? school.reviews : []);

export const getSchoolReviews = (reviewsBySchool, schoolId) => {
  const schoolReviews = reviewsBySchool?.[schoolId];
  return Array.isArray(schoolReviews) ? schoolReviews : [];
};

export const getCombinedSchoolReviews = (school, reviewsBySchool = {}) =>
  sortReviewsByLatest([...getSchoolReviews(reviewsBySchool, school.id), ...getSchoolSeedReviews(school)]);

export const getReviewCategoryRating = (review, categoryKey) => {
  const categoryRating = review.categoryRatings?.[categoryKey];
  return normalizeReviewRating(categoryRating || review[categoryKey] || review.rating);
};

export const getAverageRating = (reviews) => {
  if (!reviews.length) {
    return null;
  }

  const totalRating = reviews.reduce((sum, review) => sum + normalizeReviewRating(review.rating), 0);
  return totalRating / reviews.length;
};

export const getAverageCategoryRatings = (reviews) =>
  Object.fromEntries(
    reviewCategoryKeys.map((categoryKey) => {
      if (!reviews.length) {
        return [categoryKey, null];
      }

      const totalRating = reviews.reduce((sum, review) => sum + getReviewCategoryRating(review, categoryKey), 0);
      return [categoryKey, totalRating / reviews.length];
    })
  );

export const getReviewSummary = (reviews) => ({
  averageRating: getAverageRating(reviews),
  reviewCount: reviews.length,
  categoryRatings: getAverageCategoryRatings(reviews)
});

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
