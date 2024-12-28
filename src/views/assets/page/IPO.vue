<!-- 股票账户 -->
<template>
    <div class="page_assets_stock">
        <!-- 总览 -->
        <OverviewCard>
            <div class="top">
                <div class="title">冻结金额({{ currency }})</div>
                <div class="eyes" @click="hidden = !hidden">
                    <img :src="getStaticImgUrl('/static/img/assets/eye_o.svg')" v-show="!hidden" />
                    <img :src="getStaticImgUrl('/static/img/assets/closed_eye.svg')" v-show="hidden" />
                </div>
            </div>
            <div class="money">
                <span>{{ hidden ? '********' : '0.00' }}</span>
            </div>
            <div class="navs">
                <div class="nav">
                    <div class="nav_label">盈利金额</div>
                    <div class="num text-success">{{ hidden ? '********' : '--' }}</div>
                </div>
                <div class="line"></div>
                <div class="nav">
                    <div class="nav_label">投资金额</div>
                    <div class="num">{{ hidden ? '********' : '--' }}</div>
                </div>
                <div class="line"></div>
                <div class="nav">
                    <div class="nav_label">中签率</div>
                    <div class="num">{{ hidden ? '********' : '--' }}</div>
                </div>
            </div>
        </OverviewCard>

        <div class="subtitle">我的持仓</div>
        <IPOStock ref="IPOStockRef" />

    </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { ref, computed, onMounted } from "vue"
import store from "@/store"
import Decimal from 'decimal.js';
import { _loanPara } from '@/api/api'
import IPOStock from "../../Trade2/pages/IPOStock.vue"
import OverviewCard from './components/OverviewCard'

const hidden = ref(false)
const assets = computed(() => store.state.assets || {})
const currency = computed(() => (store.state.accountCurrencyMap.ipo || ''))

const mainWallet = computed(() => (store.state.wallet || []).find(a => a.currency == currency) || {}) // 主钱包

const IPOStockRef = ref(null)
onMounted(() => {
    if (IPOStockRef.value) {
        IPOStockRef.value.init()
    }
})
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
            color: var(--ex-white);
            margin-right: 0.12rem;
            font-size: 0.3rem;

            span {
                font-size: 0.24rem;
            }
        }

        .eyes {
            width: 0.32rem;
            height: 0.32rem;
            color: var(--ex-white);
        }
    }

    .money {
        color: var(--ex-white);
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
            background-color: var(--ex-bg-color3);
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