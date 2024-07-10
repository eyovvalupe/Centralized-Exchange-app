
import storeChat from '@/store/chat'
import storeUser from '@/store'
import { CHAT_WEBSOCKET } from "@/config.js"
import io from 'socket.io-client'
// localStorage.debug = '*';
class Service {
  constructor() {
    this.socket = null;
    this.isConnected = false
  }
  init() {
    if (!this.socket) {
      const token = storeUser.state.token;
      const nologinid = storeChat.getters.getNologinid;
      const URL = CHAT_WEBSOCKET + '/support'
      const query = { nologinid }
      if (token) {
        query.auth = token
      }
      this.socket = io.connect(URL, {
        transports : ['websocket'],
        reconnectionDelayMax: 10000,
        query
      })
      this.socket.on('connect', () => {
        this.isConnected = true;
        storeChat.commit('setConnected', this.isConnected)
        console.log('连接成功')
      })

      this.socket.on('disconnect', () => {
        console.log('连接断开')
        this.isConnected = false
        storeChat.commit('setConnected', this.isConnected)
      })
      this.socket.on('receive', message => {
        console.log(message);
        const arr = message.data || [];
        storeChat.commit('sethasNewMessage', arr.length)
        storeChat.commit('setMessageList', arr)
      })
    }
  }
  // 发送消息
  sendMessage(type, message) {
    console.log(message);
    if (!this.socket) {
      console.warn('Socket is not initialized.');
      return;
    }
    try {
      this.socket.emit(type, JSON.stringify(message));
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
}
export const serviceChat = new Service()
