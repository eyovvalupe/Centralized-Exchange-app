<template>
    <div class="mt-[0.4rem] ">
        <div class="flex mx-[0.32rem] flex-col gap-[0.2rem] bg-white2 justify-between px-[0.4rem] py-[0.28rem] rounded-[0.32rem]">
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color3">{{ t('借币币种') }}</div>
                <div class="flex items-center justify-center gap-[0.12rem]">
                    <div class="size-[0.32rem]">
                        <CryptoIcon :name="order.symbol" />
                    </div>
                    <div class="text-[0.28rem] font-[500]">{{ order.symbol }}</div>
                </div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color3">{{ t('finance.defi_borrow_stake_amount') }}</div>
                <div class="text-[0.28rem] font-[500]">{{ order.amount }} <span class="text-[0.24rem]">{{ order.symbol }}</span></div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color3">{{ t('finance.defi_borrow_borrow_amount') }}</div>
                <div class="text-[0.28rem] font-[500]">{{ order.loan }} <span class="text-[0.24rem]">{{ order.symbol }}</span></div>
            </div>
            
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color3">{{ t('finance.defi_borrow_cal_bill') }}</div>
                <div class="text-[0.28rem] font-[500]">{{ order.interest }} <span class="text-[0.24rem]">{{ order.symbol }}</span></div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color3">{{ t('finance.defi_service_charge') }}</div>
                <div class="text-[0.28rem] font-[500]">{{order.fee}} <span class="text-[0.24rem]">{{ order.symbol }}</span></div>
            </div>
           
        </div>
        <div class="bg-white2 rounded-[0.32rem] mx-[0.32rem] px-[0.4rem] leading-[1] py-[0.3rem] mt-[0.2rem]">
            <div class="text-color3 text-right">
                <span>{{ t('应还')}}</span>
                <span class="px-1 text-[0.36rem] font-[600] text-color">{{repayAmount }}</span>
                <span>{{ order.symbol }}</span>
            </div>
            <div class="mt-[0.2rem] text-color3 text-right">
                {{ t('finance.defi_borrow_borrow_amount')}} <span class="text-color">{{ order.loan }}</span> + {{ t('finance.defi_total_interest')}} <span class="text-color">{{ order.interest }}</span> + {{ t('finance.defi_service_charge')}} <span class="text-color">{{ order.fee }}</span>
            </div>
        </div>
        <div  v-if="userInfo.role != 'guest'">
            <div class=" mt-[0.4rem]" style="border-top:1px dashed var(--ex-bg-white2);"></div>
            <div class="text-[0.28rem] leading-[0.44rem] mx-[0.32rem] mt-[0.4rem] mb-[0.2rem]">{{ t('trade.stock_opening_trade_pw') }}</div>
            <FormItem size="large" class="mx-[0.4rem]" :placeholder="t('trade.stock_opening_trade_pw_placeholder')" input-type="password" v-model="safeword" />
        </div>
        <div class="pt-[0.4rem] pb-[0.6rem] px-[0.4rem]">
            <Button :loading="isLoading" type="primary" @click="submit" class="submit ripple-btn">
                <span class="text-[0.32rem] font-bold">{{ t('trade.stock_opening_confirm') }}</span>
            </Button>
        </div>
    </div>
</template>
<script setup>
import store from '@/store'
import FormItem from "@/components/Form/FormItem.vue";
import { getStaticImgUrl } from "@/utils/index.js";
import { _pledgeRepay } from '@/api/api'
import { useI18n } from "vue-i18n";
import {Button,showToast} from 'vant'
const { t } = useI18n();
const props = defineProps({
    order:{
        type:Object,
        default:()=>{}
    },
    repayAmount:Number
})
const emits = defineEmits(['success'])
const safeword = ref('')
const isLoading = ref(false)
const sessionToken = computed(() => store.state.sessionToken || '')
const userInfo = computed(() => store.state.userInfo || '')
const getSessionToken = () => {
    store.dispatch('updateSessionToken')
}

const submit = ()=>{
    if(userInfo.value.role == 'guest'){
        safeword.value = '000000'
    }
    if (!safeword.value) {
        return showToast(t("assets.safety_trade_no_password"));
    }
    isLoading.value = true
    _pledgeRepay({
        order_no:props.order.order_no,
        token:sessionToken.value,
        safeword:safeword.value
    }).then((res)=>{
        if(res.code == 200){
            showToast('归还成功')
            emits('success')
        }
    }).finally(()=>{
        isLoading.value = false
        getSessionToken()
    })
}
getSessionToken()
</script>
<style lang="less" scoped>
.submit {
    border-radius: 0.62rem;
    height: 1.12rem;
    width:100%;
}
</style>