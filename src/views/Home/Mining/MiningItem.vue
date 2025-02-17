<!-- 质押挖矿元素 -->
<template>
    <div class="mining-item">
        <div class="name">ETH+MANA</div>
        <div class="info">
            <div>{{ t('finance.portfolio_investment_amt') }} 200-99999</div>
            <div class="icon">
                <CryptoIcon :name="'USDT'" />
            </div>
        </div>
        <div class="info-box">
            <div class="info-con">
                <div class="per">
                    <b>0.2-0.25</b>
                    <span>%/{{ t('finance.portfolio_day') }}</span>
                </div>
                <div class="time">
                    <div>{{ t('finance.portfolio_duration') }}</div>
                    <div class="num">7{{ t('finance.portfolio_day_multi') }}</div>
                </div>
            </div>
            <div class="line-box">
                <SparkLine v-if="loaded" :points="points" :ratio="1" />
            </div>
        </div>
        <div class="btn ripple-btn">{{ t('finance.portfolio_participate') }}</div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { getPoints } from "@/utils/index.js"
import SparkLine from "@/components/SparkLine.vue";
import { ref, onMounted } from "vue"

const points = ref(getPoints('id-123', 80))
const { t } = useI18n();

const loaded = ref(false) // 模拟异步
onMounted(() => {
    setTimeout(() => {
        loaded.value = true
    }, 200)
})
</script>

<style lang="less">
.mining-item {
    width: 4.6rem;
    height: 4.92rem;
    border-radius: 0.32rem;
    background-color: var(--ex-bg-white2);
    flex-shrink: 0;
    padding: 0.24rem 0.12rem 0.2rem 0.12rem;

    .name {
        padding-left: 0.16rem;
        font-size: 0.28rem;
        font-weight: 600;
        line-height: 1;
        margin-bottom: 0.18rem;
    }

    .info {
        display: flex;
        align-items: center;
        color: var(--ex-text-color2);
        font-weight: 400;
        font-size: 0.24rem;
        line-height: 1;
        margin-bottom: 0.3rem;
        padding-left: 0.16rem;

        .icon {
            margin-left: 0.08rem;
            width: 0.24rem;
            height: 0.24rem;
            border-radius: 50%;
            background-color: var(--ex-placeholder-color);
        }
    }

    .info-box {
        width: 100%;
        height: 2.48rem;
        border-radius: 0.32rem;
        background-color: var(--ex-bg-color3);
        overflow: hidden;

        .info-con {
            padding: 0.24rem 0.28rem 0.2rem 0.28rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: var(--ex-white);

            .per {
                font-size: 0.24rem;
                line-height: 0.4rem;

                b {
                    font-size: 0.3rem;
                    font-weight: 600;
                }
            }

            .time {
                font-size: 0.28rem;
                font-weight: 400;
                text-align: center;
                color: var(--ex-placeholder-color);

                .num {
                    color: var(--ex-white);
                    margin-top: 0.18rem;
                }
            }
        }

        .line-box {
            width: 100%;
            height: 1.3rem;
        }
    }

    .btn {
        width: 4.04rem;
        height: 0.62rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.32rem;
        background-color: var(--ex-primary-color);
        color: var(--ex-white);
        font-size: 0.24rem;
        font-weight: 400;
        margin: 0.2rem auto 0 auto;
    }
}
</style>