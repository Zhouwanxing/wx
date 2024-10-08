// 引入需要的模块
import {createRouter, createWebHistory} from "vue-router";
// 下面使用了es6的对象增强写法，命名必须是routes
const routes = [
    {
        //默认展示，这是主页面路由必须加斜杠 /
        path: "/",
        component: () => import("../components/StartPage.vue"),
    },
    {
        path: "/hello",
        //路由懒加载
        component: () => import("../components/HelloWorld.vue"),
    },
    {
        path: "/gold",
        //路由懒加载
        component: () => import("../components/Gold.vue"),
    },
    {
        path: "/newGold",
        //路由懒加载
        component: () => import("../components/NewGold.vue"),
    },
    {
        path: "/initData",
        //路由懒加载
        component: () => import("../components/InitData.vue"),
    }
];

// 创建路由
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 导出路由
export default router;