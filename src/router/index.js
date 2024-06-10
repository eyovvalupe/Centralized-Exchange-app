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
  { // 安全
    path: "/safety",
    name: "safety",
    component: () => import("../views/User/Safety.vue"),
    meta: {
      keepAlive: false,
      pageType: 'child'
    }
  },
  { // 修改登录密码
    path: "/password",
    name: "password",
    component: () => import("../views/User/LoginPassword.vue"),
    meta: {
      keepAlive: false,
      pageType: 'child'
    }
  },
  { // 操作成功
    path: "/success",
    name: "success",
    component: () => import("../views/User/Success.vue"),
    meta: {
      keepAlive: false,
      pageType: 'child'
    }
  },
  { // 谷歌验证码绑定
    path: "/google",
    name: "google",
    component: () => import("../views/User/Google.vue"),
    meta: {
      keepAlive: false,
      pageType: 'child'
    }
  },
  { // 谷歌验证码-已绑定
    path: "/googleCode",
    name: "googleCode",
    component: () => import("../views/User/GoogleCode.vue"),
    meta: {
      keepAlive: false,
      pageType: 'child'
    }
  },
  { // 用户认证
    path: "/kyc",
    name: "kyc",
    component: () => import("../views/User/Kyc/Index.vue"),
    meta: {
      keepAlive: false,
      pageType: 'child'
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
  { // 产品详情
    path: "/financial_info",
    name: "financial_info",
    component: () => import("../views/Market/FinancialInfo.vue"),
    meta: {
      keepAlive: false,
      pageType: 'child'
    }
  },

  { // 交易规则
    path: "/trading_rules",
    name: "trading_rules",
    component: () => import("../views/Market/TradingRules.vue"),
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
    // 忘记密码
    path: "/fogot",
    name: "fogot",
    component: () => import("../views/Public/Fogot.vue"),
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
    // 日期查询
    path: "/date",
    name: "date",
    component: () => import("../views/trade/Deta.vue"),
    meta: {
      keepAlive: false,
      pageType: 'tab'
    }
  },
  {
    // IPO 详情
    path: "/ipodetail",
    name: "ipodetail",
    component: () => import("../views/trade/IPODetail.vue"),
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
