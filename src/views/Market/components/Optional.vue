<!-- 自选 -->
<template>
    <StockTable class="market_optional" :loading="loading" :list="watchList" />
</template>

<script setup>
import StockTable from "@/components/StockTable.vue"
// import router from "@/router"
import store from "@/store";
import { defineExpose, computed, ref } from "vue"
import { _watchlist } from "@/api/api"


const loading = ref(false)
const subs = () => { // 订阅ws
    store.dispatch('subList', {
        commitKey: 'setMarketWatchList',
        proxyListValue: watchList
    })
}


const watchList = computed(() => store.state.marketWatchList || [])
const getWatchList = () => { // 获取订阅列表
    if (loading.value) return
    loading.value = true
    if (watchList.value.length) {
        subs()
    }
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
                subs()
            }, 0)
        }
    }).finally(() => {
        loading.value = false
    })
}

const init = () => {
    getWatchList()
}

defineExpose({
    init
})
</script>
