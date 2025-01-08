<template>
    <div class="w-full bg-color6 rounded-[0.32rem] mb-[0.28rem] pb-[0.12rem] pt-[0.24rem]" :class="i == list.length -1 ? 'mb-[3rem]' : ''" v-for="(item, i) in list">
        <div class="flex justify-between mx-[0.28rem] mb-[0.32rem]">
            <div class="flex flex-col justify-between">
                <div class="flex">
                    <div class="mb-[0.16rem] w-[0.4rem] h-[0.4rem] relative" v-for="(item, i) in iconList"
                        :class="i == 1 ? 'left-[-0.08rem]' : i == 2 ? 'left-[-0.16rem]' : ''"><img
                            :src="getStaticImgUrl(`/static/img/crypto/${item}.svg`)" alt="img" /></div>
                </div>
                <div class="text-[0.32rem]">BTC+USDT</div>
            </div>
            <div class="flex flex-col justify-between text-end">
                <div class="text-[0.28rem] text-color2">{{ $t('收益') }}</div>
                <div class="text-[0.32rem] text-primary">+4000 <span class="text-color text-[0.24rem]">USDT</span></div>
            </div>
        </div>
        <div class="flex flex-col bg-color2 justify-between p-[0.28rem] rounded-[0.32rem] mx-[0.12rem]">
            <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                <div class="text-[0.28rem] text-color2">{{ $t('运行时长') }}</div>
                <div class="text-[0.28rem]">{{ 7 + $t('天') }}</div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                <div class="text-[0.28rem] text-color2">{{ $t('收益率') }}</div>
                <div class="text-[0.28rem]">{{ '0.2-0.5' + '%' }}</div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                <div class="text-[0.28rem] text-color2">{{ $t('投资金额') }}</div>
                <div class="text-[0.28rem]">{{ '2000-999999' + ' ' + 'USDT' }}</div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color2">{{ $t('手续费') }}</div>
                <div class="text-[0.28rem]">{{ 0 + ' ' + 'USDT' }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js";

const props = defineProps({
    list: {
        type: Array,
        default: []
    }
})

const iconList = ['BTC', 'USDT']
</script>