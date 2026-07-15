import test from 'node:test';
import assert from 'node:assert/strict';
import { matchSchool, matchSchools, priceFits, normalizeMonthlyTuition } from '../src/lib/schoolMatching.js';

const pub = { id:'pub', type:'public', district:'yesil', instruction_languages:['Russian','Kazakh'], tuition_fee:0, school_type:{ru:'Государственная'}, programs:{en:'National curriculum'}, profile:{schoolProfileTags:['support calm'], considerations:[]} };
const low = { id:'low', type:'private', district:'yesil', instruction_languages:['Russian'], tuition_fee:150000, school_type:{en:'Private'}, programs:{en:'math English'}, profile:{schoolProfileTags:['math'], considerations:[]} };
const mid = { id:'mid', type:'private', district:'yesil', instruction_languages:['Russian'], tuition_fee:300000, school_type:{en:'Private'}, programs:{en:'STEM'}, profile:{schoolProfileTags:['STEM'], considerations:[]} };
const high = { id:'high', type:'private', district:'yesil', instruction_languages:['English','Russian'], tuition_fee:500000, school_type:{en:'Private'}, programs:{en:'international'}, profile:{schoolProfileTags:['international'], considerations:[]} };
const premium = { id:'premium', type:'private', district:'nura', instruction_languages:['English','Russian'], tuition_fee:520000, school_type:{en:'International private'}, programs:{en:'STEM robotics international English olympiad intensive academic'}, profile:{schoolProfileTags:['STEM','robotics'], considerations:['intensive workload']} };
const missingCost = { id:'missing', type:'private', district:'yesil', instruction_languages:['Russian'], tuition_fee:null, school_type:{en:'Private'}, programs:{en:'support'}, profile:{} };
const annual = { id:'annual', type:'private', district:'yesil', instruction_languages:['Russian'], tuition_fee:null, annualTuition:1800000, school_type:{en:'Private'}, programs:{en:''}, profile:{} };

test('free public school with required Russian passes hard filters', () => { const r = matchSchool(pub, { schoolTypes:['public'], requiredLanguages:['Russian'], budgetRange:'free' }); assert.equal(r.hardFilterPassed, true); assert.ok(r.score > 0); });
test('private STEM school with English and high budget scores strongly', () => { const r = matchSchool(premium, { schoolTypes:['private'], requiredLanguages:['English'], budgetRange:'500plus', priorities:[{key:'stem',weight:3},{key:'english',weight:3}], learningPace:'intensive' }); assert.equal(r.hardFilterPassed, true); assert.ok(r.score >= 50); });

test('budget only free excludes paid and unknown schools', () => { assert.equal(priceFits(pub, 'free'), true); assert.equal(priceFits(low, 'free'), false); assert.equal(matchSchool(missingCost, { budgetRange:'free' }).hardFilterPassed, false); });
test('budget up to 150000 excludes more expensive schools', () => { assert.equal(priceFits(low, '150'), true); assert.equal(priceFits(mid, '150'), false); });
test('budget up to 300000 excludes more expensive schools', () => { assert.equal(priceFits(mid, '300'), true); assert.equal(priceFits(high, '300'), false); });
test('budget up to 500000 excludes more expensive schools', () => { assert.equal(priceFits(high, '500'), true); assert.equal(priceFits(premium, '500'), false); });
test('annual tuition is converted to monthly tuition for matching', () => { assert.equal(normalizeMonthlyTuition(annual), 150000); assert.equal(priceFits(annual, '150'), true); assert.equal(priceFits(annual, 'free'), false); });
test('unknown tuition is not treated as fitting a strict budget', () => { const r = matchSchool(missingCost, { budgetRange:'300' }); assert.equal(r.hardFilterPassed, false); assert.ok(r.missingData.some((x) => x.includes('Стоимость'))); assert.equal(r.matchedReasons.includes('Подходит по указанному бюджету.'), false); });
test('budget unknown does not apply price filtering', () => { assert.equal(matchSchool(missingCost, { budgetRange:'unknown' }).hardFilterPassed, true); });
test('missing profile tags are reported', () => { const noTags = { ...low, id:'notags', programs:{en:''}, profile:{} }; const r = matchSchool(noTags, { priorities:[{key:'stem',weight:3}] }); assert.ok(r.missingData.some((x) => x.includes('Профильные'))); });
test('no schools pass impossible hard filters', () => { const results = matchSchools([pub, premium], { schoolTypes:['international'], requiredLanguages:['French'], budgetRange:'free', preferredDistricts:['almaty'], neighboringDistrictsAllowed:false }); assert.equal(results.filter((r) => r.hardFilterPassed).length, 0); });
test('score is stable for identical input', () => { const pref = { schoolTypes:['private'], priorities:[{key:'stem',weight:3}], learningPace:'intensive' }; assert.deepEqual(matchSchool(premium, pref), matchSchool(premium, pref)); });
