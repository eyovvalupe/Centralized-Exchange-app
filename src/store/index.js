import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

import {
  _userinfo,
} from "@/api/api";
import router from "@/router/index";
import market from './market'
import trade from './trade'

export default createStore({
  state: {
    fullscreen: false, // 是否是全屏状态
    pageLoading: true, // 页面加载状态
    theme: '',
    transitionName: '', // 页面过渡动画名字
    token: "",
    userInfo: {}, // 用户详情
    ...market.state,
    ...trade.state
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
    ...market.mutations,
    ...trade.mutations
  },
  actions: {
    reset({ commit }) { // 重置相关数据
      commit("setToken", "");
      commit("setUserInfo", {});
      commit("setMarketWatchList", []);
    },
    updateUserInfo({ commit }) {
      // 更新个人信息
      return new Promise((resolve) => {
        _userinfo()
          .then((res) => {
            console.error('--用户信息', res.data)
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
    ...market.actions,
  },
  plugins: [createPersistedState()],
});
