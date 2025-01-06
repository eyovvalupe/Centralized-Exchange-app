<template>
    <div class="staking_page">
        <Top :title="t('finance.portfolio_title')" :from="'first'">
            <template #left>
                <img :src="getStaticImgUrl('/static/img/trade/open.svg')" alt="img" />
            </template>
            <template #right>
                <div class="text-[0.32rem] text-primary" @click="jump('portfolioOrder')">
                    {{ t('finance.portfolio_order') }}
                </div>
            </template>
        </Top>
        <div class="mt-[1.34rem]">
            <!-- 头部 -->
            <div class="px-[0.4rem] flex mb-[0.5rem]">
                <div class="w-[1.2rem] h-[1.35rem] mr-[0.2rem]">
                    <img :src="getStaticImgUrl('/static/img/staking/usdt_coin.png')" alt="img" />
                </div>
                <div class="flex flex-col justify-center">
                    <div class="text-[0.4rem] text-color3 mb-[0.2rem]">USDT</div>
                    <div class="flex">
                        <div class="text-white text-[0.55rem] font-semibold mr-[0.2rem]">0.00</div>
                        <div class="w-max h-[0.6rem] text-[0.27rem] flex px-[0.15rem] items-center rounded-[0.2rem]"
                            style="background-color: var(--ex-red);">{{ t('finance.portfolio_revenue') }}</div>
                    </div>
                </div>
            </div>

            <!-- 加密代币价格 -->
            <div class="flex px-[0.2rem] mb-[0.6rem]">
                <div class="flex flex-col w-1/3">
                    <div class="text-color3 mb-[0.2rem] text-[0.28rem]">BTC</div>
                    <div class="flex items-center">
                        <div class="w-[0.35rem] h-[0.35rem] mr-[0.1rem]"><img :src="getStaticImgUrl('/static/img/crypto/BTC.svg')" alt="img" /></div>
                        <div class="text-[0.28rem]">990331.57</div>
                    </div>
                </div>
                <div class="flex flex-col w-1/3">
                    <div class="text-color3 mb-[0.2rem] text-[0.28rem]">ETH</div>
                    <div class="flex items-center">
                        <div class="w-[0.35rem] h-[0.35rem] mr-[0.1rem]"><img :src="getStaticImgUrl('/static/img/crypto/ETH.svg')" alt="img" /></div>
                        <div class="text-[0.28rem]">3666.82</div>
                    </div>
                </div>
                <div class="flex flex-col w-1/3">
                    <div class="text-color3 mb-[0.2rem] text-[0.28rem]">ATOM</div>
                    <div class="flex items-center">
                        <div class="w-[0.35rem] h-[0.35rem] mr-[0.1rem]"><img :src="getStaticImgUrl('/static/img/crypto/BTC.svg')" alt="img" /></div>
                        <div class="text-[0.28rem]">7.4072</div>
                    </div>
                </div>
            </div>

            <StakingItem :list="[1,2]"/>
        </div>
    </div>
</template>
<script setup>
import Top from '@/components/Top.vue';
import { useI18n } from 'vue-i18n';
import { getStaticImgUrl } from "@/utils/index.js";
import StakingItem from './components/StakingItem.vue';
import router from '@/router';

const { t } = useI18n();
const jump = (name) => {
    router.push({
        name
    })
}

</script>