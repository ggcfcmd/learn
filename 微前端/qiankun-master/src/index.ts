/**
 * @author Kuitos
 * @since 2019-04-25
 */
/***
 * 在示例或官网提到的所有API都在这里统一导出
 */
// 最关键的三个，手动加载微应用、注册微应用、启动qiankun
export { loadMicroApp, registerMicroApps, start } from './apis';
// 全局状态
export { initGlobalState } from './globalState';
export { getCurrentRunningApp as __internalGetCurrentRunningApp } from './sandbox';
// 全局的未捕获异常处理器
export * from './errorHandler';
// setDefaultMountApp 设置主应用启动后默认进入哪个微应用
// runAfterFirstMounted 设置当第一个微应用挂载以后需要调用的一些方法
export * from './effects';
// 类型定义
export * from './interfaces';
// prefetch
export { prefetchImmediately as prefetchApps } from './prefetch';
