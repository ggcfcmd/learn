import { defineConfig, loadEnv } from "vite";
import viteBaseConfig from "./vite.base.config";
import viteDevConfig from "./vite.dev.config";
import viteProdConfig from "./vite.prod.config";

// 策略模式
const envResolver = {
    'build': () => {
        console.log('生产环境');
        return ({...viteBaseConfig, ...viteProdConfig});
    },
    'serve': () => {
        console.log('开发环境');
        return ({...viteBaseConfig, ...viteDevConfig});
    }
}

// command: 'build' 生产环境 | 'serve' 开发环境
export default defineConfig(({ command, mode }) => {
    const commonEnv = loadEnv('', process.cwd(), '');
    const env = loadEnv(mode, process.cwd(), '');
    console.log('mode log: ', mode);
    // console.log('env log: ', commonEnv);
    // console.log('env log: ', env);
    return envResolver[command]();
});

// 使用 @type 导入也可以让 vscode 知道当前类型，进而获得语法提示
/** @type import("vite").UserConfig */
// const viteConfig = {
//     optimizeDeps: {
//         exclude: []
//     }
// }

