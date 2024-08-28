<!-- 市场 -->
<template>
    <div ref="marketPageRef" class="page page_market " v-if="activated">
        <!-- <transition :name="detailTransition"> -->
        <IPODetail @closeOpenDetail='closeOpenDetail' v-if="detail == '1'" />
        <Subscription @closeOpenDetail='closeOpenDetail' v-else-if="detail == '2'" />
        <!-- <PullRefresh class="refresh_box" v-model="reloading" @refresh="onRefresh" v-else> -->
        <!-- 标题 -->
        <!-- <div class="title">市场</div> -->
        <!-- <div class="search_block" @click="router.push({ name: 'search' })">
            <div class="search_icon">
                <img src="/static/img/common/search.png" alt="🔍">
            </div>
            <span>搜索</span>
        </div> -->

        <!-- 搜索 -->
        <!-- <div class="search_box" @click="router.push({ name: 'search' })">
                    <img src="/static/img/common/search_box.png" alt="🔍">
                </div> -->

        <!-- Tabs -->
        <!-- <Teleport to="body">
            <div @click="openTab = false" v-if="openTab" style="position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-color: rgba(0, 0, 0, 0.2);
            z-index: 1000;"></div>
        </Teleport> -->
        <Tabs type="card" sticky class="tab_content tabs" :class="[openTab ? 'open_tabs' : 'close_tabs']"
            v-if="!pageLoading" @change="changeTab" v-model:active="active" :swipeable="false" animated shrink>


            <Tab class="optional">
                <Optional v-if="activated && active == 0" ref="OptionalRef" />
                <div style="height:1rem"></div>
                <template #title>
                    <div class="tab_item">
                        <div class="tab_item_icon" v-show="active != 0">
                            <img src="/static/img/assets/contract_icon.svg" alt="icon">
                        </div>
                        <span v-show="active == 0">自选</span>
                    </div>
                </template>
            </Tab>
            <Tab>
                <NoData />
                <template #title>
                    <div class="tab_item">
                        <div class="tab_item_icon" v-show="openTab">
                            <img src="/static/img/assets/ipo_icon.svg" alt="icon">
                        </div>
                        <span>买币</span>
                    </div>
                </template>
            </Tab>
            <Tab>
                <Stock v-if="active == 2" ref="StockRef" />
                <div style="height:1rem"></div>
                <template #title>
                    <div class="tab_item">
                        <div class="tab_item_icon" v-show="openTab">
                            <img src="/static/img/assets/ipo_icon.svg" alt="icon">
                        </div>
                        <span>股票</span>
                    </div>
                </template>
            </Tab>
            <Tab>
                <NoData />
                <template #title>
                    <div class="tab_item">
                        <div class="tab_item_icon" v-show="openTab">
                            <img src="/static/img/assets/stock_icon.svg" alt="icon">
                        </div>
                        <span>合约</span>
                    </div>
                </template>
            </Tab>
            <Tab>
                <NoData />
                <template #title>
                    <div class="tab_item">
                        <div class="tab_item_icon" v-show="openTab">
                            <img src="/static/img/assets/stock_icon.svg" alt="icon">
                        </div>
                        <span>AI量化</span>
                    </div>
                </template>
            </Tab>
            <Tab>
                <NoData />
                <template #title>
                    <div class="tab_item">
                        <div class="tab_item_icon" v-show="openTab">
                            <img src="/static/img/assets/contract_icon.svg" alt="icon">
                        </div>
                        <span>外汇</span>
                    </div>
                </template>
            </Tab>
            <Tab>
                <NoData />
                <template #title>
                    <div class="tab_item">
                        <div class="tab_item_icon" v-show="openTab">
                            <img src="/static/img/assets/ipo_icon.svg" alt="icon">
                        </div>
                        <span>IPO</span>
                    </div>
                </template>
            </Tab>
            <Tab>
                <NoData />
                <template #title>
                    <div class="tab_item">
                        <div class="tab_item_icon" v-show="openTab">
                            <img src="/static/img/assets/stock_icon.svg" alt="icon">
                        </div>
                        <span>理财</span>
                    </div>
                </template>
            </Tab>

            <Tab :title-class="'my_icon'" @click.native.stop="openTab = !openTab">
                <template #title>
                    <div class="tab_icon" @click.native.stop="openTab = !openTab">
                        <img v-show="!openTab" src="/static/img/common/menu_icon.png" alt="img">
                        <img v-show="openTab" src="/static/img/common/back_icon.png" alt="img">
                    </div>
                </template>
            </Tab>
            <Tab v-if="!openTab" :title-class="'my_icon my_icon2'" @click.native.stop="router.push({ name: 'search' })">
                <template #title>
                    <div class="tab_icon" @click.native.stop="router.push({ name: 'search' })">
                        <img src="/static/img/common/search_icon.png" alt="img">
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

