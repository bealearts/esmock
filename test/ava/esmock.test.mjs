import test from 'ava';
import esmock from '../../';


test('Mock default export', async (t) => {
  const mod = await esmock('../artifacts/mod');
  mod.default = 'Test';

  const { value } = await import('../artifacts/consumer');
  t.is('value', 'Test');
});

test('a test case', async (t) => {
  const value = 'Test';

  t.is(value, 'Test');
});
