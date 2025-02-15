<template>
    <div class="pledge_order_detail_page">
        <Top :title="$t('trade.ipo_detail_title')" />
        <div
            class=" mt-[1.08rem] mx-[0.32rem] mb-[0.2rem] h-[2.1rem] bg-color6 rounded-[0.32rem] flex justify-center items-center ">
            <div class="flex flex-col gap-[0.32rem] justify-between items-center">
                <div class="text-color2 text-[0.32rem]">{{ order.status == 'open' ? t('finance.defi_borrow_est_due') : t("已还总额") }}({{ order.symbol }})</div>
                <div class="text-[0.6rem] text-color font-[600]">{{getTotalAmount(order.loan,order.fee,order.interest,order.symbol) }}</div>
            </div>
        </div>
        <div
            class="mx-[0.32rem] bg-color6 rounded-[0.32rem] mb-[0.28rem] pb-[0.12rem] pt-[0.24rem] relative overflow-hidden">
            <div class="w-max h-[0.6rem] px-[0.28rem] absolute top-[0] right-[0] rounded-bl-[0.32rem] bg-primary"
                v-if="false">
                <div class="w-full h-full relative flex items-center justify-center">
                    {{ $t('finance.portfolio_order_tab1') }}
                </div>
            </div>
            <div class="w-max h-[0.6rem] px-[0.28rem] absolute top-[0] right-[0] rounded-bl-[0.32rem]" :class="[order.status == 'open' ? 'bg-error' : 'bg-color8']">
                <div class="w-full h-full relative flex items-center justify-center">
                    {{ order.status == 'open' ? t('finance.defi_borrow_on') : t('finance.defi_borrow_repaid') }}
                </div>
            </div>
            
            <div class="flex justify-between mx-[0.28rem] mb-[0.3rem]">
                <div class="flex h-[0.4rem] items-center justify-center gap-[0.16rem]">
                    <div class="size-[0.4rem]">
                        <CryptoIcon :name="order.symbol" /></div>
                    <div class="text-[0.32rem]">{{ order.symbol }}</div>
                </div>
            </div>
            <div class="flex flex-col bg-white2 justify-between p-[0.28rem] rounded-[0.32rem] mx-[0.12rem]">
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ t('finance.defi_borrow_stake_amount') }}</div>
                    <div class="text-[0.28rem]">{{ order.amount }} <span class="text-[0.24rem]">{{ order.symbol }}</span></div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ t('finance.defi_borrow_borrow_amount') }}</div>
                    <div class="text-[0.28rem]">{{ order.loan }} <span class="text-[0.24rem]">{{ order.symbol }}</span></div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ t('finance.defi_borrow_period') }}</div>
                    <div class="text-[0.28rem]">{{ order.days }}{{ t('finance.portfolio_day_multi') }}</div>
                </div>
               
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ t('finance.portfolio_order_finish_time') }}</div>
                    <div class="text-[0.28rem]">{{ order.expirydate }}</div>
                </div>
             
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ t('finance.defi_borrow_cal_bill') }}</div>
                    <div class="text-[0.28rem]">{{ order.interest }} <span class="text-[0.24rem]">{{ order.symbol }}</span></div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ t('finance.defi_service_charge') }}</div>
                    <div class="text-[0.28rem]">{{ order.fee }} <span class="text-[0.24rem]">{{ order.symbol }}</span></div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ t('trade.ai_position_order_id') }}</div>
                    <div class="text-[0.28rem] flex items-center gap-[0.12rem]">
                        {{ order.order_no }}
                        <div class="w-[0.32rem] h-[0.32rem]" @click="copy(order.order_no)">
                            <img v-lazy="getStaticImgUrl('/static/img/common/copy.svg')" alt="copy" />
                        </div>
                    </div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between">
                    <div class="text-[0.28rem] text-color2">{{ t('trade.ipo_detail_order_date') }}</div>
                    <div class="text-[0.28rem]">{{ order.date }}</div>
                </div>
            </div>

        </div>
        <div class="px-[0.4rem] py-[0.6rem]" v-if="order.status == 'open'">
            <Button type="primary" class="submit ripple-btn" @click="openConfirm">
                <span class="text-[0.32rem] font-bold">{{ t('finance.defi_borrow_go_repay') }}</span>
            </Button>
        </div>
        <BottomPopup closeable v-model:show="visible" :title="t('finance.defi_borrow_return_confirm')">
            <RepayConfirm :order="order" v-if="visible" :repay-amount="getTotalAmount(order.loan,order.fee,order.interest,order.symbol)" @success="repaySuccess" />
        </BottomPopup>
    </div>
</template>
<script setup>
import Top from '@/components/Top.vue';
import BottomPopup from '@/components/BottomPopup.vue'
import { getStaticImgUrl } from "@/utils/index.js";
import {Button,showToast} from 'vant'
import store from '@/store';
import { _copyTxt } from "@/utils/index";
import { useI18n } from "vue-i18n";
import RepayConfirm from "./components/RepayConfirm.vue"
import { reactive } from 'vue';
import {useRoute } from 'vue-router'
const route = useRoute()
const order = reactive(route.query)

const { t } = useI18n();
const visible = ref(false)
//  复制
const copy = (text) => {
  _copyTxt(text);
  showToast(t('recharging.copied'));
};

const getTotalAmount = (loan,fee,interest,currency)=>{
    const val = Number(loan) + Number(fee) + Number(interest)
    const target = store.state.deWeightCurrencyList.find((item) => item.currency == currency);
    if (target){
        return Number(val.toFixed(target.tpp+1).slice(0,-1))
    }else{
        return val
    }
}

const openConfirm = ()=>{
    visible.value = true
}
const repaySuccess = ()=>{
    visible.value = false
    order.value.status = 'close'
}
</script>

<style lang="less" scoped>
.submit {
    border-radius: 0.62rem;
    height: 1.12rem;
    width:100%;
}
</style>