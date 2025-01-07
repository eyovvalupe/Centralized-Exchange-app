<!-- ai量化-订单详情 -->
<template>
  <Popup class="aiinfo-popup" teleport="body" lazy-render v-model:show="showModel" position="right"
    style="width: 100%; height: 100%">
    <Top :title="t('trade.ai_position_title')" :backFunc="backFunc" />

    <div class="loading-wrap" v-if="loading">
      <Loading v-if="loading" size="44px" color="var(--ex-primary-color)" />
    </div>
    <div class="ai_order_info" v-show="!loading">
      <!-- 盈利 -->
      <div class="win" v-if="currItem.status == 'close'">
        <img :src="getStaticImgUrl('/static/img/trade/profit_bg.png')" class="win_bg" v-if="currItem.profit >= 0" />
        <div class="win_bg loss_bg" v-else></div>
        <div class="win-animate-bg" v-if="!loading"></div>
        <div class="win_name">{{ t('trade.ai_position_profit') }}</div>
        <div class="amount" :class="[currItem.profit < 0 ? 'down' : 'up']">
          {{ currItem.profit >= 0 ? "+" : "" }}{{ currItem.profit }}
        </div>
      </div>

      <div class="win-box" v-else>
        <!-- 加载 -->

        <div class="circle-wrap">
          <div class="circle-mid">
            <div class="time">{{ formatSec22(t, currItem.endtime) }}</div>
            <div class="text">{{ t('trade.ai_position_timer') }}</div>
          </div>
          <Circle v-if="currItem.status == 'open'" start-position="right" stroke-linecap="round" stroke-width="142"
            layer-color="var(--ex-bg-white2)" :color="gradientColor" size="182" :rate="100"
            :current-rate="100 - rate" />
        </div>

        <div class="time_bg">
          <strong>{{ currItem.time }}</strong>
          <span class="unit">{{ _dateUnitMap[currItem.unit] }}</span>
        </div>

        <div class="time_tip">
          {{ currItem.time + _dateUnitMap[currItem.unit] }} {{ t('trade.ai_position_end_trade') }}
        </div>
      </div>

      <div class="win-animate" @click="showWin = false" v-show="showWin">
        <div class="win-animate-gold">
          <img :src="getStaticImgUrl('/static/img/trade/gold.svg')" @load="goldLoad = true" />
        </div>
        <div class="win-animate-text" v-if="goldLoad">
          <img :src="getStaticImgUrl('/static/img/trade/wintext.svg')" />
          <div class="win-animate-amount">
            {{ animateProfit }}
          </div>
        </div>
      </div>
      <div class="stock-info">
        <div class="stock-info__symbol">{{ currItem.name || "--" }}</div>
        <div class="stock-info__order_no">
          <span>{{ t('trade.ai_position_order_id') }} {{ currItem.order_no || "--" }}</span>
          <div class="stock-info__copy_icon" @click="copy(currItem.order_no)">
            <img :src="getStaticImgUrl('/static/img/common/copy.svg')" alt="copy" />
          </div>
        </div>

        <div class="info_boxs">
          <div class="info_box">
            <div>{{ t('trade.ai_opening_time_zone') }}</div>
            <div class="amount">{{ currItem.time }}{{ currItem.unit }}</div>
          </div>
          <div class="info_box info_box--line">
            <div>{{ t('trade.ai_opening_network_amount') }}</div>
            <div class="amount">
              {{ currItem.lever }}
            </div>
          </div>
          <div class="info_box">
            <div>{{ t('trade.ai_opening_invest_amount') }}(USDT)</div>
            <div class="amount">
              {{ currItem.amount }}
            </div>
          </div>
          <div class="info_box info_box--line">
            <div>{{ t('trade.ai_opening_predict_profit') }}(USDT)</div>
            <div class="amount">
              {{ currItem.amountreturn }}
            </div>
          </div>
        </div>
      </div>

    </div>
  </Popup>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Button, Popup, Circle, showToast, Loading } from "vant";
import { _copyTxt } from "@/utils/index";
import { ref, computed, onBeforeUnmount } from "vue";
import { _aiget } from "@/api/api";
import { formatSec2 } from "@/utils/time";
import Decimal from "decimal.js";
import { _dateUnitMap } from "@/utils/dataMap";
import Top from "@/components/Top.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emits = defineEmits(["back"]);

const rate = computed(() => {
  let t = currItem.value.time || 1;
  if (currItem.value.unit == "m") {
    t *= 60;
  }
  if (currItem.value.unit == "h") {
    t *= 3600;
  }
  if (currItem.value.unit == "d") {
    t *= 3600 * 24;
  }
  const p = (currItem.value.endtime * 100) / t;
  return p > 100 ? 100 : p;
});

