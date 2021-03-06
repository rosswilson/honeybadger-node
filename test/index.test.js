const createReporter = require("../src/index");
const backend = require("../src/backend");
const logger = require("../src/logger");
const stacktrace = require("../src/stacktrace");

jest.mock(
  "../package.json",
  () => ({
    version: "99.99.99"
  }),
  { virtual: true }
);

jest.mock("../src/logger");
jest.mock("../src/backend");
jest.mock("../src/stacktrace");

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

  const fakeStackTrace = [
    {
      functionName: "someFunctionName",
      lineNumber: "someLineNumber",
      columnNumber: "someColumnNumber",
      fileName: "someFileName"
    },
    {
      functionName: "someFunctionName",
      lineNumber: "someLineNumber",
      columnNumber: "someColumnNumber",
      fileName: "someFileName"
    }
  ];

  stacktrace.build.mockReturnValue(fakeStackTrace);

  it("should return an object with a expected functions", () => {
    const reporter = createReporter(givenOptions);

    expect(reporter).toEqual({
      notify: expect.any(Function)
    });
  });

  it.only("should call the backend deliver function as expected", async () => {
    const { notify } = createReporter(givenOptions);

    const fakeError = new Error("Some fake error");

    const givenRequestContext = {
      someKey: "someValue"
    };

    await notify(fakeError, givenRequestContext);

    expect(backend.deliver).toHaveBeenCalledWith(
      {
        apiKey: givenApiKey,
        baseUrl: "https://api.honeybadger.io",
        serverContext: givenServerContext
      },
      {
        notifier: {
          name: "Ross Wilson's Honeybadger Notifier",
          url: "https://github.com/rosswilson/honeybadger-node",
          version: "99.99.99"
        },
        error: {
          backtrace: fakeStackTrace,
          class: "Error",
          message: "Some fake error"
        },
        request: givenRequestContext,
        server: givenServerContext
      }
    );
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
