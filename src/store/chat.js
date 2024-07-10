import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { generateUUID } from '@/utils'
import {  getList } from "@/api/chat";
import storeChat from "@/store/chat"
export default createStore({
  state: {
    nologinid:null,
    isConnected: false,
    hasNewMessage: 0,
    messageList: []
  },
  getters: {
    getMessageList(state){
      return state.messageList
    },
    getNologinid(state) {
      if (!state.nologinid) {
        state.nologinid = generateUUID();
      }
      return state.nologinid
    }
  },
  mutations: {
    setConnected(state, payload){
      state.isConnected=payload;
    },
    setToken(state, token) {
      state.token = token;
    },
    sethasNewMessage(state, num){
      state.hasNewMessage = num;
    },
    setMessageList(state, arr) {
      state.hasNewMessage = arr.length;
      state.messageList = state.messageList.concat(arr);
    },
    // 历史消息
    setHistoryMsg(state,item) {
      state.messageList = item.reverse();
    },
  },
  actions: {
    updateMessage({ commit }) {
      // 更新sessionToken
      return new Promise((resolve) => {
        getList({
          nologinid:storeChat.getters.getNologinid,
          lasttime: Date.now()
        }).then((res) => {
            if (res.code == 200 && res.data) {
              commit("setHistoryMsg", res.data || '');
              resolve(res.data);
            } else {
              resolve(false);
            }
          })
          .catch(() => resolve(false));
      });
    },
  },
  plugins: [createPersistedState({
    paths:['nologinid']
  })],
});
