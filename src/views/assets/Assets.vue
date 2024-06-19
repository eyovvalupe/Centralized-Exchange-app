<!-- 资产页 -->
<template>
    <div class="page page_assets">
        <Tabs v-if="pageLoading" class="tab_content" v-model:active="active" type="card" animated shrink>
            <Tab title="总资产" name="overview">
                <div class="tab_body">
                    <PullRefresh class="refresh_box" v-model="loading" @refresh="onRefresh">
                        <Overview />
                    </PullRefresh>
                </div>
            </Tab>
            <Tab title="现金账户" name="cash">
                <div class="tab_body">
                    现金账户
                </div>
            </Tab>
            <Tab title="股票" name="stock">
                <div class="tab_body">
                    股票
                </div>
            </Tab>
            <Tab title="合约" name="contract">
                <div class="tab_body">
                    合约
                </div>
            </Tab>
            <Tab title="IPO" name="ipo">
                <div class="tab_body">
                    IPO
                </div>
            </Tab>
        </Tabs>
    </div>
</template>

<script setup>
import { Tab, Tabs, PullRefresh } from "vant"
import { ref, onMounted } from "vue"
import Overview from "./page/Overview.vue"

const active = ref('overview')
const loading = ref(false)
const pageLoading = ref(false)

const onRefresh = () => {
    console.error('刷新')
    setTimeout(() => {
        console.error('刷新成功');
        loading.value = false;
    }, 1000);
}

onMounted(() => {
    setTimeout(() => {
        pageLoading.value = true
    }, 100)
})
</script>

<style lang="less" scoped>
.page_assets {
    padding: 0.36rem 0;

    .tab_content {
        ::v-deep(.van-tabs__nav--card) {
            border: none;
        }

        ::v-deep(.van-tab--card) {
            border-right: none;
            color: #061023;
        }

        ::v-deep(.van-tab--card.van-tab--active) {
            background-color: #F6F8FF;
            border-radius: 0.3rem;
            color: #014CFA;
            font-weight: 500
        }

        ::v-deep(.van-tab--shrink) {
            padding: 0 0.3rem;
        }

        ::v-deep(.van-tabs__wrap) {
            height: 0.6rem;
        }

        ::v-deep(.van-tabs__nav--card) {
            height: 0.6rem;
        }

        ::v-deep(.van-tab) {
            line-height: 0.6rem;
            font-size: 0.3rem;
        }

    }

    .tab_body {
        height: calc(100vh - 2.5rem);
        border: 1px solid red;
        width: 100%;

        .refresh_box {
            width: 100%;
            height: 100%;
        }
    }
}
</style>