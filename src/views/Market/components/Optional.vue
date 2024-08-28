<!-- 自选 -->
<template>
    <StockTable v-if="watchList.length" :loading="loading" @remove="remove" :deleteItem="!!(token)"
        class="market_optional" :list="watchList" />
    <div v-else-if="!watchList.length && !loading" style="position: relative">
        <Teleport to=".page_market">
            <Button round class="addBtn" :color="!!(stockList.length + contractList.length) ? '#EFF6FF' : '#eee'"
                :loading="addLoading" @click="addOptional">
                <span style="font-size: 0.2rem;"
                    :style="{ color: !!(stockList.length + contractList.length) ? '#014CFA' : '#666' }">一键添加至自选</span>
                <span class="tag" v-if="!!(stockList.length + contractList.length)">{{ stockList.length +
                    contractList.length }}</span>
            </Button>
        </Teleport>

        <Loaidng v-if="!marketSrockRecommendList.length && !marketContractRecommendList.length && recommendLoading"
            :loading="recommendLoading" :type="'spinner'" />
        <NoData
            v-if="!marketSrockRecommendList.length && !marketContractRecommendList.length && !loading && !recommendLoading" />
        <div class="item_block" v-if="marketSrockRecommendList.length">
            <div class="item_block_title">
                <span>股票</span>
            </div>
            <StockRecommend :key="'stock'" :keyStr="'stock'" :loading="recommendLoading" @change="changeStockList"
                @init="init" :list="marketSrockRecommendList" />

        </div>
        <div class="item_block" v-if="marketContractRecommendList.length">
            <div class="item_block_title">
                <span>合约/AI量化</span>
            </div>
            <StockRecommend :key="'recommend'" :keyStr="'recommend'" :loading="recommendLoading"
                @change="changeContractList" @init="init" :list="marketContractRecommendList" />
        </div>

        <!-- <Tabs class="option_tab" v-model:active="active" :swipeable="false" animated shrink>
            <Tab>
                <template #title>
                    <div>
                        <span>股票</span>
                    </div>
                </template>
<StockRecommend :loading="recommendLoading" @change="changeStockList" @init="init" :list="marketSrockRecommendList" />
<NoData v-if="!marketSrockRecommendList.length && !loading && !recommendLoading" />
</Tab>
<Tab>
    <template #title>
                                <div>
                                    <span>合约</span>
                                </div>
                            </template>
    <StockRecommend @change="changeStockList" @init="init" :list="marketSrockRecommendList" />
    <NoData />
</Tab>
</Tabs> -->
    </div>

    <Loaidng v-else :loading="loading" :type="'spinner'" />
</template>

<script setup>
import Loaidng from "@/components/Loaidng.vue"
import NoData from "@/components/NoData.vue"
import StockTable from "@/components/StockTable.vue"
import StockRecommend from "@/components/StockRecommend.vue"
// import router from "@/router"
import store from "@/store";
import { computed, ref } from "vue"
import { _watchlist, _del, _watchlistDefault, _add } from "@/api/api"
import { showLoadingToast, closeToast, showToast, Tabs, Tab, Button } from 'vant'
import { useSocket } from '@/utils/ws'
const { startSocket } = useSocket()

const active = ref(0)

const token = computed(() => store.state.token || '')
const loading = ref(true)
const subs = () => { // 订阅 ws
    store.dispatch('subList', {
        commitKey: 'setMarketWatchList',
        listKey: 'marketWatchList',
        // proxyListValue: watchList.value
    })
}


const watchList = computed(() => store.state.marketWatchList || [])
const getWatchList = () => { // 获取订阅列表
    loading.value = true
    // if (watchList.value.length) {
    //     subs()
    // }
    _watchlist().then(res => {
        if (res.code == 200) {
            if (watchList.value.length) { // 有历史数据就更新
                const rs = res.data.map(item => {
                    const target = watchList.value.find(a => a.symbol == item.symbol)
                    if (target) {
                        Object.assign(target, item)
                        item = target
                    }
                    return item
                })
                store.commit('setMarketWatchList', rs || [])
            } else { // 没有就直接提交
                store.commit('setMarketWatchList', res.data || [])
            }

            if (!res.data.length) { // 还没有添加自选
                setTimeout(() => {
                    openRecommendList()
                }, 100)
            } else { // 有数据就订阅
                setTimeout(() => {
                    subs()
                }, 500)
            }
        }
    }).finally(() => {
        loading.value = false
    })
}

