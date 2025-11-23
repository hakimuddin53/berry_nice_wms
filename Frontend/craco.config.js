// CRACO (Create React App Configuration Override) is an easy and comprehensible configuration layer for create-react-app.
// https://github.com/gsoft-inc/craco

const webpack = require("webpack");

// Node 20+ exposes a localStorage getter that throws unless a --localstorage-file
// flag is provided; stub it out so build-time tooling (like HtmlWebpackPlugin
// template evaluation) does not crash when it checks for localStorage.
const globalRef = typeof globalThis !== "undefined" ? globalThis : global;
const localStorageDescriptor = Object.getOwnPropertyDescriptor(
  globalRef,
  "localStorage"
);
if (localStorageDescriptor?.get) {
  Object.defineProperty(globalRef, "localStorage", {
    value: undefined,
    writable: true,
    configurable: true,
  });
}

module.exports = {
  babel: {
    plugins: [
      [
        "babel-plugin-direct-import",
        {
          modules: [
            "@mui/lab",
            "@mui/material",
            "@mui/system",
            "@mui/icons-material",
            "react-feather",
          ],
        },
      ],
    ],
  },
  webpack: {
    configure: {
      // Webpack ≥5 no longer ships with Node.js polyfills by default.
      // Reference: https://webpack.js.org/blog/2020-10-10-webpack-5-release/#automatic-nodejs-polyfills-removed
      // Solution: https://github.com/facebook/create-react-app/issues/11756#issuecomment-1001769356
      resolve: {
        fallback: {
          buffer: require.resolve("buffer"),
          crypto: require.resolve("crypto-browserify"),
          process: require.resolve("process/browser"),
          stream: require.resolve("stream-browserify"),
          util: require.resolve("util"),
          vm: require.resolve("vm-browserify"),
        },
      },
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: require.resolve("process/browser"),
        }),
      ],
    },
  },
};
