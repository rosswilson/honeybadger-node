# Honeybadger Node

A package for Node.js applications to report errors to [Honeybadger](https://www.honeybadger.io/).

## Getting Started

This package isn't yet published to the NPM registry. In the meantime you can import the package
by referencing the `master` branch at GitHub within your `package.json` file, like this:

```json
{
  "dependencies": {
    "honeybadger-node": "https://github.com/rosswilson/honeybadger-node.git#master"
  }
}
```

Then instantiate the library:

```js
const honeybadger = require("honeybadger-node")({
  apiKey: "yourApiKey"
});
```

The library instance exposes a `notify` function that submits an Error (and some optional context) to Honeybadger:

```js
try {
  someFunctionThatMightThrow();
} catch (error) {
  honeybadger.notify(error, {
    url: "",
    params: {},
    session: {},
    cgi_data: {},
    context: {
      flow: "user-registration"
    }
  });
}
```

## Testing

[GitHub Actions](https://github.com/rosswilson/honeybadger-node/actions?query=branch%3Amaster) is configured to run
unit and integration tests.

Tests run against all Active LTS or Current Node versions (check the [current status](https://nodejs.org/en/about/releases/)):

- `10.x`
- `12.x`
- `13.x`

## Author

Ross Wilson
