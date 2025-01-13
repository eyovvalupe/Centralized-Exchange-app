<!-- 认购成功 -->
<template>
    <Top />
    <div class="page page_success">
        <div class="icon">
            <img v-lazy="getStaticImgUrl('/static/img/user/success.svg')" alt="√">
        </div>
        <div class="title">{{ t('trade.ipo_success_title') }}</div>
        <div class="tips">{{ t('trade.ipo_success_con') }}</div>
        <div class="btn flex justify-center items-center w-full">
            <Button @click="router.push('/trade?to=ipo')" round class="next"><span style="color: var(--ex-white);">{{
                t('trade.ipo_success_btn1') }}</span></Button>
            <Button @click="router.push('/trade?to=ipo&active=1')" round class="info" type="primary"><span
                    style="color: var(--ex-white);font-weight: 500;">{{ t('trade.ipo_success_btn2') }}</span></Button>
        </div>
    </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Button } from 'vant'
import { useRouter, useRoute } from 'vue-router';
import Top from '@/components/Top.vue';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
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
            padding: 0.16rem;
            border-radius: 1.3rem;
            margin-right: 0.15rem;
            font-size: 0.3rem;
            padding: 0rem;
            background-color: var(--ex-white);
        }

        .info {
            width: 3.27rem;
            height: 1.12rem;
            color: var(--ex-text-color--bg-primary);
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