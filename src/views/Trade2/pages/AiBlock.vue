<!-- ai -->
<template>
    <div class="ai-block">
        <Tabs v-if="!pageLoading" class="tabs" v-model:active="active" :swipeable="false" animated :color="'#014CFA'"
            shrink @change="onChange">
            <Tab title="开仓" name="0">
                <Opening />
            </Tab>
            <Tab title="持仓" name="1">
                <Positions />
            </Tab>
            <Tab title="查询" name="2">
                <Inquire ref="InquireRef" />
            </Tab>
        </Tabs>
        <div style="height:50vh" v-else></div>
    </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, onMounted } from "vue"
import Opening from "../ai/Opening.vue"
import Positions from "../ai/Positions.vue"
import Inquire from "../ai/Inquire.vue"


const active = ref(sessionStorage.getItem('trade_ai_tab') || 0)
const InquireRef = ref()
const onChange = async (val) => {
    active.value = val;
    sessionStorage.setItem('trade_ai_tab', val)

    if (val == 2) {
        InquireRef.value && InquireRef.value.init()
    }
};

const pageLoading = ref(true)
onMounted(() => {
    setTimeout(() => {
        pageLoading.value = false
    }, 300)
})
</script>

<style lang="less" scoped>
.ai-block {
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