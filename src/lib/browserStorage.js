export const STORAGE_PREFIXES = ['bilimchoice:', 'school-choice-kz-'];

export const storageKeys = {
  favorites: 'bilimchoice:favorites:v1',
  comparison: 'bilimchoice:comparison:v1',
  readiness: 'bilimchoice:readiness:v1:results',
  recommendationProfile: 'bilimchoice:recommendation:v1:profile',
  recommendationResults: 'bilimchoice:recommendation:v1:results'
};

export function readJsonStorage(key, fallback, { validate = () => true, storage } = {}) {
  const target = storage ?? (typeof window !== 'undefined' ? window.localStorage : null);
  if (!target) return fallback;
  try {
    const raw = target.getItem(key);
    if (raw === null) return fallback;
    const value = JSON.parse(raw);
    if (!validate(value)) throw new TypeError('Invalid stored value');
    return value;
  } catch {
    try { target.removeItem(key); } catch {}
    return fallback;
  }
}

export function writeJsonStorage(key, value, storage) {
  const target = storage ?? (typeof window !== 'undefined' ? window.localStorage : null);
  if (!target) return false;
  try { target.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}

export function clearBilimChoiceStorage(storage) {
  const target = storage ?? (typeof window !== 'undefined' ? window.localStorage : null);
  if (!target) return 0;
  const keys = Array.from({ length: target.length }, (_, index) => target.key(index)).filter(Boolean);
  const ownedKeys = keys.filter((key) => STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix)));
  ownedKeys.forEach((key) => target.removeItem(key));
  return ownedKeys.length;
}
