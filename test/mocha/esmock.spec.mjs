import esmock from '../../src/esmock';

describe('esmock', () => {
  it('Mocks a default export', async () => {
    const mod = await esmock('./artifacts/mod');
    mod.default = 'Test';
    const { value } = await import('./artifacts/consumer');

    // t.is(value, 'Test');
  });
});
