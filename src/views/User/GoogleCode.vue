<!-- 谷歌验证码-已绑定 -->
<template>
    <div class="page page-gged">
        <Top :title="''" />
        <div class="gged_box">
            <div class="icon">
                <img src="/static/img/user/finish.png" alt="√">
            </div>
            <div class="title">已绑定</div>
            <div class="server">如需重新绑定谷歌验证器，请 <span>联系客服</span></div>
            <Button @click="router.back()" round color="#014CFA" class="submit" type="primary">关闭</Button>
        </div>
    </div>
</template>

<script setup>
import Top from '@/components/Top.vue';
import { Button } from "vant"
import router from '@/router';
</script>

<style lang="less" scoped>
.page-gged {
    padding-top: 1.12rem;

    .gged_box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: baseline;
        padding: 1.44rem 0.32rem 0.4rem 0.32rem;

        .icon {
            width: 2.8rem;
            height: 2.8rem;
            margin-bottom: 0.6rem;
        }

        .title {
            font-weight: 400;
            font-size: 0.48rem;
            line-height: 0.64rem;
            color: #121212;
        }

        .server {
            margin-top: 0.15rem;
            font-size: 0.28rem;
            font-weight: 400;
            line-height: 0.48rem;
            color: #333333;

            span {
                color: #014CFA;
            }
        }

        .submit {
            margin-top: 1.8rem;
            width: 100%;
        }
    }
}
</style>