<!-- 股票 -->
<template>
    <div class="stock_block">
        <Tabs class="tabs" v-model="active" :swipeable="false" animated :color="'#014CFA'" shrink @change="onChange">
            <Tab title="开仓" name="0"> 开仓</Tab>
            <Tab title="持仓" name="1"> 持仓</Tab>
            <Tab title="查询" name="2"> 查询</Tab>
        </Tabs>
    </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref } from "vue"

const active = ref(0)
const onChange = async (val) => {
    active.value = val;
};
</script>

<style lang="less" scoped>
.stock_block {
    .tabs {
        :deep(.van-tabs__wrap) {
            padding: 0 0.32rem;
        }

        :deep(.van-tabs__nav) {
            position: relative;

            &::after {
                content: '';
                width: 100%;
                height: 1px;
                background-color: #3B82F6;
                position: absolute;
                bottom: 16px;
                left: 0;
                opacity: 0.3;
            }
        }
    }
}
</style>