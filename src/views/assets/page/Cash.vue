<!-- 现金账户 -->
<template>
    <div class="page_assets_cash">
        <!-- 总览 -->
        <div class="overview" :style="{ backgroundImage: `url(/static/img/assets/bg_2.png)` }">
            <div class="top">
                <div class="title">总资金</div>
                <div class="eyes" @click="hidden = !hidden">
                    <Icon v-show="!hidden" name="eye-o" />
                    <Icon v-show="hidden" name="closed-eye" />
                </div>
            </div>
            <div class="money">
                <span>{{ hidden ? '****' : (mainWallet.amount || '0.00') }}</span>
            </div>
            <div class="navs">
                <div class="nav">
                    <div>借贷</div>
                    <div class="num">{{ hidden ? '***' : (assets.loan || '0.00') }}</div>
                </div>
                <div class="line"></div>
                <div class="nav">
                    <div>冻结</div>
                    <div class="num">{{ hidden ? '****' : (assets.frozen || '0.00') }}</div>
                </div>
            </div>
        </div>
        <div class="cash_tab_content">
            <div class="cash_tab_item" v-for="(item, i) in showWallet" :key="i">
                <span>{{ item.currency }}</span>
                <span>{{ item.amount }}</span>
            </div>
        </div>


        <!-- 充提记录 -->
        <div class="fix_block">
            <div class="ripple_button fix_block_header" @click="openRecord">
                <Icon name="arrow-up" class="arrow" :class="{ 'arrow_active': openList }" />
                <span>充提记录</span>
            </div>

            <div class="cash_tab_content list" :class="{ 'open_list': openList }">
                <RechargeItem v-for="i in 2" :key="i" />
                <WithdrawItem v-for="i in 2" :key="i" />
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { Icon } from "vant"
import { _depositList } from "@/api/api"
import store from "@/store"
import RechargeItem from "./components/RechargeItem"
import WithdrawItem from "./components/WithdrawItem"

const emits = defineEmits(['setLoading'])
const token = computed(() => store.state.token || '')

const hidden = ref(false)
const openList = ref(false)


// 刷新现金钱包
const assets = computed(() => store.state.assets || {})
const showWallet = computed(() => (store.state.wallet || []).filter(a => a.currency != 'main')) // 除了主钱包外的其他钱包
const mainWallet = computed(() => (store.state.wallet || []).find(a => a.currency == 'main') || {}) // 除了主钱包外的其他钱包
const getAssets = () => {
    if (!token.value) return
    // emits('setLoading', true)
    store.dispatch('updateWallet').finally(() => {
        emits('setLoading', false)
    })
}


// 获取充值记录
const getDepositList = () => {
    _depositList().then(res => {
        console.error('充值记录', res)
    })
}

// 打开记录
const openRecord = () => {
    openList.value = !openList.value
    if (openList.value) {
        getDepositList()
    }
}

onMounted(() => {
    getAssets()
})

const refresh = () => {
    openList.value = false
    getAssets()
}
defineExpose({
    refresh
})
</script>

<style lang="less" scoped>
.page_assets_cash {
    height: 100%;
    border-top: 1px solid rgba(0, 0, 0, 0);
    position: relative;
    padding-bottom: 1.5rem;

    .overview {
        background-size: 100% 100%;
        margin: 0.2rem 0.32rem 0.24rem 0.32rem;
        padding: 0.4rem 0.3rem 0.24rem 0.3rem;

        .top {

            font-size: 0.28rem;
            font-weight: 400;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .title {
                color: #fff;
                margin-right: 0.32rem;
            }

            .eyes {
                width: 0.32rem;
                height: 0.32rem;
                color: #fff;
                font-size: 0.32rem;
            }

        }

        .money {
            font-size: 0.68rem;
            font-weight: 500;
            color: #fff;
            margin-top: 0.3rem;
            margin-bottom: 0.25rem;
        }

        .navs {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            line-height: 0.44rem;

            .line {
                width: 1px;
                height: 0.44rem;
                background-color: rgba(255, 255, 255, 0.4);
            }

            .nav {
                color: #fff;
                font-weight: 400;
                font-size: 0.24rem;
                text-align: center;
                flex: 1;
            }
        }
    }

    .cash_tab_content {
        padding: 0 0.32rem 0.32rem 0.32rem;

        .cash_tab_item {
            height: 1.2rem;
            border-bottom: 1px solid #EAEAEA;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }

    .fix_block {
        width: 100%;
        position: absolute;
        z-index: 99;
        left: 0;
        bottom: 0;
        border-top-left-radius: 0.4rem;
        border-top-right-radius: 0.4rem;
        background-color: #fff;
        box-shadow: -2px 0 5px #ddd;

        .fix_block_header {
            height: 0.8rem;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding: 0 0.4rem;
            font-size: 0.3rem;
            overflow: hidden;

            .arrow {
                margin-right: 0.2rem;
                transition: all ease .8s;
            }

            .arrow_active {
                transform: rotate(180deg);
            }
        }

        .list {
            height: 0;
            padding: 0;
            overflow: hidden;
            transition: all ease .3s;
        }

        .open_list {
            height: calc(100vh - 5.5rem);
            padding: 0 0.32rem 0.32rem 0.32rem;
            overflow-y: auto;
        }
    }
}
</style>