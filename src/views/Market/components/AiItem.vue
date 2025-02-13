<!-- ai交易元素 -->
<template>
  <div class="ai_item " @click="clickItem">
    <div class="top">
      <div class="tl">
        <div class="name">{{ item.name }}</div>
        <div class="info">
          <div class="pp">
            <div class="pp-icon">
              <img v-lazy="getStaticImgUrl('/static/img/market/pp.svg')" alt="^" />
            </div>
            <span>{{ item.numpeople || "--" }}</span>
          </div>
          <div class="grid">
            {{ t("trade.ai_opening_bigest_network") }} {{ item.maxgrid }}
          </div>
        </div>
      </div>
      <div class="tr" style="text-align: right;font-size: 0.24rem;">
        <div class="time-title f" style="color: var(--ex-placeholder-color);">{{ t("trade.ai_opening_perform_time") }}</div>
          <div class="time">
            {{
              formatSec(item.runtime)[0] +
              t("common.day") +
              " " +
              formatSec(item.runtime)[1] +
              t("common.hour") +
              " " +
              formatSec(item.runtime)[2] +
              t("common.min")
            }}
          </div>
      </div>
    </div>
    <div class="content">
      <div class="mid">
        <div class="ml">
          <div class="text-[0.28rem] text-color2 mb-[0.2rem]">{{ t("trade.order_info_profit") }}(USDT)</div>
          <div class="text-[0.4rem] font-semibold" :class="[item.income > 0 ? 'up' : 'down']">
            {{ item.income }}
          </div>
        </div>
        <div class="mr">
          <SparkLine :style="['width: 100%; height: 0.6rem;']" v-if="props.item.points" :points="props.item.points"
          :ratio="props.item.ratio" />
        </div>
      </div>
      <div class="bot">
        <div class="bot-item">
          <div class="bot-title">
            {{ t("trade.ai_opening_historical_profit_rate") }}
          </div>
          <div class="bot-val">{{ item.ratereturn }}</div>
        </div>
        <div class="bot-line"></div>
        <div class="bot-item">
          <div class="bot-title">
            {{ t("trade.ai_opening_24_profit_rate") }}
          </div>
          <div class="bot-val">{{ item.ratereturn24h }}</div>
        </div>
        <div class="bot-line"></div>
        <div class="bot-item">
          <div class="bot-title">
            {{ t("trade.ai_opening_min_invest_amount") }}
          </div>
          <div class="bot-val">{{ item.minamount }}</div>
        </div>
      </div>
    </div>

    <!-- <div class="ripple-btn submit">{{ t('trade.ai_opening_trade') }}</div> -->

     <!-- 交易弹窗 -->
     <Popup class="trade-popup" teleport="body" v-model:show="showDialog" :title="''" position="bottom" close-on-popstate  >
      <div style="padding: 1.14rem 0.32rem 0 0.32rem">
        <div class="trade-popup-title">
          <div class="back" @click="showDialog = false">
            <Icon name="arrow-left" />
          </div>
          <div class="title">{{ props.item.name }}</div>
          <div style="width: 0.6rem;height: 0.6rem;"></div>
        </div>
        <Opening ref="openingRef" @success="showDialog = false" />
      </div>
    </Popup>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import router from "@/router";
import store from "@/store";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { Popup, Icon } from "vant"
import Opening from "@/views/Trade2/ai/Opening.vue"
import SparkLine from "@/components/SparkLine.vue";


const { t } = useI18n();
const emits = defineEmits("click", 'clickItems');
const openingRef = ref()

const route = useRoute();
const props = defineProps({
  item: {
    type: Object,
    default: () => { },
  },
  page: {
    type: String,
    default: "",
  },
  handleClick: {
    type: Function,
    default: null
  }
});


const showDialog = ref(false)
const clickItem = () => {
  if (props.handleClick) return props.handleClick(props.item, 'ai')
  // showDialog.value = true
  // setTimeout(() => {
  //   openingRef.value && openingRef.value.choose(props.item)
  // }, 300)
  goTrade()
}
const goTrade = () => {
  store.commit("setCurrAi", props.item);
  router.push({
    name: "tradeInfo",
    query: {
      // to: "ai",
      // name: props.item.name,
      symbol: props.item.symbol,
      type: 'ai',
      tradeType: 'ai'
    },
  });
  if (route.name == "trade") {
    emits("clickItems", props.item);
  }
};

