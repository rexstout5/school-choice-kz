/**
 * @typedef {Object} FamilyPreference
 * @property {number=} childAge
 * @property {string=} targetGrade
 * @property {string[]=} preferredDistricts
 * @property {boolean=} neighboringDistrictsAllowed
 * @property {'15'|'30'|'45'|'any'=} maxTravelTime
 * @property {string[]=} schoolTypes
 * @property {string[]=} requiredLanguages
 * @property {string[]=} preferredLanguages
 * @property {string=} budgetRange
 * @property {{ key: string, weight: 1|2|3 }[]=} priorities
 * @property {string[]=} childTraits
 * @property {'calm'|'moderate'|'intensive'|'unknown'=} learningPace
 * @property {string[]=} requirements
 * @property {{ overallScore?: number, strengths?: string[], growthAreas?: string[] }=} readinessResult
 *
 * @typedef {Object} SchoolMatchResult
 * @property {string} schoolId
 * @property {number} score
 * @property {'high'|'medium'|'low'} confidence
 * @property {string[]} matchedReasons
 * @property {string[]} considerations
 * @property {string[]} missingData
 * @property {boolean} hardFilterPassed
 */

const normalize = (value) => String(value ?? '').toLowerCase();
const getText = (value) => typeof value === 'string' ? value : Object.values(value ?? {}).join(' ');
const unique = (items) => [...new Set(items.filter(Boolean))];

export const budgetLimits = { free: 0, '150': 150000, '300': 300000, '500': 500000, '500plus': Infinity, unknown: Infinity };
export const recommendationProfileStorageKey = 'bilimchoice:recommendation:v1:profile';
export const recommendationResultsStorageKey = 'bilimchoice:recommendation:v1:results';

export const priorityTagMap = {
  math: ['math', 'математ', 'физмат', 'stem'], english: ['english', 'англий', 'international', 'language'], stem: ['stem', 'робот', 'physics', 'математ', 'science'], olympiad: ['olympiad', 'олимпиад', 'bil', 'nis'], creativity: ['creative', 'творч', 'art'], sport: ['sport', 'спорт'], international: ['international', 'ib', 'cambridge', 'english'], softAdaptation: ['adapt', 'support', 'мяг', 'поддерж'], smallClasses: ['small class', 'небольш'], inclusive: ['inclusive', 'support', 'инклюз'], primary: ['primary', 'начальн'], abroad: ['international', 'english', 'cambridge', 'ib'], discipline: ['discipline', 'дисцип'], safety: ['safety', 'безопас'], afterSchool: ['after-school', 'продлен'], nearHome: ['near']
};

export const traitTagMap = {
  mathLogic: priorityTagMap.math, languages: priorityTagMap.english, creative: priorityTagMap.creativity, sporty: priorityTagMap.sport, independent: ['intensive', 'academic'], softAdaptation: priorityTagMap.softAdaptation, noiseSensitive: ['small class', 'calm'], smallGroups: ['small class'], tiredFromLoad: ['calm', 'support'], intensiveComfort: ['intensive', 'academic', 'olympiad'], extraSupport: ['support', 'inclusive']
};

const schoolBlob = (school) => normalize([school.id, school.type, getText(school.name), getText(school.school_type), getText(school.description), getText(school.programs), getText(school.profile?.summary), getText(school.profile?.schoolProfileTags), getText(school.profile?.bestFor), getText(school.profile?.parentHighlights)].join(' '));
const considerationBlob = (school) => normalize([getText(school.profile?.considerations), getText(school.profile?.mayNotFit)].join(' '));
const hasAny = (blob, needles = []) => needles.some((needle) => blob.includes(normalize(needle)));
const schoolLanguages = (school) => (school.instruction_languages ?? school.language_of_instruction ?? []).map(normalize);
const isAnyType = (types = []) => types.length === 0 || types.includes('any');
const typeMatches = (school, type) => type === 'public' ? ['public', 'specialized'].includes(school.type) : school.type === type || normalize(getText(school.school_type)).includes(type);
const hasUnknownPrice = (school) => school.tuition_fee === null || school.tuition_fee === undefined;
const priceFits = (school, range) => !range || range === 'unknown' || (range === 'free' ? school.tuition_fee === 0 : hasUnknownPrice(school) || school.tuition_fee <= budgetLimits[range]);

export function evaluateHardFilters(school, preference = {}) {
  const reasons = [];
  if (!isAnyType(preference.schoolTypes) && !preference.schoolTypes.some((type) => typeMatches(school, type))) reasons.push('Тип школы не совпадает с обязательным выбором.');
  if ((preference.requiredLanguages ?? []).length && !preference.requiredLanguages.some((language) => schoolLanguages(school).includes(normalize(language)))) reasons.push('Обязательный язык обучения отсутствует в данных школы.');
  if (preference.budgetRange === 'free' && school.tuition_fee !== 0) reasons.push('Вы выбрали только бесплатные школы.');
  if (!preference.neighboringDistrictsAllowed && (preference.preferredDistricts ?? []).length && !preference.preferredDistricts.includes(school.district)) reasons.push('Школа находится не в выбранном районе.');
  if (preference.childAge && Array.isArray(school.accepted_ages) && !school.accepted_ages.includes(preference.childAge)) reasons.push('Школа точно не принимает указанный возраст.');
  return { passed: reasons.length === 0, reasons };
}

