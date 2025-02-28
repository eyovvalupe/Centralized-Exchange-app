<!-- 行情图表 -->
<template>
  <div class="market-charts">
    <!-- 图表 -->
    <div class="chart_box" id="chart_box_c">
      <div class="tabs" :class="{ '!p-[0]': from == 'constract' }">
        <div class="tab tab_ani" :class="{ active_tab: timeType == 'Time' }" @click="changeType('Time')">
          Time
        </div>
        <div class="tab tab_ani" @click="showPicker = true" :class="{ active_tab: minList.includes(timeType) }">
          {{ currMin }}
          <Icon style="transform: rotate(90deg)" size="0.16rem" class="ml-[0.06rem]" name="play" />
        </div>
        <div class="tab tab_ani" :class="{ active_tab: timeType == '1h' }" @click="changeType('1h')">
          1h
        </div>
        <div class="tab tab_ani" v-if="!['stocks', 'forex'].includes(periodType)"
          :class="{ active_tab: timeType == '4h' }" @click="changeType('4h')">
          4h
        </div>
        <div class="tab tab_ani" :class="{ active_tab: timeType == '1D' }" @click="changeType('1D')">
          1D
        </div>
        <div class="tab tab_ani" :class="{ active_tab: timeType == '1W' }" @click="changeType('1W')">
          1W
        </div>
        <div class="tab tab_ani" :class="{ active_tab: timeType == '1M' }" @click="changeType('1M')">
          1M
        </div>
        <div class="tab tab_ani" v-if="!['stocks', 'forex'].includes(periodType)"
          :class="{ active_tab: timeType == '1Y' }" @click="changeType('1Y')">
          1Y
        </div>
        <div style="flex:1"></div>
        <!-- 全屏 -->
        <div class="full-tab" @click="fullScreen(true)" v-if="!props.mini">
          <img v-lazy="getStaticImgUrl('/static/img/common/full.svg')" alt="" />
        </div>
        <!-- 折叠 -->
        <div class="full-tab mini-tab" v-if="props.mini" @click="switchZipo"
          :style="{ transform: `rotate(${zipo ? 180 : 0}deg)` }">
          <img v-lazy="getStaticImgUrl('/static/img/common/switch.svg')" alt="" />
        </div>
      </div>
      <Teleport :to="'body'" v-if="fullWindow">
        <div v-show="!(props.mini && zipo)" class="chart_container" :class="{ fullscreen_container: fullWindow }">
          <!-- 时区 -->
          <div v-if="showDate" class="chart_time">{{ showDate }}</div>
          <!-- 分时图 -->
          <AreaChart :mini="props.mini" ref="AreaChartRef" v-if="timeType == 'Time'" :showY="true"
            :symbol="item.symbol" />
          <!-- K线图 -->
          <KlineChart :mini="props.mini" ref="KlineChartRef" v-if="timeType != 'Time'" :symbol="item.symbol"
            :period="timeType" />
          <!-- 全屏关闭按钮 -->
          <div class="full_close" v-if="fullWindow" @click="fullScreen(false)">
            <Icon name="cross" />
          </div>
        </div>
      </Teleport>
      <div v-else v-show="!(props.mini && zipo)" class="chart_container"
        :class="{ fullscreen_container: fullWindow, '!p-[0]': from == 'constract' }">
        <!-- 时区 -->
        <div v-if="showDate" class="chart_time">{{ showDate }}</div>
        <!-- 分时图 -->
        <AreaChart :mini="props.mini" ref="AreaChartRef" v-if="timeType == 'Time'" :showY="true"
          :symbol="item.symbol" />
        <!-- K线图 -->
        <KlineChart :mini="props.mini" ref="KlineChartRef" v-if="timeType != 'Time'" :symbol="item.symbol"
          :period="timeType" />
        <!-- 全屏关闭按钮 -->
        <div class="full_close" v-if="fullWindow" @click="fullScreen(false)">
          <Icon name="cross" />
        </div>
      </div>
    </div>


    <!-- 时间选择弹窗 -->
    <BottomPopup :safe-area-inset-top="true" :safe-area-inset-bottom="true" v-model:show="showPicker">
      <div class="times_list">
        <div v-for="item in minList" :key="item" @click="chooseTime(item)" class="item"
          :class="{ active_item: currMin == item }">
          {{ item }}
        </div>
      </div>
    </BottomPopup>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import AreaChart from "@/components/KlineCharts/AreaChart.vue";
import KlineChart from "@/components/KlineCharts/KlineChart.vue";
import { getStaticImgUrl } from "@/utils/index.js"
import { Icon, Popup, showToast } from "vant";
import BottomPopup from "@/components/BottomPopup.vue";
import store from "@/store";
import { formatTimestamp } from "@/utils/time";

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  mini: { // 如果事mini 就不要全屏了  换成折叠
    type: Boolean,
    default: false
  },
  from: {
    type: String,
    default: "",
  }
});
const periodType = computed(() => props.type);
const emits = defineEmits(['switch'])

