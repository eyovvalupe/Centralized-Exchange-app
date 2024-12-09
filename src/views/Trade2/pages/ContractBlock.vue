<!-- 合约 -->
<template>
  <div class="stock_block">
    <Tabs type="oval-card" v-model:active="active" :swipeable="false" :color="'#014CFA'"
      shrink @change="onChange">
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
        @slideChange="swipeChange"    
    >
          <SwiperSlide>
            <div class="stock_tab-body">
              <Opening :mode="props.mode" :type="'constract'" v-if="loadTab.indexOf('0') > -1" @showNavDialog="showNavDialog" @success="openSuccess" ref="OpeningRef" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div class="stock_tab-body">
              <Positions :type="'constract'" v-if="loadTab.indexOf('1') > -1" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div class="stock_tab-body">
              <Inquire :type="'constract'" v-if="loadTab.indexOf('2') > -1" ref="InquireRef" />
            </div>
          </SwiperSlide>
      </Swiper>

  </div>
</template>

<script setup>
import "swiper/css"
import { Swiper,SwiperSlide } from "swiper/vue"
import { Tab, Tabs } from "vant";
import { ref, onMounted, nextTick } from "vue";
import Opening from "../contract/Opening.vue";
import Positions from "../contract/Positions.vue";
import Inquire from "../contract/Inquire.vue";
import eventBus from "@/utils/eventBus";
import { useI18n } from "vue-i18n";

const props = defineProps({
  mode: { // constract-加密货币 foreign-外汇 commodities-大宗交易
    type: String,
    default: 'constract'
  }
})

const { t } = useI18n();
const emits = defineEmits(["showNavDialog"]);
const showNavDialog = () => {
  emits("showNavDialog", "contract");
};

let swipe = null
const setSwiper = (_swiper)=>{
    swipe = _swiper
}

const loadTab = ref([]);
const active = ref(sessionStorage.getItem("trade_contract_tab") || "0");
const initialSlide = ref(active.value)
const InquireRef = ref();
const onChange = async (val) => {
  active.value = val;
  if (loadTab.value.indexOf(val) == -1) {
    loadTab.value.push(val);
  }
  sessionStorage.setItem("trade_contract_tab", val);
  if(swipe){
      swipe.slideTo(val)
  }
  if (val == 2) {
    nextTick(() => {
      InquireRef.value && InquireRef.value.init();
    });
  }
};

const OpeningRef = ref();

// 选择某个合约
const choose = (item) => {
  active.value = 0;
  OpeningRef.value && OpeningRef.value.choose(item);
};
const openSuccess = () => {
  //开仓成功，切换到持仓
  // active.value = '1'
  onChange("1");
};

const handleMounted = () => {
  loadTab.value = []
  setTimeout(() => {
    onChange(active.value);
  }, 300);
};
onMounted(() => {
  onChange(active.value);

  eventBus.on("contractTradeBodyScrollToBottom", () => {
    if (active.value == "2") {
      // 加载更多
      InquireRef.value && InquireRef.value.getList();
    }
  });
});
onUnmounted(() => {
  eventBus.off("contractTradeBodyScrollToBottom");
});

defineExpose({
  choose,
  handleMounted,
});
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
