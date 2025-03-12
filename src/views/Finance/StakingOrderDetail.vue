<template>
    <div v-if="!isEmpty(orderItem)">
        {{ console.log(orderItem) }}
        <Top :title="$t('trade.ipo_detail_title')" :backFunc="backFunc" />
        <div
            class=" mt-[1.08rem] mx-[0.32rem] mb-[0.32rem] h-[2.1rem] bg-color6  rounded-[0.32rem] flex justify-center items-center">
            <div class="h-[1rem] flex flex-col justify-between items-center">
                <div class="text-color2 text-[0.32rem]">{{ $t('finance.portfolio_mining_revenue') }}<span>({{ 'USDT'
                        }})</span></div>
                <div class="text-[0.6rem] text-primary">{{ orderItem.earn > 0 ? '+' + orderItem.earn : orderItem.earn }}</div>
            </div>
        </div>
        <div
            class="mx-[0.32rem] bg-color6 rounded-[0.32rem] mb-[0.1rem] pb-[0.12rem] pt-[0.24rem] relative overflow-hidden">
            <div class="w-max h-[0.6rem] px-[0.28rem] absolute top-[0] right-[0] rounded-bl-[0.32rem] bg-primary"
                v-if="orderItem.type == 'position'">
                <div class="w-full h-full relative flex items-center justify-center">
                    {{ $t('finance.portfolio_order_tab1') }}
                </div>
            </div>
            <div class="w-max h-[0.6rem] px-[0.28rem] absolute top-[0] right-[0] rounded-bl-[0.32rem] bg-color8"
                v-if="orderItem.type == 'redeem'">
                <div class="w-full h-full relative flex items-center justify-center">
                    {{ $t('finance.portfolio_order_tab2') }}
                </div>
            </div>
            <div class="flex justify-between mx-[0.28rem] mb-[0.3rem]">
                <div class="flex h-[0.4rem] items-center">
                    <div class="flex mr-[0.1rem] items-center">
                        <div class="w-[0.4rem] h-[0.4rem] relative" v-for="(symbolItem, i) in orderItem.items"
                            :class="i ? '-ml-[0.1rem]' : ''">
                            <CryptoIcon :name="symbolItem.name.split('/')[0]" /></div>
                    </div>
                    <div class="text-[0.32rem] relative top-[0.04rem]">{{ orderItem.name }}</div>
                </div>
            </div>
            <div class="flex flex-col bg-white2 justify-between p-[0.28rem] rounded-[0.32rem] mx-[0.12rem]">
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_mining_noti_duration') }}</div>
                    <div class="text-[0.28rem]">{{ orderItem.days }}{{ orderItem.days > 1 ? $t('finance.portfolio_day_multi') : $t('finance.portfolio_day') }}</div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]" v-if="orderItem.type == 'position'">
                    <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_order_finish_time') }}</div>
                    <div class="text-[0.28rem]">{{ orderItem.expirydate }}</div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_yield') }}</div>
                    <div class="text-[0.28rem]">{{ orderItem.returnrate.split(',')[0] + '-' + orderItem.returnrate.split(',')[1] + '%' }}</div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_mining_header') }}</div>
                    <div class="text-[0.28rem]">{{ orderItem.amount + ' ' + 'USDT' }}</div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_mining_fee') }}</div>
                    <div class="text-[0.28rem]">{{ orderItem.fee + ' ' + 'USDT' }}</div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ $t('trade.ai_position_order_id') }}</div>
                    <div class="text-[0.28rem]">{{ orderItem.order_no }}</div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between">
                    <div class="text-[0.28rem] text-color2">{{ $t('trade.ipo_detail_order_date') }}</div>
                    <div class="text-[0.28rem]">{{ orderItem.date }}</div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]" v-if="orderItem.type == 'redeem'">
                    <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_repay_date') }}</div>
                    <div class="text-[0.28rem]">{{ orderItem.expirydate }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Top from '@/components/Top.vue';
import store from '@/store';
import { isEmpty } from '@/utils/isEmpty';
import { computed } from 'vue';
const orderItem = computed(() => store.state.orderItem)
const props = defineProps({
    backFunc:Function
    
})
</script>