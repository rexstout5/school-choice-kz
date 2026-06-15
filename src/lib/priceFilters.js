export const priceOptionValues = [
  'all',
  'free',
  'paid_only',
  'up_to_200000',
  'range_200000_400000',
  'range_400000_800000',
  'range_800000_plus',
  'unknown_price'
];

export const budgetAnyValue = 'any';

const priceFilterAliases = {
  [budgetAnyValue]: 'all'
};

const getMonthlyTuitionFee = (school) => school.tuition_fee;

export const normalizePriceFilterValue = (selectedPrice) => priceFilterAliases[selectedPrice] ?? selectedPrice;

export const doesSchoolMatchBudgetFilter = (school, selectedBudget) =>
  doesSchoolMatchPriceFilter(school, normalizePriceFilterValue(selectedBudget));

export const doesSchoolMatchPriceFilter = (school, selectedPrice) => {
  const normalizedSelectedPrice = normalizePriceFilterValue(selectedPrice);
  const price = getMonthlyTuitionFee(school);

  if (normalizedSelectedPrice === 'all') {
    return true;
  }

  if (normalizedSelectedPrice === 'unknown_price') {
    return price === null || school.price_status === 'unknown';
  }

  if (normalizedSelectedPrice === 'free') {
    return price === 0;
  }

  if (typeof price !== 'number') {
    return false;
  }

  if (normalizedSelectedPrice === 'paid_only') {
    return price > 0;
  }

  if (normalizedSelectedPrice === 'up_to_200000') {
    return price > 0 && price <= 200000;
  }

  if (normalizedSelectedPrice === 'range_200000_400000') {
    return price >= 200000 && price <= 400000;
  }

  if (normalizedSelectedPrice === 'range_400000_800000') {
    return price >= 400000 && price <= 800000;
  }

  if (normalizedSelectedPrice === 'range_800000_plus') {
    return price >= 800000;
  }

  return false;
};
