<!-- 交易 -->
<template>
    <div class="page page_trade">
        <PullRefresh :disabled="disabled" class="refresh_box" v-model="loading" @refresh="onRefresh">

            <!-- 头部 -->
            <div class="trade_header">
                <div class="menu" @click="showNavDialog = true">
                    <img src="/static/img/trade/open.png" alt="menu" />
                </div>

                <div class="tabs">
                    <div class="tab" :class="{ 'active_tab': activeTab == 1 }" @click="activeTab = 1">股票</div>
                    <div class="tab" :class="{ 'active_tab': activeTab == 2 }" @click="activeTab = 2">IPO</div>
                </div>

                <div class="value" @click="showPrice = true">
                    <div class="value_icon"><img src="/static/img/trade/value.png" alt="img" /></div>
                    <span>持仓价值</span>
                </div>
            </div>


            <transition :name="transitionName" v-if="pageActive">
                <div v-if="activeTab == 1" class="stock_block">
                    <StockBlock ref="StockBlockRef" />
                </div>
                <div v-else-if="activeTab == 2" class="ipo_block">
                    <IpoBlock />
                </div>
            </transition>



        </PullRefresh>


        <!-- 自选列表 -->
        <Popup v-model:show="showNavDialog" position="left" :style="{ width: '85%', height: '100%' }">
            <div class="trade_option_list">

                <!-- 搜索 -->
                <div class="item search_box">
                    <div class="search_icon">
                        <img src="/static/img/common/search.png" alt="🔍">
                    </div>
                    <input v-model.trim="searchStr" @keyup="goSearch" type="text" class="ipt" placeholder="搜索">
                </div>

                <div class="lists">
                    <!-- 搜索列表 -->
                    <StockTable :handleClick="handleClick" v-if="searchStr" :loading="searchLoading" :key="'search'"
                        :list="marketSearchList" />

                    <!-- 推荐列表 -->
                    <StockTable :handleClick="handleClick" v-if="!searchStr" :loading="optionLoading" :key="'option'"
                        :list="watchList" />
                </div>


            </div>
        </Popup>

        <!-- 持仓价值 -->
        <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" v-model:show="showPrice" position="top">
            <div class="trade-popup_price">
                <div class="popup-title">交易</div>
                <div class="total-value">总持仓价值</div>
                <div class="num">98148.56</div>
                <div class="popup-flex">
                    <div class="flex-box">
                        <div class="t-flex">持仓收益</div>
                        <div class="b-num">+4578.25</div>
                    </div>
                    <div class="flex-box">
                        <div class="t-flex">持仓收益率</div>
                        <div class="b-num">+48.23%</div>
                    </div>
                </div>
            </div>
        </Popup>

    </div>
</template>

<script setup>
import { PullRefresh, Popup } from "vant"
import { ref, watch, computed, onActivated, onDeactivated } from "vue"
import IpoBlock from "./pages/IpoBlock.vue"
import StockBlock from "./pages/StockBlock.vue"
import store from "@/store"
import StockTable from "@/components/StockTable.vue"
import { _search, _watchlist } from "@/api/api"

const token = computed(() => store.state.token)
if (token.value) {
    store.dispatch('updateWallet')
}

// 下拉刷新
const disabled = ref(false)
const loading = ref(false)
const onRefresh = () => {
    console.error('下拉刷新')
    loading.value = false
}

// 一级导航
const activeTab = ref(1) // 1-股票 2-IPO
const transitionName = ref('slide-left')
watch([activeTab], ([newActive]) => {
    if (newActive === 2) {
        transitionName.value = 'slide-right';
    } else if (newActive === 1) {
        transitionName.value = 'slide-left';
    }
});


// 持仓价值
const showPrice = ref(false)
// 左侧列表弹窗
const showNavDialog = ref(false)
const watchList = computed(() => store.state.marketWatchList || [])
const marketSearchList = computed(() => store.state.marketSearchList || [])

// 自选列表
const optionLoading = ref(false)
const getOptionList = () => {
    if (!token.value) return
    optionLoading.value = true
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
            setTimeout(() => {
                store.dispatch('subList', {
                    commitKey: 'setMarketWatchList',
                    listKey: 'marketWatchList',
                })
            }, 100)
        }
    }).finally(() => {
        optionLoading.value = false
    })
}

