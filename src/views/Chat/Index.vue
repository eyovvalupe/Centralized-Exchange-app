<template>
  <div class="page page_language">
    <Top :title="t('service.page_title')" />
    <div class="layout-chat">
      <!-- <Loading v-show="!isConnected || chatLoading" /> -->
      <Loaidng v-show="!isConnected || chatLoading" />
      <div class="chat-con" @touchstart="setRead" @scroll="handleScroll" ref="scrollContainer">
        <messageBox :chatLoading="chatLoading" />
      </div>
      <div class="chat-send">
        <sendBox @scrollToBottom="sendEvent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Top from "@/components/Top.vue";
import messageBox from "@/components/Chat/messageBox.vue";
import sendBox from "@/components/Chat/sendBox.vue";
import { apiMsgRead } from "@/api/chat";
import { ref, nextTick, computed, onUnmounted, onMounted } from "vue";
import storeChat from "@/store/chat";
import { serviceChat } from "@/utils/serviceChat";
import Loaidng from "@/components/Loaidng.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
serviceChat.init();
const chatLoading = ref(true);
let childScroll = false;
storeChat.dispatch("updateMessage").then((res) => {
  nextTick(scrollToBottom);
  chatLoading.value = false;
});
const isConnected = computed(() => storeChat.state.isConnected);
const hasNewMessage = computed(() => storeChat.state.hasNewMessage);
const messageList = computed(() => storeChat.state.messageList);
const scrollContainer = ref(null);
const isReadMessage = (currTime) => {
  apiMsgRead({ nologinid: storeChat.getters.getNologinid }).then((res) => {
    const { lasttime } = res.data;
    storeChat.commit(
      "setreadMessageTime",
      currTime ? lasttime : new Date().valueOf() + 1000
    );
    // const tmp_arr = messageList.value.concat(hasNewMessage.value);
    // storeChat.commit('setNewMessageList', tmp_arr)
  });
};
isReadMessage(true);
const setRead = () => {
  if (hasNewMessage.value.length) {
    isReadMessage();
  }
};
const scrollToBottom = () => {
  setTimeout(() => {
    const hasNewMessageDom = document.getElementById("hasNewMessage");
    // 计算子节点相对于父节点的高度距离
    if (hasNewMessageDom) {
      childScroll = true;
      hasNewMessageDom.scrollIntoView({
        behavior: "smooth", // 平滑滚动
        block: "center", // 将元素滚动到父容器的中心位置
        inline: "nearest", // 水平方向的滚动对齐方式
      });
    } else {
      try {
        scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
      } catch { }
    }
    setTimeout(() => {
      childScroll = false;
    }, 1000);
  }, 500);
};
const handleScroll = () => {
  if (childScroll) {
    return;
  }
  const container = scrollContainer.value;
  if (
    hasNewMessage.value.length &&
    container.scrollTop + container.offsetHeight === container.scrollHeight
  ) {
    console.log("已滚动到底部");
    isReadMessage();
  }
};
const sendEvent = () => {
  childScroll = true;
  isReadMessage();
  scrollToBottom();
};
onUnmounted(() => {
  storeChat.commit("setHistoryMsg", []);
  serviceChat.destroy();
});
watch(
  hasNewMessage,
  (val) => {
    if (val.length) {
      scrollToBottom();
    }
  },
  { deep: true }
);
watch(
  messageList,
  (val) => {
    if (val.length) {
      scrollToBottom();
    }
  },
  { deep: true }
);
</script>

<style lang="less">
.layout-chat {
  display: flex;
  max-height: calc(var(--vh) * 100 - 1.12rem);
  flex-direction: column;
  margin-top: 1.12rem;
  overflow: hidden;

  .chat-con {
    height: calc(var(--app-height) - 2.25rem);
    padding: 10px 0;
    overflow-y: auto;
  }

  .chat-send {
    background: var(--ex-bg-color);
    padding: 0.26rem 0.32rem;
    border-top: 1px solid var(--ex-border-color);
    background-color: var(--ex-bg-color2);
  }
}
</style>