const animateProfit = ref(0);

const goldLoad = ref(false);

const incrementCounter = (targetNumber, duration = 1200) => {
  if (!goldLoad.value) {
    setTimeout(() => {
      incrementCounter(targetNumber, duration);
    }, 300);
    return;
  }
  const startTime = Date.now();
  const startNumber = 0;
  const incrementAmount = (targetNumber - startNumber) / duration; // 计算每毫秒递增的量

  const intervalId = setInterval(() => {
    const elapsed = Date.now() - startTime;
    let currentNumber = startNumber + incrementAmount * elapsed;

    if (elapsed >= duration) {
      currentNumber = targetNumber;
      clearInterval(intervalId);
    }
    animateProfit.value = currentNumber.toFixed(2);
  }, 10); // 每10毫秒更新一次，可以根据需要调整
};

//  复制
const copy = (text) => {
  _copyTxt(text);
  showToast(t('trade.order_info_copy'));
};

const backFunc = () => {
  showModel.value = false;
};

const gradientColor = {
  "0%": "var(--ex-primary-color)",
  "100%": "var(--ex-primary-bg)",
};

const showWin = ref(false);

const showModel = ref(false);
const currItem = ref({});
const open = (item) => {
  currItem.value = item;

  getInfo();
  showModel.value = true;
  if (timeout) clearInterval(timeout);
};

