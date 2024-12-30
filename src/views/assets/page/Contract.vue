<!-- 合约账户 -->
<template>
    <div class="page_assets_contract">
        <!-- 总览 -->
        <OverviewCard>
            <div class="top">
                <div class="title">合约资产({{ currency }})</div>
                <div class="eyes" @click="hidden = !hidden">
                    <img :src="getStaticImgUrl('/static/img/common/open_eye_white.svg')" v-show="!hidden" />
                    <img :src="getStaticImgUrl('/static/img/common/close_eye_white.svg')" v-show="hidden" />
                </div>
            </div>
            <div class="money">
                <span>{{ hidden ? '********' : totalFutures }}</span>
            </div>
            <div class="navs">
                <div class="nav">
                    <div class="nav_label">{{ $t('合约账户余额') }}</div>
                    <div class="num">{{ hidden ? '********' : assets.futures || '0' }}</div>
                </div>
                <div class="line" />
                <div class="nav">
                    <div class="nav_label">{{ $t('合约持仓金额') }}</div>
                    <div class="num">{{ hidden ? '********' : assets.futures_value || '0' }}</div>
                </div>
            </div>
        </OverviewCard>
        <div class="subtitle">我的持仓</div>
        <Positions />
    </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { ref, computed } from "vue"
import store from "@/store"
import OverviewCard from './components/OverviewCard'
import Positions from "../../Trade2/contract/Positions.vue"
import Decimal from 'decimal.js';
const currency = computed(() => (store.state.accountCurrencyMap.futures || ''))
const hidden = ref(false)

const assets = computed(() => store.state.assets || {})
const totalFutures = computed(() => {
    let futures_value = assets.value.futures_value || 0
    let futures = assets.value.futures || 0
    return new Decimal(futures_value).add(futures)
})
</script>

<style lang="less" scoped>
.page_assets_contract {
    padding: 0.32rem 0;

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
        padding: 0 0.32rem;
    }

}
</style>