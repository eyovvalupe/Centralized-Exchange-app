<!-- 股票 -->
<template>
    <div class="stock_block">
        <!-- 日期 -->
        <!-- <div class="date_box" v-show="active == 2" @click="openDate">
            <div class="date_icon">
                <img src="/static/img/trade/time.png" alt="img">
            </div>
        </div> -->
        <Tabs type="custom-card" v-model:active="active" :swipeable="false"
            :color="'#014CFA'" shrink @change="onChange">
            <Tab :title="t('trade.stock_open')" name="0">
            </Tab>
            <Tab :title="t('trade.stock_position')" name="1">
            </Tab>
            <Tab :title="t('trade.stock_search')" name="2">
            </Tab>
        </Tabs>

        <Swiper
            :initialSlide="initialSlide"
            :allowTouchMove="false"
            :autoHeight="true"
            class="w-full overflow-hidden"
            @swiper="setSwiper"
        >
            <SwiperSlide>
                <div class="stock_tab-body">
                    <Opening @showNavDialog="showNavDialog" @success="onChange('1')" ref="OpeningRef" v-if="loadTab.indexOf('0') > -1" />
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div class="stock_tab-body">
                    <Positions v-if="loadTab.indexOf('1') > -1" />
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div class="stock_tab-body">
                    <Inquire ref="InquireRef" v-if="loadTab.indexOf('2') > -1" />
                </div>
            </SwiperSlide>
        </Swiper>

        <!-- 日期选择 -->
        <DateArea @submit="submitDate" ref="dateAreaRef" />
    </div>
</template>

<script setup>
import "swiper/css"
import { Swiper,SwiperSlide } from "swiper/vue"
import { Tab, Tabs } from "vant";
import { ref, onMounted } from "vue"
import Opening from "../components/Opening.vue"
import Positions from "../components/Positions.vue"
import Inquire from "../components/Inquire.vue"
import DateArea from "@/components/DateArea.vue"
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emits = defineEmits(['showNavDialog'])
const showNavDialog = () => {
    emits('showNavDialog', 'stock')
}
const loadTab = ref([])
const active = ref(sessionStorage.getItem('trade_stock_tab') || '0')
const initialSlide = active.value

const InquireRef = ref()
let swipe = null
const setSwiper = (_swiper)=>{
    swipe = _swiper
}

const onChange = async (val) => {
    if (loadTab.value.indexOf(val) == -1) {
        loadTab.value.push(val)
    }
    active.value = val;
    sessionStorage.setItem('trade_stock_tab', val)
    if(swipe){
        swipe.slideTo(val)
    }
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

const OpeningRef = ref()


// 选择某个股票
const choose = item => {
    active.value = '0'
    OpeningRef.value && OpeningRef.value.choose(item)
}
const handleMounted = () => {
    loadTab.value = []
    setTimeout(() => {
        onChange(active.value)
    }, 300)
}
onMounted(() => {
    onChange(active.value)
})

defineExpose({
    choose,
    handleMounted
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
    padding: 0.24rem 0 0.32rem 0;

    :deep(.van-tabs__nav) {
        margin: 0 0.32rem;
    }

    .tabs {

        :deep(.van-tabs__wrap) {
            background: #EFF3F8;
            margin: 0 .32rem;
            border-radius: .32rem;
            height: 0.8rem;

            .van-tabs__nav {
                padding-left: 0.32rem;
                position: relative;
                display: flex;
                justify-content: space-between;

                .van-tab {
                    width: 33%;
                }

            }

        }
    }
}
</style>