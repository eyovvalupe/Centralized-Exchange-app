import storeChat from "@/store/chat";
import storeUser from "@/store/index";
import storeC2C from "@/store/serviceC2C";
import { CHAT_WEBSOCKET } from "@/config.js";
import io from "socket.io-client";
import store from "@/store";
class Service {
  constructor() {
    this.socket = null;
    this.socketNum = null;
    this.socketC2C = null;
    this.isConnected = false;
  }
  init() {
    if (!this.socket) {
      const token = storeUser.state.token;
      const nologinid = storeChat.getters.getNologinid;
      const URL = CHAT_WEBSOCKET + "/support";
      const query = { nologinid };
      if (token) {
        query.auth = token;
      }
      this.socket = io.connect(URL, {
        transports: ["websocket"],
        reconnectionDelayMax: 10000,
        query,
      });
      this.socket.on("connect", () => {
        this.isConnected = true;
        storeChat.commit("setConnected", this.isConnected);
        console.log("support连接成功");
      });

      this.socket.on("disconnect", () => {
        console.log("连接断开");
        this.isConnected = false;
        storeChat.commit("setConnected", this.isConnected);
      });
      this.socket.on("receive", (message) => {
        console.log(message);
        const arr = message.data || [];
        storeChat.commit("setNewMessageList", arr);
      });
      this.socket.on("delmsg", (msgIDs) => {
        console.log(msgIDs);
        const toDelMsgIDList = msgIDs.split(",");
        const messageList = computed(() => storeChat.getters.getMessageList);
        storeChat.commit(
          "setMessageList",
          messageList.filter((ml) => !toDelMsgIDList.includes(ml.id))
        );
      });
    }
  }
  initNum() {
    if (!this.socketNum) {
      const token = storeUser.state.token;
      const nologinid = storeChat.getters.getNologinid;
      const URL = CHAT_WEBSOCKET + "/msgapi";
      const query = { nologinid };
      if (token) {
        query.auth = token;
      }
      this.socketNum = io.connect(URL, {
        transports: ["websocket"],
        reconnectionDelayMax: 10000,
        query,
      });
      this.socketNum.on("connect", () => {
        console.log("连接成功");
      });

      this.socketNum.on("disconnect", () => {
        console.log("连接断开");
      });
      this.socketNum.on("receive", (message) => {
        const num = message.data.num;
        storeChat.commit("setMessageNum", num);
        console.log("接收成功");
      });
    }
  }

  subscribe(orderNo) {
    this.socketC2C.emit('subscribe', orderNo)
  }

  initc2c() {
    if (!this.socketC2C) {
      const WS_API = `${CHAT_WEBSOCKET}/c2cmsg`;
      const query = {
        auth: store.state.token,
      };
      this.socketC2C = io(WS_API, {
        transports: ["websocket"],
        reconnectionDelayMax: 10000,
        query,
      });
      this.socketC2C.on("connect", () => {
        this.isConnected = true;
        console.log("c2c 连接成功");
      });

      this.socketC2C.on("disconnect", () => {
        console.log("C2C 连接断开");
        this.isConnected = false;
      });
      this.socketC2C.on("receive", (message) => {
        console.log('received message =========> ', message.data[0]['order_no'])
        console.log(message.data)
        storeC2C.commit('setUnreadMessage', message.data[0]['order_no'])
        const arr = message.data
        if (storeC2C.state.messageList.length) {
          const index = storeC2C.state.messageList.findIndex(fitem => fitem.isTmp)
          if (index !== -1 && arr[0].type == 'img') {
            storeC2C.state.messageList.splice(index, 1)
          }
          storeC2C.commit('pushMessageList', ...arr)
        } else {
          storeC2C.commit('setMessageList', arr)
        }
      });
    }
  }

  // 发送消息
  sendMessage(type, message) {
    console.log(message);
    if (!this.socket) {
      console.warn("Socket is not initialized.");
      return;
    }
    try {
      this.socket.emit(type, JSON.stringify(message));
    } catch (e) {
      console.error("Failed to send message", e);
      throw e;
    }
  }

  sendC2CMessage(message) {
    console.log(message);
    if (!this.socketC2C) {
      console.warn('Socket is not initialized.');
      return;
    }
    try {
      this.socketC2C.emit("apisend", JSON.stringify(message));
    } catch (e) {
      console.error('Failed to send message', e);
      throw e;
    }
  }

  // 断开
  destroy() {
    this.isConnected = false;
    if (this.socket) {
      this.socket.off(); // 移除所有监听器
      this.socket.disconnect();
      this.socket = null;
    }
  }
  destroyNum() {
    if (this.socketNum) {
      this.socketNum.off(); // 移除所有监听器
      this.socketNum.disconnect();
      this.socketNum = null;
    }
  }
}
export const serviceChat = new Service();
