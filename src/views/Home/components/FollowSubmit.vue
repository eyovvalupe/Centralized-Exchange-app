<!-- 跟单表单 -->
<template>
    <div class="follow_dialog">
        <div class="form">
            <!-- 数量 -->
            <div class="mb-[0.2rem] mx-[0.32rem]">
                <FormItem :hasScroll="true" :placeholder="$t('copy.copy_order_follow_confirm_rage')"
                    :max="maxStockNum" v-model="amount" :show-btn="maxStockNum >= 1" 
                    @btnClick="amount = maxStockNum" @change="changePercent"  input-type="number">
                    <template #scroll>
                        <!-- 拖动 -->
                        <SlideContainer v-model="sliderValue" @change="onSliderChange" />
                    </template>
                    <template #right-con>
                        <span class="text-color">USDT</span>
                    </template>
                </FormItem>
            </div>
            <div class="p-[0.28rem] mx-[0.32rem] rounded-[0.32rem] flex flex-col" style="background-color: var(--ex-bg-white2);">
                <div class="text-[0.32rem] mb-[0.4rem]">{{ $t('assets.wallet_cash_value') }}</div>
                <div class="flex justify-between mb-[0.52rem] text-[0.28rem]">
                    <div class="text-color2">{{ $t('market.market_faster_available') }}</div>
                    <div class="flex text-primary">{{ maxStockNum }}<span class="text-color">&nbsp;USDT</span></div>
                </div>
                <div class="flex gap-[0.28rem] justify-center">
                    <div class="w-[3rem] h-[0.6rem] flex items-center justify-center rounded-[1rem] bg-white1 text-white ripple-primary" @click="goDeposit">{{ $t('home.recharge') }}</div>
                    <div class="w-[3rem] h-[0.6rem] flex items-center justify-center rounded-[1rem] bg-white1 text-white ripple-primary" @click="goTransfer">{{ $t('assets.transfer') }}</div>
                </div>
            </div>
            <div class="line" v-if="userInfo.role != 'guest'"></div>
            <div class="px-[0.32rem]" v-if="userInfo.role != 'guest'">
               
                <div class="text-[0.28rem] leading-[0.44rem] mb-[0.2rem]">{{ t('trade.stock_opening_trade_pw') }}</div>
                <div class="item pass_ipt">
                    <input v-model="safePass" :placeholder="t('trade.stock_opening_trade_pw_placeholder')"
                        :type="showPassword ? 'text' : 'password'" class="ipt" />
                    <img v-if="!showPassword" v-lazy="getStaticImgUrl('/static/img/common/close_eye.svg')"
                        @click="showPassword = true" alt="off" />
                    <img v-else v-lazy="getStaticImgUrl('/static/img/common/open_eye.svg')" alt="open"
                        @click="showPassword = false" />
                </div>
            </div>
        </div>

        <div class="btns btns2">
            <Button :loading="plusLoading" class="btn btn2 btn3 ripple-btn" @click="submitPlus"><span class="text-[0.36rem] font-semibold">{{
                $t('copy.copy_order_cancel_confirm') }}</span></Button>
        </div>
    </div>
</template>

<script setup>
import SlideContainer from "@/components/SlideContainer.vue";
import FormItem from "@/components/Form/FormItem.vue";
import { ref, computed } from "vue"
import store from "@/store";
import { getStaticImgUrl } from "@/utils/index.js"
import { useI18n } from "vue-i18n";
import { showToast, Button, showConfirmDialog } from "vant"
import Decimal from "decimal.js";
import { _copyApply, _copyAdd } from "@/api/api"
import router from "@/router";

const emits = defineEmits(['success'])
const { t } = useI18n();
const props = defineProps({
    mode: { // follow=跟单 plus=追加
        type: String,
        default: 'follow'
    },
    item: {
        type: Object,
        default: () => { }
    }
})

const showPassword = ref(false)
const safePass = ref('')
const amount = ref('')

const stockWalletAmount = computed(() => {
    // 钱包余额
    const target = store.state.wallet.find(
        (item) => item.currency == 'USDT'
    );
    if (target) return target.amount;
    return 0;
});

