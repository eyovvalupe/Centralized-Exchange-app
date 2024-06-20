<!-- 资产页 -->
<template>
    <div class="page page_assets">
        <PullRefresh :disabled="disabled" class="refresh_box" v-model="loading" @refresh="onRefresh">
            <div class="page_title">
                <span>资产</span>
                <!-- 客服 -->
                <div class="customer">
                    <img src="/static/img/common/server.png" alt="🔍">
                </div>
            </div>

            <Tabs v-if="pageLoading" class="tab_content" :lazy-render="false" v-model:active="active" type="card" sticky
                animated shrink>
                <Tab title="总资产" name="overview">
                    <div class="tab_body" v-if="active == 'overview'">
                        <Overview />
                    </div>
                </Tab>
                <Tab title="现金账户" name="cash">
                    <div class="tab_body" v-if="active == 'cash'">
                        <Cash />
                    </div>
                </Tab>
                <Tab title="股票" name="stock">
                    <div class="tab_body">
                        <Stock v-if="active == 'stock'" />
                    </div>
                </Tab>
                <Tab title="合约" name="contract">
                    <div class="tab_body">
                        合约
                    </div>
                </Tab>
                <Tab title="IPO" name="ipo">
                    <div class="tab_body">
                        <IPO />
                    </div>
                </Tab>
            </Tabs>
        </PullRefresh>

    </div>
</template>

<script setup>
import { Tab, Tabs, PullRefresh } from "vant"
import { ref, onMounted } from "vue"
import Overview from "./page/Overview.vue"
import Cash from "./page/Cash.vue"
import Stock from "./page/Stock.vue"
import IPO from "./page/IPO.vue"

const active = ref('overview')
const loading = ref(false)
const disabled = ref(false)
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
        // 下拉刷新状态监听
        setTimeout(() => {
            const bodys = document.querySelectorAll('.tab_body')
            bodys.forEach(item => {
                item.addEventListener('scroll', (e) => {
                    if (e.target.scrollTop > 0) {
                        disabled.value = true
                    } else {
                        disabled.value = false
                    }
                })
            })
        }, 500)
    }, 100)
})
</script>

<style lang="less" scoped>
.page_assets {
    padding: 0;

    .page_title {
        padding: 0 0.24rem 0 0.32rem;
        height: 1.12rem;
        font-weight: 600;
        color: #0D0D12;
        line-height: 0.5rem;
        font-size: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.1rem;

        .customer {
            width: 0.8rem;
            height: 0.8rem;
        }
    }

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
            height: 0.8rem;
            border-bottom: 1px solid #F6F8FF;
            padding-bottom: 0.2rem;
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
        height: calc(100vh - 3.5rem);
        width: 100%;
        overflow-y: auto;
    }

    .refresh_box {
        width: 100%;
        height: 100%;
    }
}
</style>