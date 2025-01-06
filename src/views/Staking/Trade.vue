<template>
    <div class="staking_mining w-full">
        <Top :title="t('Staking mining')" />
        <div class="px-[0.2rem] mt-[1.1rem]">
            <div class="px-[0.2rem] py-[0.32rem] bg-color6 flex flex-col mb-[0.2rem] rounded-[0.2rem]">
                <div class="mb-[0.32rem]">{{ t('Subscription Combination') }}</div>
                <div class="flex mb-[0.6rem]">
                    <div class="flex items-center" v-for="(item, i) in itemsMap" v-if="itemsMap.length">
                        <div class="flex flex-col bg-color px-[0.2rem] py-[0.32rem] rounded-[0.1rem]">
                            <div class="w-[0.96rem] h-[0.96rem] mb-[0.32rem]">
                                <img :src="getStaticImgUrl(`/static/img/crypto/${item.currency}.svg`)" alt="img" />
                            </div>
                            <div class="mb-[0.24rem]">{{ item.currency }}</div>
                            <div :class="item.ratio > 0 ? 'up' : 'down'">{{ item.ratio ? (item.ratio > 0 ? '+' +
                                item.ratio : item.ratio) + '%' : '--' }}</div>
                        </div>
                        <div class="text-color5 text-[0.32rem]" v-if="i < itemsMap.length - 1">+</div>
                    </div>
                </div>
                <!-- 挖矿详情 -->
                <div class="w-full flex flex-col">
                    <div class="w-full flex justify-between mb-[0.2rem]">
                        <div class="text-color3">{{ t('Operating Time') }}</div>
                        <div>{{ 15 + t('Days') }}</div>
                    </div>
                    <div class="w-full flex justify-between mb-[0.2rem]">
                        <div class="text-color3">{{ t('Yield') }}</div>
                        <div>0.3-0.4%</div>
                    </div>
                    <div class="w-full flex justify-between mb-[0.2rem]">
                        <div class="text-color3">{{ t('Estimated Revenue') }}</div>
                        <div>{{ 0.00 - 0.00 }}</div>
                    </div>
                    <div class="w-full flex justify-between mb-[0.2rem]">
                        <div class="text-color3">{{ t('Investment Amount') }}</div>
                        <div>{{ 3500 - 999999 }}</div>
                    </div>
                    <div class="w-full flex justify-between">
                        <div class="text-color3">{{ t('Handling Fee') }}</div>
                        <div>{{ 0 }}</div>
                    </div>
                </div>
            </div>

            <div class="px-[0.2rem] py-[0.32rem] bg-color6 flex flex-col mb-[0.48rem] rounded-[0.2rem]">
                <div class="mb-[0.48rem]">{{ t('Subscription Amount') }}</div>
                <div class="w-full flex justify-center text-[0.4rem] mb-[0.32rem]">{{ t('Estimated Subscription Amount')
                    }}</div>
                <div class="w-full flex justify-center text-[0.24rem] mb-[0.32rem] text-color2">{{ t('Account Balance:')
                    + 0 }}</div>
                <div class="bg-color p-[0.2rem] rounded-[0.1rem] mb-[0.6rem]">
                    <Stepper v-model="value" integer />
                </div>
                <Button class="submit"><span>{{ t('Subscription') }}</span></Button>
            </div>

            <div class="flex flex-col">
                <div class="text-[0.38rem] mb-[0.4rem]">{{ t('How to Operate?') }}</div>
                <div class="text-color5 leading-[0.5rem] mb-[0.32rem] text-[0.26rem]">
                    Access a series of exchanges, such as Coinbase, Huobi, Binance, KuCoin, YFX and other globally
                    renowned exchanges, and use algorithms to judge the trends of various currencies, monitor the
                    current market situation in real time. Buy and sell related currencies at high frequency within the
                    price range to achieve arbitrage and ensure that your profits are maximized.
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Top from '@/components/Top.vue';
import { useI18n } from 'vue-i18n';
import { getStaticImgUrl } from "@/utils/index.js";
import { Stepper, Button } from 'vant';

const { t } = useI18n();

const value = ref(0)

const itemsMap = [{
    currency: 'BTC',
    ratio: '0.8716'
},
{
    currency: 'ETH',
    ratio: '0.6114'
},
{
    currency: 'XRP',
    ratio: '-0.3395'
}]
</script>
<style lang="less">
.staking_mining {
    .van-stepper {
        width: 100%;
        display: flex;
        justify-content: space-between;

        button {
            width: 0.8rem;
            height: 0.8rem;
            background-color: var(--ex-bg-color6);
            border-radius: 0.1rem;
            font-size: 0.2rem;
        }

        input {
            background-color: var(--ex-bg-color);
            flex: 1;
            text-align: start;
            padding-left: 0.2rem;
            font-size: 0.32rem;
            height: 0.8rem;
        }
    }

    .submit {
        width: 100%;
        height: 0.96rem;
        border-radius: 0.2rem;
        background-color: var(--ex-primary-color);
        margin-bottom: 0.2rem;
    }
}
</style>