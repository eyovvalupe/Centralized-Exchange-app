<template>
  <div ref="messageBoxRef" class="msg-content">
    <div v-if="
      (!messageList || !messageList.length) &&
      (!hasNewMessage || !hasNewMessage.length) &&
      !props.chatLoading
    ">
      <p class="no-message mb-[0.2rem]">{{ formatDate(new Date()) }}</p>
      <div class="w-full flex justify-center items-center">
        <p
          class="w-[5.22rem] rounded-[1rem] text-center h-[0.6rem] mb-[0.6rem] flex justify-center items-center text-[0.3rem] text-color5">
          {{ $t("service.message_title") }}
        </p>
      </div>
      <div class="flex">
        <div class="mr-[0.2rem]">
          <div style="width: 0.8rem;height: 0.8rem;">
            <img v-lazy="getStaticImgUrl(`/static/img/user/service.svg`)" alt="">
          </div>
        </div>
        <div class="flex flex-col">
          <span
            class="service_first h-[1rem] w-[4.7rem] px-[0.32rem] flex justify-left items-center rounded-[0.12rem] mb-[0.2rem] text-[0.3rem] !text-black">{{
              $t("service.first_message") }}</span>
        </div>
      </div>
    </div>
    <template v-else>
      <div class="msg-item" v-for="(item, i) in messageList" :key="item.msgid" :class="item.direction">
        <div class="w-full flex flex-col justify-center">
          <div v-if="
            !messageList[i - 1] ||
            (messageList[i - 1] &&
              messageList[i]['time'] - messageList[i - 1]['time'] > 60000)
          " class="text-center mb-[0.2rem] text-color3 text-[0.28rem]">
            {{ transferTime(item.time) }}
          </div>

          <div class="msg-item-con">
            <div class="user-box" v-if="item.direction !== 'receive'">
              <div class="con break-all" :class="item.type">
                <template v-if="item.type !== 'img'">
                  {{ item.content }}
                </template>
                <van-image v-else class="send-conimg" radius="6" Lazyload :src="item.content" fit="scale-down">
                  <template v-slot:loading>
                    <Loaidng type="circular" size="20" />
                  </template>
                </van-image>
              </div>
              {{ console.log(token) }}
              <div class="user-icon" v-if="item.direction !== 'receive' && item.type !== 'img'"></div>
              <div v-if="!token" style="width: 0.8rem;height: 0.8rem;" class="ml-[0.2rem]">
                <img v-lazy="getStaticImgUrl(`/static/img/user/avatar1.svg`)" alt="">
              </div>
              <div v-if="token" style="width: 0.8rem;height: 0.8rem;" class="ml-[0.2rem]">
                <img v-lazy="getStaticImgUrl(`/static/img/user/avatar2.svg`)" alt="">
              </div>
            </div>
            <div class="receive-box" v-if="item.direction === 'receive'">
              <div class="mr-[0.2rem]">
                <div style="width: 0.8rem;height: 0.8rem;">
                  <img v-lazy="getStaticImgUrl(`/static/img/user/service.svg`)" alt="">
                </div>
              </div>
              <div class="con break-all receive-text" :class="item.type" v-if="item.type !== 'img'">
                <div class="receive_text">
                  {{ item.content }}
                </div>
              </div>
              <div class="con break-all" :class="item.type" v-else>
                <van-image class="send-conimg" radius="6" Lazyload :src="item.content" fit="scale-down">
                  <template v-slot:loading>
                    <Loaidng type="circular" size="20" />
                  </template>
                </van-image>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="hasNewMessage" v-if="hasNewMessage && hasNewMessage.length">
        {{ hasNewMessage.length }}条未读消息
      </div>
      <div class="msg-item" v-for="item in hasNewMessage" :key="item.msgid" :class="item.direction">
        <div class="mr-[0.2rem]">
          <div style="width: 0.8rem;height: 0.8rem;">
            <img v-lazy="getStaticImgUrl(`/static/img/user/service.svg`)" alt="">
          </div>
        </div>
        <div class="msg-item-con">
          <div class="con break-all receive-text" :class="item.type">
            <template v-if="item.type !== 'img'">
              {{ item.content }}
            </template>
            <van-image v-else class="send-conimg" radius="6" Lazyload :src="item.content" fit="scale-down">
              <template v-slot:loading>
                <Loaidng type="circular" size="20" />
              </template>
            </van-image>
          </div>
          <!-- <div class="time">{{ transferTime(item.time) }}</div> -->
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { computed, onMounted, ref, watch } from "vue";
import { Lazyload, Image as VanImage } from "vant";
import { transferTime } from "@/utils";
import storeChat from "@/store/chat";
import Loaidng from "@/components/Loaidng.vue";
import { useI18n } from "vue-i18n";
import store from "@/store";

