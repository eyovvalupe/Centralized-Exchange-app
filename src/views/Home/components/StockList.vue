<!-- 股票列表 -->
<template>
    <div style="padding-top: 0.32rem;">
        <Tabs v-model:active="activeTab" animated shrink @change="changeTab">
            <Tab :title="'全部'" :name="'0'">
                <div>
                    <NoData v-if="!loading && !showList.length" />
                    <div class="list-i">
                        <StockItem :menuType="'stock'" :handleClick="handleClick" :padding="true" :showIcon="false"
                            :item="item" v-for="(item, i) in showList" :key="'s_' + i" />
                    </div>

                    <LoadingMore :classN="'loading_more_stock'" :loading="loading" :finish="finish"
                        v-if="((finish && showList.length) || (!finish)) && activeTab == 0" />
                </div>
            </Tab>
            <Tab :title="marketMap[item.market]" :name="i + 1" v-for="(item, i) in markets" :key="item.market">
                <div>
                    <Loaidng :loading="loading" v-if="loading && (!showList || !showList.length)" />
                    <NoData v-if="!loading && (!showList || !showList.length)" />
                    <div class="list-i" v-if="showList">
                        <StockItem :menuType="'stock'" :handleClick="props.handleClick" :padding="true"
                            :showIcon="false" :item="item" v-for="(item, i) in showList" :key="item.market + '_' + i" />
                    </div>
                </div>
            </Tab>
        </Tabs>


    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import StockItem from "@/components/StockItem.vue";
import { Tabs, Tab } from "vant"
import NoData from '@/components/NoData.vue';
import { _marketGet, _recommend, _stock } from "@/api/api"
import Loaidng from "@/components/Loaidng.vue"
import store from "@/store/index.js"
import LoadingMore from "@/components/LoadingMore.vue"


const props = defineProps({
    handleClick: {
        type: Function,
        default: null
    }
})

const activeTab = ref(0)
const loading = ref(false)
const finish = ref(false)


const marketCurrent = computed(() => store.state.marketCurrent)
const showList = computed(() => store.getters.getMarketStockCurrentList || [])
const subs = () => {
    setTimeout(() => {
        store.dispatch('subList', {
            allKeys: showList.value.map(item => item.symbol)
        })
    }, 500)
}


// 全部股票
const page = ref(1)
const getAll = () => {
    if (finish.value) return
    if (loading.value) return
    loading.value = true
    _stock({
        market: "",
        name: "",
        page: page.value
    }).then(res => {
        page.value++
        if (marketCurrent.value == 'all') {
            const arr = (res.data || []).map(item => {
                item.type = 'stock'
                return item
            })
            if (showList.value.length) {
                store.commit('setMarketStockDataList', [
                    ...showList.value,
                    ...arr
                ])
            } else {
                store.commit('setMarketStockDataList', arr)
            }
            subs()
        }
        if (!res.data.length) {
            finish.value = true
        }
    }).finally(() => {
        loading.value = false
    })
}

// 市场信息
const markets = ref([])
const marketMap = ref({
    india: '印度',
    us: '美国',
    japan: '日本',
    korea: '韩国',
    germany: '德国',
    uk: '英国',
    singapore: '新加披',
    hongkong: '香港',
    malaysia: '马来西亚'
})
const marketSetterMap = ref({
    india: 'setMarketStockIndiaDataList',
    us: 'setMarketStockUsDataList',
    japan: 'setMarketStockJapanDataList',
    korea: 'setMarketStockKoreaDataList',
    germany: 'setMarketStockGermanyDataList',
    uk: 'setMarketStockUkDataList',
    singapore: 'setMarketStockSingaporeDataList',
    hongkong: 'setMarketStockHongkongDataList',
    malaysia: 'setMarketStockMalaysiaDataList'
})
const getMarkets = () => {
    try {
        markets.value = JSON.parse(sessionStorage.getItem('stock_markets') || '[]')
    } catch { }
    _marketGet().then(res => {
        markets.value = res.data || []
        setSession()
    })
}
getMarkets()

// 设置缓存
const setSession = () => {
    setTimeout(() => {
        sessionStorage.setItem('stock_markets', JSON.stringify(markets.value))
    }, 500)
}


subs()

const changeTab = e => {
    if (e == 0) { // 全部
        getAll()
        store.commit('setMarketCurrent', 'all')
    } else { // 各个国家
        const m = markets.value[e - 1]
        store.commit('setMarketCurrent', m.market)
        loading.value = true
        _recommend({ market: m.market }).then(res => {
            if (res && res.data) {
                if (m.market == marketCurrent.value) {
                    const list = (res.data.stock || []).map(item => {
                        const target = showList.value.find(a => a.symbol == item.symbol)
                        if (target) {
                            item = Object.assign(target, item)
                        }
                        item.type = 'stock'
                        return item
                    })
                    store.commit(marketSetterMap.value[m.market], list)
                    subs()
                }
            }
        }).finally(() => {
            loading.value = false
        })
    }
    subs()
}



// 滚动监听
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
let target = null;
const scrollHandler = () => {
    if (!target) return;
    const rect = target.getBoundingClientRect();
    if (rect.top <= totalHeight) {
        // 加载更多
        getAll()
    }
};
onMounted(() => {
    setTimeout(() => {
        try {
            document.querySelector(".page-trade3").addEventListener("scroll", scrollHandler);
            target = document.querySelector(".loading_more_stock");
        } catch { }
    }, 500);
});
onBeforeUnmount(() => {
    try {
        document
            .querySelector(".page-trade3")
            .removeEventListener("scroll", scrollHandler);
    } catch { }
});
</script>