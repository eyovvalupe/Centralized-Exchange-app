import { computed } from 'vue';
import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import {
  _listAccount,
  _notifiJoinList,
  _notifiList,
  _sessionToken,
  _userinfo,
} from '@/api/api';
import assets from './assets';
import market from './market';
import trade from './trade';
import follow from './follow';
import finance from './finance';
import serviceC2C from './serviceC2C';
import { getStaticImgUrl } from '@/utils/index.js';
import { useSocket } from '@/utils/ws';
import { _referralData } from '../api/api';

// 这几个数据需要缓存 但不缓存其中的 points 字段
const onlySaveSymbols = [
  'currStockItem',
  'currConstact',
  'currAi',
  'currForeign',
  'currCommodities',
];
const onlySaveSymbolsList = ['realtimeData'];

const store = createStore({
  state: {
    fullscreen: false, // 是否是全屏状态
    pageLoading: true, // 页面加载状态
    theme: '',
    transitionName: '', // 页面过渡动画名字
    token: '',
    userInfo: {}, // 用户详情
    guestUserInfo: {}, //模拟账户详情
    selectedPayment: 0,
    accountList: [], // 收款方式列表
    sessionToken: '', // 关键请求token
    isLoginOpen: false, // 登录弹窗开关
    notifiData: JSON.parse(sessionStorage.getItem('notifiData')),
    notifiOpen: false,
    notifiList: [],
    notifiJoinList: [],
    notifiDetailItem: JSON.parse(sessionStorage.getItem('notifiDetailItem')),
    referralInfo: {},
    i18Data: {
      name: '中文简体',
      locale: 'zh',
      icon: getStaticImgUrl('/static/img/common/cn.svg'),
    },
    language: {},
    bottomTabBarValue: '',
    showSuccessToast: false,
    isSentCodeError: false,
    showLeftMenu: false,
    successToastText: '',
    showRightMenu: false,
    showOrderList: false,
    ...market.state,
    ...trade.state,
    ...assets.state,
    ...serviceC2C.state,
    ...follow.state,
    ...finance.state,
  },
  mutations: {
    setShowOrderList(state, data) {
      state.showOrderList = data
    },
    setShowRightMenu(state, data) {
      state.showRightMenu = data
    },
    setSuccessToastText(state, data) {
      state.successToastText = data
    },
    setGuestUserInfo(state, data) {
      state.guestUserInfo = data
    },
    setShowLeftMenu(state, data) {
      state.showLeftMenu = data
    },
    setReferralInfo(state, data) {
      state.referralInfo = data;
    },
    setNotifiJoinList(state, data) {
      state.notifiJoinList = data;
    },
    setNotifiDetailItem(state, data) {
      state.notifiDetailItem = data;
    },
    setNotifiList(state, data) {
      state.notifiList = data;
    },
    setNotifiOpen(state, data) {
      state.notifiOpen = data;
    },
    setNotifiData(state, data) {
      state.notifiData = data;
    },
    setLanguage(state, data) {
      state.language = data;
    },
    setIsSentCodeError(state, data) {
      state.isSentCodeError = data;
    },
    setSelectedPayment(state, data) {
      state.selectedPayment = data;
    },
    setFullscreen(state, data) {
      state.fullscreen = data;
    },
    setPageLoading(state, data) {
      state.pageLoading = data;
    },
    setTheme(state, data) {
      state.theme = data;
    },
    setTransitionName(state, data) {
      state.transitionName = data;
    },
    setToken(state, data) {
      state.token = data;
    },
    setUserInfo(state, data) {
      state.userInfo = data;
    },
    setAccountList(state, data) {
      state.accountList = data;
    },
    setSessionToken(state, data) {
      state.sessionToken = data;
    },
    setIsLoginOpen(state, data) {
      state.isLoginOpen = data;
    },
    setI18Data(state, data) {
      state.i18Data = data;
    },
    setBottomTabBarValue(state, data) {
      state.bottomTabBarValue = data;
    },
    setShowSuccessToast(state, data) {
      state.showSuccessToast = data;
    },
    ...market.mutations,
    ...trade.mutations,
    ...assets.mutations,
    ...serviceC2C.mutations,
    ...follow.mutations,
    ...finance.mutations,
  },
  actions: {
    reset({ commit }) {
      try {
        useSocket().disConnect();
      } catch { }
      setTimeout(() => {
        console.log("reset")
        // 重置相关数据
        commit('setToken', '');
        commit('setUserInfo', {});
        commit('setMarketWatchList', []);
        commit('setPositionsList', []);
        commit('setContractPositionsList', []);
        commit('setAiPositionsList', []);
        commit('setIpoDataList', []);
        commit('setIpoStockList', []);
        commit('setInquireList', []);
        commit('setContractInquireList', []);
        commit('setAiInquireList', []);
        commit('setMyCopy', []);
        commit('setMyCopyData', []);
        commit('setNotifiJoinList', []);
        commit('setReferralInfo', {});
      }, 100);
      // commit('setMarketSearch', {
      //   search: '',
      //   market: '',
      //   list: []
      // })
    },
    updateReferralInfo({ commit }) {
      //推荐用户
      return new Promise((resolve) => {
        _referralData()
          .then((res) => {
            if (res.code == 200 && res.data) {
              console.log("referral info ========> ", res.data)
              commit('setReferralInfo', res.data || {});
              resolve(res.data);
            } else {
              resolve(false);
            }
          })
          .catch(() => resolve(false));
      });
    },
    updateUserInfo({ commit }) {
      // 更新个人信息
      return new Promise((resolve) => {
        _userinfo()
          .then((res) => {
            // console.error('--用户信息', res.data)
            if (res.code == 200 && res.data) {
              res.data.kycl2 = res.data.kyc || res.data.kycl2;
              commit('setUserInfo', res.data || {});
              resolve(res.data);
            } else {
              resolve(false);
            }
          })
          .catch(() => resolve(false));
      });
    },
    updateAccountList({ commit }) {
      // 更新收款方式列表
      return new Promise((resolve) => {
        _listAccount()
          .then((res) => {
            if (res.code == 200 && res.data) {
              commit('setAccountList', res.data || {});
              resolve(res.data);
            } else {
              resolve(false);
            }
          })
          .catch(() => resolve(false));
      });
    },
    updateSessionToken({ commit }) {
      // 更新sessionToken
      return new Promise((resolve) => {
        _sessionToken()
          .then((res) => {
            if (res.code == 200 && res.data) {
              commit('setSessionToken', res.data || '');
              resolve(res.data);
            } else {
              resolve(false);
            }
          })
          .catch(() => resolve(false));
      });
    },
    updateNotifiList({ commit }) {
      return new Promise((resolve) => {
        _notifiList({ page: 1 })
          .then((res) => {
            if (res.code == 200 && res.data) {
              commit('setNotifiList', res.data);
              resolve(res.data);
            } else {
              resolve(false);
            }
          })
          .catch(() => resolve(false));
      });
    },
    updateNotifiJoinList({ commit }) {
      return new Promise((resolve) => {
        _notifiJoinList({ page: 1 })
          .then((res) => {
            if (res.code == 200 && res.data) {
              commit('setNotifiJoinList', res.data);
              resolve(res.data);
            } else {
              resolve(false);
            }
          })
          .catch(() => resolve(false));
      });
    },
    ...market.actions,
    ...trade.actions,
    ...assets.actions,
    ...serviceC2C.actions,
    ...follow.actions,
  },
  getters: {
    ...assets.getters,
    ...market.getters,
    ...serviceC2C.getters,
    ...follow.getters,
  },
  plugins: [
    createPersistedState({
      key: 'sunx',
      paths: ['token', 'userInfo', ...onlySaveSymbols, ...onlySaveSymbolsList],
      // storage: window.localStorage,
      // setState: (path, state) => {
      //   onlySaveSymbols.forEach(key => { // 这几个数据只缓存symbol字段
      //     if (state[key]) {
      //       delete state[key].points
      //     }
      //   })
      //   onlySaveSymbolsList.forEach(key => {
      //     if (state[key] && state[key].length) {
      //       state[key].map(item => {
      //         delete item.points
      //       })
      //     }
      //   })
      //   window.localStorage.setItem(path, JSON.stringify(state));
      // }
    }),
  ],
});
export const useMapState = (arr) => {
  if (!Array.isArray(arr)) return new Error('useMapState参数必须为数组');
  const result = arr.reduce((acc, cur) => {
    acc[cur] = computed(() => store.state[cur]);
    return acc;
  }, {});
  return result;
};
export default store;
