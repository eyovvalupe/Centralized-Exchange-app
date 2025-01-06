<!-- ai交易元素 -->
<template>
  <div class="ai_item" @click="clickItem">
    <div class="top">
      <div class="tl">
        <div class="name">{{ item.name }}</div>
        <div class="info">
          <div class="pp">
            <div class="pp-icon">
              <img :src="getStaticImgUrl('/static/img/market/pp.svg')" alt="^" />
            </div>
            <span>{{ item.numpeople || "--" }}</span>
          </div>
          <div class="grid">
            {{ t("trade.ai_opening_bigest_network") }} {{ item.maxgrid }}
          </div>
        </div>
      </div>
      <div class="tr">
        <div
          class="px-[0.24rem] text-center min-w-[1.4rem] h-[0.72rem] leading-[0.72rem] text-[0.3rem] text-black bg-white rounded-[0.6rem] font-[600]">
          {{ t('trade.ai_opening_trade') }}</div>
      </div>
    </div>
    <div class="content">
      <div class="mid">
        <div class="ml">
          <div class="ml-title">{{ t("trade.order_info_profit") }}(USDT)</div>
          <div class="ml-val" :class="[item.income > 0 ? 'up' : 'down']">
            {{ item.income }}
          </div>
        </div>
        <div class="mr">
          <div class="time-title">{{ t("trade.ai_opening_perform_time") }}</div>
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
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import router from "@/router";
import SparkLine from "@/components/SparkLine.vue";
import store from "@/store";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emits = defineEmits("click", 'clickItems');

const getRealtime = (symbol, k) => {
  for (let i = 0; i < store.state.realtimeData.length; i++) {
    if (store.state.realtimeData[i].symbol == symbol) {
      return store.state.realtimeData[i][k]
    }
  }
  return ''
}
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
});

const clickItem = () => {
  // props.page == 'home' ? goTrade() : null
  goTrade()
}
const goTrade = () => {
  store.commit("setCurrAi", props.item);
  router.push({
    name: "trade",
    query: {
      to: "ai",
      name: props.item.name,
      symbol: props.item.symbol,
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

<style lang="less" scoped>
.ai_item {
  border-radius: 0.32rem;
  background: var(--ex-bg-white2);
  margin-bottom: 0.2rem;
  padding: 0 0.12rem 0.12rem 0.12rem;

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
    background: var(--ex-bg-color7);
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
        font-size: 0.4rem;
        font-weight: 600;
        line-height: 0.4rem;
      }
    }

    .mr {
      width: 2.5rem;

      .time-title {
        color: var(--ex-text-color3);
        text-align: right;
        font-size: 0.24rem;
        font-weight: 400;
        line-height: 0.44rem;
      }

      .time {
        color: var(--ex-text-color);
        text-align: right;
        font-size: 0.28rem;
        font-weight: 400;
        line-height: 0.44rem;
      }

    }
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
        font-size: 0.3rem;
        font-weight: 600;
        line-height: 0.4rem;
      }
    }
  }
}
</style>
