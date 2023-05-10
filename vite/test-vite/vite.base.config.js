import { defineConfig } from "vite";

const postcssPresetEnv = require("postcss-preset-env");

// 在 defineConfig 内部配置会获得配置项的语法提示
export default defineConfig({
    optimizeDeps: {
        exclude: ['lodash-es'],    // 当遇到 lodash-es 这个依赖的时候不进行依赖预构建
    },
    envPrefix: 'SZN_',
    css: {  // 对css的行为进行配置
        // modules 配置最终会交给 postcss modules
        modules: {  // 对css模块化的默认行为进行覆盖
            localsConvention: "camelCase",  // 修改生成的配置对象的key的展示形式（驼峰还是中划线形式）
            scopeBehaviour: "local", // 配置当前的css模式是模块化还是全局化 'local' | 'global' local表示开启模块化，有hash值，hash可以看做开启模块化的一个标志，其可以保证样式不被覆写；global 表示不开启模块化
            generateScopedName: "[name][local]-[hash:5]", // 生成类名的规则 支持字符串和函数格式 字符串具体字段格式规范：https://github.com/webpack/loader-utils#interpolatename；配置为函数时，其返回值就代表最终显示的类型
            // generateScopedName: (name, filename, css) => {
            //     // name: 当前css文件中的类名
            //     // filename: 当前css文件的绝对路径
            //     // css: 当前样式
            //     console.log('name: ', name, 'filename: ', filename, 'css: ', css);
            //     return `${name}-${Math.random().toFixed(5).slice(2)}`;
            // }
            // hashPrefix: 'hello',   // 字符串，会参与hash的生成，添加此配置会降低重复hash出现的概率（hash: 一个标识，很小区别的字符串生成的hash会很不一样，相同的字符串生成同样的hash值）
            // globalModulePaths: ["./component/componentA.module.css"], //    不想参与到css模块化的路径
        },
        // 配置css预处理的一些全局参数
        preprocessorOptions: {
            less: {    // 整个的配置对象都会最终给到less的执行参数（全局参数）中去 更多配置参考 https://lesscss.org/usage/#less-options
                // math: "always",  // 以何种方式处理计算 'always' 表示始终处理计算 less默认情况下只会计算被括号包裹的表达式 padding: (100px / 2) 会计算 padding: 100px / 2 则不会计算 always 情况下两者都会计算
                globalVars: {   // 全局变量
                    mainColor: 'red',
                },
            }
        },
        devSourcemap: true,   // 文件间的索引，代码如果经过压缩或编译，假设程序出错，会在编译后的位置报错，sourceMap提供一个索引，可以定位到编译前的文件位置，方便排查问题
        postcss: {
            plugins: [postcssPresetEnv()]
        }
    }
})