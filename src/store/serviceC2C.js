import { createStore } from "vuex";

export default createStore({
  state: {
    orderNo: "",
    isConnected: false,
    messageList: [],
    unreadMessage: {},
    isOpenningWindow: {},
  },
  getters: {},
  mutations: {
    setIsOpenningWindow(state, id) {
      state.isOpenningWindow[id] = true;
    },
    setClosedWindow(state, id) {
      state.isOpenningWindow[id] = false;
    },
    setUnreadMessage(state, id) {
      if (state.unreadMessage[id] == undefined) state.unreadMessage[id] = 0;
      else state.unreadMessage[id] = state.unreadMessage[id] + 1;
    },
    removeUnreadMessage(state, id) {
      state.unreadMessage[id] = state.unreadMessage[id] - 1;
    },
    setClearUnreadMessage(state, id) {
      state.unreadMessage[id] = -1;
    },
    setOrderNo(state, orderNo) {
      state.orderNo = orderNo;
    },
    setConnected(state, status) {
      state.isConnected = status;
    },
    setSelectMessageStatus(state, status) {
      state.isSelectMessage = status;
    },
    setMessageList(state, arr) {
      state.messageList = arr;
    },
    pushMessageList(state, obj) {
      state.messageList.push(obj);
    },
  },
}
) 