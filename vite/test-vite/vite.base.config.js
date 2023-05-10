import { defineConfig } from "vite";

// 在 defineConfig 内部配置会获得配置项的语法提示
export default defineConfig({
    optimizeDeps: {
        exclude: ['lodash-es'],    // 当遇到 lodash-es 这个依赖的时候不进行依赖预构建
    },
    envPrefix: 'SZN_'
})