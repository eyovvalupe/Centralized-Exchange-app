<!-- 我的跟单元素 -->
<template>
    <div class="myfollow-item">

        <div class="title-box" @click="goInfo">
            <div class="left">
                <div class="top">
                    <div class="avatar">{{ (props.item.name || '').slice(0, 1) }}</div>
                    <div class="name">{{ props.item.name }}</div>
                    <div class="level">{{ $t('copy.level', { level: props.item.lv }) }}</div>
                </div>
                <div class="bottom">
                    <div class="bottom-info">
                        <div class="icon"><img :src="getStaticImgUrl('/static/home2/group.svg')" alt=""></div>
                        <div>{{ props.item.followers }}</div>
                    </div>
                </div>
            </div>
            <div class="btn" v-if="!props.showDetail">
                <img :src="getStaticImgUrl('/static/home2/right-line.svg')" alt="">
            </div>
            <div class="status" v-if="props.showDetail">{{ $t('copy.copy_order_detail_on') }}</div>
        </div>

        <div class="info-flex">
            <div class="info-item">
                <div class="name">{{ $t('finance.portfolio_revenue') }}</div>
                <div class="val">{{ props.item.returnamount || '--' }}</div>
            </div>
            <div class="info-item" style="text-align: right;">
                <div class="name">{{ $t('copy.copy_order_total_amount') }}</div>
                <div class="val" @click="plus">
                    <span>{{ props.item.amount || '--' }}</span>
                </div>
            </div>
        </div>
        <div class="info-box">
            <div class="info-item">
                <div class="name">{{ $t('copy.copy_order_daily_profit') }}</div>
                <div class="val up">{{ props.item.today || '--' }}</div>
            </div>
        </div>
        
        <div class="info-box" v-if="props.showDetail" style="margin-top: 0.12rem;">
            <div class="info-item">
                <div class="name">{{ $t('copy.copy_order_detail_duration') }}</div>
                <div class="val up">--</div>
            </div>
        </div>

        <div class="btns">
            <div class="btn cancel ripple-primary" @click="cancel">{{ $t('copy.copy_order_detail_cancel') }}</div>
            <div class="btn add ripple-btn" @click="plus">{{ $t('copy.copy_order_detail_confirm') }}</div>
        </div>
    </div>


    <!-- 取消跟单 -->
    <BottomPopup v-model:show="showCancel" :title="$t('copy.copy_order_detail_cancel')" position="bottom" round closeable teleport="body">
        <div class="follow_dialog">
            <div class="text-con">{{ $t('copy.copy_order_cancel_con') }}</div>

            <div class="btns">
                <div class="btn ripple-primary" @click="showCancel = false">{{ $t('copy.copy_order_cancel_cancel') }}</div>
                <div class="btn btn2 ripple-btn" @click="openCancelPass">{{ $t('copy.copy_order_cancel_confirm') }}</div>
            </div>
        </div>
    </BottomPopup>
    <!-- 取消跟单-安全密码弹窗 -->
    <SafePassword @submit="submitCancel" ref="safeRef" :key="'cancel'"></SafePassword>

    <!-- 追加弹窗 -->
    <BottomPopup v-model:show="showPlus" :title="$t('copy.copy_order_detail_confirm')" position="bottom" round closeable teleport="body">
        <div class="follow_dialog">

            <div class="form">
                <!-- 数量 -->
                <div class="item_box">
                    <div class="item_box_right">
                        <FormItem :hasRT="true" :hasScroll="true" :placeholder="$t('copy.copy_order_follow_confirm_rage')"
                            :max="maxStockNum" v-model="amount" :show-btn="maxStockNum >= 1" btn-show-mode="focus"
                            @btnClick="amount = maxStockNum" @change="changePercent" tip-align="right"
                            :tip="maxStockNum > 0 ? '≤' + maxStockNum : ''" input-type="number">

                            <template #rt>
                                <div @click="openConfirmBox">
                                    <div
                                        style="color: var(--ex-text-color2); font-size: 0.24rem;padding: 0.12rem 0.16rem;border-radius: 0.4rem;background-color: var(--ex-bg-color);">
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
                <div class="item pass_ipt">
                    <input v-model="safePass" :placeholder="t('trade.stock_opening_trade_pw')"
                        :type="showPassword ? 'text' : 'password'" class="ipt" />
                    <img v-if="!showPassword" :src="getStaticImgUrl('/static/img/common/close_eye.svg')"
                        @click="showPassword = true" alt="off" />
                    <img v-else :src="getStaticImgUrl('/static/img/common/open_eye.svg')" alt="open"
                        @click="showPassword = false" />
                </div>
            </div>

            <div class="btns btns2">
                <div class="btn btn2 btn3 ripple-btn" @click="submitPlus">{{ $t('copy.copy_order_cancel_confirm') }}</div>
            </div>
        </div>
    </BottomPopup>

   
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { useI18n } from "vue-i18n";
import BottomPopup from "@/components/BottomPopup.vue";
import { _copyCancel, _copyAdd } from "@/api/api"
import store from "@/store";
import { showToast } from "vant"
import SafePassword from "@/components/SafePassword.vue";
import SlideContainer from "@/components/SlideContainer.vue";
import FormItem from "@/components/Form/FormItem.vue";

const emits = defineEmits(['openInfo', 'plus', 'cancel'])

const safeRef = ref()

const { t } = useI18n();
const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    },
    showDetail: { // 展示详情
        type: Boolean,
        default: false
    },
    stopJump: { // 禁止跳转
        type: Boolean,
        default: false
    }
})
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


