<!-- 市场 -->
<template>
    <div class="page page_market ">
        <!-- 标题 -->
        <div class="title">市场</div>
        <!-- 搜索 -->
        <div class="search_box" @click="router.push({ name: 'search' })">
            <img src="/static/img/common/search_box.png" alt="🔍">
        </div>

        <!-- Tabs -->
        <Tabs type="card" class="tab_content tabs" v-if="!pageLoading" @change="changeTab" v-model:active="active"
            :swipeable="false" animated shrink>
            <Tab :title="'自选'" class="optional">
                <Optional v-if="activated && active == 0" ref="OptionalRef" />
            </Tab>
            <Tab :title="'股票'">
                <Stock v-if="active == 1" ref="StockRef" />
            </Tab>
            <!-- <Tab :title="'理财'">
                <Financial />
            </Tab> -->
            <Tab :title="'IPO'">
                <IPO v-if="active == 2" :type="'market'" ref="IPORef" />
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
const StockRef = ref()
const IPORef = ref()
const changeTab = key => {
    active.value = key
    setTimeout(() => {
        switch (key) {
            case 0:
                OptionalRef.value.init()
                break
            case 1:
                StockRef.value.getData()
                break
            case 2:
                IPORef.value.init()
                break
        }
    }, 200)
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

        :deep(.van-tab__panel) {
            height: calc(100vh - 3.4rem);
            overflow-y: auto;
        }

        :deep(.van-tabs__nav--card) {
            border: none;
        }

        :deep(.van-tab--card) {
            border-right: none;
            color: #061023;
            // background-color: #f5f5f5;
            // border-radius: 0.3rem;
            // margin-left: 0.1rem;
            // transition: all ease .2s;
        }

        :deep(.van-tab--card.van-tab--active) {
            // background-color: #014CFA;
            // color: #fff;

            background-color: #F6F8FF;
            border-radius: 0.3rem;
            color: #014CFA;
            font-weight: 500
        }

        :deep(.van-tab--shrink) {
            padding: 0 0.3rem;
        }

        :deep(.van-tabs__wrap) {
            height: 0.8rem;
            border-bottom: 1px solid #F6F8FF;
            padding-bottom: 0.2rem;
        }

        :deep(.van-tabs__nav--card) {
            height: 0.6rem;
        }

        :deep(.van-tab) {
            line-height: 0.6rem;
            font-size: 0.28rem;
        }
    }
}
</style>