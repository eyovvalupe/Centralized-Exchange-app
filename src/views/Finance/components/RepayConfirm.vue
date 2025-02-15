<template>
    <div class="mt-[0.4rem] ">
        <div
            class="mx-[0.32rem] bg-white2 rounded-[0.32rem] mb-[0.28rem] pb-[0.02rem] pt-[0.24rem] relative overflow-hidden">
            <div class="w-max h-[0.6rem] px-[0.28rem] absolute top-[0] right-[0] rounded-bl-[0.32rem] bg-primary"
                v-if="false">
                <div class="w-full h-full relative flex items-center justify-center">
                    {{ $t('finance.portfolio_order_tab1') }}
                </div>
            </div>
            
            <div class="flex justify-between mx-[0.28rem] mb-[0.3rem]">
                <div class="flex h-[0.4rem] items-center justify-center gap-[0.16rem]">
                    <div class="size-[0.4rem]">
                        <CryptoIcon :name="order.symbol" />
                    </div>
                    <div class="text-[0.32rem]">{{ order.symbol }}</div>
                </div>
            </div>
            <div class="flex flex-col bg-color9 justify-between px-[0.4rem] py-[0.28rem] rounded-[0.32rem] mx-[0.02rem]">
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ t('finance.defi_borrow_stake_amount') }}</div>
                    <div class="text-[0.28rem]">{{ order.amount }} <span class="text-[0.24rem]">{{ order.symbol }}</span></div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ t('finance.defi_borrow_borrow_amount') }}</div>
                    <div class="text-[0.28rem]">{{ order.loan }} <span class="text-[0.24rem]">{{ order.symbol }}</span></div>
                </div>
                
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ t('finance.defi_borrow_cal_bill') }}</div>
                    <div class="text-[0.28rem]">{{ order.interest }} <span class="text-[0.24rem]">{{ order.symbol }}</span></div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ t('finance.defi_service_charge') }}</div>
                    <div class="text-[0.28rem]">{{order.fee}} <span class="text-[0.24rem]">{{ order.symbol }}</span></div>
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
        <div
            class="flex items-center justify-center flex-col h-[1.4rem] mt-[0.2rem] bg-white2 rounded-[0.32rem] mx-[0.4rem]">
            <span class="text-color2">{{ t('finance.defi_borrow_total_due') }}({{ order.symbol }})</span>
            <span class="text-color mt-[0.06rem] text-[0.32rem]">{{ repayAmount }}</span>
        </div>
        <div class="h-[1px] bg-white2 mt-[0.4rem]"></div>
        <FormItem v-if="userInfo.role != 'guest'" size="large" class="mt-[0.4rem] mx-[0.32rem]" :placeholder="t('trade.stock_opening_trade_pw')" input-type="password" v-model="safeword" />
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