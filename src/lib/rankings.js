import { getLocalizedSchoolValue } from '../data/schools.js';
import { getReviewSummary } from './reviews.js';

const profileFields = ['name', 'official_name', 'address', 'phone', 'website', 'school_type', 'instruction_languages', 'programs', 'description', 'tuition_fee'];

export const rankingCategorySlugs = ['all', 'private-schools', 'public-schools', 'stem-schools', 'english-schools'];

const hasValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') return Object.values(value).some(hasValue);
  return value !== null && value !== undefined && value !== '';
};

export const getSchoolProfileCompleteness = (school) => {
  const completedFields = profileFields.filter((field) => hasValue(school[field])).length;
  return completedFields / profileFields.length;
};

export const getSchoolDataQualityScore = (school) => {
  const verificationScore = { verified: 1, partially_verified: 0.7, unverified: 0.35 }[school.verification_status] ?? 0.5;
  const dataStatusScore = { verified: 1, partially_verified: 0.75, needs_review: 0.45 }[school.data_status] ?? 0.55;
  const priceStatusScore = { verified: 1, estimated: 0.7, unknown: 0.35 }[school.price_status] ?? 0.55;
  const sourceScore = Math.min((school.sources?.length ?? 0) / 2, 1);
  const coordinateScore = school.coordinates_status === 'verified' ? 1 : school.coordinates_status === 'estimated' ? 0.7 : 0.25;

  return (verificationScore * 0.3) + (dataStatusScore * 0.25) + (priceStatusScore * 0.2) + (sourceScore * 0.15) + (coordinateScore * 0.1);
};

export const isStemSchool = (school) => {
  const programs = getLocalizedSchoolValue(school.programs, 'en').join(' ').toLowerCase();
  const schoolType = getLocalizedSchoolValue(school.school_type, 'en').toLowerCase();
  const text = `${programs} ${schoolType}`;
  return ['stem', 'science', 'mathematics', 'informatics', 'robotics', 'engineering', 'olympiad', 'lyceum'].some((keyword) => text.includes(keyword));
};

export const isEnglishSchool = (school) => {
  const programs = getLocalizedSchoolValue(school.programs, 'en').join(' ').toLowerCase();
  return school.instruction_languages?.includes('English') || programs.includes('english');
};

export const doesSchoolMatchRankingCategory = (school, category = 'all') => {
  if (category === 'private-schools') return school.type === 'private' || school.type === 'international';
  if (category === 'public-schools') return school.type === 'public' || school.type === 'specialized';
  if (category === 'stem-schools') return isStemSchool(school);
  if (category === 'english-schools') return isEnglishSchool(school);
  return true;
};

export const getSchoolRankingScore = (school, reviews = []) => {
  const reviewSummary = getReviewSummary([...(Array.isArray(school.reviews) ? school.reviews : []), ...reviews]);
  const ratingScore = (reviewSummary.averageRating ?? 0) / 5;
  const reviewVolumeScore = Math.min(reviewSummary.reviewCount / 25, 1);
  const profileCompletenessScore = getSchoolProfileCompleteness(school);
  const programsScore = Math.min(getLocalizedSchoolValue(school.programs, 'en').length / 5, 1);
  const dataQualityScore = getSchoolDataQualityScore(school);

  return {
    rating: reviewSummary.averageRating,
    reviewCount: reviewSummary.reviewCount,
    profileCompletenessScore,
    programsScore,
    dataQualityScore,
    score: (ratingScore * 0.4) + (reviewVolumeScore * 0.2) + (profileCompletenessScore * 0.15) + (programsScore * 0.15) + (dataQualityScore * 0.1)
  };
};

export const rankSchools = (schoolList, reviewsBySchool = {}) => schoolList
  .map((school) => ({ school, ranking: getSchoolRankingScore(school, reviewsBySchool[school.id] ?? []) }))
  .sort((first, second) => second.ranking.score - first.ranking.score || second.ranking.reviewCount - first.ranking.reviewCount || (second.ranking.rating ?? 0) - (first.ranking.rating ?? 0))
  .map((entry, index) => ({ ...entry, position: index + 1 }));
