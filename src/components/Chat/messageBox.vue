<template>
  <div class="msg-content">
    <div v-if="!messageList || !messageList.length">
       <p class="no-message">--------- 暂无消息 ---------</p>
    </div>
    <template v-else>
      <div class="msg-item" v-for="item in messageList" :key="item.msgid" :class="item.direction">
      <div class="avatar" v-if="item.direction === 'receive'"><img :src="avatar" :alt="item.msgid"></div>
      <div class="msg-item-con">
        <div class="con" v-html="item.content"></div>
        <div class="time">{{ transferTime(item.time) }}</div>
      </div>
      <div class="avatar" v-if="item.direction === 'send'"><img :src="avatarMy" :alt="item.msgid"></div>
    </div>
    </template>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { transferTime } from '@/utils'
import storeChat from "@/store/chat"
import avatar from '@/assets/avatar.png'
import avatarMy from '@/assets/avatar-my.png'
const messageList = computed(() => storeChat.getters.getMessageList)
</script>

<style lang="less" scoped>
.msg-content {
  .msg-item {
    display: flex;
    margin: 5px;

    .avatar {
      img {
        max-width: 40px;
        max-height: 40px;
      }
    }

    .msg-item-con {
      .con {
        background: #f5f5f5;
        padding: 3px 6px;
        min-height: 30px;
        line-height:25px;
        border-radius: 8px;
        font-weight: 500;
        position: relative;
        box-shadow: 0 2px 3px #d4d4d4;
        :deep(p){
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
        margin: 0 10px 5px 5px;
        text-align: right;

      }

      .con {
        background: #edf1ff;
        color: #3293e0;

        &::before {
          content: "";
          position: absolute;
          top: 7px;
          right: -15px;
          border: 8px solid transparent;
          border-left: 8px solid #edf1ff;
        }
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
        border-right: 8px solid #f5f5f5;
      }
    }
  }
  .no-message{
    text-align: center;
    color: #999;
  }
}
</style>
