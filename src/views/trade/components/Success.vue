<!-- 认购成功 -->
<template>
    <Top />
    <div class="page page_success">
        <div class="icon">
            <img :src="getStaticImgUrl('/static/img/user/success.png')" alt="√">
        </div>
        <div class="title">认购成功</div>
        <div class="tips">恭喜认购完成，请耐心等待中签信息</div>
        <div class="btn flex justify-center items-center w-[100%]">
            <Button @click="router.push('/trade?to=ipo')" round class="next">继续认购</Button>
            <Button @click="router.push('/trade?to=ipo&active=1')" round color="#FFF;" class="info"
                type="primary">订单详情</Button>
        </div>
    </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Button } from 'vant'
import { useRouter, useRoute } from 'vue-router';
import Top from '@/components/Top.vue';

const router = useRouter();

</script>

<style lang="less" scoped>
.page_success {
    text-align: center;
    padding-top: 1.12rem;

    .icon {
        width: 100%;
        height: 4rem;
        margin: 1.24rem auto 0rem;
    }

    .title {
        margin: -0.6rem 0 0.3rem 0;
        color: var(--ex-text-color);
        font-size: 0.4rem;
        font-style: normal;
        font-weight: 600;
        font-size: 0.32rem;
        line-height: 0.56rem;
    }

    .tips {
        font-size: 0.28rem;
        font-style: normal;
        color: var(--ex-text-color);
        margin-bottom: 0.78rem;
    }

    .btn {
        .next {
            width: 3.27rem;
            height: 1.12rem;
            color: var(--ex-primary-color);
            padding: 0.16rem;
            border-radius: 1.3rem;
            border: 1px solid var(--ex-primary-color) !important;
            margin-right: 0.15rem;
            font-size: 0.3rem;
            padding: 0rem;
        }

        .info {
            width: 3.27rem;
            height: 1.12rem;
            color: var(--ex-bg-primary-text-color);
            padding: 0.16rem;
            border-radius: 1.3rem;
            background: var(--ex-primary-color);
            margin-left: 0.15rem;
            font-size: 0.3rem;
            padding: 0rem;
        }
    }
}
</style>