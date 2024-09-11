<!-- 买币 -->
<template>
    <div class="page page-buycoin">

        <Tabs v-if="!pageLoading" class="tabs" v-model:active="active" :swipeable="false" animated :color="'#014CFA'"
            shrink @change="onChange">
            <Tab title="快捷区" name="0">
                <Faster />
            </Tab>
            <Tab title="自选区" name="1">

            </Tab>
            <Tab title="我的订单" name="2">

            </Tab>
        </Tabs>

    </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, onMounted } from "vue"
import Faster from "./Faster.vue"


const active = ref(0)
const onChange = i => {

}

const pageLoading = ref(true)
onMounted(() => {
    setTimeout(() => {
        pageLoading.value = false
    }, 300)
})
</script>

<style lang="less" scoped>
.page-buycoin {
    .tabs {
        :deep(.van-tabs__wrap) {
            padding: 0 0.32rem !important;
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