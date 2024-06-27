<!-- 股票 -->
<template>
    <div class="market_stock">
        <!-- 结果列表 -->
        <div class="list">
            <Loading v-show="!stockList.length && loading" />
            <StockItem :scrollBox="'.market_stock'" :item="item" v-for="(item, i) in stockList" :key="i" />
        </div>
    </div>
</template>

<script setup>
import Top from "@/components/Top"
import { Icon, showToast, showLoadingToast, closeToast } from "vant"
import { ref, computed, onMounted } from "vue"
import { _search } from "@/api/api"
import Loading from "@/components/Loaidng.vue"
import store from "@/store"
import router from "@/router"
import { _add, _del } from '@/api/api'
import StockItem from "@/components/StockItem.vue"

const loading = ref(false)
const token = computed(() => store.state.token)

// 搜索相关
const stockList = computed(() => store.state.marketStockList || [])
const getData = () => { // 获取数据
    loading.value = true
    _search({
        symbol: ""
    }).then(res => {
        store.commit('setMarketStockList', res.data || [])
        store.commit('setMarketWatchKeys', res.data.map(item => item.symbol))
        setTimeout(() => {
            store.dispatch("subList", {
                commitKey: "setMarketStockList",
                proxyListValue: stockList.value
            })
        }, 0)
    }).finally(() => {
        loading.value = false
    })
}
getData()


// 查看详情
const goItem = item => {
    store.commit('setCurrStock', item)
    setTimeout(() => {
        router.push({
            name: 'market_info',
            query: {
                symbol: item.symbol
            }
        })
    }, 100)
}

// 收藏
const collectLoading = ref(false)
const reqMap = {
    0: _add,
    1: _del
}
const collect = item => {
    if (!token.value) {
        router.push({
            name: 'login'
        })
    } else {
        if (collectLoading.value) return
        collectLoading.value = true
        if (!reqMap[item.watchlist || 0]) return collectLoading.value = false
        showLoadingToast({
            duration: 0,
            loadingType: 'spinner',
        })
        reqMap[item.watchlist || 0]({
            symbol: item.symbol
        }).then(res => {
            if (res.code == 200) {
                setTimeout(() => {
                    showToast(item.watchlist ? '移除成功' : '添加成功')
                }, 300)
                const i = searchList.value.findIndex(a => a.symbol == item.symbol)
                if (i >= 0) {
                    i.watchlist = i.watchlist == 1 ? 0 : 1
                    store.commit('setMarketSearch', {
                        search: search.value,
                        list: searchList.value
                    })
                }
            }
        }).finally(() => {
            closeToast();
            collectLoading.value = false
        })
    }
}

defineExpose({
    getData
})
</script>

<style lang="less" scoped>
.market_stock {
    padding-bottom: 0.6rem;
    height: 100%;
    overflow-y: auto;

    .list {
        padding: 0 0.32rem;

        .item {
            height: 1.2rem;
            border-bottom: 1px solid #EAEAEA;
            display: flex;
            align-items: center;

            .info {
                flex: 1;
                overflow: hidden;

                .title {
                    color: #061023;
                    font-size: 0.32rem;
                }

                .text {
                    color: #8F92A1;
                    font-size: 0.24rem;
                    font-weight: 400;
                    margin-top: 0.18rem;
                }
            }

            .star {
                width: 0.4rem;
                height: 0.4rem;
                margin-left: 0.2rem;
            }
        }
    }
}
</style>