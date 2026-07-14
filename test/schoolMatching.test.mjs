import assert from 'node:assert/strict';
import test from 'node:test';
import { matchSchool, matchSchools } from '../src/lib/schoolMatching.js';
const pub = { id:'pub', type:'public', district:'yesil', instruction_languages:['Russian','Kazakh'], tuition_fee:0, school_type:{ru:'Государственная'}, programs:{en:'National curriculum'}, profile:{schoolProfileTags:['support calm'], considerations:[]} };
const stem = { id:'stem', type:'private', district:'nura', instruction_languages:['English','Russian'], tuition_fee:520000, school_type:{en:'International private'}, programs:{en:'STEM robotics international English olympiad intensive academic'}, profile:{schoolProfileTags:['STEM','robotics'], considerations:['intensive workload']} };
const missingCost = { id:'missing', type:'private', district:'yesil', instruction_languages:['Russian'], school_type:{en:'Private'}, programs:{en:'Language development'}, profile:{} };
const noTags = { id:'notags', type:'private', district:'yesil', instruction_languages:['Russian'], tuition_fee:100000, school_type:{en:'Private'}, programs:{en:''}, profile:{} };

test('free public school with required Russian passes hard filters', () => { const r = matchSchool(pub, { schoolTypes:['public'], requiredLanguages:['Russian'], budgetRange:'free' }); assert.equal(r.hardFilterPassed, true); assert.ok(r.score > 0); });
test('private STEM school with English and high budget scores strongly', () => { const r = matchSchool(stem, { schoolTypes:['private'], requiredLanguages:['English'], budgetRange:'500plus', priorities:[{key:'stem',weight:3},{key:'english',weight:3}], learningPace:'intensive' }); assert.equal(r.hardFilterPassed, true); assert.ok(r.score >= 50); });
test('calm pace adds consideration for intensive workload', () => { const r = matchSchool(stem, { learningPace:'calm' }); assert.ok(r.considerations.some((x) => x.includes('нагруз'))); });
test('any school type does not restrict hard filters', () => { assert.equal(matchSchool(pub, { schoolTypes:['any'] }).hardFilterPassed, true); assert.equal(matchSchool(stem, { schoolTypes:['any'] }).hardFilterPassed, true); });
test('missing tuition is not excluded but lowers completeness', () => { const r = matchSchool(missingCost, { budgetRange:'300' }); assert.equal(r.hardFilterPassed, true); assert.ok(r.missingData.some((x) => x.includes('Стоимость'))); });
test('missing profile tags are reported', () => { const r = matchSchool(noTags, { priorities:[{key:'stem',weight:3}] }); assert.ok(r.missingData.some((x) => x.includes('Профильные'))); });
test('no schools pass impossible hard filters', () => { const results = matchSchools([pub, stem], { schoolTypes:['international'], requiredLanguages:['French'], budgetRange:'free', preferredDistricts:['almaty'], neighboringDistrictsAllowed:false }); assert.equal(results.filter((r) => r.hardFilterPassed).length, 0); });
test('readiness result is used as soft signal', () => { const r = matchSchool(pub, { readinessResult:{ overallScore:70, strengths:['language'], growthAreas:['adaptation'] }, learningPace:'calm' }); assert.ok(r.matchedReasons.some((x) => x.includes('готовности'))); });
test('mixed required and preferred languages are handled', () => { const r = matchSchool(stem, { requiredLanguages:['English'], preferredLanguages:['Russian'] }); assert.equal(r.hardFilterPassed, true); assert.ok(r.score >= 15); });
test('score is stable for identical input', () => { const pref = { schoolTypes:['private'], priorities:[{key:'stem',weight:3}], learningPace:'intensive' }; assert.deepEqual(matchSchool(stem, pref), matchSchool(stem, pref)); });
