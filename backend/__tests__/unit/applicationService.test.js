const { switchError } = require('../../app/services/application.service');

describe('Application service', () => {
  it('should return internal error', () => {
    const error = new Error();
    const [, newError] = switchError(error);

    expect(newError.error).toBe("Internal error");
  });
});