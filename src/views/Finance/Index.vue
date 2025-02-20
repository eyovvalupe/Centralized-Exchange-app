<!-- 资产页 -->
<template>
    <div class="page page_finance">
        <!-- 头部 -->
        <HeaderTabs v-model:active="activeTab" :tabs="[
            t('copy.title'),
            t('finance.defi_borrow'),
            t('finance.portfolio_title'),
        ]" @change="changeActiveTab(activeTab, true)" />

        <Swipe v-if="pageLoaded" :autoplay="0" :initial-swipe="initialSwipe" :show-indicators="false" :touchable="true"
            :loop="false" :duration="300" ref="swipe" @change="swipeChange">
            <SwipeItem>
                <div style="height: calc(var(--vh) * 100 - 1rem);padding-bottom: 1.4rem;">
                    <Follow :from="'finance'" />
                </div>
            </SwipeItem>
            <SwipeItem>
                <div style="height: calc(var(--vh) * 100 - 1rem);padding-bottom: 1.4rem;">
                    <Pledge />
                </div>
            </SwipeItem>
            <SwipeItem>
                <div style="height: calc(var(--vh) * 100 - 1rem);padding-bottom: 1.4rem;">
                    <Stake />
                </div>
            </SwipeItem>
        </Swipe>
    </div>
</template>

<script setup>
import { Swipe, SwipeItem } from "vant";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import HeaderTabs from "@/components/HeaderTabs.vue";
import { useI18n } from "vue-i18n";
import Stake from "./Stake.vue";
import Pledge from './Pledge.vue';
import Follow from '../Home/Follow/Index.vue'
const { t } = useI18n();

const route = useRoute();

const activeTab = ref(route.query.activeTab ? Number(route.query.activeTab) : Number(localStorage.getItem('financeActiveTab')) || 0);
const initialSwipe = ref(activeTab.value);
const loadedTab = ref([activeTab.value]);
const swipe = ref(null);
const changeActiveTab = (val, slideSwipe = false) => {
    let normalizedVal = val;
    // Normalize the value for circular navigation
    if (val >= 3) normalizedVal = 0;
    if (val < 0) normalizedVal = 2;

    activeTab.value = normalizedVal;
    if (loadedTab.value.indexOf(normalizedVal) == -1) {
        loadedTab.value.push(normalizedVal);
    }
    localStorage.setItem('financeActiveTab', normalizedVal)
    if (slideSwipe && swipe.value) {
        swipe.value.swipeTo(normalizedVal);
    }
};
const swipeChange = (val) => {
    changeActiveTab(val);
};


const pageLoaded = ref(false)
onMounted(() => {
    setTimeout(() => {
        pageLoaded.value = true
    }, 300)
})
</script>
<style lang="less">
.page_finance {
    height: calc(var(--vh) * 100);
    overflow: hidden;
}
</style>