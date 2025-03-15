<!-- 资产页 -->
<template>
    <!-- 头部 -->
    <HeaderTabs :from="'finance'" type="custom-line" v-model:active="activeTab" :tabs="[
        t('copy.title'),
        t('finance.defi_borrow'),
        t('finance.portfolio_title'),
        t('IPO')
    ]" @change="changeActiveTab(activeTab, true)" />

    <Swipe v-if="pageLoaded" :autoplay="0" :initial-swipe="initialSwipe" :show-indicators="false" :touchable="true"
        :loop="false" :duration="300" ref="swipe" @change="swipeChange">
        <SwipeItem>
            <div style="height: calc(var(--vh) * 100 - 3.24rem);">
                <Follow :from="'finance'" />
            </div>
        </SwipeItem>
        <SwipeItem>
            <div style="height: calc(var(--vh) * 100 - 3.24rem);">
                <Pledge />
            </div>
        </SwipeItem>
        <SwipeItem>
            <div style="height: calc(var(--vh) * 100 - 3.24rem);">
                <Stake />
            </div>
        </SwipeItem>
        <SwipeItem>
            <div style="height: calc(var(--vh) * 100 - 3.24rem);">
                <IPO ref="ipoRef" />
            </div>
        </SwipeItem>
    </Swipe>
</template>

<script setup>
import { Swipe, SwipeItem } from "vant";
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import HeaderTabs from "@/components/HeaderTabs.vue";
import { useI18n } from "vue-i18n";
import Stake from "./Stake.vue";
import Pledge from './Pledge.vue';
import Follow from '../Home/Follow/Index.vue'
import store from "@/store";
import IPO from "../Market/IPO.vue";
const { t } = useI18n();

const route = useRoute();
const financeType = computed(() => store.state.financeSubType)

const activeTab = ref(route.query.activeTab ? Number(route.query.activeTab) : Number(localStorage.getItem('financeActiveTab')) || 0);
const initialSwipe = ref(activeTab.value);
const loadedTab = ref([activeTab.value]);
const swipe = ref(null);
const ipoRef = ref()

const changeActiveTab = (val, slideSwipe = false) => {
    // console.log(val)
    let normalizedVal = val;
    // Normalize the value for circular navigation
    if (val >= 4) normalizedVal = 0;
    if (val < 0) normalizedVal = 3;
    if (val == 3) ipoRef.value.init();
    activeTab.value = normalizedVal;
    if (loadedTab.value.indexOf(normalizedVal) == -1) {
        loadedTab.value.push(normalizedVal);
    }
    store.commit('setFinanceSubType', normalizedVal)
    localStorage.setItem('financeActiveTab', normalizedVal)
    if (slideSwipe && swipe.value) {
        swipe.value.swipeTo(normalizedVal);
    }
};
const swipeChange = (val) => {
    changeActiveTab(val);
    if (val == 3) {
        ipoRef.value.init();
    }
};

watch(financeType, (val) => {
    activeTab.value = financeType.value
})

watch(activeTab, (val) => {
    changeActiveTab(val, true)
})
watch(route, (val) => {
    if (val.name == "tradeInfo" && val.query.tradeType) {
        if (['copy', 'borrow', 'stake', 'ipo'].includes(val.query.tradeType)) { // 理财
            activeTab.value = { 'copy': 0, 'borrow': 1, 'stake': 2, 'ipo': 3 }[val.query.tradeType]
        }
    }
}, { immediate: true })


const pageLoaded = ref(false)
onMounted(() => {
    setTimeout(() => {
        pageLoaded.value = true
    }, 300)
})
</script>
