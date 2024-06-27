<!-- 股票 -->
<template>
    <div class="market_stock">
        <!-- 结果列表 -->
        <div class="list">
            <Loading v-show="!stockList.length && loading" />
            <div class="item" v-for="(item, i) in stockList" :key="i" @click="goItem(item)">
                <div class="info">
                    <div class="title">{{ item.symbol || '--' }}</div>
                    <div class="text">{{ item.name || '--' }}</div>
                </div>
                <div class="ripple_button star" @click.stop="collect(item)">
                    <img v-if="item.watchlist == 0" src="/static/img/market/unstar.png" alt="⭐">
                    <img v-if="item.watchlist == 1" src="/static/img/market/star.png" alt="⭐">
                </div>
            </div>
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

const loading = ref(false)
const token = computed(() => store.state.token)

// 搜索相关
const stockList = ref([])
const getData = () => { // 获取数据
    loading.value = true
    _search({
        symbol: ""
    }).then(res => {
        stockList.value = res.data || []
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
        console.error('收藏', item.watchlist)
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