<!-- 理财元素 -->
<template>
    <div class="financial_item" @click="handleClick"
        :style="{ borderBottom: props.borderBottom ? '1px solid var(--ex-border-color)' : '' }">
        <div class="title">稳健回报6号稳健回报6号稳健回报6号回报6号稳健回报6号稳健回报6号稳健回报6号回报6号</div>
        <div class="content">

            <div class="left">
                <div class="tags">
                    <div class="percent">88.31%</div>
                    <div class="tag">锁定十天</div>
                </div>

                <div>近一年收益率</div>
                <div style="margin-top: 0.14rem;">成立日：<span class="date">2024-5-20</span></div>
            </div>

            <div class="right">
                <div class="start">1000起购</div>
                <div class="btn">立即购买</div>
            </div>

        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    borderBottom: {
        type: Boolean,
        default: true
    }
})
const emits = defineEmits(['handleClick'])
const handleClick = () => {
    emits('handleClick')
}
</script>


<style lang="less" scoped>
.financial_item {
    padding: 0.24rem 0;

    .title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 600;
        color: var(--ex-text-color);
        font-size: 0.28rem;
        line-height: 0.45rem;
        margin-bottom: 0.12rem;
    }

    .content {
        display: flex;
        align-items: stretch;

        .left {
            flex: 1;
            color: var(--ex-text-color3);
            font-size: 0.28rem;
            font-weight: 400;
            line-height: 0.34rem;

            .date {

                color: var(--ex-text-color);
            }

            .tags {
                display: flex;
                align-items: center;
                margin-bottom: 0.12rem;

                .percent {
                    color: var(--ex-error-color);
                    font-size: 0.36rem;
                    line-height: 0.56rem;
                    font-weight: 600;
                    margin-right: 0.32rem;
                }

                .tag {
                    color: var(--ex-primary-color);
                    font-size: 0.24rem;
                    font-weight: 400;
                    height: 0.4rem;
                    display: flex;
                    align-items: center;
                    padding: 0 0.09rem;
                    background-color: var(--ex-bg-color3);
                    margin-right: 0.1rem;
                    border-radius: 0.04rem;
                }
            }
        }

        .right {
            padding-top: 0.1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;

            .start {
                font-size: 0.28rem;
                color: var(--ex-text-color);
                line-height: 0.48rem;
                font-weight: 500;
            }

            .btn {
                height: 0.56rem;
                padding: 0 0.36rem;
                border-radius: 0.3rem;
                background-color: var(--ex-bg-color3);
                color: var(--ex-text-color3);
                font-size: 0.24rem;
                font-weight: 400;
                display: flex;
                align-items: center;
            }
        }
    }
}
</style>