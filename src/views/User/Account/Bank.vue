<!-- 添加银行卡 -->
<template>
    <div class="page page_bank">
        <Top :title="'银行卡'" />

        <div class="subtitle">持卡人姓名</div>
        <div class="item">
            <span style="flex: 1;">LUCK</span>
            <div class="icon_ok">
                <img src="/static/img/user/ok.png" alt="ok">
            </div>
            <span>已认证</span>
        </div>
        <div class="subtitle">银行</div>
        <div class="item">
            <input type="text" class="ipt" maxlength="50">
        </div>
        <div class="subtitle">卡号</div>
        <div class="item">
            <input type="text" class="ipt" maxlength="50">
        </div>

        <div style="flex: 1;"></div>
        <Button class="submit" type="primary" round color="#014CFA">保存</Button>
    </div>
</template>

<script setup>
import Top from '@/components/Top.vue';
import { Button } from "vant"
</script>

<style lang="less" scoped>
.page_bank {
    padding: 1.4rem 0.32rem 1rem 0.32rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;

    .subtitle {
        font-weight: 400;
        font-size: 0.28rem;
        line-height: 0.36rem;
        color: #333333;
        margin-bottom: 0.15rem;
    }

    .item {
        width: 100%;
        height: 1.12rem;
        border: 1px solid #D0D8E2;
        border-radius: 0.32rem;
        margin-bottom: 0.22rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.44rem;

        .ipt {
            width: 100%;
            height: 100%;
            font-size: 0.24rem;
            text-align: left;
            outline: none;
            border: none;
            background-color: rgba(0, 0, 0, 0);
        }

        .icon_ok {
            width: 0.32rem;
            height: 0.32rem;
            margin: 0 0.12rem;
        }
    }

    .submit {
        height: 1.12rem;
        width: 100%;
    }
}
</style>