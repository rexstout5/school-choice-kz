import { schools } from '../data/schools.js';

export const favoritesStorageKey = 'school-choice-kz-favorites';
export const favoritesChangedEventName = 'school-choice-kz-favorites-changed';

export const normalizeFavoriteSchoolIds = (schoolIds) =>
  schoolIds.filter((schoolId, index) => schools.some((school) => school.id === schoolId) && schoolIds.indexOf(schoolId) === index);

export const getStoredFavoriteSchoolIds = () => {
  try {
    const storedFavorites = window.localStorage.getItem(favoritesStorageKey);
    const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    return Array.isArray(parsedFavorites) ? normalizeFavoriteSchoolIds(parsedFavorites) : [];
  } catch {
    return [];
  }
};

export const saveFavoriteSchoolIds = (schoolIds) => {
  const nextFavoriteSchoolIds = normalizeFavoriteSchoolIds(schoolIds);

  try {
    window.localStorage.setItem(favoritesStorageKey, JSON.stringify(nextFavoriteSchoolIds));
    window.dispatchEvent(new CustomEvent(favoritesChangedEventName, { detail: nextFavoriteSchoolIds }));
  } catch {
    // Favorites still work for the current session if localStorage is unavailable.
  }

  return nextFavoriteSchoolIds;
};
