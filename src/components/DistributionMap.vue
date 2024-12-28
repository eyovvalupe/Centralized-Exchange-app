<!-- 市场分布图 -->
<template>
    <div class="distribution_map">
        <div class="title">
            <span>市场涨跌分布</span>
            <span class="total">总计 7.425</span>
        </div>
        <div class="subtitle">
            <span class="up">
                <Icon style="transform: rotate(-90deg);" name="play" />
                65.63 (76,23%)
            </span>
            <span class="date">今天</span>
        </div>
        <!-- 图表 -->

    </div>
</template>

<script setup>
import { Icon } from "vant"
import { ref } from "vue"


const list = ref([
    { name: '涨停', val: 41, bgColor: '', color: '' },
    { name: '>7%',  val: 41, bgColor: '', color: '' },
    { name: '7~5%', val: 41, bgColor: '', color: '' },
    { name: '5~2%', val: 41, bgColor: '', color: '' },
    { name: '2~0%', val: 41, bgColor: '', color: '' },
])
</script>

<style scoped lang="less">
.distribution_map {
    margin-bottom: 0.4rem;

    .title {
        font-size: 0.32rem;
        color: var(--ex-text-color3);
        line-height: 0.48rem;
        font-weight: 400;
        margin-bottom: 0.2rem;

        .total {
            color: var(--ex-text-color);
            margin-left: 0.2rem;
        }
    }

    .subtitle {
        font-size: 0.24rem;
        line-height: 0.48rem;
        font-weight: 400;

        .date {
            color: var(--ex-text-color3);
            margin-left: 0.15rem;
        }
    }
}
</style>