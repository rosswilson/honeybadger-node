const createReporter = require("../src/index");

describe("index", () => {
  const givenOptions = {
    apiKey: "someApiKey"
  };

  it("should return an object with a expected functions", () => {
    const reporter = createReporter(givenOptions);

    expect(reporter).toEqual({
      notify: expect.any(Function)
    });
  });

  it("should return a notify function", () => {
    const { notify } = createReporter(givenOptions);

    const fakeError = new Error("Some fake error");

    notify(fakeError);
  });
});
