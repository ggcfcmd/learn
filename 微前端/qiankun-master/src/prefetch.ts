/**
 * @author Kuitos
 * @since 2019-02-26
 */

import type { Entry, ImportEntryOpts } from 'import-html-entry';
import { importEntry } from 'import-html-entry';
import { isFunction } from 'lodash';
import { getAppStatus, getMountedApps, NOT_LOADED } from 'single-spa';
import type { AppMetadata, PrefetchStrategy } from './interfaces';

declare global {
  interface NetworkInformation {
    saveData: boolean;
    effectiveType: string;
  }
}

// RIC and shim for browsers setTimeout() without it
// 通过时间切片的方式去加载静态资源，在浏览器空闲时去执行回调函数，避免浏览器卡顿
const requestIdleCallback =
  window.requestIdleCallback ||
  function requestIdleCallback(cb: CallableFunction) {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

const isSlowNetwork = navigator.connection
  ? navigator.connection.saveData ||
    (navigator.connection.type !== 'wifi' &&
      navigator.connection.type !== 'ethernet' &&
      /([23])g/.test(navigator.connection.effectiveType))
  : false;

/**
 * prefetch assets, do nothing while in mobile network
 * @param entry
 * @param opts
 */
function prefetch(entry: Entry, opts?: ImportEntryOpts): void {
  if (!navigator.onLine || isSlowNetwork) {
    // Don't prefetch if in a slow network or offline
    return;
  }

  // 通过时间切片的方式去加载静态资源，在浏览器空闲时去执行回调函数，避免浏览器卡顿
  requestIdleCallback(async () => {
    // 得到加载静态资源的函数
    const { getExternalScripts, getExternalStyleSheets } = await importEntry(entry, opts);
    // 样式
    requestIdleCallback(getExternalStyleSheets);
    // js 脚本
    requestIdleCallback(getExternalScripts);
  });
}

// 在第一个子应用挂载之后开始加载apps中指定的子应用的静态资源
// 通过监听single-spa提供的single-spa:first-mount 事件来实现，该事件在第一个子应用挂载之后触发
function prefetchAfterFirstMounted(apps: AppMetadata[], opts?: ImportEntryOpts): void {
  // 监听 single-spa:first-mount 事件
  window.addEventListener('single-spa:first-mount', function listener() {
    const notLoadedApps = apps.filter((app) => getAppStatus(app.name) === NOT_LOADED);

    if (process.env.NODE_ENV === 'development') {
      const mountedApps = getMountedApps();
      console.log(`[qiankun] prefetch starting after ${mountedApps} mounted...`, notLoadedApps);
    }

    // 遍历预加载子应用的静态资源
    notLoadedApps.forEach(({ entry }) => prefetch(entry, opts));

    // 加载完之后移除监听 single-spa:first-mount 事件
    window.removeEventListener('single-spa:first-mount', listener);
  });
}

// 立即预加载入参数组中所有子应用的静态资源（prefetch策略为自定义函数或'all'）
export function prefetchImmediately(apps: AppMetadata[], opts?: ImportEntryOpts): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[qiankun] prefetch starting for apps...', apps);
  }
  // 遍历预加载
  apps.forEach(({ entry }) => prefetch(entry, opts));
}

/**
 * 执行预加载策略，qiankun支持四种
 * @export
 * @param {AppMetadata[]} apps 所有的微应用
 * @param {PrefetchStrategy} prefetchStrategy 预加载策略
 * 1. true 第一个子应用挂载以后加载其他子应用的静态资源，利用的是single-spa提供的single-spa:first-mount事件来实现的
 * 2. string[]，子应用名称数组，在第一个子应用挂载以后加载指定的子应用的静态资源
 * 3. all，主应用执行start以后就直接开始预加载所有子应用的静态资源
 * 4. 自定义函数，返回两个子应用组成的数组，一个是关键子应用组成的数组，需要马上执行预加载的子应用，一个是普通的子应用组成的数组，在第一个子应用挂载以后预加载这些子应用的静态资源
 * @param {ImportEntryOpts} [importEntryOpts] = { fetch, getPublicPath, getTemplate }
 */
export function doPrefetchStrategy(
  apps: AppMetadata[],
  prefetchStrategy: PrefetchStrategy,
  importEntryOpts?: ImportEntryOpts,
) {
  // 定义函数，函数接收一个子应用名称组成的数组，然后从子应用列表中返回这些名称所对应的子应用，最后得到一个数组
  const appsName2Apps = (names: string[]): AppMetadata[] => apps.filter((app) => names.includes(app.name));

  if (Array.isArray(prefetchStrategy)) {
    // 加载策略是一个数组时，当第一个子应用挂载之后开始加载数组内由用户指定的子应用的资源，数组内每一项表示一个子应用的名称
    prefetchAfterFirstMounted(appsName2Apps(prefetchStrategy as string[]), importEntryOpts);
  } else if (isFunction(prefetchStrategy)) {
    // 加载策略是一个自定义函数时，可完全自定义应用资源的加载时机（首屏应用、次屏应用）
    (async () => {
      // critical rendering apps would be prefetch as earlier as possible
      // 执行加载策略函数，会返回两个数组，一个是关键的应用程序数组，会立即执行预加载动作；另一个是在第一个子应用挂载后再去预加载静态资源的子应用列表
      const { criticalAppNames = [], minorAppsName = [] } = await prefetchStrategy(apps);
      // 立即预加载关键子应用程序的静态资源
      prefetchImmediately(appsName2Apps(criticalAppNames), importEntryOpts);
      // 第一个子应用加载完成之后再去加载的子应用的静态资源
      prefetchAfterFirstMounted(appsName2Apps(minorAppsName), importEntryOpts);
    })();
  } else {
    // 加载策略是 true 或者 'all'
    switch (prefetchStrategy) {
      case true:
        // 第一个子应用挂载后去加载其他子应用的静态资源
        prefetchAfterFirstMounted(apps, importEntryOpts);
        break;

      case 'all':
        // 主应用执行 start 之后就开始加载所有子应用的静态资源
        prefetchImmediately(apps, importEntryOpts);
        break;

      default:
        break;
    }
  }
}
