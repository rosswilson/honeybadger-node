const backend = require("./backend");

const defaultOptions = {
  endpoint: "https://api.honeybadger.io"
};

function initialise(overrideOptions = {}) {
  this.options = {
    ...defaultOptions,
    ...overrideOptions
  };

  return {
    notify: notify.bind(this)
  };
}

async function notify(error, context) {
  const payload = {
    error: error.toString(),
    context
  };

  try {
    await backend.deliver(this.options, payload);

    console.log("Successfully reported error to Honeybadger");
  } catch (error) {
    console.error("Unable to report error to Honeybadger", error);
  }
}

module.exports = initialise;
