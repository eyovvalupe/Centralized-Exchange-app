<!-- 合约 -->
<template>
    <div class="stock_block">
        <Tabs v-if="!pageLoading" class="tabs" v-model:active="active" :swipeable="false" animated :color="'#014CFA'"
            shrink @change="onChange">
            <Tab title="开仓" name="0">
                <Opening @showNavDialog="showNavDialog" ref="OpeningRef" />
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
import Opening from "../contract/Opening.vue"
import Positions from "../contract/Positions.vue"
import Inquire from "../contract/Inquire.vue"


const emits = defineEmits(['showNavDialog'])
const showNavDialog = () => {
    emits('showNavDialog')
}

const active = ref(sessionStorage.getItem('trade_contract_tab') || 0)
const InquireRef = ref()
const onChange = async (val) => {
    active.value = val;
    sessionStorage.setItem('trade_contract_tab', val)
    if (val == 2) {
        setTimeout(() => {
            InquireRef.value && InquireRef.value.init()
        }, 0)
    }
};

const pageLoading = ref(true)
const OpeningRef = ref()

// 选择某个合约
const choose = item => {
    active.value = 0
    OpeningRef.value && OpeningRef.value.choose(item)
}

onMounted(() => {
    setTimeout(() => {
        pageLoading.value = false
        setTimeout(() => {
            onChange(active.value)
        }, 300)
    }, 300)
})

defineExpose({
    choose
})

</script>

<style lang="less" scoped>
.stock_block {
    position: relative;

    .date_box {
        position: absolute;
        z-index: 999;
        right: 0.2rem;
        top: 0.2rem;
        display: flex;
        align-items: center;
        color: #0953FA;
        font-size: 0.24rem;

        .date_icon {
            width: 0.48rem;
            height: 0.48rem;
            margin-right: 0.08rem;
        }
    }


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