const { t } = useI18n();
const props = defineProps({
  chatLoading: {
    type: Boolean,
    default: true,
  },
});
const messageBoxRef = ref(null);
const token = computed(() => store.state.token);
const messageList = computed(() => storeChat.getters.getMessageList);
const hasNewMessage = computed(() => storeChat.state.hasNewMessage);

function formatDate(date) {
  const year = String(date.getFullYear()).slice(-4);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
// const scrollToBottom = () => {
//   if (messageBoxRef.value) {
//     messageBoxRef.value.scrollTop = messageBoxRef.value.scrollHeight;
//   }
// };
// watch(messageList, (val) => {
//   setTimeout(() => {
//     scrollToBottom();
//   }, 200);
// });
</script>

<style lang="less" scoped>
.msg-content {
  padding: 0 16px;

  .service_first {
    position: relative;
    background-color: var(--ex-white);
    color: var(--ex-text-black);

    &::before {
      content: "";
      position: absolute;
      left: -0.3rem;
      top: 0.26rem;
      width: 0;
      height: 0;
      border-left: 0.2rem solid transparent;
      border-right: 0.2rem solid var(--ex-white);
      border-bottom: 0.2rem solid transparent;
      border-top: 0.2rem solid transparent;
    }
  }

  .msg-item {
    display: flex;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      overflow: hidden;
      margin-left: 16px;

      img {
        max-width: 40px;
        max-height: 40px;
      }
    }

    .msg-item-con {
      .con {
        display: flex;
        align-items: center;
        padding: 0 15px;
        max-width: 5.84rem;
        min-height: 1rem;
        line-height: 22px;
        font-size: 15px;
        border-radius: 6px;
        position: relative;

        :deep(p) {
          margin: 0 !important;
          padding: 0 !important;
        }

        &.receive-text {
          position: relative;

          &::before {
            content: "";
            position: absolute;
            left: -0.3rem;
            top: 0.26rem;
            width: 0;
            height: 0;
            border-left: 0.2rem solid transparent;
            border-right: 0.2rem solid var(--ex-white);
            border-bottom: 0.2rem solid transparent;
            border-top: 0.2rem solid transparent;
          }
        }

        &.img {
          padding: 0 !important;
          margin-right: 6px;
        }
      }

      .user-box {
        display: flex;
        justify-content: flex-end;

        .user-avatar {
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 0.4rem;
          overflow: hidden;
          margin-left: 7px;

          .user-avatar-img {
            width: 0.8rem !important;
            height: 0.8rem !important;
          }
        }

        .user-icon {
          width: 0;
          height: 0;
          border-left: 15px solid var(--ex-primary-color);
          border-top: 15px solid transparent;
          border-bottom: 15px solid transparent;
          margin-left: -9px;
          margin-top: 8px;
        }
      }

      .time {
        font-size: 12px;
        padding: 5px 0 0 10px;
        color: var(--ex-text-color2);
      }

      .receive-box {
        display: flex;

        .user-icon {
          width: 0;
          height: 0;
          border-right: 15px solid var(--ex-border-color);
          border-top: 15px solid transparent;
          border-bottom: 15px solid transparent;
          margin-left: 7px;
          margin-top: 8px;
        }

        .user-avatar {
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 0.4rem;
          overflow: hidden;
          margin-left: 7px;

          .receive-avatar-img {
            width: 0.8rem !important;
            height: 0.8rem !important;
          }
        }
      }
    }

    &.receive {
      .con {
        background: var(--ex-white);
        color: var(--ex-black);

        &.img {
          padding: 0 !important;
          margin-left: 6px;
        }

        
      }
    }

    &.send {
      justify-content: flex-end;

      .msg-item-con {
        margin: 0 5px 30px 5px;
        text-align: right;
      }

      .con {
        background: var(--ex-primary-color);
        color: var(--ex-text-color--bg-primary);

        &.img {
          box-shadow: none !important;
          background: transparent !important;
        }

      }
    }

    &.receive {
      .msg-item-con {
        margin: 0 5px 30px 0;
        text-align: left;
      }


    }

    .send-conimg {
      max-height: 10rem;
      max-width: 10rem;
    }

    .van-image__img {
      display: block;
      border-radius: 6px !important;
    }
  }

  #hasNewMessage {
    text-align: center;
    background: var(--ex-white);
    padding: 10px 0;
    margin-bottom: 10px;
    color: var(--ex-text-color3);
  }

  .no-message {
    text-align: center;
    color: var(--ex-text-color3);
  }
}
</style>
