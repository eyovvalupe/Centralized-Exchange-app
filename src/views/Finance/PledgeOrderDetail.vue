<template>
    <div class="pledge_order_detail_page flex flex-col min-h-full">
        <Top :title="$t('trade.ipo_detail_title')" :backFunc="backFunc" />
        <div class="h-[0.88rem]"></div>
        <div
            class="mx-[0.32rem] rounded-[0.32rem] mt-[0.32rem] mb-[0.28rem] p-[0.4rem] relative overflow-hidden bg-color3 flex flex-col gap-[0.28rem]">
            
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color3">{{ t('借币币种') }}</div>
                <div class="flex items-center justify-center gap-[0.12rem]">
                    <div class="size-[0.4rem]"> <CryptoIcon :name="order.symbol" /></div>
                    <div class="text-[0.28rem] font-[500]">{{ order.symbol }}</div>
                </div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color3">{{ t('借币状态') }}</div>
                <div class="px-[0.18rem] h-[0.44rem] bg-primary bg-opacity-10 text-primary rounded-full" v-if="order.status == 'open'">
                    {{ t('finance.defi_borrow_on') }}
                </div>
                <div  class="px-[0.18rem] h-[0.44rem] bg-white1 text-color3 rounded-full" v-else>
                    {{ t('finance.defi_borrow_repaid') }}
                </div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color3">{{ t('已还金额') }}</div>
                <div class="text-[0.28rem]">{{ order.loan }} <span class="text-[0.24rem]">{{ order.symbol }}</span></div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color3">{{ t('finance.defi_borrow_period') }}</div>
                <div class="text-[0.28rem]">{{ order.days }}{{ t('finance.portfolio_day_multi') }}</div>
            </div>
            
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color3">{{ t('finance.portfolio_order_finish_time') }}</div>
                <div class="text-[0.28rem]">{{ order.expirydate }}</div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color3">{{ t('finance.defi_borrow_stake_amount') }}</div>
                <div class="text-[0.28rem]">{{ order.amount }} <span class="text-[0.24rem]">{{ order.symbol }}</span></div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color3">{{ t('finance.defi_borrow_borrow_amount') }}</div>
                <div class="text-[0.28rem]">{{ order.loan }} <span class="text-[0.24rem]">{{ order.symbol }}</span></div>
            </div>
            
            
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color3">{{ t('finance.defi_borrow_cal_bill') }}</div>
                <div class="text-[0.28rem]">{{ order.interest }} <span class="text-[0.24rem]">{{ order.symbol }}</span></div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color3">{{ t('finance.defi_service_charge') }}</div>
                <div class="text-[0.28rem]">{{ order.fee }} <span class="text-[0.24rem]">{{ order.symbol }}</span></div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color3">{{ t('trade.ai_position_order_id') }}</div>
                <div class="text-[0.28rem] flex items-center gap-[0.12rem]">
                    {{ order.order_no }}
                    <div class="w-[0.32rem] h-[0.32rem]" @click="copy(order.order_no)">
                        <img v-lazy="getStaticImgUrl('/static/img/common/copy.svg')" alt="copy" />
                    </div>
                </div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color3">{{ t('trade.ipo_detail_order_date') }}</div>
                <div class="text-[0.28rem]">{{ order.date }}</div>
            </div>

        </div>
        <div class="bg-color2 rounded-[0.32rem] mx-[0.32rem] px-[0.4rem] leading-[1] py-[0.3rem]"  v-if="order.status == 'open'">
            <div class="text-color3 text-right">
                <span>{{ t('finance.defi_repayment_due')}}</span>
                <span class="px-1 text-[0.36rem] font-[600] text-color">{{getTotalAmount(order.loan,order.fee,order.interest,order.symbol) }}</span>
                <span>{{ order.symbol }}</span>
            </div>
            <div class="mt-[0.2rem] text-color3 text-right">
                {{ t('finance.defi_borrow_borrow_amount')}} <span class="text-color">{{ order.loan }}</span> + {{ t('finance.defi_total_interest')}} <span class="text-color">{{ order.interest }}</span> + {{ t('finance.defi_service_charge')}} <span class="text-color">{{ order.fee }}</span>
            </div>
        </div>
        <div class="flex-1"></div>
        <div class="px-[0.4rem] py-[0.6rem]" v-if="order.status == 'open'">
            <Button type="primary" class="submit ripple-btn" @click="openConfirm">
                <span class="text-[0.32rem] font-bold">{{ t('finance.defi_borrow_go_repay') }}</span>
            </Button>
        </div>
        
    </div>
    <BottomPopup closeable v-model:show="visible" :title="t('finance.defi_borrow_return_confirm')">
        <RepayConfirm :order="order" v-if="visible" :repay-amount="getTotalAmount(order.loan,order.fee,order.interest,order.symbol)" @success="repaySuccess" />
    </BottomPopup>
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
import eventBus from '@/utils/eventBus';
const route = useRoute()
const props = defineProps({
    backFunc:Function,
    order:{
        type:Object,
        default:()=>{}
    }
    
})
const order = reactive(props.order || route.query)

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
    order.status = 'close'
    eventBus.emit("pledgeSuccess")

}
</script>

<style lang="less" scoped>
.submit {
    border-radius: 0.62rem;
    height: 1.12rem;
    width:100%;
}
</style>