const formatSec = (seconds, t) => {
  if (seconds < 0) return "--";
  const days = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  return [days, hours, minutes];
};
</script>

<style lang="less">
.trade-popup {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: 0;
    .trade-popup-title {
      width: 100%;
      top: 0.18rem;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .back {
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        background-color: var(--ex-bg-white);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.32rem;
      }
      .title {
        text-align: center;
        font-size: 0.32rem;
        color: var(--ex-white);
      }
    }
  }
</style>

<style lang="less" scoped>
.ai_item {
  border-radius: 0.32rem;
  background: var(--ex-bg-color);
  border: 0.02rem solid var(--ex-border-color5);
  margin-bottom: 0.32rem;
  // padding: 0 0.12rem 0.12rem 0.12rem;
  position: relative;
  .submit {
    height: 0.72rem;
    width: 5.14rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--ex-primary-color);
    color: var(--ex-white);
    font-family: 0.3rem;
    position: absolute;
    bottom: -0.36rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .top {
    padding: 0.24rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .tl {
      .name {
        color: var(--ex-text-color);
        font-size: 0.36rem;
        font-weight: 600;
        line-height: 0.5rem;
      }

      .info {
        display: flex;
        align-items: center;
        margin-top: 0.1rem;

        .pp {
          display: flex;
          align-items: center;
          margin-right: 0.24rem;
          padding: 0 0.08rem;
          height: 0.36rem;
          border-radius: 0.08rem;
          background: rgba(255, 163, 70, 0.10);
          color: #FFA346;
          font-size: 0.2rem;
          font-weight: 400;
          display: flex;
          align-items: center;

          .pp-icon {
            width: 0.2rem;
            height: 0.2rem;
            margin-right: 0.04rem;
          }
        }

        .grid {
          color: var(--ex-text-color3);
          font-size: 0.24rem;
        }
      }
    }

  }

  .content {
    border-radius: 0.32rem;
    background: var(--ex-bg-color2);
    border: 0.02rem solid var(--ex-border-color5);
  }

  .mid {
    display: flex;
    align-items: center;
    padding: 0.28rem;
    border-bottom: 1px dashed var(--ex-border-color);
    justify-content: space-between;

    .ml {
      .ml-title {
        color: var(--ex-text-color);
        font-size: 0.24rem;
        font-weight: 400;
        line-height: 0.28rem;
        margin-bottom: 0.2rem;
      }

      .ml-val {
        color: var(--ex-error-color);
        font-size: 0.32rem;
        font-weight: 600;
        line-height: 0.4rem;
      }
    }

    .mr {
      width: 2.5rem;

      .time-title {
        color: var(--ex-text-color3);
        text-align: right;
        font-size: 0.24rem !important;
        font-weight: 400;
        line-height: 0.44rem;
      }

      .time {
        color: var(--ex-text-color);
        text-align: right;
        font-size: 0.28rem !important;
        font-weight: 400;
        line-height: 0.44rem;
      }

    }
   

    
  }
  .time-title {
    color: var(--ex-text-color3);
    text-align: right;
    font-size: 0.24rem !important;
    font-weight: 400;
    line-height: 0.44rem;
  }

  .time {
    color: var(--ex-text-color);
    text-align: right;
    font-size: 0.28rem !important;
    font-weight: 400;
    line-height: 0.44rem;
  }

  .bot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.32rem 0;

    .bot-line {
      height: 0.9rem;
      width: 1px;
      background-color: var(--ex-bg-color3);
    }

    .bot-item {
      flex: 1;
      text-align: center;

      .bot-title {
        color: var(--ex-text-color3);
        font-size: 0.22rem;
        font-weight: 400;
        line-height: 0.22rem;
        margin-bottom: 0.16rem;
      }

      .bot-val {
        color: var(--ex-text-color);
        font-size: 0.28rem;
        font-weight: 600;
        line-height: 0.4rem;
      }
    }
  }
}
</style>
