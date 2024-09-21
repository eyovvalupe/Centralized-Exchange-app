<!-- 买币 -->
<template>
    <div class="page page-buycoin">

        <Tabs v-if="!pageLoading" class="tabs" v-model:active="active" :swipeable="false" animated :color="'#014CFA'"
            shrink @change="onChange">
            <Tab title="快捷区" name="0">
                <Faster />
            </Tab>
            <Tab title="自选区" name="1">
                <Self v-if="active == 1" />
            </Tab>
            <Tab title="我的订单" name="2">
                <List />
                <template #title>
                    <div class="tab_item">
                        <span>我的订单</span>
                        <div class="nav_num" v-if="store.state.c2cUnreadTotal > 0">{{ store.state.c2cUnreadTotal }}
                        </div>
                    </div>
                </template>
            </Tab>
        </Tabs>

    </div>
</template>

<script setup>
import { useSocket } from "@/utils/ws";
import { Tab, Tabs } from "vant";
import { ref, onMounted, onUnmounted, computed } from "vue"
import Faster from "./Faster.vue"
import List from "./List.vue"
import Self from "./Self.vue"
import store from '@/store';


const { startSocket } = useSocket();
const token = computed(() => store.state.token)

// 订阅
const currLoading = ref(false)
const subs = () => {
    const socket = startSocket(() => {
        socket && socket.off('user')
        socket && socket.off('c2corder')
        socket && socket.emit('user', token.value)
        socket && socket.emit('c2corder', '#all')
        currLoading.value = true
        store.commit('setC2cList', [])
        socket.on('c2corder', res => {
            // console.error('--->', res.data)
            store.commit('setC2cList', res.data || [])
            currLoading.value = false
        })
    });
}
// 取消订阅
const cancelSubs = () => {
    const socket = startSocket(() => {
        socket && socket.off('user')
        socket && socket.off('c2corder')
        socket && socket.emit('user', '')
        socket && socket.emit('c2corder', '')
    })
}

const active = ref(0)
const onChange = i => {

}

const pageLoading = ref(true)
onMounted(() => {
    setTimeout(() => {
        pageLoading.value = false
    }, 300)
    if (token.value) {
        subs()
    }
})
onUnmounted(() => {
    cancelSubs()
})
</script>

<style lang="less" scoped>
.page-buycoin {
    .tabs {
        :deep(.van-tabs__wrap) {
            padding: 0 0.32rem !important;
        }

        :deep(.van-tabs__nav) {
            position: relative;

            &::after {
                content: '';
                width: 100%;
                height: 1px;
                background-color: #3B82F6;
                position: absolute;
                bottom: 16px;
                left: 0;
                opacity: 0.3;
            }
        }
    }
}
</style>