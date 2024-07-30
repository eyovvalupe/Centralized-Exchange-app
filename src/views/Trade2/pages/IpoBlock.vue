<!-- ipo相关 -->
<template>
    <Tabs class="tabs" @change="ipoOnChange" v-model:active="ipoActive" :swipeable="false" animated :color="'#014CFA'"
        shrink>
        <Tab :title="'IPO'" class="optional">
            <div style="height: 0.4rem"></div>
            <IPO v-if="ipoActive == 0" :type="'trade'" ref="IPORef" />
        </Tab>
        <Tab :title="'中签'">
            <IPOStock v-if="ipoActive == 1" ref="IPOStockRef" />
        </Tab>
    </Tabs>
</template>

<script setup>
import IPO from "../../Market/components/IPO.vue"
import IPOStock from "./IPOStock.vue";
import { Tab, Tabs } from "vant";
import { ref } from "vue"

const IPOStockRef = ref()
const IPORef = ref()

const ipoActive = ref(0)
const ipoOnChange = (val) => {
    ipoActive.value = val
    setTimeout(() => {
        switch (val) {
            case 0:
                IPORef.value && IPORef.value.init()
                break
            case 1:
                IPOStockRef.value && IPOStockRef.value.init()
                break
        }
    }, 500)
}

</script>

<style lang="less" scoped>
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
</style>