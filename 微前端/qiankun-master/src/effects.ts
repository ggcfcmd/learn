/**
 * @author Kuitos
 * @since 2019-02-19
 */
import { getMountedApps, navigateToUrl } from 'single-spa';

const firstMountLogLabel = '[qiankun] first app mounted';
if (process.env.NODE_ENV === 'development') {
  console.time(firstMountLogLabel);
}

/**
 * 设置主应用启动后默认进入的子应用
 * 利用的是 single-spa 的 single-spa:no-app-change 事件，该事件在所有子应用状态变更之后（执行完mounted）触发
 * @export
 * @param {string} defaultAppLink
 */
export function setDefaultMountApp(defaultAppLink: string) {
  // can not use addEventListener once option for ie support
  // 事件触发时所有子应用已经挂载完成，只监听一次，以达到初始化的目的
  window.addEventListener('single-spa:no-app-change', function listener() {
    const mountedApps = getMountedApps();
    if (!mountedApps.length) {
      // single-spa api 通过触发window.location.hash 或者 pushState 更改路由，切换子应用
      navigateToUrl(defaultAppLink);
    }
    // 触发一次之后，就移除该事件的监听函数，后续的路由切换（事件触发）时不再响应
    window.removeEventListener('single-spa:no-app-change', listener);
  });
}

export function runDefaultMountEffects(defaultAppLink: string) {
  console.warn(
    '[qiankun] runDefaultMountEffects will be removed in next version, please use setDefaultMountApp instead',
  );
  setDefaultMountApp(defaultAppLink);
}

/**
 * 第一个子应用 mount 后需要调用的方法，比如开启一些监控或者埋点脚本
 * 同样利用 single-spa 的 single-spa:first-mount 事件，当第一个子应用挂载以后会触发
 * @export
 * @param {() => void} effect
 */
export function runAfterFirstMounted(effect: () => void) {
  // can not use addEventListener once option for ie support
  window.addEventListener('single-spa:first-mount', function listener() {
    if (process.env.NODE_ENV === 'development') {
      console.timeEnd(firstMountLogLabel);
    }

    effect();
    // 只执行一次，触发后移除
    window.removeEventListener('single-spa:first-mount', listener);
  });
}