// 取消订单
const showCancel = ref(false)
const cancel = () => {
    showCancel.value = true
}
const openCancelPass = () => {
    showCancel.value = false
    safeRef.value.open()
}
const cancelLoading = ref(false)
const submitCancel = safeword => {
    if (cancelLoading.value) return
    cancelLoading.value = true
    store.dispatch("updateSessionToken").then(token => {
        setTimeout(() => {
            if (token) {
                cancelLoading.value = true
                _copyCancel({
                    uid: '',
                    token: token,
                    safeword: safeword
                }).then(() => {
                    showToast('已撤单')
                    emits('cancel', {})
                }).finally(() => {
                    cancelLoading.value = false
                })
            } else {
                setTimeout(() => {
                    submitCancel(safeword)
                }, 1000)
            }
        }, 100)
    }).finally(() => {
        cancelLoading.value = false
    })
}

// 追加
const showPlus = ref(false)
const showPassword = ref(false)
const safePass = ref('')
const amount = ref('')
const maxStockNum = computed(() => {
  // 最大可买 可卖
  return "100";
});
const plus = () => {
    showPlus.value = true
}
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
                _copyAdd({
                    uid: '',
                    token: token,
                    amount: amount.value,
                    safeword: safePass.value
                }).then(() => {
                    showToast('已追加')
                    emits('plus', {})
                    showPlus.value = false
                }).finally(() => {
                    plusLoading.value = false
                })
            } else {
                setTimeout(() => {
                    submitCancel(safeword)
                }, 1000)
            }
        }, 100)
    }).finally(() => {
        plusLoading.value = false
    })
}
// 拖动
const sliderValue = ref(0)
const onSliderChange = val => {
    console.error(val)
}
const changePercent = val => {
    console.error(val)
}



// 跳转

const goInfo = () => {
    if (props.stopJump) return
    emits('openInfo', {})
}
</script>

<style lang="less">
.myfollow-item {
    width: 100%;
    height: 100%;
    border-radius: 0.32rem;
    background: var(--ex-bg-color3);
    flex-shrink: 0;
    padding: 0.12rem;
    position: relative;

    .title-box {
        padding: 0.16rem;
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        

        .left {
            flex: 1;

            .top {
                display: flex;
                align-items: center;
                justify-content: flex-start;

                .avatar {
                    width: 0.48rem;
                    height: 0.48rem;
                    border-radius: 50%;
                    background-color: var(--ex-placeholder-color);
                    margin-right: 0.12rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.24rem;
                }

                .name {
                    font-size: 0.32rem;
                    font-weight: 600;
                    margin-bottom: 0.04rem;
                }

                .level {
                    margin-left: 0.08rem;
                    height: 0.34rem;
                    padding: 0 0.08rem;
                    border-radius: 0.12rem;
                    display: flex;
                    font-size: 0.2rem;
                    align-items: center;
                    justify-content: center;
                    color: var(--ex-black);
                    background-color: var(--ex-status-color1);
                }
            }

            .bottom {
                padding-left: 0.6rem;
                margin-top: 0.04rem;
                display: flex;
                align-items: center;
                justify-content: flex-start;

                .bottom-info {
                    background-color: var(--ex-bg-color2);
                    height: 0.36rem;
                    padding: 0 0.1rem;
                    border-radius: 0.12rem;
                    align-items: center;
                    display: inline-flex;
                    font-size: 0.2rem;

                    .icon {
                        width: 0.2rem;
                        height: 0.2rem;
                        margin-right: 0.04rem;
                        position: relative;
                        top: -0.01rem;
                    }
                }

                .info-a {
                    font-size: 0.24rem;
                    margin-left: 0.16rem;
                }
            }
        }

        .btn {
            width: 0.48rem;
            height: 0.48rem;
        }
        .status {
            position: absolute;
            top: 0;
            right: 0;
            border-radius: 0 0.32rem 0 0.32rem;
            padding: 0 0.16rem;
            height: 0.6rem;
            background-color: var(--ex-primary-color);
            color: var(--ex-white);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.26rem;
        }
    }

    .info-flex {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0.16rem 0 0.32rem 0;

        .info-item {
            text-align: left;
            padding: 0 0.16rem;

            .name {
                color: var(--ex-placeholder-color);
                font-size: 0.28rem;
                margin-bottom: 0.24rem;
            }

            .val {
                color: var(--ex-white);
                font-weight: bold;
                font-size: 0.36rem;
            }
        }
    }

    .info-box {
        width: 100%;
        border-radius: 0.32rem;
        background-color: var(--ex-bg-color);
        padding: 0.28rem;

        .info-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 0.52rem;

            .name {
                color: var(--ex-placeholder-color);
            }

            .val {
                display: flex;
                align-items: center;

                .plus {
                    width: 0.4rem;
                    height: 0.4rem;
                    margin-left: 0.12rem;
                }
            }
        }
    }

    .btns {
        padding: 0.4rem 0.16rem 0.24rem 0.16rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .btn {
            background-color: var(--ex-white);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 0.8rem;
            border-radius: 0.8rem;
            color: var(--ex-bg-color);
            width: 47.5%;
        }

        .add {
            background-color: var(--ex-primary-color);
            color: var(--ex-white);
        }
    }


}

.follow_dialog {
    .text-con {
        margin: 0.6rem 0;
        text-align: center;
        padding: 0 0.6rem;
    }

    .form {
        margin: 0.6rem 0.32rem 0 0.32rem;
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