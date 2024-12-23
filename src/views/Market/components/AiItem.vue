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
        <div class="time-title">{{ t("trade.ai_opening_perform_time") }}</div>
        <div class="time">
          <!-- {{ formatSec(item.runtime) }} -->
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
          <div class="ml-title">{{ t("trade.order_info_profit") }}(USDT)</div>
          <div class="ml-val" :class="[item.income > 0 ? 'up' : 'down']">
            {{ item.income }}
          </div>
        </div>
        <div class="mr">
          <SparkLine v-if="item.points" :polyline-stroke-width="2" :points="item.points" :ratio="item.ratio" :xtimes="2"
            :ytimes="2" />
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
// import { formatSec } from "@/utils/time";
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
  border: 1px solid #eff3f8;
  background: #fff;
  margin-bottom: 0.2rem;

  &:hover {
    box-shadow: 0px 0.08rem 0.2rem 0px rgba(6, 16, 35, 0.1);
  }

  .top {
    padding: 0.24rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .tl {
      .name {
        color: #061023;
        font-size: 0.36rem;
        font-weight: 600;
        line-height: 140%;
      }

      .info {
        display: flex;
        align-items: center;

        .pp {
          display: flex;
          align-items: center;
          margin-right: 0.24rem;
          padding:0 0.08rem;
          height: 0.36rem;
          border-radius: 0.04rem;
          background: rgba(248, 154, 41, 0.08);
          color: #f89a29;
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
          color: #8f8f8f;
          font-size: 0.24rem;
          font-weight: 400;
          line-height: 140%;
        }
      }
    }

    .tr {
      .time-title {
        color: #8f92a1;
        text-align: right;
        font-size: 0.24rem;
        font-weight: 400;
        line-height: 0.44rem;
      }

      .time {
        color: #061023;
        text-align: right;
        font-size: 0.28rem;
        font-weight: 400;
        line-height: 0.44rem;
      }
    }
  }

  .content {
    border-radius: 0.32rem;
    border: 1px solid #eff3f8;
    background: linear-gradient(180deg, #f5f7fc 0%, #fff 100%);
    padding: 0.24rem;
  }

  .mid {
    display: flex;
    align-items: center;
    margin-bottom: 0.24rem;
    padding-bottom: 0.24rem;
    border-bottom: 1px dashed #eff3f8;
    justify-content: space-between;

    .ml {
      .ml-title {
        color: #666d80;
        font-size: 0.28rem;
        font-weight: 400;
        line-height: 0.28rem;
        margin-bottom: 0.2rem;
      }

      .ml-val {
        color: #e8503a;
        font-size: 0.4rem;
        font-weight: 600;
        line-height: 0.4rem;
      }
    }

    .mr {
      width: 2.5rem;
      height: 1rem;
      margin-top:-0.06rem;
    }
  }

  .bot {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .bot-line {
      height: 0.68rem;
      width: 1px;
      background-color: #eff3f8;
    }

    .bot-item {
      flex: 1;
      text-align: center;

      .bot-title {
        color: #8f92a1;
        font-size: 0.22rem;
        font-weight: 400;
        line-height: 0.22rem;
        margin-bottom: 0.16rem;
      }

      .bot-val {
        color: #061023;
        font-size: 0.28rem;
        font-weight: 600;
        line-height: 0.28rem;
      }
    }
  }
}
</style>
