<template>
    <div class="px-[0.4rem] py-[0.6rem]">
        <div class="px-[0.12rem]  pb-[0.12rem] bg-color3 rounded-[0.32rem]">
            <div class="h-[0.92rem] flex items-center text-color text-[0.32rem] px-[0.16rem] gap-[0.16rem]">
                <div v-if="paramCurrency" class="size-[0.4rem]">
                    <CryptoIcon :name="paramCurrency.toUpperCase()" />
                </div>
                {{ paramCurrency }}
            </div>
            <div class="p-[0.28rem] rounded-[0.32rem] bg-color2">
                <div class="flex justify-between items-center leading-[0.44rem]">
                    <span class="text-color2">{{t('finance.defi_borrow_stake_amount') }}</span>
                    <span class="text-color">{{ numb }} <span class="text-[0.24rem]">{{ paramCurrency }}</span></span>
                </div>
                <div class="flex justify-between  items-center mt-[0.2rem] leading-[0.44rem]">
                    <span class="text-color2">{{ t('finance.defi_borrow_borrow_amount') }}</span>
                    <span class="text-color">{{ loan }} <span class="text-[0.24rem]">{{ paramCurrency }}</span></span>
                </div>
                <div class="flex justify-between  items-center mt-[0.2rem] leading-[0.44rem]">
                    <span class="text-color2">{{ t('finance.defi_borrow_period') }}</span>
                    <span class="text-color">{{days}}{{ t('finance.portfolio_day_multi') }}</span>
                </div>
                <div class="flex justify-between items-center mt-[0.2rem] leading-[0.44rem]">
                    <span class="text-color2">{{ t('finance.defi_daily_interest') }}</span>
                    <span class="text-color">{{interest}}%</span>
                </div>
                <div class="flex justify-between  items-center mt-[0.2rem] leading-[0.44rem]">
                    <span class="text-color2">{{ t('finance.defi_total_interest') }}</span>
                    <span class="text-color">{{ totalInterest }} <span class="text-[0.24rem]">{{ paramCurrency }}</span></span>
                </div>
                <div class="flex justify-between  items-center mt-[0.2rem] leading-[0.44rem]">
                    <span class="text-color2">{{ t('finance.defi_service_charge') }}</span>
                    <span class="text-color">{{ fee }} <span class="text-[0.24rem]">{{ paramCurrency }}</span></span>
                </div>
            </div>
            <div
                class="flex items-center justify-center flex-col h-[1.4rem] mt-[0.12rem] bg-color2 rounded-[0.32rem] px-[0.28rem]">
                <span class="text-color2">{{ t('finance.defi_repayment_due') }}({{ paramCurrency }})</span>
                <span class="text-color mt-[0.06rem] text-[0.32rem]">{{ total }}</span>
            </div>
        </div>

        <FormItem size="large" class="mt-[0.4rem]" :placeholder="t('trade.stock_opening_trade_pw')" input-type="password" v-model="safeword" />

        <div class="pt-[0.6rem]">
            <Button :loading="isLoading" size="large" round class="ripple-btn" @click="submit" type="primary">{{ t('trade.stock_opening_confirm') }}</Button>
        </div>

    </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import FormItem from "@/components/Form/FormItem.vue";
import { Button,showToast } from 'vant'
import { useI18n } from "vue-i18n";
import {_pledgeApply} from '@/api/api'
import eventBus from "@/utils/eventBus";
import store from "@/store";
const { t } = useI18n();
const props = defineProps({
    paramCurrency: String,
    numb:Number,
    loan:Number,
    fee:Number,
    interest:Number,
    totalInterest:Number,
    total:Number,
    days:Number
})
const isLoading = ref(false)
const safeword = ref('')
const emits = defineEmits(['success'])
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    store.dispatch('updateSessionToken')
}
getSessionToken()
const submit = ()=>{
    if (!safeword.value) {
        return showToast(t("assets.safety_trade_no_password"));
    }
    isLoading.value = true
    _pledgeApply({
        symbol:props.paramCurrency,
        days:props.days,
        amount:props.numb,
        token:sessionToken.value,
        safeword:safeword.value
    }).then((res)=>{
        if(res.code == 1){
            showToast('借币成功')
            emits('success')
            eventBus.emit('pledgeSuccess')
        }
    }).finally(()=>{
        isLoading.value = false
        getSessionToken()
    })
}

</script>