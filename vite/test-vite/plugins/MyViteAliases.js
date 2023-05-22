const fs = require("fs");
const path = require("path");

// vite 的插件必须返回给 vite 一个配置对象

// 区分当前文件下的目录和文件
function diffDirAndFile(dirFilesArr = [], basePath = '') {
    const result = {
        dirs: [],
        files: []
    };
    // console.log('dirFilesArr log: ', dirFilesArr);
    dirFilesArr.forEach(name => {
        const currentFileStat = fs.statSync(path.resolve(__dirname, basePath + '/' + name));
        // console.log('current file stat', name, currentFileStat.isDirectory());

        // 判断是否为目录
        const isDirectory = currentFileStat.isDirectory();
        isDirectory ? result.dirs.push(name) : result.files.push(name); 
    })

    return result;
}

// 获取当前目录下的所有内容
function getTotalSrcDir(keyName) {
    const result = fs.readdirSync(path.resolve(__dirname, '../src'));
    const diffResult = diffDirAndFile(result, '../src');
    // console.log('diffResult log: ', diffResult);
    const resolveAliasesObj = {};
    diffResult.dirs.forEach(dirname => {
        const key = `${keyName}${dirname}`;
        const absPath = path.resolve(__dirname, '../src' + '/' + dirname);
        // console.log('key', key);
        resolveAliasesObj[key] = absPath;
    });

    return resolveAliasesObj;
}

module.exports = ({keyName = '@'} = {}) => {
    return {
        config(config, env) {
            // 此处将配置文件传入，还没有执行
            // console.log('config log :', config, env);
            // config: 目前的配置对象
            // env: { mode: string, command: string }
            // config 函数可以返回一个对象，这个对象是部分（就是你想改的那部分）的 viteconfig 配置
            const resolveAliasesObj = getTotalSrcDir(keyName);
            return {
                resolve: {
                    alias: resolveAliasesObj
                }
            }
            // console.log('result log: ', result);
        },
    }
}