function add(score, max, condition, reasons, reason) { if (condition) { reasons.push(reason); return score + max; } return score; }

export function matchSchool(school, preference = {}) {
  const hard = evaluateHardFilters(school, preference);
  const matchedReasons = [], considerations = [...hard.reasons], missingData = [];
  const blob = schoolBlob(school); const cons = considerationBlob(school); let score = 0;
  score = add(score, 20, (preference.preferredDistricts ?? []).includes(school.district), matchedReasons, 'Находится в выбранном районе и может подойти по локации.');
  const requiredOrPreferred = unique([...(preference.requiredLanguages ?? []), ...(preference.preferredLanguages ?? [])]);
  score = add(score, requiredOrPreferred.length ? 15 : 7, requiredOrPreferred.length ? requiredOrPreferred.some((l) => schoolLanguages(school).includes(normalize(l))) : true, matchedReasons, 'Язык обучения совпадает с вашими предпочтениями.');
  if (hasUnknownPrice(school)) missingData.push('Стоимость требует уточнения.'); else score = add(score, 15, priceFits(school, preference.budgetRange), matchedReasons, school.tuition_fee === 0 ? 'Бесплатная школа совпадает с бюджетом.' : 'Стоимость может подойти под указанный бюджет.');
  const priorityHits = (preference.priorities ?? []).filter((p) => p.weight > 1 && hasAny(blob, priorityTagMap[p.key] ?? [p.key]));
  if ((preference.priorities ?? []).some((p) => p.key === 'smallClasses') && !hasAny(blob, priorityTagMap.smallClasses)) missingData.push('Размер классов требует уточнения.');
  if ((preference.priorities ?? []).length && !priorityHits.length) missingData.push('Профильные теги требуют уточнения.');
  if (priorityHits.length) { score += Math.min(20, priorityHits.reduce((sum, p) => sum + p.weight * 4, 0)); matchedReasons.push('Образовательный профиль совпадает с выбранными приоритетами.'); }
  const traitHits = (preference.childTraits ?? []).filter((trait) => hasAny(blob, traitTagMap[trait] ?? [trait]));
  if (traitHits.length) { score += Math.min(15, traitHits.length * 5); matchedReasons.push('Особенности ребенка совпадают с описанием среды школы.'); }
  if (preference.learningPace === 'calm') { if (hasAny(cons, ['intensive', 'нагруз', 'конкурс'])) { considerations.push('Стоит уточнить учебную нагрузку: в данных есть признаки интенсивной среды.'); score -= 5; } score = add(score, 10, hasAny(blob, ['support', 'adapt', 'мяг', 'calm']), matchedReasons, 'Поддерживающая среда может подойти для спокойного темпа.'); }
  if (preference.learningPace === 'intensive') score = add(score, 10, hasAny(blob, ['intensive', 'academic', 'olympiad', 'stem', 'bil', 'nis']), matchedReasons, 'Сильная академическая программа может подойти для интенсивного темпа.');
  const reqs = preference.requirements ?? [];
  const reqHits = reqs.filter((r) => (r === 'afterSchool' && school.after_school_program === 'yes') || (r === 'bus' && school.school_bus === 'yes') || (r === 'sport' && hasAny(blob, ['sport', 'спорт'])));
  if (reqHits.length) { score += Math.min(5, reqHits.length * 2); matchedReasons.push('Часть дополнительных условий совпадает с данными каталога.'); }
  reqs.filter((r) => !reqHits.includes(r)).forEach((r) => missingData.push(`${r === 'afterSchool' ? 'Продленка' : r === 'bus' ? 'Школьный автобус' : r === 'meal' ? 'Питание' : 'Дополнительное условие'} требует уточнения.`));
  if (preference.readinessResult?.strengths?.length) { score += 3; matchedReasons.push('Последний результат готовности использован как мягкий дополнительный сигнал.'); }
  if (preference.readinessResult?.growthAreas?.length && (preference.learningPace === 'calm' || hasAny(blob, ['support', 'adapt']))) score += 2;
  const relevant = 8; const known = relevant - Math.min(relevant, unique(missingData).length + (hasUnknownPrice(school) ? 1 : 0)); const ratio = known / relevant;
  const confidence = ratio >= 0.8 ? 'high' : ratio >= 0.5 ? 'medium' : 'low';
  return { schoolId: school.id, score: Math.max(0, Math.min(100, Math.round(score))), confidence, matchedReasons: unique(matchedReasons).slice(0, 5), considerations: unique(considerations).slice(0, 4), missingData: unique(missingData).slice(0, 5), hardFilterPassed: hard.passed };
}

export function matchSchools(schools, preference = {}) {
  return schools.map((school) => matchSchool(school, preference)).sort((a, b) => b.hardFilterPassed - a.hardFilterPassed || b.score - a.score || a.schoolId.localeCompare(b.schoolId));
}
