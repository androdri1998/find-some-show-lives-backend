const {
  switchError,
  generateToken,
} = require("../../app/services/application.service");

describe("Application service", () => {
  it("should return internal error", () => {
    const error = new Error();
    const [, newError] = switchError(error);
    expect(newError.error).toBe("Internal error");
  });
  it("should return token", () => {
    const token = generateToken({ teste: "teste" });
    expect(typeof token).toBe("string");
  });
});
