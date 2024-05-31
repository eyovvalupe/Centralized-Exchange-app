import { createMsg } from "./notice";
import { BASE_SOCKET } from "../config.js";
import store from "@/store/index"
import eventBus from "./eventBus";

var ws = null;
var connect = false; // 是否已经连接
var close = false; // 是否是关闭状态


// 连接
const connectWs = () => {
  const token = store.state.token
  if (!token) return;
  if (connect || close) return;
  const userId = store.state.userInfo.id;
  console.error('ws连接: ' + `${BASE_SOCKET}/websocket/${userId}`)
  ws = new WebSocket(`${BASE_SOCKET}/websocket/${userId}`);

  ws.onopen = (res) => {
    connect = true;
    console.error("WebSocket连接已打开！", res);
  };

  ws.onerror = (res) => {
    reConnect();
    console.error("WebSocket连接打开失败，请检查！", res);
  };
  ws.onclose = (res) => {
    reConnect();
    console.error("WebSocket 已关闭！", res);
  };

  ws.onmessage = (res) => {
    const token = store.state.token;
    if (!token) return;
    let data = {};
    try {
      data = JSON.parse(res.data);
      console.error('ws:', data)
      // 回复消息时，要将id和memberId转换成字符串，不然data数据精度会丢失
      if (data.type == 99) {
        let str = res.data
        const regexPattern = /("id":)(\d+)(,)/g;
        str = str.replace(regexPattern, '"id":"$2",');
        data = JSON.parse(str);
      }
    } catch {
      console.error("ws error:", res.data);
    }
    // console.error('ws收到消息-----》', data)
    // console.error('ws消息:', data)
    // 登录提示
    if (data.type == "tryLogin") {
      eventBus.emit("tryLogin", data);
      return;
    }
    if (data.type == 26 || data.type == 27) { // 更新推送
      return
    }
    // 订单和提示消息推送
    if (data.type && data.content) {
      createMsg(data); // 消息提醒
    }
  };
};

// 重连
function reConnect() {
  connect = false;
  if (close) return;
  setTimeout(() => {
    // 5s后重连
    connectWs();
  }, 5000);
}

// 主动打开
export const openWs = () => {
  if (location.href.includes("setPayPassword")) return
  close = false;
  connectWs();
};
// 主动断开
export const closeWs = () => {
  close = true;
  try {
    ws.close();
  } catch {}
};
