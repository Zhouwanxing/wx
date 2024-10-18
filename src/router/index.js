// 引入需要的模块
import {createRouter, createWebHistory} from "vue-router";
// 下面使用了es6的对象增强写法，命名必须是routes
const routes = [
    {
        //默认展示，这是主页面路由必须加斜杠 /
        path: "/",
        // component: () => import("../components/StartPage.vue"),
        component: () => import("../components/LoginOrMain.vue"),
    },
    {
        path: "/main",
        component: () => import("../components/StartPage.vue"),
    },
    {
        path: "/mp4",
        component: () => import("../components/Mp4.vue"),
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
        path: "/url",
        //路由懒加载
        component: () => import("../components/Url.vue"),
    },
    {
        path: "/newGold",
        //路由懒加载
        component: () => import("../components/NewGold.vue"),
    },
    {
        path: "/collect",
        component: () => import("../components/Collect.vue"),
    }
];

// 创建路由
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 导出路由
export default router;