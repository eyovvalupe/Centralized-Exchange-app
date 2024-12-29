<!-- 合约账户 -->
<template>
    <div class="page_assets_contract">
        <!-- 总览 -->
        <OverviewCard>
            <div class="top">
                <div class="title">盈利资金({{ currency }})</div>
                <div class="eyes" @click="hidden = !hidden">
                    <img :src="getStaticImgUrl('/static/img/common/open_eye_white.svg')" v-show="!hidden" />
                    <img :src="getStaticImgUrl('/static/img/common/close_eye_white.svg')" v-show="hidden" />
                </div>
            </div>
            <div class="money">
                <span>{{ hidden ? '********' : profitableFunds }}</span>
            </div>
            <div class="navs">
                <div class="nav_label">{{ $t('持仓金额') }}</div>
                <div class="num">{{ hidden ? '********' : assets.aiquant_value || '0' }}</div>
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
import Positions from "../../Trade2/ai/Positions.vue"
const currency = computed(() => (store.state.accountCurrencyMap.aiquant || ''))
const hidden = ref(false)

const assets = computed(() => store.state.assets || {})
const profitableFunds = computed(() => {
    return "0.00"
})
</script>

<style lang="less" scoped>
.page_assets_contract {
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
        justify-content: space-between;
        height: 0.9rem;
        background-color: #fff;
        border-radius: 0.32rem;
        margin-top: 0.32rem;
        padding: 0 0.32rem;

        .nav_label {
            color: #8F92A1;
            font-size: 0.28rem;
            line-height: 100%;
        }

        .num {
            color: #061023;
            font-size: 0.3rem;
            font-weight: 600;
            line-height: 0.3rem;

        }
    }

    .subtitle {
        line-height: 0.32rem;
        color: #061023;
        font-weight: 600;
        font-size: 0.32rem;
        margin: 0.5rem 0.32rem 0 0.32rem;
    }

    :deep(.page_ai_position) {
        padding: 0 0.32rem;
    }

}
</style>