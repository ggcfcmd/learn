/**
 * @author dbkillerf6
 * @since 2020-04-10
 */

import { cloneDeep } from 'lodash';
import type { OnGlobalStateChangeCallback, MicroAppStateActions } from './interfaces';

let globalState: Record<string, any> = {};

const deps: Record<string, OnGlobalStateChangeCallback> = {};

// 触发全局监听
function emitGlobal(state: Record<string, any>, prevState: Record<string, any>) {
  Object.keys(deps).forEach((id: string) => {
    if (deps[id] instanceof Function) {
      deps[id](cloneDeep(state), cloneDeep(prevState));
    }
  });
}

// 定义全局状态，并返回通信方法，通常由主应用调用，子应用通过props获取通信方法
export function initGlobalState(state: Record<string, any> = {}) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[qiankun] globalState tools will be removed in 3.0, pls don't use it!`);
  }

  if (state === globalState) {
    console.warn('[qiankun] state has not changed！');
  } else {
    const prevGlobalState = cloneDeep(globalState);
    globalState = cloneDeep(state);
    // 触发全局监听，当然在这个位置调用，正常情况下没啥反应，因为现在还没有应用注册回调函数，prevGlobalState为空时表示第一次调用initGlobalState()方法
    emitGlobal(globalState, prevGlobalState);
  }
  // 返回通信方法
  return getMicroAppStateActions(`global-${+new Date()}`, true);
}

/**
 *
 * @export
 * @param {string} id 应用id
 * @param {boolean} [isMaster] 标明当前是否是主应用调用，
 * @returns {MicroAppStateActions}
 */
export function getMicroAppStateActions(id: string, isMaster?: boolean): MicroAppStateActions {
  return {
    /**
     * onGlobalStateChange 全局依赖监听
     *
     * 收集 setState 时所需要触发的依赖
     *
     * 限制条件：每个子应用只有一个激活状态的全局监听，新监听覆盖旧监听，若只是监听部分属性，请使用 onGlobalStateChange
     *
     * 这么设计是为了减少全局监听滥用导致的内存爆炸
     *
     * 依赖数据结构为：
     * {
     *   {id}: callback
     * }
     *
     * @param callback 注册的回调函数
     * @param fireImmediately 是否立即执行回调
     */
    onGlobalStateChange(callback: OnGlobalStateChangeCallback, fireImmediately?: boolean) {
      // 回调函数必须为function
      if (!(callback instanceof Function)) {
        console.error('[qiankun] callback must be function!');
        return;
      }
      // 如果回调函数已经存在，重复注册时给出覆盖提示信息
      if (deps[id]) {
        console.warn(`[qiankun] '${id}' global listener already exists before this, new listener will overwrite it.`);
      }
      deps[id] = callback;
      // 按需要立即执行回调
      if (fireImmediately) {
        const cloneState = cloneDeep(globalState);
        callback(cloneState, cloneState);
      }
    },

    /**
     * setGlobalState 更新 store 数据
     *
     * 1. 对输入 state 的第一层属性做校验，如果是主应用则可以添加新的一级属性进来，也可以更新已存在的一级属性，子应用的话只能更改现有的
     * 一级属性，不能新增一级属性
     * 2. 触发全局监听，执行所有应用注册的回调函数，已达到应用间通信的目的
     *
     * @param state
     */
    setGlobalState(state: Record<string, any> = {}) {
      if (state === globalState) {
        console.warn('[qiankun] state has not changed！');
        return false;
      }

      const changeKeys: string[] = [];
      // 旧的全局状态
      const prevGlobalState = cloneDeep(globalState);
      globalState = cloneDeep(
        // 循环遍历新状态中所有的key
        Object.keys(state).reduce((_globalState, changeKey) => {
          // 主应用或者当前key属于旧的全局状态 只有主应用才可以新增属性，子应用只能更改已存在的属性值，并且主、子应用只能操作一级属性
          if (isMaster || _globalState.hasOwnProperty(changeKey)) {
            // 记录被改变的key
            changeKeys.push(changeKey);
            // 在旧状态中 新增/修改 当前key
            return Object.assign(_globalState, { [changeKey]: state[changeKey] });
          }
          console.warn(`[qiankun] '${changeKey}' not declared when init state！`);
          return _globalState;
        }, globalState),
      );
      if (changeKeys.length === 0) {
        console.warn('[qiankun] state has not changed！');
        return false;
      }
      // 触发全局监听
      emitGlobal(globalState, prevGlobalState);
      return true;
    },

    // 注销该应用下的依赖
    offGlobalStateChange() {
      delete deps[id];
      return true;
    },
  };
}
