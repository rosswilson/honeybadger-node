const nock = require("nock");
const createReporter = require("../src/index");

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
    const endpointScope = nock("https://api.honeybadger.io", {
      reqheaders: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-Key": givenApiKey
      }
    })
      .post("/v1/notices", {
        error: "Error: Some fake error"
      })
      .reply(200, {
        status: "ok"
      });

    const { notify } = createReporter(givenOptions);

    const fakeError = new Error("Some fake error");

    await notify(fakeError);

    expect(endpointScope.isDone()).toBeTruthy();
  });
});
