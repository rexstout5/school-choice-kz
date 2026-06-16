export const submissionStorageKey = 'school-choice-kz-submissions';

export const submissionTypes = {
  addSchool: 'addSchool',
  correction: 'correction'
};

export const getStoredSubmissions = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedSubmissions = window.localStorage.getItem(submissionStorageKey);
    const parsedSubmissions = storedSubmissions ? JSON.parse(storedSubmissions) : [];
    return Array.isArray(parsedSubmissions) ? parsedSubmissions : [];
  } catch {
    return [];
  }
};

export const saveSubmission = (submission) => {
  const nextSubmissions = [
    ...getStoredSubmissions(),
    {
      ...submission,
      id: `${submission.type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      submittedAt: new Date().toISOString()
    }
  ];

  window.localStorage.setItem(submissionStorageKey, JSON.stringify(nextSubmissions));
  return nextSubmissions;
};
