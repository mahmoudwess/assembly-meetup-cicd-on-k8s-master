// Work around for https://github.com/angular/angular-cli/issues/7200

const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "none",
  output: {
    // Puts the output at the root of the dist folder
    path: path.join(__dirname, "dist", "server"),
    filename: "[name].js"
  },
  entry: {
    // This is our Express server for Dynamic universal
    server: "./server/server.ts"
  },
  target: "node",
  node: {
    __dirname: false, // if you don't put this is, __dirname
    __filename: false // and __filename return blank or /
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  // Make sure we don't include all node_modules
  externals: [nodeExternals()],
  module: {
    rules: [{ test: /\.ts$/, loader: "ts-loader" }]
  }
};
