import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home/Home.vue";
import { KeepAlive } from "vue";

const routes = [
  { // 首页
    path: "/",
    name: "home",
    component: Home,
    meta: {
      keepAlive: true
    }
  },
  { // 用户
    path: "/user",
    name: "user",
    component: () => import("../views/User/User.vue"),
    meta: {
      keepAlive: true
    }
  },
  {
    // 登录
    path: "/login",
    name: "login",
    component: () => import("../views/Public/Login.vue"),
  },
  {
    // 找不到路由时
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
