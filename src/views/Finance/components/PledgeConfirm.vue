<template>
    <div class="pt-[0.4rem]">
           
        <div class="px-[0.4rem] py-[0.32rem] rounded-[0.32rem] bg-white2 mx-[0.32rem]">
            <div class="flex justify-between items-center leading-[0.44rem]">
                <span class="text-color2">{{t('借币币种') }}</span>
                <div class="flex items-center text-color text-[0.28rem] gap-[0.08rem]">
                    <div v-if="paramCurrency" class="size-[0.32rem]">
                        <CryptoIcon :name="paramCurrency.toUpperCase()" />
                    </div>
                    {{ paramCurrency }}
                </div>
            </div>
            <div class="flex justify-between  items-center mt-[0.2rem] leading-[0.44rem]">
                <span class="text-color2">{{ t('finance.defi_borrow_period') }}</span>
                <span class="text-color">{{days}}{{ t('finance.portfolio_day_multi') }}</span>
            </div>
            <div class="flex justify-between  items-center mt-[0.2rem] leading-[0.44rem]">
                <span class="text-color2">{{ t('finance.portfolio_order_finish_time') }}</span>
                <span class="text-color">
                    {{ days ? dayjs().add(days, 'day').format('YYYY-MM-DD HH:mm:ss') : '--' }}
                </span>
            </div>
            
            <div class="flex justify-between items-center mt-[0.2rem] leading-[0.44rem]">
                <span class="text-color2">{{t('finance.defi_borrow_stake_amount') }}</span>
                <span class="text-color">{{ numb }} <span class="text-[0.24rem]">{{ paramCurrency }}</span></span>
            </div>
            <div class="flex justify-between  items-center mt-[0.2rem] leading-[0.44rem]">
                <span class="text-color2">{{ t('finance.defi_borrow_borrow_amount') }}</span>
                <span class="text-color">{{ loan }} <span class="text-[0.24rem]">{{ paramCurrency }}</span></span>
            </div>
            
            <div class="flex justify-between  items-center mt-[0.2rem] leading-[0.44rem]">
                <span class="text-color2">{{ t('到期利息') }}</span>
                <span class="text-color">{{ totalInterest }} <span class="text-[0.24rem]">{{ paramCurrency }}</span></span>
            </div>
            <div class="flex justify-between  items-center mt-[0.2rem] leading-[0.44rem]">
                <span class="text-color2">{{ t('finance.defi_service_charge') }}</span>
                <span class="text-color">{{ fee }} <span class="text-[0.24rem]">{{ paramCurrency }}</span></span>
            </div>
        </div>
        
        
        <div class="bg-white2 rounded-[0.32rem] mx-[0.32rem] px-[0.4rem] leading-[1] py-[0.3rem] mt-[0.2rem]">
            <div class="text-color3 text-right">
                <span>{{ t('finance.defi_repayment_due')}}</span>
                <span class="px-1 text-[0.36rem] font-[600] text-color">{{ total }}</span>
                <span>{{ paramCurrency }}</span>
            </div>
            <div class="mt-[0.2rem] text-color3 text-right">
                {{ t('finance.defi_borrow_borrow_amount')}} <span class="text-color">{{ loan }}</span> + {{ t('finance.defi_total_interest')}} <span class="text-color">{{ totalInterest }}</span> + {{ t('finance.defi_service_charge')}} <span class="text-color">{{ fee }}</span>
            </div>
        </div>
        <div  v-if="userInfo.role != 'guest'">
            <div class=" mt-[0.4rem]" style="border-top:1px dashed var(--ex-bg-white2);"></div>
            <div class="text-[0.28rem] leading-[0.44rem] mx-[0.32rem] mt-[0.4rem] mb-[0.2rem]">{{ t('trade.stock_opening_trade_pw') }}</div>
            <FormItem size="large" class="mx-[0.4rem]" :placeholder="t('trade.stock_opening_trade_pw_placeholder')" input-type="password" v-model="safeword" />
        </div>
        <div class="pb-[0.6rem] pt-[0.4rem] px-[0.4rem]">
            <Button :loading="isLoading" size="large" round class="ripple-btn" @click="submit" type="primary">{{ t('trade.stock_opening_confirm') }}</Button>
        </div>

    </div>
</template>
<script setup>
import FormItem from "@/components/Form/FormItem.vue";
import { Button,showToast } from 'vant'
import { useI18n } from "vue-i18n";
import {_pledgeApply} from '@/api/api'
import eventBus from "@/utils/eventBus";
import store from "@/store";
import dayjs from 'dayjs';
const { t } = useI18n();
const props = defineProps({
    paramCurrency: String,
    numb:[Number,String],
    loan:[Number,String],
    fee:[Number,String],
    interest:[Number,String],
    totalInterest:[Number,String],
    total:[Number,String],
    days:[Number,String]
})
const isLoading = ref(false)
const safeword = ref('')
const emits = defineEmits(['success'])
const sessionToken = computed(() => store.state.sessionToken || '')
const userInfo = computed(() => store.state.userInfo)
const getSessionToken = () => {
    store.dispatch('updateSessionToken')
}
getSessionToken()
const submit = ()=>{
    if(userInfo.value.role == 'guest'){
        safeword.value = '000000'
    }
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
        if(res.code == 200){
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