<!-- 跟单元素 -->
<template>
    <div class="follow-item">

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
                </div>
            </div>
            <div class="btn">{{ $t('copy.copy_trade') }}</div>
        </div>

        <div class="info-box">
            <div class="info-left">
                <div class="info-title">RIO</div>
                <div class="info-num up">+123123%</div>
                <div class="info-text">
                    <span>{{ $t('copy.total_revenue') }}</span>
                    <b>+234234234</b>
                </div>
            </div>
            <div class="line-box"></div>
        </div>
    </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
</script>

<style lang="less">
.follow-item {
    width: 6.04rem;
    height: 3.32rem;
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
            }
        }

        .btn {
            background-color: var(--ex-primary-color);
            color: var(--ex-white);
            height: 0.68rem;
            border-radius: 0.5rem;
            padding: 0 0.36rem;
            min-width: 1.4rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.28rem;
        }
    }

    .info-box {
        width: 100%;
        height: 1.84rem;
        border-radius: 0.32rem;
        background-color: var(--ex-bg-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.28rem;

        .line-box {
            width: 2.08rem;
            height: 1.12rem;
            margin-top: 0.012rem;
        }

        .info-left {
            text-align: left;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-between;

            .info-title {
                font-size: 0.24rem;
                font-weight: 400;
                line-height: 1;
            }

            .info-num {
                font-size: 0.32rem;
                font-weight: 600;
                line-height: 0.4rem;
            }

            .info-text {
                color: var(--ex-placeholder-color);
                font-size: 0.24rem;
                font-weight: 400;
                line-height: 1;

                b {
                    color: var(--ex-white);
                    margin-left: 0.24rem;
                }
            }
        }
    }
}
</style>