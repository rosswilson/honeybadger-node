const { parse } = require("stack-trace");
const { build } = require("../src/stacktrace");

jest.mock("stack-trace");

describe("stacktrace", () => {
  parse.mockReturnValue([
    {
      functionName: "someFunctionName",
      lineNumber: "someLineNumber",
      fileName: "someFileName"
    },
    {
      functionName: "someFunctionName",
      lineNumber: "someLineNumber",
      fileName: "someFileName"
    }
  ]);

  describe("#build", () => {
    it("should post to the expected endpoint", async () => {
      const fakeError = new Error("Some fake error");

      const result = build(fakeError);

      expect(result).toEqual([
        {
          method: "someFunctionName",
          number: "someLineNumber",
          file: "someFileName"
        },
        {
          method: "someFunctionName",
          number: "someLineNumber",
          file: "someFileName"
        }
      ]);
    });
  });
});
