<!-- 充值详情 -->
<template>
    <div class="page page_topup_item">
        <Top :title="'充值详情'">
            <template #right>
                <div class="top-record" @click="goRecord">
                    <img v-lazy="getStaticImgUrl('/static/img/user/server.svg')" alt="img">
                </div>
            </template>
        </Top>

        <div class="top_box">
            <div class="amount">+210 USDT</div>
            <div class="status">
                <div class="status_icon">
                    <img v-lazy="getStaticImgUrl('/static/img/common/ok.svg')" alt="ok">
                </div>
                <span>成功</span>
            </div>
            <div class="tip">为什么我的充值未到账？</div>
        </div>

        <div class="bottom_box">
            <div class="bottom_item">
                <span>币种</span>
                <div class="value">USDT</div>
            </div>
            <div class="bottom_item">
                <span>状态</span>
                <div class="value status status_review">充值中</div>
            </div>
            <div class="bottom_item">
                <span>时间</span>
                <div class="value">2024-04-18 22:44:29</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Top from "@/components/Top.vue"
import { _depositInfo } from "@/api/api"
import { useRoute } from "vue-router"

const route = useRoute()

const getInfo = () => {
    _depositInfo({
        order_no: route.query.order_no
    }).then(res => {

    })
}
getInfo()
</script>

<style lang="less" scoped>
.page_topup_item {
    padding: 1.4rem 0.32rem 0.2rem 0.32rem;

    position: relative;

    .top-record {
        width: 0.4rem;
        height: 0.4rem;
    }

    .top_box {
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid var(--ex-border-color);

        .amount {
            font-size: 0.52rem;
            color: var(--ex-text-color);
            line-height: 0.73rem;
            margin-bottom: 0.1rem;
        }

        .status {
            display: flex;
            align-items: center;
            color: var(--ex-primary-color);
            font-size: 0.28rem;
            line-height: 0.44rem;
            font-weight: 600;

            .status_icon {
                width: 0.36rem;
                height: 0.36rem;
                margin-right: 0.2rem;
                border-radius: 50%;
                background-color: var(--ex-primary-color);
                padding: 0.07rem;
                line-height: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        .tip {
            font-weight: 400;
            font-size: 0.24rem;
            line-height: 0.34rem;
            color: var(--ex-primary-color);
            text-align: center;
            margin: 0.4rem 0 0.6rem 0;
        }
    }

    .bottom_box {
        padding-top: 0.8rem;

        .bottom_item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 0.44rem;
            margin-bottom: 0.4rem;
            font-size: 0.28rem;
            color: var(--ex-text-color3);
            font-weight: 400;

            .value {
                color: var(--ex-text-color);
            }

            .status {
                font-weight: 500;
                padding: 0 0.16rem;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .status_review {
                color: var(--ex-warning-color);
                background-color: rgb(var(--ex-warning-color-rgb) / 0.08);
            }

            .status_success {
                color: var(--ex-primary-color);
                background-color: rgb(var(--ex-primary-color-rgb) / 0.08);
            }

            .status_failed {
                color: var(--ex-error-color);
                background-color: rgb(var(--ex-error-color-rgb) / 0.08);
            }
        }
    }
}
</style>