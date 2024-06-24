<!-- 市场 -->
<template>
    <div class="page page_market">
        <!-- 标题 -->
        <div class="title">市场</div>
        <!-- 搜索 -->
        <div class="search_box" @click="router.push({ name: 'search' })">
            <img src="/static/img/common/search_box.png" alt="🔍">
        </div>

        <!-- Tabs -->
        <Tabs class="tabs" v-if="!pageLoading" @change="changeTab" v-model:active="active" :swipeable="false" animated
            :color="'#014CFA'" shrink>
            <Tab :title="'自选'" class="optional">
                <Optional v-if="activated" ref="OptionalRef" />
            </Tab>
            <!-- <Tab :title="'股票'">
                <Stock />
            </Tab>
            <Tab :title="'理财'">
                <Financial />
            </Tab> -->
            <Tab :title="'IPO'">
                <IPO :type="'market'" ref="IPORef"/>
            </Tab>
        </Tabs>
    </div>
</template>

<script setup>
import { Tab, Tabs } from 'vant';
import { ref, onDeactivated, computed, onActivated } from "vue"
import router from "@/router"
import Optional from "./components/Optional.vue"
import Stock from "./components/Stock.vue"
import Financial from "./components/Financial.vue"
import IPO from "./components/IPO.vue"
import store from "@/store"
import { useSocket } from '@/utils/ws'

const active = ref(0)
const OptionalRef = ref()
const IPORef = ref()
const changeTab = key => {
    active.value = key
    switch (key) {
        case 0:
            OptionalRef.value.init()
            break
        case 1:
            IPORef.value.init()
            break
    }
}

// 预加载页面
const pageLoading = computed(() => store.state.pageLoading)
store.commit('setPageLoading', true)
Promise.all([
    import('@/views/Market/MarketInfo.vue'),
    import('@/views/Market/Search.vue'),
]).finally(() => {
    store.commit('setPageLoading', false)

    setTimeout(() => {
        changeTab(0)
    }, 0)
})


const { startSocket } = useSocket()
const activated = ref(false)
onActivated(() => {
    activated.value = true
    setTimeout(() => {
        if (active.value == 0) {
            OptionalRef.value && OptionalRef.value.init()
        }
    }, 500)
})
onDeactivated(() => {
    activated.value = false
    // 取消订阅
    const socket = startSocket(() => {
        socket && socket.emit('realtime', '') // 价格变化
        socket && socket.emit('snapshot', '') // 快照数据
        socket && socket.off('realtime')
        socket && socket.off('snapshot')
        console.error('取消订阅')
    })
})
</script>

<style lang="less" scoped>
.page_market {
    display: flex;
    flex-direction: column;
    padding-bottom: 1.4rem;

    .title {
        height: 1.12rem;
        color: #0D0D12;
        font-size: 0.56rem;
        font-weight: 600;
        line-height: 1.12rem;
        padding: 0 0.3rem;
    }

    .search_box {
        position: absolute;
        z-index: 9;
        top: 0.2rem;
        right: 0.24rem;
        width: 0.8rem;
        height: 0.8rem;
    }

    .tabs {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        :deep(.van-tabs__wrap) {
            padding: 0 0.32rem;
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

        :deep(.van-tab) {
            margin-left: 0.36rem;
        }

        :deep(.van-tabs__content) {
            flex: 1;

            .van-swipe-item {
                overflow-y: auto;
                padding-bottom: 0.2rem;
            }
        }
    }
}
</style>