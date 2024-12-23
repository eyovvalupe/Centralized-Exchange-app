<!-- 与商家的会话 -->
<template>
  <div class="buycoin-chat">
    <div ref="listRef" class="list">
      <div class="notice_msg">
        <div class="time">{{ messageList[0]?.time }}</div>
        <div class="content">
          {{ t('market.market_buy_chat_con1') }}，{{ t('market.market_buy_chat_con2') }}
        </div>
      </div>
      <div v-for="item in messageList">
        <!-- 提示 -->
        <!-- <div class="notice_msg">
          <div class="time">2024-10-28 10:25:08</div>
          <div class="content">您已经成功下单，请耐心等候商家付款</div>
        </div> -->
        <div v-if="item.direction == 'send'">
          <div class="flex justify-end w-full items-top mt-[0.4rem]">
            <!-- 我的文本 -->

            <div v-if="item.type == 'text'" :id="`a${item.msgid}`" class="my_text_box">
              <div class="my_text break-all">{{ item.content }}</div>
              <!-- <div class="time">{{ item.time }}</div> -->
            </div>

            <!-- 我的富文本 -->
            <div v-if="item.type == 'html'" :id="`a${item.msgid}`" class="my_text_box">
              <div class="van-popover__arrow" />
              <div class="my_text" v-html="item.content" />
              <!-- <div class="time">{{ item.time }}</div> -->
            </div>

            <!-- 我的图片 -->
            <div v-if="item.type == 'img'" :id="`a${item.msgid}`" class="my_pic_box">
              <img class="my_pic" @click="preview(item.content)" :src="item.content" alt="img" />
              <!-- <div class="time">{{ item.time }}</div> -->
            </div>
            <div style="width: 0.8rem;height: 0.8rem">
              <img :src="getStaticImgUrl(`/static/icons/avatar.svg`)" alt="">
            </div>
          </div>
        </div>
        <div v-else>
          <!-- 对方文本 -->
          <div v-if="item.type == 'text'" :id="`a${item.msgid}`" class="op_text_box">
            <div class="mr-[0.2rem]">
              <div class="avatar_icon">商</div>
            </div>

            <div class="op_text">
              <div class="op_text_content break-all">{{ item.content }}</div>
              <!-- <div class="time">{{ item.time }}</div> -->
            </div>
          </div>

          <!-- 对方富文本 -->
          <div v-if="item.type == 'html'" :id="`a${item.msgid}`" class="op_text_box">
            <!-- <div class="avatar">
              {{
                props.currItem.merchant_name
                  ? props.currItem.merchant_name.slice(0, 1)
                  : ""
              }}
            </div> -->
            <div class="mr-[0.2rem]">
              <div class="avatar_icon">商</div>
            </div>
            <div class="op_text">
              <div class="van-popover__arrow" />
              <div class="op_text_content" v-html="item.content" />
              <!-- <div class="time">{{ item.time }}</div> -->
            </div>
          </div>

          <!-- 对方图片 -->
          <div v-if="item.type == 'img'" :id="`a${item.msgid}`" class="op_pic_box">
            <!-- <div class="avatar">
              {{
                props.currItem.merchant_name
                  ? props.currItem.merchant_name.slice(0, 1)
                  : ""
              }}
            </div> -->
            <div class="mr-[0.2rem]">
              <div class="avatar_icon">商</div>
            </div>
            <div class="op_pic">
              <img class="op_pic_content" :src="item.content" alt="img" />
              <!-- <div class="time">{{ item.time }}</div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="van-safe-area-bottom min-h-[2rem]"></div>
    </div>
    <div class="van-safe-area-bottom fixed inset-x-0 bottom-0 min-h-[1.64rem] bg-white">
      <div class="h-[0.02rem] w-full bg-[#EAEEF3]" />
      <div class="box px-4">
        <div class="box_icon">
          <IconSvg name="chatFile" class="text-30 text-my" />
          <input id="fileInput" class="file" type="file" accept="image/*" @change="uploadImg" />
        </div>
        <div class="item">
          <input v-model="text" type="text" class="ipt" placeholder="请输入..." />
        </div>
        <div class="box_icon" @click="sendText">
          <IconSvg name="chatSend" class="text-30 text-my" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import io from "socket.io-client";
import { ref, computed, onMounted, onBeforeUnmount, onUpdated } from "vue";
import { showToast,showImagePreview } from "vant";
import { CHAT_WEBSOCKET, UPLOAD_ADDRESS, UPLOAD_TOKEN } from "@/config";
import store from "@/store";
import { randomFileName, _compressImg } from "@/utils";
import { _fetchWithTimeout } from "@/api/upload";
import storeChat from "@/store/chat";
import { _c2cRead } from "@/api/api";
import IconSvg from "@/components/IconSvg.vue";
import serviceC2C from "@/store/serviceC2C";
import { serviceChat } from "@/utils/serviceChat";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  currItem: {
    type: Object,
    default: () => { },
  },
});
const listRef = ref();
const { y } = useScroll(listRef, {
  throttle: 200,
  behavior: "smooth",
  onScroll: scrollHandler,
});
//  聊天区域
let socket = null;
const list = ref([]);

