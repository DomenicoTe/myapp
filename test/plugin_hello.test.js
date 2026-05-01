describe('plugin_hello', () => {
  it('should not throw on require', () => {
    expect(() => require('../extensions/plugin_hello/index')).not.toThrow();
  });
});
