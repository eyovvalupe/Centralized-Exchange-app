<template>
  <div class="msg-content">
    <div v-if="!messageList || !messageList.length">
      <p class="no-message">--------- 暂无消息 ---------</p>
    </div>
    <template v-else>
      <div class="msg-item" v-for="item in messageList" :key="item.msgid" :class="item.direction">
        <small v-show="false"> {{ storeChat.state.readMessageTime }}****{{ item.time }}***{{
          storeChat.state.readMessageTime > item.time }}</small>
        <div class="avatar" v-if="item.direction === 'receive'"><img :src="avatar" :alt="item.msgid"></div>
        <div class="msg-item-con">
          <div class="con" :class="item.type">
            <template v-if="item.type !== 'img'">
              {{ item.content }}
            </template>
            <van-image v-else class="send-conimg" Lazyload :src="item.content" fit="scale-down">
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>
          </div>
          <div class="time">{{ transferTime(item.time) }}</div>
        </div>
        <!-- <div class="avatar" v-if="item.direction === 'send'"><img :src="avatarMy" :alt="item.msgid"></div> -->
      </div>
      <div id="hasNewMessage" v-if="hasNewMessage.length">{{ hasNewMessage.length }}条未读消息</div>
      <div class="msg-item" v-for="item in hasNewMessage" :key="item.msgid" :class="item.direction">
        <div class="avatar" v-if="item.direction === 'receive'"><img :src="avatar" :alt="item.msgid"></div>
        <div class="msg-item-con">
          <div class="con" :class="item.type">
            <template v-if="item.type !== 'img'">
              {{ item.content }}
            </template>
            <van-image v-else class="send-conimg" :src="item.content1" fit="scale-down">
              <template v-slot:error>加载失败</template>
            </van-image>
          </div>
          <div class="time">{{ transferTime(item.time) }}</div>
        </div>
      </div>

    </template>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Lazyload, Image as VanImage } from 'vant';
import { transferTime } from '@/utils'
import storeChat from "@/store/chat"
import avatar from '@/assets/avatar.png'
// import avatarMy from '@/assets/avatar-my.png'
const messageList = computed(() => storeChat.getters.getMessageList)
const hasNewMessage = computed(() => storeChat.state.hasNewMessage)
</script>

<style lang="less" scoped>
.msg-content {

  .msg-item {
    display: flex;

    .avatar {
      img {
        max-width: 40px;
        max-height: 40px;
      }
    }

    .msg-item-con {
      .con {
        color: #333;
        padding: 5px;
        min-height: 30px;
        line-height: 22px;
        border-radius: 8px;
        border-top-right-radius: 0;
        position: relative;
        box-shadow: 0 2px 3px #d4d4d4;

        :deep(p) {
          margin: 0 !important;
          padding: 0 !important;
        }
      }

      .time {
        font-size: 12px;
        padding: 5px 0 0 10px;
        color: #666;
      }
    }

    &.send {
      justify-content: flex-end;

      .msg-item-con {
        margin: 0 5px 5px 5px;
        text-align: right;

      }

      .con {
        background: #449742;
        color: #fff;

        &.img {
          box-shadow: none !important;
          background: transparent !important;
        }

        // &::before {
        //   content: "";
        //   position: absolute;
        //   top: 0;
        //   right: -15px;
        //   border: 8px solid transparent;
        //   border-left: 8px solid #449742;
        // }
      }
    }

    &.receive {
      .msg-item-con {
        margin: 0 5px 5px 10px;
        text-align: left;
      }

      .con::before {
        content: "";
        position: absolute;
        top: 7px;
        left: -15px;
        border: 8px solid transparent;
        border-right: 8px solid #f2f2f2;
      }
    }
    .send-conimg {
      max-height: 10rem;
      max-width: 10rem;
    }
  }

  #hasNewMessage {
    text-align: center;
    background: #f5f5f5;
    padding: 10px 0;
    margin-bottom: 10px;
    color: #959494;
  }

  .no-message {
    text-align: center;
    color: #999;
  }
}
</style>
