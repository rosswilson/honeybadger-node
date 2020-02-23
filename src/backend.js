const axios = require("axios").default;

function deliver(options, payload) {
  const { apiKey } = options;

  if (!apiKey) {
    throw new Error("API key must be set to report errors to Honeybadger");
  }

  const config = {
    url: "/user",
    method: "post",
    baseURL: "https://some-domain.com/api/",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-API-Key": apiKey
    },
    data: payload
  };

  return axios.request(config);
}

module.exports = { deliver };
