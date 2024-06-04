<!-- 搜索页 -->
<template>
    <div class="page page_search">
        <Top :title="'最活跃'" />
        <!-- 搜索框 -->
        <div class="search_box">
            <div class="icon">
                <img src="/static/img/common/search.png" alt="🔍">
            </div>
            <input @keydown.enter="resetData" placeholder="搜索" type="text" enterkeyhint="search" v-model.trim="search"
                class="search">
            <div class="close" v-show="search" @click="search = ''">
                <Icon name="cross" />
            </div>
        </div>
        <!-- 结果列表 -->
        <div class="list">
            <Loading v-show="!searchList.length && loading" />
            <div class="item" v-for="(item, i) in searchList" :key="i">
                <div class="info">
                    <div class="title">{{ item.symbol || '--' }}</div>
                    <div class="text">{{ item.name || '--' }}</div>
                </div>
                <div class="ripple_button star">
                    <img src="/static/img/market/unstar.png" alt="⭐">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Top from "@/components/Top"
import { Icon } from "vant"
import { ref, computed } from "vue"
import { _search } from "@/api/api"
import Loading from "@/components/Loaidng.vue"
import store from "@/store"

const search = ref('')
const loading = ref(false)

search.value = store.state.marketSearchStr || ''
const searchList = computed(() => store.state.marketSearchList || [])
const getData = () => {
    if (loading.value) return
    loading.value = true
    _search({
        symbol: search.value
    }).then(res => {
        console.error(res)
        store.commit('setMarketSearch', {
            search: search.value,
            list: res.data || []
        })
    }).finally(() => {
        loading.value = false
    })
}
const resetData = () => {
    store.commit('setMarketSearch', {
        search: '',
        list: []
    })
    getData()
}

if (!searchList.value.length) {
    getData()
}
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

        .icon {
            width: 0.48rem;
            height: 0.48rem;
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