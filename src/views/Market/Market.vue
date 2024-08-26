<!-- 市场 -->
<template>
    <div class="page page_market " v-if="activated">
        <!-- <transition :name="detailTransition"> -->
        <IPODetail @closeOpenDetail='closeOpenDetail' v-if="detail == '1'" />
        <Subscription @closeOpenDetail='closeOpenDetail' v-else-if="detail == '2'" />
        <!-- <PullRefresh class="refresh_box" v-model="reloading" @refresh="onRefresh" v-else> -->
        <!-- 标题 -->
        <!-- <div class="title">市场</div> -->
        <div style="height:0.2rem"></div>
        <div class="search_block" @click="router.push({ name: 'search' })">
            <div class="search_icon">
                <img src="/static/img/common/search.png" alt="🔍">
            </div>
            <span>搜索</span>
        </div>

        <!-- 搜索 -->
        <!-- <div class="search_box" @click="router.push({ name: 'search' })">
                    <img src="/static/img/common/search_box.png" alt="🔍">
                </div> -->

        <!-- Tabs -->
        <Tabs type="card" sticky class="tab_content tabs" v-if="!pageLoading" @change="changeTab"
            v-model:active="active" :swipeable="false" animated shrink>
            <Tab class="optional">
                <Optional v-if="activated && active == 0" ref="OptionalRef" />
                <div style="height:1rem"></div>

                <template #title>
                    <div class="mytab_title" :class="{ 'mytab_title_active': active == 0 }">
                        <div class="mytab_title_icon" v-show="active != 0">
                            <img v-show="active != 0" src="/static/img/assets/contract_icon.svg" alt="img">
                        </div>
                        <span v-show="active == 0">自选</span>
                    </div>
                </template>
            </Tab>
            <Tab>
                <NoData />
                <template #title>
                    <div class="mytab_title" :class="{ 'mytab_title_active': active == 1 }">
                        <div class="mytab_title_icon" v-show="active != 1">
                            <img v-show="active != 1" src="/static/img/assets/contract_icon.svg" alt="img">
                        </div>
                        <span v-show="active == 1">买币</span>
                    </div>
                </template>
            </Tab>
            <Tab :title="'股票'">
                <Stock v-if="active == 2" ref="StockRef" />
                <div style="height:1rem"></div>
            </Tab>
            <Tab :title="'合约'">
                <NoData />
            </Tab>
            <Tab :title="'AI量化'">
                <NoData />
            </Tab>
            <Tab :title="'外汇'">
                <NoData />
            </Tab>
            <Tab>
                <NoData />
                <template #title>
                    <div class="mytab_title" :class="{ 'mytab_title_active': active == 6 }">
                        <div class="mytab_title_icon" v-show="active != 6">
                            <img v-show="active != 6" src="/static/img/assets/contract_icon.svg" alt="img">
                        </div>
                        <span v-show="active == 6">IPO</span>
                    </div>
                </template>
            </Tab>
            <Tab>
                <NoData />
                <template #title>
                    <div class="mytab_title" :class="{ 'mytab_title_active': active == 7 }">
                        <div class="mytab_title_icon" v-show="active != 7">
                            <img v-show="active != 7" src="/static/img/assets/contract_icon.svg" alt="img">
                        </div>
                        <span v-show="active == 7">理财</span>
                    </div>
                </template>
            </Tab>
        </Tabs>
        <!-- </PullRefresh> -->
        <!-- </transition> -->


    </div>
</template>

<script setup>
import { Tab, Tabs, PullRefresh } from 'vant';
import { ref, onDeactivated, computed, onActivated, watch } from "vue"
import router from "@/router"
import Optional from "./components/Optional.vue"
import Stock from "./components/Stock.vue"
import Financial from "./components/Financial.vue"
import IPO from "./components/IPO.vue"
import store from "@/store"
import { useSocket } from '@/utils/ws'
import IPODetail from '@/views/trade/IPODetail.vue'
import Subscription from '@/views/trade/Subscription.vue'
import NoData from '@/components/NoData.vue';

const active = ref(0)
const OptionalRef = ref()
const StockRef = ref()
const IPORef = ref()
const reloading = ref(false)
const detail = ref(null)
const detailTransition = ref('slide-right');

const changeTab = key => {
    active.value = key
    setTimeout(() => {
        switch (key) {
            case 0:
                OptionalRef.value && OptionalRef.value.init()
                break
            case 2:
                StockRef.value.initData()
                break
            case 6:
                IPORef.value && IPORef.value.init()
                break
        }
    }, 100)
}



// 预加载页面
const pageLoading = computed(() => store.state.pageLoading)
store.commit('setPageLoading', true)
Promise.all([
    import('@/views/Market/MarketInfo.vue'),
    import('@/views/Market/Search.vue'),
    import('@/views/Market/IpoSubscription.vue'),
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
    }, 100)
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

const onRefresh = () => {
    if (active.value == 2) {
        IPORef.value && IPORef.value.onRefresh()
    } else {
        setTimeout(() => {
            reloading.value = false
        }, 500)
    }
}


</script>

<style lang="less" scoped>
.page_market {
    padding-bottom: 1.4rem;
    height: 100%;
    overflow-y: auto;
    position: relative;

    :deep(.van-sticky) {
        background-color: #fff;
        padding-top: 0.2rem;
    }

    .mytab_title {
        display: flex;
        align-items: center;
        transition: all ease .3s;

        >span {
            margin-left: 0.08rem;
        }

        .mytab_title_icon {
            width: 0.32rem;
            height: 0.32rem;
            line-height: 1;
            position: relative;
            top: -0.02rem;
        }
    }

    .mytab_title_active {
        .mytab_title_icon {
            width: 0.28rem;
            height: 0.28rem;
        }
    }

    .title {
        padding: 0 0.24rem 0 0.32rem;
        height: 1.12rem;
        font-weight: 600;
        color: #0D0D12;
        line-height: 0.5rem;
        font-size: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.1rem;
        position: relative;
    }

    .search_block {
        background-color: #fff;
        border: 1px solid #eeeff1;
        height: 0.8rem;
        border-radius: 0.2rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 0 0.32rem;
        font-size: 0.28rem;
        color: #9EA3AE;
        margin: 0 0.32rem 0.12rem 0.32rem;

        .search_icon {
            width: 0.4rem;
            height: 0.4rem;
            margin-right: 0.2rem;
        }
    }

    .search_box {
        position: absolute;
        z-index: 9;
        top: 0.2rem;
        right: 0.24rem;
        width: 0.64rem;
        height: 0.64rem;
    }

    .tabs {
        overflow: hidden;

        :deep(.van-tab__panel) {
            // height: calc(var(--app-height) - 3.4rem);
            // overflow-y: auto;
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
            border-bottom: 1px solid rgba(0, 0, 0, 0);
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