import { handleAppError } from "./app-errors.js";

// App statuses
// 子应用注册以后的初始状态
export const NOT_LOADED = "NOT_LOADED";
// 表示正在加载子应用源代码
export const LOADING_SOURCE_CODE = "LOADING_SOURCE_CODE";
// 执行完app.loadApp，即子应用加载完以后的状态
export const NOT_BOOTSTRAPPED = "NOT_BOOTSTRAPPED";
// 正在初始化
export const BOOTSTRAPPING = "BOOTSTRAPPING";
// 执行完app.bootstrap之后的状态，表示初始化完成，处于未挂载的状态
export const NOT_MOUNTED = "NOT_MOUNTED";
// 正在挂载
export const MOUNTING = "MOUNTING";
// 挂载完成，app.mount执行完毕
export const MOUNTED = "MOUNTED";
export const UPDATING = "UPDATING";
// 正在卸载
export const UNMOUNTING = "UNMOUNTING";
export const UNLOADING = "UNLOADING";
export const LOAD_ERROR = "LOAD_ERROR";
export const SKIP_BECAUSE_BROKEN = "SKIP_BECAUSE_BROKEN";

export function isActive(app) {
  return app.status === MOUNTED;
}

// return boolean 判断当前应用是否应该被激活
export function shouldBeActive(app) {
  try {
    return app.activeWhen(window.location);
  } catch (err) {
    handleAppError(err, app, SKIP_BECAUSE_BROKEN);
    return false;
  }
}

export function toName(app) {
  return app.name;
}

export function isParcel(appOrParcel) {
  return Boolean(appOrParcel.unmountThisParcel);
}

export function objectType(appOrParcel) {
  return isParcel(appOrParcel) ? "parcel" : "application";
}
