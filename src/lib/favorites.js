import { schools } from '../data/schools.js';
import { readJsonStorage, storageKeys, writeJsonStorage } from './browserStorage.js';

export const favoritesStorageKey = storageKeys.favorites;
export const favoritesChangedEventName = 'school-choice-kz-favorites-changed';

export const normalizeFavoriteSchoolIds = (schoolIds) =>
  schoolIds.filter((schoolId, index) => schools.some((school) => school.id === schoolId) && schoolIds.indexOf(schoolId) === index);

export const getStoredFavoriteSchoolIds = () => {
  return normalizeFavoriteSchoolIds(readJsonStorage(favoritesStorageKey, [], { validate: Array.isArray }));
};

export const saveFavoriteSchoolIds = (schoolIds) => {
  const nextFavoriteSchoolIds = normalizeFavoriteSchoolIds(schoolIds);

  try {
    writeJsonStorage(favoritesStorageKey, nextFavoriteSchoolIds);
    window.dispatchEvent(new CustomEvent(favoritesChangedEventName, { detail: nextFavoriteSchoolIds }));
  } catch {
    // Favorites still work for the current session if localStorage is unavailable.
  }

  return nextFavoriteSchoolIds;
};
