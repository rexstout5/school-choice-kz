'use client';

import { useEffect, useState } from 'react';
import { favoritesChangedEventName, getStoredFavoriteSchoolIds, saveFavoriteSchoolIds } from '../lib/favorites.js';
import LucideIcon from './LucideIcons.jsx';

export default function FavoriteButton({ schoolId, labels, className = '' }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const syncFavoriteState = () => {
      setIsFavorite(getStoredFavoriteSchoolIds().includes(schoolId));
    };

    syncFavoriteState();
    window.addEventListener('storage', syncFavoriteState);
    window.addEventListener(favoritesChangedEventName, syncFavoriteState);

    return () => {
      window.removeEventListener('storage', syncFavoriteState);
      window.removeEventListener(favoritesChangedEventName, syncFavoriteState);
    };
  }, [schoolId]);

  const toggleFavorite = () => {
    const favoriteSchoolIds = getStoredFavoriteSchoolIds();
    const nextFavoriteSchoolIds = favoriteSchoolIds.includes(schoolId)
      ? favoriteSchoolIds.filter((favoriteSchoolId) => favoriteSchoolId !== schoolId)
      : [...favoriteSchoolIds, schoolId];

    setIsFavorite(nextFavoriteSchoolIds.includes(schoolId));
    saveFavoriteSchoolIds(nextFavoriteSchoolIds);
  };

  const text = isFavorite ? labels.remove : labels.add;

  return (
    <button
      type="button"
      className={`favorite-button ${isFavorite ? 'favorite-button--active' : ''} ${className}`.trim()}
      aria-pressed={isFavorite}
      aria-label={text}
      title={text}
      onClick={toggleFavorite}
    >
      <LucideIcon name="heart" size={18} fill={isFavorite ? 'currentColor' : 'none'} />
      <span>{text}</span>
    </button>
  );
}