// 发送文本消息
const text = ref("");

const messageList = computed(() => serviceC2C.state.messageList);

// 已读回执
const readLoading = ref(false);
const c2cLasttime = computed(() => store.state.c2cLasttime || {});

const sendText = () => {
  if (text.value !== "") {
    const data = {
      order_no: props.currItem.order_no,
      type: "text",
      content: text.value,
    };
    serviceChat.sendC2CMessage(data);
    console.log("sent message!!!");
    scrollToBottom();
    setTimeout(() => {
      text.value = "";
    }, 50);
  }
};
// 发送
const sendMessage = (url) => {
  if (url) {
    serviceChat.sendC2CMessage({
      order_no: props.currItem.order_no,
      type: "img",
      content: url,
    });
    scrollToBottom();
  }
};
const preview = (src)=>{
  showImagePreview([src])
}
const uploadImg = (event) => {
  const file = event.target.files[0];
  const fileName = randomFileName(file.name);
  const path = `images/${fileName}`;
  const apiUrl = `${UPLOAD_ADDRESS}${path}`;
  const reader = new FileReader();
  reader.onloadend = function () {
    let ratio = 0.5;
    const size = file.size / 1024;
    if (size < 50) {
      ratio = 1;
    } else if (size < 150) {
      ratio = 0.9;
    } else {
      ratio = 0.5;
    }
    _compressImg(reader.result, ratio, (base64Img) => {
      const base64result = base64Img.substr(base64Img.indexOf(",") + 1);
      _fetchWithTimeout(`${apiUrl}`, {
        method: "PUT",
        headers: {
          Authorization: UPLOAD_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: storeChat.getters.getNologinid,
          content: base64result,
          branch: "main",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.content && data.content.download_url) {
            sendMessage(data.content.download_url);
          } else {
            showToast(t("上传失败"));
            console.error("上传失败:", data);
          }
        })
        .catch((error) => {
          showToast(t("上传出错"));
          console.error("上传出错:", error);
        });
    });
  };
  reader.readAsDataURL(file);
};

const scrollToBottom = () => {
  // let onl;
  // const { pause } = useIntervalFn(() => {
  //   if (onl !== listRef.value.scrollHeight) {
  //     onl = listRef.value.scrollHeight;
  //     y.value = listRef.value.scrollHeight;
  //   } else {
  //     pause();
  //   }
  // }, 20);
  listRef.value.scrollTop = listRef.value.scrollHeight + 100;
};

onUpdated(() => {
  scrollToBottom();
});

function scrollHandler() {
  // 当前滚动位置 + 可视区域高度
  const div = listRef.value;
  const { scrollTop } = div;
  const { clientHeight } = div;
  // 内容的总高度
  const { scrollHeight } = div;

  // 判断是否滚动到底部
  if (scrollTop + clientHeight >= scrollHeight) {
    if (readLoading.value) return;
    readLoading.value = true;
    setTimeout(() => {
      readLoading.value = false;
    }, 2000);
    const t = Date.parse(new Date(list.value[list.value.length - 1].time));
    _c2cRead({
      order_no: props.currItem.order_no,
      lasttime: t,
    });
    c2cLasttime.value[props.currItem.order_no] = t;
    store.commit("setC2cLasttime", c2cLasttime.value);
  }
}

onMounted(() => {
  serviceChat.subscribe(props.currItem.order_no);
  serviceC2C.commit("setClearUnreadMessage", props.currItem.order_no);
  serviceC2C.commit("setIsOpenningWindow", props.currItem.order_no);

  setTimeout(() => {
    scrollToBottom();
  }, 100);
});
onBeforeUnmount(() => {
  serviceC2C.commit("setMessageList", []);
});
</script>

