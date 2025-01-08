<!-- 我的跟单元素 -->
<template>
    <div class="myfollow-item">

        <div class="title-box">
            <div class="left">
                <div class="top">
                    <div class="avatar"></div>
                    <div class="name">萨达撒阿大的</div>
                    <div class="level">{{ $t('copy.level', { level: '1' }) }}</div>
                </div>
                <div class="bottom">
                    <div class="bottom-info">
                        <div class="icon"><img :src="getStaticImgUrl('/static/home2/group.svg')" alt=""></div>
                        <div>2131/5000</div>
                    </div>
                    <div class="info-a" v-if="props.showDetail">@1231312</div>
                </div>
            </div>
            <div class="btn">详情</div>
        </div>

        <div class="info-box">
            <div class="info-item">
                <div class="name">总收益</div>
                <div class="val">0.08</div>
            </div>
            <div class="info-item">
                <div class="name">跟单额</div>
                <div class="val" @click="plus">
                    <span>0.08</span>
                    <div class="plus" >
                        <img :src="getStaticImgUrl('/static/home2/plus.svg')" alt="">
                    </div>
                </div>
            </div>
            <div class="info-item">
                <div class="name">今日收益</div>
                <div class="val up">0.08</div>
            </div>
        </div>

        <div class="btns">
            <div class="cancel" @click="cancel">取消跟单</div>
        </div>
    </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { showConfirmDialog } from "vant"
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({})
const emits = defineEmits(['plus'])

const cancel = () => {
    showConfirmDialog({
        title: '温馨提示',
        message: '确认取消跟单吗？',
        confirmButtonText: t("trade.stock_position_confirm_btn"),
        cancelButtonText: t("trade.stock_position_cancel_btn"),
        theme: 'round-button'
    })
}

const plus = () => {
    emits('plus')
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
                }

                .name {
                    font-size: 0.32rem;
                    font-weight: 600;
                    line-height: 1.4;
                }

                .level {
                    margin-left: 0.08rem;
                    height: 0.34rem;
                    padding: 0 0.08rem;
                    border-radius: 0.12rem;
                    display: flex;
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
            color: var(--ex-primary-color);
            height: 0.68rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.28rem;
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
        padding: 0.24rem 0.16rem 0.12rem 0.16rem;

        .cancel {
            background-color: var(--ex-down-color);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 0.72rem;
            border-radius: 0.72rem;
            color: var(--ex-white);
        }
    }


}
</style>