<template>
    <div  @click="open(item)" class="w-full bg-white2 rounded-[0.32rem] mb-[0.24rem] pb-[0.12rem] pt-[0.24rem]" v-for="(item, i) in list">
        <div class="flex justify-between items-center mx-[0.28rem] mb-[0.32rem]">
            <div class="flex flex-col justify-between">
                <div class="mb-[0.16rem] size-[0.4rem] flex items-center gap-[0.16rem]">
                    <CryptoIcon :name="item.symbol" />
                    <div class="text-[0.32rem]">{{ item.symbol }}</div>
                </div>
                <div>
                    <span class="text-[0.28rem] text-color2">{{ t('finance.defi_borrow_total_due') }}</span>
                    <span class="text-[0.32rem] text-primary px-[0.06rem]">{{ getTotalAmount(item.loan,item.fee,item.interest,item.symbol) }} </span>
                    <span class="text-color text-[0.24rem]">{{ item.symbol }}</span>
                </div>
                
            </div>
            <div class="px-[0.24rem] h-[0.6rem] min-w-[1.36rem] flex justify-center items-center bg-primary rounded-full ripple-btn" v-if="item.status == 'open'" @click.stop="openConfirm(item)">
                {{ t('finance.defi_borrow_repay') }}
            </div>
        </div>
        <div class="flex flex-col bg-white2 justify-between p-[0.28rem] rounded-[0.32rem] mx-[0.12rem]">
            <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                <div class="text-[0.28rem] text-color2">{{ t('finance.defi_borrow_stake_amount') }}</div>
                <div class="text-[0.28rem]">{{ item.amount }} <span class="text-[0.24rem]">{{ item.symbol }}</span></div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                <div class="text-[0.28rem] text-color2">{{ t('finance.defi_borrow_borrow_amount') }}</div>
                <div class="text-[0.28rem]">{{ item.loan }} <span class="text-[0.24rem]">{{ item.symbol }}</span></div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                <div class="text-[0.28rem] text-color2">{{ t('finance.defi_borrow_period') }}</div>
                <div class="text-[0.28rem]">{{item.days}}{{ t('finance.portfolio_day_multi') }}</div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                <div class="text-[0.28rem] text-color2">{{ t('finance.defi_borrow_cal_bill') }}</div>
                <div class="text-[0.28rem]">{{ item.interest }} <span class="text-[0.24rem]">{{ item.symbol }}</span></div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color2">{{ t('finance.defi_service_charge') }}</div>
                <div class="text-[0.28rem]">{{ item.fee }} <span class="text-[0.24rem]">{{ item.symbol }}</span></div>
            </div>
        </div>
    </div>
</template>
<script setup>
import store from '@/store'
import router from "@/router";
import { useI18n } from "vue-i18n";
import { Popup } from 'vant';
const {t} = useI18n();
const emits = defineEmits(['repay'])
const open = (item)=>{
    const query = {
        ...item
    }
    router.push({
        path:'/pledge/orderDetail',
        query
    })
}
const props = defineProps({
    list: {
        type: Array,
        default: ()=>[]
    }
})

const getTotalAmount = (loan,fee,interest,currency)=>{
    const val = Number(loan) + Number(fee) + Number(interest)
    const target = store.state.deWeightCurrencyList.find((item) => item.currency == currency);
    if (target){
        return Number(val.toFixed(target.tpp+1).slice(0,-1))
    }else{
        return val
    }
}

const openConfirm = (item)=>{
    emits('repay',{
        order:item,
        repayAmount:getTotalAmount(item.loan,item.fee,item.interest,item.symbol)
    })
}

</script>