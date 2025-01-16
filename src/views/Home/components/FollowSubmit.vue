<!-- 跟单表单 -->
<template>
    <div class="follow_dialog">
        <div class="form">
            <!-- 数量 -->
            <div class="item_box">
                <div class="item_box_right">
                    <FormItem :hasBot="true" :hasScroll="true" :placeholder="$t('copy.copy_order_follow_confirm_rage')"
                        :max="maxStockNum" v-model="amount" :show-btn="maxStockNum >= 1" btn-show-mode="focus"
                        @btnClick="amount = maxStockNum" @change="changePercent" tip-align="right"
                        :tip="maxStockNum > 0 ? '≤' + maxStockNum : ''" input-type="number">
                        <template #bottom-con>
                            <div @click="openConfirmBox"
                                style="display: flex;align-items: center;justify-content: space-between;padding: 0 0.08rem 0 0.24rem">
                                <div style="font-size: 0.24rem;color:var(--ex-white);">现金账户</div>
                                <div
                                    style="color: var(--ex-white); font-size: 0.24rem;padding: 0.12rem 0.16rem;border-radius: 0.4rem;background-color: var(--ex-bg-color);">
                                    <span>{{ t("assets.wallet_available_sim") }}</span>
                                    <span style="color: var(--ex-primary-color);margin:0 0.08rem">{{
                                        stockWalletAmount || '--' }} </span>
                                    <span>USDT</span>
                                </div>
                            </div>
                        </template>
                        <template #scroll>
                            <!-- 拖动 -->
                            <SlideContainer v-model="sliderValue" @change="onSliderChange" />
                        </template>
                    </FormItem>
                </div>
            </div>
            <div class="line"></div>
            <div class="item pass_ipt">
                <input v-model="safePass" :placeholder="t('trade.stock_opening_trade_pw')" :type="showPassword ? 'text' : 'password'"
                    class="ipt" />
                <img v-if="!showPassword" v-lazy="getStaticImgUrl('/static/img/common/close_eye.svg')"
                    @click="showPassword = true" alt="off" />
                <img v-else v-lazy="getStaticImgUrl('/static/img/common/open_eye.svg')" alt="open"
                    @click="showPassword = false" />
            </div>
        </div>

        <div class="btns btns2">
            <Button :loading="plusLoading" class="btn btn2 btn3 ripple-btn" @click="submitPlus">{{ $t('copy.copy_order_cancel_confirm') }}</Button>
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
import { showToast, Button } from "vant"
import Decimal from "decimal.js";
import { _copyApply, _copyAdd } from "@/api/api"

const emits = defineEmits(['success'])
const { t } = useI18n();
const props = defineProps({
    mode: { // follow=跟单 plus=追加
        type: String, 
        default: 'follow'
    },
    item: {
        type: Object,
        default: () => {}
    }
})

const showPassword = ref(false)
const safePass = ref('')
const amount = ref('')
const maxStockNum = computed(() => {
    // 最大可买 可卖
    return stockWalletAmount.value;
});

const plusLoading = ref(false)
const submitPlus = () => {
    if (plusLoading.value) return
    if (!amount.value || amount.value < 0) return showToast('请输入金额')
    if (!safePass.value) return showToast('请输入支付密码')
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
                    uid: props.item.uid,
                    token: token,
                    amount: amount.value,
                    safeword: safePass.value
                }).then(() => {
                    showToast('操作成功')
                    emits('success', {})
                }).finally(() => {
                    plusLoading.value = false
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
    if (sliderValue.value < 0 ) sliderValue.value = 0
    sliderValue.value = Number(sliderValue.value)
}



const wallet = computed(() => store.state.wallet || []);
const stockWalletAmount = computed(() => {
    // 钱包余额
    const target = wallet.value.find(
        (item) => item.currency == 'USDT'
    );
    if (target) return target.amount;
    return 0;
});


// 余额弹窗
const showAmountDialog = ref(false);
const openConfirmBox = () => {
    showAmountDialog.value = true;
};

</script>

<style lang="less" scoped>
.follow_dialog {
    .text-con {
        margin: 0.6rem 0;
        text-align: center;
        padding: 0 0.6rem;
    }

    .form {
        margin: 0.6rem 0.32rem 0 0.32rem;

        .line {
            border-top: 1px dashed var(--ex-border-color4);
            height: 1px;
            width: 100%;
            margin: 0.4rem 0;
        }
    }

    .pass_ipt {
        margin-bottom: 0.58rem;
        border-radius: 0.32rem;
        border: 1px solid var(--ex-border-color2);
        padding: 0 0.24rem;
        height: 1.12rem;
        padding: 0.16rem 0.32rem;
        box-sizing: border-box;
        position: relative;
        background-color: var(--ex-bg-color2);
        margin-top: 0.32rem;

        .ipt {
            flex: 1;
            height: 100%;
            width: 100%;
            font-size: 0.32rem;
            padding: 0;
            color: var(--ex-primary-color);
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