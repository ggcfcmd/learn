const cleanPluginForCommand = require("./plugins/clean");

module.exports = {
  plugins: {
    commands: [cleanPluginForCommand("hello world")],
  },
};
