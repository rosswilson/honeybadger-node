const got = require("got");

function deliver(options, payload) {
  const { apiKey, baseUrl } = options;

  if (!apiKey) {
    throw new Error("API key must be set");
  }

  return got.post("v1/notices", {
    json: payload,
    prefixUrl: baseUrl,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-API-Key": apiKey
    }
  });
}

module.exports = { deliver };
