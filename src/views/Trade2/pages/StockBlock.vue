<!-- 股票 -->
<template>
    <div class="stock_block">
        <!-- 日期 -->
        <div class="date_box" v-show="active == 2" @click="openDate">
            <div class="date_icon">
                <img src="/static/img/trade/time.png" alt="img">
            </div>
            <!-- <span>日期</span> -->
        </div>
        <Tabs v-if="!pageLoading" class="tabs" v-model:active="active" :swipeable="false" animated :color="'#014CFA'"
            shrink @change="onChange">
            <Tab title="开仓" name="0">
                <Opening ref="OpeningRef" />
            </Tab>
            <Tab title="持仓" name="1">
                <Positions />
            </Tab>
            <Tab title="查询" name="2">
                <Inquire ref="InquireRef" />
            </Tab>
        </Tabs>
        <div style="height:50vh" v-else></div>


        <!-- 日期选择 -->
        <DateArea @submit="submitDate" ref="dateAreaRef" />
    </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, onMounted } from "vue"
import Opening from "../components/Opening.vue"
import Positions from "../components/Positions.vue"
import Inquire from "../components/Inquire.vue"
import DateArea from "@/components/DateArea.vue"


const active = ref(sessionStorage.getItem('trade_stock_tab') || 0)
const InquireRef = ref()
const onChange = async (val) => {
    active.value = val;
    sessionStorage.setItem('trade_stock_tab', val)
    if (val == 2) {
        setTimeout(() => {
            InquireRef.value && InquireRef.value.init()
        }, 0)
    }
};
const submitDate = times => {
    setTimeout(() => {
        InquireRef.value && InquireRef.value.init(times)
    }, 0)
}

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
        setTimeout(() => {
            onChange(active.value)
        }, 300)
    }, 300)
})

defineExpose({
    choose
})

// 日期选择
const dateAreaRef = ref()
const openDate = () => {
    dateAreaRef.value && dateAreaRef.value.open()
}
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