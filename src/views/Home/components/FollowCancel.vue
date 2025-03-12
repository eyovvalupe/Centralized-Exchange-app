<template>
<div class="pb-[0.6rem] ">

    <div class="myfollow-item bg-white2 mx-[0.32rem] mt-[0.4rem]">
        <div class="title-box">
            <div class="left">
                <div class="top">
                    <div class="avatar overflow-hidden">
                        <img v-lazy="getStaticImgUrl(`static/avatar/${item.avatar || 1}.png`)" alt="" />
                    </div>
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
            <div class="status">{{ $t('copy.copy_order_detail_on') }}</div>
        </div>
        <div class="flex items-center gap-[0.2rem] px-[0.16rem]">
            <div class="text-color3">{{ $t('copy.copy_order_detail_duration') }}</div>
            <div class="text-color">{{ item.date || '--' }}</div>
        </div>
        <div class="info-flex">
            <div class="info-item">
                <div class="name">{{ $t('finance.portfolio_revenue') }}</div>
                <div class="val" :class="[props.item.returnamount >= 0 ? 'up' : 'down']">{{ props.item.returnamount }}</div>
            </div>
            <div class="info-item" style="text-align: right;">
                <div class="name">{{ $t('copy.copy_order_total_amount') }}</div>
                <div class="val" @click="plus">
                    <span>{{ props.item.amount }}</span>
                </div>
            </div>
        </div>
        

    </div>
    <div class="line"></div>
    <div class="px-[0.32rem]" v-if="userInfo.role != 'guest'">
        <div class="text-[0.28rem] leading-[0.44rem] mb-[0.2rem]">{{ t('trade.stock_opening_trade_pw') }}</div>
        <div class="item pass_ipt" :class="{'erript':erript}">
            <input v-model="safePass" @focus="erript=false" :placeholder="t('trade.stock_opening_trade_pw_placeholder')"
                :type="showPassword ? 'text' : 'password'" class="ipt" />
            <img v-if="!showPassword" v-lazy="getStaticImgUrl('/static/img/common/close_eye.svg')"
                @click="showPassword = true" alt="off" />
            <img v-else v-lazy="getStaticImgUrl('/static/img/common/open_eye.svg')" alt="open"
                @click="showPassword = false" />
        </div>
    </div>
    
    <div class="px-[0.32rem] pt-[0.4rem]">
        <Button :loading="cancelLoading" type="primary" round class="w-full !h-[1.12rem] !text-[0.36rem] font-semibold ripple-btn"
            @click="submitCancel">{{ $t('copy.copy_order_cancel_confirm') }}</Button>
    </div>
</div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import store from "@/store";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { Button,showToast } from 'vant'
import { _copyCancel } from "@/api/api"
const userInfo = computed(() => store.state.userInfo)
const showPassword = ref(false)
const safePass = ref('')
const erript = ref(false)
const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    }
})
const emits = defineEmits(['cancel'])
const cancelLoading = ref(false)
const submitCancel = () => {
    if (cancelLoading.value) return
    if(userInfo.value.role == 'guest'){
        safePass.value = '000000'
    }
    if(!safePass.value){
        erript.value = true
        return
    }
    cancelLoading.value = true
    store.dispatch("updateSessionToken").then(token => {
        setTimeout(() => {
            if (token) {
                cancelLoading.value = true
                _copyCancel({
                    id: props.item.id,
                    token: token,
                    safeword: safePass.value
                }).then(() => {
                    showToast('已撤单')
                    store.dispatch("updateMyFollowList")
                    store.dispatch('updateMyCopyData')
                    safePass.value = false
                    emits('cancel', {})
                }).finally(() => {
                    cancelLoading.value = false
                })
            } else {
                setTimeout(() => {
                    submitCancel()
                }, 1000)
            }
        }, 100)
    }).finally(() => {
        cancelLoading.value = false
    })
}

</script>

<style lang="less" scoped>
.myfollow-item {
    border-radius: 0.32rem;
    flex-shrink: 0;
    padding: 0.12rem;
    position: relative;

    .title-box {
        padding: 0.16rem ;
        padding-bottom:0.24rem;
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
                    background-color: var(--ex-bg-white2);
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
        margin: 0.26rem 0 0.32rem 0;

        .info-item {
            text-align: left;
            padding: 0 0.16rem;

            .name {
                color: var(--ex-placeholder-color);
                font-size: 0.28rem;
                margin-bottom: 0.24rem;
            }

            .val {
                color: var(--ex-text-color);
                font-weight: bold;
                font-size: 0.4rem;
            }
        }
    }

    .info-box {
        width: 100%;
        border-radius: 0.32rem;
        background-color: var(--ex-bg-white2);
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
            background-color: var(--ex-bg-white2);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 0.8rem;
            border-radius: 0.8rem;
            color: var(--ex-text-color);
            width: 47.5%;
        }

        .add {
            background-color: var(--ex-primary-color);
            color: var(--ex-white);
        }
    }
}
.line {
    border-top: 1px dashed var(--ex-bg-white2);
    height: 1px;
    width: 100%;
    margin: 0.4rem 0;
}
.pass_ipt {
    border-radius: 0.32rem;
    border: 1px solid transparent;
    height: 1.12rem;
    padding: 0.16rem 0.32rem;
    box-sizing: border-box;
    position: relative;
    background-color: var(--ex-bg-white2);

    &.erript{
        border-color:var(--ex-error-color);
    }
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
</style>