<!-- 资产页 -->
<template>
    <div class="page page_assets">
        <PullRefresh :disabled="disabled" class="refresh_box" v-model="loading" @refresh="onRefresh">

            <Tabs v-if="pageLoading" class="tab_content" :lazy-render="false" v-model:active="active" type="card" sticky
                animated shrink>
                <Tab :title="'总资产'" name="overview">
                    <!-- <template #title>
                        <div class="mytab_title" :class="{ 'mytab_title_active': active == 'overview' }">
                            <div class="mytab_title_icon">
                                <img v-show="active != 'overview'" src="/static/img/user/iden-1.png" alt="img">
                                <img v-show="active == 'overview'" src="/static/img/user/iden-2.png" alt="img">
                            </div>
                            <span v-show="active == 'overview'">总资产</span>
                        </div>
                    </template> -->

                    <div class="tab_body">
                        <Overview ref="overviewRef" @setLoading="val => loading = val" v-if="active == 'overview'" />
                    </div>
                </Tab>
                <Tab :title="'现金账户'" name="cash">
                    <!-- <template #title>
                        <div class="mytab_title" :class="{ 'mytab_title_active': active == 'cash' }">
                            <div class="mytab_title_icon">
                                <img v-show="active != 'cash'" src="/static/img/user/google-1.png" alt="img">
                                <img v-show="active == 'cash'" src="/static/img/user/google-2.png" alt="img">
                            </div>
                            <span v-show="active == 'cash'">现金账户</span>
                        </div>
                    </template> -->
                    <div class="tab_body">
                        <Cash v-if="active == 'cash'" />
                    </div>
                </Tab>
                <Tab :title="'股票'" name="stock">
                    <!-- <template #title>
                        <div class="mytab_title" :class="{ 'mytab_title_active': active == 'stock' }">
                            <div class="mytab_title_icon">
                                <img v-show="active != 'stock'" src="/static/img/user/iden-1.png" alt="img">
                                <img v-show="active == 'stock'" src="/static/img/user/iden-2.png" alt="img">
                            </div>
                            <span v-show="active == 'stock'">股票</span>
                        </div>
                    </template> -->
                    <div class="tab_body">
                        <Stock v-if="active == 'stock'" />
                    </div>
                </Tab>
                <Tab :title="'合约'" name="contract">
                    <!-- <template #title>
                        <div class="mytab_title" :class="{ 'mytab_title_active': active == 'contract' }">
                            <div class="mytab_title_icon">
                                <img v-show="active != 'contract'" src="/static/img/user/google-1.png" alt="img">
                                <img v-show="active == 'contract'" src="/static/img/user/google-2.png" alt="img">
                            </div>
                            <span v-show="active == 'contract'">合约</span>
                        </div>
                    </template> -->
                    <div class="tab_body">
                        合约
                    </div>
                </Tab>
                <Tab :title="'IPO'" name="ipo">
                    <!-- <template #title>
                        <div class="mytab_title" :class="{ 'mytab_title_active': active == 'ipo' }">
                            <div class="mytab_title_icon">
                                <img v-show="active != 'ipo'" src="/static/img/user/iden-1.png" alt="img">
                                <img v-show="active == 'ipo'" src="/static/img/user/iden-2.png" alt="img">
                            </div>
                            <span v-show="active == 'ipo'">IPO</span>
                        </div>
                    </template> -->
                    <div class="tab_body">
                        <IPO v-if="active == 'ipo'" />
                    </div>
                </Tab>
            </Tabs>
        </PullRefresh>

    </div>
</template>

<script setup>
import { Tab, Tabs, PullRefresh, Icon } from "vant"
import { ref, onMounted, onActivated } from "vue"
import Overview from "./page/Overview.vue"
import Cash from "./page/Cash.vue"
import Stock from "./page/Stock.vue"
import IPO from "./page/IPO.vue"

const active = ref('overview')
const loading = ref(false)
const disabled = ref(false)
const pageLoading = ref(false)

const onRefresh = () => {
    setTimeout(() => {
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


const overviewRef = ref()
onActivated(() => {
    overviewRef.value && overviewRef.value.getAssets()
})
</script>

<style lang="less" scoped>
.page_assets {
    padding: 0.24rem 0 0 0;

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
            // background-color: #f5f5f5;
            // border-radius: 0.3rem;
            // margin-left: 0.1rem;
            // transition: all ease .2s;
        }

        ::v-deep(.van-tab--card.van-tab--active) {
            // background-color: #014CFA;
            // color: #fff;

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

    .mytab_title {
        display: flex;
        align-items: center;

        >span {
            margin-left: 0.08rem;
        }

        .mytab_title_icon {
            width: 0.32rem;
            height: 0.32rem;
            line-height: 1;
            position: relative;
            top: -0.02rem;
        }
    }

    .mytab_title_active {
        .mytab_title_icon {
            width: 0.28rem;
            height: 0.28rem;
        }
    }

    .tab_body {
        height: calc(100vh - 2.5rem);
        width: 100%;
        overflow-y: auto;
    }

    .refresh_box {
        width: 100%;
        height: 100%;
    }
}
</style>