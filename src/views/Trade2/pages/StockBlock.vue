<!-- 股票 -->
<template>
    <div class="stock_block">
        <Tabs v-if="!pageLoading" class="tabs" v-model="active" :swipeable="false" animated :color="'#014CFA'" shrink
            @change="onChange">
            <Tab title="开仓" name="0">
                <Opening ref="OpeningRef" />
            </Tab>
            <Tab title="持仓" name="1">
                <Positions />
            </Tab>
            <Tab title="查询" name="2">
                <Inquire />
            </Tab>
        </Tabs>
        <div style="height:50vh" v-else></div>
    </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, onMounted } from "vue"
import Opening from "../components/Opening.vue"
import Positions from "../components/Positions.vue"
import Inquire from "../components/Inquire.vue"


const active = ref(0)
const onChange = async (val) => {
    active.value = val;
};

const pageLoading = ref(true)
const OpeningRef = ref()

// 选择某个股票
const choose = item => {
    active.value = 0
    OpeningRef.value && OpeningRef.value.choose(item)
}

onMounted(() => {
    setTimeout(() => {
        pageLoading.value = false
    }, 200)
})

defineExpose({
    choose
})
</script>

<style lang="less" scoped>
.stock_block {
    .tabs {
        :deep(.van-tabs__nav) {
            padding-left: 0.32rem;
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