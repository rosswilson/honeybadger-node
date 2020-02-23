const createReporter = require("../src/index");

describe("index", () => {
  it("should return an object with a expected functions", () => {
    const reporter = createReporter();

    expect(reporter).toEqual({
      notify: expect.any(Function)
    });
  });

  it("should return a notify function", () => {
    const { notify } = createReporter();

    const fakeError = new Error("Some fake error");

    notify(fakeError);
  });
});
