<!-- 搜索页 -->
<template>
    <div class="page page_search">
        <Top :title="'搜索'" />
        <!-- 搜索框 -->
        <div class="search_box">
            <div class="icon">
                <img src="/static/img/common/search.png" alt="🔍">
            </div>
            <input ref="iptRef" @keydown="keydown" @keydown.enter="resetData" placeholder="搜索" type="text"
                enterkeyhint="search" v-model.trim="search" class="search">
            <!-- <div class="close" v-show="search" @click="clearData">
                <Icon name="cross" />
            </div> -->
            <div class="type_select" @click="showAS = true">
                <span>{{ currAsName }}</span>
                <div class="type_icon">
                    <img src="/static/img/common/menu.png" alt="img">
                </div>
            </div>
        </div>
        <!-- 结果列表 -->
        <div class="list">
            <Loading v-show="!searchList.length && loading" />
            <NoData v-if="!searchList.length && !loading" />
            <div class="item" v-for="(item, i) in searchList" :key="i" @click="goItem(item)">
                <div class="info">
                    <div class="title">{{ item.symbol || '--' }}</div>
                    <div class="text">{{ item.name || '--' }}</div>
                </div>
                <div class=" star" @click.stop="collect(item)">
                    <img v-if="item.watchlist == 0" src="/static/img/market/unstar.png" alt="⭐">
                    <img v-if="item.watchlist == 1" src="/static/img/market/star.png" alt="⭐">
                </div>
            </div>

        </div>

        <!-- 类型选择弹窗 -->
        <Teleport to="body">
            <ActionSheet v-model:show="showAS" :actions="actions" @select="onSelect" title="类型"></ActionSheet>
        </Teleport>
    </div>


</template>

<script setup>
import Top from "@/components/Top"
import { Icon, showToast, showLoadingToast, closeToast, ActionSheet } from "vant"
import { ref, computed, onMounted } from "vue"
import { _search } from "@/api/api"
import Loading from "@/components/Loaidng.vue"
import store from "@/store"
import router from "@/router"
import { _add, _del } from '@/api/api'
import NoData from "@/components/NoData.vue"


const showAS = ref(false)
const currAs = ref(store.state.marketSearchType || 'stock')
const currAsName = computed(() => {
    return actions.value.find(item => item.value == currAs.value).name
})
const actions = computed(() => {
    return [
        { name: '股票', value: 'stock', className: currAs.value == 'stock' ? 'action-sheet-active' : '' },
        { name: '合约', value: 'futures', className: currAs.value == 'futures' ? 'action-sheet-active' : '' },
        { name: 'AI量化', value: 'aiquant', className: currAs.value == 'aiquant' ? 'action-sheet-active' : '' },
        { name: '外汇', value: 'forex', className: currAs.value == 'forex' ? 'action-sheet-active' : '' },
    ]
})
const onSelect = item => {
    showAS.value = false
    currAs.value = item.value
    store.commit('setMarketSearch', {
        search: '',
        market: '',
        list: []
    })
    getData()
}

const iptRef = ref()
const search = ref('')
const loading = ref(false)
const token = computed(() => store.state.token)

// 搜索相关
search.value = store.state.marketSearchStr || ''
const searchList = computed(() => store.state.marketSearchList || [])
const getData = () => { // 获取数据
    loading.value = true
    _search({
        market: currAs.value,
        symbol: search.value,
        page: 1
    }).then(res => {
        store.commit('setMarketSearch', {
            search: search.value,
            market: currAs.value,
            list: res.data || []
        })
    }).finally(() => {
        loading.value = false
    })
}
const resetData = () => { // 搜索
    store.commit('setMarketSearch', {
        search: '',
        market: '',
        list: []
    })
    getData()
}
const clearData = () => { // 重置搜索
    search.value = ''
    resetData()
}
let timeout = null
const keydown = () => { // 输入事件监听
    setTimeout(() => {
        if (timeout) clearTimeout(timeout)
        // if (!search.value) return
        timeout = setTimeout(() => {
            resetData()
        }, 500)
    }, 0)
}


if (!searchList.value.length) { // 初始化如果没有内容就触发搜索
    getData()
}

onMounted(() => { // 进入页面聚焦
    setTimeout(() => {
        iptRef.value.focus()
    }, 500)
})

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
                    showToast(item.watchlist ? '添加成功' : '移除成功')
                }, 300)
                const i = searchList.value.find(a => a.symbol == item.symbol)
                if (i) {
                    i.watchlist = i.watchlist == 1 ? 0 : 1
                    store.commit('setMarketSearch', {
                        search: search.value,
                        market: currAs.value,
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



Promise.all([
    import('@/views/Market/MarketInfo.vue'),
])
</script>

<style lang="less" scoped>
.page_search {
    padding: 1.32rem 0.32rem 0.24rem 0.32rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .search_box {
        display: flex;
        align-items: center;
        padding: 0 0.4rem;
        margin-bottom: 0.4rem;
        height: 0.8rem;
        background-color: #F4F5F7;
        border-radius: 0.2rem;

        .type_select {
            right: 0;
            display: flex;
            align-items: center;
            color: #253146;
            font-size: 0.24rem;

            .type_icon {
                width: 0.28rem;
                height: 0.28rem;
                opacity: 0.8;
                margin-left: 0.06rem;
            }
        }

        &:has(.search:focus) {
            border: 1px solid #014CFA;
        }

        .icon {
            width: 0.4rem;
            height: 0.4rem;
        }

        .close {
            width: 0.24rem;
            height: 0.24rem;
            color: #121826;
        }

        .search {
            flex: 1;
            margin: 0 0.16rem;
            font-size: 0.32rem;
            font-weight: 400;
        }
    }

    .list {
        flex: 1;
        overflow-y: auto;

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