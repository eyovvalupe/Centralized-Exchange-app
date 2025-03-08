import { createRouter, createWebHashHistory } from 'vue-router';
import store from '@/store';
import Home from '../views/Home/Home.vue';
import { DESKTOP_INVITE_URL } from '@/config';
import { _setTitle } from '@/utils/index';
import { computed } from 'vue';

const userInfo = computed(() => store.state.userInfo);

const routes = [
  {
    // 首页
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      keepAlive: true,
      pageType: 'tab',
      title: '首页',
    },
  },
  {
    // 跟单广场
    path: '/follow',
    name: 'follow',
    component: () => import('../views/Home/Follow/Index.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '跟单',
    },
  },
  {
    // 我的跟单
    path: '/myfollow',
    name: 'myfollow',
    component: () => import('../views/Home/Follow/MyFollow.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '跟单',
    },
  },
  {
    // 跟单详情
    path: '/followDetail',
    name: 'followDetail',
    component: () => import('../views/Home/Follow/FollowDetail.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 2,
      title: '跟单',
    },
  },
  {
    // 跟单订单详情
    path: '/followInfo',
    name: 'followInfo',
    component: () => import('../views/Home/Follow/FollowInfo.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 3,
      title: '跟单',
    },
  },
 
  {
    // 用户
    path: '/user',
    name: 'user',
    component: () => import('../views/User/NewUser.vue'),
    meta: {
      keepAlive: false,
      pageType: 'tab',
      title: '用户中心',
    },
  },
  {
    // 安全
    path: '/safety',
    name: 'safety',
    component: () => import('../views/User/Safety.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '安全中心',
    },
  },
  {
    // 修改登录密码
    path: '/password',
    name: 'password',
    component: () => import('../views/User/LoginPassword.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 2,
      title: '修改密码',
    },
  },
  {
    // 修改交易密码
    path: '/fund',
    name: 'fund',
    component: () => import('../views/User/FundPassword.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 2,
      title: '修改密码',
    },
  },
  {
    // 操作成功
    path: '/success',
    name: 'success',
    component: () => import('../views/User/Success.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 2,
      title: '成功',
    },
  },
  {
    // 谷歌验证码绑定
    path: '/google',
    name: 'google',
    component: () => import('../views/User/Google/Google.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '谷歌验证码',
    },
  },
  {
    // 谷歌验证码 - 已绑定
    path: '/googleCode',
    name: 'googleCode',
    component: () => import('../views/User/Google/GoogleCode.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 2,
      title: '谷歌验证码',
    },
  },
  {
    // 用户认证
    path: '/kyc',
    name: 'kyc',
    component: () => import('../views/User/Kyc/Index.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '用户认证',
    },
  },
  {
    // 提交成功
    path: '/submit',
    name: 'submit',
    component: () => import('../views/User/Kyc/Submit.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 2,
      title: '提交成功',
    },
  },
  {
    // 认证成功
    path: '/kycSuccess',
    name: 'kycSuccess',
    component: () => import('../views/User/Kyc/KycSuccess.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '认证成功',
    },
  },
  {
    // 收款账户
    path: '/account',
    name: 'account',
    component: () => import('../views/User/Account/Account.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '收款账户',
    },
  },
  {
    // 认证检测
    path: '/check',
    name: 'check',
    component: () => import('../views/User/Account/Check.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '',
    },
  },
  {
    // 添加银行卡
    path: '/bank',
    name: 'bank',
    component: () => import('../views/User/Account/AddAccount.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 2,
      title: '添加银行卡',
    },
  },
  {
    // 市场
    path: '/market',
    name: 'market',
    component: () => import('../views/Market/Market.vue'),
    meta: {
      keepAlive: true,
      pageType: 'tab',
      title: '市场',
    },
  },
  {
    // 安全
    path: '/deal',
    name: 'deal',
    component: () => import('../views/Market/buyCoin/Deal.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '买币',
    },
  },
  {
    // 买币-订单详情
    path: '/orderDetails',
    name: 'orderDetails',
    component: () => import('../views/Market/buyCoin/OrderDetail.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '买币',
    },
  },
  {
    // 搜索
    path: '/search',
    name: 'search',
    component: () => import('../views/Market/Search.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '搜索',
    },
  },
  {
    // 通知
    path: '/notification',
    name: 'notification',
    component: () => import('../views/Notification/Index.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '通知',
    },
  },
  {
    // 通知详情
    path: '/notification_detail',
    name: 'notification_detail',
    component: () => import('../views/Notification/Detail.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 2,
      title: '通知',
    },
  },
  {
    // 市场详情
    path: '/market_info',
    name: 'market_info',
    component: () => import('../views/Market/MarketInfo2.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 6,
      title: '详情',
    },
  },
  {
    // 产品详情
    path: '/financial_info',
    name: 'financial_info',
    component: () => import('../views/Market/FinancialInfo.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '理财',
    },
  },

  {
    // 交易规则
    path: '/trading_rules',
    name: 'trading_rules',
    component: () => import('../views/Market/TradingRules.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '交易规则',
    },
  },
  {
    // 登录
    path: '/login',
    name: 'login',
    component: () => import('../views/Public/Login.vue'),
    meta: {
      keepAlive: false,
      pageType: 'login',
      title: '登录',
    },
  },
  {
    // 忘记密码
    path: '/fogot',
    name: 'fogot',
    component: () => import('../views/Public/Fogot.vue'),
    meta: {
      keepAlive: false,
      pageType: 'login',
      title: '忘记密码',
    },
  },
  {
    // 注册
    path: '/register',
    name: 'register',
    component: () => import('../views/Public/Register.vue'),
    meta: {
      keepAlive: false,
      pageType: 'login',
      title: '注册',
    },
  },
  {
    // 注册
    path: '/safePassword',
    name: 'safePassword',
    component: () => import('../views/Public/SafePassword.vue'),
    meta: {
      keepAlive: false,
      pageType: 'login',
      title: '交易密码',
    },
  },
  {
    // 注册成功
    path: '/registerSuccess',
    name: 'registerSuccess',
    component: () => import('../views/Public/RegisterSuccess.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 2,
      title: '注册成功',
    },
  },
  {
    // 注册成功
    path: '/registerSuccess2',
    name: 'registerSuccess2',
    component: () => import('../views/Public/RegisterSuccess2.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '注册成功',
    },
  },
  {
    // 语言
    path: '/language',
    name: 'language',
    component: () => import('../views/Public/Language.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '语言',
    },
  },
  {
    // 客服
    path: '/chat',
    name: 'chat',
    component: () => import('../views/Chat/Index.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 5,
      title: '客服',
    },
  },
  {
    // 交易
    path: '/trade',
    name: 'trade',
    component: () => import('../views/Trade3/Index.vue'),
    meta: {
      keepAlive: true,
      pageType: 'tab',
      title: '市场',
    },
  },
  {
    // 交易
    path: '/tradeInfo',
    name: 'tradeInfo',
    component: () => import('../views/Trade3/Info.vue'),
    meta: {
      keepAlive: true,
      pageType: "tab",
      title: '交易'
    },
  },
  {
    // 交易订单
    path: '/tradeOrder',
    name: 'tradeOrder',
    component: () => import('../views/Trade3/Order.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '交易',
    },
  },
  {
    // 日期查询
    path: '/date',
    name: 'date',
    component: () => import('../views/trade/Deta.vue'),
    meta: {
      keepAlive: false,
      pageType: 'tab',
    },
  },
  {
    // IPO 详情
    path: '/ipodetail',
    name: 'ipodetail',
    component: () => import('../views/trade/IPODetail.vue'),
    meta: {
      keepAlive: false,
      pageType: 'tab',
      title: 'IPO',
    },
  },
  {
    // 中签 IPO 详情
    path: '/winningIPODetail',
    name: 'winningIPODetail',
    component: () => import('../views/trade/winningIPODetail.vue'),
    meta: {
      keepAlive: false,
      pageType: 'tab',
      title: 'IPO',
    },
  },
  {
    // 资产
    path: '/assets',
    name: 'assets',
    component: () => import('../views/assets/Assets.vue'),
    meta: {
      keepAlive: true,
      pageType: 'tab',
      title: '资产',
    },
  },

  {
    // 划转
    path: '/transfer',
    name: 'transfer',
    component: () => import('../views/assets/Transfer.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 4,
      title: '划转',
    },
  },
  {
    // 划转
    path: '/transferRecord',
    name: 'transferRecord',
    component: () => import('../views/assets/TransferRecord.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '划转记录',
    },
  },
  {
    // 兑换
    path: '/swap',
    name: 'swap',
    component: () => import('../views/assets/Swap.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '兑换',
    },
  },
  {
    // 兑换记录
    path: '/swapRecord',
    name: 'swapRecord',
    component: () => import('../views/assets/SwapRecord.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '兑换记录',
    },
  },
  {
    // 借贷
    path: '/loanList',
    name: 'loanList',
    component: () => import('../views/assets/LoanList.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '借贷记录',
    },
  },
  {
    // 借贷
    path: '/loan',
    name: 'loan',
    component: () => import('../views/assets/Loan.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '借贷',
    },
  },
  {
    // 提现
    path: '/withdraw',
    name: 'withdraw',
    component: () => import('../views/assets/Withdraw.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '提现',
    },
  },
  {
    // 提现记录
    path: '/withdrawRecord',
    name: 'withdrawRecord',
    component: () => import('../views/assets/WithdrawRecord.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '提现记录',
    },
  },
  {
    // 提现详情
    path: '/withdrawInfo',
    name: 'withdrawInfo',
    component: () => import('../views/assets/WithdrawRecordInfo.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '提现',
    },
  },
  {
    // 充值
    path: '/topUp',
    name: 'topUp',
    component: () => import('../views/assets/TopUp.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 4,
      title: '充值',
    },
  },
  {
    // 充值-虚拟货币
    path: '/topUpCrypto',
    name: 'topUpCrypto',
    component: () => import('../views/assets/TopUpCrypto.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 4,
      title: '充值',
    },
  },
  {
    // 充值中
    path: '/recharging',
    name: 'recharging',
    component: () => import('../views/assets/Recharging.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '充值',
    },
  },
  {
    // 充值详情
    path: '/topUpItem',
    name: 'topUpItem',
    component: () => import('../views/assets/TopUpItem.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '充值',
    },
  },
  {
    // 充值列表
    path: '/topUpRecord',
    name: 'topUpRecord',
    component: () => import('../views/assets/TopUpRecord.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '充值记录',
    },
  },
  {
    // 充值详情
    path: '/rechargeInfo',
    name: 'rechargeInfo',
    component: () => import('../views/assets/RechargeInfo.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '充值',
    },
  },
  {
    // 记录列表
    path: '/recordList',
    name: 'recordList',
    component: () => import('../views/assets/RecordList.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 3,
      title: '记录列表',
    },
  },
  {
    // 认购
    path: '/subscription',
    name: 'subscription',
    // component: () => import("../views/trade/Subscription.vue"),
    component: () => import('../views/Market/IpoSubscription.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '认购',
    },
  },
  {
    path: '/ipo/detail',
    name: 'ipoDetail',
    component: () => import('../views/Market/IpoDetail.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 3,
      title: 'IPO',
    },
  },
  {
    path: '/ipo/orderDetail',
    name: 'ipoOrderDetail',
    component: () => import('../views/Market/IpoOrderDetail.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: 'IPO',
    },
  },
  {
    // 认购成功
    path: '/subscriptionSuccess',
    name: 'subscriptionSuccess',
    component: () => import('../views/trade/components/Success.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '认购成功',
    },
  },
  {
    // 关于
    path: '/about',
    name: 'about',
    component: () => import('../views/User/About.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '关于',
    },
  },
  {
    // 充值
    path: '/verification',
    name: 'verification',
    component: () => import('../views/assets/Verification.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '充值',
    },
  },
  {
    path: '/inviteFriends',
    name: 'inviteFriends',
    component: () => import('../views/User/InviteFriends.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '邀请好友',
    },
  },
  {
    path: '/inviteWaiting',
    name: 'inviteWaiting',
    component: () => import('../views/User/InviteWaiting.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '邀请好友',
    },
  },
  {
    path: '/finance',
    name: 'finance',
    component: () => import('../views/Finance/Index.vue'),
    meta: {
      keepAlive: false,
      pageType: 'tab',
      title: '理财',
    },
  },
  {
    path: '/stake',
    name: 'stake',
    component: () => import('../views/Finance/Trade.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '质押挖矿',
    },
  },
  {
    path: '/pledge/orderDetail',
    name: 'pledgeOrderDetail',
    component: () => import('../views/Finance/PledgeOrderDetail.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
      title: '质押挖矿',
    },
  },
  {
    path: '/stakingOrderDetail',
    name: 'stakingOrderDetail',
    component: () => import('../views/Finance/StakingOrderDetail.vue'),
    meta: {
      keepAlive: false,
      pageType: 'child',
      pageDeep: 1,
    },
  },
  {
    // 找不到路由时
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHashHistory(''),
  routes,
});

