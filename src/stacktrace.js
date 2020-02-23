const stackTrace = require("stack-trace");

function build(error) {
  const rawStacktrace = stackTrace.parse(error);

  return rawStacktrace.map(row => {
    const { functionName, lineNumber, columnNumber, fileName } = row;

    return {
      functionName,
      lineNumber,
      columnNumber,
      fileName
    };
  });
}

module.exports = { build };
