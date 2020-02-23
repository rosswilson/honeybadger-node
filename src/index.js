const backend = require("./backend");
const logger = require("./logger");

const defaultOptions = {
  baseUrl: "https://api.honeybadger.io"
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
    const result = await backend.deliver(this.options, payload);

    logger.debug(result);

    logger.info("Successfully reported error to Honeybadger");
  } catch (error) {
    logger.error(`Unable to report error to Honeybadger: ${error.message}`);
  }
}

module.exports = initialise;
