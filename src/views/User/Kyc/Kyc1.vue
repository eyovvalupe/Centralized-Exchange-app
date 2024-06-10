<!-- 身份认证1 -->
<template>
    <div class="kyc_1">
        <Top :title="''">
            <template #right>
                <div>right</div>
            </template>
        </Top>

        <div class="title">验证您的身份</div>
        <div class="tip">根据金融法规，我们需要询问这个问题，确保您的详细信息与您的政府签发的身份证件完全匹配。</div>

        <div class="subtitle">法定姓名</div>
        <div class="item"></div>
        <div class="subtitle">证件号码</div>
        <div class="item"></div>
        <div class="subtitle">出生日期</div>
        <div class="item"></div>
    </div>
</template>

<script setup>
import Top from '@/components/Top.vue';
</script>

<style lang="less" scoped>
.kyc_1 {
    padding: 1.24rem 0.32rem 0.2rem 0.32rem;

    .title {
        color: #0D0D12;
        font-weight: 600;
        font-size: 0.56rem;
        line-height: 0.8rem;
        margin-bottom: 0.6rem;
    }

    .tip {
        color: #666D80;
        font-weight: 400;
        font-size: 0.28rem;
        line-height: 0.42rem;
        margin-bottom: 0.4rem;
    }

    .subtitle {
        font-weight: 400;
        color: #333333;
        font-size: 0.24rem;
        line-height: 0.36rem;
        margin-bottom: 0.2rem;
    }

    .item {
        height: 0.88rem;
        border: 1px solid #D0D8E2;
        border-radius: 0.16rem;
        margin-bottom: 0.4rem;
    }
}
</style>