// 获取详情
let timeout = null;
const loading = ref(true);
const getInfo = () => {
  loading.value = true;
  _aiget({
    order_no: currItem.value.order_no,
  })
    .then((res) => {
      if (res.data) {
        if (res.data.profit > 0 && res.data.status == "close") {
          animateProfit.value = 0;
          // showWin.value = true
          incrementCounter(res.data.profit);
        }

        currItem.value = res.data;
        if (currItem.value.endtime) {
          // 开始倒计时
          if (timeout) clearInterval(timeout);
          timeout = setInterval(() => {
            currItem.value.endtime--;
            if (currItem.value.endtime <= 0) {
              clearInterval(timeout);

              loading.value = true;
              setTimeout(() => {
                getInfo();
              }, 1000);
            }
          }, 1000);
        }
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const getRange = () => {
  // 获取预计盈亏
  if (!currItem.value.amountreturn) return "--";
  if (!currItem.value.amount) return "--";
  const rangereturn = currItem.value.amountreturn;
  let rs = "--";
  try {
    const arr = rangereturn.split(" - ");
    const start = new Decimal(currItem.value.amount)
      .mul(Number(arr[0]))
      .div(100);
    const end = new Decimal(currItem.value.amount).mul(Number(arr[1])).div(100);
    rs = `${start} - ${end}`;
  } catch { }

  return rs;
};
function formatSec22(t, seconds) {
  if (seconds < 0) return "--";
  if (seconds <= 3600) return formatSec2(seconds)
  const days = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  return `${days}${t('common.day')} ${hours}${t('common.hour')} ${minutes}${t('common.min')}`;
}
onBeforeUnmount(() => {
  timeout && clearInterval(timeout);
});
defineExpose({
  open,
});
</script>

<style lang="less" scoped>
.aiinfo-popup {
  :deep(.top) {
    background-color: var(--ex-none);
  }
}

.ai_order_info {
  padding: 0.32rem 0 1rem 0;
  margin-top: 1.12rem;
  height: calc(100vh - 1.12rem);
  overflow-y: auto;
  box-sizing: border-box;

  .title {
    font-size: 0.32rem;
    line-height: 0.6rem;
    text-align: center;
    margin-bottom: 0.2rem;
  }

  .win {
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 3rem;
    padding-top: 0.58rem;
    box-sizing: border-box;

    .win_bg {
      width: 100%;
      height: auto;
      position: absolute;
      left: 0;
      top: 0;
    }

    .loss_bg {
      width: 2;
      height: 2rem;
      background-color: rgba(220, 89, 89, 0.50);
      filter: blur(2rem);
      top: 2rem;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0.4;
    }

    .win_name {
      color: var(--ex-text-color);
      text-align: center;
      font-size: 0.3rem;
      font-weight: 400;
      line-height: 100%;
      position: relative;
      z-index: 1;
      animation: opacityanimate 0.5s;
    }

    .amount {
      font-size: 0.6rem;
      font-weight: 600;
      line-height: 100%;
      margin-top: 0.32rem;
      position: relative;
      z-index: 1;
      animation: opacityanimate 0.5s;
    }
  }

  .win-box {
    box-sizing: border-box;
    border-radius: 0.32rem;
    padding: 0.52rem;
    background: var(--ex-bg-color);
    height: 6.88rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 0 0.32rem;
  }

  .circle-wrap {
    width: 182px;
    position: relative;
  }

  .circle-mid {
    width: 136px;
    height: 136px;
    border-radius: 50%;
    position: absolute;
    left: 23px;
    top: 23px;
    border-radius: 50%;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .time {
      color: var(--ex-primary-color);
      text-align: center;
      font-family: "SF Pro Display";
      font-size: 0.42rem;
      font-style: normal;
      font-weight: 800;
      line-height: 0.6rem;
    }

    .text {
      color: var(--ex-text-color3);
      text-align: center;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.32rem;
      margin-top: 0.1rem;
    }
  }

  .name {
    font-weight: 600;
    color: var(--ex-text-color);
    font-size: 0.32rem;
    margin: 0 0 0.2rem 0;
  }

  .time_bg {
    width: 3.42rem;
    height: 1.2rem;
    border-radius: 1rem;
    background: var(--ex-primary-color);
    color: var(--ex-text-color--bg-primary);
    font-weight: 600;
    font-size: 0.3rem;
    justify-content: center;
    display: flex;
    margin-top: 0.4rem;
    align-items: center;

    strong {
      font-size: 0.6rem;
      margin-right: 0.1rem;
    }

    .unit {
      position: relative;
      top: 0.1rem;
    }
  }

  .time_tip {
    color: var(--ex-text-color3);
    text-align: center;
    font-size: 0.28rem;
    font-weight: 400;
    line-height: 100%;
    height: 0.28rem;
    margin-top: 0.2rem;
  }
}

.stock-info {
  background-color: var(--ex-bg-color3);
  border-radius: 0.32rem;
  margin: 0.4rem 0.32rem 0 0.32rem;
  padding: 0.32rem 0.1rem 0.12rem 0.12rem;

  &__symbol {
    font-size: 0.3rem;
    font-weight: 600;
    line-height: 0.36rem;
    padding-left: 0.22rem;
  }

  &__order_no {
    display: flex;
    align-items: center;
    color: var(--ex-text-color3);
    margin-top: 0.12rem;
    padding-left: 0.22rem;

    span {
      font-size: 0.28rem;
    }
  }

  &__copy_icon {
    width: 0.24rem;
    height: 0.24rem;
    margin-left: 0.12rem;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.loading-wrap {
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.info_boxs {
  padding: 0.3rem 0.28rem;
  position: relative;
  margin-top: 0.2rem;
  border-radius: 0.32rem;
  background-color: var(--ex-bg-color);

  z-index: 1;

  &::after {
    content: "";
    display: block;
    clear: both;
  }

  .info_box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--ex-text-color3);
    font-size: 0.28rem;
    line-height: 0.44rem;
    position: relative;

    .amount {
      line-height: 0.44rem;
      margin-top: 0.4rem;
      color: var(--ex-text-color);
      font-size: 0.3rem;
    }
  }
}

.win-animate-bg {
  position: absolute;
  left: 100%;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: var(--ex-bg-color);
  animation: bganimate 1.4s;
}

@keyframes bganimate {
  0% {
    left: 0;
  }

  100% {
    left: 100%;
  }
}

@keyframes opacityanimate {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.split-line {
  clear: both;
  height: 0.62rem;
  position: relative;
  margin: 0 0.42rem;

  &::after {
    content: "";
    width: 100%;
    position: absolute;
    left: 0;
    top: 50%;
    height: 1px;
    background-color: var(--ex-bg-color3);
  }
}

.win-animate {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  box-sizing: border-box;
  z-index: 10000;
  background-color: rgba(0, 0, 0, 0.6);
}

.win-animate-gold {
  left: 0;
  z-index: 1;

  img {
    width: 100%;
    height: auto;
  }
}

.win-animate-text {
  height: 0.6rem;
  position: absolute;
  top: 6.6rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  left: 0;
  transform: scale(1);
  animation: scaleanimate 0.6s;

  img {
    height: 100%;
  }
}

@keyframes scaleanimate {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

.win-animate-amount {
  color: var(--ex-white);
  text-align: center;
  font-family: "Alibaba PuHuiTi 3.0";
  font-size: 0.8rem;
  font-style: normal;
  font-weight: 1000;
  line-height: 0.44rem;
  /* 55% */
  margin-top: 0.4rem;
}
</style>
