import test from 'node:test';
import assert from 'node:assert/strict';
import { clearBilimChoiceStorage, readJsonStorage, writeJsonStorage } from '../src/lib/browserStorage.js';

const memoryStorage = (initial = {}) => {
  const data = new Map(Object.entries(initial));
  return { get length() { return data.size; }, key: (i) => [...data.keys()][i] ?? null, getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: (key) => data.delete(key) };
};

test('safe parsing removes corrupt or structurally invalid values', () => {
  const storage = memoryStorage({ corrupt: '{', wrong: '{}' });
  assert.deepEqual(readJsonStorage('corrupt', [], { storage, validate: Array.isArray }), []);
  assert.equal(storage.getItem('corrupt'), null);
  assert.deepEqual(readJsonStorage('wrong', [], { storage, validate: Array.isArray }), []);
});

test('JSON storage round-trips and privacy clearing preserves unrelated data', () => {
  const storage = memoryStorage({ 'bilimchoice:old': '1', 'school-choice-kz-favorites': '[]', unrelated: 'keep' });
  assert.equal(writeJsonStorage('bilimchoice:test:v1', ['a'], storage), true);
  assert.deepEqual(readJsonStorage('bilimchoice:test:v1', [], { storage, validate: Array.isArray }), ['a']);
  assert.equal(clearBilimChoiceStorage(storage), 3);
  assert.equal(storage.getItem('unrelated'), 'keep');
});
