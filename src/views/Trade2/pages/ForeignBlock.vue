<!-- 外汇 -->
<template>
    <div class="stock_block">
        <Tabs v-if="!pageLoading" type="foreign_card" v-model:active="active" :swipeable="false" animated
            :color="'#014CFA'" shrink @change="onChange">
            <Tab :title="t('trade.stock_open')" name="0">
                <div class="stock_tab-body" v-if="loadTab.indexOf('0') > -1">
                    <Opening @showNavDialog="showNavDialog" @success="onChange('1')" ref="OpeningRef" />
                </div>
            </Tab>
            <Tab :title="t('trade.stock_position')" name="1">
                <div class="stock_tab-body" v-if="loadTab.indexOf('1') > -1">
                    <Positions />
                </div>
            </Tab>
            <Tab :title="t('trade.stock_search')" name="2">
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
import { ref, onMounted } from "vue"
import Opening from "../foreign/Opening.vue"
import Positions from "../foreign/Positions.vue"
import Inquire from "../foreign/Inquire.vue"
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emits = defineEmits(['showNavDialog'])
const showNavDialog = () => {
    emits('showNavDialog', 'stock')
}
const loadTab = ref([])
const active = ref(sessionStorage.getItem('trade_stock_tab') || '0')
const InquireRef = ref()
const onChange = async (val) => {
    if (loadTab.value.indexOf(val) == -1) {
        loadTab.value.push(val)
    }
    active.value = val;
    sessionStorage.setItem('trade_stock_tab', val)
    if (val == 2) {
        setTimeout(() => {
            InquireRef.value && InquireRef.value.init()
        }, 0)
    }
};


const pageLoading = ref(true)
const OpeningRef = ref()

// 选择某个股票
const choose = item => {
    active.value = '0'
    OpeningRef.value && OpeningRef.value.choose(item)
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
})

defineExpose({
    choose,
    handleMounted
})

</script>

<style lang="less" scoped>
.stock_block {
    position: relative;
    padding: 0 0 0.32rem 0;

    :deep(.van-tabs__nav--foreign_card) {
        width: calc(100% - 0.64rem);
        margin: 0 0.32rem;
        height: 0.92rem;

        .van-tab--foreign_card {
            flex: 1;
            background-color: #F5F7FC;

            &:first-child {
                border-radius: 0.32rem 0 0 0;

                &.van-tab--active {
                    border-radius: 0.32rem 0 0.32rem 0;
                }
            }

            &:last-child {
                border-radius: 0 0.32rem 0 0;

                &.van-tab--active {
                    border-radius: 0 0.32rem 0 0.32rem;
                }
            }

            &.van-tab--active {
                background-color: #014CFA;
                color: #fff;
                border-radius: 0.32rem 0 0.32rem 0;
            }
        }
    }
}
</style>