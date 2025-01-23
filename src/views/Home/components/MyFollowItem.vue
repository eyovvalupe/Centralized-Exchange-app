<!-- 我的跟单元素 -->
<template>
    <div class="myfollow-item" v-if="!isEmpty(item)">
        {{ console.log("my copy item =====> ", item) }}
        <div class="title-box" @click="goInfo">
            <div class="left">
                <div class="top">
                    <div class="avatar">{{ (props.item.name || '').slice(0, 1) }}</div>
                    <div class="name">{{ props.item.name }}</div>
                    <div class="level">{{ $t('copy.level', { level: props.item.lv }) }}</div>
                </div>
                <div class="bottom">
                    <div class="bottom-info">
                        <div class="icon"><img v-lazy="getStaticImgUrl('/static/home2/group.svg')" alt=""></div>
                        <div>{{ props.item.followers }}</div>
                    </div>
                </div>
            </div>
            <div class="btn" v-if="!props.showDetail">
                <img v-lazy="getStaticImgUrl('/static/home2/right-line.svg')" alt="">
            </div>
            <div class="status" v-if="props.showDetail">{{ $t('copy.copy_order_detail_on') }}</div>
        </div>

        <div class="info-flex">
            <div class="info-item">
                <div class="name">{{ $t('finance.portfolio_revenue') }}</div>
                <div class="val">{{ props.item.returnamount }}</div>
            </div>
            <div class="info-item" style="text-align: right;">
                <div class="name">{{ $t('copy.copy_order_total_amount') }}</div>
                <div class="val" @click="plus">
                    <span>{{ props.item.amount }}</span>
                </div>
            </div>
        </div>
        <div class="info-box">
            <div class="info-item">
                <div class="name">{{ $t('copy.copy_order_daily_profit') }}</div>
                <div class="val up">{{ props.item.today }}</div>
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
        <div class="follow_dialog pb-[0.6rem]">
            <div class="w-full flex justify-center mb-[0.6rem] mt-[0.6rem]">{{ $t('copy.copy_order_cancel_con') }}</div>

            <div class="w-full flex gap-[0.3rem] justify-center">
                <div class="w-[3rem] h-[0.8rem] rounded-[1.3rem] bg-white text-black text-[0.28rem] font-semibold flex justify-center items-center ripple-primary" @click="showCancel = false">{{ $t('copy.copy_order_cancel_cancel') }}</div>
                <div class="w-[3rem] h-[0.8rem] rounded-[1.3rem] bg-primary text-white text-[0.28rem] font-semibold flex justify-center items-center ripple-btn" @click="openCancelPass">{{ $t('copy.copy_order_cancel_confirm') }}</div>
            </div>
        </div>
    </BottomPopup>
    <!-- 取消跟单-安全密码弹窗 -->
    <SafePassword @submit="submitCancel" ref="safeRef" :key="'cancel'"></SafePassword>

    <!-- 追加弹窗 -->
    <BottomPopup v-model:show="showPlus" :title="$t('copy.copy_order_detail_confirm')" position="bottom" round closeable teleport="body">
        <FollowSubmit :mode="'plus'" :item="item"/>
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
import FollowSubmit from "./FollowSubmit.vue"
import { isEmpty } from "@/utils/isEmpty";

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
                    id: props.item.id,
                    token: token,
                    safeword: safeword
                }).then(() => {
                    showToast('已撤单')
                    store.dispatch("updateMyFollowList")
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
const plus = () => {
    showPlus.value = true
}


// 跳转

const goInfo = () => {
    if (props.stopJump) return
    store.commit('setCopyItemDetail', props.item)
    sessionStorage.setItem('copyItemDetail', JSON.stringify(props.item))
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

</style>