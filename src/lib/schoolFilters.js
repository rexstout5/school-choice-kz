import { doesSchoolMatchPriceFilter } from './priceFilters.js';

export const doesSchoolMatchCatalogFilters = (school, filters) => {
  const matchesType = filters.type === 'all' || school.type === filters.type;
  const matchesLanguage = filters.language === 'all' || school.instruction_languages.includes(filters.language);
  const matchesDistrict = filters.district === 'all' || school.district === filters.district;
  const matchesPrice = doesSchoolMatchPriceFilter(school, filters.maxPrice);

  return matchesType && matchesLanguage && matchesDistrict && matchesPrice;
};
