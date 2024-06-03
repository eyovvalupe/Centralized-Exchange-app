<!-- 市场 -->
<template>
    <div class="page page_market">
        <!-- 标题 -->
        <div class="title">市场</div>
        <!-- 搜索 -->
        <div class="search_box" @click="router.push({ name: 'search' })">
            <div class="search">
                <div class="search_icon">
                    <img src="/static/img/common/search.png" alt="🔍">
                </div>
                <span>搜索</span>
            </div>
        </div>

        <!-- Tabs -->
        <Tabs class="tabs" v-model:active="active" :swipeable="false" animated :color="'#014CFA'" shrink>
            <Tab v-for="(item, i) in navs" :title="item.name" :key="item.key">
                <component :is="domObj[item.dom]" :key="item.key" />
            </Tab>
        </Tabs>
    </div>
</template>

<script setup>
import { Tab, Tabs } from 'vant';
import { ref, defineAsyncComponent, onActivated, onMounted } from "vue"
import router from "@/router"

const Optional = defineAsyncComponent(() => import("./components/Optional.vue"));
const Stock = defineAsyncComponent(() => import("./components/Stock.vue"));
const Financial = defineAsyncComponent(() => import("./components/Financial.vue"));
const IPO = defineAsyncComponent(() => import("./components/IPO.vue"));


const domObj = {
    Optional,
    Stock,
    Financial,
    IPO
}

const active = ref(1)
const navs = ref([
    { name: '自选', dom: 'Optional', key: 1 },
    { name: '股票', dom: 'Stock', key: 2 },
    { name: '理财', dom: 'Financial', key: 3 },
    { name: 'IPO', dom: 'IPO', key: 4 },
])


onMounted(() => {
    console.error('onMounted')
})
onActivated(() => {
    console.error('Activated')
})

</script>

<style lang="less" scoped>
.page_market {
    display: flex;
    flex-direction: column;
    padding-bottom: 1.4rem;

    .title {
        height: 1.12rem;
        color: #0D0D12;
        font-size: 0.56rem;
        font-weight: 600;
        line-height: 1.12rem;
        padding: 0 0.3rem;
    }

    .search_box {
        padding: 0.28rem 0.3rem 0.48rem 0.3rem;

        .search {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding: 0 0.32rem;
            height: 0.8rem;
            background-color: #F4F5F7;
            color: #9EA3AE;
            font-size: 0.32rem;
            font-weight: 400;
            border-radius: 0.2rem;

            .search_icon {
                width: 0.48rem;
                height: 0.48rem;
                margin-right: 0.12rem;
            }
        }
    }

    .tabs {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        :deep(.van-tabs__nav) {
            position: relative;

            &::after {
                content: '';
                width: 100%;
                height: 1px;
                background-color: #3B82F6;
                position: absolute;
                bottom: 16px;
                left: 0;
                opacity: 0.3;
            }
        }

        :deep(.van-tab) {
            margin-left: 0.36rem;
        }

        :deep(.van-tabs__content) {
            flex: 1;

            .van-swipe-item {
                overflow-y: auto;
                padding-bottom: 0.2rem;
            }
        }
    }
}
</style>