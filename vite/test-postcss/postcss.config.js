// postcss-preset-env 预设插件，会一次性帮你把一些必要的插件都装上，不用自己一个一个的去装

const postcssPresetEnv = require("postcss-preset-env");

module.exports = {
    plugins: [postcssPresetEnv(/* pluginOptions */)]
}