<!-- 合约 -->
<template>
    <div class="stock_block">
        <Tabs v-if="!pageLoading" type="oval-card" v-model:active="active" :swipeable="false" animated
            :color="'#014CFA'" shrink @change="onChange">
            <Tab title="开仓" name="0">
                <div class="stock_tab-body" v-if="loadTab.indexOf('0') > -1">
                    <Opening @showNavDialog="showNavDialog" @success="openSuccess" ref="OpeningRef" />
                </div>
            </Tab>
            <Tab title="持仓" name="1">
                <div class="stock_tab-body" v-if="loadTab.indexOf('1') > -1">
                    <Positions />
                </div>
            </Tab>
            <Tab title="查询" name="2">
                <div class="stock_tab-body" v-if="loadTab.indexOf('2') > -1">
                    <Inquire ref="InquireRef" />
                </div>
            </Tab>
        </Tabs>
        <div style="height:50vh" v-else></div>
    </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, onMounted, nextTick } from "vue"
import Opening from "../contract/Opening.vue"
import Positions from "../contract/Positions.vue"
import Inquire from "../contract/Inquire.vue"
import eventBus from '@/utils/eventBus'

const emits = defineEmits(['showNavDialog'])
const showNavDialog = () => {
    emits('showNavDialog', 'contract')
}

const loadTab = ref([])
const active = ref(sessionStorage.getItem('trade_contract_tab') || '0')
const InquireRef = ref()
const onChange = async (val) => {
    active.value = val;
    if (loadTab.value.indexOf(val) == -1) {
        loadTab.value.push(val)
    }
    sessionStorage.setItem('trade_contract_tab', val)
    if (val == 2) {
        nextTick(() => {
            InquireRef.value && InquireRef.value.init()
        })
    }
};

const pageLoading = ref(true)
const OpeningRef = ref()

// 选择某个合约
const choose = item => {
    active.value = 0
    OpeningRef.value && OpeningRef.value.choose(item)
}
const openSuccess = () => {
    //开仓成功，切换到持仓
    // active.value = '1'
    onChange('1')
}

const handleMounted = () => {
    setTimeout(() => {
        pageLoading.value = false
        setTimeout(() => {
            onChange(active.value)
        }, 300)
    }, 300)
}
onMounted(() => {
    pageLoading.value = false
    onChange(active.value)

    eventBus.on("contractTradeBodyScrollToBottom", () => {
        if (active.value == '2') {
            // 加载更多
            InquireRef.value && InquireRef.value.getList()
        }
    })
})
onUnmounted(() => {
    eventBus.off("contractTradeBodyScrollToBottom")

})

defineExpose({
    choose,
    handleMounted
})

</script>


<style lang="less" scoped>
.stock_block {
    position: relative;
    padding: 0.16rem 0 0.32rem 0;

    :deep(.van-tabs__nav) {
        margin: 0 0.32rem;
    }

    .stock_tab-body {
        padding: 0 0.32rem;
    }
}
</style>