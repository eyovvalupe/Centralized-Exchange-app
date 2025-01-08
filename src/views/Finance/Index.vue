<!-- 资产页 -->
<template>
    <div class="page page_finance">
        <!-- 头部 -->
        <HeaderTabs v-model:active="activeTab" :tabs="[
            t('DeFi借币'),
            t('finance.portfolio_title'),
        ]" @change="changeActiveTab(activeTab, true)" />

        <Swipe :autoplay="0" :initial-swipe="initialSwipe" :show-indicators="false" ref="swipe" @change="swipeChange">
            <SwipeItem>
                <!-- <div ref="" v-if="loadedTab.indexOf(0) > -1"
                    @click="(val) => click(val)">aaaaaa</div> -->
                    <div>aaa</div>
            </SwipeItem>
            <SwipeItem>
                <!-- 质押挖矿 -->
                <Stake v-if="loadedTab.indexOf(1) > -1" />
                    <!-- <div>bbb</div> -->
            </SwipeItem>
        </Swipe>
    </div>
</template>

<script setup>
import { Swipe, SwipeItem } from "vant";
import { ref } from "vue";
import { useRoute } from "vue-router";
import HeaderTabs from "@/components/HeaderTabs.vue";
import { useI18n } from "vue-i18n";
import Stake from "./Stake.vue";

const { t } = useI18n();

const route = useRoute();

const activeTab = ref(route.query.activeTab ? Number(route.query.activeTab) : Number(localStorage.getItem('financeActiveTab')) || 0);
const initialSwipe = ref(activeTab.value);
const loadedTab = ref([activeTab.value]);
const swipe = ref(null);
const changeActiveTab = (val, slideSwipe = false) => {
    activeTab.value = val;
    if (loadedTab.value.indexOf(val) == -1) {
        loadedTab.value.push(val);
    }
    localStorage.setItem('financeActiveTab', val)
    if (slideSwipe && swipe.value) {
        swipe.value.swipeTo(val);
    }
};
const swipeChange = (val) => {
    changeActiveTab(val);
};

</script>
<style lang="less">
.page_finance {
    height: 100vh;
    overflow: hidden;
}
</style>