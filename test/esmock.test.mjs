import test from 'ava';
import esmock from '../src/esmock';

test('Mock default export', async (t) => {
  const mod = await esmock('./artifacts/mod');
  mod.default = 'Test';
  const { value } = await import('./artifacts/consumer');

  t.is(value, 'Test');
});
