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

const getMonthlyTuitionFee = (school) => school.tuition_fee;

export const doesSchoolMatchBudgetFilter = (school, selectedBudget) =>
  selectedBudget === 'any' || doesSchoolMatchPriceFilter(school, selectedBudget);

export const doesSchoolMatchPriceFilter = (school, selectedPrice) => {
  const price = getMonthlyTuitionFee(school);

  if (selectedPrice === 'all') {
    return true;
  }

  if (selectedPrice === 'unknown_price') {
    return price === null || school.price_status === 'unknown';
  }

  if (selectedPrice === 'free') {
    return price === 0;
  }

  if (typeof price !== 'number') {
    return false;
  }

  if (selectedPrice === 'paid_only') {
    return price > 0;
  }

  if (selectedPrice === 'up_to_200000') {
    return price > 0 && price <= 200000;
  }

  if (selectedPrice === 'range_200000_400000') {
    return price >= 200000 && price <= 400000;
  }

  if (selectedPrice === 'range_400000_800000') {
    return price >= 400000 && price <= 800000;
  }

  if (selectedPrice === 'range_800000_plus') {
    return price >= 800000;
  }

  return false;
};
