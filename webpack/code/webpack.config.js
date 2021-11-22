const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: "./src/index.js",
  devServer: {
    port: 8000,
    hot: true, // only：热更新时可能会失败 设置为 true 时当热更新失败时会自动降级到默认模式以保证页面展示正常 设置为 only 时页面只接受热更新 不接受主动刷新 失败就失败（哼~）
  },
  output: {
    path: path.resolve(__dirname, "output"),
    filename: "[name].js",
    // library: {
    //   name: "webpackNumbers",
    //   type: "amd",
    // },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              "@babel/plugin-transform-runtime",
              ["@babel/plugin-proposal-decorators", { legacy: true }],
            ],
          },
        },
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            // options: {
            //   modules: true,
            // },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        react: {
          filename: "react.js",
          chunks: "all",
          test: /[\\/]node_modules[\\/]react[\\/]/,
        },
        "react-dom": {
          filename: "react-dom.js",
          chunks: "all",
          test: /[\\/]node_modules[\\/]react-dom[\\/]/,
        },
      },
    },
  },
};