const marketPageRef = ref()
const openTab = ref(false)

const active = ref(0)
const OptionalRef = ref()
const StockRef = ref()
const IPORef = ref()
const reloading = ref(false)
const detail = ref(null)
const detailTransition = ref('slide-right');


const changeTab = key => {
    active.value = key
    openTab.value = false
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
const scrollHandler = () => {
    if (openTab.value) {
        openTab.value = false
    }
}
onActivated(() => {
    activated.value = true
    setTimeout(() => {
        if (active.value == 0) {
            OptionalRef.value && OptionalRef.value.init()
        }
        marketPageRef.value && marketPageRef.value.addEventListener('scroll', scrollHandler)
    }, 100)
})
onDeactivated(() => {
    marketPageRef.value && marketPageRef.value.removeEventListener('scroll', scrollHandler)
    setTimeout(() => {
        activated.value = false
    }, 100)
    // 取消订阅
    const socket = startSocket(() => {
        socket && socket.emit('realtime', '') // 价格变化
        socket && socket.emit('snapshot', '') // 快照数据
        socket && socket.off('realtime')
        socket && socket.off('snapshot')
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

    &:has(.open_tabs) {
        :deep(.addBtn) {
            top: 1.76rem;
        }
    }

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
        position: relative;

        :deep(.tab_item) {
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 0;

            .tab_item_icon {
                width: 0.28rem;
                height: 0.28rem;
                margin-right: 0.05rem;
            }
        }

        .tab_icon {
            width: 100%;
            height: 100%;
            line-height: 0;
            position: absolute;
            top: 0;
            left: 0;
            padding: 0.1rem;
        }

        :deep(.my_icon) {
            position: absolute;
            top: 0;
            right: 1rem;
            padding-right: 0 !important;
            padding-left: 0 !important;
            border-radius: 50%;
            border: 1px solid #EDF2F7;
            width: 0.6rem;
            height: 0.6rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #fff;
        }

        :deep(.my_icon2) {
            position: absolute;
            top: 0;
            right: 0.2rem;
            padding-right: 0 !important;
        }


        :deep(.van-tabs__nav--card) {
            border: none;
        }

        :deep(.van-tab--card) {
            border-right: none;
            color: #061023;
        }

        :deep(.van-tab--card.van-tab--active) {

            background-color: #F6F8FF;
            border-radius: 0.3rem;
            color: #014CFA;
            font-weight: 500
        }

        :deep(.van-tab--shrink) {
            padding: 0 0.26rem;
        }

        :deep(.van-tabs__wrap) {
            height: 0.8rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0);
            padding-bottom: 0.2rem;
            position: relative;
            padding-right: 2rem;
        }

        :deep(.van-tabs__nav--card) {
            height: 0.6rem;
            width: 100%;
            position: static;
        }

        :deep(.van-tab) {
            line-height: 0.6rem;
            font-size: 0.28rem;
        }
    }

    .open_tabs {
        z-index: 999;
        position: relative;


        :deep(.my_icon) {
            right: 0.2rem;
        }

        :deep(.van-sticky) {
            height: 1.6rem !important;
            border-bottom-left-radius: 0.6rem;
            border-bottom-right-radius: 0.6rem;
            // position: relative;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 9999;
        }

        :deep(.van-tabs__wrap) {
            height: 1.4rem;
            padding-right: 1.2rem;
        }

        :deep(.van-tabs__nav--card) {
            height: 1.2rem;
            flex-wrap: wrap;
            overflow: hidden;
        }
    }


    .close_tabs {}
}
</style>