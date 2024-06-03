import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

import {
  memberInfo,
} from "@/api/api";
import router from "@/router/index";

export default createStore({
  state: {
    theme: '',
    transitionName: '', // 页面过渡动画名字
    token: "",
    userInfo: {}, // 用户详情
  },
  mutations: {
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
  },
  actions: {
    reset({ commit }) {
      commit("setToken", "");
      commit("setUserInfo", {});
    },
    updateUserInfo({ commit }) {
      // 更新个人信息
      return new Promise((resolve) => {
        memberInfo()
          .then((res) => {
            if (res.code == 200 && res.data) {
              commit("setUserInfo", res.data || {});
              resolve(res.data);
              if (res.data.id) {
                if (!res.data.loginPasswordStatus) {
                  // 去设置密码
                  router.replace({
                    name: "setPassword",
                  });
                } else if (!res.data.payPasswordStatus) {
                  // 去设置支付密码
                  router.replace({
                    name: "setPayPwd",
                  });
                }
              }
            } else {
              resolve(false);
            }
          })
          .catch(() => resolve(false));
      });
    },
  },
  plugins: [createPersistedState()],
});
