const nock = require("nock");
const createReporter = require("../src/index");
const logger = require("../src/logger");
jest.mock(
  "../package.json",
  () => ({
    version: "99.99.99"
  }),
  { virtual: true }
);

jest.mock("../src/logger");

describe("index", () => {
  const givenApiKey = "someApiKey";

  const givenServerContext = {
    application: {
      name: "myApplication",
      version: "1.2.3"
    },
    network: {
      ip: {
        v4: "1.1.1.1",
        v6: "2001:db8::8a2e:370:7334"
      }
    }
  };

  const givenOptions = {
    apiKey: givenApiKey,
    serverContext: givenServerContext
  };

  it("should return an object with a expected functions", () => {
    const reporter = createReporter(givenOptions);

    expect(reporter).toEqual({
      notify: expect.any(Function)
    });
  });

  it("should submit notices to the API as expected", async () => {
    const fakeError = new Error("Some fake error");

    const fakeRequestContext = {
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
        notifier: {
          name: "Ross Wilson's Honeybadger Notifier",
          url: "https://github.com/rosswilson/honeybadger-node",
          version: "99.99.99"
        },
        error: "Error: Some fake error",
        request: fakeRequestContext,
        server: givenServerContext
      })
      .reply(201, {
        id: "a75ff7b5-f79a-4ecf-a7bb-1544524d0c18"
      });

    const { notify } = createReporter(givenOptions);

    await notify(fakeError, fakeRequestContext);

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
