import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: "[hash].[name].[ext]",
      },
    },
  },
  plugins: [
    {
      config(options) {
        // console.log("config options 执行", options);
      },
      configureServer(server) {},
      transformIndexHtml(html) {},
      configResolved(options) {
        // 整个配置文件的解析流程完全完毕之后会走的钩子
        // console.log("options log: ", options);
      },
      // universal hooks 通用hooks 即vite和rollup都会关注的hooks
      options(rollupOptions) {
        console.log("rollupOptions", rollupOptions);
      },
      buildStart(fullRollupOptions) {
        console.log("fullRollupOptions", fullRollupOptions);
      },
    },
  ],
});
