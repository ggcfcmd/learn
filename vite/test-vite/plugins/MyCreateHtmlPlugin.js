module.exports = (options) => {
    return {
        // transformIndexHtml是用来转换index.html的专用钩子
        transformIndexHtml: {
            enforce: "pre",
            transform: (html, ctx) => {
                // ctx 表示当前整个请求的一个执行期上下文
                console.log('html log: ', html);
    
                return html.replace(/<%= title %>/g, options.inject.data.title);
            }
        }
    }
}