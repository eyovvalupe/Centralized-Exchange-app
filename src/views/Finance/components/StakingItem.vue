<template>
    <div class="staking_item">
        <div v-if="list.length" v-for="(item, i) in list" class="w-full bg-color6 mb-[0.24rem] rounded-[0.2rem]">
            <div class="w-full h-full px-[0.12rem] pt-[0.4rem] flex flex-col">
                <div class="flex flex-col px-[0.16rem] mb-[0.3rem] relative">
                    <div class="text-[0.36rem] mb-[0.15rem]">BTC+USDT</div>
                    <div class="text-color2 text-[0.28rem]">{{ t('finance.portfolio_investment_amt') + ': ' +
                        '3500-99999999'
                        }}</div>
                </div>
                <!-- 加密代币价格 -->
                <div class="flex w-full bg-color py-[0.2rem] rounded-[0.32rem] mb-[0.12rem]">
                    <div class="flex flex-col px-[0.28rem] w-1/2">
                        <div class="flex items-center mb-[0.1rem]">
                            <div class="w-[0.35rem] h-[0.35rem] mr-[0.1rem]"><img
                                    :src="getStaticImgUrl('/static/img/crypto/BTC.svg')" alt="img" /></div>
                            <div class="text-color3 text-[0.28rem]">BTC</div>
                        </div>
                        <div class="text-[0.28rem] ml-[0.45rem]">990331.57</div>
                    </div>
                    <div class="flex flex-col px-[0.28rem] w-1/2">
                        <div class="flex items-center mb-[0.1rem]">
                            <div class="w-[0.35rem] h-[0.35rem] mr-[0.1rem]"><img
                                    :src="getStaticImgUrl('/static/img/crypto/ETH.svg')" alt="img" /></div>
                            <div class="text-color3 text-[0.28rem]">ETH</div>
                        </div>
                        <div class="text-[0.28rem] ml-[0.45rem]">3666.82</div>
                    </div>
                </div>
                <div class="w-full h-[3.1rem] bg-color flex rounded-[0.32rem] relative overflow-hidden mb-[0.2rem]">
                    <BackgroundImg />
                    <BackgroundImg1 />
                    <div class="w-1/2 h-full flex flex-col px-[0.28rem] py-[0.2rem]">
                        <div class="flex mb-[0.2rem] relative">
                            <div class="text-[0.28rem] text-color2 mr-[0.2rem]">{{ t('finance.portfolio_yield') }}
                            </div>
                        </div>
                        <div class="text-[0.24rem] mb-[0.2rem] relative">0.3-0.4%/{{
                            t('finance.portfolio_day') }}</div>
                    </div>
                    <div class="w-1/2 h-full flex flex-col px-[0.28rem] py-[0.2rem]">
                        <div class="flex mb-[0.2rem] relative">
                            <div class="text-[0.28rem] text-color2 mr-[0.2rem]">{{ t('finance.portfolio_duration') }}
                            </div>
                        </div>
                        <div class="text-[0.24rem] mb-[0.2rem] relative">7{{
                            t('finance.portfolio_day_multi') }}</div>
                    </div>
                </div>
                <Button class="submit" @click="jump('stake')"><span class="text-[0.32rem] font-bold">{{ '+'
                    + t('finance.portfolio_participate')
                        }}</span></Button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js";
import SparkLine from '@/components/SparkLine.vue';
import { useI18n } from 'vue-i18n';
import { Button } from 'vant';
import BackgroundImg from './BackgroundImg.vue';
import router from "@/router";
import BackgroundImg1 from './BackgroundImg1.vue';

const jump = (val) => {
    router.push({ name: val })
}
const { t } = useI18n();
const props = defineProps({
    list: {
        type: Array,
        default: []
    }
})
</script>
<style lang="less">
.staking_item {
    width: 100%;

    .submit {
        background-color: var(--ex-primary-color);
        border-radius: 0.2rem;
        height: 0.96rem;
        margin: 0 0.16rem 0.2rem 0.16rem;
    }
}
</style>