<!-- 自选 -->
<template>
    <div v-if="watchList.length" :loading="loading">
        <OptionCategory />
        <StockTable style="margin-top:0.1rem" v-if="watchList.length" :loading="loading" @remove="remove"
            :deleteItem="!!(token)" class="market_optional" :list="watchList" />
        <div class="addBtn_container">
            <Button round icon="plus" plain type="primary" hairline="" class="addBtn">添加自选</Button>
        </div>
    </div>
    <div v-else-if="!watchList.length && !loading" style="position: relative">
        <div class="no_self_selection_block">
            <div class="no_data_icon">
                <img src="/static/img/common/no_data.png" alt="暂无数据">
            </div>
            <p class="text">你还没有添加自选哦</p>
            <Button round icon="plus" plain type="primary" hairline="" class="addBtn">添加自选</Button>
        </div>
        <Teleport to=".page_market">
            <div class="one_click_to_favorite_container">
                <Button round block type="primary" size="large" class="one_click_to_favorite" :loading="addLoading"
                    @click="addOptional">
                    一键添加自选(<i class="tag" v-if="!!(stockList.length + contractList.length)">{{ stockList.length +
                        contractList.length }}</i>)
                </Button>
            </div>
        </Teleport>

        <Loaidng v-if="!marketSrockRecommendList.length && !marketContractRecommendList.length && recommendLoading"
            :loading="recommendLoading" :type="'spinner'" />
        <NoData
            v-if="!marketSrockRecommendList.length && !marketContractRecommendList.length && !loading && !recommendLoading" />

        <div class="recommend_block">
            <div class="item_block" v-if="marketSrockRecommendList.length">
                <div class="item_block_title">
                    <span>推荐股票</span>
                </div>
                <StockRecommend :key="'stock'" :keyStr="'stock'" :loading="recommendLoading" @change="changeStockList"
                    @init="init" :list="marketSrockRecommendList" />
            </div>

            <div class="item_block" v-if="marketContractRecommendList.length">
                <div class="item_block_title">
                    <span>推荐合约/AI量化</span>
                </div>
                <StockRecommend :key="'recommend'" :keyStr="'recommend'" :loading="recommendLoading"
                    @change="changeContractList" @init="init" :list="marketContractRecommendList" />
            </div>
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
import OptionCategory from "@/components/OptionCategory.vue"
import router from "@/router"
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
    if (!token.value) return store.commit('setIsLoginOpen', true)
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
.no_self_selection_block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 0.579rem;
    margin-bottom: 0.362rem;
    color: #A4ACB9;
    font-size: 0.253rem;
    font-weight: 400;
    line-height: 0.253rem;

    .no_data_icon {
        width: 1.34rem;
        height: 1.16rem;
    }

    .text {
        margin-bottom: 0.307rem;
    }
}

.addBtn {
    color: #014CFA;
    border-color: #014CFA;
}

.recommend_block {
    background-color: #F5F7FC;
    padding: 0.471rem 0.272rem;
    border-radius: 0.452rem;

    .item_block {
        margin-bottom: 0.471rem;

        .item_block_title {
            font-size: 0.326rem;
            font-weight: 600;
            line-height: 0.326rem;
            margin-bottom: 0.326rem;
        }
    }
}

@media (min-width: 751px) {
    .one_click_to_favorite_container {
        max-width: 375px;
        overflow-y: auto;
    }
}

.one_click_to_favorite_container {
    position: fixed;
    bottom: 1.866rem;
    width: 100%;
    padding: 0 0.271rem;

    .one_click_to_favorite {
        background-color: #014CFA;
        color: #FFFFFF;
    }
}

.addBtn_container {
    margin-top: 0.398rem;
    display: flex;
    justify-content: center;
}

.search_block {
    background-color: #F4F5F7;
    // border: 1px solid #eeeff1;
    height: 0.8rem;
    border-radius: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 0.32rem;
    font-size: 0.28rem;
    color: #9EA3AE;
    margin: 0.06rem 0.32rem 0 0.32rem;

    .search_icon {
        width: 0.4rem;
        height: 0.4rem;
        margin-right: 0.2rem;
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
