import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import Home from "../views/Home/Home.vue";

const routes = [
  { // 首页
    path: "/",
    name: "home",
    component: Home,
    meta: {
      keepAlive: true,
      pageType: 'tab'
    }
  },
  { // 用户
    path: "/user",
    name: "user",
    component: () => import("../views/User/User.vue"),
    meta: {
      keepAlive: true,
      pageType: 'tab'
    }
  },
  { // 市场
    path: "/market",
    name: "market",
    component: () => import("../views/Market/Market.vue"),
    meta: {
      keepAlive: true,
      pageType: 'tab'
    }
  },
  { // 搜索
    path: "/search",
    name: "search",
    component: () => import("../views/Market/Search.vue"),
    meta: {
      keepAlive: false,
      pageType: 'child'
    }
  },
  { // 市场详情
    path: "/market_info",
    name: "market_info",
    component: () => import("../views/Market/MarketInfo.vue"),
    meta: {
      keepAlive: false,
      pageType: 'child'
    }
  },
  {
    // 登录
    path: "/login",
    name: "login",
    component: () => import("../views/Public/Login.vue"),
    meta: {
      keepAlive: false,
      pageType: 'login'
    }
  },
  {
    // 注册
    path: "/register",
    name: "register",
    component: () => import("../views/Public/Register.vue"),
    meta: {
      keepAlive: false,
      pageType: 'login'
    }
  },
  {
    // 语言
    path: "/language",
    name: "language",
    component: () => import("../views/Public/Language.vue"),
    meta: {
      keepAlive: false,
      pageType: 'child'
    }
  },
  {
    // 交易
    path: "/trade",
    name: "trade",
    component: () => import("../views/trade/trade.vue"),
    meta: {
      keepAlive: false,
      pageType: 'tab'
    }
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


router.beforeEach((to, from) => {
  if (from.meta.pageType == "tab" && to.meta.pageType == "child") {
    store.commit('setTransitionName', 'slide-right')
    return;
  }

  if (from.meta.pageType == "child" && to.meta.pageType == "tab") {
    store.commit('setTransitionName', 'slide-left')
    return;
  }

  if (from.meta.pageType == "child" && to.meta.pageType == "child") {
    store.commit('setTransitionName', 'slide-right')
    return;
  }



  if (to.meta.pageType == "login") {
    store.commit('setTransitionName', 'slide-bottom')
    return;
  }
  if (from.meta.pageType == "login") {
    store.commit('setTransitionName', 'slide-top')
    return;
  }


  store.commit('setTransitionName', '')
  // if ((from.meta.pageType == "tab" && to.meta.pageType == "tab") || (from.meta.pageType != "tab" && to.meta.pageType != "tab")) {
  //   if (to.meta.index > from.meta.index) {
  //     // 从右往左动画
  //     transitionName.value = 'slide-left';
  //   } else if (to.meta.index < from.meta.index) {
  //     // 从左往右动画
  //     transitionName.value = 'slide-right';
  //   } else {
  //     transitionName.value = '';
  //   }
  // }
})

export default router;