const zipo = ref(false) // 折叠状态
const switchZipo = () => {
  zipo.value = !zipo.value
  emits('switch', zipo.value)
}

// 股票信息
const item = computed(() => {
  let it = {};
  const type = props.type;
  switch (type) {
    case "constract": // 合约
      it = store.state.currConstact || {};
      break;
    case "ai": // 合约
      it = store.state.currAi || {};
      break;
    default:
      it = store.state.currStockItem || {};
  }
  return it;
});

// 图表信息  Time 1m 5m 10m 15m 30m 1h 4h 1D 1W 1M 1Y
const timeType = ref("1h");
const showPicker = ref(false); // 时间选择弹窗
const currMin = ref("1m");
const minList = computed(() => {
  if (
    periodType.value == "futures" ||
    periodType.value == "aiquant" ||
    periodType.value == "constract"
  ) {
    return ["1m", "5m", "15m", "30m"];
  }
  return ["1m", "5m", "10m", "15m", "30m"];
});
const chooseTime = (time) => {
  showPicker.value = false;
  currMin.value = time;
  changeType(time);
};
const changeType = (type) => {
  if (timeType.value == type) return;
  timeType.value = type;
};
const showDate = computed(() => {
  // 展示的数据时间
  if (item.value.timestamp || item.value.ts) {
    return formatTimestamp(
      item.value.timestamp || item.value.ts,
      item.value.timezone
    );
  }
  return "";
});


// 全屏
store.commit("setFullscreen", false);
const fullWindow = computed(() => store.state.fullscreen);
const KlineChartRef = ref();
const AreaChartRef = ref();
const fullScreen = (key) => {
  store.commit("setFullscreen", key);
  if (KlineChartRef.value) KlineChartRef.value.resetSize();
  if (AreaChartRef.value) AreaChartRef.value.resetSize();
};

defineExpose({
  timeType,
  zipo,
})
</script>

<style lang="less" scoped>
.market-charts {
  display: flex;
  flex-direction: column;
  height: 100%;

  .chart_box {
    width: 100%;
    padding: 0.2rem;
    border-radius: 0.32rem;
    overflow: hidden;
    background-color: var(--ex-bg-color3);
    // height: calc(var(--app-height) - 4.8rem);
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    display: flex;


    .tabs {
      padding: 0 0.2rem;
      height: 0.48rem;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .tab {
        height: 0.48rem;
        background-color: var(--ex-bg-color3);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.3rem;
        color: var(--ex-text-color2);
        font-size: 0.24rem;
        font-weight: 400;
        margin-right: 0.1rem;
        padding: 0 0.1rem;
        min-width: 0.64rem;
      }

      .active_tab {
        background-color: var(--ex-white);
        color: var(--ex-text-color--bg-light);
      }
    }

    .full-tab {
      color: var(--ex-text-color);
      font-size: 0.32rem;
      width: 0.48rem;
      height: 0.48rem;
      border-radius: 50%;
      display: center;
      align-items: center;
      justify-content: center;
      text-align: center;
      line-height: 0;
    }

    .mini-tab {
      width: 0.32rem;
      height: 0.32rem;
      transition: all ease-in .2s;
      transform: rotate(0);
    }


  }
}

.times_list {
  padding: 0.5rem 0.32rem;

  .item {
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.28rem;
    color: var(--ex-text-color2);
    overflow: hidden;
  }

  .active_item {
    background-color: var(--ex-bg-color2);
    color: var(--ex-primary-color);
    border-radius: 0.32rem;
  }
}
</style>

<style lang="less">
.chart_container {
  min-height: 3rem;
  flex: 1;
  width: 100%;
  padding: 0 0.28rem;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .chart_time {
    position: absolute;
    display: flex;
    align-items: center;
    height: 0.38rem;
    z-index: 999;
    top: 0.24rem;
    left: 0.24rem;
    padding: 0.1rem 0.15rem;
    background: #00000080;
    border-radius: 0.15rem;
    color: var(--ex-white);
    font-size: 0.22rem;
    font-weight: 400;
    line-height: 0.22rem;
  }
}

.fullscreen_container {
  position: fixed;
  z-index: 9999;
  width: 100vw;
  height: var(--app-height);
  top: 0;
  // left: 100vw;
  left: 0;
  background-color: var(--ex-bg-color);
  // transform: rotate(90deg);
  // transform-origin: 0% 0%;

  .full_close {
    width: 0.4rem;
    height: 0.4rem;
    position: absolute;
    right: 0.4rem;
    top: 0.4rem;
    color: var(--ex-text-color);
    font-size: 0.4rem;
    z-index: 99999;
  }
}

@media (min-width: 751px) {
  .fullscreen_container {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transform: none;
  }
}
</style>