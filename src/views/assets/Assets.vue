<!-- 资产页 -->
<template>
    <div class="page page_assets">
        <PullRefresh :disabled="disabled" class="refresh_box" v-model="loading" @refresh="onRefresh">

            <!-- <div class="page_title">
                <span></span>
                <div class="record_icon_box" @click="openRecordPopup">
                    <div class="record_icon">
                        <img src="/static/img/user/withdraw_record_icon.png" alt="img">
                    </div>

                    <span>记录</span>
                </div>
            </div> -->
            <div style="height:0.4rem"></div>

            <Tabs v-if="pageLoading" class="tab_content" :lazy-render="false" v-model:active="active" type="card"
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
                        <Overview @openRecordPopup="openRecordPopup" ref="overviewRef"
                            @setLoading="val => loading = val" v-if="active == 'overview'" />
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
                        <Cash ref="cashRef" @setLoading="val => loading = val" v-if="active == 'cash'" />
                    </div>
                </Tab>
                <Tab name="stock">
                    <template #title>
                        <div class="mytab_title" :class="{ 'mytab_title_active': active == 'stock' }">
                            <div class="mytab_title_icon" v-show="active != 'stock'">
                                <img v-show="active != 'stock'" src="/static/img/assets/stock_icon.svg" alt="img">
                            </div>
                            <span v-show="active == 'stock'">股票</span>
                        </div>
                    </template>
                    <div class="tab_body">
                        <Stock ref="stockRef" @setLoading="val => loading = val" v-if="active == 'stock'" />
                    </div>
                </Tab>
                <Tab name="contract">
                    <template #title>
                        <div class="mytab_title" :class="{ 'mytab_title_active': active == 'contract' }">
                            <div class="mytab_title_icon" v-show="active != 'contract'">
                                <img v-show="active != 'contract'" src="/static/img/assets/contract_icon.svg" alt="img">
                            </div>
                            <span v-show="active == 'contract'">合约</span>
                        </div>
                    </template>
                    <div class="tab_body">
                        <Contract />
                    </div>
                </Tab>
                <Tab name="ipo">
                    <template #title>
                        <div class="mytab_title" :class="{ 'mytab_title_active': active == 'ipo' }">
                            <div class="mytab_title_icon" v-show="active != 'ipo'">
                                <img v-show="active != 'ipo'" src="/static/img/assets/ipo_icon.svg" alt="img">
                            </div>
                            <span v-show="active == 'ipo'">IPO</span>
                        </div>
                    </template>
                    <div class="tab_body">
                        <IPO ref="ipoRef" @setLoading="val => loading = val" v-if="active == 'ipo'" />
                    </div>
                </Tab>
            </Tabs>
        </PullRefresh>

        <!-- 记录弹窗 -->
        <RecordList ref="RecordListRef" />

        <!-- 充提记录 -->
        <HintBlock v-if="route.name == 'assets' && hintNum" />
    </div>
</template>

<script setup>
import { Tab, Tabs, PullRefresh } from "vant"
import { ref, onMounted, computed } from "vue"
import Overview from "./page/Overview.vue"
import Cash from "./page/Cash.vue"
import Stock from "./page/Stock.vue"
import IPO from "./page/IPO.vue"
import Contract from "./page/Contract.vue"
import RecordList from "@/components/RecordList.vue"
import store from "@/store"
import router from "@/router"
import HintBlock from "@/components/HintBlock.vue"
import { useRoute } from "vue-router"

const route = useRoute()
const hintNum = computed(() => store.state.hintNum || 0)

const RecordListRef = ref()
const active = ref('overview')
const loading = ref(false)
const disabled = ref(false)
const pageLoading = ref(false)

const openRecordPopup = () => {
    router.push({
        name: 'recordList',
        query: {
            tab: 0
        }
    })
}

const overviewRef = ref()
const cashRef = ref()
const onRefresh = () => {
    switch (active.value) {
        case 'overview':
            overviewRef.value && overviewRef.value.refresh()
            break
        case 'cash':
            cashRef.value && cashRef.value.refresh()
            break
    }
}

onMounted(() => {
    // 下拉刷新状态监听
    setTimeout(() => {
        // const bodys = document.querySelectorAll('.tab_body')
        // bodys.forEach(item => {
        // item.addEventListener('scroll', (e) => {
        //     console.error(e.target.scrollTop)
        //     if (e.target.scrollTop > 0) {
        //         disabled.value = true
        //     } else {
        //         disabled.value = false
        //     }
        // })
        // })
    }, 500)
})

// 预加载页面
store.commit('setPageLoading', true)
const loadingList = [
    import('@/views/Assets/Loan.vue'),
    import('@/views/Assets/TopUp.vue'),
    import('@/views/Assets/Transfer.vue'),
    import('@/views/Assets/Withdraw.vue'),
    import('@/views/Assets/Swap.vue'),
]
Promise.all(loadingList).finally(() => {
    store.commit('setPageLoading', false)
    setTimeout(() => {
        pageLoading.value = true
    }, 100)
})

</script>

<style lang="less" scoped>
.page_assets {
    // padding: 0.24rem 0 0 0;
    height: 100%;
    overflow-y: auto;

    .page_title {
        padding: 0.3rem 0.24rem 0 0.32rem;
        // height: 1.12rem;
        font-weight: 600;
        color: #0D0D12;
        line-height: 0.5rem;
        font-size: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        // margin-bottom: 0.1rem;
        position: relative;

        .record_icon_box {
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 0;
            font-size: 0.28rem;
            font-weight: 400;
            color: #0953fa;
            font-size: 0.24rem;

            .record_icon {
                background-color: #EDEDED;
                width: 0.52rem;
                height: 0.52rem;
                padding: 0.06rem;
                border-radius: 50%;
                margin-right: 0.04rem;

                &:active {
                    background-color: #EAF0F3;
                }
            }
        }
    }

    .tab_content {
        :deep(.van-tabs__nav--card) {
            border: none;
        }

        :deep(.van-tab--card) {
            border-right: none;
            color: #061023;
            // background-color: #f5f5f5;
        }

        :deep(.van-tab--card.van-tab--active) {

            background-color: #F6F8FF;
            border-radius: 0.3rem;
            color: #014CFA;
            font-weight: 500
        }

        :deep(.van-tab--shrink) {
            padding: 0 0.3rem;
        }

        :deep(.van-tabs__wrap) {
            height: 0.8rem;
            padding-bottom: 0.34rem;
        }

        :deep(.van-tabs__nav--card) {
            height: 0.6rem;
        }

        :deep(.van-tab) {
            line-height: 0.6rem;
            font-size: 0.28rem;
        }

    }

    .mytab_title {
        display: flex;
        align-items: center;
        transition: all ease .3s;

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
        // height: calc(var(--app-height) - 3.7rem);
        // width: 100%;
        // overflow-y: auto;
    }

    .refresh_box {
        width: 100%;

    }
}
</style>