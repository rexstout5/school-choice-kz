import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const recommendation = readFileSync('app/recommendation/page.jsx', 'utf8');
const readiness = readFileSync('app/school-readiness/page.jsx', 'utf8');
const css = readFileSync('app/globals.css', 'utf8');

test('priority UI limits selection to five and stores equal weights', () => {
  assert.match(recommendation, /current\.length < 5/);
  assert.match(recommendation, /Можно выбрать не более пяти критериев/);
  assert.doesNotMatch(recommendation, /<select value=\{item\.weight\}|<option value="3">Очень важно|<option value="2">Желательно|<option value="1">Не принципиально/);
  assert.match(recommendation, /weight: 3/);
});

test('readiness advances directly after last domain question without completed screen delay', () => {
  assert.doesNotMatch(readiness, /Раздел завершён|completedDomain|continueAfterDomain|900/);
  assert.match(readiness, /}, 200\);/);
});

test('recommendation results toolbar has no fixed or sticky positioning on desktop', () => {
  const desktopRule = css.match(/@media \(min-width:761px\)\{[^}]+\.recommendation-page-actions[^}]+\}/)?.[0] ?? '';
  assert.doesNotMatch(desktopRule, /fixed|sticky/);
  assert.match(desktopRule, /position:static/);
});

test('compare button is disabled until two schools are selected and shows counter', () => {
  assert.match(recommendation, /selectedCompareIds\.length < 2/);
  assert.match(recommendation, /compareSelected\} \(\{selectedCompareIds\.length\}\)/);
});
