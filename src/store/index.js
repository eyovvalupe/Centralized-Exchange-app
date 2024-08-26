import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

import {
  _userinfo,
  _listAccount,
  _sessionToken,
} from "@/api/api";
import router from "@/router/index";
import market from './market'
import trade from './trade'
import assets from "./assets";

export default createStore({
  state: {
    fullscreen: false, // 是否是全屏状态
    pageLoading: true, // 页面加载状态
    theme: '',
    transitionName: '', // 页面过渡动画名字
    token: "",
    userInfo: {}, // 用户详情
    accountList: [], // 收款方式列表
    sessionToken: '', // 关键请求token
    ...market.state,
    ...trade.state,
    ...assets.state,
  },
  mutations: {
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
    ...market.mutations,
    ...trade.mutations,
    ...assets.mutations,
  },
  actions: {
    reset({ commit }) { // 重置相关数据
      commit("setToken", "");
      commit("setUserInfo", {});
      commit("setMarketWatchList", []);
      commit('setMarketSearch', {
        search: '',
        list: []
      })
    },
    updateUserInfo({ commit }) {
      // 更新个人信息
      return new Promise((resolve) => {
        _userinfo()
          .then((res) => {
            // console.error('--用户信息', res.data)
            if (res.code == 200 && res.data) {
              commit("setUserInfo", res.data || {});
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
              commit("setAccountList", res.data || {});
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
              commit("setSessionToken", res.data || '');
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
  },
  plugins: [createPersistedState({
    key: 'sunx'
  })],
});
