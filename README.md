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
    flow: "user-registration"
  });
}
```