const maxStockNum = computed(() => {
    // 最大可买 可卖
    return stockWalletAmount.value;
});
const userInfo = computed(() => store.state.userInfo)
const goDeposit = () => {
    showConfirmDialog({
        title: "提示",
        message: "即将跳转到充值，将中断当前业务，是否继续？",
        theme: 'round-button'
    }).then(() => {
        router.push({
            name: 'topUpCrypto',
            query: {
                currency: 'USDT'
            }
        })
    })
    
}
const goTransfer = () => {
    showConfirmDialog({
        title: "提示",
        message: "即将跳转到划转，将中断当前业务，是否继续？",
        theme: 'round-button'
    }).then(() => {
        router.push({
            name: 'transfer',
            query: {
                to: 'USDT'
            }
        })
    })
    
}
const plusLoading = ref(false)
const submitPlus = () => {
    if(userInfo.value.role == 'guest'){
        safePass.value = '000000'   
    }
    if (plusLoading.value) return
    if (!amount.value || amount.value < 0) return showToast(t('topUpCrypto.no_amount_msg'))
    if (!safePass.value) return showToast(t('trade.ai_opening_trade_password'))
    plusLoading.value = true
    store.dispatch("updateSessionToken").then(token => {
        setTimeout(() => {
            if (token) {
                plusLoading.value = true
                const reqs = {
                    follow: _copyApply,
                    plus: _copyAdd
                }
                reqs[props.mode]({
                    id: props.item.id,
                    token: token,
                    amount: amount.value,
                    safeword: safePass.value
                }).then(() => {
                    showToast(t('safety.success_title'))
                    emits('success', {})
                    amount.value = ''
                    safePass.value = ''
                    store.dispatch('updateMyFollowList')
                    store.dispatch('updateMyCopyData')
                }).finally(() => {
                    plusLoading.value = false
                    store.dispatch('updateSessionToken')
                })
            } else {
                setTimeout(() => {
                    submitPlus()
                }, 1000)
            }
        }, 0)
    }).finally(() => {
        plusLoading.value = false
    })
}
// 拖动
const sliderValue = ref(0)
const onSliderChange = val => {
    amount.value = new Decimal(stockWalletAmount.value || 0).mul(val).div(100).floor()
}
const changePercent = val => {
    if (!stockWalletAmount.value || !val) return sliderValue.value = 0
    sliderValue.value = new Decimal(val).mul(100).div(stockWalletAmount.value).ceil()
    if (sliderValue.value > 100) sliderValue.value = 100
    if (sliderValue.value < 0) sliderValue.value = 0
    sliderValue.value = Number(sliderValue.value)
}


</script>

<style lang="less" scoped>
.follow_dialog {
    .text-con {
        margin: 0.6rem 0;
        text-align: center;
        padding: 0 0.6rem;
    }

    .form {
        margin-top:0.6rem;

        .line {
            border-top: 1px dashed var(--ex-bg-white2);
            height: 1px;
            width: 100%;
            margin: 0.4rem 0;
        }
    }

    :deep(.van-slider.slider-dom::after){
        border-color: #3c424b;   
    }
    :deep(.van-slider.slider-dom::before){
        background-color: #3c424b;   
    }
    .pass_ipt {
        margin-bottom: 0.4rem;
        border-radius: 0.32rem;
        border: 1px solid transparent;
        padding: 0 0.24rem;
        height: 1.12rem;
        padding: 0.16rem 0.32rem;
        box-sizing: border-box;
        position: relative;
        background-color: var(--ex-bg-white2);

        .ipt {
            flex: 1;
            height: 100%;
            width: 100%;
            font-size: 0.32rem;
            padding: 0;
            color: var(--ex-text-white);
            position: relative;
            z-index: 1;
        }

        img {
            width: 0.4rem;
            height: 0.4rem;
            position: absolute;
            right: 0.32rem;
            top: 50%;
            transform: translateY(-50%);
            z-index: 9999;
        }
    }

    .btns {
        padding: 0 0.6rem 0.68rem 0.6rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .btn {
            width: 3rem;
            height: 0.8rem;
            border-radius: 1.3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--ex-white);
            color: var(--ex-bg-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.28rem;
        }

        .btn2 {
            background-color: var(--ex-primary-color);
            color: var(--ex-white);
        }

        .btn3 {
            width: 100%;
            height: 1.12rem;
        }
    }

    .btns2 {
        padding: 0 0.32rem 0.68rem 0.32rem;
    }
}
</style>