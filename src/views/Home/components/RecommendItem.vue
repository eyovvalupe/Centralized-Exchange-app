<!-- 推荐元素 -->
<template>
    <div class="stock_tab">
        <div class="tab_title">{{ props.item.symbol || '--' }}</div>
        <!-- <div class="tab_subtitle">{{ item.name || '--' }}</div> -->
        <div style="display: flex;align-items: center;justify-content: space-between;">
            <div class="tab_num" v-if="props.item.price">{{ props.item.price ?
                props.item.price : '--' }}</div>
            <div class="tab_num" v-if="props.item.ratio" :class="[(props.item.ratio > 0 ? 'up' : 'down')]">
                {{ isNaN(props.item.ratio) ? '--' : props.item.ratio }}%</div>
        </div>

        <div class="tab_line">
            <SparkLine style="width:100%;height:100%;transform: scaleX(1.75);" :points="props.item.points"
                :ratio="props.item.ratio" />
        </div>
    </div>
</template>

<script setup>
import SparkLine from "@/components/SparkLine.vue"
const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    }
})
</script>

<style lang="less" scoped>
.stock_tab {
    width: 100%;
    height: 100%;
    border: 1px solid var(--ex-bg-color2);
    border-radius: 0.08rem;
    padding: 0.17rem;
    position: relative;
    background-color: var(--ex-bg-color2);

    .tab_title {
        font-weight: 700;
        font-size: 0.24rem;
        color: var(--ex-text-color);
        line-height: 0.274rem;
        margin-bottom: 0.06rem;
    }

    .tab_subtitle {
        color: var(--ex-text-color3);
        font-weight: 400;
        font-size: 0.2rem;
        margin-bottom: 0.14rem;
    }

    .tab_num {
        color: var(--ex-text-color);
        font-weight: 600;
        font-size: 0.2rem;
        line-height: 0.25rem;
    }

    .tab_line {
        position: absolute;
        bottom: 0;
        width: calc(100% - 0.34rem);
        transform-origin: 0 0;
        height: 0.6rem;
        overflow: hidden;
    }
}
</style>