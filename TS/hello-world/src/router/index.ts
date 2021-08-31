import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue'
Vue.use(Router);

export enum RoutePath {
    Index = '/',
    About = '/about',
    User = '/user'
}

const routes: RouteConfig[] = [
    {
        path: RoutePath.Index,
        component: Home,
    }, {
        path: RoutePath.About,
        component: () => import('../views/About.vue'),
    }, {
        path: RoutePath.User,
        component: () => import('../views/User.vue'),
    }
]

const router = new Router({
    mode: 'history',
    routes,
})

export default router;