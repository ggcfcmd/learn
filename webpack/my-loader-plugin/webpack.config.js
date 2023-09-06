const path = require("path");
const MyPlugin = require("./src/plugins/my-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "main.js",
  },
  mode: "production",
  plugins: [new MyPlugin({ name: "my plugin" })],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          path.resolve("./src/loaders/a-loader"),
          path.resolve("./src/loaders/b-loader"),
        ],
      },
    ],
  },
};
