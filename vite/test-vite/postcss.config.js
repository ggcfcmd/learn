// const postcssPresetEnv = require('postcss-preset-env');
const postcssGlobalData = require('@csstools/postcss-global-data');
const path = require("path");   // 做路径处理的node库

module.exports = {
    plugins: [
        // postcssPresetEnv(),
        postcssGlobalData({
           files: [
            './variable.css'
           ]
        })
    ]
}