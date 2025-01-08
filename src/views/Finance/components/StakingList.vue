<template>
    <div class="w-full mt-[0.48rem] mb-[2rem]">
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

        

        <StakingItem :list="[1, 2]" />
    </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { getStaticImgUrl } from "@/utils/index.js";
import StakingItem from './StakingItem.vue';

const { t } = useI18n();
</script>