const path = require("path");

module.exports = {
  entry: {
    index: "./src/index.js",
    search: "./src/search.js",
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
            },
          },
        ],
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: "file-loader",
      },
    ],
  },
  // 默认false，即不开启
  // watch: true,
  // // 只有开启监听模式时，watchOptions才有意义
  // watchOptions: {
  //   // 默认为空，不监听的文件或者文件夹，支持正则匹配 忽略node_modules可提升性能
  //   ignored: /node_modules/,
  //   // 监听到变化发生后会等300ms再去执行，默认300ms
  //   aggregateTimeout: 300,
  //   // 每秒轮询判断变更的次数，默认1000次/秒
  //   poll: 1000,
  // },
  devServer: {
    static: path.join(__dirname, "dist"),
    // hot: true,
  },
};
