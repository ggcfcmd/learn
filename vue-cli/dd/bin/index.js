#!/usr/bin/env node

const webpack = require("webpack");
const minimist = require("minimist");
const path = require("path");

const buildInWebpackConfig = require("../webpack.config");
const args = minimist(process.argv.slice(2));

const __commands = {};
const fname = "dd.config.js";

const runWebpackBuild = () => {
  webpack(buildInWebpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      return console.log("build failed.");
    }
    console.log("build success.", args);
  });
};

// 封装api 其作为参数注入到自定义插件函数中 以此向外暴露功能
const api = {
  registerCommands(name, impl) {
    const command = __commands[name];
    if (!command) {
      __commands[name] = impl;
    }
  },
};

// 读取用户本地的配置文件 dd.config.js
const readLocalOption = () =>
  new Promise((resolve) => {
    const config = require(path.join(process.cwd(), fname)) || {};
    const { plugins: { commands = [] } = {} } = config;
    if (commands.length) {
      commands.forEach((command) => {
        command(api);
      });
    }

    resolve(__commands);
  });

readLocalOption().then((commands) => {
  const command = args._[0];
  if (commands[command]) {
    commands[command]();
  } else {
    runWebpackBuild();
  }
});
