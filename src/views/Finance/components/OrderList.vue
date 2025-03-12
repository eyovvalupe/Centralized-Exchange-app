<template>
    <div v-if="list.length">
        <div class="w-full bg-white2 rounded-[0.32rem] mb-[0.1rem] pb-[0.12rem] pt-[0.24rem]"
        :class="i == list.length - 1 ? 'mb-[0.5rem]' : ''" v-for="(item, i) in list" @click="jump(item)" >
            <div class="flex justify-between mx-[0.28rem] mb-[0.3rem]">
                <div class="flex flex-col justify-between">
                    <div class="flex">
                        <div class="mb-[0.16rem] w-[0.4rem] h-[0.4rem] relative" v-for="(symbolItem, i) in item.items"
                            :class="i ? '-ml-[0.1rem]' : ''">
                            <CryptoIcon :name="symbolItem.name.split('/')[0]" /></div>
                    </div>
                    <div class="text-[0.32rem]">{{ item.name }}</div>
                </div>
                <div class="flex flex-col justify-between text-end">
                    <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_mining_revenue') }}</div>
                    <div class="text-[0.32rem] text-primary">{{ item.earn > 0 ? '+' + item.earn : item.earn }} <span class="text-color text-[0.24rem]">USDT</span></div>
                </div>
            </div>
            <div class="flex flex-col bg-white2 justify-between p-[0.28rem] rounded-[0.32rem] mx-[0.12rem]">
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_mining_noti_duration') }}</div>
                    <div class="text-[0.28rem]">{{ item.days }}{{ item.days > 1 ? $t('finance.portfolio_day_multi') : $t('finance.portfolio_day') }}</div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_yield') }}</div>
                    <div class="text-[0.28rem]">{{ item.returnrate.split(',')[0] + '-'  + item.returnrate.split(',')[1] + '%' }}</div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_mining_header') }}</div>
                    <div class="text-[0.28rem]">{{ item.amount + ' ' + 'USDT' }}</div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between">
                    <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_mining_fee') }}</div>
                    <div class="text-[0.28rem]">{{ item.fee + ' ' + 'USDT' }}</div>
                </div>
            </div>
        </div>
    </div>
    <!-- 详情 -->
    <Popup teleport="body" v-model:show="showInfo" position="right" :style="{ height: '100%', width: '100%' }">
        <StakingOrderDetail v-if="showInfo" :backFunc="backFunc" style="width: 100%;height: 100%;" />
    </Popup>

</template>
<script setup>
import StakingOrderDetail from '../StakingOrderDetail.vue'
import { Popup } from "vant";
import store from "@/store";

const props = defineProps({
    list: {
        type: Array,
        default: []
    },
    type: {
        type: String,
        default: ''
    }
})
const showInfo = ref(false)
const backFunc = ()=>{
    showInfo.value = false
}
const jump = (item) => {
    store.commit('setOrderItem', {type: props.type, ...item});
    sessionStorage.setItem('orderItem', JSON.stringify({type: props.type, ...item}))
    showInfo.value = true
}

</script>