const init = () => {
    if (token.value) {
        getWatchList()
    } else {
        loading.value = false
        // 打开推荐列表
        openRecommendList()
    }
}


// 推荐列表
const marketSrockRecommendList = computed(() => store.state.marketSrockRecommendList || [])
const marketContractRecommendList = computed(() => store.state.marketContractRecommendList || [])
const recommendLoading = ref(false)
const openRecommendList = () => {
    recommendLoading.value = true
    _watchlistDefault().then(res => {
        if (res.code == 200) {

            // 股票
            if (res.data?.stock) {
                const arr = res.data.stock.map(item => {
                    const target = marketSrockRecommendList.value.find(a => a.symbol == item.symbol)
                    return target || item
                })
                store.commit('setMarketSrockRecommendList', arr || [])
                setTimeout(() => {
                    store.dispatch('subList', {
                        commitKey: 'setMarketSrockRecommendList',
                        listKey: 'marketSrockRecommendList',
                    })
                }, 500)
            }


            // 合约
            if (res.data?.futures) {
                const arr2 = res.data.futures.map(item => {
                    const target = marketContractRecommendList.value.find(a => a.symbol == item.symbol)
                    return target || item
                })
                store.commit('setMarketContractRecommendList', arr2 || [])
                setTimeout(() => {
                    store.dispatch('subList', {
                        commitKey: 'setMarketContractRecommendList',
                        listKey: 'marketContractRecommendList',
                    })
                }, 1000)
            }

        }
    }).finally(() => {
        recommendLoading.value = false
    })
}
// 推荐股票选择
const stockList = ref([])
const contractList = ref([])
const changeStockList = arr => {
    stockList.value = arr
}
const changeContractList = arr => {
    contractList.value = arr
}
// 添加自选
const addLoading = ref(false)
const addOptional = () => {
    if (!stockList.value.length && !contractList.value.length) return
    const keys = [...stockList.value, ...contractList.value]
    if (addLoading.value) return
    addLoading.value = true
    _add({
        symbol: keys.join(',')
    }).then(res => {
        if (res.code == 200) {
            showToast('添加成功')
            init()
        }
    }).finally(() => {
        addLoading.value = false
    })
}

defineExpose({
    init
})


// 移除收藏
const removeLoading = ref(false)
const remove = item => {
    if (removeLoading.value) return
    removeLoading.value = true
    showLoadingToast({
        duration: 0,
        loadingType: 'spinner',
    })
    _del({
        symbol: item.symbol
    }).then(res => {
        if (res.code == 200) {
            setTimeout(() => {
                showToast('移除成功')
            }, 300)
            const i = watchList.value.findIndex(a => a.symbol == item.symbol)
            if (i >= 0) {
                watchList.value.splice(i, 1)
                store.commit('setMarketWatchList', watchList.value)
                init()
                // 这里要移除监听，否则数据没同步会多出来
                const socket = startSocket(() => {
                    socket && socket.off('realtime')
                })
            }
        }
    }).finally(() => {
        closeToast();
        removeLoading.value = false
    })
}

</script>

<style lang="less" scoped>
.item_block {
    .item_block_title {
        padding: 0.32rem 0.32rem 0.12rem 0.32rem;
    }
}

.addBtn {
    position: absolute;
    right: 0.32rem;
    height: 0.48rem;
    z-index: 1;
    top: 1.14rem;

    .tag {
        display: block;
        width: 0.32rem;
        height: 0.32rem;
        border-radius: 50%;
        background-color: #3B82F6;
        color: #fff;
        font-size: 0.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 0;
        top: -0.1rem;
    }
}

.option_tab {
    :deep(.van-tab__panel) {
        // height: calc(var(--app-height) - 4.2rem) !important;
        // overflow-y: auto;
    }

    :deep(.van-tabs__nav--line) {
        padding-bottom: 0;
        border-bottom: 1px solid #3B82F6 !important;
        margin: 0 0.32rem;
    }

    :deep(.van-tabs__line) {
        bottom: -1px;
    }

}
</style>
