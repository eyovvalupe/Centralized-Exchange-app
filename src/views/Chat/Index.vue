<template>
    <div class="page page_language">
        <Top :title="'在线客服'" />
        <div class="layout-chat">
            <loading v-show="!isConnected || chatLoading" />
            <div class="chat-con" @scroll="handleScroll" ref="scrollContainer">
                <messageBox />
            </div>
            <div class="chat-send">
                <sendBox />
            </div>
        </div>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import loading from '@/components/Chat/loading.vue'
import messageBox from '@/components/Chat/messageBox.vue'
import sendBox from '@/components/Chat/sendBox.vue'
import { apiMsgRead } from '@/api/chat'
import { ref, nextTick, computed, onMounted, watch } from 'vue'
import storeChat from "@/store/chat"
const chatLoading=ref(true);
storeChat.commit('setHistoryMsg', [])
storeChat.dispatch('updateMessage').then(res=>{
    chatLoading.value = false
    scrollToBottom();
})

const isConnected = computed(() => storeChat.state.isConnected)
const hasNewMessage = computed(() => storeChat.state.hasNewMessage)

const scrollContainer = ref(null);
const scrollToBottom = () => {
    nextTick(() => {
        setTimeout(() => {
            scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
            console.log(scrollContainer.value.scrollHeight, scrollContainer.value.offsetHeight)
        }, 300);
    })
    storeChat.commit('sethasNewMessage', 0)
};
const handleScroll = () => {
    const container = scrollContainer.value;
    if (hasNewMessage.value && container.scrollTop + container.offsetHeight === container.scrollHeight) {
        console.log('已滚动到底部');
        apiMsgRead({ nologinid: storeChat.getters.getNologinid }).then(() => {
            scrollToBottom()
        })
    }
};
watch(hasNewMessage, (val) => {
    if (val) {
        scrollToBottom();
    }
})
</script>

<style lang="less">
.layout-chat {
    display: flex;
    flex-direction: column;
    margin-top: 1.12rem;
    overflow: hidden;

    .chat-con {
        height: calc(100vh - 2.25rem);
        background: #f5f5f5;
        padding: 10px;
        overflow-y: auto;
    }

    .chat-send {
        background: #fff;
        padding: 10px;
    }
}
</style>