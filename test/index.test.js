const nock = require("nock");
const createReporter = require("../src/index");
const logger = require("../src/logger");

jest.mock("../src/logger");

describe("index", () => {
  const givenApiKey = "someApiKey";

  const givenOptions = {
    apiKey: givenApiKey
  };

  it("should return an object with a expected functions", () => {
    const reporter = createReporter(givenOptions);

    expect(reporter).toEqual({
      notify: expect.any(Function)
    });
  });

  it("should submit notices to the API as expected", async () => {
    const fakeError = new Error("Some fake error");

    const fakeContext = {
      someKey: "someValue"
    };

    const endpointScope = nock("https://api.honeybadger.io", {
      reqheaders: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-Key": givenApiKey
      }
    })
      .post("/v1/notices", {
        error: "Error: Some fake error",
        context: fakeContext
      })
      .reply(200, {
        id: "a75ff7b5-f79a-4ecf-a7bb-1544524d0c18"
      });

    const { notify } = createReporter(givenOptions);

    await notify(fakeError, fakeContext);

    expect(endpointScope.isDone()).toBeTruthy();
  });

  it("should log an error if the API key is not configured", async () => {
    const { notify } = createReporter({
      ...givenOptions,
      apiKey: undefined
    });

    const fakeError = new Error("Some fake error");

    await notify(fakeError);

    expect(logger.error).toHaveBeenCalledWith(
      "Unable to report error to Honeybadger: API key must be set"
    );
  });
});
