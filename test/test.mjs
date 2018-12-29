import esmock from '../src/esmock';

(async () => {
  const mod = await esmock('./artifacts/mod');
  mod.default = 'Test';
  const { value } = await import('./artifacts/consumer');

  console.log(value);
})();
