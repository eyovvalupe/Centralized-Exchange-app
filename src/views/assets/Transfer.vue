<!-- 划转 -->
<template>
    <div class="page page_trnsfer">
        <Top :title="'划转'" />

        <div class="form">
            <div class="item">
                <div class="item_pre">从</div>
                <div class="item_content">现金账户</div>
                <div class="more">
                    <img src="/static/img/assets/more.png" alt="more">
                </div>
            </div>

            <div class="trans">
                <div class="line"></div>
                <div class="trans_icon">
                    <img src="/static/img/assets/transfer.png" alt="img">
                </div>
                <div class="line"></div>
            </div>

            <div class="item">
                <div class="item_pre">到</div>
                <div class="item_content">股票账户</div>
                <div class="more">
                    <img src="/static/img/assets/more.png" alt="more">
                </div>
            </div>

            <div class="subtitle">数量</div>
            <div class="item">
                <input type="number" placeholder="请输入" class="ipt">
                <div class="btn">最大</div>
            </div>
            <div class="tip">
                <span>最多可转</span>
                <span class="num">123123USDT</span>
            </div>
        </div>

        <Button :loading="loading" :disabled="disabled" round color="#014CFA" class="submit" type="primary">确定</Button>


    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { Button } from "vant"
import { ref } from "vue"

const loading = ref(false)
const disabled = ref(false)
</script>

<style lang="less" scoped>
.page_trnsfer {
    padding: 1.4rem 0.32rem 1.5rem 0.32rem;

    position: relative;

    .form {
        .item {
            width: 100%;
            height: 1.12rem;
            border: 1px solid #D0D8E2;
            border-radius: 0.32rem;
            padding: 0 0.4rem 0 0.76rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: 400;

            .item_pre {
                width: 1rem;
                font-size: 0.32rem;
                color: #707070;
            }

            .item_content {
                flex: 1;
                font-size: 0.28rem;
                color: #000;
            }

            .more {
                width: 0.32rem;
                height: 0.32rem;
            }

            .ipt {
                flex: 1;
                color: #292929;
                font-size: 0.28rem;
            }

            .btn {
                color: #1A59F6;
                font-size: 0.28rem;
                margin-left: 0.4rem;
            }
        }

        .trans {
            margin: 0.26rem 0 0.46rem 0;
            padding: 0 0.2rem;
            display: flex;
            align-items: center;

            .trans_icon {
                width: 0.8rem;
                height: 0.8rem;
                margin: 0 0.48rem;
            }

            .line {
                flex: 1;
                height: 1px;
                background-color: rgba(59, 130, 246, 0.1);
            }
        }

        .subtitle {
            font-size: 0.28rem;
            color: #333333;
            font-weight: 400;
            line-height: 0.36rem;
            margin: 0.9rem 0 0.12rem 0;
        }

        .tip {
            font-weight: 400;
            font-size: 0.24rem;
            color: #707070;
            line-height: 0.4rem;
            margin-top: 0.12rem;

            .num {
                color: #333333;
                margin-left: 0.04rem;
                font-weight: 500;
            }
        }
    }

    .submit {
        width: 100%;
        height: 1.12rem;
        margin: 1.2rem 0 0.4rem 0;
    }
}
</style>