<style lang="less" scoped>
.buycoin-chat {
  position: relative;
  height: 100%;
  box-sizing: border-box;
  // overflow: hidden;
  // .van-popover__arrow {
  //   top: 0.32rem;
  //   margin-left: calc(var(--van-popover-arrow-size) * -1);
  //   border-left-width: 0;
  //   border-right-color: #f6f8fe;
  //   color: #f6f8fe;
  // }

  .avatar_icon {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background-color: #2068F6;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.36rem;
    font-weight: bold;
  }

  .list {
    overflow-y: auto;
    overflow-x: hidden;
    
    position: relative;
    height: 100%;

    .op_pic_box {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      margin-top: 0.4rem;

      .avatar {
        width: 0.64rem;
        height: 0.64rem;
        position: relative;
        border-radius: 50%;
        background-color: #014cfa;
        margin-right: 0.2rem;
        top: 0.05rem;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;

        .pointer {
          width: 0.16rem;
          height: 0.16rem;
          position: absolute;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          background-color: #30bf87;
        }
      }

      .op_pic {
        .op_pic_content {
          display: inline-block;
          max-width: 4rem;
          height: auto;
          background-color: #eee;
          border-radius: 0.12rem;
          margin-bottom: 0.1rem;
        }

        .time {
          font-size: 0.24rem;
          color: #aeaeae;
        }
      }

    }

    .op_text_box {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      margin-top: 0.4rem;

      .avatar {
        width: 0.64rem;
        height: 0.64rem;
        position: relative;
        border-radius: 50%;
        background-color: #014cfa;
        margin-right: 0.2rem;
        top: 0.05rem;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;

        .pointer {
          width: 0.16rem;
          height: 0.16rem;
          position: absolute;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          background-color: #30bf87;
        }
      }

      .op_text {
        position: relative;

        .van-popover__arrow {
          top: 0.2rem;
          margin-left: calc(var(--van-popover-arrow-size) * -1);
          border-left-width: 0;
          border-right-color: #f6f8fe;
          color: #f6f8fe;
        }

        .op_text_content {
          display: flex;
          align-items: center;
          // padding: 0.3rem 0.24rem;
          max-width: 4rem;
          padding: 0.2rem 0.4rem;
          height: 1rem;

          line-height: 0.4rem;
          background-color: #f6f8fe;
          color: #333;
          text-align: left;
          border-radius: 0.12rem;
          // border-top-right-radius: 0.24rem;
          // border-bottom-left-radius: 0.24rem;
          // border-bottom-right-radius: 0.24rem;
          margin-bottom: 0.1rem;

          &::before {
            content: "";
            position: absolute;
            left: -0.1rem;
            top: 0.24rem;
            width: 0;
            height: 0;
            border-left: 0 solid transparent;
            border-right: 0.14rem solid #f6f8fe;
            border-top: 0.14rem solid transparent;
            border-bottom: 0.14rem solid transparent;
          }
        }

        .time {
          font-size: 0.24rem;
          color: #aeaeae;
        }
      }
    }

    .my_pic_box {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: flex-start;

      .my_pic {
        display: inline-block;
        max-width: 4rem;
        height: auto;
        background-color: #eee;
        border-radius: 0.12rem;
        margin-bottom: 0.1rem;
      }

      .time {
        font-size: 0.24rem;
        color: #aeaeae;
      }
    }

    .my_text_box {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: flex-start;
      // margin-top: 0.4rem;
      position: relative;

      &::before {
        content: "";
        position: absolute;
        right: -0.08rem;
        top: 0.24rem;
        width: 0;
        height: 0;
        border-left: 0.14rem solid #3d65f9;
        border-right: 0 solid transparent;
        border-top: 0.14rem solid transparent;
        border-bottom: 0.14rem solid transparent;
      }

      .my_text {
        display: flex;
        align-items: center;
        padding: 0.2rem 0.4rem;
        line-height: 0.4rem;
        background-color: #3d65f9;
        color: #fff;
        text-align: left;
        max-width: 4rem;
        border-radius: 0.12rem;
        height: 1rem;
        // border-top-left-radius: 0.24rem;
        // border-bottom-left-radius: 0.24rem;
        // border-bottom-right-radius: 0.24rem;
        margin-bottom: 0.1rem;
      }

      .time {
        font-size: 0.24rem;
        color: #aeaeae;
      }
    }

    .notice_msg {
      text-align: center;
      margin: 0.1rem 0.64rem 0.32rem 0.64rem;

      .time {
        font-size: 0.28rem;
        color: #8f92a1;
        margin-bottom: 0.26rem;
      }

      .content {
        // width: 5.22rem;
        // height: 0.6rem;
        border-radius: 0.32rem;
        padding: 0.2rem;
        background: var(--F5F7FC, #f5f7fc);
        color: var(--666D80, #666d80);
        text-align: center;
        font-size: 0.3rem;
        line-height: 0.6rem;
        /* 133.333% */
        padding: 0 0.18rem;
      }
    }
  }

  .box {
    height: 1.34rem;
    width: 100%;
    border-radius: 0.04rem;
    // margin-top: 5px;
    padding-top: 0.2rem;
    display: flex;
    align-items: center;
    // border-top: 1px solid #d0d8e2;
    // padding: 0 0.32rem;

    .item {
      height: 0.96rem;
      padding: 0 0.24rem;
      border: 0.02rem solid #d0d8e2;
      flex: 1;
      margin: 0 0.3rem;
      border-radius: 0.32rem;
    }

    .ipt {
      width: 100%;
      height: 100%;
    }

    .box_icon {
      width: 0.6rem;
      height: 0.6rem;
      position: relative;

      .file {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
        // border: 1px solid red;
        left: 0;
        top: 0;
        opacity: 0;
      }
    }
  }
}
</style>
