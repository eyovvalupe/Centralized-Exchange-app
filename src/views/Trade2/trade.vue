<!-- 交易 -->
<template>
    <div class="page page_trade">
        <PullRefresh :disabled="disabled" class="refresh_box" v-model="loading" @refresh="onRefresh">

            <!-- 头部 -->
            <div class="trade_header">
                <div class="menu">
                    <img src="/static/img/trade/open.png" alt="menu" />
                </div>

                <div class="tabs">
                    <div class="tab" :class="{ 'active_tab': activeTab == 1 }" @click="activeTab = 1">股票</div>
                    <div class="tab" :class="{ 'active_tab': activeTab == 2 }" @click="activeTab = 2">IPO</div>
                </div>

                <div class="value">
                    <div class="value_icon"><img src="/static/img/trade/value.png" alt="img" /></div>
                    <span>持仓价值</span>
                </div>
            </div>


            <transition :name="transitionName" v-if="pageActive">
                <div v-if="activeTab == 1" class="stock_block">
                    <StockBlock />
                </div>
                <div v-else-if="activeTab == 2" class="ipo_block">
                    <IpoBlock />
                </div>
            </transition>



        </PullRefresh>

        <!-- 左侧 -->

    </div>
</template>

<script setup>
import { PullRefresh, Popup } from "vant"
import { ref, watch, computed, onActivated, onDeactivated } from "vue"
import IpoBlock from "./pages/IpoBlock.vue"
import StockBlock from "./pages/StockBlock.vue"
import store from "@/store"

const token = computed(() => store.state.token)
if (token.value) {
    store.dispatch('updateWallet')
}

// 下拉刷新
const disabled = ref(false)
const loading = ref(false)
const onRefresh = () => {
    console.error('下拉刷新')
}

// 一级导航
const activeTab = ref(1) // 1-股票 2-IPO
const transitionName = ref('slide-left')
watch([activeTab], ([newActive]) => {
    if (newActive === 2) {
        transitionName.value = 'slide-right';
    } else if (newActive === 1) {
        transitionName.value = 'slide-left';
    }
});


const pageActive = ref(true)
onActivated(() => {
    pageActive.value = true
})
onDeactivated(() => {
    pageActive.value = false
})
</script>

<style lang="less" scoped>
.page_trade {
    height: 100%;
    overflow-y: auto;

    .trade_header {
        height: 1.12rem;
        padding: 0 0.32rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .menu {
            width: 0.4rem;
            height: 0.4rem;
        }

        .tabs {
            flex: 1;
            display: flex;
            align-items: center;
            padding: 0 0.4rem;

            .tab {
                font-size: .28rem;
                color: #061023;
                padding: 0 .4rem;
                height: .6rem;
                border-radius: .48rem;
                display: flex;
                align-items: center;
                cursor: pointer;
            }

            .active_tab {
                color: #014cfa;
                background-color: #f6f8ff;
            }
        }

        .value {
            display: flex;
            align-items: center;
            color: #0953fa;
            font-size: 0.24rem;
            font-weight: 400;

            .value_icon {
                width: 0.52rem;
                height: 0.52rem;
            }
        }
    }
}
</style>