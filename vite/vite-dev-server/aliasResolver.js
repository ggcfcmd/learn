module.exports = function(aliasConf, JSContent) {
    const entires = Object.entries(aliasConf);
    console.log('entires', entires);
    console.log('JSContent after toString: ', JSContent);
    let lastContent = JSContent;
    entires.forEach(entire => {
        const [alia, path] = entire;
        const srcIndex = path.indexOf('\\src');
        // alias别名最终做的就是将设置的语法糖转换为真实的文件路径（字符串替换）
        const realPath = path.slice(srcIndex, path.length);
        console.log('srcIndex log: ', srcIndex, 'realPath log: ', realPath);
        lastContent = JSContent.replace(alia, '/' + realPath);
    });
    console.log('lastContent log: ', lastContent);
    return lastContent;
}