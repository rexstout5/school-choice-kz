export const priceOptionValues = ['all', 'free', 'paid', '0-200000', '200000-400000', '400000-800000', '800000+'];

const getMonthlyTuitionFee = (school) => school.tuition_fee;

export const doesSchoolMatchPriceFilter = (school, selectedPrice) => {
  const price = getMonthlyTuitionFee(school);

  if (selectedPrice === 'all') {
    return true;
  }

  if (typeof price !== 'number') {
    return false;
  }

  if (selectedPrice === 'free') {
    return price === 0;
  }

  if (selectedPrice === 'paid') {
    return price > 0;
  }

  if (selectedPrice === '800000+') {
    return price >= 800000;
  }

  const [minPrice, maxPrice] = selectedPrice.split('-').map(Number);

  return Number.isFinite(minPrice) && Number.isFinite(maxPrice) && price >= minPrice && price <= maxPrice;
};
