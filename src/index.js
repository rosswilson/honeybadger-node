const backend = require("./backend");
const stacktrace = require("./stacktrace");
const logger = require("./logger");
const { version } = require("../package.json");

const defaultOptions = {
  baseUrl: "https://api.honeybadger.io",
  serverContext: {}
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

async function notify(error, requestContext) {
  const payload = {
    notifier: {
      name: "Ross Wilson's Honeybadger Notifier",
      url: "https://github.com/rosswilson/honeybadger-node",
      version
    },
    error: {
      class: error.name || "Error",
      message: error.message,
      backtrace: stacktrace.build(error)
    },
    request: requestContext,
    server: this.options.serverContext
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
