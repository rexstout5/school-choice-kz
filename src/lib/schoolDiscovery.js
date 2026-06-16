import { getLocalizedSchoolValue } from '../data/schools.js';
import { getAverageRating } from './reviews.js';

export const sortOptionValues = ['highest_rated', 'lowest_tuition', 'highest_tuition', 'most_reviewed', 'alphabetical_az'];

export const getSchoolBaseReviewCount = (school) => school.review_count ?? school.reviews_count ?? (school.rating > 0 ? 12 + (school.id.length % 29) : 0);

export const getSchoolRatingStats = (school, reviews = []) => {
  const storedAverage = getAverageRating(reviews);
  const baseReviewCount = getSchoolBaseReviewCount(school);
  const baseRating = Number(school.rating) || 0;

  if (storedAverage === null) {
    return {
      averageRating: baseRating > 0 ? baseRating : null,
      reviewCount: baseReviewCount
    };
  }

  const totalReviews = baseReviewCount + reviews.length;
  const weightedAverage = totalReviews > 0
    ? ((baseRating * baseReviewCount) + (storedAverage * reviews.length)) / totalReviews
    : storedAverage;

  return {
    averageRating: weightedAverage,
    reviewCount: totalReviews
  };
};

export const getRatingSummaryKey = (averageRating) => {
  if (averageRating === null || averageRating === undefined) return 'average';
  if (averageRating >= 4.5) return 'excellent';
  if (averageRating >= 4) return 'good';
  return 'average';
};

const normalizedTuition = (school, emptyValue) => (school.tuition_fee === null || school.tuition_fee === undefined ? emptyValue : school.tuition_fee);

export const sortSchools = (schoolList, sortBy, language, reviewsBySchool = {}) => {
  const collator = new Intl.Collator(language === 'kz' ? 'kk' : language, { sensitivity: 'base' });

  return [...schoolList].sort((first, second) => {
    const firstStats = getSchoolRatingStats(first, reviewsBySchool[first.id] ?? []);
    const secondStats = getSchoolRatingStats(second, reviewsBySchool[second.id] ?? []);

    if (sortBy === 'highest_rated') {
      return (secondStats.averageRating ?? 0) - (firstStats.averageRating ?? 0) || secondStats.reviewCount - firstStats.reviewCount;
    }

    if (sortBy === 'lowest_tuition') {
      return normalizedTuition(first, Number.MAX_SAFE_INTEGER) - normalizedTuition(second, Number.MAX_SAFE_INTEGER);
    }

    if (sortBy === 'highest_tuition') {
      return normalizedTuition(second, -1) - normalizedTuition(first, -1);
    }

    if (sortBy === 'most_reviewed') {
      return secondStats.reviewCount - firstStats.reviewCount || (secondStats.averageRating ?? 0) - (firstStats.averageRating ?? 0);
    }

    return collator.compare(getLocalizedSchoolValue(first.name, language), getLocalizedSchoolValue(second.name, language));
  });
};

export const getSchoolInsightKeys = (school) => {
  const programs = getLocalizedSchoolValue(school.programs, 'en').join(' ').toLowerCase();
  const schoolType = getLocalizedSchoolValue(school.school_type, 'en').toLowerCase();
  const languages = school.instruction_languages ?? [];
  const keys = new Set();

  if (schoolType.includes('lyceum') || schoolType.includes('gymnasium') || programs.includes('olympiad') || programs.includes('academic')) keys.add('strongAcademics');
  if (programs.includes('science') || programs.includes('mathematics') || schoolType.includes('lyceum')) keys.add('stemFocused');
  if (languages.includes('English') || programs.includes('english')) keys.add('englishFocused');
  if (school.tuition_fee === 0) keys.add('affordable');
  if (school.type === 'international' || schoolType.includes('international') || programs.includes('international')) keys.add('internationalCurriculum');
  if (school.type === 'public') keys.add('closeToHome');
  if (programs.includes('club') || programs.includes('activities') || programs.includes('creative') || programs.includes('leadership')) keys.add('strongExtracurricular');

  return [...keys];
};
