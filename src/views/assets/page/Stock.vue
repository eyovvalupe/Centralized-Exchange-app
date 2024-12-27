<!-- 股票账户 -->
<template>
    <div class="page_assets_stock">
        <!-- 总览 -->
        <OverviewCard>
            <div class="top">
                <div class="title">股票资产({{ currency }})</div>
                <div class="eyes" @click="hidden = !hidden">
                    <img :src="getStaticImgUrl('/static/img/assets/eye_o.svg')" v-show="!hidden" />
                    <img :src="getStaticImgUrl('/static/img/assets/closed_eye.svg')" v-show="hidden" />
                </div>
            </div>
            <div class="money">
                <span>{{ hidden ? '********' : stockAmount }}</span>
            </div>
            <div class="navs">
                <div class="nav">
                    <div class="nav_label">股票账户余额</div>
                    <div class="num">{{ hidden ? '********' : assets.stock }}</div>
                </div>
                <div class="line"></div>
                <div class="nav" @click="jump('loanList', { tab: 1 })">
                    <div class="nav_label">股票持仓金额</div>
                    <!-- <div class="hint" v-if="loanNum">{{ loanNum }}</div> -->
                    <div class="num">{{ hidden ? '********' : assets.stock_value }}</div>
                </div>
            </div>

            <!-- 借贷按钮 -->
            <!-- <div class="loan_btn" @click="jump('loanList')">借贷申请</div>
            <div class="loan_max">可借资金 {{ hidden ? '***' : maxLoan }}</div> -->
        </OverviewCard>

        <div class="subtitle">我的持仓</div>
        <Positions />
    </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { ref, computed } from "vue"
import router from "@/router"
import store from "@/store"
import Decimal from 'decimal.js';
import { _loanPara } from '@/api/api'
import Positions from "../../Trade2/components/Positions.vue"
import OverviewCard from './components/OverviewCard'

const hidden = ref(false)
const assets = computed(() => store.state.assets || {})
console.log(assets)
const currency = computed(() => (store.state.accountCurrencyMap.stock || ''))

const mainWallet = computed(() => (store.state.wallet || []).find(a => a.currency == currency) || {}) // 主钱包

const stockAmount = computed(() => {
    if (assets.stock && assets.stock_value) {
        new Decimal(assets.stock).add(assets.stock_value)
    }
    return '--'
})
const maxLoan = computed(() => {
    if (lever.value.length) {
        const x = lever.value[lever.value.length - 1]
        return new Decimal(mainWallet.value.amount).mul(x)
    } else {
        return '--'
    }
})
const loanNum = computed(() => store.state.loanNum || 0)

const jump = (name, query) => {
    router.push({
        name,
        query
    })
}



// 获取借贷配置
const lever = ref([])
try {
    lever.value = JSON.parse(sessionStorage.getItem('lever') || '[]')
} catch { }
const getConfig = () => {
    // _loanPara().then(res => {
    //     if (res.code == 200) {
    //         lever.value = res.data.lever.split(',')
    //         sessionStorage.setItem('lever', JSON.stringify(lever.value))
    //     }
    // })
}
getConfig()
</script>

<style lang="less" scoped>
.page_assets_stock {
    padding-top: 0.32rem;

    .top {
        font-size: 0.28rem;
        font-weight: 400;
        display: flex;
        height: 0.32rem;
        align-items: center;
        line-height: 0.32rem;

        .title {
            color: #fff;
            margin-right: 0.12rem;
            font-size: 0.3rem;

            span {
                font-size: 0.24rem;
            }
        }

        .eyes {
            width: 0.32rem;
            height: 0.32rem;
            color: #fff;
        }
    }

    .money {
        color: #FFF;
        font-family: "PingFang SC";
        font-size: 0.52rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.6rem;
        margin-top: 0.26rem;
    }

    .navs {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1.32rem;
        background-color: var(--ex-bg-color);
        border-radius: 0.32rem;
        margin-top: 0.34rem;

        .line {
            width: 1px;
            height: 0.76rem;
            background-color: #EFF3F8;
        }

        .nav {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        .nav_label {
            color: var(--ex-text-color3);
            font-size: 0.28rem;
            line-height: 100%;
        }

        .num {
            color: var(--ex-text-color);
            font-size: 0.3rem;
            font-weight: 600;
            line-height: 0.3rem;
            margin-top: 0.2rem;

        }
    }

    .subtitle {
        line-height: 0.32rem;
        color: var(--ex-text-color);
        font-weight: 600;
        font-size: 0.32rem;
        margin: 0.5rem 0.32rem 0 0.32rem;
    }

    :deep(.positions) {
        padding-bottom: 0px;
    }
}
</style>