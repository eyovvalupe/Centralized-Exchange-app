<!-- 市场详情 -->
<template>
    <div class="page page_marketinfo">
        <!-- 头部 -->
        <div class="info_header">
            <div class="top">
                <div class="ripple_button back" @click="router.back()">
                    <Icon name="arrow-left" />
                </div>
                <div class="title">
                    <div>ASIANENE</div>
                    <div class="info">Tarapur Transformers Limited</div>
                </div>
                <div class="search" @click="router.push({ name: 'search' })">
                    <img src="/static/img/common/search_box.png" alt="🔍">
                </div>
            </div>
        </div>

        <!-- 内容 -->
        <div>详情</div>


        <!-- 交易按钮 -->
        <div class="ripple_button ripple_button2 submit">
            <span>交易</span>
        </div>
    </div>
</template>

<script setup>
import { Icon } from "vant"
import router from "@/router"
</script>

<style lang="less" scoped>
.page_marketinfo {
    padding: 2.6rem 0.3rem 3.72rem 0.3rem;

    .info_header {
        height: 2.6rem;
        width: calc(100% - 0.6rem);
        border-bottom: 0.2rem solid #F9FAFB;
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        background-color: #fff;

        .top {
            display: flex;
            height: 1.36rem;
            align-items: center;
            justify-content: space-between;

            .back {
                width: 0.4rem;
                height: 0.4rem;
                margin-right: 0.4rem;
            }

            .title {
                flex: 1;
                padding: 0 0.4rem;
                text-align: center;
                color: #061023;
                font-size: 0.32rem;
                line-height: 0.44rem;

                .info {
                    font-size: 0.24rem;
                    line-height: 0.32rem;
                    color: #8F92A1;
                }
            }

            .search {
                width: 0.8rem;
                height: 0.8rem;
            }
        }
    }

    .submit {
        overflow: hidden;
        width: calc(100% - 0.6rem);
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        color: #fff;
        background-color: #014CFA;
        height: 1.12rem;
        border-radius: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.28rem;
    }
}
</style>