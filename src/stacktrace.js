const stackTrace = require("stack-trace");

function build(error) {
  const rawStacktrace = stackTrace.parse(error);

  return rawStacktrace.map(row => {
    const { functionName, lineNumber, fileName } = row;

    return {
      method: functionName,
      number: lineNumber,
      file: fileName
    };
  });
}

module.exports = { build };
