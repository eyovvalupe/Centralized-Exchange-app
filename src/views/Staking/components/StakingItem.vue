<template>
    <div class="staking_item">
        <div v-if="list.length" v-for="(item, i) in list"
            class="w-full h-[7.32rem] bg-color6 mb-[0.4rem] rounded-[0.2rem] relative overflow-hidden">
            <BackgroundImg />
            <BackgroundImg1 />
            <div class="w-full h-full px-[0.32rem] py-[0.4rem] flex flex-col justify-between">
                <div class="flex flex-col relative">
                    <div class="text-[0.36rem] font-semibold mb-[0.32rem]">BTC+ETH+XRP</div>
                    <div class="text-color2 font-bold">{{ t('Investment amount: ') + '3500-99999999' }}</div>
                </div>
                <div class="flex flex-col relative">
                    <div class="flex mb-[0.2rem]">
                        <div class="mr-[0.2rem]" style="color: var(--ex-blue);">{{ t('Yield') }}</div>
                        <div class="w-max px-[0.15rem] h-[0.4rem] flex items-center rounded-[0.2rem] text-[0.24rem]"
                            style="background-color: var(--ex-red);">{{ t('Duration:') + ' ' + 7 + t('Days') }}</div>
                    </div>
                    <div class="text-[0.38rem] font-bold mb-[0.2rem]">0.3-0.4%/{{ t('Day') }}</div>
                    <Button class="submit" @click="jump('portfolioTrade')"><span class="text-[0.32rem] font-bold">{{ '+'
                        + t('Participate')
                            }}</span></Button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
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
    padding: 0 0.2rem;

    .submit {
        background-color: var(--ex-primary-color);
        border-radius: 0.2rem;
        height: 0.96rem;
    }
}
</style>