router.beforeEach((to, from) => {
  // if (
  //   userInfo.value &&
  //   userInfo.value.role == 'guest' &&
  //   [
  //     'account',
  //     'kyc',
  //     'google',
  //     'googleCode',
  //     'inviteFriends',
  //     'topUpCrypto',
  //     'withdraw',
  //     'safety',
  //   ].includes(to.name)
  // ) {
  //   return { name: 'home' };
  // }
  store.commit('setTransitionName', '');

  if (to.name == 'registerSuccess') {
    store.commit('setTransitionName', 'slide-right');
    return;
  }
  if (from.name == 'registerSuccess') {
    store.commit('setTransitionName', 'slide-left');
    return;
  }
  if (to.name == 'googleCode') {
    store.commit('setTransitionName', 'slide-right');
    return;
  }
  if (from.name == 'googleCode') {
    store.commit('setTransitionName', 'slide-left');
    return;
  }
  if (from.name == 'safety' && to.name == 'google') {
    store.commit('setTransitionName', 'slide-right');
    return;
  }
  if (to.name == 'safety') {
    store.commit('setTransitionName', 'slide-right');
    return;
  }
  if (to.query.inviteCode && to.path === '/') {
    const isBrowser =
      typeof window != 'undefined' && typeof window.document != 'undefined';

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    if (!isBrowser) {
      window.location.href = 'download-url';
      return { path: '/inviteWaiting' };
    } else if (!isMobile) {
      window.location.href =
        DESKTOP_INVITE_URL + `register?inviteCode=${to.query.inviteCode}`;
      return { path: '/inviteWaiting' };
    } else {
      return { path: '/register', query: { inviteCode: to.query.inviteCode } };
    }
  }
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
  if (from.meta.pageType == 'tab' && to.meta.pageType == 'child') {
    store.commit('setTransitionName', 'slide-right');
    return;
  }

  if (from.meta.pageType == 'child' && to.meta.pageType == 'tab') {
    store.commit('setTransitionName', 'slide-left');
    return;
  }

  if (from.meta.pageType == 'child' && to.meta.pageType == 'child') {
    if (from.meta.pageDeep < to.meta.pageDeep) {
      store.commit('setTransitionName', 'slide-right');
    } else {
      store.commit('setTransitionName', 'slide-left');
    }
    return;
  }
  if (to.meta.pageType == 'login') {
    store.commit('setTransitionName', 'slide-bottom');
    return;
  }
  if (from.meta.pageType == 'login') {
    store.commit('setTransitionName', 'slide-top');
    return;
  }
});

router.afterEach((to, from) => {
  if (to.meta?.title) {
    _setTitle(to.meta.title + ' ');
  } else {
    _setTitle(' ');
  }
});

export default router;
