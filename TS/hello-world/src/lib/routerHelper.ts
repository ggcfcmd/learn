import { Dictionary } from 'vue-router/types/router';
import Router, { RoutePath } from '../router';

export type BaseRouteType = Dictionary<string>;    // { string: string }

// vue中对路由参数最基本的约束：value是string类型

export interface IndexParam extends BaseRouteType {
    name: string;
}

export interface AboutParam extends BaseRouteType {
    testName: string;
}

export interface UserParam extends BaseRouteType {
    userId: string;
}

export interface ParamMap {
    [RoutePath.Index]: IndexParam;
    [RoutePath.About]: AboutParam;
    [RoutePath.User]: UserParam;
}

export class RouterHelper {
    public static replace<T extends RoutePath>(routePath: T, params: ParamMap[T]) {
        Router.replace({
            path: routePath,
            query: params
        })
    }

    public static push<T extends RoutePath>(routePath: T, params: ParamMap[T]) {
        Router.push({
            path: routePath,
            query: params
        })
    }
}