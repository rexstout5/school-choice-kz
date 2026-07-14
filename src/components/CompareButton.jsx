'use client';

import { useEffect, useState } from 'react';

export const comparisonStorageKey = 'school-choice-kz-comparison';
export const comparisonChangedEventName = 'school-choice-kz-comparison-changed';
const maxComparedSchools = 3;

const getStoredComparedSchoolIds = () => {
  try {
    const storedComparison = window.localStorage.getItem(comparisonStorageKey);
    const parsedComparison = storedComparison ? JSON.parse(storedComparison) : [];
    return Array.isArray(parsedComparison) ? parsedComparison.slice(0, maxComparedSchools) : [];
  } catch {
    return [];
  }
};

export default function CompareButton({ schoolId, labels, className = '' }) {
  const [comparedSchoolIds, setComparedSchoolIds] = useState([]);

  useEffect(() => {
    setComparedSchoolIds(getStoredComparedSchoolIds());
  }, []);

  const isCompared = comparedSchoolIds.includes(schoolId);
  const isDisabled = comparedSchoolIds.length >= maxComparedSchools && !isCompared;

  const toggleComparison = () => {
    const currentIds = getStoredComparedSchoolIds();
    const nextIds = currentIds.includes(schoolId)
      ? currentIds.filter((id) => id !== schoolId)
      : [...currentIds, schoolId].slice(0, maxComparedSchools);

    try {
      window.localStorage.setItem(comparisonStorageKey, JSON.stringify(nextIds));
      window.dispatchEvent(new CustomEvent(comparisonChangedEventName, { detail: nextIds }));
    } catch {
      // Keep the button usable in the current render even if localStorage is unavailable.
    }

    setComparedSchoolIds(nextIds);
  };

  return (
    <button
      type="button"
      className={["button-secondary", "compare-button", className].filter(Boolean).join(' ')}
      onClick={toggleComparison}
      disabled={isDisabled}
      aria-pressed={isCompared}
    >
      {isCompared ? labels.remove : labels.add}
    </button>
  );
}
