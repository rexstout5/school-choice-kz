import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const recommendation = readFileSync('app/recommendation/page.jsx', 'utf8');
const readiness = readFileSync('app/school-readiness/page.jsx', 'utf8');
const css = readFileSync('app/globals.css', 'utf8');
const recommendationResults = readFileSync('src/components/recommendation/RecommendationResults.jsx', 'utf8');

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
  const toolbarRule = css.match(/\.recommendation-toolbar \{[^}]+\}/)?.[0] ?? '';
  assert.doesNotMatch(toolbarRule, /fixed|sticky|absolute/);
  assert.match(toolbarRule, /margin-bottom:32px/);
});

test('compare button is disabled until two schools are selected and shows counter', () => {
  assert.match(recommendation, /selectedCompareIds\.length < 2/);
  assert.match(recommendationResults, /count \? ` \(\$\{count\}\)`/);
  assert.match(recommendationResults, /aria-disabled=\{disabled\}/);
});

test('recommendations use separate cards in algorithm order with real scores', () => {
  assert.match(recommendation, /main\.map\(\(result, index\)/);
  assert.match(recommendationResults, /className="recommended-school-card"/);
  assert.match(recommendationResults, /score=\{result\.score\}/);
  assert.doesNotMatch(recommendationResults, /4\.7|reviewsCount|ratingSource/);
});

test('unknown prices, reasons and optional considerations are presented safely', () => {
  assert.match(recommendationResults, /school\.tuition_fee == null/);
  assert.match(recommendationResults, /Стоимость уточняется/);
  assert.match(recommendationResults, /slice\(0, 4\)/);
  assert.match(recommendationResults, /if \(!visible\.length\) return null/);
});

test('empty and fewer-than-five result states do not add fallback schools', () => {
  assert.match(recommendation, /main\.length < 5 \? <MoreRecommendations/);
  assert.match(recommendation, /: <RecommendationEmptyState/);
  assert.doesNotMatch(recommendation, /showCloseMatches && other/);
});
