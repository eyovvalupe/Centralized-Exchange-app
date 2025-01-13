<template>
    <div class="w-full bg-color6 rounded-[0.32rem] mb-[0.28rem] pb-[0.12rem] pt-[0.24rem]"
        :class="i == list.length - 1 ? 'mb-[3rem]' : ''" v-for="(item, i) in list" @click="jump(item)">
        <div class="flex justify-between mx-[0.28rem] mb-[0.3rem]">
            <div class="flex flex-col justify-between">
                <div class="flex">
                    <div class="mb-[0.16rem] w-[0.4rem] h-[0.4rem] relative" v-for="(item, i) in iconList"
                        :class="i == 1 ? 'left-[-0.08rem]' : i == 2 ? 'left-[-0.16rem]' : ''"><img
                            v-lazy="getStaticImgUrl(`/static/img/crypto/${item}.svg`)" alt="img" /></div>
                </div>
                <div class="text-[0.32rem]">BTC+USDT</div>
            </div>
            <div class="flex flex-col justify-between text-end">
                <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_mining_revenue') }}</div>
                <div class="text-[0.32rem] text-primary">+4000 <span class="text-color text-[0.24rem]">USDT</span></div>
            </div>
        </div>
        <div class="flex flex-col bg-color2 justify-between p-[0.28rem] rounded-[0.32rem] mx-[0.12rem]">
            <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_mining_noti_duration') }}</div>
                <div class="text-[0.28rem]">{{ 7 + $t('finance.portfolio_day_multi') }}</div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_yield') }}</div>
                <div class="text-[0.28rem]">{{ '0.2-0.5' + '%' }}</div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_mining_investment') }}</div>
                <div class="text-[0.28rem]">{{ '2000-999999' + ' ' + 'USDT' }}</div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_mining_fee') }}</div>
                <div class="text-[0.28rem]">{{ 0 + ' ' + 'USDT' }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js";
import router from "@/router";
import { _myEarn } from "@/api/api";
import { onMounted } from "vue";

const props = defineProps({
    list: {
        type: Array,
        default: []
    }
})

const jump = (item) => {
    router.push({
        name: 'stakingOrderDetail',
        query: {
            id: 'oiuoiuuoiu'
        }
    })
}

const iconList = ['BTC', 'USDT']

const loading = ref(false);
const getData = () => {
    if (loading.value) return;
    loading.value = true;
    _myEarn().then(res => console.log(res.data)).catch(err => console.error(err)).finally(() => loading.value = false)
}

onMounted(() => {
    getData();
})
</script>