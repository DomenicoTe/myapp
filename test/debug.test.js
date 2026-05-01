describe('debug module', () => {
  it('should export a function', () => {
    const debug = require('../packages/debug/index');
    expect(typeof debug).toBe('function');
  });
});
