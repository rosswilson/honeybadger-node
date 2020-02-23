const got = require("got");
const { deliver } = require("../src/backend");

jest.mock("got");
jest.mock(
  "../package.json",
  () => ({
    name: "given-module-name",
    version: "99.99.99"
  }),
  { virtual: true }
);

describe("backend", () => {
  describe("#deliver", () => {
    it("should throw an error if the API key is missing", () => {
      const givenOptions = {};
      const givenPayload = {};

      expect(() => {
        deliver(givenOptions, givenPayload);
      }).toThrow("API key must be set");
    });

    it("should post to the expected endpoint", async () => {
      const givenBaseUrl = "https://example.com";

      const givenOptions = {
        apiKey: "someApiKey",
        baseUrl: givenBaseUrl
      };

      await deliver(givenOptions, {});

      const [gotPostCall] = got.post.mock.calls;

      const [requestPath, requestOptions] = gotPostCall;

      expect(requestPath).toEqual("v1/notices");
      expect(requestOptions.prefixUrl).toEqual(givenBaseUrl);
    });

    it("should build the User-Agent header as expected", async () => {
      const givenOptions = {
        apiKey: "someApiKey",
        baseUrl: "https://example.com"
      };

      await deliver(givenOptions, {});

      const [gotPostCall] = got.post.mock.calls;

      const [, requestOptions] = gotPostCall;

      expect(requestOptions.headers["User-Agent"]).toEqual(
        `given-module-name 99.99.99; ${process.version}; ${process.arch}-${process.platform}`
      );
    });
  });
});