// 选择股票
const StockBlockRef = ref()
const handleClick = (item) => {
    showNavDialog.value = false
    StockBlockRef.value && StockBlockRef.value.choose(item)
}

// 搜索列表
const searchStr = ref('')
let searchTimeout = null
const searchLoading = ref(false)
const goSearch = () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    let s = searchStr.value
    if (!s) {
        store.commit('setMarketSearch', {
            search: '',
            list: []
        })
        searchLoading.value = false
        return
    }
    searchTimeout = setTimeout(() => {
        searchLoading.value = true
        _search({
            symbol: s
        }).then(res => {
            if (searchStr.value == s) {
                store.commit('setMarketSearch', {
                    search: s,
                    list: res.data || []
                })
                setTimeout(() => {
                    store.dispatch('subList', {
                        commitKey: 'setMarketSearchList',
                        listKey: 'marketSearchList',
                    })
                }, 100)
            }
        }).finally(() => {
            searchLoading.value = false
        })
    }, 500)
}


const pageActive = ref(true)
onActivated(() => {
    pageActive.value = true
    getOptionList()
})
onDeactivated(() => {
    pageActive.value = false
})
</script>

<style lang="less" scoped>
.page_trade {
    height: 100%;
    overflow-y: auto;

    :deep(.van-tab--shrink) {
        padding: 0 0.28rem;
    }

    .trade_header {
        height: 1.12rem;
        padding: 0 0.32rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .menu {
            width: 0.4rem;
            height: 0.4rem;
        }

        .tabs {
            flex: 1;
            display: flex;
            align-items: center;
            padding: 0 0.4rem;

            .tab {
                font-size: .28rem;
                color: #061023;
                padding: 0 .4rem;
                height: .6rem;
                border-radius: .48rem;
                display: flex;
                align-items: center;
                cursor: pointer;
            }

            .active_tab {
                color: #014cfa;
                background-color: #f6f8ff;
            }
        }

        .value {
            display: flex;
            align-items: center;
            color: #0953fa;
            font-size: 0.24rem;
            font-weight: 400;

            .value_icon {
                width: 0.52rem;
                height: 0.52rem;
            }
        }
    }

    .trade_option_list {
        height: 100%;
        padding-bottom: 1.4rem;
        display: flex;
        flex-direction: column;

        .lists {
            flex: 1;
            overflow-y: auto;
        }

        .search_box {
            margin: 0.2rem 0.15rem 0.4rem 0.15rem;
            display: flex;
            align-items: center;
            padding: 0 0.4rem;
            height: 0.8rem;
            background-color: #F4F5F7;
            border-radius: 0.2rem;
            border: 1px solid #F4F5F7;

            .search_icon {
                width: 0.48rem;
                height: 0.48rem;
                margin-right: 0.24rem;
            }

            .ipt {
                height: 100%;
            }
        }
    }
}
</style>

<style lang="less">
.trade-popup_price {
    padding: 0 0.32rem 0.64rem 0.32rem;

    .popup-title {
        color: #0d0d12;
        font-size: 0.56rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.5rem;
        padding-top: 0.3rem;
        margin-bottom: 0.32rem;
    }

    .total-value {
        color: #061023;
        text-align: center;
        font-size: 0.36rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.3rem;
    }

    .num {
        color: #061023;
        text-align: center;
        font-size: 0.6rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.3rem;
        margin-top: 0.48rem;
        margin-bottom: 0.6rem;
    }

    .popup-flex {
        display: flex;

        .flex-box {
            flex: 1;
            text-align: center;
        }

        .t-flex {
            color: #333;
            text-align: center;
            font-size: 0.28rem;
            font-style: normal;
            font-weight: 400;
            line-height: 0.3rem;
            margin-bottom: 0.2rem;
        }

        .b-num {
            color: #333;
            text-align: center;
            font-size: 0.32rem;
            font-style: normal;
            font-weight: 600;
            line-height: 0.3rem;
        }
    }
}
</style>