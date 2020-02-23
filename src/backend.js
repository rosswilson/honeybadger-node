const got = require("got");
const { name, version } = require("../package.json");

function deliver(options, payload) {
  const { apiKey, baseUrl } = options;

  if (!apiKey) {
    throw new Error("API key must be set");
  }

  const userAgent = `${name} ${version}; ${process.version}; ${process.arch}-${process.platform}`;

  return got.post("v1/notices", {
    json: payload,
    prefixUrl: baseUrl,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      "User-Agent": userAgent
    }
  });
}

module.exports = { deliver };
